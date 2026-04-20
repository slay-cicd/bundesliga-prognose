import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-f1-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concorde — Institutionelles Trading",
  description:
    "Perpetual Contracts. Die Infrastruktur, die institutionelle Trader seit Jahren nutzen. Jetzt zugänglich.",
  robots: "noindex",
};

export default function Funnel1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${geist.variable} min-h-screen`}
      style={{
        backgroundColor: "#FFFFFF",
        color: "#0B0E1A",
        fontFamily: "var(--font-f1-sans), system-ui, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
