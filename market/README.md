# Solward Market — MVP

The real Contribution Market: connect a Solana wallet, post bounties, apply — all persisted in a database (no more resetting on refresh). On-chain USDC escrow and the GitHub oracle are wired in as the next phases (see [`../ARCHITECTURE.md`](../ARCHITECTURE.md)).

> ⚠️ This is an early scaffold. It has **not** been run/verified yet (it needs Node.js + a Supabase project). Treat it as the foundation to build on.

## Stack

- **Next.js 14** (App Router, TypeScript) — frontend + API routes in one app
- **@solana/wallet-adapter** — Phantom / Solflare connect
- **Supabase** (Postgres) — persistent bounties, applications, profiles
- **GitHub oracle** (`app/api/verify`) — confirms a PR is merged

## Setup

1. **Install Node.js 18+** (https://nodejs.org) if you don't have it.

2. **Create a Supabase project** at https://supabase.com → copy the Project URL and the `anon` public key (Settings → API).

3. **Apply the schema:** Supabase Dashboard → SQL Editor → paste [`supabase/schema.sql`](supabase/schema.sql) → Run.

4. **Configure env:**
   ```bash
   cd market
   cp .env.example .env
   # fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```

5. **Install & run:**
   ```bash
   npm install
   npm run dev        # http://localhost:3000
   ```

## Try it

- Connect a wallet (set Phantom to **Devnet**).
- **Post a bounty** — it's saved to Supabase and shows up for everyone.
- Apply to a bounty from another wallet.

## What's real vs. next

| Piece | Status |
|-------|--------|
| Wallet connect | ✅ real |
| Persistent bounties/applications | ✅ real (Supabase) |
| GitHub PR verification | ✅ endpoint ready (`/api/verify`) |
| On-chain USDC escrow | 🔜 program written in [`../escrow`](../escrow), needs deploy + client wiring |
| Wallet-signature auth (anti-spoof) | 🔜 phase 1.5 |
| On-chain attestations / reputation | 🔜 phase 3 |

See [`../ARCHITECTURE.md`](../ARCHITECTURE.md) for the full plan.
