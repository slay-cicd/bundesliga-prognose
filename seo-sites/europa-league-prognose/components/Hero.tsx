import Link from 'next/link'
import { PostMeta } from '@/lib/posts'
import siteConfig from '@/site.config'

interface HeroProps {
  featuredPost: PostMeta | null
}

export default function Hero({ featuredPost }: HeroProps) {
  return (
    <section className="pt-[100px] pb-20 px-5 sm:px-8">
      <div className="max-w-[680px] mx-auto">
        <h1
          className="font-serif text-[2.75rem] sm:text-[3.5rem] font-bold leading-[1.15] tracking-tight mb-6"
          style={{ color: '#1A1A1A' }}
        >
          {siteConfig.tagline}
        </h1>
        <p
          className="text-[1.125rem] leading-[1.8] mb-8 max-w-[560px]"
          style={{ color: '#6B7280' }}
        >
          {siteConfig.description}
        </p>
        <div className="flex flex-wrap gap-3 mb-14">
          <a href={siteConfig.ctaUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            {siteConfig.ctaText}
          </a>
          <Link href="/blog/" className="btn-outline">
            Alle Artikel lesen
          </Link>
        </div>

        <div className="divider" />

        {featuredPost && (
          <div className="mt-10">
            <p className="text-xs font-semibold tracking-[0.1em] uppercase mb-5" style={{ color: '#9CA3AF' }}>
              Empfohlener Artikel
            </p>
            <Link
              href={`/blog/${featuredPost.slug}/`}
              className="group block"
              aria-label={`Artikel lesen: ${featuredPost.title}`}
            >
              {featuredPost.tags && featuredPost.tags.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {featuredPost.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-pill">{tag}</span>
                  ))}
                </div>
              )}
              <h2
                className="font-serif text-[1.375rem] font-bold leading-snug mb-2 group-hover:text-[#16a34a] transition-colors duration-200"
                style={{ color: '#1A1A1A' }}
              >
                {featuredPost.title}
              </h2>
              <p className="text-[0.9375rem] leading-relaxed mb-3 line-clamp-2" style={{ color: '#6B7280' }}>
                {featuredPost.excerpt}
              </p>
              <p className="text-xs tracking-wide uppercase" style={{ color: '#9CA3AF' }}>
                {featuredPost.date} · {featuredPost.readingTime} Min. Lesezeit
              </p>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
