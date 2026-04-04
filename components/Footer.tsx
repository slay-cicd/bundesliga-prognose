import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{ background: '#0a0f1c', borderTop: '1px solid #1e2d4a', padding: '3rem 1.5rem', marginTop: '5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '28px', background: '#00ff88', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '14px', color: '#0a0f1c' }}>B</div>
            <span style={{ fontWeight: 700, color: '#ffffff' }}>Bundesliga Prognose</span>
          </div>
          <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
            Datenbasierte Bundesliga-Analysen und Prognosen. Ein Projekt von{' '}
            <a href="https://atlasmarkets.de" style={{ color: '#00ff88', textDecoration: 'none' }}>Atlas Market</a>.
          </p>
        </div>
        <div>
          <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '1rem', fontSize: '0.95rem' }}>Jetzt starten</h3>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>Bundesliga live traden – ohne Buchmacher-Marge, auf Atlas Market.</p>
          <a href="https://atlasmarkets.de" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: '#00ff88', color: '#0a0f1c', padding: '0.6rem 1.25rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>atlasmarkets.de →</a>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '2rem auto 0', paddingTop: '2rem', borderTop: '1px solid #1e2d4a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ color: '#4a5568', fontSize: '0.85rem' }}>© 2026 Atlas Market. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  )
}
