"use client";

import { useState, useEffect } from "react";

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  isForex?: boolean;
}

const seed: TickerItem[] = [
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

function formatPrice(item: TickerItem) {
  if (item.isForex) return item.price.toFixed(4);
  if (item.price > 10000) return item.price.toFixed(0);
  if (item.price > 100) return item.price.toFixed(1);
  return item.price.toFixed(2);
}

export function MarketTicker() {
  const [items, setItems] = useState<TickerItem[]>(seed);
  const [flickering, setFlickering] = useState<Set<number>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * seed.length);
      setFlickering(new Set([idx]));
      setTimeout(() => setFlickering(new Set()), 300);

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
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  // Duplicate for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="w-full overflow-hidden bg-surface-1 border-b border-border relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-surface-1 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface-1 to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-8 py-2.5 px-6 whitespace-nowrap"
        style={{
          animation: "ticker-scroll 40s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => {
          const isFlickering = flickering.has(i % seed.length);
          return (
            <div
              key={i}
              className="flex items-center gap-2 text-xs font-mono shrink-0"
              style={isFlickering ? { animation: "flicker 0.3s ease" } : undefined}
            >
              <span className="text-text-secondary font-medium tracking-wide">
                {item.symbol}
              </span>
              <span className="text-text-primary tabular-nums">
                {formatPrice(item)}
              </span>
              <span
                className={`text-[10px] font-semibold tabular-nums ${
                  item.change >= 0 ? "text-mint" : "text-down"
                }`}
              >
                {item.change >= 0 ? "+" : ""}
                {item.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
