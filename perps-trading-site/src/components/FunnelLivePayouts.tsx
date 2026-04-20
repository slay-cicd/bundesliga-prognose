"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

type Payout = {
  id: number;
  name: string;
  city: string;
  asset: string;
  profit: number;
  lev: number;
  ago: string;
};

const NAMES = [
  ["Marco K.", "Berlin"],
  ["Lena S.", "München"],
  ["Tim H.", "Hamburg"],
  ["Jana R.", "Köln"],
  ["Paul W.", "Frankfurt"],
  ["Sarah M.", "Stuttgart"],
  ["David O.", "Leipzig"],
  ["Julia B.", "Düsseldorf"],
  ["Nico F.", "Dresden"],
  ["Mara T.", "Nürnberg"],
  ["Felix L.", "Bremen"],
  ["Anna K.", "Bonn"],
  ["Luca P.", "Essen"],
  ["Mia V.", "Hannover"],
  ["Jonas E.", "Mainz"],
];

const ASSETS = ["BTC", "ETH", "GOLD", "TSLA", "NVDA", "SOL", "DAX", "AAPL", "SILBER", "OIL"];

function randomPayout(seed: number): Payout {
  const [name, city] = NAMES[seed % NAMES.length];
  const asset = ASSETS[(seed * 7) % ASSETS.length];
  // Bias toward exciting round numbers
  const base = [82, 128, 184, 247, 312, 428, 612, 843, 1284, 2141, 3820, 7240][seed % 12];
  const profit = base + Math.floor(Math.random() * 40);
  const lev = [10, 20, 25, 50, 75, 100][seed % 6];
  const minsAgo = (seed % 9) + 1;
  return {
    id: seed,
    name,
    city,
    asset,
    profit,
    lev,
    ago: minsAgo === 1 ? "gerade eben" : `vor ${minsAgo} Min`,
  };
}

function fmt(n: number) {
  return n.toLocaleString("de-DE");
}

export function FunnelLivePayouts() {
  const prefersReduced = useReducedMotion();
  const [seed, setSeed] = useState(0);
  const [items, setItems] = useState<Payout[]>(() =>
    Array.from({ length: 4 }, (_, i) => randomPayout(i))
  );

  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setSeed((s) => {
        const next = s + 1;
        setItems((prev) => [randomPayout(next + 10), ...prev.slice(0, 3)]);
        return next;
      });
    }, 3200);
    return () => clearInterval(interval);
  }, [prefersReduced]);

  // Just used as dep reader
  void seed;

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #111113 0%, #0a0a0b 100%)",
        borderColor: `${BURNT}22`,
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: `1px solid ${BURNT}18`, background: "#0d0d10" }}
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
            Live · Auszahlungen
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
          Heute
        </span>
      </div>

      <div className="px-5 py-3 space-y-0 min-h-[340px]">
        <AnimatePresence initial={false}>
          {items.map((p, idx) => (
            <motion.div
              key={p.id}
              layout
              initial={prefersReduced ? false : { opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: idx === 0 ? 1 : 1 - idx * 0.18, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-between py-3.5"
              style={{
                borderBottom: idx < items.length - 1 ? `1px solid #1a1a1d` : "none",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0 text-[10px] font-black"
                  style={{
                    background: `${BURNT}18`,
                    border: `1px solid ${BURNT}33`,
                    color: BURNT,
                    fontFamily: SERIF,
                  }}
                >
                  {p.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: "#e5e5e7" }}>
                    {p.name}{" "}
                    <span className="font-normal" style={{ color: "var(--color-text-muted)" }}>
                      · {p.city}
                    </span>
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                    {p.asset} · {p.lev}× Hebel · {p.ago}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <p className="text-base font-black tabular-nums" style={{ color: "#22c55e" }}>
                  +€{fmt(p.profit)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
