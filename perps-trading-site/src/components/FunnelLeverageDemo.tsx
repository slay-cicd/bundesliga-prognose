"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

function fmtEUR(n: number) {
  return n.toLocaleString("de-DE", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function FunnelLeverageDemo() {
  const [stake, setStake] = useState(100);
  const [leverage, setLeverage] = useState(25);
  const prefersReduced = useReducedMotion();

  const position = stake * leverage;
  const gain5 = position * 0.05;
  const gain10 = position * 0.1;

  return (
    <div
      className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-8"
      style={{ maxWidth: 520, margin: "0 auto" }}
    >
      <p
        className="text-[10px] uppercase tracking-widest mb-6"
        style={{ color: "var(--color-text-muted)" }}
      >
        Interaktive Demo · Hebel-Trading
      </p>

      {/* Stake buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-sm mr-1" style={{ color: "var(--color-text-secondary)" }}>
          Einsatz:
        </span>
        {[50, 100, 250, 500].map((v) => (
          <button
            key={v}
            onClick={() => setStake(v)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
            style={
              stake === v
                ? { background: BURNT, color: "#fff" }
                : {
                    background: "var(--color-surface-2)",
                    color: "var(--color-text-secondary)",
                    border: "1px solid var(--color-border)",
                  }
            }
          >
            €{v}
          </button>
        ))}
      </div>

      {/* Big leverage number */}
      <div className="text-center mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={leverage}
            initial={prefersReduced ? false : { opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ ease: EASE_ED, duration: 0.2 }}
          >
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(80px, 15vw, 108px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: BURNT,
                lineHeight: 1,
                display: "block",
                letterSpacing: "-0.02em",
              }}
            >
              {leverage}×
            </span>
          </motion.div>
        </AnimatePresence>
        <p
          className="text-xs uppercase tracking-widest mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          Hebel
        </p>
      </div>

      {/* Slider */}
      <div className="mb-8 px-1">
        <input
          type="range"
          min={1}
          max={100}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
          aria-label="Hebel"
        />
        <div
          className="flex justify-between text-[10px] mt-1.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span>1×</span>
          <span>25×</span>
          <span>50×</span>
          <span>75×</span>
          <span>100×</span>
        </div>
      </div>

      {/* Output panel */}
      <div
        className="rounded-xl p-4 space-y-3"
        style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border)" }}
      >
        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Dein Einsatz</span>
          <span
            className="font-semibold tabular-nums"
            style={{ color: "var(--color-text-primary)" }}
          >
            €{fmtEUR(stake)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Positionsgröße</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`pos-${position}`}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="font-semibold tabular-nums"
              style={{ color: "var(--color-text-primary)" }}
            >
              €{fmtEUR(position)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="h-px" style={{ background: "var(--color-border)" }} />

        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Bei +5% Bewegung</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`g5-${gain5}`}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="font-bold tabular-nums"
              style={{ color: "#22c55e" }}
            >
              +€{fmtEUR(gain5)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex justify-between text-sm">
          <span style={{ color: "var(--color-text-muted)" }}>Bei +10% Bewegung</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={`g10-${gain10}`}
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="font-bold tabular-nums"
              style={{ color: "#22c55e" }}
            >
              +€{fmtEUR(gain10)}
            </motion.span>
          </AnimatePresence>
        </div>

        <p
          className="text-[10px] leading-relaxed pt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          Vereinfachte Darstellung. Verluste bis zur gesamten Einlage möglich.
        </p>
      </div>
    </div>
  );
}
