<div align="center">

# Solward

### The reputation and rewards layer for the Solana builder economy

Turn real contributions to Solana projects — code, content, design, community, and capital — into verifiable on-chain reputation that earns rewards.

[**Website**](https://solward.xyz) · [**Lite Paper**](docs/litepaper.md) · [**EasyA Kickstart**](https://kickstart.easya.io/)

![status](https://img.shields.io/badge/status-Phase%200%20·%20Proof-0FA968) ![chain](https://img.shields.io/badge/chain-Solana-16C97D) ![license](https://img.shields.io/badge/license-MIT-0A7D4E)

</div>

---

## The one-line pitch

On Solana, transactions settle in 400ms. **Contributions still settle in trust.** Solward builds the missing primitive: a permissionless, on-chain **proof-of-contribution** standard, plus the marketplace and reward rails on top of it.

## The problem

Solana crossed **10,000+ active developers** and became the #1 chain for builders. Launchpads like **EasyA Kickstart** let anyone go from an idea to a live, tradable token in minutes. But the people who actually make these projects succeed are invisible and unrewarded:

- **Contributors have no portable proof of work.** Reputation lives in scattered Discord roles and screenshots.
- **Projects can't find or trust contributors.** No reliable way to find vetted talent, prove the work, or pay for outcomes.
- **Rewards are arbitrary.** Airdrops reward wallets, not work. Bounties get gamed. Grant committees move slowly.
- **The launchpad era made it worse.** Launching is frictionless; mobilizing and rewarding talent is not.

## What Solward is

Three layers that build on each other:

| Layer | Name | What it does |
|-------|------|--------------|
| **1** | Proof of Contribution | An open standard for soulbound, oracle-verified attestations → a portable, composable reputation graph any app can read. |
| **2** | The Contribution Market | Outcome-based bounties escrowed in USDC/token. Work, reputation, and payment settle in one transaction. |
| **3** | Reputation Rewards | Retroactive reward rounds scored objectively by the graph. Public profiles unlock gated bounties and cross-project weight. |

Read the full concept in the [**Lite Paper**](docs/litepaper.md).

## Why it fits Solana — and Kickstart — specifically

- **The launchpad needs a labor layer.** Kickstart makes ideas fundable with capital; Solward makes them fundable with talent.
- **Composable, not a walled garden.** The reputation graph is open on-chain data any Solana app can read.
- **Only viable at Solana speed & cost.** Sub-cent fees and sub-second finality make micro-attestations and micro-rewards economical.
- **Rides the institutional wave.** As Mastercard, Worldpay, and Western Union build on the Solana Developer Platform, verifiable contributor reputation becomes infrastructure they need too.

---

## Repository structure

```
solward/
├── public/
│   └── index.html          # Landing page (single-file, no build step)
├── docs/
│   └── litepaper.md         # Full project concept & lite paper
├── .github/
│   └── workflows/
│       └── deploy.yml        # Auto-deploy to GitHub Pages
├── README.md
├── LICENSE
└── .gitignore
```

## Run locally

The landing page is a single, dependency-free HTML file. No build step required.

```bash
# clone
git clone https://github.com/<your-username>/solward.git
cd solward

# open directly
open public/index.html        # macOS
# or serve it
npx serve public              # then visit http://localhost:3000
python3 -m http.server -d public 8080   # alternative
```

## Deploy

### GitHub Pages (included workflow)

This repo ships with a workflow that publishes `public/` to GitHub Pages on every push to `main`.

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`. Your site goes live at `https://<your-username>.github.io/solward/`.

### Custom domain (solward.xyz)

1. In **Settings → Pages → Custom domain**, enter `solward.xyz`.
2. At your domain registrar, add a `CNAME` record pointing to `<your-username>.github.io`, or four `A` records to GitHub's Pages IPs.
3. A `public/CNAME` file is included with `solward.xyz` — update it if your domain differs.

### Vercel / Netlify

Point the project root to `public/` (output directory). No build command needed.

---

## Roadmap

- **Phase 0 — Proof** *(now)* · Concept, brand, community, devnet demo of the attestation standard.
- **Phase 1 — The Market** · Mainnet bounties with USDC escrow + GitHub/content oracles. Onboard 25 launchpad-stage projects.
- **Phase 2 — The Graph** · Open reputation graph as public on-chain data with a read API + SDK.
- **Phase 3 — Reward Rounds** · First retroactive round with an ecosystem partner. Fair-launch `$WARD`.
- **Phase 4 — The Standard** · Default contribution & reputation layer across launchpads, grants, and DAOs.

## The $WARD token

`$WARD` coordinates the three-sided market: **stake to attest** (slashable), **reward rounds**, **governance**, and **access**. Fair launch, builder-aligned — no presale, with an allocation reserved to reward contributors retroactively.

> **Disclaimer.** Solward is a coordination and reputation protocol. `$WARD` is a utility and governance token — not an investment, equity, security, or a claim on revenue, ownership, or profit. There should be no expectation of return or appreciation. Participation is highly speculative and many early-stage ideas go nowhere. Nothing here is financial advice. Do your own research.

## Contributing

Solward is open by design — fittingly, contributions are welcome. See [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR.

## License

[MIT](LICENSE) © 2026 Solward

<div align="center">

**Build the chain. Own your record.**

[solward.xyz](https://solward.xyz)

</div>
