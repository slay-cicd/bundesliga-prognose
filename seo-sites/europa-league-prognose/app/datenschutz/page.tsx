import type { Metadata } from "next";
import siteConfig from "@/site.config";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  robots: { index: false },
};

export default function DatenschutzPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">
        Datenschutzerklärung
      </h1>
      <div className="glass-card p-8 prose-dark">
        <h2>1. Datenschutz auf einen Blick</h2>
        <h3>Allgemeine Hinweise</h3>
        <p>
          Die folgenden Hinweise geben einen einfachen Überblick darüber, was
          mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
          besuchen.
        </p>
        <h3>Datenerfassung auf dieser Website</h3>
        <p>
          Diese Website ist eine statische Website. Es werden keine
          personenbezogenen Daten auf unserem Server gespeichert.
        </p>
        <h2>2. Hosting</h2>
        <p>
          Diese Website wird über GitHub Pages gehostet. Die
          Datenschutzbestimmungen von GitHub gelten: github.com/privacy
        </p>
        <h2>3. Externe Links</h2>
        <p>
          Diese Website enthält Links zu externen Seiten, insbesondere{" "}
          <a href={siteConfig.ctaUrl} target="_blank" rel="noopener noreferrer">
            {siteConfig.ctaUrl}
          </a>
          . Für die Datenschutzbestimmungen dieser Seiten sind die jeweiligen
          Betreiber verantwortlich.
        </p>
        <h2>4. Cookies</h2>
        <p>
          Diese Website verwendet keine Cookies außer technisch notwendigen
          Session-Cookies für die korrekte Darstellung.
        </p>
        <h2>5. Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz wenden Sie sich an: [datenschutz@domain.de]
        </p>
      </div>
    </div>
  );
}
