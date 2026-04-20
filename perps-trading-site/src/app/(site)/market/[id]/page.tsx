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
import { MarketLogo } from "@/components/MarketLogo";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

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
  const isPerp = market.type === "perp";
  const isBinary = market.type === "5min" || market.type === "15min" || market.type === "1h";

  return (
    <>
      {/* Subtle top glow */}
      <div
        className="fixed inset-x-0 top-0 pointer-events-none h-[400px]"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.08) 0%, transparent 60%)",
          zIndex: 0,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-[11px] uppercase tracking-widest mb-6"
          style={{ color: "var(--color-text-muted)" }}
        >
          <Link href="/" className="transition-colors hover:text-text-secondary">
            Märkte
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span>{categoryLabels[market.category]}</span>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: BURNT }}>{market.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* ── Left column ──────────────────────────────────── */}
          <div className="space-y-5">
            {/* Market header — branded */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                border: `1px solid ${BURNT}1a`,
              }}
            >
              <div className="flex items-start justify-between mb-5 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex-shrink-0">
                    <MarketLogo market={market} size={48} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h1
                        style={{
                          fontFamily: SERIF,
                          fontSize: "clamp(28px, 4vw, 40px)",
                          fontWeight: 300,
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                          color: "var(--color-text-primary)",
                        }}
                      >
                        {market.name}
                      </h1>
                      {isPerp && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest"
                          style={{
                            background: `${BURNT}22`,
                            color: BURNT,
                            border: `1px solid ${BURNT}44`,
                          }}
                        >
                          PERP
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {market.pair} · {market.typeLabel}
                    </p>
                  </div>
                </div>

                {isBinary && (
                  <div
                    className="rounded-xl px-4 py-2.5 text-center flex-shrink-0"
                    style={{
                      background: `${BURNT}10`,
                      border: `1px solid ${BURNT}33`,
                    }}
                  >
                    <p
                      className="text-[9px] uppercase tracking-widest mb-0.5 font-bold"
                      style={{ color: BURNT }}
                    >
                      Endet in
                    </p>
                    <CountdownTimer type={market.type} size="lg" />
                  </div>
                )}

                {isPerp && market.fundingRate !== undefined && (
                  <div
                    className="rounded-xl px-4 py-2.5 text-right flex-shrink-0"
                    style={{
                      background: "#18181b",
                      border: "1px solid #2a2a2d",
                    }}
                  >
                    <p
                      className="text-[9px] uppercase tracking-widest mb-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Funding 8h
                    </p>
                    <p
                      className="text-sm font-bold tabular-nums"
                      style={{ color: market.fundingRate >= 0 ? "#22c55e" : "#ef4444" }}
                    >
                      {market.fundingRate >= 0 ? "+" : ""}
                      {market.fundingRate.toFixed(4)}%
                    </p>
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
            <div
              className="rounded-2xl p-5"
              style={{
                background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                border: `1px solid ${BURNT}1a`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: BURNT }}
                >
                  Kurs-Chart
                </p>
                <div className="flex items-center gap-1.5">
                  {["5 Min", "15 Min", "1 Std", "1 Tag"].map((label) => (
                    <button
                      key={label}
                      className="text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all"
                      style={
                        label === market.typeLabel
                          ? {
                              background: BURNT,
                              color: "#fff",
                            }
                          : {
                              background: "transparent",
                              color: "var(--color-text-muted)",
                              border: "1px solid #2a2a2d",
                            }
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <LiveChart
                basePrice={market.price}
                volatility={volatility}
                positive={positive}
              />
            </div>

            {/* Stats grid */}
            <div
              className="rounded-2xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4"
              style={{
                background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                border: `1px solid ${BURNT}1a`,
              }}
            >
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {isBinary ? "Price to Beat" : "24h Öffnung"}
                </p>
                <p
                  className="font-bold tabular-nums text-base"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {market.currency}
                  {market.price.toLocaleString("de-DE", {
                    minimumFractionDigits: market.price < 10 ? 4 : 2,
                    maximumFractionDigits: market.price < 10 ? 4 : 2,
                  })}
                </p>
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  24h Änderung
                </p>
                <p
                  className="font-bold tabular-nums text-base"
                  style={{ color: positive ? "#22c55e" : "#ef4444" }}
                >
                  {positive ? "+" : ""}
                  {market.change24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Max. Hebel
                </p>
                <p
                  className="font-bold tabular-nums text-base"
                  style={{
                    fontFamily: SERIF,
                    fontStyle: "italic",
                    color: BURNT,
                  }}
                >
                  {market.maxLeverage ?? 100}×
                </p>
              </div>
              <div>
                <p
                  className="text-[9px] uppercase tracking-widest mb-1"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Kategorie
                </p>
                <p
                  className="font-semibold text-base"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {categoryLabels[market.category]}
                </p>
              </div>
            </div>

            {/* Market info */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                border: `1px solid ${BURNT}1a`,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest mb-3 font-bold"
                style={{ color: BURNT }}
              >
                Über diesen Markt
              </p>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{
                  fontFamily: SERIF,
                  fontStyle: "italic",
                  fontSize: "1.05rem",
                  color: "var(--color-text-secondary)",
                  fontWeight: 300,
                }}
              >
                &ldquo;{market.description}&rdquo;
              </p>

              <div className="pt-5" style={{ borderTop: `1px solid ${BURNT}18` }}>
                <p
                  className="text-[10px] uppercase tracking-widest mb-2 font-bold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Regeln
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {market.rules}
                </p>
              </div>
            </div>

            {/* Orderbook */}
            <div
              className="rounded-2xl p-6"
              style={{
                background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                border: `1px solid ${BURNT}1a`,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p
                  className="text-[10px] uppercase tracking-widest font-bold"
                  style={{ color: BURNT }}
                >
                  Orderbuch
                </p>
                <div
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
                      style={{ background: "#22c55e", animationDuration: "1.5s" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-1.5 w-1.5"
                      style={{ background: "#22c55e" }}
                    />
                  </span>
                  Live
                </div>
              </div>

              <div className="grid grid-cols-[60px_1fr_80px] gap-2 text-[10px] uppercase tracking-widest mb-2" style={{ color: "var(--color-text-muted)" }}>
                <span>Kurs</span>
                <span>Tiefe</span>
                <span className="text-right">Volumen</span>
              </div>

              <div className="space-y-1">
                {Array.from({ length: 5 }, (_, i) => {
                  const upPct = market.upOdds + (2 - i) * 2;
                  const vol = Math.floor(Math.random() * 5000) + 500;
                  return (
                    <div key={`up-${i}`} className="grid grid-cols-[60px_1fr_80px] gap-2 items-center">
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: "#22c55e" }}>
                        {Math.min(upPct, 99)}¢
                      </span>
                      <div
                        className="h-5 rounded overflow-hidden relative"
                        style={{ background: "#18181b" }}
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${Math.min(vol / 50, 100)}%`,
                            background: "linear-gradient(90deg, rgba(34,197,94,0.18) 0%, rgba(34,197,94,0.04) 100%)",
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-right tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                        €{vol.toLocaleString("de-DE")}
                      </span>
                    </div>
                  );
                })}

                <div className="my-2" style={{ borderTop: `1px solid ${BURNT}22` }} />

                {Array.from({ length: 5 }, (_, i) => {
                  const downPct = market.downOdds + i * 2;
                  const vol = Math.floor(Math.random() * 5000) + 500;
                  return (
                    <div key={`down-${i}`} className="grid grid-cols-[60px_1fr_80px] gap-2 items-center">
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: "#ef4444" }}>
                        {Math.min(downPct, 99)}¢
                      </span>
                      <div
                        className="h-5 rounded overflow-hidden relative"
                        style={{ background: "#18181b" }}
                      >
                        <div
                          className="h-full"
                          style={{
                            width: `${Math.min(vol / 50, 100)}%`,
                            background: "linear-gradient(90deg, rgba(239,68,68,0.18) 0%, rgba(239,68,68,0.04) 100%)",
                          }}
                        />
                      </div>
                      <span className="text-[11px] text-right tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                        €{vol.toLocaleString("de-DE")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────── */}
          <div className="space-y-5">
            <TradingPanel
              upOdds={market.upOdds}
              downOdds={market.downOdds}
              mode={isPerp ? "perp" : "binary"}
              maxLeverage={market.maxLeverage ?? 100}
            />
            <RelatedMarkets markets={related} />

            {/* Inline signup — elevated */}
            <div
              className="rounded-2xl p-6 text-center relative overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(196,98,45,0.10) 0%, rgba(196,98,45,0.03) 100%)",
                border: `1px solid ${BURNT}44`,
              }}
            >
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-3 text-[9px] font-bold uppercase tracking-widest"
                style={{
                  background: `${BURNT}22`,
                  color: BURNT,
                  border: `1px solid ${BURNT}44`,
                }}
              >
                <span
                  className="w-1 h-1 rounded-full"
                  style={{ background: BURNT, animation: "pulse 1.5s infinite" }}
                />
                Nur heute · Bonus
              </div>
              <p
                className="mb-1"
                style={{
                  fontFamily: SERIF,
                  fontSize: "1.5rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--color-text-primary)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.01em",
                }}
              >
                Echte Position eröffnen.
              </p>
              <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
                Account in unter 60 Sekunden · €20–€250 Startbonus
              </p>
              <Link
                href="/registrierung"
                data-event="register_click"
                className="block w-full py-3 text-white text-sm font-bold rounded-xl transition-all"
                style={{
                  background: BURNT,
                  boxShadow: `0 0 0 1px ${BURNT}, 0 4px 16px -4px ${BURNT}88`,
                }}
              >
                Jetzt registrieren →
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
