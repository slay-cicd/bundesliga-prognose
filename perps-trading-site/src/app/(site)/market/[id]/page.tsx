"use client";

import { use } from "react";
import { markets, getRelatedMarkets, categoryLabels } from "@/lib/markets";
import { LiveChart } from "@/components/LiveChart";
import { TradingPanel } from "@/components/TradingPanel";
import { PriceDisplay } from "@/components/PriceDisplay";
import { CountdownTimer } from "@/components/CountdownTimer";
import { RelatedMarkets } from "@/components/RelatedMarkets";
import { SignupCTA } from "@/components/SignupCTA";
import Link from "next/link";
import { notFound } from "next/navigation";

function getVolatility(price: number): number {
  if (price > 10000) return price * 0.002;
  if (price > 1000) return price * 0.003;
  if (price > 100) return price * 0.005;
  if (price > 10) return price * 0.008;
  if (price > 1) return price * 0.01;
  return price * 0.002;
}

export default function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const market = markets.find((m) => m.id === id);

  if (!market) return notFound();

  const related = getRelatedMarkets(market, 5);
  const volatility = getVolatility(market.price);
  const positive = market.change24h >= 0;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
          <Link href="/" className="hover:text-text-secondary transition-colors">Märkte</Link>
          <span>/</span>
          <span className="text-text-secondary">{categoryLabels[market.category]}</span>
          <span>/</span>
          <span className="text-text-primary">{market.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Chart + Info */}
          <div className="space-y-4">
            {/* Market header */}
            <div className="bg-surface-1 rounded-xl border border-border p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: market.color }}
                  >
                    {market.abbr.slice(0, 4)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-text-primary">{market.name}</h1>
                    <p className="text-sm text-text-muted">{market.pair} · {market.typeLabel}</p>
                  </div>
                </div>
                {(market.type === "5min" || market.type === "15min" || market.type === "1h") && (
                  <div className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-center">
                    <p className="text-[10px] text-text-muted uppercase tracking-wider mb-0.5">Endet in</p>
                    <CountdownTimer type={market.type} size="lg" />
                  </div>
                )}
              </div>

              <PriceDisplay
                basePrice={market.price}
                currency={market.currency}
                volatility={volatility}
              />
            </div>

            {/* Chart */}
            <div className="bg-surface-1 rounded-xl border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                {["5 Min", "15 Min", "1 Std", "1 Tag"].map((label) => (
                  <button
                    key={label}
                    className={`text-xs px-2.5 py-1 rounded ${
                      label === market.typeLabel
                        ? "bg-surface-3 text-text-primary font-medium"
                        : "text-text-muted hover:text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <LiveChart
                basePrice={market.price}
                volatility={volatility}
                positive={positive}
              />
            </div>

            {/* Price to beat */}
            <div className="bg-surface-1 rounded-xl border border-border p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Price To Beat</p>
                  <p className="text-lg font-bold text-text-primary tabular-nums">
                    {market.currency}{market.price.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-text-muted">Eröffnungskurs dieses Fensters</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Aktueller Kurs</p>
                  <PriceDisplay
                    basePrice={market.price}
                    currency={market.currency}
                    volatility={volatility}
                  />
                </div>
              </div>
            </div>

            {/* Market info */}
            <div className="bg-surface-1 rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-2">Über diesen Markt</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                {market.description}
              </p>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Regeln</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {market.rules}
              </p>
            </div>

            {/* Volume / Order book placeholder */}
            <div className="bg-surface-1 rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-3">Orderbuch</h2>
              <div className="space-y-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const upPct = market.upOdds + (2 - i) * 2;
                  const vol = Math.floor(Math.random() * 5000) + 500;
                  return (
                    <div key={`up-${i}`} className="flex items-center text-xs">
                      <span className="w-16 text-up tabular-nums">{Math.min(upPct, 99)}¢</span>
                      <div className="flex-1 h-5 bg-surface-2 rounded overflow-hidden">
                        <div
                          className="h-full bg-up/10"
                          style={{ width: `${Math.min(vol / 50, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-text-muted tabular-nums">€{vol.toLocaleString("de-DE")}</span>
                    </div>
                  );
                })}
                <div className="border-t border-border my-1.5" />
                {Array.from({ length: 5 }, (_, i) => {
                  const downPct = market.downOdds + i * 2;
                  const vol = Math.floor(Math.random() * 5000) + 500;
                  return (
                    <div key={`down-${i}`} className="flex items-center text-xs">
                      <span className="w-16 text-down tabular-nums">{Math.min(downPct, 99)}¢</span>
                      <div className="flex-1 h-5 bg-surface-2 rounded overflow-hidden">
                        <div
                          className="h-full bg-down/10"
                          style={{ width: `${Math.min(vol / 50, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-text-muted tabular-nums">€{vol.toLocaleString("de-DE")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <TradingPanel upOdds={market.upOdds} downOdds={market.downOdds} />
            <RelatedMarkets markets={related} />

            {/* Inline signup */}
            <div className="bg-surface-1 rounded-xl border border-accent/20 p-5 text-center">
              <p className="text-sm font-semibold text-text-primary mb-1">Demo-Modus</p>
              <p className="text-xs text-text-muted mb-3">
                Registriere dich für echtes Trading mit echtem Geld.
              </p>
              <Link
                href="/registrierung"
                className="block w-full py-2.5 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Jetzt registrieren
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <SignupCTA />
    </>
  );
}
