"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl"
      style={{
        background: "rgba(10,10,11,0.75)",
        borderBottom: "1px solid rgba(196,98,45,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              style={{ color: BURNT }}
            >
              <path
                d="M2 18L10 6L14 12L22 4"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="22" cy="4" r="1.5" fill="currentColor" />
            </svg>
            <span
              style={{
                fontFamily: SERIF,
                fontSize: "1.25rem",
                fontWeight: 300,
                letterSpacing: "0.03em",
                color: "var(--color-text-primary)",
              }}
            >
              Concorde
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/so-funktionierts"
              className="text-xs uppercase tracking-widest font-semibold transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              So funktioniert&apos;s
            </Link>
            <Link
              href="/login"
              className="text-xs uppercase tracking-widest font-semibold transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Login
            </Link>
            <Link
              href="/registrierung"
              data-event="register_click"
              className="text-sm font-bold text-white px-4 py-2 rounded-lg transition-all"
              style={{
                background: BURNT,
                boxShadow: `0 0 0 1px ${BURNT}, 0 4px 12px -4px ${BURNT}66`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#b0561f")}
              onMouseLeave={(e) => (e.currentTarget.style.background = BURNT)}
            >
              Jetzt registrieren
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-3 -mr-3 transition-colors"
            style={{ color: "var(--color-text-secondary)" }}
            aria-label="Menü"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{
              borderTop: "1px solid rgba(196,98,45,0.15)",
              background: "#0d0d0f",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link
                href="/so-funktionierts"
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-widest font-semibold py-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                So funktioniert&apos;s
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-widest font-semibold py-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Login
              </Link>
              <Link
                href="/registrierung"
                data-event="register_click"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold text-white px-4 py-3 rounded-xl text-center transition-all"
                style={{
                  background: BURNT,
                  boxShadow: `0 0 0 1px ${BURNT}, 0 4px 12px -4px ${BURNT}66`,
                }}
              >
                Jetzt registrieren →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
