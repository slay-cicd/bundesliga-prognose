"use client";

import { useState } from "react";
import { markets, type Category } from "@/lib/markets";
import { MarketCard } from "@/components/MarketCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SectionReveal } from "@/components/SectionReveal";
import { LeverageSlider } from "@/components/LeverageSlider";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// Word-gate reveal for hero headline
function WordGate({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="overflow-hidden leading-none">
      <motion.div
        initial={prefersReduced ? false : { y: "105%" }}
        animate={{ y: "0%" }}
        transition={{ ease: EASE_ED, duration: 0.85, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const TRUST_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    label: "EU-reguliert",
    detail: "MiFID II lizenziert",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 2.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
    label: "MiCA-konform",
    detail: "EU Krypto-Rahmen",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    label: "2FA-Pflicht",
    detail: "Maximale Sicherheit",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    label: "Sofort-Auszahlung",
    detail: "Dein Geld, dein Zugriff",
  },
];

export default function Home() {
  const [category, setCategory] = useState<Category | "all">("all");
  const prefersReduced = useReducedMotion();

  const perpMarkets = markets.filter((m) => m.type === "perp");
  const shortMarkets = markets.filter((m) => m.type !== "perp");
  const filteredPerps = category === "all" ? perpMarkets : perpMarkets.filter((m) => m.category === category);
  const filteredShort = category === "all" ? shortMarkets : shortMarkets.filter((m) => m.category === category);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-14 md:pt-32 md:pb-28 overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 60% 0%, rgba(196,98,45,0.07) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="mb-10"
            style={{
              fontFamily: SERIF,
              fontSize: "clamp(64px, 11vw, 144px)",
              letterSpacing: "-0.02em",
              lineHeight: 0.95,
            }}
            aria-label="Perpetual Markets."
          >
            <WordGate delay={0.15}>
              <span className="block font-light text-text-primary">Perpetual</span>
            </WordGate>
            <WordGate delay={0.28}>
              <span className="block font-light italic" style={{ color: BURNT }}>
                Markets.
              </span>
            </WordGate>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.6, delay: 0.48 }}
            className="text-base sm:text-lg text-text-secondary mb-10 max-w-lg leading-relaxed"
          >
            Die neue Form des Derivatehandels — schneller, flexibler, günstiger. Krypto,
            Aktien, Rohstoffe, Forex: alle Märkte, ein Konto, kein Ablaufdatum.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeOut", duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link
              href="/registrierung"
              data-event="register_click"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{ backgroundColor: BURNT }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BURNT)}
            >
              Jetzt registrieren
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

            <div className="flex items-center gap-2 text-text-muted text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
              <span className="text-xs tracking-wide">{markets.length} Märkte live</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* Perpetual Markets (Primary) */}
      <section className="py-12 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-text-muted mb-1.5">
                Perpetual Markets
              </p>
              <h2
                className="text-text-primary leading-tight"
                style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 400 }}
              >
                Kein Ablaufdatum. <span className="italic" style={{ color: BURNT }}>Voller Hebel.</span>
              </h2>
              <p className="text-sm text-text-secondary mt-3 max-w-md leading-relaxed">
                Trade Krypto, Aktien, Rohstoffe und FX mit bis zu 100× Hebel — 24/7, ohne Broker,
                ohne T+2 Settlement.
              </p>
            </div>
            <CategoryTabs selected={category} onChange={setCategory} />
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {filteredPerps.map((market, i) => (
              <MarketCard key={market.id} market={market} index={i} />
            ))}
          </motion.div>

          {filteredPerps.length === 0 && (
            <p className="text-center text-text-muted py-12 text-sm">
              Keine Perpetuals in dieser Kategorie.
            </p>
          )}
        </div>
      </section>

      {/* Short-term Markets (Secondary) */}
      {filteredShort.length > 0 && (
        <section className="py-12 md:py-20 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-widest text-text-muted mb-1.5">
                Kurzzeit-Märkte
              </p>
              <h2
                className="text-text-primary leading-tight"
                style={{ fontFamily: SERIF, fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 400 }}
              >
                Hoch oder Runter. <span className="italic" style={{ color: BURNT }}>In Minuten.</span>
              </h2>
              <p className="text-sm text-text-secondary mt-3 max-w-md leading-relaxed">
                5- bis 60-Minuten-Fenster auf die gleichen Assets. Schneller Einstieg ohne Hebel-Komplexität.
              </p>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
            >
              {filteredShort.map((market, i) => (
                <MarketCard key={market.id} market={market} index={i} />
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── LEVERAGE ─────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-28 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: editorial pull-quote */}
            <SectionReveal>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-text-muted mb-8">
                  Hebel-Trading
                </p>

                {/* Pull quote */}
                <div className="pl-6 mb-10" style={{ borderLeft: `2px solid ${BURNT}` }}>
                  <p
                    className="leading-tight text-text-primary mb-4"
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(26px, 3.5vw, 40px)",
                      fontWeight: 300,
                      fontStyle: "italic",
                    }}
                  >
                    Hebel von 1x bis 100x.
                    <br />
                    <span style={{ color: BURNT }}>Du entscheidest.</span>
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                    Kontrolliere dein Risiko bis auf den Cent. Von konservativ
                    bis aggressiv — alles in deiner Hand.
                  </p>
                </div>

                <ul className="space-y-3">
                  {[
                    "Transparente Gebühren, keine versteckten Kosten",
                    "Automatischer Stop-Loss bei jeder Position",
                    "Echtzeit-Liquidationspreis immer sichtbar",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-secondary">
                      <svg
                        className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={BURNT}
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            {/* Right: interactive slider */}
            <SectionReveal delay={0.18}>
              <LeverageSlider />
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────────────────────── */}
      <section className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-0 py-2">
            {TRUST_ITEMS.map((item, i) => (
              <SectionReveal key={item.label} delay={i * 0.07}>
                <div className="flex items-center gap-3">
                  <div className="text-text-muted flex-shrink-0" style={{ color: BURNT }}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary leading-tight">{item.label}</p>
                    <p className="text-xs text-text-muted">{item.detail}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-14 md:py-32 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal>
            <p
              className="leading-tight text-text-primary mb-10 text-center"
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(32px, 5vw, 58px)",
                fontWeight: 300,
                fontStyle: "italic",
              }}
            >
              Die Märkte warten nicht.
              <br />
              <span style={{ color: BURNT }}>Du auch nicht.</span>
            </p>

            <div className="flex justify-center">
              <Link
                href="/registrierung"
                data-event="register_click"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                style={{ backgroundColor: BURNT }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b0561f")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BURNT)}
              >
                Jetzt registrieren
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>
    </>
  );
}
