"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EmailCaptureProps {
  dark?: boolean;
}

export function EmailCapture({ dark = false }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) setSubmitted(true);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-surface-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent placeholder:text-text-muted"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-accent hover:bg-accent-hover text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Early Access
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-up/10 border border-up/20 text-up px-6 py-4 rounded-lg text-center"
          >
            <p className="font-semibold text-sm">Du bist auf der Warteliste!</p>
            <p className="text-xs mt-1 opacity-80">Wir melden uns bei dir.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
