"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function LeverageSlider() {
  const [leverage, setLeverage] = useState(10);
  const investment = 100;
  const profit = investment * leverage * 0.05;

  return (
    <div className="bg-surface-1 rounded-xl border border-border p-6 md:p-8 max-w-lg mx-auto">
      <div className="text-center mb-6">
        <p className="text-sm text-text-muted mb-1">Dein Einsatz</p>
        <p className="text-3xl font-bold text-text-primary">€{investment}</p>
      </div>

      <div className="mb-6">
        <input
          type="range"
          min={1}
          max={100}
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>1x</span>
          <span>25x</span>
          <span>50x</span>
          <span>100x</span>
        </div>
      </div>

      <motion.div key={leverage} initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center mb-4">
        <p className="text-sm text-text-muted">Hebel</p>
        <p className="text-5xl font-bold text-accent">{leverage}x</p>
      </motion.div>

      <div className="bg-surface-2 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-text-muted">Positionsgröße</p>
            <p className="text-lg font-bold text-text-primary">
              €{(investment * leverage).toLocaleString("de-DE")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Bei +5% Bewegung</p>
            <motion.p
              key={profit}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-up"
            >
              +€{profit.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
            </motion.p>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted text-center mt-3">
        Vereinfachte Darstellung. Verluste bis zur gesamten Einlage möglich.
      </p>
    </div>
  );
}
