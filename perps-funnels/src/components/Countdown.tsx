"use client";

import { useState, useEffect } from "react";

export function Countdown() {
  const [spots, setSpots] = useState(143);

  useEffect(() => {
    const tick = () => {
      const delay = 7000 + Math.random() * 14000;
      const timer = setTimeout(() => {
        setSpots((prev) => {
          if (prev <= 10) return 143;
          return prev - 1;
        });
        tick();
      }, delay);
      return timer;
    };
    const t = tick();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-2.5 text-sm">
      {/* Live indicator */}
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-60"
          style={{ animationDuration: "1.5s" }}
        />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-mint" />
      </span>
      <span className="text-text-secondary text-xs">
        Noch{" "}
        <span className="text-mint font-bold tabular-nums">{spots}</span>{" "}
        Early-Access-Plätze verfügbar
      </span>
    </div>
  );
}
