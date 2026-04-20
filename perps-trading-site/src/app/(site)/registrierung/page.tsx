"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Registrierung() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (step === 1) setStep(2);
    else setSubmitted(true);
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            {submitted ? "Willkommen!" : "Account erstellen"}
          </h1>
          {!submitted && <p className="text-text-muted text-sm">Starte in unter 60 Sekunden</p>}
        </div>

        {!submitted && (
          <div className="flex gap-2 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? "bg-accent" : "bg-surface-3"}`} />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-up/10 border border-up/20 rounded-xl p-8 text-center"
            >
              <svg className="w-12 h-12 mx-auto mb-4 text-up" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l3 3 5-6" /></svg>
              <h2 className="text-lg font-bold text-up mb-2">Du bist auf der Warteliste!</h2>
              <p className="text-sm text-text-secondary mb-6">Wir melden uns, sobald dein Platz bereit ist.</p>
              <Link href="/" className="text-sm text-accent hover:underline font-medium">← Zurück zur Startseite</Link>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="bg-surface-1 rounded-xl border border-border p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  {step === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">E-Mail</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="deine@email.de"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Vollständiger Name</label>
                        <input type="text" required placeholder="Max Mustermann"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted" />
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Passwort</label>
                        <input type="password" required minLength={8} placeholder="Mindestens 8 Zeichen"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1.5">Passwort bestätigen</label>
                        <input type="password" required minLength={8} placeholder="Passwort wiederholen"
                          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted" />
                      </div>
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input type="checkbox" required className="mt-1 rounded border-border bg-surface-2 text-accent focus:ring-accent" />
                        <span className="text-xs text-text-muted">Ich akzeptiere die AGB und Datenschutzerklärung und bestätige, dass ich über 18 Jahre alt bin.</span>
                      </label>
                    </div>
                  )}

                  <button type="submit" className="w-full mt-6 bg-accent hover:bg-accent-hover text-white font-semibold py-3 rounded-lg transition-colors">
                    {step === 1 ? "Weiter" : "Account erstellen"}
                  </button>
                  {step === 2 && (
                    <button type="button" onClick={() => setStep(1)} className="w-full mt-2 text-sm text-text-muted hover:text-text-secondary py-2">← Zurück</button>
                  )}
                </form>

                {step === 1 && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center text-xs"><span className="bg-surface-1 px-3 text-text-muted">oder</span></div>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Weiter mit Google
                      </button>
                      <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-surface-2 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Weiter mit Apple
                      </button>
                    </div>
                  </>
                )}
              </div>

              <p className="text-center text-sm text-text-muted mt-6">
                Bereits registriert?{" "}
                <Link href="/login" className="text-accent hover:underline font-medium">Jetzt einloggen</Link>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
