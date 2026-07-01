"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

// WalletMultiButton touches the browser wallet, so load it client-only.
const WalletMultiButton = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((m) => m.WalletMultiButton),
  { ssr: false }
);

export function WalletBar() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <a href="https://solward.xyz" className="brand">
          <span className="mark" />
          Solward
          <span className="pill" style={{ marginLeft: 4 }}>MARKET</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/bounties/new" className="btn btn-ghost">Post a bounty</Link>
          <WalletMultiButton />
        </div>
      </div>
    </header>
  );
}
