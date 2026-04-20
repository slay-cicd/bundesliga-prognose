import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSlugs,
  getPostBySlug,
  getAllPosts,
} from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import ScrollReveal from "@/components/ScrollReveal";
import siteConfig from "@/site.config";

// Required for static export
export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Artikel nicht gefunden" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteConfig.url}/blog/${slug}/`,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}/`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllPosts();
  const related = allPosts
    .filter((p) => p.slug !== slug)
    .filter((p) => {
      if (!post.tags?.length) return true;
      return p.tags?.some((t) => post.tags!.includes(t));
    })
    .slice(0, 3);

  return (
    <>
      {/* Article header */}
      <div className="max-w-[680px] mx-auto px-5 sm:px-8 pt-[100px] pb-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs mb-10"
          aria-label="Breadcrumb"
          style={{ color: "#9CA3AF" }}
        >
          <Link
            href="/"
            className="hover:text-[#16a34a] transition-colors duration-200"
          >
            {siteConfig.name}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/blog/"
            className="hover:text-[#16a34a] transition-colors duration-200"
          >
            Artikel
          </Link>
          <span aria-hidden="true">/</span>
          <span
            className="truncate max-w-[200px]"
            style={{ color: "#6B7280" }}
          >
            {post.title}
          </span>
        </nav>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-serif text-[2.25rem] sm:text-[2.75rem] font-bold tracking-tight leading-[1.2] mb-6"
          style={{ color: "#1A1A1A" }}
        >
          {post.title}
        </h1>

        {/* Meta */}
        <p
          className="text-xs font-medium tracking-wide uppercase mb-8"
          style={{ color: "#9CA3AF" }}
        >
          {post.date}
          <span className="mx-2">·</span>
          {post.readingTime} Min. Lesezeit
          {post.author && (
            <>
              <span className="mx-2">·</span>
              {post.author}
            </>
          )}
        </p>

        <div className="divider" />
      </div>

      {/* Article content */}
      <article className="max-w-[680px] mx-auto px-5 sm:px-8 pb-20">
        {/* Lead excerpt */}
        <p
          className="text-[1.125rem] leading-relaxed mb-10 border-l-[3px] border-[#16a34a] pl-5"
          style={{ color: "#6B7280", fontFamily: "var(--font-serif, Georgia, serif)", fontStyle: "italic" }}
        >
          {post.excerpt}
        </p>

        {/* Markdown content */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Inline CTA */}
        <div className="mt-14 divider" />
        <div
          className="mt-10 rounded-lg p-8 text-center border border-[#E5E5E0]"
          style={{ backgroundColor: "#F3F3EE" }}
        >
          <p
            className="font-serif text-[1.125rem] font-semibold mb-2"
            style={{ color: "#1A1A1A" }}
          >
            Bereit, dein Wissen einzusetzen?
          </p>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            Auf Atlas Markets kannst du auf Fußball-Prediction Markets handeln.
          </p>
          <a
            href={siteConfig.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {siteConfig.ctaText}
          </a>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 pb-24">
          <ScrollReveal>
            <div className="divider mb-12" />
            <div className="flex items-end justify-between mb-10">
              <h2
                className="font-serif text-[1.5rem] font-bold tracking-tight"
                style={{ color: "#1A1A1A" }}
              >
                Ähnliche Artikel
              </h2>
              <Link
                href="/blog/"
                className="text-sm text-[#16a34a] hover:text-[#15803d] transition-colors duration-200"
              >
                Alle Artikel →
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {related.map((p) => (
                <ArticleCard key={p.slug} post={p} />
              ))}
            </div>
          </ScrollReveal>
        </section>
      )}
    </>
  );
}
