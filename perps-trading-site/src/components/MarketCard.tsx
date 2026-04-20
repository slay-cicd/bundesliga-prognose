"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Market } from "@/lib/markets";
import { formatPrice, formatChange, cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import { CountdownTimer } from "./CountdownTimer";
import { MarketLogo } from "./MarketLogo";

interface MarketCardProps {
  market: Market;
  index: number;
}

const SERIF = "var(--font-cormorant, Georgia, serif)";

export function MarketCard({ market, index }: MarketCardProps) {
  const positive = market.change24h >= 0;

  return (
    <Link href={`/market/${market.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -3 }}
        className="relative bg-surface-1 rounded-2xl border border-border p-5 cursor-pointer group overflow-hidden"
        style={{
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
        onHoverStart={(e) => {
          const el = e.target as HTMLElement;
          const card = el.closest(".group") as HTMLElement;
          if (card) {
            card.style.borderColor = "#C4622D66";
            card.style.boxShadow = "0 8px 32px rgba(196,98,45,0.08)";
          }
        }}
        onHoverEnd={(e) => {
          const el = e.target as HTMLElement;
          const card = el.closest(".group") as HTMLElement;
          if (card) {
            card.style.borderColor = "";
            card.style.boxShadow = "";
          }
        }}
      >
        {/* Subtle accent line on left edge on hover */}
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "#C4622D" }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <MarketLogo market={market} size={44} />
            <div>
              <h3
                className="leading-tight text-text-primary"
                style={{
                  fontFamily: SERIF,
                  fontWeight: 600,
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                }}
              >
                {market.name}
              </h3>
              <p className="text-[11px] text-text-muted font-mono tracking-wide">{market.pair}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className="text-[10px] text-text-muted bg-surface-2 px-2 py-0.5 rounded tracking-widest uppercase">
              {market.typeLabel}
            </span>
            {(market.type === "5min" || market.type === "15min" || market.type === "1h") && (
              <CountdownTimer type={market.type} />
            )}
          </div>
        </div>

        {/* Price + Sparkline */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-text-primary tracking-tight tabular-nums leading-none mb-1">
              {formatPrice(market.price, market.currency)}
            </p>
            <p className={cn("text-xs font-semibold tabular-nums", positive ? "text-up" : "text-down")}>
              {formatChange(market.change24h)}
            </p>
          </div>
          <Sparkline data={market.sparkline} positive={positive} />
        </div>

        {/* Odds bar */}
        <div className="flex gap-2">
          <div className="flex-1 text-center py-2 rounded-lg bg-up-dim text-up text-[11px] font-bold tracking-wide">
            Hoch {market.upOdds}¢
          </div>
          <div className="flex-1 text-center py-2 rounded-lg bg-down-dim text-down text-[11px] font-bold tracking-wide">
            Runter {market.downOdds}¢
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
