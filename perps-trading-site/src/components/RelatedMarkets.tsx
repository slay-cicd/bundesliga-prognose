"use client";

import Link from "next/link";
import type { Market } from "@/lib/markets";
import { formatPrice, formatChange, cn } from "@/lib/utils";

interface RelatedMarketsProps {
  markets: Market[];
}

export function RelatedMarkets({ markets }: RelatedMarketsProps) {
  if (markets.length === 0) return null;

  return (
    <div className="bg-surface-1 rounded-xl border border-border p-4">
      <h3 className="text-sm font-semibold text-text-primary mb-3">Ähnliche Märkte</h3>
      <div className="space-y-1">
        {markets.map((m) => {
          const positive = m.change24h >= 0;
          return (
            <Link
              key={m.id}
              href={`/market/${m.id}`}
              className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-surface-2 transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                  style={{ backgroundColor: m.color }}
                >
                  {m.abbr.slice(0, 3)}
                </div>
                <div>
                  <p className="text-sm text-text-primary font-medium leading-tight">{m.name}</p>
                  <p className="text-[10px] text-text-muted">{m.typeLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-primary tabular-nums">
                  {formatPrice(m.price, m.currency)}
                </p>
                <p className={cn("text-[10px] font-medium", positive ? "text-up" : "text-down")}>
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
