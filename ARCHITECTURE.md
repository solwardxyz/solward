# Solward — from demo to real product

This document is the build plan for turning Solward from an interactive demo into a
working on-chain product. It is deliberately honest about what's hard.

## The pieces

```
┌────────────────────────────────────────────────────────────┐
│  market/  (Next.js)                                         │
│  • wallet connect (Phantom/Solflare)                       │
│  • bounty board + create + apply   ── Supabase (Postgres)  │
│  • /api/verify  ── GitHub oracle (PR merged?)             │
│                         │                                  │
│                         ▼ authorizes release              │
│  escrow/  (Anchor program on Solana)                      │
│  • create_bounty → locks USDC in a vault PDA             │
│  • settle → verifier releases USDC to the contributor    │
│  • cancel → creator reclaims                              │
└────────────────────────────────────────────────────────────┘
```

## Why this shape

The core promise is **"work and payment settle together, trustlessly."** That only
holds if funds sit in an on-chain escrow that releases on a *verifiable* condition —
not on a platform's say-so. So the two hard parts are the **escrow** (solved by the
Anchor program) and the **verification** (the oracle — the genuinely hard part).

We start with the one category that is objectively verifiable: **Engineering /
GitHub**. "Is this PR merged?" has a definitive answer via the GitHub API. Content,
design, and community are subjective and gameable — defer them until the primitive
and the community exist.

## Build order

### Phase 0 — Demo ✅ (done)
Landing page + interactive preview (`app/`). No persistence, no chain.

### Phase 1 — Persistent app ✅ (scaffolded in `market/`)
- Wallet connect.
- Bounties + applications persisted in Supabase.
- App stops resetting on refresh — it feels real.

### Phase 1.5 — Wallet-signature auth (do before real money)
The MVP schema trusts client-supplied wallet addresses (see the note in
`market/supabase/schema.sql`). Replace with: user signs a nonce → a server route
verifies the signature → issues a short-lived session. Only then can someone act
"as" a wallet. **Required before any funds are involved.**

### Phase 2 — On-chain escrow (program in `escrow/`)
1. Install Rust + Solana CLI + Anchor (`avm install 0.30.1`).
2. `cd escrow && anchor build && anchor keys sync && anchor deploy` (devnet).
3. Client wiring in `market/`:
   - `create_bounty` when a project posts (transfers devnet USDC into the vault).
   - Store the returned bounty PDA in `bounties.escrow_pda`.
   - `settle` is called with the **verifier** key after the oracle confirms the work.
4. Use a devnet USDC mint for testing.

### Phase 3 — Attestations + reputation
- On `settle`, mint a **soulbound** attestation to the contributor
  (Token-2022 non-transferable, or a PDA record program).
- Compute reputation from attestations (category, issuer weight).
- Expose a read API so other apps can consume the graph.

### Phase 4 — Mainnet + first projects
Move to mainnet-beta, real USDC, onboard the first ~25 launchpad-stage projects.

## The honest hard problems (don't skip)

- **Verification quality.** "PR merged" ≠ "valuable work." Add rules: PR must close a
  linked issue, be reviewed, target the bounty's repo. Expect to iterate a lot here.
- **Sybil / collusion.** Stop creators funding bounties to their own alt wallets to
  farm reputation. Ideas: staking + slashing, issuer-reputation weighting, rate limits,
  dispute windows.
- **Cold start.** A two-sided market is dead without both sides. Land 1 real project +
  5 real contributors first (Superteam, hackathons, EasyA). Concierge it manually.
- **Legal.** Holding user funds in escrow and issuing a token have real regulatory
  implications. Get advice before mainnet.

## Security checklist before mainnet
- [ ] Wallet-signature auth (phase 1.5) shipped
- [ ] Supabase RLS tightened (no public insert of arbitrary wallets)
- [ ] Escrow program audited; `verifier` key in an HSM / multisig, not an env var
- [ ] Oracle validates the PR belongs to the bounty's declared repo
- [ ] Rate limits + monitoring on the oracle route
