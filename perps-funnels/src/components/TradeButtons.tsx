"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const LEVERAGES = [5, 10, 20, 50] as const;
type Leverage = (typeof LEVERAGES)[number];

// Simulated scenario: asset moves +3.2% in your favour
const SIMULATED_MOVE = 3.2;
const ENTRY_AMOUNT = 20;

export function TradeButtons() {
  const [side, setSide] = useState<"long" | "short" | null>(null);
  const [lev, setLev] = useState<Leverage>(10);
  const prefersReduced = useReducedMotion();

  const pnl =
    side !== null
      ? ENTRY_AMOUNT * lev * (SIMULATED_MOVE / 100) * (side === "long" ? 1 : -1)
      : null;

  const isProfit = pnl !== null && pnl > 0;

  return (
    <div className="space-y-4">
      {/* Asset header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-text-muted uppercase tracking-widest mb-0.5">
            BTC / USD
          </p>
          <p className="text-xl font-mono font-bold tabular-nums text-text-primary">
            $67.842
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-semibold text-mint bg-mint-dim px-2.5 py-1 rounded-lg tabular-nums">
            +3.24%
          </span>
          <p className="text-[10px] text-text-muted mt-1">Funding: −0.01%/8h</p>
        </div>
      </div>

      {/* LONG / SHORT buttons */}
      <div className="grid grid-cols-2 gap-2.5">
        <motion.button
          whileHover={prefersReduced ? {} : { scale: 1.025 }}
          whileTap={prefersReduced ? {} : { scale: 0.96 }}
          transition={{ ease: EASE, duration: 0.18 }}
          onClick={() => setSide(side === "long" ? null : "long")}
          aria-pressed={side === "long"}
          className={`py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-up focus-visible:ring-offset-surface-2 ${
            side === "long"
              ? "bg-up text-black shadow-lg shadow-up/20"
              : "bg-surface-3 text-up border border-up/25 hover:border-up/50 hover:bg-up/5"
          }`}
        >
          LONG
        </motion.button>
        <motion.button
          whileHover={prefersReduced ? {} : { scale: 1.025 }}
          whileTap={prefersReduced ? {} : { scale: 0.96 }}
          transition={{ ease: EASE, duration: 0.18 }}
          onClick={() => setSide(side === "short" ? null : "short")}
          aria-pressed={side === "short"}
          className={`py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-down focus-visible:ring-offset-surface-2 ${
            side === "short"
              ? "bg-down text-white shadow-lg shadow-down/20"
              : "bg-surface-3 text-down border border-down/25 hover:border-down/50 hover:bg-down/5"
          }`}
        >
          SHORT
        </motion.button>
      </div>

      {/* Leverage selector */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-text-muted">Hebel</span>
        <div className="flex gap-1.5">
          {LEVERAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLev(l)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-mint ${
                lev === l
                  ? "bg-mint/15 text-mint border border-mint/35"
                  : "text-text-muted border border-border hover:border-border-light hover:text-text-secondary"
              }`}
            >
              {l}×
            </button>
          ))}
        </div>
      </div>

      {/* P&L preview */}
      <AnimatePresence>
        {side !== null && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={prefersReduced ? {} : { opacity: 0, y: 6, height: 0 }}
            transition={{ ease: EASE, duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-3 border border-border rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Einsatz</span>
                <span className="font-mono text-text-secondary">€{ENTRY_AMOUNT}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Effektivposition</span>
                <span className="font-mono text-text-secondary">
                  €{ENTRY_AMOUNT * lev}
                </span>
              </div>
              <div className="border-t border-border pt-2.5 flex justify-between text-sm">
                <span className="text-text-secondary">
                  Bei +{SIMULATED_MOVE}% Bewegung
                </span>
                <span
                  className={`font-mono font-bold tabular-nums ${
                    isProfit ? "text-up" : "text-down"
                  }`}
                >
                  {isProfit ? "+" : ""}
                  {pnl?.toFixed(2)} €
                </span>
              </div>
              <p className="text-[10px] text-text-muted text-right tabular-nums">
                {lev}× × {SIMULATED_MOVE}% ={" "}
                {(lev * SIMULATED_MOVE).toFixed(0)}% Rendite
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {side === null && (
        <p className="text-center text-[11px] text-text-muted pt-1">
          Wähle eine Richtung und sieh, was Perps können
        </p>
      )}
    </div>
  );
}
