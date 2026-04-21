'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import siteConfig from '@/site.config'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-[#E5E5E0] shadow-sm'
          : 'bg-[#FAFAF7]'
      }`}
    >
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[60px]">
          <Link
            href="/"
            className="font-serif text-[1.125rem] font-semibold text-[#1A1A1A] hover:text-[#16a34a] transition-colors duration-200 tracking-tight"
            aria-label={`${siteConfig.name} — Startseite`}
          >
            {siteConfig.name}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-7" aria-label="Hauptnavigation">
            <Link href="/" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200">
              Startseite
            </Link>
            <Link href="/blog/" className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors duration-200">
              Artikel
            </Link>
            <a
              href={siteConfig.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              {siteConfig.ctaText}
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden flex flex-col gap-[5px] p-2 -mr-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menü öffnen"
            aria-expanded={menuOpen}
          >
            <span className={`block w-[22px] h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
            <span className={`block w-[22px] h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-[22px] h-[1.5px] bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`sm:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-48 pb-5' : 'max-h-0'}`}>
          <nav className="flex flex-col gap-4 pt-2 border-t border-[#E5E5E0]">
            <Link href="/" className="text-sm text-[#4A4A4A] hover:text-[#16a34a] transition-colors duration-200 pt-3" onClick={() => setMenuOpen(false)}>
              Startseite
            </Link>
            <Link href="/blog/" className="text-sm text-[#4A4A4A] hover:text-[#16a34a] transition-colors duration-200" onClick={() => setMenuOpen(false)}>
              Artikel
            </Link>
            <a
              href={siteConfig.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-center"
              onClick={() => setMenuOpen(false)}
            >
              {siteConfig.ctaText}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
