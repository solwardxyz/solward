# Solward

### The reputation and rewards layer for the Solana builder economy

**Lite Paper v1.0 — June 2026**
**solward.xyz**

---

## 1. The one-line pitch

Solward turns real contributions to Solana projects — code, content, design, community, and capital — into verifiable on-chain reputation that earns rewards. It is the missing settlement layer between the thousands of people who *build* the ecosystem and the projects that depend on them.

---

## 2. The problem

Solana crossed **10,000 unique active developers** in March 2026, becoming the #1 chain for builders. Around them, a much larger economy has formed: launchpads like **EasyA Kickstart** and pump.fun let anyone go from an idea to a live, tradable token in minutes. Superteam, hackathons, and accelerators turn strangers into collaborators every week.

But the people who actually make these projects succeed are invisible and unrewarded:

- **Contributors have no portable proof of work.** A developer who ships a critical PR, a designer who builds a brand, a writer whose thread drives a launch — none of it follows them. Their reputation lives in scattered Discord roles and screenshots.
- **Projects can't find or trust contributors.** A founder launching on Kickstart has an idea and a token, but no reliable way to find a vetted contributor, prove they did the work, or pay them fairly for outcomes rather than promises.
- **Rewards are arbitrary and opaque.** Airdrops reward wallets, not work. Bounties get gamed. Grant committees move slowly. The actual value created — the thread that went viral, the bug that got patched — is never priced.
- **The launchpad era made this worse.** When launching a token is frictionless, the bottleneck moves to *credibility and contribution*. Thousands of ideas launch; almost none have a way to mobilize and reward the talent that would make them real.

The result: a builder economy running on goodwill, screenshots, and trust-me-bro. That doesn't scale to the next 10 million Solana users.

---

## 3. The insight

> On Solana, transactions settle in 400ms. **Contributions still settle in trust.**

Every other coordination problem on Solana has been solved with a verifiable, composable primitive — payments, swaps, staking, lending, RWAs. Contribution and reputation have not. Solward builds that primitive: a permissionless, on-chain **proof-of-contribution** standard, plus the marketplace and reward rails on top of it.

---

## 4. What Solward is

Solward has three layers that build on each other.

### Layer 1 — Proof of Contribution (the protocol)

An open standard for attesting and verifying contributions on Solana.

- Contributions (a merged PR, a published article, a design delivery, a community milestone, a referral, a capital allocation) are recorded as **soulbound attestations** tied to a wallet.
- Attestations are issued by projects, peers, or automated verifiers (e.g. a GitHub oracle that confirms a merged PR, a CMS oracle that confirms a published post).
- Each attestation carries weight, category, and the issuer's own reputation — so a verification from a respected project counts for more than a self-claim.
- The result is a **portable, composable reputation graph**: open data any app on Solana can read, score, and build on.

### Layer 2 — The Contribution Market (the app)

A marketplace where projects post outcomes and contributors get paid for delivering them.

- Projects post **outcome-based bounties** ("ship X feature," "drive Y launch," "design our brand"), escrowed in USDC or the project's own token.
- Contributors apply with their **Solward reputation** as their resume — no LinkedIn, no cold DMs.
- On delivery, the work is verified, the attestation is minted, and escrow releases automatically. Reputation and payment settle in the same transaction.
- Native to the launchpad era: a project that just launched on EasyA Kickstart can fund a bounty pool directly from its token and let the community earn into it.

### Layer 3 — Reputation Rewards (the network effect)

Reputation that compounds into real, recurring upside.

- Projects, the Solana Foundation, and ecosystem funds can run **retroactive reward rounds** that pay the highest-impact contributors, scored objectively by the reputation graph instead of by a closed committee.
- Contributors build a **public Solward profile** — a verifiable track record that unlocks gated bounties, better rates, allowlist spots, and DAO voting weight across any project that reads the graph.
- The $WARD token aligns the three sides (projects, contributors, verifiers) and governs how reputation is weighted and disputes are resolved.

---

## 5. Why this fits Solana — and EasyA Kickstart — specifically

- **The launchpad needs a labor layer.** Kickstart makes ideas instantly tradable. The natural next question — *who builds the idea, and how do they get paid?* — is exactly what Solward answers. Solward makes every launch fundable with talent, not just capital.
- **It's composable, not a walled garden.** The reputation graph is open onchain data. Jupiter, Drift, Superteam, hackathon organizers, and any future app can read it. Solward grows the whole ecosystem rather than fencing off a corner of it.
- **It only works at Solana speed and cost.** Sub-cent fees and sub-second finality make it viable to attest thousands of micro-contributions and settle micro-rewards — economically impossible on slower, costlier chains.
- **It rides the institutional wave.** As Mastercard, Worldpay, and Western Union build on the Solana Developer Platform, verifiable contributor reputation becomes infrastructure those players need too: who can they trust to build, and how do they prove it?

---

## 6. How it works (a walkthrough)

**A founder, Maya, launches "TideFi" on EasyA Kickstart.**

1. The token goes live. Maya has momentum but no team. She opens Solward and funds three bounties from TideFi's treasury: a smart-contract audit fix, a launch-week content campaign, and a brand kit.
2. **Dev (Leo)** sees the audit bounty. His Solward profile already shows 14 verified PRs across three Solana projects, so he's auto-approved for the gated bounty. He ships the fix; the GitHub oracle confirms the merge; escrow releases USDC and mints a soulbound attestation to his wallet.
3. **Writer (Aria)** takes the content bounty. Her thread drives 40k impressions and 600 new holders, verified by an analytics oracle. She earns USDC + $WARD, and her reputation in the "Growth" category rises.
4. Two months later, the **Solana Foundation** runs a retroactive round rewarding top contributors to new launches. Because Leo's and Aria's work is on-chain and scored, they're paid automatically — no application, no committee.
5. Leo and Aria's profiles now carry verifiable proof. The next founder finds them instantly. The flywheel turns.

---

## 7. The $WARD token

$WARD coordinates the three-sided market. (Illustrative; final design subject to community governance and legal review.)

- **Reputation weighting & staking** — verifiers and issuers stake $WARD to attest; bad attestations are slashable, keeping the graph honest.
- **Reward rounds** — ecosystem funds and projects denominate retroactive rewards in $WARD or stablecoins routed through Solward.
- **Governance** — holders set category weights, dispute rules, and treasury allocation.
- **Access** — the highest-reputation contributors and stakers unlock premium bounties and reduced fees.

**Fair launch, builder-aligned.** In the spirit of EasyA Kickstart, Solward is designed to launch without a presale, with a meaningful allocation reserved to reward contributors retroactively — the people who build Solward should hold Solward.

> Solward is a coordination and reputation protocol. $WARD is a utility and governance token, not an investment, equity, or a claim on revenue or profit. Participation is speculative. Do your own research.

---

## 8. Why now

Three things became true at the same time in 2026, and Solward sits at their intersection:

1. **Launching is free; building is the bottleneck.** Launchpads removed the capital-formation barrier. The scarce resource is now credible contribution.
2. **Solana won the builders.** 10,000+ active developers and a culture of hackathons, Superteam, and accelerators create constant, high-volume contribution that has nowhere to settle.
3. **The primitives are ready.** Cheap attestations, oracles, and same-transaction settlement of work + reputation + payment are only now economically viable — and only on Solana.

---

## 9. Roadmap

**Phase 0 — Proof (now).** Concept, brand, community, and a working demo of the proof-of-contribution standard on devnet.

**Phase 1 — The Market.** Launch the Contribution Market on mainnet with USDC-escrowed, outcome-based bounties and the first GitHub + content oracles. Onboard 25 launchpad-stage projects.

**Phase 2 — The Graph.** Open the reputation graph as public on-chain data with a read API and SDK, so any Solana app can integrate Solward profiles.

**Phase 3 — Reward Rounds.** Run the first retroactive reward round with an ecosystem partner. Ship the $WARD token via fair launch.

**Phase 4 — The Standard.** Become the default contribution and reputation layer referenced by launchpads, grant programs, and DAOs across Solana.

---

## 10. The vision

Solana is becoming the settlement layer for the internet's economy. Solward makes sure the **people** who build it settle too — that every PR, post, design, and late night turns into reputation they own and rewards they earn, anywhere in the ecosystem, forever.

**Build the chain. Own your record. Solward.**

---

*solward.xyz · Built for the Solana ecosystem and the EasyA Kickstart community.*
