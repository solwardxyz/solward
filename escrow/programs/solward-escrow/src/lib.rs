use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Mint, Token, TokenAccount, Transfer};

// Run `anchor keys sync` after first build to replace this with the real program id.
declare_id!("Es1111111111111111111111111111111111111111");

#[program]
pub mod solward_escrow {
    use super::*;

    /// A project funds a bounty: `amount` of an SPL token (e.g. USDC) is moved
    /// from the creator into a program-owned vault and locked until settlement.
    /// `verifier` is the pubkey allowed to release funds — in production this is
    /// the Solward oracle key that only signs after work is verified on-chain-adjacent
    /// (e.g. a merged GitHub PR).
    pub fn create_bounty(
        ctx: Context<CreateBounty>,
        bounty_id: [u8; 16],
        amount: u64,
        verifier: Pubkey,
    ) -> Result<()> {
        require!(amount > 0, EscrowError::ZeroAmount);

        let b = &mut ctx.accounts.bounty;
        b.creator = ctx.accounts.creator.key();
        b.verifier = verifier;
        b.mint = ctx.accounts.mint.key();
        b.amount = amount;
        b.bounty_id = bounty_id;
        b.status = BountyStatus::Open as u8;
        b.bump = ctx.bumps.bounty;
        b.vault_bump = ctx.bumps.vault;

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.creator_ata.to_account_info(),
                    to: ctx.accounts.vault.to_account_info(),
                    authority: ctx.accounts.creator.to_account_info(),
                },
            ),
            amount,
        )?;

        emit!(BountyFunded { bounty: b.key(), amount });
        Ok(())
    }

    /// The verifier releases escrow to the contributor who delivered the work.
    /// Only the stored `verifier` may sign. Vault is drained and closed; rent
    /// returns to the creator.
    pub fn settle(ctx: Context<Settle>) -> Result<()> {
        let b = &ctx.accounts.bounty;
        require!(b.status == BountyStatus::Open as u8, EscrowError::NotOpen);

        let creator = b.creator;
        let bounty_id = b.bounty_id;
        let seeds: &[&[u8]] = &[b"bounty", creator.as_ref(), &bounty_id, &[b.bump]];
        let signer: &[&[&[u8]]] = &[seeds];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.contributor_ata.to_account_info(),
                    authority: ctx.accounts.bounty.to_account_info(),
                },
                signer,
            ),
            b.amount,
        )?;

        token::close_account(CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            CloseAccount {
                account: ctx.accounts.vault.to_account_info(),
                destination: ctx.accounts.creator_wallet.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(),
            },
            signer,
        ))?;

        let b = &mut ctx.accounts.bounty;
        b.status = BountyStatus::Settled as u8;
        b.contributor = ctx.accounts.contributor_ata.owner;

        emit!(BountySettled {
            bounty: b.key(),
            contributor: b.contributor,
            amount: b.amount,
        });
        Ok(())
    }

    /// The creator reclaims funds for a bounty that was never settled.
    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        let b = &ctx.accounts.bounty;
        require!(b.status == BountyStatus::Open as u8, EscrowError::NotOpen);

        let creator = b.creator;
        let bounty_id = b.bounty_id;
        let seeds: &[&[u8]] = &[b"bounty", creator.as_ref(), &bounty_id, &[b.bump]];
        let signer: &[&[&[u8]]] = &[seeds];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                Transfer {
                    from: ctx.accounts.vault.to_account_info(),
                    to: ctx.accounts.creator_ata.to_account_info(),
                    authority: ctx.accounts.bounty.to_account_info(),
                },
                signer,
            ),
            b.amount,
        )?;

        token::close_account(CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            CloseAccount {
                account: ctx.accounts.vault.to_account_info(),
                destination: ctx.accounts.creator.to_account_info(),
                authority: ctx.accounts.bounty.to_account_info(),
            },
            signer,
        ))?;

        ctx.accounts.bounty.status = BountyStatus::Cancelled as u8;
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(bounty_id: [u8; 16])]
pub struct CreateBounty<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        init,
        payer = creator,
        space = 8 + Bounty::LEN,
        seeds = [b"bounty", creator.key().as_ref(), &bounty_id],
        bump
    )]
    pub bounty: Account<'info, Bounty>,

    pub mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint = creator_ata.mint == mint.key() @ EscrowError::WrongMint,
        constraint = creator_ata.owner == creator.key() @ EscrowError::Unauthorized
    )]
    pub creator_ata: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = creator,
        seeds = [b"vault", bounty.key().as_ref()],
        bump,
        token::mint = mint,
        token::authority = bounty
    )]
    pub vault: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Settle<'info> {
    #[account(constraint = verifier.key() == bounty.verifier @ EscrowError::Unauthorized)]
    pub verifier: Signer<'info>,

    #[account(
        mut,
        seeds = [b"bounty", bounty.creator.as_ref(), &bounty.bounty_id],
        bump = bounty.bump
    )]
    pub bounty: Account<'info, Bounty>,

    #[account(
        mut,
        seeds = [b"vault", bounty.key().as_ref()],
        bump = bounty.vault_bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(mut, constraint = contributor_ata.mint == bounty.mint @ EscrowError::WrongMint)]
    pub contributor_ata: Account<'info, TokenAccount>,

    /// CHECK: rent destination on vault close; must be the original creator.
    #[account(mut, address = bounty.creator @ EscrowError::Unauthorized)]
    pub creator_wallet: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Cancel<'info> {
    #[account(mut, address = bounty.creator @ EscrowError::Unauthorized)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        seeds = [b"bounty", bounty.creator.as_ref(), &bounty.bounty_id],
        bump = bounty.bump
    )]
    pub bounty: Account<'info, Bounty>,

    #[account(
        mut,
        seeds = [b"vault", bounty.key().as_ref()],
        bump = bounty.vault_bump
    )]
    pub vault: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint = creator_ata.mint == bounty.mint @ EscrowError::WrongMint,
        constraint = creator_ata.owner == creator.key() @ EscrowError::Unauthorized
    )]
    pub creator_ata: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[account]
pub struct Bounty {
    pub creator: Pubkey,
    pub verifier: Pubkey,
    pub contributor: Pubkey,
    pub mint: Pubkey,
    pub amount: u64,
    pub bounty_id: [u8; 16],
    pub status: u8,
    pub bump: u8,
    pub vault_bump: u8,
}

impl Bounty {
    // 4 pubkeys (32*4) + u64 (8) + id (16) + 3 x u8 (3)
    pub const LEN: usize = 32 * 4 + 8 + 16 + 3;
}

#[repr(u8)]
pub enum BountyStatus {
    Open = 0,
    Settled = 1,
    Cancelled = 2,
}

#[event]
pub struct BountyFunded {
    pub bounty: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BountySettled {
    pub bounty: Pubkey,
    pub contributor: Pubkey,
    pub amount: u64,
}

#[error_code]
pub enum EscrowError {
    #[msg("Amount must be greater than zero")]
    ZeroAmount,
    #[msg("Bounty is not open")]
    NotOpen,
    #[msg("Token account mint does not match the bounty mint")]
    WrongMint,
    #[msg("Signer is not authorized for this action")]
    Unauthorized,
}
