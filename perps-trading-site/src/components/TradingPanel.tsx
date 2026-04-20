"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TradingPanelProps {
  upOdds: number;
  downOdds: number;
  onTrade?: () => void;
}

const quickAmounts = [1, 5, 10, 100];

export function TradingPanel({ upOdds, downOdds, onTrade }: TradingPanelProps) {
  const [direction, setDirection] = useState<"up" | "down">("up");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const odds = direction === "up" ? upOdds : downOdds;
  const payout = numAmount > 0 ? ((numAmount / odds) * 100).toFixed(2) : "0.00";

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

  return (
    <div className="bg-surface-1 rounded-xl border border-border p-5">
      {/* Direction buttons */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setDirection("up")}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold text-sm transition-all",
            direction === "up"
              ? "bg-up text-white"
              : "bg-surface-2 text-text-secondary border border-border hover:border-up hover:text-up"
          )}
        >
          Hoch {upOdds}¢
        </button>
        <button
          onClick={() => setDirection("down")}
          className={cn(
            "flex-1 py-3 rounded-lg font-semibold text-sm transition-all",
            direction === "down"
              ? "bg-down text-white"
              : "bg-surface-2 text-text-secondary border border-border hover:border-down hover:text-down"
          )}
        >
          Runter {downOdds}¢
        </button>
      </div>

      {/* Amount input */}
      <div className="mb-3">
        <label className="text-xs text-text-muted mb-1.5 block">Betrag</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">€</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full bg-surface-2 border border-border rounded-lg pl-7 pr-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-1.5 mb-5">
        {quickAmounts.map((val) => (
          <button
            key={val}
            onClick={() => handleQuickAdd(val)}
            className="flex-1 py-1.5 text-xs font-medium bg-surface-2 hover:bg-surface-3 border border-border rounded-md text-text-secondary transition-colors"
          >
            +€{val}
          </button>
        ))}
        <button
          onClick={() => setAmount("250")}
          className="flex-1 py-1.5 text-xs font-medium bg-surface-2 hover:bg-surface-3 border border-border rounded-md text-text-secondary transition-colors"
        >
          Max
        </button>
      </div>

      {/* Payout preview */}
      <div className="bg-surface-2 rounded-lg p-3 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-text-muted">Richtung</span>
          <span className={direction === "up" ? "text-up font-medium" : "text-down font-medium"}>
            {direction === "up" ? "Hoch ↑" : "Runter ↓"}
          </span>
        </div>
        <div className="flex justify-between text-xs mt-1.5">
          <span className="text-text-muted">Kurs</span>
          <span className="text-text-primary">{odds}¢</span>
        </div>
        <div className="flex justify-between text-xs mt-1.5">
          <span className="text-text-muted">Mögliche Auszahlung</span>
          <span className="text-text-primary font-semibold">€{payout}</span>
        </div>
      </div>

      {/* Trade button */}
      {!showConfirm ? (
        <button
          onClick={handleTrade}
          disabled={numAmount <= 0}
          className={cn(
            "w-full py-3 rounded-lg font-semibold text-sm transition-all",
            numAmount > 0
              ? "bg-accent hover:bg-accent-hover text-white"
              : "bg-surface-3 text-text-muted cursor-not-allowed"
          )}
        >
          Trade ausführen
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center"
        >
          <p className="text-sm font-semibold text-accent mb-1">Demo-Modus</p>
          <p className="text-xs text-text-secondary mb-3">
            Registriere dich für echtes Trading.
          </p>
          <a
            href="/registrierung"
            className="inline-block w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Jetzt registrieren
          </a>
        </motion.div>
      )}
    </div>
  );
}
