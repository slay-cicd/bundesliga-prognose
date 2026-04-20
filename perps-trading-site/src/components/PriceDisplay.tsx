"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";

const SERIF = "var(--font-cormorant, Georgia, serif)";

interface PriceDisplayProps {
  basePrice: number;
  currency: string;
  volatility: number;
  /** Render smaller when used inside grid */
  size?: "lg" | "md";
}

export function PriceDisplay({ basePrice, currency, volatility, size = "lg" }: PriceDisplayProps) {
  const [price, setPrice] = useState(basePrice);
  const [prevPrice, setPrevPrice] = useState(basePrice);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const next = prev + (Math.random() - 0.48) * volatility;
        setPrevPrice(prev);
        setFlash(next > prev ? "up" : "down");
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [volatility]);

  useEffect(() => {
    if (flash) {
      const t = setTimeout(() => setFlash(null), 400);
      return () => clearTimeout(t);
    }
  }, [flash]);

  const changePercent = ((price - basePrice) / basePrice) * 100;
  const positive = changePercent >= 0;

  const sizeClass =
    size === "lg" ? "text-4xl md:text-5xl" : "text-xl md:text-2xl";

  return (
    <div>
      <div className="flex items-baseline gap-3 flex-wrap">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={price.toFixed(2)}
            initial={{ y: price > prevPrice ? 8 : -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: price > prevPrice ? -8 : 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              sizeClass,
              "font-bold tabular-nums tracking-tight"
            )}
            style={{
              fontFamily: SERIF,
              fontWeight: 300,
              letterSpacing: "-0.02em",
              color:
                flash === "up"
                  ? "#22c55e"
                  : flash === "down"
                  ? "#ef4444"
                  : "var(--color-text-primary)",
              transition: "color 0.2s",
            }}
          >
            {formatPrice(price, currency)}
          </motion.span>
        </AnimatePresence>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: positive ? "#22c55e" : "#ef4444" }}
        >
          {positive ? "+" : ""}
          {changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
