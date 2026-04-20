"use client";

import { useReducedMotion, motion } from "framer-motion";
import { FunnelMarketTicker } from "@/components/FunnelMarketTicker";
import { FunnelEmailForm } from "@/components/FunnelEmailForm";
import { FunnelCountdown } from "@/components/FunnelCountdown";
import { FunnelTradeButtons } from "@/components/FunnelTradeButtons";

const EASE_SOFT = [0.16, 1, 0.3, 1] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

const CHART_BARS = [
  28, 35, 30, 42, 38, 48, 44, 55, 50, 58, 54, 62, 58, 65, 60, 68, 64, 72, 68,
  74, 70, 78, 74, 80, 76, 82, 78, 85, 80, 86, 82, 88, 84, 90, 88, 92, 90, 96,
  93, 99,
];

const EXAMPLE_TRADES = [
  { asset: "BTC", dir: "LONG" as const, lev: "10×", move: "+6.2 %", profit: "+€124", rend: "+62 %" },
  { asset: "TSLA", dir: "SHORT" as const, lev: "20×", move: "−3.1 %", profit: "+€124", rend: "+62 %" },
  { asset: "GOLD", dir: "LONG" as const, lev: "50×", move: "+1.8 %", profit: "+€180", rend: "+90 %" },
];

const MARKET_STATS = [
  { label: "24h Volumen", value: "$18.7B" },
  { label: "Open Interest", value: "$2.4B" },
  { label: "Long / Short", value: "68 % / 32 %" },
  { label: "Funding / 8h", value: "−0.01 %" },
];

// ─── Design tokens (family.co — warm editorial cream) ──────────────────────
const T = {
  // backgrounds
  bg: "#F5F0E8",
  bgCard: "#EDE7DB",
  bgCardDeep: "#E7E0D3",
  bgDark: "#1A1714",
  bgDark2: "#221F1B",

  // text
  text: "#1A1714",
  textMuted: "#8C8880",
  textDim: "#B0A89E",

  // borders
  border: "#DDD7CC",
  borderLight: "#E8E3D9",
  borderDark: "#2E2A25",

  // accent (forest / deep teal)
  forest: "#1C4B38",
  forestDim: "rgba(28,75,56,0.08)",
  forestMid: "rgba(28,75,56,0.18)",

  // signal
  up: "#1C7A4B",
  upDim: "rgba(28,122,75,0.08)",
  down: "#C44536",
  downDim: "rgba(196,69,54,0.08)",

  // serif font
  serif: "var(--font-funnel-display, Georgia, 'Times New Roman', serif)",
  sans: "var(--font-funnel-sans, system-ui, sans-serif)",
  mono: "'SF Mono', 'Fira Code', monospace",
};

export default function FunnelPage() {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ fontFamily: T.sans, backgroundColor: T.bg, color: T.text }}>
      {/* ─── TICKER ─────────────────────────────────────── */}
      <FunnelMarketTicker theme="cream" />

      {/* ─── NAV ────────────────────────────────────────── */}
      <nav className="px-5 sm:px-8 pt-6 pb-3 max-w-2xl mx-auto flex items-center justify-between">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: EASE, duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M2 18L10 6L14 12L22 4" stroke={T.text} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="22" cy="4" r="1.5" fill={T.text} />
          </svg>
          <span className="text-sm font-semibold tracking-tight" style={{ fontFamily: T.sans }}>
            Concorde
          </span>
        </motion.div>
        <motion.span
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: EASE, duration: 0.5, delay: 0.15 }}
          className="text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full"
          style={{ color: T.textDim, border: `1px solid ${T.border}`, fontFamily: T.sans }}
        >
          Beta
        </motion.span>
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <section className="px-5 sm:px-8 pt-10 pb-20 max-w-2xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE_SOFT, duration: 0.6, delay: 0.1 }}
          className="mb-10"
        >
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium"
            style={{
              background: T.forestDim,
              border: `1px solid ${T.forestMid}`,
              color: T.forest,
              fontFamily: T.sans,
            }}
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            €20 Startguthaben — kostenlos
          </span>
        </motion.div>

        {/* Display headline */}
        <div
          aria-label="Perps. Deine Superkraft."
          role="heading"
          aria-level={1}
          className="mb-10"
        >
          {/* "Perps." — very large, italic, serif */}
          <div className="overflow-hidden leading-none pb-2">
            <motion.span
              initial={prefersReduced ? false : { y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ ease: EASE_SOFT, duration: 0.9, delay: 0.2 }}
              className="block"
              style={{
                fontFamily: T.serif,
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(72px, 18vw, 120px)",
                letterSpacing: "-0.025em",
                lineHeight: 0.95,
                color: T.text,
              }}
            >
              Perps.
            </motion.span>
          </div>
          {/* "Deine Superkraft." — slightly smaller, upright */}
          <div className="overflow-hidden leading-none">
            <motion.span
              initial={prefersReduced ? false : { y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              transition={{ ease: EASE_SOFT, duration: 0.9, delay: 0.32 }}
              className="block"
              style={{
                fontFamily: T.serif,
                fontStyle: "normal",
                fontWeight: 400,
                fontSize: "clamp(38px, 9vw, 64px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: T.textMuted,
              }}
            >
              Deine Superkraft.
            </motion.span>
          </div>
        </div>

        {/* Subtext */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE_SOFT, duration: 0.7, delay: 0.5 }}
          className="text-base leading-relaxed mb-10 max-w-sm"
          style={{ color: T.textMuted, fontFamily: T.sans }}
        >
          Was institutionelle Trader seit Jahren nutzen —
          Bitcoin, Gold, Aktien. Lang oder kurz, mit Hebel.
        </motion.p>

        {/* Email form */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE_SOFT, duration: 0.65, delay: 0.6 }}
          className="mb-8"
        >
          <FunnelEmailForm variant="light" ctaText="Jetzt €20 sichern" placeholder="Deine E-Mail" />
        </motion.div>

        {/* Trust row */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: EASE, duration: 0.55, delay: 0.75 }}
          className="flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          <FunnelCountdown theme="cream" />
          <div className="flex items-center gap-5">
            {["EU-reguliert", "256-bit SSL", "Sofort-Auszahlung"].map((label) => (
              <span key={label} className="flex items-center gap-1.5 text-[11px]" style={{ color: T.textDim, fontFamily: T.sans }}>
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: T.forest }} aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── INTERACTIVE DEMO ──────────────────────────── */}
      <section className="px-5 sm:px-8 pb-20 max-w-2xl mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE_SOFT, duration: 0.75 }}
        >
          {/* Section label */}
          <p
            className="text-[10px] uppercase tracking-[0.2em] mb-6"
            style={{ color: T.textDim, fontFamily: T.sans }}
          >
            Probier&apos;s aus
          </p>

          {/* Demo card */}
          <div
            className="rounded-3xl p-6 shadow-sm"
            style={{ background: T.bgCard, border: `1px solid ${T.border}` }}
          >
            {/* Mini chart */}
            <div className="h-14 flex items-end gap-px overflow-hidden rounded-xl mb-5" aria-hidden="true">
              {CHART_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background:
                      i > 28
                        ? `rgba(28,75,56,0.55)`
                        : `rgba(28,75,56,0.15)`,
                  }}
                />
              ))}
            </div>
            <FunnelTradeButtons theme="cream" />
          </div>
        </motion.div>
      </section>

      {/* ─── PERP MECHANIC ──────────────────────────────── */}
      <section
        className="px-5 sm:px-8 py-20"
        style={{ backgroundColor: T.bgCard, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SOFT, duration: 0.75 }}
          >
            {/* Headline */}
            <div className="mb-12">
              <p className="text-[10px] uppercase tracking-[0.2em] mb-5" style={{ color: T.textDim, fontFamily: T.sans }}>
                Was Perps können
              </p>
              <h2
                style={{
                  fontFamily: T.serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(34px, 7vw, 56px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                  color: T.text,
                }}
              >
                €10 einsetzen.{" "}
                <span style={{ color: T.forest }}>€500 bewegen.</span>
              </h2>
            </div>

            {/* Formula visual */}
            <div className="flex items-center gap-3 flex-wrap mb-10">
              {[
                { label: "€10", sub: "Dein Einsatz", accent: false },
                null,
                { label: "× 50", sub: "Hebel", accent: true },
                null,
                { label: "€500", sub: "Position", accent: true },
              ].map((item, i) =>
                item ? (
                  <div
                    key={i}
                    className="rounded-2xl px-5 py-3.5 text-center"
                    style={
                      item.accent
                        ? { background: T.forestDim, border: `1px solid ${T.forestMid}`, color: T.forest }
                        : { background: T.bg, border: `1px solid ${T.border}`, color: T.text }
                    }
                  >
                    <p
                      className="text-xl font-bold tabular-nums"
                      style={{ fontFamily: T.mono }}
                    >
                      {item.label}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: T.textDim, fontFamily: T.sans }}>
                      {item.sub}
                    </p>
                  </div>
                ) : (
                  <svg key={i} className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: T.textDim }} aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )
              )}
            </div>

            {/* Returns table */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${T.border}` }}
            >
              <div
                className="px-5 py-3 flex items-center gap-2"
                style={{ borderBottom: `1px solid ${T.border}`, backgroundColor: T.bgCardDeep }}
              >
                <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: T.textDim, fontFamily: T.sans }}>
                  Bei 50× Hebel
                </p>
              </div>
              {[
                { move: "+1 % Kurs", result: "+€5", rend: "50 % Rendite" },
                { move: "+5 % Kurs", result: "+€25", rend: "250 % Rendite" },
                { move: "+10 % Kurs", result: "+€50", rend: "500 % Rendite" },
              ].map((row, i) => (
                <div
                  key={row.move}
                  className="flex items-center justify-between px-5 py-4"
                  style={{
                    borderBottom: i < 2 ? `1px solid ${T.borderLight}` : "none",
                    backgroundColor: T.bgCard,
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: T.textMuted, fontFamily: T.mono }}
                  >
                    {row.move}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="font-bold text-sm tabular-nums"
                      style={{ color: T.forest, fontFamily: T.mono }}
                    >
                      {row.result}
                    </span>
                    <span
                      className="text-[10px] px-2.5 py-1 rounded-lg"
                      style={{ color: T.textMuted, background: T.bg, fontFamily: T.sans }}
                    >
                      {row.rend}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs leading-relaxed mt-6" style={{ color: T.textDim, fontFamily: T.sans }}>
              Das ist keine Magie — das ist Mathematik. Perpetual Contracts sind das Instrument,
              das institutionelle Trader seit Jahren einsetzen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── LIVE MARKET STATS ──────────────────────────── */}
      <section className="px-5 sm:px-8 py-20 max-w-2xl mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE_SOFT, duration: 0.7 }}
          className="rounded-3xl overflow-hidden"
          style={{ border: `1px solid ${T.border}` }}
        >
          <div
            className="px-5 py-3 flex items-center gap-2.5"
            style={{ borderBottom: `1px solid ${T.border}`, backgroundColor: T.bgCard }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: T.forest, animation: "funnel-live-pulse 1.5s ease infinite" }}
              aria-hidden="true"
            />
            <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: T.textDim, fontFamily: T.sans }}>
              Live Market
            </span>
          </div>
          <div className="grid grid-cols-2">
            {MARKET_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="px-5 py-5"
                style={{
                  backgroundColor: T.bg,
                  borderRight: i % 2 === 0 ? `1px solid ${T.border}` : "none",
                  borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                }}
              >
                <p className="text-[11px] mb-2" style={{ color: T.textDim, fontFamily: T.sans }}>
                  {stat.label}
                </p>
                <p
                  className="font-semibold text-sm tabular-nums"
                  style={{ color: T.text, fontFamily: T.mono }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── EXAMPLE TRADES ─────────────────────────────── */}
      <section
        className="px-5 sm:px-8 py-20"
        style={{ backgroundColor: T.bgCard, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}` }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.2em] mb-8" style={{ color: T.textDim, fontFamily: T.sans }}>
            Beta-Trader Ergebnisse
          </p>
          <div className="space-y-3">
            {EXAMPLE_TRADES.map((trade, i) => (
              <motion.div
                key={trade.asset}
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ ease: EASE_SOFT, duration: 0.55, delay: i * 0.1 }}
                className="flex items-center justify-between rounded-2xl px-5 py-5"
                style={{ backgroundColor: T.bg, border: `1px solid ${T.border}` }}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm" style={{ fontFamily: T.sans }}>
                      {trade.asset}
                    </span>
                    <span
                      className="text-[9px] font-semibold px-2 py-0.5 rounded-md tracking-wide"
                      style={{
                        background: trade.dir === "LONG" ? T.upDim : T.downDim,
                        color: trade.dir === "LONG" ? T.up : T.down,
                      }}
                    >
                      {trade.dir}
                    </span>
                    <span className="text-[10px]" style={{ color: T.textDim, fontFamily: T.mono }}>
                      {trade.lev}
                    </span>
                  </div>
                  <p className="text-[11px]" style={{ color: T.textDim, fontFamily: T.mono }}>
                    {trade.move} Kursbewegung
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-bold text-lg tabular-nums"
                    style={{ color: T.forest, fontFamily: T.mono }}
                  >
                    {trade.profit}
                  </p>
                  <p className="text-[10px]" style={{ color: T.textMuted, fontFamily: T.sans }}>
                    {trade.rend} Rendite
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA (dark section — family.co contrast) ─ */}
      <section style={{ backgroundColor: T.bgDark }}>
        <div className="px-5 sm:px-8 py-24 max-w-2xl mx-auto">
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ ease: EASE_SOFT, duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2
                className="leading-tight mb-4"
                style={{
                  fontFamily: T.serif,
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(36px, 8vw, 64px)",
                  letterSpacing: "-0.02em",
                  color: "#F5F0E8",
                }}
              >
                Dein Early Access
                <br />
                wartet.
              </h2>
              <p className="text-sm" style={{ color: "#6B6560", fontFamily: T.sans }}>
                Kostenlos. €20 Startguthaben. Kein Risiko.
              </p>
            </div>

            <div className="max-w-md">
              <FunnelEmailForm variant="dark" ctaText="Kostenlos starten" placeholder="E-Mail eingeben" />
            </div>

            <FunnelCountdown theme="dark" />

            {/* Social proof bullets */}
            <div
              className="pt-8 grid grid-cols-3 gap-4"
              style={{ borderTop: `1px solid ${T.borderDark}` }}
            >
              {[
                { n: "100×", label: "Max. Hebel" },
                { n: "24/7", label: "Handelszeiten" },
                { n: "0 €", label: "Mindesteinlage" },
              ].map((item) => (
                <div key={item.n}>
                  <p
                    className="text-2xl font-bold tabular-nums mb-1"
                    style={{ color: "#F5F0E8", fontFamily: T.mono }}
                  >
                    {item.n}
                  </p>
                  <p className="text-xs" style={{ color: "#6B6560", fontFamily: T.sans }}>
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer
          className="px-5 sm:px-8 py-8 max-w-2xl mx-auto"
          style={{ borderTop: `1px solid ${T.borderDark}` }}
        >
          <p
            className="text-[10px] leading-relaxed"
            style={{ color: "#433E39", fontFamily: T.sans }}
          >
            Risikohinweis: Der Handel mit Hebelprodukten ist spekulativ und kann zum vollständigen
            Verlust deiner Einlage führen. Du kannst mehr verlieren als eingesetzt. Vergangene
            Gewinne sind kein Indikator für zukünftige Ergebnisse. Die dargestellten Trades dienen
            ausschließlich zur Veranschaulichung. Concorde — Perpetual Contracts.
          </p>
        </footer>
      </section>
    </div>
  );
}
