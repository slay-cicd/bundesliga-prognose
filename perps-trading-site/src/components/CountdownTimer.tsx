"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  type?: "5min" | "15min" | "1h" | "daily" | "perp";
  size?: "sm" | "lg";
}

export function CountdownTimer({ type = "15min", size = "sm" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    function getTimeLeft() {
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      let interval: number;
      switch (type) {
        case "5min":
          interval = 5;
          break;
        case "15min":
          interval = 15;
          break;
        case "1h":
          interval = 60;
          break;
        default:
          interval = 15;
      }

      const nextSlot = Math.ceil((minutes + 1) / interval) * interval;
      const remaining = (nextSlot - minutes - 1) * 60 + (60 - seconds);

      return {
        minutes: Math.floor(remaining / 60),
        seconds: remaining % 60,
      };
    }

    setTimeLeft(getTimeLeft());
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [type]);

  const urgent = timeLeft.minutes < 1;

  if (type === "daily" || type === "perp") return null;

  return (
    <span
      className={cn(
        "font-mono font-semibold tabular-nums",
        size === "lg" ? "text-2xl" : "text-xs",
        urgent ? "text-down" : "text-up"
      )}
    >
      {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
    </span>
  );
}
