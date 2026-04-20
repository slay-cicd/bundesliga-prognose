"use client";

import { useReducedMotion, motion } from "framer-motion";
import { FunnelMarketTicker } from "@/components/FunnelMarketTicker";
import { FunnelEmailForm } from "@/components/FunnelEmailForm";
import { FunnelCountdown } from "@/components/FunnelCountdown";
import { FunnelTradeButtons } from "@/components/FunnelTradeButtons";

const EASE = [0.22, 1, 0.36, 1] as const;

const CHART_BARS = [
  28, 35, 30, 42, 38, 48, 44, 55, 50, 58, 54, 62, 58, 65, 60, 68, 64, 72, 68,
  74, 70, 78, 74, 80, 76, 82, 78, 85, 80, 86, 82, 88, 84, 90, 88, 92, 90, 96,
  93, 99,
];

const HERO_LINES = [
  { text: "Perps.", accent: false },
  { text: "Deine", accent: false },
  { text: "Superkraft.", accent: true },
];

const MARKET_STATS = [
  { label: "24h Volumen", value: "$18.7B" },
  { label: "Open Interest", value: "$2.4B" },
  { label: "Long / Short", value: "68 % / 32 %" },
  { label: "Funding / 8h", value: "−0.01 %" },
];

const EXAMPLE_TRADES = [
  { asset: "BTC", dir: "LONG" as const, lev: "10×", move: "+6.2 %", profit: "+€124", rend: "+62 %" },
  { asset: "TSLA", dir: "SHORT" as const, lev: "20×", move: "−3.1 %", profit: "+€124", rend: "+62 %" },
  { asset: "GOLD", dir: "LONG" as const, lev: "50×", move: "+1.8 %", profit: "+€180", rend: "+90 %" },
];

// ─── Shared inline style tokens ─────────────────────────────────────────────
const T = {
  surface1: "#111113",
  surface2: "#18181b",
  surface3: "#222225",
  border: "#2a2a2d",
  mint: "#7fe5d6",
  mintDim: "rgba(127,229,214,0.1)",
  textPrimary: "#e8e8ea",
  textSecondary: "#888890",
  textMuted: "#55555a",
  up: "#22c55e",
  down: "#ef4444",
};

export default function FunnelPage() {
  const prefersReduced = useReducedMotion();

  return (
    <div style={{ fontFamily: "var(--font-funnel-sans, system-ui, sans-serif)" }}>
      <FunnelMarketTicker />

      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="px-5 pt-10 pb-16 max-w-lg mx-auto">
        <div className="text-center space-y-7">
          {/* Logo */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: T.mint }} aria-hidden="true">
              <path d="M2 18L10 6L14 12L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="4" r="1.75" fill="currentColor" />
            </svg>
            <span className="font-semibold text-base tracking-tight">Concorde</span>
            <span
              className="text-[10px] tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ color: T.textMuted, border: `1px solid ${T.border}` }}
            >
              Beta
            </span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.08 }}
          >
            <span
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: T.mintDim, border: `1px solid rgba(127,229,214,0.25)`, color: T.mint }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
              </svg>
              €20 Startguthaben — kostenlos
            </span>
          </motion.div>

          {/* Kinetic headline */}
          <div aria-label="Perps. Deine Superkraft." role="heading" aria-level={1}>
            {HERO_LINES.map((line, i) => (
              <div key={i} className="overflow-hidden leading-none pb-1">
                <motion.span
                  initial={prefersReduced ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ ease: EASE, duration: 0.68, delay: 0.18 + i * 0.1 }}
                  className="block font-black leading-[0.95] tracking-tight"
                  style={{
                    fontSize: "clamp(52px, 14vw, 80px)",
                    color: line.accent ? T.mint : T.textPrimary,
                  }}
                >
                  {line.text}
                </motion.span>
              </div>
            ))}
          </div>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.55, delay: 0.52 }}
            className="text-base leading-relaxed"
            style={{ color: T.textSecondary }}
          >
            Was institutionelle Trader seit Jahren nutzen.
            <br />
            Bitcoin, Gold, Aktien — lang oder kurz, mit Hebel.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.6 }}
          >
            <FunnelEmailForm variant="dark" ctaText="Jetzt €20 sichern" placeholder="Deine E-Mail" />
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.72 }}
            className="flex flex-col items-center gap-3"
          >
            <FunnelCountdown />
            <div className="flex items-center gap-5 text-[11px]" style={{ color: T.textMuted }}>
              {["EU-reguliert", "256-bit SSL", "Sofort-Auszahlung"].map((label) => (
                <span key={label} className="flex items-center gap-1.5">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(127,229,214,0.6)" }} aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── INTERACTIVE DEMO ─────────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.6 }}
        >
          <p className="text-[10px] uppercase tracking-widest text-center mb-5" style={{ color: T.textMuted }}>
            Probier&apos;s aus
          </p>
          <div className="rounded-2xl p-5 space-y-5" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
            <div className="h-16 flex items-end gap-px overflow-hidden rounded-lg" aria-hidden="true">
              {CHART_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h}%`,
                    background: i > 28 ? "rgba(127,229,214,0.65)" : "rgba(127,229,214,0.2)",
                  }}
                />
              ))}
            </div>
            <FunnelTradeButtons />
          </div>
        </motion.div>
      </section>

      {/* ─── PERP MECHANIC ────────────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.6 }}
          className="space-y-7"
        >
          <div className="text-center space-y-2">
            <p className="text-[10px] uppercase tracking-widest" style={{ color: T.textMuted }}>Was Perps können</p>
            <h2 className="font-black leading-tight" style={{ fontSize: "clamp(28px, 8vw, 40px)", color: T.textPrimary }}>
              €10 einsetzen.{" "}
              <span style={{ color: T.mint }}>€500 bewegen.</span>
            </h2>
          </div>

          <div className="rounded-2xl p-6 space-y-5" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {[
                { label: "€10", sub: "Dein Einsatz", style: { background: T.surface2, border: `1px solid ${T.border}`, color: T.textPrimary } },
                null,
                { label: "× 50", sub: "Hebel", style: { background: T.mintDim, border: `1px solid rgba(127,229,214,0.25)`, color: T.mint } },
                null,
                { label: "€500", sub: "Position", style: { background: T.surface2, border: `1px solid rgba(127,229,214,0.2)`, color: T.mint } },
              ].map((item, i) =>
                item ? (
                  <div key={i} className="rounded-xl px-5 py-3 text-center" style={item.style}>
                    <p className="text-xl font-black font-mono tabular-nums">{item.label}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: T.textMuted }}>{item.sub}</p>
                  </div>
                ) : (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: T.textMuted }} aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )
              )}
            </div>

            <div className="space-y-3" style={{ borderTop: `1px solid ${T.border}`, paddingTop: "1.25rem" }}>
              {[
                { move: "+1 % Kurs", result: "+€5", rend: "50 %" },
                { move: "+5 % Kurs", result: "+€25", rend: "250 %" },
                { move: "+10 % Kurs", result: "+€50", rend: "500 %" },
              ].map((row) => (
                <div key={row.move} className="flex items-center justify-between text-sm">
                  <span style={{ color: T.textSecondary, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{row.move}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold tabular-nums" style={{ color: T.mint, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{row.result}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ color: T.textMuted, background: T.surface3, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{row.rend} Rendite</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs leading-relaxed opacity-80" style={{ color: T.textMuted }}>
            Das ist keine Magie — das ist Mathematik. Perpetual Contracts sind das Instrument,
            das institutionelle Trader seit Jahren einsetzen.
          </p>
        </motion.div>
      </section>

      {/* ─── LIVE MARKET ──────────────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.5 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: T.surface1, border: `1px solid ${T.border}` }}
        >
          <div className="px-5 py-3 flex items-center gap-2.5" style={{ borderBottom: `1px solid ${T.border}` }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.mint, animation: "funnel-live-pulse 1.5s ease infinite" }} aria-hidden="true" />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: T.textMuted }}>Live Market</span>
          </div>
          <div className="grid grid-cols-2" style={{ borderTop: "none" }}>
            {MARKET_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="px-5 py-4"
                style={{
                  borderRight: i % 2 === 0 ? `1px solid ${T.border}` : "none",
                  borderBottom: i < 2 ? `1px solid ${T.border}` : "none",
                }}
              >
                <p className="text-[11px] mb-1.5" style={{ color: T.textMuted }}>{stat.label}</p>
                <p className="font-bold tabular-nums text-sm" style={{ color: T.textPrimary, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── EXAMPLE TRADES ───────────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-[10px] uppercase tracking-widest text-center mb-5" style={{ color: T.textMuted }}>
            Beta-Trader Ergebnisse
          </p>
          {EXAMPLE_TRADES.map((trade, i) => (
            <motion.div
              key={trade.asset}
              initial={prefersReduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ease: EASE, duration: 0.45, delay: i * 0.09 }}
              className="flex items-center justify-between rounded-xl px-5 py-4"
              style={{ background: T.surface1, border: `1px solid ${T.border}` }}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{trade.asset}</span>
                  <span
                    className="text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide"
                    style={{
                      background: trade.dir === "LONG" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                      color: trade.dir === "LONG" ? T.up : T.down,
                    }}
                  >
                    {trade.dir}
                  </span>
                  <span className="text-[10px]" style={{ color: T.textMuted, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{trade.lev}</span>
                </div>
                <p className="text-[11px]" style={{ color: T.textMuted, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{trade.move} Kursbewegung</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg tabular-nums" style={{ color: T.mint, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{trade.profit}</p>
                <p className="text-[10px]" style={{ color: "rgba(127,229,214,0.7)", fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}>{trade.rend} Rendite</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.6 }}
          className="relative rounded-2xl p-8 text-center space-y-6 overflow-hidden"
          style={{ background: T.surface1, border: "1px solid rgba(127,229,214,0.15)" }}
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(127,229,214,0.07) 0%, transparent 70%)" }}
            aria-hidden="true"
          />
          <div className="relative space-y-2">
            <h2 className="text-2xl font-black">Dein Early Access wartet.</h2>
            <p className="text-sm" style={{ color: T.textSecondary }}>Kostenlos. €20 Startguthaben. Kein Risiko.</p>
          </div>
          <div className="relative">
            <FunnelEmailForm variant="dark" ctaText="Kostenlos starten" placeholder="E-Mail eingeben" />
          </div>
          <div className="relative">
            <FunnelCountdown />
          </div>
        </motion.div>
      </section>

      {/* ─── DISCLAIMER ───────────────────────────────────── */}
      <footer className="px-5 pb-10 max-w-lg mx-auto">
        <p className="text-[10px] text-center leading-relaxed" style={{ color: T.textMuted, opacity: 0.5 }}>
          Risikohinweis: Der Handel mit Hebelprodukten ist spekulativ und kann zum vollständigen
          Verlust deiner Einlage führen. Du kannst mehr verlieren als eingesetzt. Vergangene
          Gewinne sind kein Indikator für zukünftige Ergebnisse. Die dargestellten Trades dienen
          ausschließlich zur Veranschaulichung. Concorde — Perpetual Contracts.
        </p>
      </footer>
    </div>
  );
}
