"use client";

import { useState, useEffect } from "react";

interface Props {
  theme?: "dark" | "cream" | "navy";
}

export function FunnelCountdown({ theme = "dark" }: Props) {
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

  const dotColor =
    theme === "cream" ? "#1C7A4B" : theme === "navy" ? "#4245E5" : "#7fe5d6";
  const textColor =
    theme === "cream" ? "#A09890" : theme === "navy" ? "#687190" : "#888890";
  const numColor =
    theme === "cream" ? "#1A1714" : theme === "navy" ? "#0B0E1A" : "#7fe5d6";

  return (
    <div className="inline-flex items-center gap-2.5 text-sm">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
          style={{ backgroundColor: dotColor, animationDuration: "1.5s" }}
        />
        <span
          className="relative inline-flex rounded-full h-2 w-2"
          style={{ backgroundColor: dotColor }}
        />
      </span>
      <span className="text-xs" style={{ color: textColor }}>
        Noch{" "}
        <span className="font-bold tabular-nums" style={{ color: numColor }}>
          {spots}
        </span>{" "}
        Early-Access-Plätze
      </span>
    </div>
  );
}
