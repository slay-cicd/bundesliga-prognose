"use client";

import { useState, useEffect } from "react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  isForex?: boolean;
}

const SEED: TickerItem[] = [
  { symbol: "BTC/USD", price: 67842.5, change: 3.24 },
  { symbol: "ETH/USD", price: 3521.8, change: -1.15 },
  { symbol: "SOL/USD", price: 178.45, change: 5.67 },
  { symbol: "AAPL", price: 198.32, change: 0.89 },
  { symbol: "NVDA", price: 892.1, change: 2.14 },
  { symbol: "GOLD", price: 2385.1, change: 0.42 },
  { symbol: "EUR/USD", price: 1.0847, change: -0.12, isForex: true },
  { symbol: "DAX", price: 18245.0, change: 1.08 },
  { symbol: "TSLA", price: 245.6, change: -2.34 },
  { symbol: "OIL/USD", price: 78.42, change: -1.23 },
];

function fmt(item: TickerItem) {
  if (item.isForex) return item.price.toFixed(4);
  if (item.price > 10000) return item.price.toFixed(0);
  if (item.price > 100) return item.price.toFixed(1);
  return item.price.toFixed(2);
}

interface Props {
  theme?: "dark" | "cream";
}

export function FunnelMarketTicker({ theme = "dark" }: Props) {
  const [items, setItems] = useState<TickerItem[]>(SEED);
  const [flicker, setFlicker] = useState<number>(-1);

  useEffect(() => {
    const tick = () => {
      const idx = Math.floor(Math.random() * SEED.length);
      setFlicker(idx);
      setTimeout(() => setFlicker(-1), 320);
      setItems((prev) =>
        prev.map((item, i) =>
          i === idx
            ? {
                ...item,
                price: item.price * (1 + (Math.random() - 0.48) * 0.0015),
                change: +(item.change + (Math.random() - 0.48) * 0.15).toFixed(2),
              }
            : item
        )
      );
    };
    const id = setInterval(tick, 1400);
    return () => clearInterval(id);
  }, []);

  const doubled = [...items, ...items];

  const C =
    theme === "cream"
      ? {
          bg: "#EDE7DB",
          borderBottom: "1px solid #DDD7CC",
          fadeColor: "#EDE7DB",
          symbol: "#A09890",
          price: "#1A1714",
          upColor: "#1C7A4B",
          downColor: "#C44536",
        }
      : {
          bg: "#111113",
          borderBottom: "1px solid #2a2a2d",
          fadeColor: "#111113",
          symbol: "#888890",
          price: "#e8e8ea",
          upColor: "#7fe5d6",
          downColor: "#ef4444",
        };

  return (
    <div
      className="w-full overflow-hidden relative"
      style={{ backgroundColor: C.bg, borderBottom: C.borderBottom }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none z-10"
        style={{ background: `linear-gradient(to right, ${C.fadeColor}, transparent)` }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none z-10"
        style={{ background: `linear-gradient(to left, ${C.fadeColor}, transparent)` }}
      />
      <div
        className="flex gap-8 py-2.5 px-6 whitespace-nowrap"
        style={{ animation: "funnel-ticker 40s linear infinite", width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs shrink-0"
            style={{
              fontFamily: "var(--font-mono, 'SF Mono', monospace)",
              opacity: flicker === i % SEED.length ? 0.5 : 1,
              transition: "opacity 0.15s",
            }}
          >
            <span style={{ color: C.symbol, fontWeight: 500, letterSpacing: "0.05em" }}>
              {item.symbol}
            </span>
            <span style={{ color: C.price }} className="tabular-nums">
              {fmt(item)}
            </span>
            <span
              className="text-[10px] font-semibold tabular-nums"
              style={{ color: item.change >= 0 ? C.upColor : C.downColor }}
            >
              {item.change >= 0 ? "+" : ""}
              {item.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
