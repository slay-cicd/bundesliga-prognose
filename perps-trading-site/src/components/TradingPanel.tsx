"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

interface TradingPanelProps {
  upOdds: number;
  downOdds: number;
  /** "perp" = perpetual contract (leverage trade); otherwise binary short-term */
  mode?: "perp" | "binary";
  maxLeverage?: number;
  onTrade?: () => void;
}

const quickAmounts = [10, 50, 100, 250];

export function TradingPanel({
  upOdds,
  downOdds,
  mode = "binary",
  maxLeverage = 100,
  onTrade,
}: TradingPanelProps) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState(25);
  const [showConfirm, setShowConfirm] = useState(false);
  const prefersReduced = useReducedMotion();

  const numAmount = parseFloat(amount) || 0;
  const odds = direction === "up" ? upOdds : downOdds;

  // binary payout: stake / odds × 100
  const binaryPayout = numAmount > 0 ? ((numAmount / odds) * 100).toFixed(2) : "0.00";
  // perp payout preview: stake × leverage × 5% move
  const perpPositionSize = numAmount * leverage;
  const perpGainAt5 = (perpPositionSize * 0.05).toFixed(0);
  const perpGainAt10 = (perpPositionSize * 0.1).toFixed(0);

  function handleQuickAdd(val: number) {
    setAmount((prev) => {
      const current = parseFloat(prev) || 0;
      return String(current + val);
    });
  }

  function handleTrade() {
    setShowConfirm(true);
    onTrade?.();
  }

  const isPerp = mode === "perp";

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
        border: `1px solid ${BURNT}22`,
        boxShadow: `0 0 0 1px ${BURNT}0d, 0 18px 50px -20px ${BURNT}22`,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest mb-4 font-bold"
        style={{ color: BURNT }}
      >
        {isPerp ? "Position eröffnen · Perpetual" : "Position eröffnen"}
      </p>

      {/* Direction buttons */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setDirection("up")}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm transition-all"
          )}
          style={
            direction === "up"
              ? {
                  background: "#22c55e",
                  color: "#fff",
                  boxShadow: "0 0 22px rgba(34,197,94,0.35)",
                }
              : {
                  background: "#18181b",
                  color: "var(--color-text-secondary)",
                  border: "1px solid #2a2a2d",
                }
          }
        >
          {isPerp ? "Long ↑" : `Hoch ${upOdds}¢`}
        </button>
        <button
          onClick={() => setDirection("down")}
          className={cn(
            "flex-1 py-3 rounded-xl font-bold text-sm transition-all"
          )}
          style={
            direction === "down"
              ? {
                  background: "#ef4444",
                  color: "#fff",
                  boxShadow: "0 0 22px rgba(239,68,68,0.35)",
                }
              : {
                  background: "#18181b",
                  color: "var(--color-text-secondary)",
                  border: "1px solid #2a2a2d",
                }
          }
        >
          {isPerp ? "Short ↓" : `Runter ${downOdds}¢`}
        </button>
      </div>

      {/* Amount input */}
      <div className="mb-3">
        <label
          className="text-[10px] uppercase tracking-widest mb-1.5 block font-semibold"
          style={{ color: "var(--color-text-muted)" }}
        >
          Einsatz
        </label>
        <div className="relative">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold"
            style={{ color: "var(--color-text-muted)" }}
          >
            €
          </span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full rounded-xl pl-8 pr-4 py-3 text-base font-bold tabular-nums outline-none transition-all"
            style={{
              background: "#18181b",
              border: "1px solid #2a2a2d",
              color: "#e5e5e7",
              colorScheme: "dark",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2d")}
          />
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-1.5 mb-5">
        {quickAmounts.map((val) => (
          <button
            key={val}
            onClick={() => handleQuickAdd(val)}
            className="flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all"
            style={{
              background: "#18181b",
              border: "1px solid #2a2a2d",
              color: "var(--color-text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${BURNT}66`;
              e.currentTarget.style.color = BURNT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2d";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            +€{val}
          </button>
        ))}
        <button
          onClick={() => setAmount("1000")}
          className="flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all"
          style={{
            background: "#18181b",
            border: `1px solid ${BURNT}55`,
            color: BURNT,
          }}
        >
          Max
        </button>
      </div>

      {/* Leverage slider (perp only) */}
      {isPerp && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label
              className="text-[10px] uppercase tracking-widest font-semibold"
              style={{ color: "var(--color-text-muted)" }}
            >
              Hebel
            </label>
            <span
              className="text-sm font-bold tabular-nums"
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                color: BURNT,
              }}
            >
              {leverage}×
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={maxLeverage}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full"
            style={{ accentColor: BURNT }}
          />
          <div
            className="flex justify-between text-[9px] mt-1 font-semibold"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>1×</span>
            <span>{Math.floor(maxLeverage / 2)}×</span>
            <span style={{ color: "#ef4444" }}>{maxLeverage}×</span>
          </div>
        </div>
      )}

      {/* Payout preview */}
      <div
        className="rounded-xl p-3.5 mb-4 space-y-2"
        style={{
          background: "linear-gradient(180deg, #18181b 0%, #111114 100%)",
          border: `1px solid ${BURNT}18`,
        }}
      >
        <div className="flex justify-between text-xs">
          <span style={{ color: "var(--color-text-muted)" }}>Richtung</span>
          <span
            className="font-bold"
            style={{
              color: direction === "up" ? "#22c55e" : "#ef4444",
            }}
          >
            {isPerp
              ? direction === "up"
                ? "Long ↑"
                : "Short ↓"
              : direction === "up"
              ? "Hoch ↑"
              : "Runter ↓"}
          </span>
        </div>

        {isPerp ? (
          <>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-muted)" }}>Positionsgröße</span>
              <span className="font-bold tabular-nums" style={{ color: BURNT }}>
                €{perpPositionSize.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="h-px" style={{ background: `${BURNT}22` }} />
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-muted)" }}>
                Gewinn bei <span style={{ color: "#22c55e" }}>+5%</span>
              </span>
              <span className="font-bold tabular-nums" style={{ color: "#22c55e" }}>
                +€{Number(perpGainAt5).toLocaleString("de-DE")}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-muted)" }}>
                Gewinn bei <span style={{ color: "#22c55e" }}>+10%</span>
              </span>
              <span className="font-bold tabular-nums" style={{ color: "#22c55e" }}>
                +€{Number(perpGainAt10).toLocaleString("de-DE")}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between text-xs">
              <span style={{ color: "var(--color-text-muted)" }}>Kurs</span>
              <span className="font-semibold tabular-nums" style={{ color: "#e5e5e7" }}>
                {odds}¢
              </span>
            </div>
            <div className="h-px" style={{ background: `${BURNT}22` }} />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Mögliche Auszahlung
              </span>
              <span
                className="font-bold tabular-nums text-base"
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  color: "#22c55e",
                }}
              >
                €{binaryPayout}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Trade button */}
      {!showConfirm ? (
        <motion.button
          onClick={handleTrade}
          disabled={numAmount <= 0}
          whileHover={prefersReduced || numAmount <= 0 ? undefined : { scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
          style={
            numAmount > 0
              ? {
                  background: BURNT,
                  color: "#fff",
                  boxShadow: `0 0 0 1px ${BURNT}, 0 8px 24px -6px ${BURNT}88`,
                }
              : {
                  background: "#18181b",
                  color: "var(--color-text-muted)",
                  border: "1px solid #2a2a2d",
                  cursor: "not-allowed",
                }
          }
          onMouseEnter={(e) => {
            if (numAmount > 0) e.currentTarget.style.background = "#b0561f";
          }}
          onMouseLeave={(e) => {
            if (numAmount > 0) e.currentTarget.style.background = BURNT;
          }}
        >
          {numAmount > 0 ? `Position eröffnen · €${numAmount.toLocaleString("de-DE")}` : "Einsatz eingeben"}
        </motion.button>
      ) : (
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-xl p-4 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(196,98,45,0.12) 0%, rgba(34,197,94,0.05) 100%)",
            border: `1px solid ${BURNT}44`,
          }}
        >
          <p
            className="text-base mb-1"
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 400,
              color: "#e5e5e7",
            }}
          >
            Bereit für echtes Trading?
          </p>
          <p className="text-xs mb-3" style={{ color: "var(--color-text-muted)" }}>
            Account erstellen in unter 60 Sekunden
          </p>
          <a
            href="/registrierung"
            data-event="register_click"
            className="block w-full py-2.5 text-white text-sm font-bold rounded-lg transition-all"
            style={{
              background: BURNT,
              boxShadow: `0 0 0 1px ${BURNT}, 0 4px 16px -4px ${BURNT}88`,
            }}
          >
            Jetzt registrieren →
          </a>
        </motion.div>
      )}
    </div>
  );
}
