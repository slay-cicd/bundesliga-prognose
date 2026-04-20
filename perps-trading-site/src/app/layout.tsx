import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Concorde — Trading. Neu gedacht.",
  description:
    "Handle die Märkte der Zukunft. 5-Minuten-Märkte, Perpetuals und Hebel-Trading — alles auf einer Plattform. Reguliert in Europa.",
  keywords: ["Trading", "Perpetuals", "Hebel", "Bitcoin", "Krypto", "Derivate", "Deutschland"],
  openGraph: {
    title: "Concorde — Trading. Neu gedacht.",
    description: "Handle die Märkte der Zukunft. 5-Minuten-Märkte, Perpetuals und Hebel-Trading.",
    type: "website",
    locale: "de_DE",
    siteName: "Concorde",
  },
  twitter: {
    card: "summary_large_image",
    title: "Concorde — Trading. Neu gedacht.",
    description: "Handle die Märkte der Zukunft.",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface-0 text-text-primary">
        {children}
      </body>
    </html>
  );
}
