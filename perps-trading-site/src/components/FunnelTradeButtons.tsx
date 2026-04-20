"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const LEVERAGES = [5, 10, 20, 50] as const;
type Lev = (typeof LEVERAGES)[number];

const SIMULATED_MOVE = 3.2;
const ENTRY = 20;

export function FunnelTradeButtons() {
  const [side, setSide] = useState<"long" | "short" | null>(null);
  const [lev, setLev] = useState<Lev>(10);
  const prefersReduced = useReducedMotion();

  const pnl =
    side !== null
      ? ENTRY * lev * (SIMULATED_MOVE / 100) * (side === "long" ? 1 : -1)
      : null;
  const isProfit = pnl !== null && pnl > 0;

  return (
    <div className="space-y-4">
      {/* Asset header */}
      <div className="flex items-center justify-between">
        <div>
          <p
            className="text-[10px] uppercase tracking-widest mb-0.5"
            style={{ color: "#55555a" }}
          >
            BTC / USD
          </p>
          <p
            className="text-xl font-bold tabular-nums"
            style={{
              fontFamily: "var(--font-mono, 'SF Mono', monospace)",
              color: "#e8e8ea",
            }}
          >
            $67.842
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-lg"
            style={{
              color: "#7fe5d6",
              background: "rgba(127,229,214,0.1)",
              fontFamily: "var(--font-mono, 'SF Mono', monospace)",
            }}
          >
            +3.24%
          </span>
          <p className="text-[10px] mt-1" style={{ color: "#55555a" }}>
            Funding: −0.01%/8h
          </p>
        </div>
      </div>

      {/* LONG / SHORT */}
      <div className="grid grid-cols-2 gap-2.5">
        {(["long", "short"] as const).map((s) => {
          const isSelected = side === s;
          const isLong = s === "long";
          const activeColor = isLong ? "#22c55e" : "#ef4444";
          return (
            <motion.button
              key={s}
              whileHover={prefersReduced ? {} : { scale: 1.025 }}
              whileTap={prefersReduced ? {} : { scale: 0.96 }}
              transition={{ ease: EASE, duration: 0.18 }}
              onClick={() => setSide(side === s ? null : s)}
              aria-pressed={isSelected}
              className="py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 focus:outline-none"
              style={
                isSelected
                  ? {
                      background: activeColor,
                      color: isLong ? "#000" : "#fff",
                      boxShadow: `0 8px 24px ${activeColor}30`,
                    }
                  : {
                      background: "#222225",
                      color: activeColor,
                      border: `1px solid ${activeColor}30`,
                    }
              }
            >
              {s.toUpperCase()}
            </motion.button>
          );
        })}
      </div>

      {/* Leverage */}
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: "#55555a" }}>
          Hebel
        </span>
        <div className="flex gap-1.5">
          {LEVERAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLev(l)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-150 focus:outline-none"
              style={{
                fontFamily: "var(--font-mono, 'SF Mono', monospace)",
                background: lev === l ? "rgba(127,229,214,0.12)" : "transparent",
                color: lev === l ? "#7fe5d6" : "#55555a",
                border: lev === l ? "1px solid rgba(127,229,214,0.35)" : "1px solid #2a2a2d",
              }}
            >
              {l}×
            </button>
          ))}
        </div>
      </div>

      {/* P&L Preview */}
      <AnimatePresence>
        {side !== null && (
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={prefersReduced ? {} : { opacity: 0, height: 0 }}
            transition={{ ease: EASE, duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-xl p-4 space-y-2.5"
              style={{ background: "#222225", border: "1px solid #2a2a2d" }}
            >
              <div className="flex justify-between text-xs">
                <span style={{ color: "#55555a" }}>Einsatz</span>
                <span
                  className="tabular-nums"
                  style={{
                    color: "#888890",
                    fontFamily: "var(--font-mono, 'SF Mono', monospace)",
                  }}
                >
                  €{ENTRY}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#55555a" }}>Position</span>
                <span
                  className="tabular-nums"
                  style={{
                    color: "#888890",
                    fontFamily: "var(--font-mono, 'SF Mono', monospace)",
                  }}
                >
                  €{ENTRY * lev}
                </span>
              </div>
              <div
                className="flex justify-between text-sm pt-2.5"
                style={{ borderTop: "1px solid #2a2a2d" }}
              >
                <span style={{ color: "#888890" }}>
                  Bei +{SIMULATED_MOVE}% Bewegung
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: isProfit ? "#22c55e" : "#ef4444",
                    fontFamily: "var(--font-mono, 'SF Mono', monospace)",
                  }}
                >
                  {isProfit ? "+" : ""}
                  {pnl?.toFixed(2)} €
                </span>
              </div>
              <p
                className="text-[10px] text-right tabular-nums"
                style={{ color: "#55555a" }}
              >
                {lev}× × {SIMULATED_MOVE}% ={" "}
                {(lev * SIMULATED_MOVE).toFixed(0)}% Rendite
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {side === null && (
        <p className="text-center text-[11px]" style={{ color: "#55555a" }}>
          Wähle eine Richtung und sieh, was Perps können
        </p>
      )}
    </div>
  );
}
