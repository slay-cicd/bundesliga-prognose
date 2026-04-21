import type { Metadata } from "next";

// Per-route metadata for /funnel1 (professional variant). Same reason as funnel —
// client-component pages can't export metadata themselves.
export const metadata: Metadata = {
  title: "Concorde — Die reguliertere Alternative zu Offshore-Perps",
  description:
    "Perpetuals auf Krypto, Aktien, Pre-IPO und Indizes. Reguliert in Europa, deutscher Support, niedrige Gebühren.",
  openGraph: {
    title: "Concorde — Die reguliertere Alternative zu Offshore-Perps",
    description:
      "Perpetuals, reguliert in Europa. Deutscher Support, niedrige Gebühren, breites Asset-Angebot.",
    url: "https://www.concordemarket.de/funnel1",
    type: "website",
    locale: "de_DE",
    siteName: "Concorde",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concorde — Die reguliertere Alternative zu Offshore-Perps",
    description:
      "Perpetuals, reguliert in Europa. Deutscher Support, niedrige Gebühren.",
  },
  alternates: { canonical: "https://www.concordemarket.de/funnel1" },
};

export default function Funnel1Layout({ children }: { children: React.ReactNode }) {
  return children;
}
