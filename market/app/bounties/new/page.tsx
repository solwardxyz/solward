"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@solana/wallet-adapter-react";
import { createBounty } from "@/lib/api";
import { CATEGORIES, Category } from "@/lib/types";

export default function NewBountyPage() {
  const router = useRouter();
  const { publicKey } = useWallet();
  const wallet = publicKey?.toBase58() ?? null;

  const [f, setF] = useState({
    project: "",
    title: "",
    description: "",
    category: "Engineering" as Category,
    amount: "1000",
    rep_req: "80",
    rep_reward: "16",
  });
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<any>) =>
    setF({ ...f, [k]: e.target.value });

  const valid = wallet && f.project.trim() && f.title.trim() && f.description.trim() && Number(f.amount) > 0;

  const submit = async () => {
    if (!valid || !wallet) return;
    setBusy(true);
    try {
      const b = await createBounty({
        project: f.project.trim(),
        title: f.title.trim(),
        description: f.description.trim(),
        category: f.category,
        amount: Number(f.amount),
        rep_req: Number(f.rep_req),
        rep_reward: Number(f.rep_reward),
        creator_wallet: wallet,
      });
      router.push("/");
    } catch (e: any) {
      alert(e.message ?? "Could not create bounty");
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 560 }}>
      <div className="eyebrow">FOUND A BOUNTY</div>
      <h1 style={{ fontSize: 26, margin: "8px 0 6px", letterSpacing: -0.8 }}>Post a bounty</h1>
      <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 20 }}>
        {wallet
          ? "This MVP stores the bounty in the database. On-chain USDC escrow is the next phase (see ARCHITECTURE.md)."
          : "Connect your wallet first — the connected wallet becomes the bounty creator."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label>Project</label>
          <input value={f.project} onChange={set("project")} placeholder="e.g. TideFi" />
        </div>
        <div>
          <label>What needs to get done?</label>
          <input value={f.title} onChange={set("title")} placeholder="e.g. Fix audit finding in vault withdraw" />
        </div>
        <div>
          <label>Category</label>
          <select value={f.category} onChange={set("category")}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Reward (USDC)</label>
            <input type="number" value={f.amount} onChange={set("amount")} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Min rep</label>
            <input type="number" value={f.rep_req} onChange={set("rep_req")} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Rep reward</label>
            <input type="number" value={f.rep_reward} onChange={set("rep_reward")} />
          </div>
        </div>
        <div>
          <label>Details</label>
          <textarea rows={4} value={f.description} onChange={set("description")} placeholder="Describe the outcome and how it will be verified…" />
        </div>
        <button className="btn" disabled={!valid || busy} onClick={submit}>
          {busy ? "Posting…" : `Post bounty · ${f.amount || 0} USDC`}
        </button>
      </div>
    </div>
  );
}
