import Link from 'next/link'
import siteConfig from '@/site.config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-[#E5E5E0]" style={{ backgroundColor: '#F3F3EE' }}>
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-10">
          <div>
            <p className="font-serif text-[1rem] font-semibold mb-2" style={{ color: '#1A1A1A' }}>
              {siteConfig.name}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
              Expertenwissen zu Fußball-Prediction Markets und Sportwetten.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: '#9CA3AF' }}>
              Netzwerk
            </p>
            <ul className="space-y-2">
              {siteConfig.networkSites.map((site) => (
                <li key={site.url}>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs hover:text-[#16a34a] transition-colors duration-200"
                    style={{ color: '#6B7280' }}
                  >
                    {site.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-3" style={{ color: '#9CA3AF' }}>
              Rechtliches
            </p>
            <ul className="space-y-2">
              <li>
                <Link href={siteConfig.imprintUrl} className="text-xs hover:text-[#16a34a] transition-colors duration-200" style={{ color: '#6B7280' }}>
                  Impressum
                </Link>
              </li>
              <li>
                <Link href={siteConfig.privacyUrl} className="text-xs hover:text-[#16a34a] transition-colors duration-200" style={{ color: '#6B7280' }}>
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#9CA3AF' }}>
            © {year} {siteConfig.company}. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
            18+ | Glücksspiel kann süchtig machen. Spiel verantwortungsbewusst.
          </p>
          <a
            href={siteConfig.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium hover:text-[#15803d] transition-colors duration-200"
            style={{ color: '#16a34a' }}
          >
            atlasmarkets.de
          </a>
        </div>
      </div>
    </footer>
  )
}
