"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, cn } from "@/lib/utils";

interface PriceDisplayProps {
  basePrice: number;
  currency: string;
  volatility: number;
}

export function PriceDisplay({ basePrice, currency, volatility }: PriceDisplayProps) {
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

  return (
    <div>
      <div className="flex items-baseline gap-3">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={price.toFixed(2)}
            initial={{ y: price > prevPrice ? 8 : -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: price > prevPrice ? -8 : 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "text-3xl md:text-4xl font-bold tabular-nums tracking-tight",
              flash === "up" && "text-up",
              flash === "down" && "text-down",
              !flash && "text-text-primary"
            )}
          >
            {formatPrice(price, currency)}
          </motion.span>
        </AnimatePresence>
        <span className={cn("text-sm font-medium", positive ? "text-up" : "text-down")}>
          {positive ? "+" : ""}{changePercent.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}
