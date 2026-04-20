import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concorde — €20 Startguthaben sichern",
  description:
    "Perpetual Contracts auf Bitcoin, Gold, Aktien & mehr. €20 Bonus, bis zu 100× Hebel. EU-reguliert.",
  robots: "noindex",
};

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0a0a0b", color: "#e5e5e7" }}
    >
      {children}
    </div>
  );
}
