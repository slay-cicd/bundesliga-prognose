"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";
const EASE_ED = [0.16, 1, 0.3, 1] as const;

export default function Registrierung() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) setStep(2);
    else setSubmitted(true);
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Radial glow background */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(196,98,45,0.10) 0%, transparent 55%)",
        }}
      />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE_ED }}
        className="relative w-full max-w-md"
      >
        {!submitted && (
          <div className="text-center mb-8">
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-5"
              style={{
                background: "rgba(196,98,45,0.12)",
                border: `1px solid ${BURNT}44`,
                color: BURNT,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: BURNT, animation: "pulse 1.5s infinite" }}
              />
              Dein Startbonus wartet
            </motion.div>
            <h1
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(40px, 7vw, 56px)",
                fontWeight: 300,
                lineHeight: 0.92,
                letterSpacing: "-0.025em",
                color: "var(--color-text-primary)",
              }}
            >
              Account{" "}
              <span className="italic" style={{ color: BURNT }}>
                erstellen.
              </span>
            </h1>
            <p className="text-sm mt-3" style={{ color: "var(--color-text-muted)" }}>
              Unter 60 Sekunden · Keine Kreditkarte
            </p>
          </div>
        )}

        {/* Progress dots */}
        {!submitted && (
          <div className="flex items-center gap-2 mb-8 justify-center">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: s === step ? 1.08 : 1,
                    opacity: s <= step ? 1 : 0.35,
                  }}
                  className="flex items-center justify-center rounded-full text-[10px] font-bold"
                  style={{
                    width: 24,
                    height: 24,
                    background: s <= step ? BURNT : "transparent",
                    border: `1px solid ${s <= step ? BURNT : "#2a2a2d"}`,
                    color: s <= step ? "#fff" : "var(--color-text-muted)",
                  }}
                >
                  {s < step ? "✓" : s}
                </motion.div>
                {s === 1 && (
                  <div
                    className="h-px w-10"
                    style={{
                      background: step > 1 ? BURNT : "#2a2a2d",
                      transition: "background 0.3s",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={prefersReduced ? false : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE_ED }}
              className="text-center"
            >
              {/* Checkmark circle */}
              <motion.div
                initial={prefersReduced ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                className="mx-auto mb-6 flex items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.35)",
                  boxShadow: "0 0 40px rgba(34,197,94,0.2)",
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>

              <h2
                style={{
                  fontFamily: SERIF,
                  fontSize: "clamp(36px, 6vw, 52px)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                  marginBottom: "0.75rem",
                }}
              >
                Du bist{" "}
                <span className="italic" style={{ color: "#22c55e" }}>
                  drin.
                </span>
              </h2>

              <p
                className="text-sm mb-6 max-w-xs mx-auto leading-relaxed"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Wir aktivieren deinen Account und Bonus, sobald dein Platz bereit ist.
                Check deinen Posteingang.
              </p>

              {/* Bonus preview card */}
              <div
                className="rounded-2xl p-5 mb-7 text-left"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(196,98,45,0.10) 0%, rgba(34,197,94,0.06) 100%)",
                  border: `1px solid ${BURNT}33`,
                }}
              >
                <p className="text-[10px] uppercase tracking-widest mb-2" style={{ color: BURNT }}>
                  Reserviert für dich
                </p>
                <div className="flex items-baseline justify-between">
                  <p
                    style={{
                      fontFamily: SERIF,
                      fontSize: "clamp(32px, 5vw, 40px)",
                      fontWeight: 400,
                      fontStyle: "italic",
                      lineHeight: 1,
                      color: "#22c55e",
                    }}
                  >
                    €20–€250
                  </p>
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
                    Startbonus
                  </span>
                </div>
                <p className="text-[11px] mt-3" style={{ color: "var(--color-text-muted)" }}>
                  Wird nach Einzahlung via Bonus-Wheel ausgespielt.
                </p>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
                style={{ color: BURNT }}
              >
                ← Zurück zur Startseite
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={prefersReduced ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: EASE_ED }}
            >
              <div
                className="rounded-2xl p-6 md:p-8"
                style={{
                  background: "linear-gradient(180deg, #131315 0%, #0d0d0f 100%)",
                  border: `1px solid ${BURNT}22`,
                  boxShadow: `0 0 0 1px ${BURNT}11, 0 20px 60px -20px ${BURNT}22`,
                }}
              >
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-5">
                      <p
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Schritt 1 · Deine Daten
                      </p>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          E-Mail
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="deine@email.de"
                          className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all focus:ring-2"
                          style={{
                            background: "#18181b",
                            border: "1px solid #2a2a2d",
                            color: "#e5e5e7",
                            colorScheme: "dark",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2d")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          Vollständiger Name
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Max Mustermann"
                          className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                          style={{
                            background: "#18181b",
                            border: "1px solid #2a2a2d",
                            color: "#e5e5e7",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2d")}
                        />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <p
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        Schritt 2 · Passwort
                      </p>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          Passwort
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="Mindestens 8 Zeichen"
                          className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                          style={{
                            background: "#18181b",
                            border: "1px solid #2a2a2d",
                            color: "#e5e5e7",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2d")}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                          Passwort bestätigen
                        </label>
                        <input
                          type="password"
                          required
                          minLength={8}
                          placeholder="Passwort wiederholen"
                          className="w-full px-4 py-3.5 rounded-xl text-base outline-none transition-all"
                          style={{
                            background: "#18181b",
                            border: "1px solid #2a2a2d",
                            color: "#e5e5e7",
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = BURNT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "#2a2a2d")}
                        />
                      </div>
                      <label className="flex items-start gap-3 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          required
                          className="mt-0.5 rounded flex-shrink-0"
                          style={{
                            accentColor: BURNT,
                            width: 14,
                            height: 14,
                          }}
                        />
                        <span className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                          Ich akzeptiere die{" "}
                          <Link href="/datenschutz" className="underline hover:no-underline" style={{ color: BURNT }}>
                            AGB
                          </Link>{" "}
                          und{" "}
                          <Link href="/datenschutz" className="underline hover:no-underline" style={{ color: BURNT }}>
                            Datenschutzerklärung
                          </Link>{" "}
                          und bestätige, dass ich über 18 Jahre alt bin.
                        </span>
                      </label>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    whileHover={prefersReduced ? undefined : { scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full mt-7 text-white font-bold text-sm py-3.5 rounded-xl transition-all"
                    style={{
                      background: BURNT,
                      boxShadow: `0 0 0 1px ${BURNT}, 0 8px 24px -6px ${BURNT}88`,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
                  >
                    {step === 1 ? "Weiter →" : "Account erstellen & Bonus sichern"}
                  </motion.button>

                  {step === 2 && (
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full mt-2.5 text-xs py-2 transition-colors hover:opacity-80"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      ← Zurück
                    </button>
                  )}
                </form>

                {step === 1 && (
                  <>
                    <div className="relative my-7">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full h-px" style={{ background: "#2a2a2d" }} />
                      </div>
                      <div className="relative flex justify-center">
                        <span
                          className="px-3 text-[10px] uppercase tracking-widest"
                          style={{
                            background: "#101012",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          oder
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all hover:border-opacity-80"
                        style={{
                          background: "#18181b",
                          border: "1px solid #2a2a2d",
                          color: "#e5e5e7",
                        }}
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Weiter mit Google
                      </button>
                      <button
                        type="button"
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                        style={{
                          background: "#18181b",
                          border: "1px solid #2a2a2d",
                          color: "#e5e5e7",
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Weiter mit Apple
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Trust row */}
              <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: "#22c55e" }} />
                  MiFID II
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: "#22c55e" }} />
                  MiCA-konform
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                  <span className="w-1 h-1 rounded-full" style={{ background: "#22c55e" }} />
                  Segregiert
                </span>
              </div>

              <p className="text-center text-xs mt-6" style={{ color: "var(--color-text-muted)" }}>
                Bereits registriert?{" "}
                <Link
                  href="/login"
                  className="font-semibold transition-colors hover:opacity-80"
                  style={{ color: BURNT }}
                >
                  Jetzt einloggen →
                </Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
