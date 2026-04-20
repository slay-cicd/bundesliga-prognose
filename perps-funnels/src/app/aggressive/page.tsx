"use client";

import { useReducedMotion, motion } from "framer-motion";
import { MarketTicker } from "@/components/MarketTicker";
import { EmailForm } from "@/components/EmailForm";
import { Countdown } from "@/components/Countdown";
import { TradeButtons } from "@/components/TradeButtons";

const EASE = [0.22, 1, 0.36, 1] as const;

// Fixed bars — no Math.random on render (avoids hydration mismatch)
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
  {
    asset: "BTC",
    dir: "LONG" as const,
    lev: "10×",
    move: "+6.2 %",
    profit: "+€124",
    rend: "+62 %",
  },
  {
    asset: "TSLA",
    dir: "SHORT" as const,
    lev: "20×",
    move: "−3.1 %",
    profit: "+€124",
    rend: "+62 %",
  },
  {
    asset: "GOLD",
    dir: "LONG" as const,
    lev: "50×",
    move: "+1.8 %",
    profit: "+€180",
    rend: "+90 %",
  },
];

export default function AggressiveFunnel() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-surface-0 text-text-primary">
      <MarketTicker />

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
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="text-mint"
              aria-hidden="true"
            >
              <path
                d="M2 18L10 6L14 12L22 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="4" r="1.75" fill="currentColor" />
            </svg>
            <span className="font-semibold text-base tracking-tight">
              Concorde
            </span>
            <span className="text-[10px] tracking-widest uppercase text-text-muted border border-border px-2 py-0.5 rounded-full">
              Beta
            </span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.08 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mint-dim border border-mint/25 text-mint text-sm font-semibold">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              €20 Startguthaben — kostenlos
            </span>
          </motion.div>

          {/* Kinetic headline — word-by-word slide up through gate */}
          <div
            className="space-y-0"
            aria-label="Perps. Deine Superkraft."
            role="heading"
            aria-level={1}
          >
            {HERO_LINES.map((line, i) => (
              <div key={i} className="overflow-hidden leading-none pb-1">
                <motion.span
                  initial={prefersReduced ? false : { y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{
                    ease: EASE,
                    duration: 0.68,
                    delay: 0.18 + i * 0.1,
                  }}
                  className={`block text-[56px] sm:text-[80px] font-black leading-[0.95] tracking-tight ${
                    line.accent ? "text-mint" : "text-text-primary"
                  }`}
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
            className="text-text-secondary text-base leading-relaxed"
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
            <EmailForm
              variant="aggressive"
              ctaText="Jetzt €20 sichern"
              placeholder="Deine E-Mail"
            />
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ease: EASE, duration: 0.5, delay: 0.72 }}
            className="flex flex-col items-center gap-3"
          >
            <Countdown />
            <div className="flex items-center gap-5 text-[11px] text-text-muted">
              {["EU-reguliert", "256-bit SSL", "Sofort-Auszahlung"].map(
                (label) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <svg
                      className="w-3 h-3 text-mint/60"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {label}
                  </span>
                )
              )}
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
          <p className="text-[10px] text-text-muted uppercase tracking-widest text-center mb-5">
            Probier&apos;s aus
          </p>
          <div className="bg-surface-1 border border-border rounded-2xl p-5 space-y-5">
            {/* Mini chart */}
            <div
              className="h-16 flex items-end gap-px overflow-hidden rounded-lg"
              aria-hidden="true"
            >
              {CHART_BARS.map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm transition-none"
                  style={{
                    height: `${h}%`,
                    background:
                      i > 28
                        ? "rgba(127,229,214,0.65)"
                        : "rgba(127,229,214,0.2)",
                  }}
                />
              ))}
            </div>
            <TradeButtons />
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
            <p className="text-[10px] text-text-muted uppercase tracking-widest">
              Was Perps können
            </p>
            <h2 className="text-3xl sm:text-4xl font-black leading-tight">
              €10 einsetzen.
              <br />
              <span className="text-mint">€500 bewegen.</span>
            </h2>
          </div>

          <div className="bg-surface-1 border border-border rounded-2xl p-6 space-y-5">
            {/* Flow */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <div className="bg-surface-2 rounded-xl px-5 py-3 border border-border text-center">
                <p className="text-2xl font-black font-mono tabular-nums">
                  €10
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Dein Einsatz
                </p>
              </div>
              <svg
                className="w-4 h-4 text-text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="bg-mint-dim border border-mint/25 rounded-xl px-4 py-3 text-center">
                <p className="text-sm font-bold font-mono text-mint">
                  × 50 Hebel
                </p>
              </div>
              <svg
                className="w-4 h-4 text-text-muted"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <div className="bg-surface-2 border border-mint/20 rounded-xl px-5 py-3 text-center">
                <p className="text-2xl font-black font-mono text-mint tabular-nums">
                  €500
                </p>
                <p className="text-[10px] text-text-muted mt-0.5">
                  Positionsgröße
                </p>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              {[
                { move: "+1 % Kurs", result: "+€5", rend: "50 % Rendite" },
                { move: "+5 % Kurs", result: "+€25", rend: "250 % Rendite" },
                { move: "+10 % Kurs", result: "+€50", rend: "500 % Rendite" },
              ].map((row) => (
                <div
                  key={row.move}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-text-muted font-mono">{row.move}</span>
                  <div className="flex items-center gap-2.5">
                    <span className="text-mint font-mono font-bold tabular-nums">
                      {row.result}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono bg-surface-3 px-2 py-0.5 rounded-md">
                      {row.rend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-text-muted leading-relaxed opacity-80">
            Das ist keine Magie — das ist Mathematik. Perpetual Contracts sind
            das Instrument, das institutionelle Trader seit Jahren einsetzen.
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
          className="bg-surface-1 border border-border rounded-2xl overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-border flex items-center gap-2.5">
            <span
              className="w-1.5 h-1.5 rounded-full bg-mint"
              style={{ animation: "live-pulse 1.5s ease infinite" }}
              aria-hidden="true"
            />
            <span className="text-[10px] text-text-muted uppercase tracking-widest">
              Live Market
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-y divide-border">
            {MARKET_STATS.map((stat) => (
              <div key={stat.label} className="px-5 py-4">
                <p className="text-[11px] text-text-muted mb-1.5">
                  {stat.label}
                </p>
                <p className="font-mono font-bold text-text-primary tabular-nums text-sm">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── BETA TRADER RESULTS ──────────────────────────── */}
      <section className="px-5 pb-16 max-w-lg mx-auto">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ ease: EASE, duration: 0.6 }}
          className="space-y-3"
        >
          <p className="text-[10px] text-text-muted uppercase tracking-widest text-center mb-5">
            Beta-Trader Ergebnisse
          </p>
          {EXAMPLE_TRADES.map((trade, i) => (
            <motion.div
              key={trade.asset}
              initial={prefersReduced ? false : { opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ ease: EASE, duration: 0.45, delay: i * 0.09 }}
              className="flex items-center justify-between bg-surface-1 border border-border rounded-xl px-5 py-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{trade.asset}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-md tracking-wide ${
                      trade.dir === "LONG"
                        ? "bg-up/10 text-up"
                        : "bg-down/10 text-down"
                    }`}
                  >
                    {trade.dir}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    {trade.lev}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted font-mono">
                  {trade.move} Kursbewegung
                </p>
              </div>
              <div className="text-right">
                <p className="text-mint font-bold font-mono text-lg tabular-nums">
                  {trade.profit}
                </p>
                <p className="text-[10px] text-mint/70 font-mono">
                  {trade.rend} Rendite
                </p>
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
          className="relative bg-surface-1 border border-mint/15 rounded-2xl p-8 text-center space-y-6 overflow-hidden"
        >
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(127,229,214,0.07) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <div className="relative space-y-2">
            <h2 className="text-2xl font-black">
              Dein Early Access wartet.
            </h2>
            <p className="text-text-secondary text-sm">
              Kostenlos. €20 Startguthaben. Kein Risiko.
            </p>
          </div>
          <div className="relative">
            <EmailForm
              variant="aggressive"
              ctaText="Kostenlos starten"
              placeholder="E-Mail eingeben"
            />
          </div>
          <div className="relative">
            <Countdown />
          </div>
        </motion.div>
      </section>

      {/* ─── DISCLAIMER ───────────────────────────────────── */}
      <footer className="px-5 pb-10 max-w-lg mx-auto">
        <p className="text-[10px] text-text-muted text-center leading-relaxed opacity-50">
          Risikohinweis: Der Handel mit Hebelprodukten ist spekulativ und kann zum
          vollständigen Verlust deiner Einlage führen. Du kannst mehr verlieren als
          eingesetzt. Vergangene Gewinne sind kein Indikator für zukünftige
          Ergebnisse. Die dargestellten Trades dienen ausschließlich zur
          Veranschaulichung. Concorde — Perpetual Contracts.
        </p>
      </footer>
    </div>
  );
}
