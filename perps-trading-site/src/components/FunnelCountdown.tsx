"use client";

import { useState, useEffect } from "react";

export function FunnelCountdown() {
  const [spots, setSpots] = useState(143);

  useEffect(() => {
    const tick = () => {
      const delay = 7000 + Math.random() * 14000;
      const t = setTimeout(() => {
        setSpots((p) => (p <= 10 ? 143 : p - 1));
        tick();
      }, delay);
      return t;
    };
    const t = tick();
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-2.5 text-sm">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: "#7fe5d6", animationDuration: "1.5s" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: "#7fe5d6" }}
        />
      </span>
      <span className="text-xs" style={{ color: "#888890" }}>
        Noch{" "}
        <span className="font-bold tabular-nums" style={{ color: "#7fe5d6" }}>
          {spots}
        </span>{" "}
        Early-Access-Plätze
      </span>
    </div>
  );
}
