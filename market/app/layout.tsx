import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { WalletBar } from "@/components/WalletBar";

export const metadata: Metadata = {
  title: "Solward Market",
  description:
    "The Solward Contribution Market — post outcome bounties, apply with on-chain reputation, settle on Solana.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <WalletBar />
          <main className="wrap" style={{ padding: "30px 22px 80px" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
