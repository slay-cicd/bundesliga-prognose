"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { FunnelEmailForm } from "@/components/FunnelEmailForm";

const EASE = [0.22, 1, 0.36, 1] as const;
const EASE_ED = [0.16, 1, 0.3, 1] as const; // slow editorial

// ─── Count-up ────────────────────────────────────────────────────────────────
function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
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

// ─── Word-gate reveal ─────────────────────────────────────────────────────────
function WordGate({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
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

// ─── Data ─────────────────────────────────────────────────────────────────────
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

const TRUST = [
  { label: "MiFID II", title: "EU-reguliert", desc: "Vollständig lizenziert nach europäischen Standards. Transparente Compliance." },
  { label: "Tier 1", title: "Segregierte Konten", desc: "Kundengelder strikt getrennt. Verwahrt bei Tier-1-Banken." },
  { label: "256-bit", title: "Enterprise Security", desc: "Multi-Sig Cold Storage, 2FA-Pflicht und kontinuierliche Audits." },
];

// ─── Style constants ──────────────────────────────────────────────────────────
const C = {
  cream: "#f5f3ef",
  creamDark: "#f0ece6",
  charcoal: "#1a1a1a",
  muted: "#999",
  dimmed: "#bbb",
  border: "#e8e4dd",
  borderMid: "#ddd",
  borderDark: "#d6d0c8",
  burnt: "#c4622d",
  dark: "#1a1a1a",
};

const displayFont = "var(--font-funnel-display, Georgia, serif)";
const bodyFont = "var(--font-funnel-sans, system-ui, sans-serif)";

export default function Funnel1Page() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      data-funnel="pro"
      style={{ fontFamily: bodyFont, backgroundColor: C.cream, color: C.charcoal }}
    >
      {/* ─── NAV ─────────────────────────────────────────── */}
      <nav className="px-6 sm:px-10 py-6 max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 18L10 6L14 12L22 4" stroke={C.charcoal} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="22" cy="4" r="1.5" fill={C.charcoal} />
          </svg>
          <span className="font-semibold text-sm tracking-tight" style={{ fontFamily: bodyFont }}>Concorde</span>
        </div>
        <span className="text-[11px] tracking-wide hidden sm:block" style={{ color: C.muted }}>
          EU-reguliert · Institutionelle Infrastruktur
        </span>
      </nav>

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section
        className="px-6 sm:px-10 pt-16 sm:pt-24 pb-28 max-w-6xl mx-auto"
        style={{ background: `radial-gradient(ellipse at 80% 10%, rgba(196,98,45,0.045) 0%, transparent 55%)` }}
      >
        <div className="max-w-4xl">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.6, delay: 0.1 }}
            className="text-[11px] tracking-[0.18em] uppercase mb-10"
            style={{ color: C.muted, fontFamily: bodyFont }}
          >
            Concorde · Perpetual Contracts · Beta 2025
          </motion.p>

          <h1
            className="leading-none mb-10"
            style={{ fontFamily: displayFont, fontSize: "clamp(72px, 12vw, 148px)", letterSpacing: "-0.02em" }}
            aria-label="Perpetual Contracts."
          >
            <WordGate delay={0.15} className="block">
              <span style={{ fontWeight: 300, color: C.charcoal }}>Perpetual</span>
            </WordGate>
            <WordGate delay={0.28} className="block">
              <span style={{ fontWeight: 300, fontStyle: "italic", color: C.burnt }}>Contracts.</span>
            </WordGate>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.6, delay: 0.52 }}
            className="text-lg sm:text-xl leading-relaxed max-w-xl mb-12"
            style={{ color: "#666", fontFamily: bodyFont }}
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
            <FunnelEmailForm variant="light" ctaText="Early Access anfragen" placeholder="Deine E-Mail-Adresse" />
            <p className="text-[11px] mt-3" style={{ color: "#aaa", fontFamily: bodyFont }}>
              Kostenlos. Keine Kreditkarte. Keine Verpflichtung.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PULL QUOTE ───────────────────────────────────── */}
      <section className="py-20 px-6 sm:px-10" style={{ backgroundColor: C.dark }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ease: EASE_ED, duration: 0.8 }}
            className="pl-8"
            style={{ borderLeft: `2px solid ${C.burnt}` }}
          >
            <p
              className="leading-tight mb-6"
              style={{ fontFamily: displayFont, fontSize: "clamp(28px, 4vw, 48px)", fontStyle: "italic", fontWeight: 300, color: "#f5f3ef" }}
            >
              &ldquo;The first truly accessible perps venue in Europe.&rdquo;
            </p>
            <p className="text-xs tracking-widest uppercase" style={{ color: "#555", fontFamily: bodyFont }}>
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
            { to: null, symbol: "∞", label: "Kein Ablaufdatum" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ ease: EASE_ED, duration: 0.7, delay: i * 0.1 }}
              className="space-y-3"
            >
              <div
                className="tabular-nums leading-none"
                style={{ fontFamily: displayFont, fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 300, color: C.charcoal, letterSpacing: "-0.02em" }}
                aria-label={stat.label}
              >
                {stat.to !== null ? (
                  <CountUp to={stat.to} suffix={stat.suffix} duration={1.2} />
                ) : (
                  <span style={{ color: C.burnt }}>{stat.symbol}</span>
                )}
              </div>
              <p className="text-xs leading-snug" style={{ color: C.muted, fontFamily: bodyFont }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── EDITORIAL: WHAT ARE PERPS ────────────────────── */}
      <section className="px-6 sm:px-10 py-20 border-t" style={{ borderColor: C.border, backgroundColor: C.creamDark }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-12 items-start">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: EASE_ED, duration: 0.8 }}
              className="sm:col-span-2 leading-tight"
              style={{ fontFamily: displayFont, fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 300, fontStyle: "italic", color: C.charcoal }}
            >
              Handle auf Kursbewegungen.
              <br />Ohne das Asset zu besitzen.
              <br />Rund um die Uhr.
            </motion.p>
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ ease: EASE_ED, duration: 0.8, delay: 0.15 }}
              className="space-y-4"
              style={{ fontFamily: bodyFont }}
            >
              <p className="text-xs uppercase tracking-widest mb-5" style={{ color: "#aaa" }}>Was sind Perpetuals?</p>
              <p className="leading-relaxed text-sm" style={{ color: "#555" }}>
                Perpetual Contracts sind Derivate ohne Ablaufdatum. Du spekulierst auf den Preis
                eines Assets — Long oder Short — mit einstellbarem Hebel. Kein Besitz, kein
                Settlement-Datum, volle Kontrolle.
              </p>
              <p className="leading-relaxed text-sm" style={{ color: "#555" }}>
                Im Gegensatz zu traditionellen Futures musst du keine Positionen vor Quartalsende
                schließen. Du tradest wann du willst, so lange du willst.
              </p>
              <div className="pt-4 mt-2" style={{ borderTop: `1px solid ${C.borderMid}` }}>
                <p className="text-[11px] uppercase tracking-widest" style={{ color: "#aaa" }}>Genutzt von</p>
                <p className="font-medium text-sm mt-1" style={{ color: C.charcoal }}>
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
          transition={{ ease: EASE_ED, duration: 0.7 }}
          className="mb-14"
        >
          <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "#aaa", fontFamily: bodyFont }}>Der Vergleich</p>
          <h2
            className="leading-tight"
            style={{ fontFamily: displayFont, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: C.charcoal }}
          >
            Concorde vs. Traditioneller Broker
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Traditional */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ease: EASE_ED, duration: 0.7, delay: 0.05 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${C.borderMid}`, backgroundColor: "#eeebe6" }}
          >
            <div className="px-6 py-4" style={{ borderBottom: `1px solid ${C.borderMid}` }}>
              <p className="text-xs uppercase tracking-widest" style={{ color: "#aaa", fontFamily: bodyFont }}>Traditioneller Broker</p>
            </div>
            <div>
              {COMPARISON.map((row) => (
                <div key={row.feature} className="px-6 py-4 space-y-1" style={{ borderBottom: `1px solid #e0dcd6` }}>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#bbb", fontFamily: bodyFont }}>{row.feature}</p>
                  <p className="text-sm line-through" style={{ color: "#aaa", fontFamily: bodyFont }}>{row.traditional}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Concorde */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ ease: EASE_ED, duration: 0.7, delay: 0.12 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: `2px solid ${C.burnt}`, backgroundColor: C.cream }}
          >
            <div className="px-6 py-4" style={{ borderBottom: `1px solid #e8ddd5` }}>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: C.burnt, fontFamily: bodyFont }}>Concorde</p>
            </div>
            <div>
              {COMPARISON.map((row, i) => (
                <motion.div
                  key={row.feature}
                  initial={prefersReduced ? false : { opacity: 0, x: 12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ease: EASE, duration: 0.4, delay: 0.2 + i * 0.06 }}
                  className="px-6 py-4 space-y-1 group cursor-default"
                  style={{ borderBottom: `1px solid #e8ddd5` }}
                >
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "#bbb", fontFamily: bodyFont }}>{row.feature}</p>
                  <p
                    className="font-semibold text-sm transition-colors duration-200"
                    style={{ color: C.charcoal, fontFamily: bodyFont }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = C.burnt)}
                    onMouseLeave={(e) => (e.currentTarget.style.color = C.charcoal)}
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
      <section className="px-6 sm:px-10 py-20 border-t" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_ED, duration: 0.7 }}
            className="mb-12"
          >
            <h2 className="leading-tight" style={{ fontFamily: displayFont, fontSize: "clamp(32px, 4.5vw, 52px)", fontWeight: 300, color: C.charcoal }}>
              Alle Märkte.{" "}
              <span style={{ fontStyle: "italic", color: C.burnt }}>Eine Plattform.</span>
            </h2>
          </motion.div>
          <div style={{ borderTop: `1px solid ${C.border}` }}>
            {MARKETS.map((market, i) => (
              <motion.div
                key={market.name}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ ease: EASE, duration: 0.45, delay: i * 0.08 }}
                className="group grid grid-cols-3 sm:grid-cols-4 items-center py-5 cursor-default"
                style={{ borderBottom: `1px solid ${C.border}` }}
              >
                <p
                  className="font-semibold text-sm col-span-1 transition-colors duration-200"
                  style={{ fontFamily: bodyFont, color: C.charcoal }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = C.burnt)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = C.charcoal)}
                >
                  {market.name}
                </p>
                <p className="text-xs col-span-1 tabular-nums" style={{ color: "#aaa", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{market.examples}</p>
                <p className="text-xs hidden sm:block col-span-2" style={{ color: "#bbb", fontFamily: bodyFont }}>{market.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST ────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 py-24 border-t" style={{ borderColor: C.border, backgroundColor: C.creamDark }}>
        <div className="max-w-6xl mx-auto">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ ease: EASE, duration: 0.6 }}
            className="text-[11px] uppercase tracking-widest mb-14"
            style={{ color: "#aaa", fontFamily: bodyFont }}
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
                transition={{ ease: EASE_ED, duration: 0.7, delay: i * 0.12 }}
                className="space-y-4 group"
              >
                <p
                  className="leading-none"
                  style={{ fontFamily: displayFont, fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300, color: C.burnt, lineHeight: 1 }}
                >
                  {item.label}
                </p>
                <div
                  className="h-px w-8 transition-all duration-300 group-hover:w-16"
                  style={{ backgroundColor: C.burnt }}
                />
                <h3 className="font-semibold text-sm" style={{ color: C.charcoal, fontFamily: bodyFont }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#888", fontFamily: bodyFont }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="px-6 sm:px-10 py-28" style={{ backgroundColor: C.dark }}>
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_ED, duration: 0.8 }}
          >
            <h2
              className="leading-tight mb-10"
              style={{ fontFamily: displayFont, fontSize: "clamp(40px, 7vw, 80px)", fontWeight: 300, color: "#f5f3ef", letterSpacing: "-0.01em" }}
            >
              Bereit für die nächste
              <br />
              <span style={{ fontStyle: "italic", color: C.burnt }}>Generation des Tradings?</span>
            </h2>
            <div className="max-w-md">
              <FunnelEmailForm variant="light" ctaText="Early Access anfragen" placeholder="Deine E-Mail-Adresse" />
              <p className="text-[11px] mt-3" style={{ color: "#555", fontFamily: bodyFont }}>
                Kostenlos. Keine Kreditkarte. Keine Verpflichtung.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────── */}
      <footer className="px-6 sm:px-10 py-12 border-t" style={{ borderColor: "#2a2a2a", backgroundColor: C.dark }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-7">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M2 18L10 6L14 12L22 4" stroke="#444" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="4" r="1.5" fill="#444" />
            </svg>
            <span className="text-xs tracking-tight font-semibold" style={{ color: "#444", fontFamily: bodyFont }}>Concorde</span>
          </div>
          <p className="text-[10px] leading-relaxed max-w-2xl" style={{ color: "#444", fontFamily: bodyFont }}>
            Risikohinweis: Der Handel mit Derivaten und Hebelprodukten ist spekulativ und birgt ein hohes
            Verlustrisiko. Du kannst mehr als deine ursprüngliche Einlage verlieren. Diese Produkte sind
            nicht für alle Anleger geeignet. Vergangene Wertentwicklungen sind kein verlässlicher
            Indikator für zukünftige Ergebnisse. Concorde — Perpetual Contracts.
          </p>
        </div>
      </footer>
    </div>
  );
}
