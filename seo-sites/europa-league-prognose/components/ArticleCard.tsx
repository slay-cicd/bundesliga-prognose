import Link from 'next/link'
import { PostMeta } from '@/lib/posts'

interface ArticleCardProps {
  post: PostMeta
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="border-b border-[#E5E5E0] pb-8">
      <Link
        href={`/blog/${post.slug}/`}
        className="group block"
        aria-label={`Artikel lesen: ${post.title}`}
      >
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
        )}
        <h3
          className="font-serif text-[1.25rem] font-bold leading-snug mb-2 group-hover:text-[#16a34a] transition-colors duration-200"
          style={{ color: '#1A1A1A' }}
        >
          {post.title}
        </h3>
        <p
          className="text-[0.9375rem] leading-relaxed line-clamp-3 mb-4"
          style={{ color: '#6B7280' }}
        >
          {post.excerpt}
        </p>
        <p className="text-xs font-medium tracking-wide uppercase" style={{ color: '#9CA3AF' }}>
          {post.date}
          <span className="mx-2">·</span>
          {post.readingTime} Min. Lesezeit
        </p>
      </Link>
    </article>
  )
}
