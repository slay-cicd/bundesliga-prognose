"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;
const LEVERAGES = [5, 10, 20, 50] as const;
type Lev = (typeof LEVERAGES)[number];

const SIMULATED_MOVE = 3.2;
const ENTRY = 20;

interface Props {
  theme?: "dark" | "cream";
}

export function FunnelTradeButtons({ theme = "dark" }: Props) {
  const [side, setSide] = useState<"long" | "short" | null>(null);
  const [lev, setLev] = useState<Lev>(10);
  const prefersReduced = useReducedMotion();

  const pnl =
    side !== null
      ? ENTRY * lev * (SIMULATED_MOVE / 100) * (side === "long" ? 1 : -1)
      : null;
  const isProfit = pnl !== null && pnl > 0;

  const isDark = theme === "dark";

  const C = isDark
    ? {
        assetLabel: "#55555a",
        price: "#e8e8ea",
        badge: { bg: "rgba(127,229,214,0.1)", color: "#7fe5d6" },
        funding: "#55555a",
        btnInactive: { bg: "#222225", border: "30" },
        leverageBtnActive: { bg: "rgba(127,229,214,0.12)", color: "#7fe5d6", border: "rgba(127,229,214,0.35)" },
        leverageBtnInactive: { color: "#55555a", border: "#2a2a2d" },
        pnlCard: { bg: "#222225", border: "#2a2a2d" },
        pnlLabel: "#55555a",
        pnlValue: "#888890",
        pnlDivider: "#2a2a2d",
        hint: "#55555a",
        up: "#22c55e",
        down: "#ef4444",
        accentColor: "#7fe5d6",
      }
    : {
        assetLabel: "#A09890",
        price: "#1A1714",
        badge: { bg: "rgba(28,122,75,0.08)", color: "#1C7A4B" },
        funding: "#A09890",
        btnInactive: { bg: "#EDE7DB", border: "20" },
        leverageBtnActive: { bg: "rgba(28,122,75,0.1)", color: "#1C4B38", border: "rgba(28,75,56,0.3)" },
        leverageBtnInactive: { color: "#A09890", border: "#DDD7CC" },
        pnlCard: { bg: "#EDE7DB", border: "#DDD7CC" },
        pnlLabel: "#A09890",
        pnlValue: "#6B6560",
        pnlDivider: "#DDD7CC",
        hint: "#A09890",
        up: "#1C7A4B",
        down: "#C44536",
        accentColor: "#1C4B38",
      };

  return (
    <div className="space-y-4">
      {/* Asset header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: C.assetLabel }}>
            BTC / USD
          </p>
          <p
            className="text-xl font-bold tabular-nums"
            style={{ fontFamily: "var(--font-mono, 'SF Mono', monospace)", color: C.price }}
          >
            $67.842
          </p>
        </div>
        <div className="text-right">
          <span
            className="text-xs font-semibold tabular-nums px-2.5 py-1 rounded-lg"
            style={{
              color: C.badge.color,
              background: C.badge.bg,
              fontFamily: "var(--font-mono, 'SF Mono', monospace)",
            }}
          >
            +3.24%
          </span>
          <p className="text-[10px] mt-1" style={{ color: C.funding }}>
            Funding: −0.01%/8h
          </p>
        </div>
      </div>

      {/* LONG / SHORT */}
      <div className="grid grid-cols-2 gap-2.5">
        {(["long", "short"] as const).map((s) => {
          const isSelected = side === s;
          const isLong = s === "long";
          const activeColor = isLong ? C.up : C.down;
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
                      color: isLong ? "#fff" : "#fff",
                      boxShadow: `0 8px 24px ${activeColor}28`,
                    }
                  : {
                      background: C.btnInactive.bg,
                      color: activeColor,
                      border: `1px solid ${activeColor}${C.btnInactive.border}`,
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
        <span className="text-xs" style={{ color: C.pnlLabel }}>
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
                background:
                  lev === l ? C.leverageBtnActive.bg : "transparent",
                color:
                  lev === l ? C.leverageBtnActive.color : C.leverageBtnInactive.color,
                border:
                  lev === l
                    ? `1px solid ${C.leverageBtnActive.border}`
                    : `1px solid ${C.leverageBtnInactive.border}`,
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
              style={{ background: C.pnlCard.bg, border: `1px solid ${C.pnlCard.border}` }}
            >
              <div className="flex justify-between text-xs">
                <span style={{ color: C.pnlLabel }}>Einsatz</span>
                <span
                  className="tabular-nums"
                  style={{ color: C.pnlValue, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}
                >
                  €{ENTRY}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: C.pnlLabel }}>Position</span>
                <span
                  className="tabular-nums"
                  style={{ color: C.pnlValue, fontFamily: "var(--font-mono, 'SF Mono', monospace)" }}
                >
                  €{ENTRY * lev}
                </span>
              </div>
              <div
                className="flex justify-between text-sm pt-2.5"
                style={{ borderTop: `1px solid ${C.pnlDivider}` }}
              >
                <span style={{ color: C.pnlValue }}>Bei +{SIMULATED_MOVE}% Bewegung</span>
                <span
                  className="font-bold tabular-nums"
                  style={{
                    color: isProfit ? C.up : C.down,
                    fontFamily: "var(--font-mono, 'SF Mono', monospace)",
                  }}
                >
                  {isProfit ? "+" : ""}
                  {pnl?.toFixed(2)} €
                </span>
              </div>
              <p className="text-[10px] text-right tabular-nums" style={{ color: C.pnlLabel }}>
                {lev}× × {SIMULATED_MOVE}% = {(lev * SIMULATED_MOVE).toFixed(0)}% Rendite
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {side === null && (
        <p className="text-center text-[11px]" style={{ color: C.hint }}>
          Wähle eine Richtung und sieh, was Perps können
        </p>
      )}
    </div>
  );
}
