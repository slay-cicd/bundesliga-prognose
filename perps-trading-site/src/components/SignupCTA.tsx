"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

export function SignupCTA() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ delay: 2, type: "spring", bounce: 0.2, duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:bottom-6 md:left-auto md:right-6 md:w-80 px-3 md:px-0 pb-3 md:pb-0"
        >
          <div
            className="md:rounded-2xl p-4 md:p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #18181b 0%, #0d0d0f 100%)",
              border: `1px solid ${BURNT}44`,
              boxShadow: `0 0 0 1px ${BURNT}11, 0 18px 50px -18px rgba(0,0,0,0.6), 0 0 24px -6px ${BURNT}33`,
            }}
          >
            {/* Radial accent */}
            <div
              className="absolute inset-0 pointer-events-none"
              aria-hidden="true"
              style={{
                background:
                  "radial-gradient(ellipse at 0% 0%, rgba(196,98,45,0.14) 0%, transparent 60%)",
              }}
            />

            <div className="relative flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <div
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 text-[9px] font-bold uppercase tracking-widest"
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
                  €20–€250 Bonus
                </div>
                <p
                  className="leading-tight"
                  style={{
                    fontFamily: SERIF,
                    fontSize: "1.25rem",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Bereit zu traden?
                </p>
                <p className="text-[11px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                  Account in unter 60 Sekunden
                </p>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="text-text-muted hover:text-text-secondary p-1 -m-1 flex-shrink-0 transition-colors"
                aria-label="Schließen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <Link
              href="/registrierung"
              data-event="register_click"
              className="relative block w-full text-center py-2.5 text-white text-sm font-bold rounded-xl transition-all"
              style={{
                background: BURNT,
                boxShadow: `0 0 0 1px ${BURNT}, 0 4px 16px -4px ${BURNT}66`,
              }}
            >
              Jetzt registrieren →
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
