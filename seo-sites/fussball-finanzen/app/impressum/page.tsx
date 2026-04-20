import type { Metadata } from "next";
import siteConfig from "@/site.config";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false },
};

export default function ImpressumPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
      <h1 className="text-3xl font-bold text-white mb-8 tracking-tight">
        Impressum
      </h1>
      <div className="glass-card p-8 prose-dark">
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          {siteConfig.company}
          <br />
          [Straße und Hausnummer]
          <br />
          [PLZ] [Stadt]
          <br />
          Deutschland
        </p>
        <h3>Kontakt</h3>
        <p>
          E-Mail: [kontakt@domain.de]
          <br />
          Telefon: [+49 xxx xxxxxxx]
        </p>
        <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>[Vorname Nachname, Adresse wie oben]</p>
        <h3>Haftungsausschluss</h3>
        <p>
          Diese Website enthält Informationen zu Sportwetten und Prediction
          Markets. Die Inhalte dienen ausschließlich Informationszwecken und
          stellen keine Aufforderung zur Teilnahme am Glücksspiel dar.
          Sportwetten und Glücksspiel können süchtig machen. 18+.
        </p>
      </div>
    </div>
  );
}
