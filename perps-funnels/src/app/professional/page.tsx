"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { EmailForm } from "@/components/EmailForm";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const; // slower, more deliberate

// ─── Count-up number component ───────────────────────────────────────────────
function CountUp({
  to,
  suffix = "",
  duration = 1.4,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) {
      setValue(to);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, to, duration, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}

// ─── Word-gate reveal ─────────────────────────────────────────────────────────
function WordGate({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ ease: EASE_EDITORIAL, duration: 0.85, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const COMPARISON = [
  {
    feature: "Handelszeiten",
    concorde: "24 / 7",
    traditional: "Mo–Fr, 9–17 Uhr",
  },
  { feature: "Hebel", concorde: "bis 100×", traditional: "bis 5×" },
  {
    feature: "Settlement",
    concorde: "Sofortig",
    traditional: "T+2 Tage",
  },
  {
    feature: "Ablaufdatum",
    concorde: "Keins — Perpetual",
    traditional: "Festes Quartalsende",
  },
  {
    feature: "Gebühren",
    concorde: "ab 0,01 %",
    traditional: "0,1 % – 1 %",
  },
  {
    feature: "Mindesteinlage",
    concorde: "Keine",
    traditional: "€500 – €10.000",
  },
];

const MARKETS = [
  {
    name: "Krypto",
    examples: "BTC · ETH · SOL",
    desc: "Rund um die Uhr, keine Börsenzeiten.",
  },
  {
    name: "Aktien",
    examples: "AAPL · TSLA · NVDA",
    desc: "Perpetuals auf US- und EU-Titel.",
  },
  {
    name: "Rohstoffe",
    examples: "Gold · Silber · Öl",
    desc: "Macro-Exposure ohne physischen Kauf.",
  },
  {
    name: "Indizes",
    examples: "DAX · S&P 500 · NASDAQ",
    desc: "Trade das Gesamtmarkt-Sentiment.",
  },
  {
    name: "Forex",
    examples: "EUR/USD · GBP/JPY",
    desc: "Deep-liquidity FX Perpetuals.",
  },
];

const TRUST = [
  {
    label: "MiFID II",
    title: "EU-reguliert",
    desc: "Vollständig lizenziert nach europäischen Standards. Transparente Compliance.",
  },
  {
    label: "Tier 1",
    title: "Segregierte Konten",
    desc: "Kundengelder strikt getrennt. Verwahrt bei Tier-1-Banken.",
  },
  {
    label: "256-bit",
    title: "Enterprise Security",
    desc: "Multi-Sig Cold Storage, 2FA-Pflicht und kontinuierliche Audits.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfessionalFunnel() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      data-funnel="professional"
      className="min-h-screen text-[#1a1a1a]"
      style={{ backgroundColor: "#f5f3ef" }}
    >
      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav className="px-6 sm:px-10 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#1a1a1a]"
            aria-hidden="true"
          >
            <path
              d="M2 18L10 6L14 12L22 4"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="22" cy="4" r="1.5" fill="currentColor" />
          </svg>
          <span
            className="font-semibold text-sm tracking-tight text-[#1a1a1a]"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Concorde
          </span>
        </div>
        <span className="text-[11px] text-[#999] tracking-wide hidden sm:block">
          EU-reguliert · Institutionelle Infrastruktur
        </span>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 pt-16 sm:pt-24 pb-28 max-w-6xl mx-auto"
        style={{
          background:
            "radial-gradient(ellipse at 80% 10%, rgba(196,98,45,0.045) 0%, transparent 55%)",
        }}
      >
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.6, delay: 0.1 }}
            className="text-[11px] tracking-[0.18em] uppercase text-[#999] mb-10"
          >
            Concorde · Perpetual Contracts · Beta 2025
          </motion.p>

          {/* Giant Cormorant headline — word-gate reveal */}
          <h1
            className="leading-none mb-10"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(72px, 12vw, 148px)",
              letterSpacing: "-0.02em",
            }}
            aria-label="Perpetual Contracts."
          >
            <WordGate delay={0.15} className="block">
              <span className="font-light text-[#1a1a1a]">Perpetual</span>
            </WordGate>
            <WordGate delay={0.28} className="block">
              <span
                className="font-light italic"
                style={{ color: "#c4622d" }}
              >
                Contracts.
              </span>
            </WordGate>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.6, delay: 0.52 }}
            className="text-[#666] text-lg sm:text-xl leading-relaxed max-w-xl mb-12"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Die Infrastruktur, die institutionelle Trader seit Jahren nutzen.
            Jetzt zugänglich — ohne Kompromisse.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.55, delay: 0.64 }}
            className="max-w-md"
          >
            <EmailForm
              variant="professional"
              ctaText="Early Access anfragen"
              placeholder="Deine E-Mail-Adresse"
            />
            <p className="text-[11px] text-[#aaa] mt-3">
              Kostenlos. Keine Kreditkarte. Keine Verpflichtung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PULL QUOTE ───────────────────────────────────── */}
      <section
        className="py-20 px-6 sm:px-10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ease: EASE_EDITORIAL, duration: 0.8 }}
            className="border-l-2 pl-8"
            style={{ borderColor: "#c4622d" }}
          >
            <p
              className="text-[#f5f3ef] leading-tight mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              &ldquo;The first truly accessible perps venue in Europe.&rdquo;
            </p>
            <p className="text-[#555] text-xs tracking-widest uppercase">
              — Concorde, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── KINETIC STATS ────────────────────────────────── */}
      <section className="px-6 sm:px-10 py-24 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-12 gap-x-8">
          {[
            { to: 24, suffix: "/7", label: "Handel rund um die Uhr" },
            { to: 100, suffix: "×", label: "Maximaler Hebel" },
            { to: 0, suffix: "s", label: "Settlement-Verzögerung" },
            { to: null, label: "Kein Ablaufdatum", symbol: "∞" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ease: EASE_EDITORIAL, duration: 0.7, delay: i * 0.1 }}
              className="space-y-3"
            >
              <div
                className="tabular-nums leading-none"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(52px, 8vw, 88px)",
                  fontWeight: 300,
                  color: "#1a1a1a",
                  letterSpacing: "-0.02em",
                }}
                aria-label={stat.label}
              >
                {stat.to !== null ? (
                  <CountUp to={stat.to} suffix={stat.suffix} duration={1.2} />
                ) : (
                  <span style={{ color: "#c4622d" }}>{stat.symbol}</span>
                )}
              </div>
              <p
                className="text-xs text-[#999] leading-snug"
                style={{ fontFamily: "var(--font-sans)" }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── EDITORIAL: WHAT ARE PERPS ────────────────────── */}
      <section
        className="px-6 sm:px-10 py-20 border-t"
        style={{ borderColor: "#e8e4dd", backgroundColor: "#f0ece6" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-12 items-start">
            {/* Left: large statement */}
            <div className="sm:col-span-2">
              <motion.p
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ ease: EASE_EDITORIAL, duration: 0.8 }}
                className="text-[#1a1a1a] leading-tight"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px, 4.5vw, 52px)",
                  fontWeight: 300,
                  fontStyle: "italic",
                }}
              >
                Handle auf Kursbewegungen.
                <br />
                Ohne das Asset zu besitzen.
                <br />
                Rund um die Uhr.
              </motion.p>
            </div>
            {/* Right: body */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: EASE_EDITORIAL, duration: 0.8, delay: 0.15 }}
              className="space-y-4"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <p className="text-xs text-[#aaa] uppercase tracking-widest mb-5">
                Was sind Perpetuals?
              </p>
              <p className="text-[#555] leading-relaxed text-sm">
                Perpetual Contracts sind Derivate ohne Ablaufdatum. Du
                spekulierst auf den Preis eines Assets — Long oder Short — mit
                einstellbarem Hebel. Kein Besitz, kein Settlement-Datum, volle
                Kontrolle.
              </p>
              <p className="text-[#555] leading-relaxed text-sm">
                Im Gegensatz zu traditionellen Futures musst du keine Positionen
                vor Quartalsende schließen. Du tradest wann du willst, so lange
                du willst.
              </p>
              <div
                className="border-t pt-4 mt-4"
                style={{ borderColor: "#ddd" }}
              >
                <p className="text-[11px] text-[#aaa] uppercase tracking-widest">
                  Genutzt von
                </p>
                <p
                  className="text-[#1a1a1a] mt-1 font-medium text-sm"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  Hedge Funds · Prop Traders · Institutionelle Desks
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON ───────────────────────────────────── */}
      <section className="px-6 sm:px-10 py-24 max-w-6xl mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE_EDITORIAL, duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-[11px] text-[#aaa] uppercase tracking-widest mb-4">
            Der Vergleich
          </p>
          <h2
            className="text-[#1a1a1a] leading-tight"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 300,
            }}
          >
            Concorde vs. Traditioneller Broker
          </h2>
        </motion.div>

        {/* Two-card comparison */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Traditional */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ease: EASE_EDITORIAL, duration: 0.7, delay: 0.05 }}
            className="rounded-2xl border overflow-hidden"
            style={{
              borderColor: "#ddd",
              backgroundColor: "#eeebe6",
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: "#ddd" }}
            >
              <p className="text-xs uppercase tracking-widest text-[#aaa]">
                Traditioneller Broker
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: "#e0dcd6" }}>
              {COMPARISON.map((row) => (
                <div key={row.feature} className="px-6 py-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-[#bbb]">
                    {row.feature}
                  </p>
                  <p
                    className="text-[#aaa] line-through text-sm"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {row.traditional}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Concorde */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ease: EASE_EDITORIAL, duration: 0.7, delay: 0.12 }}
            className="rounded-2xl border-2 overflow-hidden"
            style={{
              borderColor: "#c4622d",
              backgroundColor: "#f5f3ef",
            }}
          >
            <div
              className="px-6 py-4 border-b"
              style={{ borderColor: "#e8ddd5" }}
            >
              <p
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "#c4622d" }}
              >
                Concorde
              </p>
            </div>
            <div className="divide-y" style={{ borderColor: "#e8ddd5" }}>
              {COMPARISON.map((row, i) => (
                <motion.div
                  key={row.feature}
                  initial={prefersReduced ? false : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ease: EASE, duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="px-6 py-4 space-y-1 group cursor-default"
                >
                  <p className="text-[10px] uppercase tracking-wider text-[#bbb]">
                    {row.feature}
                  </p>
                  <p
                    className="text-[#1a1a1a] font-semibold text-sm transition-colors duration-200 group-hover:text-[#c4622d]"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {row.concorde}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── MARKETS ──────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 py-20 border-t"
        style={{ borderColor: "#e8e4dd" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_EDITORIAL, duration: 0.7 }}
            className="mb-12 flex items-end justify-between gap-8"
          >
            <h2
              className="text-[#1a1a1a]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(32px, 4.5vw, 52px)",
                fontWeight: 300,
              }}
            >
              Alle Märkte.
              <br />
              <span className="italic" style={{ color: "#c4622d" }}>
                Eine Plattform.
              </span>
            </h2>
          </motion.div>

          <div className="space-y-0 divide-y" style={{ borderColor: "#e8e4dd" }}>
            {MARKETS.map((market, i) => (
              <motion.div
                key={market.name}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ ease: EASE, duration: 0.45, delay: i * 0.08 }}
                className="group grid grid-cols-3 sm:grid-cols-4 items-center py-5 cursor-default"
              >
                <p
                  className="font-semibold text-[#1a1a1a] text-sm col-span-1 transition-colors duration-200 group-hover:text-[#c4622d]"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {market.name}
                </p>
                <p
                  className="font-mono text-[#aaa] text-xs col-span-1 tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {market.examples}
                </p>
                <p className="text-[#bbb] text-xs hidden sm:block col-span-2">
                  {market.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST ────────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 py-24 border-t"
        style={{ borderColor: "#e8e4dd", backgroundColor: "#f0ece6" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ease: EASE, duration: 0.6 }}
            className="text-[11px] text-[#aaa] uppercase tracking-widest mb-14"
          >
            Sicherheit & Regulierung
          </motion.p>
          <div className="grid sm:grid-cols-3 gap-10">
            {TRUST.map((item, i) => (
              <motion.div
                key={item.title}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ease: EASE_EDITORIAL, duration: 0.7, delay: i * 0.12 }}
                className="space-y-4 group"
              >
                {/* Large label */}
                <p
                  className="transition-colors duration-300 group-hover:opacity-80"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(36px, 5vw, 52px)",
                    fontWeight: 300,
                    color: "#c4622d",
                    lineHeight: 1,
                  }}
                >
                  {item.label}
                </p>
                <div
                  className="h-px w-8 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: "#c4622d" }}
                />
                <h3
                  className="font-semibold text-[#1a1a1a] text-sm"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#888] text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 py-28"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_EDITORIAL, duration: 0.8 }}
            className="space-y-10"
          >
            <h2
              className="leading-tight"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 300,
                color: "#f5f3ef",
                letterSpacing: "-0.01em",
              }}
            >
              Bereit für die nächste
              <br />
              <span className="italic" style={{ color: "#c4622d" }}>
                Generation des Tradings?
              </span>
            </h2>

            <div className="max-w-md">
              <EmailForm
                variant="professional"
                ctaText="Early Access anfragen"
                placeholder="Deine E-Mail-Adresse"
              />
              <p className="text-[11px] text-[#555] mt-3">
                Kostenlos. Keine Kreditkarte. Keine Verpflichtung.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER / DISCLAIMER ──────────────────────────── */}
      <footer
        className="px-6 sm:px-10 py-12 border-t"
        style={{ borderColor: "#2a2a2a", backgroundColor: "#1a1a1a" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-7">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="text-[#444]"
              aria-hidden="true"
            >
              <path
                d="M2 18L10 6L14 12L22 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="4" r="1.5" fill="currentColor" />
            </svg>
            <span
              className="text-[#444] text-xs tracking-tight font-semibold"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              Concorde
            </span>
          </div>
          <p
            className="text-[10px] text-[#444] leading-relaxed max-w-2xl"
            style={{ fontFamily: "var(--font-sans)" }}
          >
            Risikohinweis: Der Handel mit Derivaten und Hebelprodukten ist spekulativ und
            birgt ein hohes Verlustrisiko. Du kannst mehr als deine ursprüngliche Einlage
            verlieren. Diese Produkte sind nicht für alle Anleger geeignet. Bitte stelle
            sicher, dass du die damit verbundenen Risiken vollständig verstehst, bevor du
            handelst. Vergangene Wertentwicklungen sind kein verlässlicher Indikator für
            zukünftige Ergebnisse. Concorde — Perpetual Contracts.
          </p>
        </div>
      </footer>
    </div>
  );
}
