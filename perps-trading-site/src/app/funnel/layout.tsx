import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-funnel-display",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-funnel-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concorde — Perpetual Contracts",
  description:
    "€20 Startguthaben. Perps auf Bitcoin, Gold, Aktien. Jetzt kostenlos registrieren.",
  robots: "noindex",
};

export default function FunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${instrumentSerif.variable} ${geist.variable} min-h-screen`}
      style={{
        backgroundColor: "#F5F0E8",
        color: "#1A1714",
        fontFamily: "var(--font-funnel-sans), system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
