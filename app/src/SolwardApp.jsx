import React, { useState, useMemo } from "react";
import { Github, FileText, Palette, Users, Coins, Shield, Check, Clock, ArrowRight, Award, Wallet, TrendingUp, Plus, X, ChevronRight, Sparkles } from "lucide-react";

// ---------- Brand tokens ----------
const G = {
  green: "#0FA968",
  deep: "#0A7D4E",
  bright: "#16C97D",
  soft: "#E7F6EE",
  mist: "#F3FBF7",
  ink: "#0C2018",
  inkSoft: "#3A5249",
  line: "rgba(15,169,104,0.16)",
  lineStrong: "rgba(15,169,104,0.28)",
};

const CAT_ICON = {
  Engineering: Github,
  Content: FileText,
  Design: Palette,
  Community: Users,
  Capital: Coins,
};

// ---------- Seed data ----------
const seedProfile = {
  handle: "leo.sol",
  rep: 184,
  earned: 4200,
  attestations: [
    { id: "a1", project: "Jupiter", work: "Routing edge-case fix · PR #882", cat: "Engineering", rep: 22, when: "3 weeks ago" },
    { id: "a2", project: "Drift", work: "Launch thread · 41k impressions", cat: "Content", rep: 14, when: "1 month ago" },
    { id: "a3", project: "Sanctum", work: "Audit follow-up · PR #214", cat: "Engineering", rep: 18, when: "2 months ago" },
  ],
};

const seedBounties = [
  {
    id: "b1", project: "TideFi", token: "TIDE", justLaunched: true,
    title: "Fix audit finding in vault withdraw", cat: "Engineering",
    amount: 1200, currency: "USDC", repReq: 120, repReward: 18,
    desc: "Re-entrancy guard flagged on the vault withdraw path. Patch, add a test, get it merged.",
    verifier: "github-oracle", status: "open", applicants: 3,
  },
  {
    id: "b2", project: "TideFi", token: "TIDE", justLaunched: true,
    title: "Launch-week content campaign", cat: "Content",
    amount: 800, currency: "USDC", repReq: 40, repReward: 14,
    desc: "Drive a launch thread + 3 follow-ups. Reward unlocks on 25k+ verified impressions.",
    verifier: "content-oracle", status: "open", applicants: 7,
  },
  {
    id: "b3", project: "Meteora", token: "MET", justLaunched: false,
    title: "Brand kit + logo refresh", cat: "Design",
    amount: 1500, currency: "USDC", repReq: 60, repReward: 16,
    desc: "Deliver a cohesive brand kit: logo, color, type, social templates. Figma handoff.",
    verifier: "manual-review", status: "open", applicants: 2,
  },
];

let idc = 100;
const nid = () => "x" + (idc++);

export default function SolwardApp() {
  const [role, setRole] = useState("contributor"); // contributor | founder
  const [profile, setProfile] = useState(seedProfile);
  const [bounties, setBounties] = useState(seedBounties);
  // applications: {id, bountyId, status: applied|submitted|verifying|settled}
  const [apps, setApps] = useState([]);
  const [toast, setToast] = useState(null);
  const [detail, setDetail] = useState(null); // bounty being viewed
  const [showCreate, setShowCreate] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const repTier = (r) =>
    r >= 200 ? "Architect" : r >= 120 ? "Senior" : r >= 50 ? "Builder" : "Newcomer";

  // ----- Contributor actions -----
  const applyTo = (b) => {
    if (profile.rep < b.repReq) { flash(`Need ${b.repReq} rep to apply — you have ${profile.rep}`); return; }
    if (apps.some(a => a.bountyId === b.id)) { flash("Already applied to this bounty"); return; }
    setApps(a => [...a, { id: nid(), bountyId: b.id, status: "applied" }]);
    setBounties(bs => bs.map(x => x.id === b.id ? { ...x, applicants: x.applicants + 1 } : x));
    flash("Applied — your reputation is your resume");
  };

  const submitWork = (app) => {
    setApps(a => a.map(x => x.id === app.id ? { ...x, status: "verifying" } : x));
    const b = bounties.find(x => x.id === app.bountyId);
    flash(`Submitted · ${b.verifier} is verifying…`);
    // simulate oracle verification
    setTimeout(() => {
      setApps(a => a.map(x => x.id === app.id ? { ...x, status: "settled" } : x));
      setBounties(bs => bs.map(x => x.id === b.id ? { ...x, status: "filled" } : x));
      setProfile(p => ({
        ...p,
        rep: p.rep + b.repReward,
        earned: p.earned + b.amount,
        attestations: [
          { id: nid(), project: b.project, work: b.title, cat: b.cat, rep: b.repReward, when: "just now", fresh: true },
          ...p.attestations,
        ],
      }));
      flash(`Settled · +${b.repReward} rep · ${b.amount} ${b.currency} paid · attestation minted`);
    }, 2400);
  };

  // ----- Founder actions -----
  const createBounty = (form) => {
    const nb = {
      id: nid(), project: "TideFi", token: "TIDE", justLaunched: true,
      title: form.title, cat: form.cat, amount: Number(form.amount), currency: "USDC",
      repReq: Number(form.repReq), repReward: Number(form.repReward),
      desc: form.desc, verifier: form.cat === "Engineering" ? "github-oracle" : form.cat === "Content" ? "content-oracle" : "manual-review",
      status: "open", applicants: 0, mine: true,
    };
    setBounties(bs => [nb, ...bs]);
    setShowCreate(false);
    flash(`Bounty funded · ${nb.amount} USDC escrowed`);
  };

  const myApps = apps.map(a => ({ ...a, bounty: bounties.find(b => b.id === a.bountyId) }));

  return (
    <div style={{ minHeight: "100vh", background: G.mist, fontFamily: "Inter, system-ui, sans-serif", color: G.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .sg { font-family:'Space Grotesk',sans-serif; }
        .mono { font-family:'JetBrains Mono',monospace; }
        .card { background:#fff; border:1px solid ${G.line}; border-radius:16px; }
        .btn { font-family:'Space Grotesk'; font-weight:600; border:none; cursor:pointer; border-radius:10px; transition:transform .12s, box-shadow .2s, opacity .2s; }
        .btn:hover { transform:translateY(-1px); }
        .btn:active { transform:translateY(0); }
        .btn:disabled { opacity:.45; cursor:not-allowed; transform:none; }
        .fade { animation: fade .4s ease; }
        @keyframes fade { from {opacity:0; transform:translateY(8px);} to {opacity:1; transform:none;} }
        .pop { animation: pop .5s cubic-bezier(.2,1.2,.3,1); }
        @keyframes pop { 0%{transform:scale(.9);opacity:0;} 100%{transform:scale(1);opacity:1;} }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg);} }
        .tabbtn:hover { color:${G.deep}; }
      `}</style>

      {/* Top bar */}
      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(243,251,247,.85)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.line}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 22px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: `linear-gradient(105deg,${G.deep},${G.bright})`, position: "relative", boxShadow: "0 4px 12px rgba(15,169,104,.35)" }}>
              <div style={{ position: "absolute", top: 6, right: 6, width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
            </div>
            <span className="sg" style={{ fontWeight: 700, fontSize: 18, letterSpacing: -0.4 }}>Solward</span>
            <span className="mono" style={{ fontSize: 10, color: G.deep, background: G.soft, border: `1px solid ${G.line}`, padding: "2px 7px", borderRadius: 20, marginLeft: 4 }}>DEMO</span>
          </div>

          {/* Role switch */}
          <div style={{ display: "flex", background: "#fff", border: `1px solid ${G.lineStrong}`, borderRadius: 11, padding: 3 }}>
            {[["contributor", "Contributor"], ["founder", "Founder"]].map(([r, label]) => (
              <button key={r} onClick={() => setRole(r)} className="btn sg"
                style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8, background: role === r ? `linear-gradient(105deg,${G.deep},${G.bright})` : "transparent", color: role === r ? "#fff" : G.inkSoft, boxShadow: role === r ? "0 4px 12px rgba(15,169,104,.3)" : "none" }}>
                {label}
              </button>
            ))}
          </div>

          <div className="card" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 20 }}>
            <Wallet size={15} color={G.deep} />
            <span className="mono" style={{ fontSize: 12 }}>{role === "contributor" ? profile.handle : "maya.sol"}</span>
          </div>
        </div>
      </header>

      {/* Preview banner */}
      {bannerOpen && (
        <div style={{ background: `linear-gradient(105deg,${G.deep},${G.bright})`, color: "#fff" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "9px 22px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap", fontSize: 13 }}>
            <Sparkles size={15} />
            <span style={{ fontWeight: 500 }}>
              Interactive preview — the market isn't on-chain yet. Try the full flow, then join the waitlist for launch.
            </span>
            <button className="btn sg" onClick={() => setShowWaitlist(true)} style={{ fontSize: 12, padding: "5px 13px", background: "rgba(255,255,255,.16)", color: "#fff", border: "1px solid rgba(255,255,255,.3)" }}>
              Join waitlist
            </button>
            <button onClick={() => setBannerOpen(false)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(255,255,255,.8)", display: "grid", placeItems: "center", padding: 2 }} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "30px 22px 80px" }}>
        {role === "contributor"
          ? <Contributor {...{ profile, bounties, apps, myApps, applyTo, submitWork, repTier, repTier2: repTier, setDetail }} />
          : <Founder {...{ bounties, setShowCreate, apps, setDetail }} />}
      </main>

      {/* Bounty detail drawer */}
      {detail && (
        <Drawer bounty={detail} onClose={() => setDetail(null)} role={role}
          applied={apps.some(a => a.bountyId === detail.id)} profile={profile}
          onApply={() => { applyTo(detail); setDetail(null); }} />
      )}

      {/* Create bounty modal */}
      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreate={createBounty} />}

      {/* Waitlist modal */}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} onDone={() => { setShowWaitlist(false); flash("You're on the list — we'll reach out at launch"); }} />}

      {/* Toast */}
      {toast && (
        <div className="pop" style={{ position: "fixed", bottom: 26, left: "50%", transform: "translateX(-50%)", zIndex: 60, background: G.ink, color: "#fff", padding: "13px 20px", borderRadius: 12, fontSize: 13.5, fontWeight: 500, boxShadow: "0 16px 40px rgba(0,0,0,.3)", display: "flex", alignItems: "center", gap: 9, maxWidth: "90vw" }}>
          <Sparkles size={15} color={G.bright} /> {toast}
        </div>
      )}
    </div>
  );
}

// ================= CONTRIBUTOR VIEW =================
function Contributor({ profile, bounties, apps, myApps, applyTo, submitWork, repTier, setDetail }) {
  const open = bounties.filter(b => b.status === "open");
  const tier = repTier(profile.rep);
  return (
    <div className="fade">
      {/* Profile header */}
      <div className="card" style={{ padding: 26, marginBottom: 22, background: `linear-gradient(135deg,#fff, ${G.mist})` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div className="sg" style={{ width: 60, height: 60, borderRadius: 16, background: `linear-gradient(135deg,${G.deep},${G.bright})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 24, fontWeight: 700, boxShadow: "0 8px 20px rgba(15,169,104,.3)" }}>
              {profile.handle[0].toUpperCase()}
            </div>
            <div>
              <div className="sg" style={{ fontSize: 22, fontWeight: 700 }}>{profile.handle}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: "#fff", background: `linear-gradient(105deg,${G.deep},${G.bright})`, padding: "3px 9px", borderRadius: 20, fontWeight: 700 }}>{tier.toUpperCase()}</span>
                <span style={{ fontSize: 13, color: G.inkSoft }}>Verifiable Solana contributor</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <Stat icon={<Award size={16} color={G.deep} />} n={profile.rep} l="reputation" />
            <Stat icon={<Coins size={16} color={G.deep} />} n={"$" + profile.earned.toLocaleString()} l="earned" />
            <Stat icon={<Shield size={16} color={G.deep} />} n={profile.attestations.length} l="attestations" />
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.45fr 1fr", gap: 22 }}>
        {/* Bounty board */}
        <section>
          <SectionHead label="THE CONTRIBUTION MARKET" title="Open bounties" />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {open.length === 0 && <Empty text="No open bounties right now. Check back soon." />}
            {open.map(b => {
              const Icon = CAT_ICON[b.cat] || Github;
              const eligible = profile.rep >= b.repReq;
              const already = apps.some(a => a.bountyId === b.id);
              return (
                <div key={b.id} className="card" style={{ padding: 18, cursor: "pointer", transition: "box-shadow .2s, transform .2s" }}
                  onClick={() => setDetail(b)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 12px 30px rgba(10,125,78,.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", gap: 13 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: G.soft, display: "grid", placeItems: "center", flexShrink: 0, border: `1px solid ${G.line}` }}>
                        <Icon size={18} color={G.deep} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span className="sg" style={{ fontWeight: 600, fontSize: 15 }}>{b.title}</span>
                          {b.justLaunched && <span className="mono" style={{ fontSize: 9.5, color: G.deep, background: G.soft, padding: "2px 6px", borderRadius: 5, border: `1px solid ${G.line}` }}>JUST LAUNCHED ON KICKSTART</span>}
                        </div>
                        <div style={{ fontSize: 12.5, color: G.inkSoft, marginTop: 3 }}>{b.project} · {b.cat} · {b.applicants} applied</div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div className="sg" style={{ fontWeight: 700, fontSize: 16, color: G.deep }}>{b.amount} {b.currency}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: G.inkSoft, marginTop: 2 }}>+{b.repReward} rep</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
                    <span className="mono" style={{ fontSize: 11, color: eligible ? G.deep : "#B5791A", background: eligible ? G.soft : "#FFF4E0", padding: "4px 9px", borderRadius: 6, border: `1px solid ${eligible ? G.line : "#F0D9A8"}` }}>
                      {eligible ? `✓ eligible · needs ${b.repReq} rep` : `needs ${b.repReq} rep · you have ${profile.rep}`}
                    </span>
                    <button className="btn sg" disabled={!eligible || already}
                      onClick={(e) => { e.stopPropagation(); applyTo(b); }}
                      style={{ fontSize: 13, padding: "8px 16px", background: already ? G.soft : `linear-gradient(105deg,${G.deep},${G.bright})`, color: already ? G.deep : "#fff" }}>
                      {already ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right column: my work + attestations */}
        <aside>
          <SectionHead label="IN PROGRESS" title="My applications" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26 }}>
            {myApps.length === 0 && <Empty text="Apply to a bounty to start earning reputation." small />}
            {myApps.map(a => (
              <div key={a.id} className="card" style={{ padding: 14 }}>
                <div className="sg" style={{ fontWeight: 600, fontSize: 13.5 }}>{a.bounty.title}</div>
                <div style={{ fontSize: 11.5, color: G.inkSoft, marginTop: 2 }}>{a.bounty.project} · {a.bounty.amount} {a.bounty.currency}</div>
                <div style={{ marginTop: 11 }}>
                  {a.status === "applied" && (
                    <button className="btn sg" onClick={() => submitWork(a)} style={{ width: "100%", fontSize: 12.5, padding: "8px", background: `linear-gradient(105deg,${G.deep},${G.bright})`, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      Submit work <ArrowRight size={13} />
                    </button>
                  )}
                  {a.status === "verifying" && (
                    <div className="mono" style={{ fontSize: 11.5, color: "#B5791A", background: "#FFF4E0", padding: "7px 10px", borderRadius: 7, display: "flex", alignItems: "center", gap: 7, border: "1px solid #F0D9A8" }}>
                      <Clock size={13} className="spin" /> {a.bounty.verifier} verifying…
                    </div>
                  )}
                  {a.status === "settled" && (
                    <div className="mono pop" style={{ fontSize: 11.5, color: G.deep, background: G.soft, padding: "7px 10px", borderRadius: 7, display: "flex", alignItems: "center", gap: 7, border: `1px solid ${G.lineStrong}` }}>
                      <Check size={13} /> settled · paid · minted
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <SectionHead label="ON-CHAIN RECORD" title="Reputation graph" />
          <div className="card" style={{ padding: 16 }}>
            {profile.attestations.map((at, i) => {
              const Icon = CAT_ICON[at.cat] || Github;
              return (
                <div key={at.id} className={at.fresh ? "pop" : ""} style={{ display: "flex", gap: 11, padding: "11px 0", borderBottom: i < profile.attestations.length - 1 ? `1px solid ${G.line}` : "none" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: G.mist, display: "grid", placeItems: "center", flexShrink: 0, border: `1px solid ${G.line}` }}>
                    <Icon size={14} color={G.deep} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{at.work}</div>
                    <div className="mono" style={{ fontSize: 10.5, color: G.inkSoft, marginTop: 2 }}>{at.project} · {at.when}</div>
                  </div>
                  <div className="mono" style={{ fontSize: 11, color: G.deep, fontWeight: 700, flexShrink: 0 }}>+{at.rep}</div>
                </div>
              );
            })}
          </div>
          <div className="mono" style={{ fontSize: 10.5, color: G.inkSoft, marginTop: 10, textAlign: "center", opacity: .8 }}>
            Soulbound · portable · readable by any Solana app
          </div>
        </aside>
      </div>
    </div>
  );
}

// ================= FOUNDER VIEW =================
function Founder({ bounties, setShowCreate, apps, setDetail }) {
  const mine = bounties.filter(b => b.mine || b.project === "TideFi");
  const escrowed = mine.filter(b => b.status === "open").reduce((s, b) => s + b.amount, 0);
  const filled = bounties.filter(b => b.status === "filled").length;
  return (
    <div className="fade">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <SectionHead label="FOUNDER · TIDEFI" title="Fund your launch with talent" noMargin />
          <p style={{ fontSize: 14, color: G.inkSoft, marginTop: 6, maxWidth: 460 }}>
            You just launched TIDE on EasyA Kickstart. Post outcome-based bounties from your treasury — contributors apply with verified reputation, and escrow releases only when work is proven.
          </p>
        </div>
        <button className="btn sg" onClick={() => setShowCreate(true)} style={{ fontSize: 14, padding: "11px 18px", background: `linear-gradient(105deg,${G.deep},${G.bright})`, color: "#fff", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 6px 18px rgba(15,169,104,.3)" }}>
          <Plus size={16} /> Fund a bounty
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 26 }}>
        <BigStat icon={<Coins size={18} color={G.deep} />} n={"$" + escrowed.toLocaleString()} l="USDC in escrow" />
        <BigStat icon={<Users size={18} color={G.deep} />} n={mine.reduce((s, b) => s + b.applicants, 0)} l="total applicants" />
        <BigStat icon={<Check size={18} color={G.deep} />} n={filled} l="bounties settled" />
      </div>

      <SectionHead label="YOUR BOUNTIES" title="Posted from TideFi treasury" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {mine.map(b => {
          const Icon = CAT_ICON[b.cat] || Github;
          return (
            <div key={b.id} className="card" style={{ padding: 18, cursor: "pointer" }} onClick={() => setDetail(b)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: G.soft, display: "grid", placeItems: "center", border: `1px solid ${G.line}` }}>
                    <Icon size={17} color={G.deep} />
                  </div>
                  <div>
                    <div className="sg" style={{ fontWeight: 600, fontSize: 14.5 }}>{b.title}</div>
                    <div style={{ fontSize: 12, color: G.inkSoft, marginTop: 2 }}>{b.cat} · via {b.verifier}</div>
                  </div>
                </div>
                <span className="mono" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: b.status === "open" ? G.soft : "#EFEAFE", color: b.status === "open" ? G.deep : "#6D4ACC", border: `1px solid ${G.line}` }}>
                  {b.status === "open" ? "OPEN" : "SETTLED"}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
                <span style={{ fontSize: 12.5, color: G.inkSoft }}><b style={{ color: G.deep }}>{b.applicants}</b> applied · min {b.repReq} rep</span>
                <span className="sg" style={{ fontWeight: 700, color: G.deep }}>{b.amount} {b.currency}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 26, padding: 20, background: G.mist, display: "flex", gap: 14, alignItems: "flex-start" }}>
        <Shield size={20} color={G.deep} style={{ flexShrink: 0, marginTop: 2 }} />
        <div style={{ fontSize: 13, color: G.inkSoft }}>
          <b style={{ color: G.ink }}>Why this is safe for you.</b> Funds sit in escrow, not in a stranger's wallet. They release automatically only when an oracle (or your review) confirms the work. Contributors apply with reputation that's verifiable on-chain — so you can gate bounties to proven builders instead of guessing.
        </div>
      </div>
    </div>
  );
}

// ================= SHARED PIECES =================
function Drawer({ bounty, onClose, role, applied, profile, onApply }) {
  const Icon = CAT_ICON[bounty.cat] || Github;
  const steps = [
    { t: "Fund", d: "Founder escrows the reward from treasury" },
    { t: "Apply", d: "Contributor applies with on-chain reputation" },
    { t: "Verify", d: `${bounty.verifier} confirms the delivered work` },
    { t: "Settle", d: "Escrow releases + attestation mints — one tx" },
  ];
  const eligible = role === "contributor" ? profile.rep >= bounty.repReq : true;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(12,32,24,.4)", display: "flex", justifyContent: "flex-end" }}>
      <div className="fade" onClick={e => e.stopPropagation()} style={{ width: 440, maxWidth: "92vw", height: "100%", background: "#fff", overflowY: "auto", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: G.soft, display: "grid", placeItems: "center", border: `1px solid ${G.line}` }}>
            <Icon size={22} color={G.deep} />
          </div>
          <button className="btn" onClick={onClose} style={{ background: G.mist, padding: 8, borderRadius: 9 }}><X size={16} color={G.inkSoft} /></button>
        </div>
        <h2 className="sg" style={{ fontSize: 21, fontWeight: 700, marginTop: 16, lineHeight: 1.2 }}>{bounty.title}</h2>
        <div style={{ fontSize: 13, color: G.inkSoft, marginTop: 6 }}>{bounty.project} · {bounty.cat}</div>
        <p style={{ fontSize: 14, color: G.inkSoft, marginTop: 16, lineHeight: 1.6 }}>{bounty.desc}</p>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <Box label="Reward" v={`${bounty.amount} ${bounty.currency}`} />
          <Box label="Rep reward" v={`+${bounty.repReward}`} />
          <Box label="Min rep" v={bounty.repReq} />
        </div>

        <div className="mono" style={{ fontSize: 11, color: G.inkSoft, marginTop: 22, marginBottom: 10, letterSpacing: 1 }}>HOW SETTLEMENT WORKS</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 13, paddingBottom: i < 3 ? 16 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="sg" style={{ width: 26, height: 26, borderRadius: "50%", background: `linear-gradient(105deg,${G.deep},${G.bright})`, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                {i < 3 && <div style={{ width: 2, flex: 1, background: G.line, marginTop: 2 }} />}
              </div>
              <div style={{ paddingBottom: 4 }}>
                <div className="sg" style={{ fontWeight: 600, fontSize: 14 }}>{s.t}</div>
                <div style={{ fontSize: 12.5, color: G.inkSoft, marginTop: 1 }}>{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        {role === "contributor" && (
          <button className="btn sg" disabled={applied || !eligible} onClick={onApply}
            style={{ width: "100%", marginTop: 26, fontSize: 15, padding: "13px", background: applied || !eligible ? G.soft : `linear-gradient(105deg,${G.deep},${G.bright})`, color: applied || !eligible ? G.inkSoft : "#fff" }}>
            {applied ? "Already applied ✓" : eligible ? "Apply with my reputation" : `Need ${bounty.repReq} rep (you have ${profile.rep})`}
          </button>
        )}
        {role === "founder" && (
          <div className="card" style={{ marginTop: 24, padding: 14, background: G.mist }}>
            <div className="mono" style={{ fontSize: 11, color: G.inkSoft, marginBottom: 8 }}>APPLICANTS ({bounty.applicants})</div>
            <div style={{ fontSize: 13, color: G.inkSoft }}>Contributors who applied are ranked by reputation. In the full product you'd review and assign here — verification and payout then settle automatically.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [f, setF] = useState({ title: "", cat: "Engineering", amount: "1000", repReq: "80", repReward: "16", desc: "" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.title.trim() && f.amount && f.desc.trim();
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(12,32,24,.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="pop" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: 28, width: 480, maxWidth: "94vw", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 className="sg" style={{ fontSize: 20, fontWeight: 700 }}>Fund a bounty</h2>
          <button className="btn" onClick={onClose} style={{ background: G.mist, padding: 8, borderRadius: 9 }}><X size={16} color={G.inkSoft} /></button>
        </div>
        <p style={{ fontSize: 13, color: G.inkSoft, marginBottom: 18 }}>Escrowed from TideFi treasury. Released only when work is verified.</p>

        <Field label="What needs to get done?">
          <input value={f.title} onChange={set("title")} placeholder="e.g. Integrate Jupiter swap widget" style={inp} />
        </Field>
        <Field label="Category">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.keys(CAT_ICON).map(c => (
              <button key={c} className="btn sg" onClick={() => setF({ ...f, cat: c })}
                style={{ fontSize: 12.5, padding: "7px 13px", background: f.cat === c ? `linear-gradient(105deg,${G.deep},${G.bright})` : G.mist, color: f.cat === c ? "#fff" : G.inkSoft, border: `1px solid ${G.line}` }}>{c}</button>
            ))}
          </div>
        </Field>
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="Reward (USDC)"><input value={f.amount} onChange={set("amount")} type="number" style={inp} /></Field>
          <Field label="Min rep to apply"><input value={f.repReq} onChange={set("repReq")} type="number" style={inp} /></Field>
          <Field label="Rep reward"><input value={f.repReward} onChange={set("repReward")} type="number" style={inp} /></Field>
        </div>
        <Field label="Details">
          <textarea value={f.desc} onChange={set("desc")} rows={3} placeholder="Describe the outcome and how it'll be verified…" style={{ ...inp, resize: "vertical" }} />
        </Field>

        <button className="btn sg" disabled={!valid} onClick={() => onCreate(f)}
          style={{ width: "100%", marginTop: 8, fontSize: 15, padding: "13px", background: valid ? `linear-gradient(105deg,${G.deep},${G.bright})` : G.soft, color: valid ? "#fff" : G.inkSoft }}>
          Escrow {f.amount || 0} USDC & post
        </button>
      </div>
    </div>
  );
}

function WaitlistModal({ onClose, onDone }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Contributor");
  const valid = /\S+@\S+\.\S+/.test(email);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 55, background: "rgba(12,32,24,.45)", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="pop" onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 18, padding: 28, width: 420, maxWidth: "94vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(105deg,${G.deep},${G.bright})`, display: "grid", placeItems: "center" }}><Sparkles size={17} color="#fff" /></div>
            <h2 className="sg" style={{ fontSize: 19, fontWeight: 700 }}>Join the waitlist</h2>
          </div>
          <button className="btn" onClick={onClose} style={{ background: G.mist, padding: 8, borderRadius: 9 }}><X size={16} color={G.inkSoft} /></button>
        </div>
        <p style={{ fontSize: 13, color: G.inkSoft, margin: "12px 0 18px", lineHeight: 1.5 }}>
          Solward's market launches on Solana soon. Get early access when the on-chain version goes live.
        </p>
        <Field label="Email">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={inp} />
        </Field>
        <Field label="I'm joining as">
          <div style={{ display: "flex", gap: 8 }}>
            {["Contributor", "Founder", "Both"].map(r => (
              <button key={r} className="btn sg" onClick={() => setRole(r)}
                style={{ flex: 1, fontSize: 12.5, padding: "8px", background: role === r ? `linear-gradient(105deg,${G.deep},${G.bright})` : G.mist, color: role === r ? "#fff" : G.inkSoft, border: `1px solid ${G.line}` }}>{r}</button>
            ))}
          </div>
        </Field>
        <button className="btn sg" disabled={!valid} onClick={onDone}
          style={{ width: "100%", marginTop: 8, fontSize: 15, padding: "13px", background: valid ? `linear-gradient(105deg,${G.deep},${G.bright})` : G.soft, color: valid ? "#fff" : G.inkSoft }}>
          Notify me at launch
        </button>
        <div className="mono" style={{ fontSize: 10.5, color: G.inkSoft, marginTop: 12, textAlign: "center", opacity: .75 }}>
          Demo only · no email is actually stored
        </div>
      </div>
    </div>
  );
}

// ---- small components ----
const inp = { width: "100%", padding: "10px 12px", borderRadius: 9, border: `1px solid ${G.lineStrong}`, fontSize: 13.5, fontFamily: "Inter", color: G.ink, outline: "none", background: "#fff" };
function Field({ label, children }) {
  return <div style={{ marginBottom: 14, flex: 1 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: G.inkSoft, marginBottom: 6 }}>{label}</label>{children}</div>;
}
function Stat({ icon, n, l }) {
  return <div><div style={{ display: "flex", alignItems: "center", gap: 6 }}>{icon}<span className="sg" style={{ fontSize: 21, fontWeight: 700, color: G.deep }}>{n}</span></div><div className="mono" style={{ fontSize: 10, color: G.inkSoft, marginTop: 3, textTransform: "uppercase", letterSpacing: .4 }}>{l}</div></div>;
}
function BigStat({ icon, n, l }) {
  return <div className="card" style={{ padding: 18 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}>{icon}<span className="sg" style={{ fontSize: 24, fontWeight: 700, color: G.deep }}>{n}</span></div><div className="mono" style={{ fontSize: 11, color: G.inkSoft, marginTop: 5, textTransform: "uppercase", letterSpacing: .4 }}>{l}</div></div>;
}
function Box({ label, v }) {
  return <div className="card" style={{ flex: 1, padding: "12px 14px", textAlign: "center", background: G.mist }}><div className="sg" style={{ fontWeight: 700, fontSize: 16, color: G.deep }}>{v}</div><div className="mono" style={{ fontSize: 9.5, color: G.inkSoft, marginTop: 3, textTransform: "uppercase" }}>{label}</div></div>;
}
function SectionHead({ label, title, noMargin }) {
  return <div style={{ marginBottom: noMargin ? 0 : 16 }}>
    <div className="mono" style={{ fontSize: 11, color: G.deep, letterSpacing: 1.4, display: "flex", alignItems: "center", gap: 9, marginBottom: 8 }}>
      <span style={{ width: 22, height: 2, background: G.green, borderRadius: 2 }} />{label}
    </div>
    <h2 className="sg" style={{ fontSize: 18, fontWeight: 700 }}>{title}</h2>
  </div>;
}
function Empty({ text, small }) {
  return <div className="card" style={{ padding: small ? 16 : 26, textAlign: "center", fontSize: 13, color: G.inkSoft, background: G.mist, border: `1px dashed ${G.lineStrong}` }}>{text}</div>;
}
