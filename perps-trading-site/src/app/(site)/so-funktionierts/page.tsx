"use client";

import { SectionReveal } from "@/components/SectionReveal";
import { MarketLogo } from "@/components/MarketLogo";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Market } from "@/lib/markets";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// ── Fake BTC market for the Kurzzeit visualization card ──────────────────────
const FAKE_BTC: Market = {
  id: "btc-vis",
  name: "Bitcoin",
  pair: "BTC/USD",
  price: 84800,
  change24h: 1.8,
  abbr: "BTC",
  color: "#f7931a",
  category: "crypto",
  type: "15min",
  typeLabel: "15 Min",
  description: "",
  rules: "",
  sparkline: [84100, 84200, 84000, 84400, 84700, 85000, 84800, 85200, 84900, 85100],
  currency: "$",
  upOdds: 62,
  downOdds: 38,
};

const FAKE_ANTH: Market = {
  id: "anth-vis",
  name: "Anthropic",
  pair: "ANTH",
  price: 45.0,
  change24h: 5.2,
  abbr: "ANTH",
  color: "#D4A27F",
  category: "pre-ipo",
  type: "daily",
  typeLabel: "Tages",
  description: "",
  rules: "",
  sparkline: [40, 41, 42, 41.5, 43, 42.8, 44, 44.5, 45],
  currency: "$",
  upOdds: 68,
  downOdds: 32,
};

// Mini sparkline for visualization cards
function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120;
  const h = 40;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? "#22c55e" : "#ef4444"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

// ── Visualization card: Kurzzeit ─────────────────────────────────────────────
function KurzzeitCard() {
  return (
    <div
      className="rounded-2xl border border-border bg-surface-1 p-5 relative overflow-hidden"
      style={{ minHeight: 220 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <MarketLogo market={FAKE_BTC} size={36} />
        <div>
          <p className="text-sm font-semibold text-text-primary" style={{ fontFamily: SERIF, fontStyle: "italic" }}>Bitcoin</p>
          <p className="text-xs text-text-muted font-mono">BTC/USD · 15 Min</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-xs text-text-muted">Endet in</p>
          <p className="text-sm font-bold text-text-primary tabular-nums">08:42</p>
        </div>
      </div>

      <p className="text-2xl font-bold text-text-primary tabular-nums mb-1">$84,800</p>
      <div className="flex items-center gap-2 mb-4">
        <MiniSparkline data={FAKE_BTC.sparkline} positive={true} />
        <span className="text-xs font-semibold text-up">+1.8%</span>
      </div>

      <div className="flex gap-2">
        <div
          className="flex-1 py-2 text-center rounded-lg text-xs font-bold"
          style={{ background: "rgba(34,197,94,0.12)", color: "#22c55e" }}
        >
          Hoch 62¢
        </div>
        <div
          className="flex-1 py-2 text-center rounded-lg text-xs font-bold"
          style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
        >
          Runter 38¢
        </div>
      </div>

      {/* Floating pill */}
      <div
        className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"
        style={{ background: "rgba(196,98,45,0.15)", color: BURNT, border: `1px solid ${BURNT}44` }}
      >
        LIVE
      </div>
    </div>
  );
}

// ── Visualization card: Hebel ─────────────────────────────────────────────────
function HebelCard() {
  return (
    <div
      className="rounded-2xl border border-border bg-surface-1 p-5"
      style={{ minHeight: 220 }}
    >
      <p className="text-[11px] uppercase tracking-widest text-text-muted mb-4">Offene Position</p>

      <div className="flex items-baseline gap-2 mb-1">
        <span
          className="leading-none"
          style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 300, color: BURNT, lineHeight: 1 }}
        >
          10×
        </span>
        <span className="text-sm text-text-secondary">Hebel</span>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Einsatz</span>
          <span className="text-text-primary font-semibold tabular-nums">€ 100,00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Positionsgröße</span>
          <span className="text-text-primary font-semibold tabular-nums">€ 1.000,00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Bei +5% Bewegung</span>
          <span className="text-up font-bold tabular-nums">+€ 500,00</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Stop-Loss</span>
          <span className="text-text-secondary tabular-nums">−10% → Liquidation</span>
        </div>
      </div>

      <div className="mt-4 h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: "68%", background: "#22c55e" }} />
      </div>
      <p className="text-[10px] text-text-muted mt-1">Margin-Auslastung: 68%</p>
    </div>
  );
}

// ── Visualization card: Pre-IPO ───────────────────────────────────────────────
function PreIPOCard() {
  const curve = [38, 39, 40, 41.5, 43, 42.8, 44, 44.5, 45, 46.2];
  return (
    <div
      className="rounded-2xl border border-border bg-surface-1 p-5"
      style={{ minHeight: 220 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <MarketLogo market={FAKE_ANTH} size={36} />
        <div>
          <p className="text-sm font-semibold text-text-primary" style={{ fontFamily: SERIF, fontStyle: "italic" }}>Anthropic</p>
          <p className="text-xs text-text-muted font-mono">ANTH · Pre-IPO · Tages</p>
        </div>
      </div>

      <div className="flex items-end gap-3 mb-4">
        <div>
          <p className="text-xs text-text-muted mb-0.5">Impl. Bewertung/Anteil</p>
          <p className="text-2xl font-bold text-text-primary tabular-nums">$45,00</p>
          <span className="text-xs font-semibold text-up">+5.2% heute</span>
        </div>
        <div className="ml-auto">
          <MiniSparkline data={curve} positive={true} />
        </div>
      </div>

      <div
        className="text-[11px] px-3 py-1.5 rounded-lg"
        style={{ background: "rgba(196,98,45,0.08)", border: `1px solid ${BURNT}33` }}
      >
        <span style={{ color: BURNT }}>Nächste IPO-Runde:</span>
        <span className="text-text-muted ml-1.5">Q3 2025 erwartet</span>
      </div>
    </div>
  );
}

// ── Example card (Benji-style) ────────────────────────────────────────────────
function ExampleCard({ title, text }: { title: string; text: string }) {
  return (
    <div
      className="pl-5 py-1"
      style={{ borderLeft: `2px solid ${BURNT}` }}
    >
      <p
        className="text-[11px] uppercase tracking-widest text-text-muted mb-2"
      >
        {title}
      </p>
      <p
        className="leading-relaxed text-text-secondary"
        style={{ fontFamily: SERIF, fontSize: "1.1rem", fontStyle: "italic" }}
      >
        &ldquo;{text}&rdquo;
      </p>
    </div>
  );
}

// ── Sections data ─────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "quick",
    num: "01",
    title: "Kurzzeit-",
    titleAccent: "Märkte",
    subtitle: "Hoch oder Runter — in 5, 15 oder 60 Minuten",
    steps: [
      { title: "Markt auswählen", desc: "Wähle einen Vermögenswert: Bitcoin, Gold, Tesla, EUR/USD oder einen anderen unserer 24 Märkte." },
      { title: "Richtung vorhersagen", desc: "Geht der Preis hoch oder runter? Wähle deine Richtung und setze deinen Einsatz." },
      { title: "Einsatz festlegen", desc: "Bestimme deinen Betrag. Du siehst sofort die mögliche Auszahlung — transparent, ohne Überraschungen." },
      { title: "Ergebnis", desc: "Nach Ablauf des Zeitfensters wird abgerechnet. Richtig getippt? Gewinn sofort auf deinem Konto." },
    ],
    example: {
      title: "Beispiel-Trade",
      text: "Bitcoin bei $84.800. Du sagst Hoch für €50. 15 Minuten später: BTC bei $84.950. Dein Gewinn: €42,50.",
    },
    viz: <KurzzeitCard />,
  },
  {
    id: "leverage",
    num: "02",
    title: "Hebel-",
    titleAccent: "Trading",
    subtitle: "Multipliziere deine Position — kontrolliere dein Risiko",
    steps: [
      { title: "Position eröffnen", desc: "Wähle Long (steigend) oder Short (fallend) für jeden verfügbaren Markt." },
      { title: "Hebel einstellen", desc: "Von 1x bis 100x. Höherer Hebel bedeutet größere Position — und entsprechend höheres Risiko." },
      { title: "Stop-Loss setzen", desc: "Automatischer Schutz. Du bestimmst den maximalen Verlust, bevor du die Position öffnest." },
      { title: "Position schließen", desc: "Jederzeit manuell, oder automatisch per Stop-Loss und Take-Profit-Order." },
    ],
    example: {
      title: "Beispiel",
      text: "€100 mit 10× Hebel auf Gold Long. Position: €1.000. Gold +5% → Gewinn: €500. Bei −10% Liquidation.",
    },
    viz: <HebelCard />,
  },
  {
    id: "preipo",
    num: "03",
    title: "Pre-IPO",
    titleAccent: "Märkte",
    subtitle: "Wette auf Unternehmen vor dem Börsengang",
    steps: [
      { title: "Was sind Pre-IPO Märkte?", desc: "Handle Anteile von Unternehmen wie Anthropic, SpaceX oder Stripe — bevor sie an die Börse gehen." },
      { title: "Bewertung als Basis", desc: "Die Preise spiegeln Sekundärmarkt-Transaktionen und implizierte Bewertungen wider." },
      { title: "Tägliches Settlement", desc: "Jeden Tag ein neuer Markt. Sage vorher, ob die implizierte Bewertung steigt oder fällt." },
      { title: "Exklusiver Zugang", desc: "Normalerweise nur für institutionelle Investoren zugänglich — bei Concorde für jeden." },
    ],
    example: {
      title: "Beispiel",
      text: "Anthropic wird bei $45/Anteil gehandelt. Du setzt auf Hoch. Am nächsten Tag: $47,25. Gewinn: 5% auf deinen Einsatz.",
    },
    viz: <PreIPOCard />,
  },
];

export default function SoFunktionierts() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/* ── HEADER ───────────────────────────────────────────────────────────── */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[11px] tracking-[0.18em] uppercase text-text-muted mb-8"
          >
            concordemarket.de · Dokumentation
          </motion.p>

          <div
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(52px, 9vw, 110px)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            <div className="overflow-hidden">
              <motion.div
                initial={prefersReduced ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ ease: EASE_ED, duration: 0.85, delay: 0.15 }}
              >
                <span className="block font-light text-text-primary">So</span>
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={prefersReduced ? false : { y: "105%" }}
                animate={{ y: "0%" }}
                transition={{ ease: EASE_ED, duration: 0.85, delay: 0.28 }}
              >
                <span className="block font-light italic" style={{ color: BURNT }}>
                  funktioniert&apos;s.
                </span>
              </motion.div>
            </div>
          </div>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.52 }}
            className="mt-8 text-base text-text-secondary max-w-xl leading-relaxed"
          >
            Drei Produkttypen. Unbegrenzte Möglichkeiten. Alles, was du wissen
            musst — klar erklärt.
          </motion.p>
        </div>
      </section>

      {/* ── SECTIONS ─────────────────────────────────────────────────────────── */}
      {SECTIONS.map((section, sectionIdx) => (
        <section
          key={section.id}
          className="border-t border-border py-16 md:py-24"
          style={sectionIdx % 2 === 1 ? { background: "rgba(255,255,255,0.015)" } : {}}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section heading */}
            <SectionReveal>
              <div className="mb-12">
                <p className="text-[11px] uppercase tracking-widest text-text-muted mb-3">
                  {section.num}
                </p>
                <h2
                  className="leading-none text-text-primary"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(36px, 6vw, 72px)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {section.title}
                  <span className="italic" style={{ color: BURNT }}>
                    {section.titleAccent}
                  </span>
                </h2>
                <p className="mt-3 text-sm text-text-secondary">{section.subtitle}</p>
              </div>
            </SectionReveal>

            {/* Two-column: prose + visualization */}
            <div className="grid md:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
              {/* Left: numbered steps + example */}
              <div className="space-y-0">
                {section.steps.map((step, i) => (
                  <SectionReveal key={step.title} delay={i * 0.08}>
                    <div className="flex gap-5 py-5 border-b border-border last:border-b-0">
                      <span
                        className="flex-shrink-0 tabular-nums leading-none mt-1"
                        style={{
                          fontFamily: SERIF,
                          fontSize: "2.5rem",
                          fontWeight: 300,
                          color: BURNT,
                          opacity: 0.5,
                          lineHeight: 1,
                          minWidth: "2.5rem",
                        }}
                      >
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-text-primary text-sm mb-1.5">{step.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </SectionReveal>
                ))}

                <SectionReveal delay={0.35}>
                  <div className="mt-8">
                    <ExampleCard title={section.example.title} text={section.example.text} />
                  </div>
                </SectionReveal>
              </div>

              {/* Right: visualization card */}
              <SectionReveal delay={0.2}>
                <div className="sticky top-24">
                  {section.viz}
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      ))}

      {/* ── RISK WARNING ─────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="pl-5" style={{ borderLeft: `2px solid rgba(239,68,68,0.4)` }}>
              <p
                className="text-xs uppercase tracking-widest mb-3"
                style={{ color: "#ef4444", opacity: 0.7 }}
              >
                Risikohinweis
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">
                Der Handel mit Derivaten und Hebelprodukten birgt erhebliche Risiken.
                Du kannst mehr als deine ursprüngliche Einlage verlieren. Diese Produkte
                sind nicht für alle Anleger geeignet.
              </p>
              <ul className="text-sm text-text-muted space-y-1.5">
                <li>Hebelprodukte sind komplex und mit hohem Verlustrisiko verbunden.</li>
                <li>74–89% der Kleinanlegerkonten verlieren Geld beim Handel mit CFDs.</li>
                <li>Investiere nur, was du bereit bist vollständig zu verlieren.</li>
              </ul>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionReveal>
            <p
              className="text-text-primary leading-tight mb-10"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(28px, 4.5vw, 52px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Bereit, loszulegen?
              <br />
              <span style={{ color: BURNT }}>Account in 60 Sekunden.</span>
            </p>

            <Link
              href="/registrierung"
              data-event="register_click"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: BURNT }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BURNT)}
            >
              Jetzt registrieren
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
