import type { Metadata } from "next";
import { getAllPosts } from "@/lib/posts";
import ArticleCard from "@/components/ArticleCard";
import ScrollReveal from "@/components/ScrollReveal";
import siteConfig from "@/site.config";

export const metadata: Metadata = {
  title: "Alle Artikel",
  description: `Alle Artikel und Analysen zu Fußball-Prediction Markets auf ${siteConfig.name}.`,
  alternates: {
    canonical: `${siteConfig.url}/blog/`,
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-[1100px] mx-auto px-5 sm:px-8 pt-[100px] pb-24">
      {/* Header */}
      <div className="max-w-[680px] mb-14">
        <p
          className="text-xs font-semibold tracking-[0.1em] uppercase mb-4"
          style={{ color: "#9CA3AF" }}
        >
          Alle Artikel
        </p>
        <h1
          className="font-serif text-[2.5rem] sm:text-[3rem] font-bold tracking-tight mb-4"
          style={{ color: "#1A1A1A" }}
        >
          Wissen &amp; Analysen
        </h1>
        <p className="text-[1.0625rem] leading-relaxed" style={{ color: "#6B7280" }}>
          Fundierte Einblicke in Fußball-Prediction Markets, Strategien und
          Tipps für smarte Wetter.
        </p>
      </div>

      <div className="divider mb-12" />

      {/* Grid */}
      {posts.length > 0 ? (
        <ScrollReveal stagger>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
            {posts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>
        </ScrollReveal>
      ) : (
        <div
          className="rounded-lg p-12 max-w-md border border-[#E5E5E0] text-center"
          style={{ backgroundColor: "#FFFFFF" }}
        >
          <h2
            className="font-serif text-xl font-semibold mb-3"
            style={{ color: "#1A1A1A" }}
          >
            Noch keine Artikel
          </h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            Lege .md-Dateien in{" "}
            <code
              className="text-xs px-1 py-0.5 rounded"
              style={{ backgroundColor: "#F3F3EE", color: "#16a34a" }}
            >
              content/blog/
            </code>{" "}
            ab.
          </p>
        </div>
      )}

      {/* CTA */}
      <ScrollReveal delay={400}>
        <div className="text-center mt-20">
          <a
            href={siteConfig.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            {siteConfig.ctaText}
          </a>
          <p className="text-xs mt-3" style={{ color: "#9CA3AF" }}>
            {siteConfig.ctaSubtext}
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
