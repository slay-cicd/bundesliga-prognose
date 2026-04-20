import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Concorde — Die neue Form des Derivatehandels",
  description:
    "Perpetual Contracts. Schneller, flexibler und günstiger als traditionelle Derivate. EU-reguliert.",
  robots: "noindex",
};

export default function Funnel1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#0a0a0b", color: "#e5e5e7" }}
    >
      {children}
    </div>
  );
}
