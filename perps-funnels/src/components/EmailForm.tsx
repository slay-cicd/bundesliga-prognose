"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface EmailFormProps {
  variant: "aggressive" | "professional";
  ctaText?: string;
  placeholder?: string;
}

export function EmailForm({
  variant,
  ctaText = "Jetzt anmelden",
  placeholder = "Deine E-Mail-Adresse",
}: EmailFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();
  const isPro = variant === "professional";

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
          exit={{ opacity: 0, y: -12 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              required
              className={`flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isPro
                  ? "bg-white border border-[#d6d0c8] text-[#1a1a1a] placeholder:text-[#999] focus:border-[#c4622d] focus-visible:ring-[#c4622d] focus-visible:ring-offset-[#f5f3ef]"
                  : "bg-surface-2 border border-border text-text-primary placeholder:text-text-muted focus:border-mint focus-visible:ring-mint focus-visible:ring-offset-surface-0"
              }`}
            />
            <button
              type="submit"
              className={`px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] ${
                isPro
                  ? "bg-[#1a1a1a] text-[#f5f3ef] hover:bg-[#2a2a2a] focus-visible:ring-[#c4622d] focus-visible:ring-offset-[#f5f3ef]"
                  : "bg-mint text-[#0a0a0b] font-bold hover:shadow-[0_0_24px_rgba(127,229,214,0.35)] focus-visible:ring-mint focus-visible:ring-offset-surface-0 hover:scale-[1.02] active:shadow-none"
              }`}
            >
              {ctaText}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div
          key="success"
          initial={prefersReduced ? false : { opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: EASE, duration: 0.4 }}
          className={`w-full max-w-md mx-auto text-center p-6 rounded-2xl ${
            isPro
              ? "bg-white border border-[#d6d0c8]"
              : "bg-mint-dim border border-mint/20"
          }`}
        >
          <svg
            className={`w-9 h-9 mx-auto mb-3 ${isPro ? "text-[#c4622d]" : "text-mint"}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          <h3
            className={`text-lg font-bold mb-1 ${
              isPro ? "text-[#1a1a1a]" : "text-mint"
            }`}
          >
            {isPro ? "Anfrage eingegangen." : "Du bist dabei."}
          </h3>
          <p className={`text-sm ${isPro ? "text-[#666]" : "text-text-secondary"}`}>
            {isPro
              ? "Wir melden uns, sobald Early Access verfügbar ist."
              : "Wir melden uns, sobald dein Platz freigeschaltet wird."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
