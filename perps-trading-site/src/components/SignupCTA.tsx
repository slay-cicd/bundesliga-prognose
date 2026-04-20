"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function SignupCTA() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, type: "spring", bounce: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-40 md:bottom-6 md:left-auto md:right-6 md:w-80"
    >
      <div className="bg-surface-1 border-t md:border border-border md:rounded-xl p-4 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-text-primary">
              Bereit zu traden?
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              Account erstellen in unter 60 Sekunden.
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-text-muted hover:text-text-secondary p-1 -m-1"
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
          className="mt-3 block w-full text-center py-2.5 text-white text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: "#C4622D" }}
        >
          Jetzt registrieren
        </Link>
      </div>
    </motion.div>
  );
}
