import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-text-primary">
                <path d="M2 18L10 6L14 12L22 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="22" cy="4" r="1.5" fill="currentColor" />
              </svg>
              <span className="text-sm font-semibold text-text-primary">Concorde</span>
            </div>
            <p className="text-xs text-text-muted leading-relaxed">
              Trading. Neu gedacht.<br />Reguliert in Europa.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Produkt</h4>
            <ul className="space-y-2">
              <li><Link href="/so-funktionierts" className="text-sm text-text-muted hover:text-text-primary transition-colors">So funktioniert&apos;s</Link></li>
              <li><Link href="/registrierung" className="text-sm text-text-muted hover:text-text-primary transition-colors">Registrierung</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Rechtliches</h4>
            <ul className="space-y-2">
              <li><Link href="/impressum" className="text-sm text-text-muted hover:text-text-primary transition-colors">Impressum</Link></li>
              <li><Link href="/datenschutz" className="text-sm text-text-muted hover:text-text-primary transition-colors">Datenschutz</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">Kontakt</h4>
            <ul className="space-y-2">
              <li className="text-sm text-text-muted">hello@concorde.trade</li>
              <li className="text-sm text-text-muted">Berlin, Deutschland</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">© 2025 Concorde. Alle Rechte vorbehalten.</p>
          <p className="text-xs text-text-muted text-center sm:text-right max-w-md">
            Risikohinweis: Der Handel mit Derivaten birgt erhebliche Risiken. Sie können Ihre gesamte Einlage verlieren.
          </p>
        </div>
      </div>
    </footer>
  );
}
