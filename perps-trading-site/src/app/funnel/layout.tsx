import type { Metadata } from "next";

// Per-route metadata for /funnel (aggressive variant). Client-component pages
// can't export metadata themselves, so this wraps the page and sets <head>.
export const metadata: Metadata = {
  title: "Concorde — Perpetuals mit bis zu 100× Hebel",
  description:
    "Krypto, Aktien, Pre-IPO. Kein Ablaufdatum, voller Hebel, 24/7. Jetzt Early Access sichern.",
  openGraph: {
    title: "Concorde — Perpetuals mit bis zu 100× Hebel",
    description:
      "Krypto, Aktien, Pre-IPO. Kein Ablaufdatum, voller Hebel, 24/7.",
    url: "https://www.concordemarket.de/funnel",
    type: "website",
    locale: "de_DE",
    siteName: "Concorde",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concorde — Perpetuals mit bis zu 100× Hebel",
    description:
      "Krypto, Aktien, Pre-IPO. Kein Ablaufdatum, voller Hebel, 24/7.",
  },
  alternates: { canonical: "https://www.concordemarket.de/funnel" },
};

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
