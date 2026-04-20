"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { motion } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    id: "quick",
    title: "Kurzzeit-Märkte",
    subtitle: "Hoch oder Runter — in 5, 15 oder 60 Minuten",
    steps: [
      { title: "Markt auswählen", desc: "Wähle einen Vermögenswert: Bitcoin, Gold, Tesla, EUR/USD oder einen anderen Markt." },
      { title: "Richtung vorhersagen", desc: "Geht der Preis hoch oder runter? Wähle deine Richtung und setze deinen Einsatz." },
      { title: "Einsatz festlegen", desc: "Bestimme deinen Betrag. Du siehst sofort die mögliche Auszahlung." },
      { title: "Ergebnis", desc: "Nach Ablauf des Zeitfensters wird abgerechnet. Richtig getippt? Gewinn sofort auf deinem Konto." },
    ],
    example: {
      title: "Beispiel-Trade",
      text: 'Bitcoin steht bei $84.800. Du sagst „Hoch“ für €50. 15 Minuten später: BTC bei $84.950. Dein Gewinn: €42,50.',
    },
  },
  {
    id: "leverage",
    title: "Hebel-Trading",
    subtitle: "Multipliziere deine Position — kontrolliere dein Risiko",
    steps: [
      { title: "Position eröffnen", desc: "Wähle Long (steigend) oder Short (fallend)." },
      { title: "Hebel einstellen", desc: "Von 1x bis 100x. Höherer Hebel = größere Position, aber auch höheres Risiko." },
      { title: "Stop-Loss setzen", desc: "Automatischer Schutz. Du bestimmst den maximalen Verlust." },
      { title: "Position schließen", desc: "Jederzeit manuell oder automatisch per Stop-Loss / Take-Profit." },
    ],
    example: {
      title: "Beispiel",
      text: "€100 mit 10x Hebel auf Gold Long. Position: €1.000. Gold +2% → Gewinn: €200. Aber: Bei -10% wird liquidiert.",
    },
  },
  {
    id: "preipo",
    title: "Pre-IPO Märkte",
    subtitle: "Wette auf Unternehmen vor dem Börsengang",
    steps: [
      { title: "Was sind Pre-IPO Märkte?", desc: "Handle Aktien von Unternehmen wie Anthropic, SpaceX oder Stripe — bevor sie an die Börse gehen." },
      { title: "Bewertung als Basis", desc: "Die Preise basieren auf Sekundärmarkt-Transaktionen und implizierte Bewertungen." },
      { title: "Tägliches Settlement", desc: "Jeden Tag wird ein neuer Markt eröffnet. Sage vorher, ob die Bewertung steigt oder fällt." },
      { title: "Exklusiver Zugang", desc: "Normalerweise nur für VCs zugänglich — bei Concorde für alle." },
    ],
    example: {
      title: "Beispiel",
      text: 'Anthropic wird bei $45/Anteil gehandelt. Du setzt auf „Hoch“. Am nächsten Tag: $47,25. Gewinn: 5% auf deinen Einsatz.',
    },
  },
];

export default function SoFunktionierts() {
  return (
    <>
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">So funktioniert&apos;s</h1>
            <p className="text-base text-text-secondary max-w-xl mx-auto">
              Alles, was du wissen musst. Einfach erklärt.
            </p>
          </motion.div>
        </div>
      </section>

      {sections.map((section, sectionIdx) => (
        <section key={section.id} className={sectionIdx % 2 === 1 ? "bg-surface-1" : ""}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <SectionReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-text-primary mb-1">{section.title}</h2>
                <p className="text-text-secondary text-sm">{section.subtitle}</p>
              </div>
            </SectionReveal>

            <div className="space-y-6">
              {section.steps.map((step, i) => (
                <SectionReveal key={step.title} delay={i * 0.08}>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-surface-2 border border-border rounded-lg flex items-center justify-center text-xs font-bold text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary text-sm mb-0.5">{step.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.3}>
              <div className="mt-8 bg-accent/5 border border-accent/10 rounded-xl p-5">
                <h4 className="font-semibold text-accent text-sm mb-1">{section.example.title}</h4>
                <p className="text-sm text-text-secondary leading-relaxed">{section.example.text}</p>
              </div>
            </SectionReveal>
          </div>
        </section>
      ))}

      {/* Risk Warning */}
      <section className="border-t border-border bg-down/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <SectionReveal>
            <div>
              <h3 className="font-bold text-down text-sm mb-2">Wichtiger Risikohinweis</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Der Handel mit Derivaten birgt erhebliche Risiken. Du kannst mehr als deine ursprüngliche Einlage verlieren.
              </p>
              <ul className="text-sm text-text-secondary space-y-1">
                <li>• Hebelprodukte sind komplex und risikoreich.</li>
                <li>• 74-89% der Kleinanlegerkonten verlieren Geld beim CFD-Handel.</li>
                <li>• Investiere nur, was du dir leisten kannst zu verlieren.</li>
              </ul>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 text-center">
        <SectionReveal>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Bereit loszulegen?</h2>
          <p className="text-text-secondary text-sm mb-6">Account erstellen in unter 60 Sekunden.</p>
          <Link href="/registrierung" className="inline-flex px-8 py-3 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-colors">
            Jetzt registrieren
          </Link>
        </SectionReveal>
      </section>
    </>
  );
}
