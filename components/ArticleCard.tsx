'use client'
import Link from 'next/link'
import { PostMeta } from '@/lib/posts'

interface ArticleCardProps {
  post: PostMeta
  featured?: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        style={{
          background: '#141d35',
          border: '1px solid #1e2d4a',
          borderRadius: '12px',
          padding: featured ? '2rem' : '1.5rem',
          cursor: 'pointer',
          height: '100%',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget; el.style.borderColor = '#00ff88'; el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget; el.style.borderColor = '#1e2d4a'; el.style.transform = 'translateY(0)'
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            background: 'rgba(0,255,136,0.12)', color: '#00ff88',
            padding: '0.25rem 0.75rem', borderRadius: '999px',
            fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' as const,
          }}>{post.category}</span>
          <span style={{ color: '#4a5568', fontSize: '0.8rem' }}>{post.readTime} Min.</span>
        </div>
        <h2 style={{
          fontSize: featured ? '1.4rem' : '1.1rem', fontWeight: 700,
          color: '#ffffff', lineHeight: 1.35, marginBottom: '0.75rem', letterSpacing: '-0.02em',
        }}>{post.title}</h2>
        <p style={{
          color: '#718096', fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem',
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
        }}>{post.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#4a5568', fontSize: '0.8rem' }}>{formatDate(post.date)}</span>
          <span style={{ color: '#00ff88', fontSize: '0.85rem', fontWeight: 600 }}>Weiterlesen →</span>
        </div>
      </article>
    </Link>
  )
}
