-- Solward Market — MVP schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists profiles (
  wallet      text primary key,
  handle      text,
  rep         integer not null default 0,
  earned      numeric not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists bounties (
  id            uuid primary key default gen_random_uuid(),
  project       text not null,
  title         text not null,
  description   text not null,
  category      text not null,
  amount        numeric not null,
  currency      text not null default 'USDC',
  rep_req       integer not null default 0,
  rep_reward    integer not null default 0,
  creator_wallet text not null,
  status        text not null default 'open',   -- open | in_review | settled | cancelled
  escrow_pda    text,                           -- filled once on-chain escrow exists
  created_at    timestamptz not null default now()
);

create table if not exists applications (
  id                uuid primary key default gen_random_uuid(),
  bounty_id         uuid not null references bounties(id) on delete cascade,
  applicant_wallet  text not null,
  status            text not null default 'applied', -- applied | submitted | verifying | settled | rejected
  github_pr         text,
  created_at        timestamptz not null default now(),
  unique (bounty_id, applicant_wallet)
);

create index if not exists idx_bounties_status on bounties(status);
create index if not exists idx_apps_wallet on applications(applicant_wallet);

-- Row Level Security.
-- NOTE (MVP): these policies allow public read + insert so the app works with the
-- anon key alone. This is NOT secure — anyone can spoof `creator_wallet` /
-- `applicant_wallet`. Phase 1.5 replaces this with wallet-signature auth
-- (sign a nonce, verify server-side) before any real funds are involved.
alter table profiles     enable row level security;
alter table bounties     enable row level security;
alter table applications enable row level security;

create policy "public read profiles"     on profiles     for select using (true);
create policy "public upsert profiles"    on profiles     for insert with check (true);
create policy "public update profiles"    on profiles     for update using (true);

create policy "public read bounties"      on bounties     for select using (true);
create policy "public insert bounties"    on bounties     for insert with check (true);

create policy "public read applications"  on applications for select using (true);
create policy "public insert applications" on applications for insert with check (true);
