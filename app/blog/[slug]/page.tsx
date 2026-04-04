import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { markdownToHtml } from '@/lib/markdown'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, locale: 'de_DE' },
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const contentHtml = await markdownToHtml(post.content)
  const allPosts = getAllPosts().filter((p) => p.slug !== post.slug).slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    publisher: { '@type': 'Organization', name: 'Atlas Market', url: 'https://atlasmarkets.de' },
    keywords: post.keywords.join(', '),
    inLanguage: 'de',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ background: 'linear-gradient(180deg, #0f1628 0%, #0a0f1c 100%)', borderBottom: '1px solid #1e2d4a', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <Link href="/" style={{ color: '#718096', textDecoration: 'none' }}>Home</Link>
            <span style={{ color: '#4a5568' }}>/</span>
            <span style={{ color: '#718096' }}>Blog</span>
            <span style={{ color: '#4a5568' }}>/</span>
            <span style={{ color: '#a0aec0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{post.title}</span>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(0,255,136,0.12)', color: '#00ff88', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>{post.category}</span>
            <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>{formatDate(post.date)}</span>
            <span style={{ color: '#4a5568' }}>·</span>
            <span style={{ color: '#4a5568', fontSize: '0.85rem' }}>{post.readTime} Min. Lesezeit</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '1rem' }}>{post.title}</h1>
          <p style={{ fontSize: '1.1rem', color: '#a0aec0', lineHeight: 1.7 }}>{post.description}</p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <div className="article-content" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <div style={{ background: 'linear-gradient(135deg, #0f1e3a 0%, #0a1628 100%)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px', padding: '2rem', marginTop: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>⚡</div>
          <h3 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.75rem', fontSize: '1.2rem' }}>Bereit für echte Prediction Markets?</h3>
          <p style={{ color: '#a0aec0', marginBottom: '1.25rem', fontSize: '0.95rem' }}>Erlebe Bundesliga und Champions League auf Atlas Market – fair, transparent, ohne Buchmacher-Marge.</p>
          <a href="https://atlasmarkets.de" target="_blank" rel="noopener noreferrer" style={{ background: '#00ff88', color: '#0a0f1c', padding: '0.75rem 2rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem', textDecoration: 'none', display: 'inline-block' }}>Zu atlasmarkets.de →</a>
        </div>
        {post.keywords.length > 0 && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {post.keywords.map((kw) => (
              <span key={kw} style={{ background: '#141d35', border: '1px solid #1e2d4a', color: '#718096', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem' }}>{kw}</span>
            ))}
          </div>
        )}
      </div>

      {allPosts.length > 0 && (
        <section style={{ background: '#0f1628', borderTop: '1px solid #1e2d4a', padding: '3rem 1.5rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Weitere Artikel</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {allPosts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: '#141d35', border: '1px solid #1e2d4a', borderRadius: '10px', padding: '1.25rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#00ff88', fontWeight: 600, textTransform: 'uppercase' }}>{p.category}</span>
                    <h3 style={{ color: '#ffffff', fontWeight: 600, marginTop: '0.5rem', fontSize: '0.95rem', lineHeight: 1.4 }}>{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
