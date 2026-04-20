import type { Metadata } from "next";
import { DM_Sans, Cormorant_Garamond } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-funnel-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-funnel-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concorde — Perpetual Contracts",
  description: "Institutionelle Infrastruktur. Jetzt zugänglich. Perpetual Contracts auf allen Märkten.",
  robots: "noindex",
};

export default function Funnel1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${dmSans.variable} ${cormorant.variable} min-h-screen`}
      style={{
        backgroundColor: "#f5f3ef",
        color: "#1a1a1a",
        fontFamily: "var(--font-funnel-sans), system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
