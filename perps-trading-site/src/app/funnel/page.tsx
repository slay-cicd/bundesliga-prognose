"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FunnelLeverageDemo } from "@/components/FunnelLeverageDemo";
import { FunnelCountdown } from "@/components/FunnelCountdown";
import { FunnelLivePayouts } from "@/components/FunnelLivePayouts";
import { FunnelBonusWheel } from "@/components/FunnelBonusWheel";
import { SectionReveal } from "@/components/SectionReveal";
import { mpTrack, mpSetFunnelVariant } from "@/lib/mixpanel";
import { Events } from "@/components/MetaPixel";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

// ─── Inline email form ────────────────────────────────────────────────────────
function EmailCapture({ ctaText = "Bonus sichern" }: { ctaText?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const prefersReduced = useReducedMotion();
  const EASE = [0.22, 1, 0.36, 1] as const;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || loading) return;
    setLoading(true);
    // Mixpanel: fire Lead event with variant tag + set identity early
    mpTrack("Lead", {
      funnel_variant: "funnel",
      content_name: "funnel_aggressive",
      content_category: "email_capture",
      email,
    });
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, market: "funnel" }),
      });
      // Fire Meta Pixel Lead event (standard event for ad optimisation).
      // Uses the queued helper — even if fbq loaded late, event is buffered.
      Events.lead({
        content_name: "funnel_aggressive",
        content_category: "email_capture",
      });
    } catch (err) {
      console.error("subscribe failed", err);
    }
    setSubmitted(true);
    // Redirect to questionnaire with email prefilled so user can claim faster bonus
    setTimeout(() => {
      window.location.href = `/questionnaire?email=${encodeURIComponent(email)}&source=funnel`;
    }, 900);
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
              className="flex-1 px-4 py-3.5 rounded-xl text-base outline-none transition-colors"
              style={{
                background: "#141416",
                border: "1px solid #28282b",
                color: "#e5e5e7",
                colorScheme: "dark",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#28282b")}
            />
            <motion.button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-semibold text-sm whitespace-nowrap text-white transition-all duration-150"
              style={{
                background: BURNT,
                boxShadow: `0 0 0 1px ${BURNT}, 0 8px 24px -6px ${BURNT}99`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
            >
              {loading ? "Wird gesendet…" : `${ctaText} →`}
            </motion.button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md p-6 rounded-2xl"
          style={{
            background: "rgba(34,197,94,0.06)",
            border: "1px solid rgba(34,197,94,0.25)",
          }}
        >
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 flex-shrink-0 mt-0.5"
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
            <div>
              <p
                className="mb-0.5 leading-tight"
                style={{
                  fontFamily: SERIF,
                  fontSize: "1.25rem",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#22c55e",
                }}
              >
                Dein Platz ist reserviert.
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                Check deinen Posteingang für den Aktivierungslink und deinen Bonus.
              </p>
            </div>
          </div>
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
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <p
            className="text-[10px] uppercase tracking-widest"
            style={{ color: "var(--color-text-muted)" }}
          >
            {name} &middot; {asset} &middot; {lev}
          </p>
          <span className="text-[10px] font-semibold tabular-nums" style={{ color: "#22c55e" }}>
            {time}
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
          &ldquo;{stake} rein, Kurs{" "}
          <span style={{ color: "#22c55e" }}>{move}</span>, {profit} raus.&rdquo;
        </p>
      </div>
    </SectionReveal>
  );
}

const WINNERS = [
  { name: "Marco K., Berlin",   asset: "BTC",  stake: "€100", lev: "25×",  move: "+4,2%",  profit: "+€105", time: "vor 3 Min"  },
  { name: "Jana R., Köln",      asset: "TSLA", stake: "€250", lev: "50×",  move: "+3,1%",  profit: "+€387", time: "vor 7 Min"  },
  { name: "Paul W., Frankfurt", asset: "GOLD", stake: "€500", lev: "20×",  move: "+1,8%",  profit: "+€180", time: "vor 12 Min" },
  { name: "Lena S., München",   asset: "ETH",  stake: "€100", lev: "75×",  move: "+6,4%",  profit: "+€480", time: "vor 18 Min" },
  { name: "Tim H., Hamburg",    asset: "NVDA", stake: "€250", lev: "100×", move: "+2,9%",  profit: "+€725", time: "vor 24 Min" },
];

const FEATURES = [
  { title: "Bis zu 100× Hebel", body: "Kleine Kursmoves, große Positionen. Verwandle +2,5 % in +250 %." },
  { title: "24 / 7 geöffnet",    body: "Bitcoin, Gold, Tesla, DAX. Keine Pausen, keine Feiertage." },
  { title: "€20 – €250 Startbonus", body: "Jede Registrierung gewinnt beim Mystery-Wheel. Direkt tradebar." },
  { title: "Sofort-Auszahlung",   body: "Gewinne in Sekunden zurück auf dein Konto. Keine versteckten Gebühren." },
  { title: "Kein Ablaufdatum",    body: "Perpetual Contracts — halte Positionen bis der Move kommt." },
];

export default function FunnelPage() {
  const prefersReduced = useReducedMotion();

  // Meta Pixel: fire ViewContent with variant tag on mount so we can compare
  // /funnel (aggressive) vs /funnel1 (professional) performance in Ads Manager.
  // Uses the queued helper — fbq might load after this effect fires.
  useEffect(() => {
    mpSetFunnelVariant("funnel");
    mpTrack("Funnel Viewed", {
      funnel_variant: "funnel",
      content_name: "funnel_aggressive",
    });
    Events.viewContent({
      content_name: "funnel_aggressive",
      content_category: "landing_page",
      content_ids: ["funnel"],
    });
  }, []);

  // Animated "live profit" ticker — now more specific and believable
  const [heroProfit, setHeroProfit] = useState(847290);
  const [lastPayout, setLastPayout] = useState(182);
  useEffect(() => {
    if (prefersReduced) return;
    const interval = setInterval(() => {
      const tick = Math.floor(Math.random() * 420 + 80);
      setHeroProfit((p) => p + tick);
      setLastPayout(tick);
    }, 2400);
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
        aria-hidden="true"
      />

      {/* ── THIN TOP RIBBON ────────────────────────────────────────────────── */}
      <div
        className="relative z-20 text-center py-1.5 px-4 text-[10px] font-semibold uppercase tracking-widest overflow-x-hidden"
        style={{
          background: "#0d0d0f",
          borderBottom: `1px solid ${BURNT}33`,
          color: "var(--color-text-secondary)",
        }}
      >
        <span className="inline-flex items-center gap-2 flex-wrap justify-center">
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
          <span style={{ color: "#22c55e" }}>Live</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Letzter Payout gerade:</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={lastPayout}
              initial={prefersReduced ? false : { y: -4, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 4, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="tabular-nums font-bold"
              style={{ color: BURNT }}
            >
              +€{lastPayout}
            </motion.span>
          </AnimatePresence>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>
            Heute ausgezahlt:{" "}
            <span className="tabular-nums font-bold" style={{ color: "#e5e5e7" }}>
              €{heroProfit.toLocaleString("de-DE")}
            </span>
          </span>
        </span>
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
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#22c55e" }} />
          Live Trading
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 pt-4 pb-12 px-5 sm:px-8 max-w-5xl mx-auto overflow-hidden">
        {/* Quiet eyebrow instead of loud pill */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: EASE_ED, duration: 0.6, delay: 0.1 }}
          className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-8 flex items-center gap-2.5"
          style={{ color: BURNT }}
        >
          <span
            className="inline-block w-6 h-px"
            style={{ background: BURNT, opacity: 0.6 }}
          />
          Für alle, die es ernst meinen
        </motion.p>

        {/* Headline — editorial, emotional, cleaner */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(52px, 13vw, 156px)",
            lineHeight: 0.92,
            letterSpacing: "-0.03em",
            fontWeight: 300,
            marginBottom: "2rem",
          }}
          aria-label="Der Trade, der alles ändert."
        >
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.15 }}
            >
              <span className="block text-text-primary">Der Trade,</span>
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div
              initial={prefersReduced ? false : { y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ ease: EASE_ED, duration: 0.9, delay: 0.28 }}
            >
              <span className="block italic" style={{ color: BURNT }}>
                der alles ändert.
              </span>
            </motion.div>
          </div>
        </h1>

        {/* Lead copy — editorial, confident */}
        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.6, delay: 0.55 }}
          className="text-lg sm:text-xl mb-3 max-w-xl leading-relaxed"
          style={{
            color: "var(--color-text-secondary)",
            fontWeight: 300,
          }}
        >
          €100 Einsatz.{" "}
          <span style={{ color: BURNT, fontWeight: 600 }}>100× Hebel</span>. Ein 2,5% Move
          auf Bitcoin — dein Konto zeigt{" "}
          <span style={{ color: "#22c55e", fontWeight: 600 }}>€2.500</span>.
        </motion.p>

        <motion.p
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.6, delay: 0.62 }}
          className="text-sm sm:text-base mb-10 max-w-xl leading-relaxed"
          style={{ color: "var(--color-text-muted)" }}
        >
          Perpetual Contracts auf Krypto, Gold und US-Aktien. Keine Ablaufdaten, keine Broker-Gebühren, 24/7.
        </motion.p>

        {/* Thin trust line — no colored badges */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ease: "easeOut", duration: 0.6, delay: 0.68 }}
          className="flex items-center gap-x-5 gap-y-2 mb-7 flex-wrap text-[10px] uppercase tracking-widest font-semibold"
          style={{ color: "var(--color-text-muted)" }}
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: BURNT }} />
            EU-reguliert · MiFID II
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: BURNT }} />
            Segregiertes Kapital
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full" style={{ background: BURNT }} />
            Sofort-Auszahlung
          </span>
        </motion.div>

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "easeOut", duration: 0.5, delay: 0.72 }}
        >
          <EmailCapture ctaText="Bonus sichern" />
          <p className="text-[11px] mt-3 italic" style={{ color: "var(--color-text-muted)", fontFamily: SERIF }}>
            Mit deinem €20 – €250 Startbonus. Keine Kreditkarte nötig.
          </p>
        </motion.div>
      </section>

      {/* ── COUNTDOWN / SPOTS ──────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-6 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <FunnelCountdown theme="dark" />
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--color-text-muted)" }}>
            <span className="tabular-nums font-bold" style={{ color: BURNT }}>2.847</span> Trader auf der Warteliste
          </p>
        </div>
      </section>

      {/* ── BONUS WHEEL ────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-5 font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
                Dein Startkapital
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(44px, 7.5vw, 88px)",
                  fontWeight: 300,
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                }}
              >
                <span className="text-text-primary">Zwanzig. Oder </span>
                <span className="italic" style={{ color: BURNT }}>
                  zweihundertfünfzig.
                </span>
              </h2>
              <p
                className="mt-6 max-w-lg mx-auto leading-relaxed"
                style={{
                  fontFamily: SERIF,
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--color-text-secondary)",
                }}
              >
                Jede Registrierung bekommt Startkapital. Wie viel — entscheidet das Rad.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <FunnelBonusWheel />
          </SectionReveal>
        </div>
      </section>

      {/* ── LEVERAGE DEMO ──────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-10 md:mb-14 max-w-2xl mx-auto">
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-5 font-semibold"
                style={{ color: "var(--color-text-muted)" }}
              >
                Rechne selbst
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(44px, 7.5vw, 88px)",
                  fontWeight: 300,
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                }}
              >
                <span className="text-text-primary">Bei 100× wird aus €100</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  sehr viel mehr.
                </span>
              </h2>
              <p
                className="mt-6 max-w-lg mx-auto leading-relaxed"
                style={{
                  fontFamily: SERIF,
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  color: "var(--color-text-secondary)",
                }}
              >
                Zieh den Hebel hoch. Sieh was passiert.
              </p>
            </div>
          </SectionReveal>
          <SectionReveal delay={0.15}>
            <FunnelLeverageDemo />
          </SectionReveal>
        </div>
      </section>

      {/* ── LIVE PAYOUTS ───────────────────────────────────────────────────── */}
      <section
        className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(196,98,45,0.04) 100%)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-10 md:mb-14">
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-5 font-semibold inline-flex items-center gap-2"
                style={{ color: "#22c55e" }}
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
                Live · letzte Minuten
              </p>
              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(40px, 7vw, 80px)",
                  fontWeight: 300,
                  lineHeight: 0.92,
                  letterSpacing: "-0.025em",
                }}
              >
                <span className="text-text-primary">Während du liest,</span>{" "}
                <span className="italic" style={{ color: BURNT }}>
                  gewinnen andere.
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
      <section className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-5 font-semibold"
              style={{ color: "var(--color-text-muted)" }}
            >
              Ausgewählte Trades · heute
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 6.5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                marginBottom: "3.5rem",
              }}
            >
              <span className="text-text-primary">Kleine Einsätze.</span>{" "}
              <span className="italic" style={{ color: BURNT }}>
                Große Zahlen.
              </span>
            </h2>
          </SectionReveal>

          <div className="space-y-1">
            {WINNERS.map((t, i) => (
              <WinnerCard key={t.name} {...t} delay={i * 0.08} />
            ))}
          </div>

          <SectionReveal delay={0.3}>
            <p
              className="text-[11px] mt-10 leading-relaxed italic"
              style={{ color: "var(--color-text-muted)", fontFamily: SERIF }}
            >
              Anonymisierte echte Trades. Vergangene Ergebnisse sind keine Garantie für zukünftige Gewinne.
              Hebel-Trading birgt Totalverlustrisiko.
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-5 font-semibold"
              style={{ color: "var(--color-text-muted)" }}
            >
              Warum Concorde
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 6.5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.025em",
                lineHeight: 0.92,
                marginBottom: "3rem",
              }}
            >
              <span className="text-text-primary">Gebaut für</span>{" "}
              <span className="italic" style={{ color: BURNT }}>
                scharfe Trader.
              </span>
            </h2>
          </SectionReveal>
          <div className="space-y-0">
            {FEATURES.map((f, i) => (
              <SectionReveal key={f.title} delay={i * 0.06}>
                <div
                  className="flex items-start gap-6 py-6"
                  style={{
                    borderBottom: i < FEATURES.length - 1 ? `1px solid rgba(196,98,45,0.14)` : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: SERIF,
                      fontSize: "1.5rem",
                      fontWeight: 300,
                      color: BURNT,
                      opacity: 0.55,
                      lineHeight: 1,
                      minWidth: "2rem",
                      flexShrink: 0,
                      paddingTop: "0.2rem",
                      fontStyle: "italic",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="text-base font-semibold mb-1"
                      style={{ color: "var(--color-text-primary)" }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {f.body}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE / EDITORIAL ─────────────────────────────────────────── */}
      <section
        className="relative z-10 border-t border-border py-14 md:py-28 px-5 sm:px-8"
        style={{ background: "rgba(196,98,45,0.025)" }}
      >
        <div className="max-w-3xl mx-auto">
          <SectionReveal>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(32px, 5vw, 56px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.15,
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
              }}
            >
              &ldquo;Die alten Broker wollen, dass du <span style={{ color: BURNT }}>100€ pro Monat</span> sparst.
              Wir zeigen dir, wie du <span style={{ color: BURNT }}>100€ in einem Nachmittag</span> verdoppelst.&rdquo;
            </p>
            <p
              className="mt-8 text-[10px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: "var(--color-text-muted)" }}
            >
              — Concorde · 2026
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── SOCIAL PROOF NUMBERS ───────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-12 md:py-20 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <SectionReveal>
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-12 font-semibold text-center"
              style={{ color: "var(--color-text-muted)" }}
            >
              Heute auf Concorde
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-10 sm:gap-6 text-center sm:text-left">
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--color-text-primary)",
                    fontStyle: "italic",
                  }}
                  className="tabular-nums"
                >
                  2.847
                </p>
                <p
                  className="text-[10px] mt-2 uppercase tracking-widest font-semibold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Aktive Trader
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
                    fontStyle: "italic",
                  }}
                  className="tabular-nums"
                >
                  €{(heroProfit / 1000).toFixed(0)}k
                </p>
                <p
                  className="text-[10px] mt-2 uppercase tracking-widest font-semibold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Ausgezahlt
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: SERIF,
                    fontSize: "clamp(44px, 7vw, 72px)",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: BURNT,
                    fontStyle: "italic",
                  }}
                >
                  100×
                </p>
                <p
                  className="text-[10px] mt-2 uppercase tracking-widest font-semibold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Maximal-Hebel
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
                    fontStyle: "italic",
                  }}
                >
                  ∞
                </p>
                <p
                  className="text-[10px] mt-2 uppercase tracking-widest font-semibold"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Laufzeit · Perpetual
                </p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────── */}
      <section
        className="relative z-10 border-t border-border py-16 md:py-36 px-5 sm:px-8"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(196,98,45,0.10) 0%, transparent 60%)",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <SectionReveal>
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-10"
              style={{ color: BURNT }}
            >
              <span
                className="inline-block w-6 h-px align-middle mr-2.5"
                style={{ background: BURNT, opacity: 0.6 }}
              />
              Bonus läuft heute aus
            </p>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(48px, 8vw, 104px)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 0.9,
                letterSpacing: "-0.03em",
                marginBottom: "1rem",
              }}
            >
              Der Markt wartet{" "}
              <span style={{ color: BURNT }}>
                nicht.
              </span>
            </h2>
            <p
              className="mb-10 max-w-md mx-auto"
              style={{
                fontFamily: SERIF,
                fontSize: "1.25rem",
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--color-text-muted)",
              }}
            >
              Du auch nicht.
            </p>
            <div className="flex justify-center">
              <EmailCapture ctaText="Bonus sichern" />
            </div>
            <p className="text-xs mt-4" style={{ color: "var(--color-text-muted)" }}>
              Mit deinem €20 – €250 Startbonus · Keine Kreditkarte · MiFID II
            </p>
          </SectionReveal>
        </div>
      </section>

      {/* ── RISK DISCLAIMER ────────────────────────────────────────────────── */}
      <section className="relative z-10 border-t border-border py-10 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            <strong style={{ color: "var(--color-text-secondary)" }}>Risikohinweis:</strong>{" "}
            Perpetual Contracts und Hebel-Produkte sind hochkomplexe Finanzinstrumente mit
            erheblichem Verlustrisiko. Der Handel mit Hebel kann zu Verlusten führen, die
            deinen gesamten eingesetzten Betrag übersteigen. Diese Produkte sind nicht für
            alle Anleger geeignet. Bitte lies unsere Risikohinweise sorgfältig.
            Concorde ist reguliert gemäß MiFID II. Kapital ist in segregierten Konten
            gehalten.
          </p>
        </div>
      </section>
    </div>
  );
}
