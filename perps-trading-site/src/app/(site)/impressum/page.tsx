import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impressum — Concorde",
};

export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h1 className="text-3xl font-bold text-text-primary mb-8">Impressum</h1>

      <div className="space-y-6 text-sm">
        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Angaben gemäß § 5 TMG
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Concorde<br />
            Invalidenstraße 5<br />
            10115 Berlin<br />
            Deutschland
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">Kontakt</h2>
          <p className="text-text-secondary leading-relaxed">
            E-Mail: hello@concorde.trade
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Concorde<br />
            Invalidenstraße 5<br />
            10115 Berlin
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Streitschlichtung
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>.
          </p>
          <p className="text-text-secondary leading-relaxed mt-2">
            Wir sind nicht bereit oder verpflichtet, an
            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
            teilzunehmen.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-text-primary mb-2">
            Haftung für Inhalte
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen.
          </p>
        </section>
      </div>
    </div>
  );
}
