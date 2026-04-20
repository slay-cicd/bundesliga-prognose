"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionReveal } from "@/components/SectionReveal";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// ─── Word-gate reveal — same pattern as main site ────────────────────────────
function WordGate({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="overflow-hidden leading-none">
      <motion.div
        initial={prefersReduced ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ ease: EASE_ED, duration: 0.85, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Inline email capture with burnt-orange CTA ──────────────────────────────
function EmailCapture({ ctaText = "Früher Zugang sichern" }: { ctaText?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Deine E-Mail-Adresse"
              required
              className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none"
              style={{
                background: "#18181b",
                border: "1px solid #2a2a2d",
                color: "#e5e5e7",
                colorScheme: "dark",
              }}
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap text-white transition-all duration-150"
              style={{ background: BURNT }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
            >
              {ctaText}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md text-center p-6 rounded-2xl"
          style={{
            background: "rgba(196,98,45,0.08)",
            border: "1px solid rgba(196,98,45,0.25)",
          }}
        >
          <svg
            className="w-8 h-8 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BURNT}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          <p className="font-bold text-sm mb-1" style={{ color: BURNT }}>
            Anfrage eingegangen.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Wir melden uns, sobald Early Access verfügbar ist.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const VALUE_PROPS = [
  {
    num: "01",
    title: "Keine Verfallstage",
    body: "Klassische Derivate verfallen — Quartals-Futures, monatliche Optionen. Perpetuals nicht. Eröffne eine Position und halte sie 3 Sekunden oder 3 Jahre. Du entscheidest wann du schließt, nicht der Kalender.",
  },
  {
    num: "02",
    title: "Alle Asset-Klassen",
    body: "Krypto, Aktien, Rohstoffe, Indizes, Forex — ein Account, ein Instrument. Kein Broker-Hopping, keine Depotgebühren-Wirrwarr, keine Fractional-Share-Tricks. Eine Plattform für alles.",
  },
  {
    num: "03",
    title: "Hebel, wie du ihn willst",
    body: "2× bis 100×, jederzeit anpassbar. Kein Margin-Call-Spiel wie bei CFDs, kein Fonds-Tracking-Error. Du kontrollierst dein Risiko auf den Cent — mit klarem Liquidationspreis immer sichtbar.",
  },
  {
    num: "04",
    title: "Sofort-Settlement",
    body: "Keine T+2 Wartezeit wie beim traditionellen Broker. Position schließt — Gewinn ist sofort auf deinem Konto. Echte Liquidität, echter Zugriff zu jeder Zeit.",
  },
  {
    num: "05",
    title: "Kostenstruktur wie Crypto-Exchanges",
    body: "Ab 0,01% Gebühren. Kein 1%-CFD-Spread, kein 2%-Börsengang-Aufschlag. Transparente Funding-Rates, keine versteckten Kosten — alles offen einsehbar.",
  },
];

const COMPARISON = [
  {
    feature: "Verfallsdatum",
    concorde: "Keins — Perpetual",
    traditional: "Quartals- / Monatsende",
  },
  {
    feature: "Asset-Klassen",
    concorde: "Krypto, Aktien, Rohstoffe, Indizes, Forex",
    traditional: "Meist 1–2 Klassen",
  },
  { feature: "Settlement", concorde: "Sofortig", traditional: "T+2 Tage" },
  {
    feature: "Mindestgebühr",
    concorde: "ab 0,01 %",
    traditional: "0,1 % – 2 %",
  },
  {
    feature: "Mindesteinlage",
    concorde: "Keine",
    traditional: "€500 – €10.000",
  },
  {
    feature: "Handelszeiten",
    concorde: "24 / 7, 365 Tage",
    traditional: "Mo–Fr, 9–17 Uhr",
  },
];

const MARKETS = [
  { label: "Krypto", detail: "BTC, ETH, SOL und mehr", icon: "₿" },
  { label: "Aktien", detail: "TSLA, NVDA, AAPL", icon: "◈" },
  { label: "Rohstoffe", detail: "Gold, Öl, Silber", icon: "◆" },
  { label: "Indizes", detail: "S&P 500, DAX, Nasdaq", icon: "▲" },
  { label: "Forex", detail: "EUR/USD, GBP/USD", icon: "⟳" },
];

const TRUST = [
  { label: "EU-reguliert", detail: "MiFID II lizenziert" },
  { label: "MiCA-konform", detail: "EU Krypto-Rahmen" },
  { label: "Kapital segregiert", detail: "Getrennt vom Betriebsvermögen" },
  { label: "Sofort-Auszahlung", detail: "Kein T+2, kein Warten" },
];

export default function Funnel1Page() {
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/* Radial glow — same as main site */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 60% 0%, rgba(196,98,45,0.07) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="relative z-10 px-5 sm:px-8 py-6 max-w-7xl mx-auto flex items-center justify-between border-b border-border">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: SERIF,
            fontSize: "1.5rem",
            fontWeight: 300,
            letterSpacing: "0.04em",
            color: "#e5e5e7",
          }}
        >
          Concorde
        </motion.div>
        <div
          className="hidden sm:flex items-center gap-5 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span>EU-reguliert &middot; MiFID II</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
            Live
          </span>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-14 pb-14 md:pt-32 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <h1
            className="mb-8"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(52px, 11vw, 144px)",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
            aria-label="Perpetual Contracts. Die neue Form des Derivatehandels."
          >
            <WordGate delay={0.15}>
              <span className="block font-light text-text-primary">Perpetual</span>
            </WordGate>
            <WordGate delay={0.28}>
              <span className="block font-light italic" style={{ color: BURNT }}>
                Contracts.
              </span>
            </WordGate>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.6, delay: 0.5 }}
            className="font-light mb-3 max-w-xl leading-tight"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.5vw, 30px)",
              color: "var(--color-text-primary)",
            }}
          >
            Die neue Form des Derivatehandels.
          </motion.p>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.6, delay: 0.6 }}
            className="text-base mb-10 max-w-lg leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Schneller, flexibler und günstiger als traditionelle Derivate. Krypto,
            Aktien, Rohstoffe, Indizes — eine Plattform. EU-reguliert.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.5, delay: 0.7 }}
          >
            <EmailCapture ctaText="Früher Zugang sichern" />
            <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
              Keine Kreditkarte &middot; Keine Mindesteinlage &middot; MiFID II lizenziert
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 md:gap-10">
            {[
              { val: "24 / 7", label: "Handelszeiten" },
              { val: "100×", label: "Max. Hebel" },
              { val: "Sofort", label: "Settlement" },
              { val: "< 0,01%", label: "Min. Gebühren" },
            ].map((s, i) => (
              <SectionReveal key={s.label} delay={i * 0.06}>
                <div>
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(28px, 4vw, 48px)",
                      fontWeight: 300,
                      lineHeight: 1,
                      color: BURNT,
                    }}
                  >
                    {s.val}
                  </p>
                  <p
                    className="text-[10px] mt-2 uppercase tracking-widest"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {s.label}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── VALUE PROPS ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-12 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-10 md:mb-14">
              <p
                className="text-[11px] uppercase tracking-widest mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Warum Perpetuals
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(36px, 5vw, 64px)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="text-text-primary">Derivate,</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  neu gedacht.
                </span>
              </h2>
            </div>
          </SectionReveal>

          <div className="space-y-0">
            {VALUE_PROPS.map((vp, i) => (
              <SectionReveal key={vp.num} delay={i * 0.07}>
                <div className="py-8 border-b border-border last:border-b-0 grid gap-6 md:grid-cols-[80px_220px_1fr] md:gap-10 lg:gap-16 items-start">
                  <span
                    className="tabular-nums flex-shrink-0"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "2.5rem",
                      fontWeight: 300,
                      color: BURNT,
                      opacity: 0.4,
                      lineHeight: 1,
                    }}
                  >
                    {vp.num}
                  </span>
                  <h3
                    className="font-light flex-shrink-0 text-text-primary"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(18px, 2vw, 24px)",
                      lineHeight: 1.2,
                    }}
                  >
                    {vp.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {vp.body}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── COMPARISON ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-12 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-10 md:mb-12">
              <p
                className="text-[11px] uppercase tracking-widest mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Vergleich
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                <span className="text-text-primary">Concorde vs.</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  Traditionelle Broker.
                </span>
              </h2>
            </div>
          </SectionReveal>

          {/* Table — overflow-x-auto for safety on narrow screens */}
          <div className="overflow-x-auto -mx-1">
            <div className="min-w-[480px] mx-1">
              {/* Table header */}
              <div
                className="grid gap-4 pb-3 border-b border-border"
                style={{ gridTemplateColumns: "1.5fr 1fr 1fr" }}
              >
                <span />
                <p
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: BURNT }}
                >
                  Concorde
                </p>
                <p
                  className="text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Traditionell
                </p>
              </div>

              {COMPARISON.map((row, i) => (
                <SectionReveal key={row.feature} delay={i * 0.06}>
                  <div
                    className="grid gap-4 py-4 border-b border-border items-center"
                    style={{ gridTemplateColumns: "1.5fr 1fr 1fr" }}
                  >
                    <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                      {row.feature}
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {row.concorde}
                    </span>
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {row.traditional}
                    </span>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── MARKETS STRIP ────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <div className="mb-10">
              <p
                className="text-[11px] uppercase tracking-widest mb-3"
                style={{ color: "var(--color-text-muted)" }}
              >
                Märkte
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="text-text-primary">Alle Klassen.</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  Eine Plattform.
                </span>
              </h2>
            </div>
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MARKETS.map((m, i) => (
              <SectionReveal key={m.label} delay={i * 0.06}>
                <div
                  className="rounded-xl p-5 border border-border"
                  style={{ background: "var(--color-surface-1)" }}
                >
                  <p
                    className="mb-2 leading-none"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "1.8rem",
                      fontWeight: 300,
                      color: BURNT,
                    }}
                  >
                    {m.icon}
                  </p>
                  <p className="text-sm font-semibold text-text-primary mb-0.5">
                    {m.label}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {m.detail}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── TRUST STRIP ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 py-2">
            {TRUST.map((t, i) => (
              <SectionReveal key={t.label} delay={i * 0.07}>
                <div className="pl-4" style={{ borderLeft: `2px solid ${BURNT}` }}>
                  <p className="text-sm font-semibold text-text-primary">{t.label}</p>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {t.detail}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      <div className="relative z-10 border-t border-border" />

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-14 md:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <p
              className="leading-tight text-text-primary mb-10 text-center"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(32px, 5vw, 58px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Die Zukunft des
              <br />
              <span style={{ color: BURNT }}>Derivatehandels.</span>
            </p>
            <div className="flex justify-center">
              <EmailCapture ctaText="Früher Zugang sichern" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── RISK DISCLAIMER ──────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-text-secondary)" }}>Risikohinweis:</strong>{" "}
            Perpetual Contracts sind komplexe Finanzinstrumente mit erheblichem Verlustrisiko.
            Hebel-Trading kann zu Verlusten führen, die Ihren gesamten eingesetzten Betrag
            übersteigen. Diese Produkte sind nicht für alle Anleger geeignet. Kapital in
            segregierten Konten. Concorde ist reguliert gemäß MiFID II.
          </p>
        </div>
      </section>
    </>
  );
}
