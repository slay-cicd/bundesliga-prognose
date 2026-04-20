"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

function fmtEUR(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Animated rolling number — flips like a slot machine
function RollingNumber({ value, color = "#22c55e", prefix = "+€" }: { value: number; color?: string; prefix?: string }) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(value);
  const rafRef = useRef<number | null>(null);
  const fromRef = useRef(value);
  const startRef = useRef(0);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(value);
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    fromRef.current = displayed;
    startRef.current = performance.now();
    const duration = 350;
    const tick = (now: number) => {
      const t = Math.min(1, (now - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = fromRef.current + (value - fromRef.current) * eased;
      setDisplayed(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReduced]);

  return (
    <span className="font-bold tabular-nums" style={{ color }}>
      {prefix}
      {fmtEUR(Math.round(displayed))}
    </span>
  );
}

export function FunnelLeverageDemo() {
  const [stake, setStake] = useState(100);
  const [leverage, setLeverage] = useState(50);
  const [btcPrice, setBtcPrice] = useState(94213);
  const [btcDelta, setBtcDelta] = useState(0.42);
  const prefersReduced = useReducedMotion();

  const position = stake * leverage;
  const gain5 = position * 0.05;
  const gain10 = position * 0.1;
  const gain20 = position * 0.2;

  // Fake live BTC tick for authenticity
  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      const drift = (Math.random() - 0.48) * 80;
      setBtcPrice((p) => Math.max(90000, Math.min(98000, p + drift)));
      setBtcDelta((d) => +(d + (Math.random() - 0.5) * 0.08).toFixed(2));
    }, 1800);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  // ROI % for hype badge
  const roiPct = ((gain10 / stake) * 100).toFixed(0);

  // Risk profile label — editorial, not meme
  const tier =
    leverage >= 75 ? { label: "Aggressiv", color: "#ef4444" } :
    leverage >= 40 ? { label: "Offensiv", color: BURNT } :
    leverage >= 15 ? { label: "Moderat", color: "#eab308" } :
    { label: "Konservativ", color: "#22c55e" };

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8 relative overflow-hidden"
      style={{
        maxWidth: 540,
        margin: "0 auto",
        background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
        borderColor: `${BURNT}22`,
        boxShadow: `0 0 0 1px ${BURNT}11, 0 20px 60px -20px ${BURNT}22`,
      }}
    >
      {/* Live BTC ticker bar */}
      <div
        className="flex items-center justify-between mb-6 pb-4"
        style={{ borderBottom: `1px solid ${BURNT}15` }}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
              style={{ background: "#22c55e", animationDuration: "1.2s" }}
            />
            <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#22c55e" }} />
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "#22c55e" }}>
            Live · BTC/USDT
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <AnimatePresence mode="wait">
            <motion.span
              key={Math.floor(btcPrice)}
              initial={prefersReduced ? false : { y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 6, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-sm font-bold tabular-nums"
              style={{ color: "#e5e5e7" }}
            >
              ${fmtEUR(btcPrice)}
            </motion.span>
          </AnimatePresence>
          <span
            className="text-[11px] font-semibold tabular-nums"
            style={{ color: btcDelta >= 0 ? "#22c55e" : "#ef4444" }}
          >
            {btcDelta >= 0 ? "+" : ""}
            {btcDelta}%
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
          Dein Gewinn-Rechner
        </p>
        <motion.div
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] font-semibold"
          style={{ color: tier.color }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: tier.color }} />
          {tier.label}
        </motion.div>
      </div>

      {/* Stake buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-7">
        <span className="text-xs mr-1 uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          Einsatz
        </span>
        {[50, 100, 250, 500].map((v) => (
          <button
            key={v}
            onClick={() => setStake(v)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150"
            style={
              stake === v
                ? { background: BURNT, color: "#fff", boxShadow: `0 0 18px ${BURNT}55` }
                : {
                    background: "#18181b",
                    color: "var(--color-text-secondary)",
                    border: "1px solid #2a2a2d",
                  }
            }
          >
            €{v}
          </button>
        ))}
      </div>

      {/* Big leverage number with glow */}
      <div className="text-center mb-3 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={leverage}
            initial={prefersReduced ? false : { opacity: 0, y: -6, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ ease: EASE_ED, duration: 0.2 }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(90px, 17vw, 128px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: tier.color,
                lineHeight: 1,
                display: "block",
                letterSpacing: "-0.03em",
                textShadow: `0 0 40px ${tier.color}55`,
              }}
            >
              {leverage}×
            </span>
          </motion.div>
        </AnimatePresence>
        <p className="text-[10px] uppercase tracking-[0.2em] mt-1 font-semibold" style={{ color: "var(--color-text-muted)" }}>
          Hebel
        </p>
      </div>

      {/* Slider */}
      <div className="mb-7 px-1">
        <input
          type="range"
          min={1}
          max={100}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full funnel-leverage-slider"
          style={{
            accentColor: tier.color,
          }}
          aria-label="Hebel"
        />
        <div
          className="flex justify-between text-[10px] mt-1.5 font-semibold"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span>1×</span>
          <span>25×</span>
          <span>50×</span>
          <span>75×</span>
          <span style={{ color: "#ef4444" }}>100×</span>
        </div>
      </div>

      {/* Output panel with glow */}
      <div
        className="rounded-xl p-5 space-y-3 relative"
        style={{
          background: "linear-gradient(180deg, #18181b 0%, #111114 100%)",
          border: `1px solid ${BURNT}22`,
        }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Dein Einsatz</span>
          <span className="font-semibold tabular-nums" style={{ color: "#e5e5e7" }}>
            €{fmtEUR(stake)}
          </span>
        </div>

        <div className="flex justify-between text-sm items-center">
          <span style={{ color: "var(--color-text-muted)" }}>Positionsgröße</span>
          <motion.span
            key={`pos-${position}`}
            initial={prefersReduced ? false : { scale: 1.1, color: BURNT }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="font-bold tabular-nums text-base"
            style={{ color: BURNT }}
          >
            €{fmtEUR(position)}
          </motion.span>
        </div>

        <div className="h-px" style={{ background: `${BURNT}22` }} />

        <div className="flex justify-between items-center text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>
            Bei <span style={{ color: "#22c55e" }}>+5%</span> Move
          </span>
          <RollingNumber value={gain5} />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>
            Bei <span style={{ color: "#22c55e" }}>+10%</span> Move
          </span>
          <RollingNumber value={gain10} />
        </div>

        <div className="flex justify-between items-center text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>
            Bei <span style={{ color: "#22c55e" }}>+20%</span> Move
          </span>
          <RollingNumber value={gain20} />
        </div>

        {/* Headline ROI */}
        <div
          className="mt-4 p-4 rounded-lg text-center"
          style={{
            background: `linear-gradient(135deg, ${BURNT}14 0%, transparent 100%)`,
            border: `1px solid ${BURNT}33`,
          }}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: "var(--color-text-muted)" }}>
            Aus €{fmtEUR(stake)} bei +10% Move
          </p>
          <p
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(30px, 5vw, 40px)",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#22c55e",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
            className="tabular-nums"
          >
            €{fmtEUR(stake + gain10)}
          </p>
          <p className="text-[10px] mt-1.5 uppercase tracking-widest font-semibold" style={{ color: "#22c55e" }}>
            +{roiPct}% Rendite
          </p>
        </div>

        <p className="text-xs leading-relaxed pt-1" style={{ color: "var(--color-text-muted)" }}>
          Vereinfachte Darstellung. Hebel-Trading birgt Totalverlust-Risiko.
        </p>
      </div>
    </div>
  );
}
