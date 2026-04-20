import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-funnel-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concorde — Perpetual Contracts",
  description: "€20 Startguthaben. Perps auf Bitcoin, Gold, Aktien. Jetzt kostenlos registrieren.",
  robots: "noindex",
};

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${dmSans.variable} min-h-screen bg-[#0a0a0b] text-[#e8e8ea]`}
      style={{ fontFamily: "var(--font-funnel-sans), system-ui, sans-serif" }}
    >
      {children}
    </div>
  );
}
