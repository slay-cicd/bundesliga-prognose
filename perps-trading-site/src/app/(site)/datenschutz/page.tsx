import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — Concorde",
};

export default function Datenschutz() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Datenschutzerklärung</h1>

      <div className="space-y-8 text-sm">
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">1. Datenschutz auf einen Blick</h2>
          <p className="text-text-secondary leading-relaxed">
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was
            mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website
            besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie
            persönlich identifiziert werden können.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">2. Verantwortliche Stelle</h2>
          <p className="text-text-secondary leading-relaxed">
            Concorde<br />
            Invalidenstraße 5<br />
            10115 Berlin<br />
            E-Mail: hallo@concordemarket.de
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">3. Datenerfassung auf dieser Website</h2>
          <h3 className="text-sm font-medium text-text-primary mt-4 mb-1">Cookies</h3>
          <p className="text-text-secondary leading-relaxed">
            Unsere Internetseiten verwenden teilweise so genannte Cookies.
            Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten
            keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher,
            effektiver und sicherer zu machen.
          </p>

          <h3 className="text-sm font-medium text-text-primary mt-4 mb-1">Server-Log-Dateien</h3>
          <p className="text-text-secondary leading-relaxed">
            Der Provider der Seiten erhebt und speichert automatisch
            Informationen in so genannten Server-Log-Dateien, die Ihr Browser
            automatisch an uns übermittelt.
          </p>
          <ul className="text-text-secondary list-disc pl-5 space-y-1 mt-2">
            <li>Browsertyp und Browserversion</li>
            <li>Verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse</li>
          </ul>

          <h3 className="text-sm font-medium text-text-primary mt-4 mb-1">Warteliste</h3>
          <p className="text-text-secondary leading-relaxed">
            Wenn Sie sich für unsere Warteliste anmelden, wird Ihre E-Mail-Adresse
            zum Zwecke der Kontaktaufnahme bei uns gespeichert. Die Verarbeitung
            erfolgt auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
            Sie können Ihre Einwilligung jederzeit widerrufen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">4. Ihre Rechte</h2>
          <p className="text-text-secondary leading-relaxed">
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger
            und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung,
            Sperrung oder Löschung dieser Daten.
          </p>
          <ul className="text-text-secondary list-disc pl-5 space-y-1 mt-2">
            <li>Auskunft über Ihre Daten (Art. 15 DSGVO)</li>
            <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO)</li>
            <li>Löschung Ihrer Daten (Art. 17 DSGVO)</li>
            <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Widerspruch (Art. 21 DSGVO)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">5. Hosting</h2>
          <p className="text-text-secondary leading-relaxed">
            Diese Website wird bei Vercel Inc. gehostet. Details zur
            Datenverarbeitung finden Sie unter{" "}
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              vercel.com/legal/privacy-policy
            </a>.
          </p>
        </section>

        <p className="text-xs text-text-muted mt-8">Stand: April 2026</p>
      </div>
    </div>
  );
}
