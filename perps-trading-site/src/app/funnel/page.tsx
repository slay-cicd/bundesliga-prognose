"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FunnelLeverageDemo } from "@/components/FunnelLeverageDemo";
import { FunnelCountdown } from "@/components/FunnelCountdown";
import { SectionReveal } from "@/components/SectionReveal";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// ─── Inline email form ────────────────────────────────────────────────────────
function EmailCapture({ ctaText = "€20 Bonus sichern" }: { ctaText?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1] as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes("@")) setSubmitted(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!submitted ? (
        <motion.form
          key="form"
          onSubmit={handleSubmit}
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Deine E-Mail-Adresse"
              required
              className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none"
              style={{
                background: "#18181b",
                border: "1px solid #2a2a2d",
                color: "#e5e5e7",
                colorScheme: "dark",
              }}
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap text-white transition-all duration-150"
              style={{ background: BURNT }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
            >
              {ctaText}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md text-center p-6 rounded-2xl"
          style={{
            background: "rgba(196,98,45,0.08)",
            border: "1px solid rgba(196,98,45,0.25)",
          }}
        >
          <svg
            className="w-8 h-8 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke={BURNT}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          <p className="font-bold text-sm mb-1" style={{ color: BURNT }}>
            Du bist dabei.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Wir aktivieren deinen €20 Bonus sobald Early Access startet.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Trade example card ───────────────────────────────────────────────────────
function TradeCard({
  asset,
  dir,
  lev,
  move,
  profit,
  delay = 0,
}: {
  asset: string;
  dir: "LONG" | "SHORT";
  lev: string;
  move: string;
  profit: string;
  delay?: number;
}) {
  const positive = dir === "LONG";
  return (
    <SectionReveal delay={delay}>
      <div className="pl-5 py-5" style={{ borderLeft: `2px solid ${BURNT}` }}>
        <p
          className="text-[10px] uppercase tracking-widest mb-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          {asset} &middot; {dir} &middot; {lev} Hebel
        </p>
        <p
          className="leading-snug"
          style={{
            fontFamily: SERIF,
            fontSize: "1.15rem",
            fontStyle: "italic",
            color: "var(--color-text-secondary)",
          }}
        >
          &ldquo;Position eröffnet bei Marktpreis. Kurs bewegte sich{" "}
          <span style={{ color: positive ? "#22c55e" : "#ef4444" }}>{move}</span> —
          Ergebnis:{" "}
          <span className="font-semibold" style={{ color: "#22c55e" }}>
            {profit} Gewinn.
          </span>
          &rdquo;
        </p>
      </div>
    </SectionReveal>
  );
}

const EXAMPLE_TRADES = [
  { asset: "BTC", dir: "LONG" as const, lev: "10×", move: "+6.2%", profit: "+€124" },
  { asset: "TSLA", dir: "SHORT" as const, lev: "20×", move: "−3.1%", profit: "+€124" },
  { asset: "GOLD", dir: "LONG" as const, lev: "50×", move: "+1.8%", profit: "+€180" },
];

const FEATURES = [
  "24/7 geöffnet — Märkte schlafen nicht",
  "100× Hebel auf Krypto, Aktien, Rohstoffe",
  "Kein Ablaufdatum — halte Positionen so lange du willst",
  "Sofort-Settlement — Gewinn direkt auf deinem Konto",
];

export default function FunnelPage() {
  const prefersReduced = useReducedMotion();

  return (
    <div
      style={{
        fontFamily: "var(--font-inter, system-ui, sans-serif)",
        backgroundColor: "#0a0a0b",
        color: "#e5e5e7",
      }}
    >
      {/* Radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.10) 0%, transparent 55%)",
          zIndex: 0,
        }}
      />

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav className="relative z-10 px-5 sm:px-8 py-5 max-w-5xl mx-auto flex items-center justify-between">
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            fontFamily: SERIF,
            fontSize: "1.5rem",
            fontWeight: 300,
            color: "#e5e5e7",
            letterSpacing: "0.04em",
          }}
        >
          Concorde
        </motion.div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-up animate-pulse" />
          Live Trading
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-6 pb-16 px-5 sm:px-8 max-w-5xl mx-auto overflow-hidden">
        {/* Urgency pill */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE_ED, duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-8"
          style={{
            background: "rgba(196,98,45,0.12)",
            border: `1px solid ${BURNT}55`,
            color: BURNT,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: BURNT, animation: "pulse 1.5s infinite" }}
          />
          Nur heute: €20 Startguthaben
        </motion.div>

        {/* Massive headline */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(80px, 16vw, 180px)",
            lineHeight: 0.9,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            marginBottom: "2rem",
          }}
          aria-label="Dein Einstieg. Heute."
        >
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.15 }}
            >
              <span className="block text-text-primary">Dein</span>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.28 }}
            >
              <span className="block italic" style={{ color: BURNT }}>
                Einstieg.
              </span>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.38 }}
            >
              <span
                className="block font-light text-text-primary"
                style={{ fontSize: "0.52em" }}
              >
                Heute.
              </span>
            </motion.div>
          </div>
        </h1>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.6, delay: 0.55 }}
          className="text-base sm:text-lg mb-8 max-w-lg leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Perpetual Contracts auf Bitcoin, Gold, Aktien &amp; mehr — mit bis zu 100×
          Hebel. Kein Ablaufdatum. €20 Bonus für alle Early-Access-Mitglieder.
        </motion.p>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5, delay: 0.65 }}
        >
          <EmailCapture />
          <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
            Keine Kreditkarte · Keine Mindesteinlage · EU-reguliert (MiFID II)
          </p>
        </motion.div>
      </section>

      {/* ── COUNTDOWN / SPOTS ──────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-8 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <FunnelCountdown theme="dark" />
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "rgba(196,98,45,0.10)",
              border: `1px solid ${BURNT}33`,
              color: BURNT,
            }}
          >
            2.847 Trader auf der Warteliste
          </div>
        </div>
      </section>

      {/* ── LEVERAGE DEMO ──────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-14">
              <p
                className="text-[11px] uppercase tracking-widest mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                Interaktive Demo
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(40px, 7vw, 80px)",
                  fontWeight: 300,
                  lineHeight: 0.92,
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="block text-text-primary">Was macht</span>
                <span className="block italic" style={{ color: BURNT }}>
                  dein Geld?
                </span>
              </h2>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <FunnelLeverageDemo />
          </SectionReveal>
        </div>
      </section>

      {/* ── BEISPIEL TRADES ────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              className="text-[11px] uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Beispiel-Trades
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(36px, 5.5vw, 60px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 0.95,
                marginBottom: "3rem",
              }}
            >
              <span className="text-text-primary">Echte</span>{" "}
              <span className="italic" style={{ color: BURNT }}>
                Ergebnisse.
              </span>
            </h2>
          </SectionReveal>

          <div className="space-y-6">
            {EXAMPLE_TRADES.map((t, i) => (
              <TradeCard key={t.asset} {...t} delay={i * 0.1} />
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <p
              className="text-xs mt-8 leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              * Beispielhafte Darstellung. Vergangene Ergebnisse sind keine Garantie
              für zukünftige Gewinne. Alle Trades sind mit Verlustrisiko verbunden.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              className="text-[11px] uppercase tracking-widest mb-10"
              style={{ color: "var(--color-text-muted)" }}
            >
              Warum Concorde
            </p>
          </SectionReveal>
          <div className="space-y-0">
            {FEATURES.map((f, i) => (
              <SectionReveal key={f} delay={i * 0.07}>
                <div className="flex items-start gap-6 py-5 border-b border-border last:border-b-0">
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: "2rem",
                      fontWeight: 300,
                      color: BURNT,
                      opacity: 0.45,
                      lineHeight: 1,
                      minWidth: "2.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-secondary)", paddingTop: "0.15rem" }}
                  >
                    {f}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF NUMBERS ───────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-16 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-6 py-2">
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(48px, 8vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: BURNT,
                  }}
                >
                  2.847
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Trader auf der Warteliste
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(48px, 8vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--color-text-primary)",
                  }}
                >
                  €20
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Startguthaben
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(48px, 8vw, 80px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--color-text-primary)",
                  }}
                >
                  100×
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Max. Hebel
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-24 md:py-32 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-10"
              style={{
                background: "rgba(196,98,45,0.12)",
                border: `1px solid ${BURNT}44`,
                color: BURNT,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: BURNT }}
              />
              Nur heute: €20 Bonus
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 7vw, 80px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                marginBottom: "2.5rem",
              }}
            >
              Die Märkte warten nicht.
              <br />
              <span style={{ color: BURNT }}>Du auch nicht.</span>
            </p>
            <div className="flex justify-center">
              <EmailCapture ctaText="Jetzt €20 Bonus sichern" />
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
              Keine Kreditkarte &middot; Keine Mindesteinlage &middot; EU-reguliert (MiFID II)
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── RISK DISCLAIMER ────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-10 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-text-secondary)" }}>Risikohinweis:</strong>{" "}
            Perpetual Contracts und Hebel-Produkte sind hochkomplexe Finanzinstrumente mit
            erheblichem Verlustrisiko. Der Handel mit Hebel kann zu Verlusten führen, die
            Ihren gesamten eingesetzten Betrag übersteigen. Diese Produkte sind nicht für
            alle Anleger geeignet. Bitte lesen Sie unsere Risikohinweise sorgfältig.
            Concorde ist reguliert gemäß MiFID II. Kapital ist in segregierten Konten
            gehalten.
          </p>
        </div>
      </section>
    </div>
  );
}
