"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface FunnelEmailFormProps {
  variant: "dark" | "light";
  ctaText?: string;
  placeholder?: string;
}

export function FunnelEmailForm({
  variant,
  ctaText = "Jetzt anmelden",
  placeholder = "Deine E-Mail-Adresse",
}: FunnelEmailFormProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReduced = useReducedMotion();
  const isLight = variant === "light";

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
              className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none transition-all duration-200"
              style={
                isLight
                  ? {
                      background: "#fff",
                      border: "1px solid #d6d0c8",
                      color: "#1a1a1a",
                      colorScheme: "light",
                    }
                  : {
                      background: "#18181b",
                      border: "1px solid #2a2a2d",
                      color: "#e8e8ea",
                      colorScheme: "dark",
                    }
              }
            />
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-sm whitespace-nowrap cursor-pointer transition-all duration-200 active:scale-[0.97] focus:outline-none"
              style={
                isLight
                  ? {
                      background: "#1a1a1a",
                      color: "#f5f3ef",
                    }
                  : {
                      background: "#7fe5d6",
                      color: "#0a0a0b",
                    }
              }
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
          className="w-full max-w-md mx-auto text-center p-6 rounded-2xl"
          style={
            isLight
              ? { background: "#fff", border: "1px solid #d6d0c8" }
              : { background: "rgba(127,229,214,0.08)", border: "1px solid rgba(127,229,214,0.2)" }
          }
        >
          <svg
            className="w-9 h-9 mx-auto mb-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: isLight ? "#c4622d" : "#7fe5d6" }}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" />
          </svg>
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: isLight ? "#1a1a1a" : "#7fe5d6" }}
          >
            {isLight ? "Anfrage eingegangen." : "Du bist dabei."}
          </h3>
          <p className="text-sm" style={{ color: isLight ? "#666" : "#888890" }}>
            {isLight
              ? "Wir melden uns, sobald Early Access verfügbar ist."
              : "Wir melden uns, sobald dein Platz freigeschaltet wird."}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
