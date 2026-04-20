"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-0/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-text-primary">
              <path d="M2 18L10 6L14 12L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="22" cy="4" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-base font-semibold text-text-primary tracking-tight">
              Concorde
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/so-funktionierts"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              So funktioniert&apos;s
            </Link>
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/registrierung"
              className="text-sm font-medium bg-accent hover:bg-accent-hover text-white px-4 py-1.5 rounded-lg transition-colors"
            >
              Registrieren
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-secondary"
            aria-label="Menü"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
            className="md:hidden border-t border-border bg-surface-1"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              <Link href="/so-funktionierts" onClick={() => setMobileOpen(false)} className="text-sm text-text-secondary py-2">
                So funktioniert&apos;s
              </Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-sm text-text-secondary py-2">
                Login
              </Link>
              <Link
                href="/registrierung"
                onClick={() => setMobileOpen(false)}
                className="text-sm font-medium bg-accent text-white px-4 py-2.5 rounded-lg text-center"
              >
                Registrieren
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
