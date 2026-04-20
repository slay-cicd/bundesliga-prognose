"use client";

import Link from "next/link";
import type { Market } from "@/lib/markets";
import { formatPrice, formatChange, cn } from "@/lib/utils";
import { MarketLogo } from "@/components/MarketLogo";

const BURNT = "#C4622D";

interface RelatedMarketsProps {
  markets: Market[];
}

export function RelatedMarkets({ markets }: RelatedMarketsProps) {
  if (markets.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
        border: `1px solid ${BURNT}1a`,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest mb-3 font-bold"
        style={{ color: BURNT }}
      >
        Ähnliche Märkte
      </p>
      <div className="space-y-0.5">
        {markets.map((m) => {
          const positive = m.change24h >= 0;
          return (
            <Link
              key={m.id}
              href={`/market/${m.id}`}
              className="flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg transition-all group"
              style={{ borderBottom: `1px solid transparent` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,98,45,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex-shrink-0">
                  <MarketLogo market={m} size={28} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold leading-tight truncate"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    {m.name}
                  </p>
                  <p
                    className="text-[10px] uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {m.typeLabel}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 pl-2">
                <p
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {formatPrice(m.price, m.currency)}
                </p>
                <p
                  className={cn("text-[10px] font-bold tabular-nums")}
                  style={{ color: positive ? "#22c55e" : "#ef4444" }}
                >
                  {formatChange(m.change24h)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
