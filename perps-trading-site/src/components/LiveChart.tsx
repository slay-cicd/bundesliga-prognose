"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface LiveChartProps {
  basePrice: number;
  volatility: number;
  color?: string;
  positive?: boolean;
}

const WIDTH = 600;
const HEIGHT = 200;
const MAX_POINTS = 120;

export function LiveChart({ basePrice, volatility, positive = true }: LiveChartProps) {
  const [prices, setPrices] = useState<number[]>(() => {
    // Generate initial history
    const pts: number[] = [];
    let p = basePrice;
    for (let i = 0; i < 60; i++) {
      p += (Math.random() - 0.48) * volatility;
      pts.push(p);
    }
    return pts;
  });

  const currentRef = useRef(prices[prices.length - 1]);

  const tick = useCallback(() => {
    const delta = (Math.random() - 0.48) * volatility;
    currentRef.current += delta;
    setPrices((prev) => {
      const next = [...prev, currentRef.current];
      if (next.length > MAX_POINTS) next.shift();
      return next;
    });
  }, [volatility]);

  useEffect(() => {
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;
  const padY = 16;
  const chartH = HEIGHT - padY * 2;

  const points = prices.map((p, i) => {
    const x = (i / (MAX_POINTS - 1)) * WIDTH;
    const y = padY + chartH - ((p - min) / range) * chartH;
    return { x, y };
  });

  const pathD = points.map((pt, i) => `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`).join(" ");
  const lastPt = points[points.length - 1];
  const areaD = `${pathD} L${lastPt.x.toFixed(1)},${HEIGHT} L${points[0].x.toFixed(1)},${HEIGHT} Z`;

  const strokeColor = positive ? "#22c55e" : "#ef4444";
  const gradId = positive ? "chart-grad-up" : "chart-grad-down";

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={strokeColor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={0}
            y1={padY + chartH * frac}
            x2={WIDTH}
            y2={padY + chartH * frac}
            stroke="#222225"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Price line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price dot */}
        {lastPt && (
          <>
            <circle cx={lastPt.x} cy={lastPt.y} r="4" fill={strokeColor} />
            <circle cx={lastPt.x} cy={lastPt.y} r="8" fill={strokeColor} opacity="0.2">
              <animate attributeName="r" values="4;12;4" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  );
}
