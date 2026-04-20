"use client";

import { useState } from "react";
import { markets, type Category } from "@/lib/markets";
import { MarketCard } from "@/components/MarketCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { EmailCapture } from "@/components/EmailCapture";
import { SectionReveal } from "@/components/SectionReveal";
import { LeverageSlider } from "@/components/LeverageSlider";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = category === "all" ? markets : markets.filter((m) => m.category === category);

  return (
    <>
      {/* Hero — minimal, dark, no gradient bullshit */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-surface-2 text-text-secondary text-xs font-medium px-3 py-1 rounded-full mb-6 border border-border">
              <span className="w-1.5 h-1.5 bg-up rounded-full animate-pulse" />
              Live — 24 Märkte offen
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary tracking-tight leading-[1.1] mb-4">
              Geht der Preis<br />
              <span className="text-up">hoch</span> oder{" "}
              <span className="text-down">runter</span>?
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Wette auf Krypto, Aktien, Forex und mehr. Märkte ab 5 Minuten. Auszahlung sofort.
            </p>
            <EmailCapture />
            <p className="text-xs text-text-muted mt-3">
              Über 2.400 auf der Warteliste. Kein Spam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Markets grid */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-text-primary">Märkte</h2>
            <CategoryTabs selected={category} onChange={setCategory} />
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {filtered.map((market, i) => (
              <MarketCard key={market.id} market={market} index={i} />
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <p className="text-center text-text-muted py-12">Keine Märkte in dieser Kategorie.</p>
          )}
        </div>
      </section>

      {/* How it works — clean, no emojis */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                So einfach geht&apos;s
              </h2>
              <p className="text-text-secondary text-sm">In 3 Schritten zum ersten Trade</p>
            </div>
          </SectionReveal>

          <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Registrieren", desc: "Account erstellen in unter 60 Sekunden." },
              { step: "02", title: "Einzahlen", desc: "Sofort per Banküberweisung, Karte oder Krypto." },
              { step: "03", title: "Traden", desc: "Markt wählen, Richtung tippen, Gewinn kassieren." },
            ].map((item, i) => (
              <SectionReveal key={item.step} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-10 h-10 bg-surface-2 border border-border rounded-lg flex items-center justify-center text-xs font-bold text-accent mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leverage demo */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <SectionReveal>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
                  Hebel von<br />
                  <span className="text-accent">1x bis 100x</span>
                </h2>
                <p className="text-text-secondary mb-6 leading-relaxed text-sm">
                  Du entscheidest, wie viel Risiko du eingehen willst.
                  Von konservativ bis aggressiv — alles in deiner Kontrolle.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Transparente Gebühren, keine versteckten Kosten",
                    "Automatischer Stop-Loss",
                    "Echtzeit-Liquidationspreis",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                      <svg className="w-3.5 h-3.5 text-up mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <LeverageSlider />
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 md:py-20 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                Sicher. Reguliert. Europäisch.
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { title: "EU-reguliert", desc: "Lizenziert in der EU" },
              { title: "Einlagen gesichert", desc: "Segregierte Konten" },
              { title: "2FA Schutz", desc: "Maximale Sicherheit" },
              { title: "Sofort-Auszahlung", desc: "Dein Geld, dein Zugriff" },
            ].map((item, i) => (
              <SectionReveal key={item.title} delay={i * 0.05}>
                <div className="text-center p-4 bg-surface-1 rounded-xl border border-border">
                  <h3 className="text-sm font-semibold text-text-primary mb-0.5">{item.title}</h3>
                  <p className="text-xs text-text-muted">{item.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Bereit?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto text-sm">
              Sichere dir jetzt deinen Early-Access-Platz.
            </p>
            <div className="max-w-md mx-auto">
              <EmailCapture />
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
