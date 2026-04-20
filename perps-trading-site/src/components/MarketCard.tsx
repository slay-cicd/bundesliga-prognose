"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Market } from "@/lib/markets";
import { formatPrice, formatChange, cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import { CountdownTimer } from "./CountdownTimer";

interface MarketCardProps {
  market: Market;
  index: number;
}

export function MarketCard({ market, index }: MarketCardProps) {
  const positive = market.change24h >= 0;

  return (
    <Link href={`/market/${market.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        whileHover={{ y: -2 }}
        className="bg-surface-1 rounded-xl border border-border p-4 hover:border-border-light transition-all cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
              style={{ backgroundColor: market.color }}
            >
              {market.abbr.slice(0, 3)}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary leading-tight">
                {market.name}
              </h3>
              <p className="text-xs text-text-muted">{market.pair}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-text-muted bg-surface-2 px-2 py-0.5 rounded">
              {market.typeLabel}
            </span>
            {(market.type === "5min" || market.type === "15min" || market.type === "1h") && (
              <CountdownTimer type={market.type} />
            )}
          </div>
        </div>

        {/* Price + Sparkline */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-xl font-bold text-text-primary tracking-tight">
              {formatPrice(market.price, market.currency)}
            </p>
            <p className={cn("text-xs font-medium", positive ? "text-up" : "text-down")}>
              {formatChange(market.change24h)}
            </p>
          </div>
          <Sparkline data={market.sparkline} positive={positive} />
        </div>

        {/* Odds bar */}
        <div className="flex gap-2">
          <div className="flex-1 text-center py-1.5 rounded-md bg-up-dim text-up text-xs font-semibold">
            Hoch {market.upOdds}¢
          </div>
          <div className="flex-1 text-center py-1.5 rounded-md bg-down-dim text-down text-xs font-semibold">
            Runter {market.downOdds}¢
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
