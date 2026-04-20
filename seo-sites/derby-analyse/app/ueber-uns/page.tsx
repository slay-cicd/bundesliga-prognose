import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Über uns – Atlas Insights & Atlas Market',
  description:
    'Atlas Market ist die führende Prediction Market Plattform für europäischen Fußball. Wir bauen die faire Alternative zu klassischen Sportwetten.',
}

export default function UeberUns() {
  return (
    <>
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0f1628 0%, #0a0f1c 100%)',
          borderBottom: '1px solid #1e2d4a',
          padding: '4rem 1.5rem 3rem',
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '1rem',
            }}
          >
            Über <span style={{ color: '#00ff88' }}>Atlas Market</span>
          </h1>
          <p style={{ fontSize: '1.15rem', color: '#a0aec0', lineHeight: 1.7 }}>
            Wir bauen die fairste und transparenteste Plattform für Fußball-Prediction-Markets in Europa.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        
        {/* Mission */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00ff88', marginBottom: '1rem' }}>
            Unsere Mission
          </h2>
          <p style={{ color: '#c8d6e8', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            Der klassische Sportwettenmarkt ist strukturell unfair. Buchmacher bauen eine Marge von 8-15% in 
            jede Quote ein – du verlierst im Durchschnitt bei jeder Wette, egal wie gut deine Analyse ist.
          </p>
          <p style={{ color: '#c8d6e8', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            Atlas Market ändert das. Wir sind ein echter Markt – du handelst gegen andere Fußball-Fans, nicht 
            gegen ein Haus mit strukturellem Vorteil. Die Preise entstehen durch echtes Angebot und Nachfrage. 
            Unser Plattformfee liegt bei unter 2%.
          </p>
          <p style={{ color: '#c8d6e8', lineHeight: 1.8, fontSize: '1.05rem' }}>
            Das ist die Zukunft des Sports-Engagements – und wir bauen sie für Europa.
          </p>
        </section>

        {/* What is Atlas Insights */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00ff88', marginBottom: '1rem' }}>
            Was ist Atlas Insights?
          </h2>
          <p style={{ color: '#c8d6e8', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>
            Atlas Insights ist unser Wissensportal – hier erklären wir, wie Prediction Markets funktionieren, 
            warum sie besser sind als klassische Sportwetten und wie du sie für Bundesliga und Champions League 
            nutzen kannst.
          </p>
          <p style={{ color: '#c8d6e8', lineHeight: 1.8, fontSize: '1.05rem' }}>
            Kein Marketing-Blabla. Echte Erklärungen, konkrete Beispiele, ehrliche Zahlen.
          </p>
        </section>

        {/* Features */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#00ff88', marginBottom: '1.5rem' }}>
            Was Atlas Market bietet
          </h2>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { icon: '⚽', title: 'Bundesliga Coverage', desc: 'Alle 306 Saisonspiele mit Live-Märkten und historischen Preisdaten' },
              { icon: '🏆', title: 'Champions League', desc: 'Gruppenphase bis Finale – inklusive Live-Trading während der Spiele' },
              { icon: '📊', title: 'Transparente Preise', desc: 'Volle Preisverlauf-History, Handelsvolumen und Community-Einschätzungen' },
              { icon: '💚', title: 'Faire Gebühren', desc: 'Unter 2% Plattformgebühr – kein versteckter Buchmacher-Advantage' },
              { icon: '🔒', title: 'Reguliert & sicher', desc: 'Vollständig reguliert, transparente Rechtslage, sichere Einlagen' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  background: '#141d35',
                  border: '1px solid #1e2d4a',
                  borderRadius: '10px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <h3 style={{ color: '#ffffff', fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f1e3a 0%, #0a1628 100%)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Bereit loszulegen?
          </h2>
          <p style={{ color: '#a0aec0', marginBottom: '1.5rem', fontSize: '1rem', lineHeight: 1.6 }}>
            Erstelle deinen kostenlosen Account auf Atlas Market und erkunde die aktuellen Bundesliga-Märkte.
          </p>
          <a
            href="https://atlas.market"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: '#00ff88',
              color: '#0a0f1c',
              padding: '0.85rem 2.5rem',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '1rem',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Atlas Market kostenlos starten →
          </a>
        </div>
      </div>
    </>
  )
}
