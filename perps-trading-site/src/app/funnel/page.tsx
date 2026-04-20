"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FunnelLeverageDemo } from "@/components/FunnelLeverageDemo";
import { FunnelCountdown } from "@/components/FunnelCountdown";
import { FunnelLivePayouts } from "@/components/FunnelLivePayouts";
import { FunnelBonusWheel } from "@/components/FunnelBonusWheel";
import { SectionReveal } from "@/components/SectionReveal";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// ─── Inline email form ────────────────────────────────────────────────────────
function EmailCapture({ ctaText = "Bonus jetzt sichern" }: { ctaText?: string }) {
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
            <motion.button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap text-white transition-all duration-150"
              style={{
                background: BURNT,
                boxShadow: `0 0 0 1px ${BURNT}, 0 8px 24px -6px ${BURNT}88`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
            >
              {ctaText} →
            </motion.button>
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
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.30)",
          }}
        >
          <svg
            className="w-8 h-8 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          <p className="font-bold text-sm mb-1" style={{ color: "#22c55e" }}>
            🎉 Du bist drin. Bonus reserviert.
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Dein Startguthaben wird bei Launch aktiviert.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Winner card ──────────────────────────────────────────────────────────────
function WinnerCard({
  name,
  asset,
  stake,
  lev,
  move,
  profit,
  time,
  delay = 0,
}: {
  name: string;
  asset: string;
  stake: string;
  lev: string;
  move: string;
  profit: string;
  time: string;
  delay?: number;
}) {
  return (
    <SectionReveal delay={delay}>
      <div
        className="pl-5 py-5 relative"
        style={{ borderLeft: `2px solid ${BURNT}` }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            {name} &middot; {asset} &middot; {lev} Hebel
          </p>
          <span className="text-[10px] font-semibold" style={{ color: "#22c55e" }}>
            ● {time}
          </span>
        </div>
        <p
          className="leading-snug"
          style={{
            fontFamily: SERIF,
            fontSize: "1.2rem",
            fontStyle: "italic",
            color: "var(--color-text-secondary)",
          }}
        >
          &ldquo;{stake} rein. Kurs{" "}
          <span style={{ color: "#22c55e" }}>{move}</span> — {profit} raus.&rdquo;
        </p>
      </div>
    </SectionReveal>
  );
}

const WINNERS = [
  { name: "Marco K., Berlin",   asset: "BTC",  stake: "€100", lev: "25×",  move: "+4.2%",  profit: "+€105", time: "vor 3 Min"  },
  { name: "Jana R., Köln",      asset: "TSLA", stake: "€250", lev: "50×",  move: "+3.1%",  profit: "+€387", time: "vor 7 Min"  },
  { name: "Paul W., Frankfurt", asset: "GOLD", stake: "€500", lev: "20×",  move: "+1.8%",  profit: "+€180", time: "vor 12 Min" },
  { name: "Lena S., München",   asset: "ETH",  stake: "€100", lev: "75×",  move: "+6.4%",  profit: "+€480", time: "vor 18 Min" },
  { name: "Tim H., Hamburg",    asset: "NVDA", stake: "€250", lev: "100×", move: "+2.9%",  profit: "+€725", time: "vor 24 Min" },
];

const FEATURES = [
  "Bis zu 100× Hebel — kleine Moves, große Gewinne",
  "24/7 offen — trade wenn du willst, auch Sonntag 3 Uhr",
  "€20–€250 Startbonus — jeder gewinnt beim Bonus-Wheel",
  "Sofort-Auszahlung — Gewinne in Sekunden auf dem Konto",
  "Kein Ablaufdatum — halte Positionen bis der Move kommt",
];

export default function FunnelPage() {
  const prefersReduced = useReducedMotion();

  // Animated "live profit" ticker in hero
  const [heroProfit, setHeroProfit] = useState(847290);
  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      setHeroProfit((p) => p + Math.floor(Math.random() * 520 + 80));
    }, 1900);
    return () => clearInterval(interval);
  }, [prefersReduced]);

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
            "radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.14) 0%, transparent 55%)",
          zIndex: 0,
        }}
      />

      {/* ── TOP BANNER ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-20 text-center py-2 px-4 text-[11px] font-bold"
        style={{
          background: `linear-gradient(90deg, ${BURNT} 0%, #e0822f 50%, ${BURNT} 100%)`,
          color: "#fff",
          letterSpacing: "0.05em",
        }}
      >
        🎰 LIVE: 2.847 Trader haben heute <span className="tabular-nums">€{heroProfit.toLocaleString("de-DE")}</span> verdient &middot; Du bist als Nächster dran
      </div>

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
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
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
          €20 – €250 Startbonus · Heute nur
        </motion.div>

        {/* Massive headline */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(76px, 15vw, 172px)",
            lineHeight: 0.88,
            letterSpacing: "-0.035em",
            fontWeight: 300,
            marginBottom: "2rem",
          }}
          aria-label="€100 werden €2.500. Heute."
        >
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.15 }}
            >
              <span className="block text-text-primary">€100</span>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.28 }}
            >
              <span className="block italic" style={{ color: BURNT }}>
                werden €2.500.
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
          className="text-base sm:text-lg mb-4 max-w-xl leading-relaxed"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Bei <span style={{ color: BURNT, fontWeight: 700 }}>100× Hebel</span> reichen
          +2,5% Kursbewegung um dein Geld zu vervielfachen.
          Bitcoin, Gold, Tesla — du entscheidest.
        </motion.p>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5, delay: 0.62 }}
          className="flex items-center gap-3 mb-7 flex-wrap"
        >
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
            style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44" }}>
            ✓ EU-reguliert
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
            style={{ background: `${BURNT}22`, color: BURNT, border: `1px solid ${BURNT}44` }}>
            ✓ Mystery Bonus
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest"
            style={{ background: "#eab30822", color: "#eab308", border: "1px solid #eab30844" }}>
            ✓ Sofort-Auszahlung
          </span>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5, delay: 0.7 }}
        >
          <EmailCapture ctaText="Bonus spinnen" />
          <p className="text-xs mt-3" style={{ color: "var(--color-text-muted)" }}>
            Keine Kreditkarte · Keine Mindesteinlage · MiFID II
          </p>
        </motion.div>
      </section>

      {/* ── COUNTDOWN / SPOTS ──────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-7 px-5 sm:px-8" style={{ background: "rgba(196,98,45,0.03)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <FunnelCountdown theme="dark" />
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold"
            style={{
              background: "rgba(196,98,45,0.10)",
              border: `1px solid ${BURNT}33`,
              color: BURNT,
            }}
          >
            🔥 2.847 Trader auf der Warteliste
          </div>
        </div>
      </section>

      {/* ── BONUS WHEEL ────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <p
                className="text-[11px] uppercase tracking-widest mb-4 font-bold"
                style={{ color: BURNT }}
              >
                Schritt 1 von 2
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
                <span className="block text-text-primary">Dreh das Rad.</span>
                <span className="block italic" style={{ color: BURNT }}>
                  Sichere dein Startkapital.
                </span>
              </h2>
              <p className="text-sm mt-5 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                Jeder gewinnt. Die Frage ist nur: €20, €50, €100 oder €250?
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <FunnelBonusWheel />
          </SectionReveal>
        </div>
      </section>

      {/* ── LEVERAGE DEMO ──────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-14">
              <p
                className="text-[11px] uppercase tracking-widest mb-4 font-bold"
                style={{ color: BURNT }}
              >
                Schritt 2 von 2 · Der Rechner
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
              <p className="text-sm mt-5 max-w-md mx-auto" style={{ color: "var(--color-text-muted)" }}>
                Schieb den Hebel. Siehe, wie schnell sich kleine Einsätze multiplizieren.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <FunnelLeverageDemo />
          </SectionReveal>
        </div>
      </section>

      {/* ── LIVE PAYOUTS ───────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-28 px-5 sm:px-8"
        style={{ background: "linear-gradient(180deg, transparent 0%, rgba(196,98,45,0.04) 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-widest mb-4" style={{ color: "var(--color-text-muted)" }}>
                Live · Auszahlungen der letzten Minuten
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(36px, 6vw, 68px)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                <span className="text-text-primary">Andere gewinnen</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  gerade.
                </span>
              </h2>
            </div>
          </SectionReveal>
          <div className="max-w-xl mx-auto">
            <SectionReveal delay={0.15}>
              <FunnelLivePayouts />
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* ── GEWINNER HEUTE ─────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              className="text-[11px] uppercase tracking-widest mb-4"
              style={{ color: "var(--color-text-muted)" }}
            >
              Gewinner heute
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
              <span className="text-text-primary">Was andere heute</span>{" "}
              <span className="italic" style={{ color: BURNT }}>
                rausgezogen haben.
              </span>
            </h2>
          </SectionReveal>

          <div className="space-y-2">
            {WINNERS.map((t, i) => (
              <WinnerCard key={t.name} {...t} delay={i * 0.08} />
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <p
              className="text-xs mt-8 leading-relaxed"
              style={{ color: "var(--color-text-muted)" }}
            >
              * Anonymisierte Darstellung. Vergangene Ergebnisse sind keine Garantie
              für zukünftige Gewinne. Hebel-Trading ist mit Verlustrisiko verbunden.
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
                      opacity: 0.55,
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-6 py-2">
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: BURNT,
                  }}
                  className="tabular-nums"
                >
                  2.847
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Trader heute
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "#22c55e",
                  }}
                  className="tabular-nums"
                >
                  €{(heroProfit / 1000).toFixed(0)}k
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Ausgezahlt heute
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--color-text-primary)",
                  }}
                >
                  €250
                </p>
                <p className="text-xs mt-1.5 uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  Max. Bonus
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
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
      <section className="relative z-10 border-t border-border py-24 md:py-32 px-5 sm:px-8"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(196,98,45,0.10) 0%, transparent 60%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold mb-10"
              style={{
                background: "rgba(196,98,45,0.14)",
                border: `1px solid ${BURNT}66`,
                color: BURNT,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: BURNT }}
              />
              Heute noch spielen · Bonus bis €250
            </div>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 7vw, 84px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                marginBottom: "2.5rem",
              }}
            >
              Der nächste Move passiert.
              <br />
              <span style={{ color: BURNT }}>Bist du drin?</span>
            </p>
            <div className="flex justify-center">
              <EmailCapture ctaText="Bonus jetzt spinnen" />
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
              Keine Kreditkarte · Keine Mindesteinlage · MiFID II
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
