"use client";

import { useCallback, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { listBounties, applyToBounty, myApplications } from "@/lib/api";
import type { Bounty, Application } from "@/lib/types";
import { shortWallet, timeAgo } from "@/lib/format";

export default function BoardPage() {
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() ?? null;

  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const bs = await listBounties();
      setBounties(bs);
      if (wallet) setApps(await myApplications(wallet));
    } catch (e: any) {
      setError(e.message ?? "Failed to load bounties");
    } finally {
      setLoading(false);
    }
  }, [wallet]);

  useEffect(() => {
    load();
  }, [load]);

  const apply = async (b: Bounty) => {
    if (!wallet) return;
    try {
      await applyToBounty(b.id, wallet);
      await load();
    } catch (e: any) {
      alert(e.message ?? "Could not apply");
    }
  };

  const applied = (id: string) => apps.some((a) => a.bounty_id === id);

  return (
    <div>
      <div className="eyebrow">THE CONTRIBUTION MARKET</div>
      <h1 style={{ fontSize: 30, margin: "8px 0 24px", letterSpacing: -1 }}>
        Open bounties
      </h1>

      {loading && <p style={{ color: "var(--ink-soft)" }}>Loading…</p>}
      {error && (
        <div className="card" style={{ padding: 18, color: "#B5791A", background: "#FFF4E0" }}>
          {error} — check your Supabase config in <code>.env</code> and that the schema is applied.
        </div>
      )}

      {!loading && !error && bounties.length === 0 && (
        <div className="card" style={{ padding: 26, textAlign: "center", color: "var(--ink-soft)" }}>
          No bounties yet. <a href="/bounties/new" style={{ color: "var(--deep)", fontWeight: 600 }}>Post the first one →</a>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bounties.map((b) => (
          <div key={b.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{b.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ink-soft)", marginTop: 3 }}>
                  {b.project} · {b.category} · by {shortWallet(b.creator_wallet)} · {timeAgo(b.created_at)}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--deep)" }}>
                  {b.amount} {b.currency}
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-soft)" }}>
                  +{b.rep_reward} rep
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "12px 0" }}>{b.description}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="pill">min {b.rep_req} rep · {b.status}</span>
              <button
                className="btn"
                disabled={!wallet || applied(b.id) || b.status !== "open"}
                onClick={() => apply(b)}
              >
                {!wallet ? "Connect wallet to apply" : applied(b.id) ? "Applied ✓" : "Apply"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
