"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { FunnelEmailForm } from "@/components/FunnelEmailForm";
import { FunnelCountdown } from "@/components/FunnelCountdown";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_SNAP = [0.16, 1, 0.3, 1] as const;

// ─── Design tokens (public.com — crisp white + deep navy) ─────────────────
const T = {
  // backgrounds
  heroBg: "#060A14",
  heroBg2: "#0C1220",
  bg: "#FFFFFF",
  bgAlt: "#F5F7FB",
  bgAlt2: "#EEF1F8",

  // text
  text: "#0B0E1A",
  textMuted: "#677090",
  textDim: "#9BA4BC",
  heroText: "#EEF0F8",
  heroMuted: "#4E5A78",

  // borders
  border: "#E1E5F0",
  borderHero: "#1A2035",

  // accent (indigo/purple)
  indigo: "#4245E5",
  indigoDim: "rgba(66,69,229,0.08)",
  indigoMid: "rgba(66,69,229,0.18)",
  indigoBright: "#5B5EF5",

  // signal
  up: "#08B87A",
  upDim: "rgba(8,184,122,0.1)",
  down: "#E84040",
  downDim: "rgba(232,64,64,0.1)",

  sans: "var(--font-f1-sans), system-ui, sans-serif",
  mono: "'SF Mono', 'Fira Code', monospace",
};

// ─── Count-up component ────────────────────────────────────────────────────
function CountUp({ to, suffix = "", duration = 1.2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReduced) { setValue(to); return; }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      setValue(Math.round((1 - Math.pow(1 - t, 3)) * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, to, duration, prefersReduced]);

  return <span ref={ref}>{value}{suffix}</span>;
}

// ─── Data ──────────────────────────────────────────────────────────────────
const COMPARISON = [
  { feature: "Handelszeiten", concorde: "24 / 7", traditional: "Mo–Fr, 9–17 Uhr" },
  { feature: "Hebel", concorde: "bis 100×", traditional: "bis 5×" },
  { feature: "Settlement", concorde: "Sofortig", traditional: "T+2 Tage" },
  { feature: "Ablaufdatum", concorde: "Keins — Perpetual", traditional: "Festes Quartalsende" },
  { feature: "Gebühren", concorde: "ab 0,01 %", traditional: "0,1 % – 1 %" },
  { feature: "Mindesteinlage", concorde: "Keine", traditional: "€500 – €10.000" },
];

const MARKETS = [
  { name: "Krypto", examples: "BTC · ETH · SOL", desc: "24/7, keine Börsenzeiten." },
  { name: "Aktien", examples: "AAPL · TSLA · NVDA", desc: "Perpetuals auf US- und EU-Titel." },
  { name: "Rohstoffe", examples: "Gold · Silber · Öl", desc: "Macro-Exposure ohne physischen Kauf." },
  { name: "Indizes", examples: "DAX · S&P 500 · Nasdaq", desc: "Trade das Gesamtmarkt-Sentiment." },
  { name: "Forex", examples: "EUR/USD · GBP/JPY", desc: "Deep-Liquidity FX Perpetuals." },
];

const FEATURES = [
  {
    n: "01",
    title: "Kein Ablaufdatum",
    desc: "Perpetuals verfallen nie. Trade so lange du willst, ohne Position wechseln zu müssen.",
  },
  {
    n: "02",
    title: "Bis zu 100× Hebel",
    desc: "Steuere große Positionen mit kleinem Kapital. Hebel von 2× bis 100× frei wählbar.",
  },
  {
    n: "03",
    title: "Long & Short",
    desc: "Profitiere von steigenden und fallenden Kursen. Beide Richtungen, jederzeit.",
  },
  {
    n: "04",
    title: "Sofort-Settlement",
    desc: "Kein T+2 Warten. Gewinne werden direkt auf deinem Konto gutgeschrieben.",
  },
  {
    n: "05",
    title: "Alle Märkte",
    desc: "Krypto, Aktien, Gold, Indizes, Forex — alles auf einer Plattform.",
  },
];

const TRUST = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "MiFID II",
    title: "EU-reguliert",
    desc: "Vollständig lizenziert nach europäischen Standards. Transparente Compliance.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
    label: "Tier 1",
    title: "Segregierte Konten",
    desc: "Kundengelder strikt getrennt. Verwahrt bei Tier-1-Banken.",
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
    ),
    label: "256-bit",
    title: "Enterprise Security",
    desc: "Multi-Sig Cold Storage, 2FA-Pflicht und kontinuierliche Audits.",
  },
];

export default function Funnel1Page() {
  const prefersReduced = useReducedMotion();

  return (
    <div data-funnel="pro1" style={{ fontFamily: T.sans }}>
      {/* ═══════════════════════════════════════════════════
          DARK HERO (public.com — "Investing for those
          who take it seriously")
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: T.heroBg }}>
        {/* Nav */}
        <nav className="px-6 sm:px-10 pt-6 pb-0 max-w-5xl mx-auto flex items-center justify-between">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 18L10 6L14 12L22 4" stroke={T.heroText} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="4" r="1.5" fill={T.heroText} />
            </svg>
            <span className="text-sm font-semibold tracking-tight" style={{ color: T.heroText }}>
              Concorde
            </span>
          </motion.div>
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.1 }}
            className="hidden sm:flex items-center gap-4 text-[11px]"
            style={{ color: T.heroMuted }}
          >
            <span>EU-reguliert</span>
            <span style={{ color: T.borderHero }}>·</span>
            <span>Institutionelle Infrastruktur</span>
          </motion.div>
        </nav>

        {/* Hero content */}
        <div className="px-6 sm:px-10 pt-16 sm:pt-24 pb-24 sm:pb-32 max-w-5xl mx-auto">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.12 }}
            className="text-[10px] tracking-[0.22em] uppercase mb-8"
            style={{ color: T.heroMuted }}
          >
            Concorde · Perpetual Contracts · Beta 2025
          </motion.p>

          {/* BIG headline */}
          <h1 className="mb-10" aria-label="Perps für die, die es ernst meinen.">
            <div className="overflow-hidden">
              <motion.span
                initial={prefersReduced ? false : { y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ ease: EASE_SNAP, duration: 0.75, delay: 0.18 }}
                className="block"
                style={{
                  fontFamily: T.sans,
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7vw, 80px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: T.heroText,
                }}
              >
                Perps für die,
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span
                initial={prefersReduced ? false : { y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ ease: EASE_SNAP, duration: 0.75, delay: 0.3 }}
                className="block"
                style={{
                  fontFamily: T.sans,
                  fontWeight: 300,
                  fontSize: "clamp(40px, 7vw, 80px)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: T.heroText,
                }}
              >
                die es{" "}
                <span style={{ fontWeight: 600, color: T.indigoBright }}>ernst meinen.</span>
              </motion.span>
            </div>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.6, delay: 0.48 }}
            className="text-base sm:text-lg leading-relaxed max-w-lg mb-10"
            style={{ color: T.heroMuted }}
          >
            Die Infrastruktur, die institutionelle Trader seit Jahren nutzen —
            jetzt zugänglich. Ohne Kompromisse.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.55, delay: 0.58 }}
            className="max-w-md"
          >
            <FunnelEmailForm variant="dark" ctaText="Early Access anfragen" placeholder="Deine E-Mail-Adresse" />
            <div className="mt-4 flex items-center gap-4">
              <FunnelCountdown theme="navy" />
              <span className="text-[11px]" style={{ color: "#2E3A56" }}>·</span>
              <span className="text-[11px]" style={{ color: T.heroMuted }}>
                Kostenlos. Keine Kreditkarte.
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS BAR (big numbers, tabular)
      ════════════════════════════════════════════════════ */}
      <section
        className="px-6 sm:px-10 py-16"
        style={{ backgroundColor: T.bg, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-8">
            {[
              { to: 24, suffix: "/7", label: "Handel rund um die Uhr" },
              { to: 100, suffix: "×", label: "Maximaler Hebel" },
              { to: 0, suffix: " Tage", label: "Settlement-Verzögerung" },
              { special: "0 €", label: "Mindesteinlage" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ease: EASE_SNAP, duration: 0.55, delay: i * 0.08 }}
                className="space-y-2"
              >
                <p
                  className="leading-none tabular-nums"
                  style={{
                    fontFamily: T.sans,
                    fontWeight: 700,
                    fontSize: "clamp(36px, 6vw, 56px)",
                    letterSpacing: "-0.02em",
                    color: T.text,
                    fontFeatureSettings: '"tnum"',
                  }}
                >
                  {"special" in stat ? (
                    stat.special
                  ) : (
                    <CountUp to={stat.to!} suffix={stat.suffix} duration={1.0} />
                  )}
                </p>
                <p className="text-xs" style={{ color: T.textMuted }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT ARE PERPS (editorial two-column)
      ════════════════════════════════════════════════════ */}
      <section
        className="px-6 sm:px-10 py-20"
        style={{ backgroundColor: T.bgAlt, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: EASE_SNAP, duration: 0.6 }}
            >
              <p className="text-[10px] tracking-[0.2em] uppercase mb-6" style={{ color: T.textDim }}>
                Was sind Perpetuals?
              </p>
              <h2
                className="leading-tight mb-6"
                style={{
                  fontFamily: T.sans,
                  fontWeight: 600,
                  fontSize: "clamp(26px, 4vw, 40px)",
                  letterSpacing: "-0.02em",
                  color: T.text,
                }}
              >
                Handle auf Kursbewegungen.
                <br />Ohne das Asset zu besitzen.
                <br />Rund um die Uhr.
              </h2>
            </motion.div>
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: EASE_SNAP, duration: 0.6, delay: 0.12 }}
              className="space-y-4 pt-2 sm:pt-8"
            >
              <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>
                Perpetual Contracts sind Derivate ohne Ablaufdatum. Du spekulierst auf den Preis
                eines Assets — Long oder Short — mit einstellbarem Hebel. Kein Besitz, kein
                Settlement-Datum, volle Kontrolle.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>
                Im Gegensatz zu traditionellen Futures musst du keine Positionen vor Quartalsende
                schließen. Du tradest wann du willst, so lange du willst.
              </p>
              <div
                className="mt-6 rounded-xl p-4"
                style={{ background: T.indigoDim, border: `1px solid ${T.indigoMid}` }}
              >
                <p className="text-xs font-medium" style={{ color: T.indigo }}>
                  €10 Einsatz bei 50× Hebel = €500 Position.
                  Bei +2 % Kurs: +€10 Gewinn = 100 % Rendite.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          COMPARISON TABLE
      ════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-10 py-20" style={{ backgroundColor: T.bg }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SNAP, duration: 0.55 }}
            className="mb-10"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: T.textDim }}>
              Der Vergleich
            </p>
            <h2
              style={{
                fontFamily: T.sans,
                fontWeight: 600,
                fontSize: "clamp(22px, 3.5vw, 36px)",
                letterSpacing: "-0.02em",
                color: T.text,
              }}
            >
              Concorde vs. traditionelles Trading
            </h2>
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ease: EASE_SNAP, duration: 0.6, delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${T.border}` }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-3 px-5 py-3"
              style={{ backgroundColor: T.bgAlt, borderBottom: `1px solid ${T.border}` }}
            >
              <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: T.textDim }}>Feature</p>
              <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: T.indigo }}>
                Concorde
              </p>
              <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: T.textDim }}>Traditionell</p>
            </div>
            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className="grid grid-cols-3 px-5 py-4 items-center"
                style={{
                  borderBottom: i < COMPARISON.length - 1 ? `1px solid ${T.border}` : "none",
                  backgroundColor: i % 2 === 0 ? T.bg : T.bgAlt,
                }}
              >
                <p className="text-xs" style={{ color: T.textMuted }}>{row.feature}</p>
                <p
                  className="text-xs font-semibold"
                  style={{ color: T.text, fontFeatureSettings: '"tnum"' }}
                >
                  {row.concorde}
                </p>
                <p
                  className="text-xs"
                  style={{ color: T.textDim, fontFeatureSettings: '"tnum"' }}
                >
                  {row.traditional}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FIVE FEATURES (public.com "Five nerdy features")
      ════════════════════════════════════════════════════ */}
      <section
        className="px-6 sm:px-10 py-20"
        style={{ backgroundColor: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SNAP, duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: T.textDim }}>
              Features
            </p>
            <h2
              style={{
                fontFamily: T.sans,
                fontWeight: 600,
                fontSize: "clamp(22px, 3.5vw, 36px)",
                letterSpacing: "-0.02em",
                color: T.text,
              }}
            >
              Fünf Dinge, die du lieben wirst.
            </h2>
          </motion.div>

          <div className="space-y-0 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.n}
                initial={prefersReduced ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ ease: EASE_SNAP, duration: 0.45, delay: i * 0.07 }}
                className="flex items-start gap-6 px-6 py-5"
                style={{
                  borderBottom: i < FEATURES.length - 1 ? `1px solid ${T.border}` : "none",
                  backgroundColor: T.bg,
                }}
              >
                <span
                  className="text-xs font-semibold tabular-nums shrink-0 mt-0.5"
                  style={{ color: T.indigo, fontFeatureSettings: '"tnum"' }}
                >
                  {feat.n}
                </span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: T.text }}>{feat.title}</p>
                  <p className="text-sm leading-relaxed" style={{ color: T.textMuted }}>{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MARKETS LIST
      ════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-10 py-20" style={{ backgroundColor: T.bg }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SNAP, duration: 0.5 }}
            className="mb-8"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: T.textDim }}>
              Verfügbare Märkte
            </p>
            <h2
              style={{
                fontFamily: T.sans,
                fontWeight: 600,
                fontSize: "clamp(22px, 3.5vw, 36px)",
                letterSpacing: "-0.02em",
                color: T.text,
              }}
            >
              Alle Märkte. Eine Plattform.
            </h2>
          </motion.div>

          <div className="space-y-0 rounded-2xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            {MARKETS.map((m, i) => (
              <motion.div
                key={m.name}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ ease: EASE_SNAP, duration: 0.4, delay: i * 0.06 }}
                className="flex items-center justify-between px-6 py-4"
                style={{
                  borderBottom: i < MARKETS.length - 1 ? `1px solid ${T.border}` : "none",
                  backgroundColor: i % 2 === 0 ? T.bg : T.bgAlt,
                }}
              >
                <div className="flex items-center gap-6">
                  <p className="text-sm font-semibold w-20" style={{ color: T.text }}>{m.name}</p>
                  <p
                    className="text-xs font-medium hidden sm:block"
                    style={{ color: T.textMuted, fontFeatureSettings: '"tnum"' }}
                  >
                    {m.examples}
                  </p>
                </div>
                <p className="text-xs text-right" style={{ color: T.textDim }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST / SECURITY
      ════════════════════════════════════════════════════ */}
      <section
        className="px-6 sm:px-10 py-20"
        style={{ backgroundColor: T.bgAlt, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SNAP, duration: 0.5 }}
            className="mb-10"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: T.textDim }}>
              Sicherheit & Regulierung
            </p>
            <h2
              style={{
                fontFamily: T.sans,
                fontWeight: 600,
                fontSize: "clamp(22px, 3.5vw, 36px)",
                letterSpacing: "-0.02em",
                color: T.text,
              }}
            >
              Sicher durch Design.
              <br />
              <span style={{ color: T.textMuted, fontWeight: 400 }}>Transparent durch Wahl.</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {TRUST.map((item, i) => (
              <motion.div
                key={item.title}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ ease: EASE_SNAP, duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl p-6 space-y-4"
                style={{ backgroundColor: T.bg, border: `1px solid ${T.border}` }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: T.indigoDim, color: T.indigo }}
                >
                  {item.icon}
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.18em] uppercase mb-2 font-semibold"
                    style={{ color: T.indigo }}
                  >
                    {item.label}
                  </p>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: T.text }}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: T.textMuted }}>
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FINAL CTA (dark navy)
      ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: T.heroBg }}>
        <div className="px-6 sm:px-10 py-24 sm:py-32 max-w-5xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SNAP, duration: 0.65 }}
            className="max-w-2xl"
          >
            <h2
              className="mb-6"
              style={{
                fontFamily: T.sans,
                fontWeight: 300,
                fontSize: "clamp(36px, 6vw, 68px)",
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: T.heroText,
              }}
            >
              Bereit für die nächste{" "}
              <span style={{ fontWeight: 600, color: T.indigoBright }}>
                Generation des Tradings?
              </span>
            </h2>
            <p className="text-base mb-10" style={{ color: T.heroMuted }}>
              €20 Startguthaben. Kostenlos. Kein Risiko.
            </p>
            <div className="max-w-md">
              <FunnelEmailForm variant="dark" ctaText="Early Access anfragen" placeholder="Deine E-Mail-Adresse" />
              <p className="text-[11px] mt-3" style={{ color: "#2E3A56" }}>
                Kostenlos. Keine Kreditkarte. Keine Verpflichtung.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer
          className="px-6 sm:px-10 py-10 max-w-5xl mx-auto"
          style={{ borderTop: `1px solid ${T.borderHero}` }}
        >
          <div className="flex items-center gap-2 mb-5">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 18L10 6L14 12L22 4" stroke="#2E3A56" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="4" r="1.5" fill="#2E3A56" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: "#2E3A56" }}>Concorde</span>
          </div>
          <p className="text-[10px] leading-relaxed max-w-2xl" style={{ color: "#2E3A56" }}>
            Risikohinweis: Der Handel mit Derivaten und Hebelprodukten ist spekulativ und birgt ein hohes
            Verlustrisiko. Du kannst mehr als deine ursprüngliche Einlage verlieren. Diese Produkte sind
            nicht für alle Anleger geeignet. Vergangene Wertentwicklungen sind kein verlässlicher
            Indikator für zukünftige Ergebnisse. Concorde — Perpetual Contracts.
          </p>
        </footer>
      </section>
    </div>
  );
}
