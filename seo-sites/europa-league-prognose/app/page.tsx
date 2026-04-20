import { getAllPosts, getFeaturedPost } from "@/lib/posts";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import ScrollReveal from "@/components/ScrollReveal";
import siteConfig from "@/site.config";

export default function HomePage() {
  const allPosts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const gridPosts = allPosts.filter(
    (p) => !featuredPost || p.slug !== featuredPost.slug
  );

  return (
    <>
      <Hero featuredPost={featuredPost} />

      {/* Article grid */}
      {gridPosts.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-5 sm:px-8 pb-24">
          <ScrollReveal>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p
                  className="text-xs font-semibold tracking-[0.1em] uppercase mb-2"
                  style={{ color: "#9CA3AF" }}
                >
                  Alle Artikel
                </p>
                <h2
                  className="font-serif text-[1.75rem] font-bold tracking-tight"
                  style={{ color: "#1A1A1A" }}
                >
                  Wissen &amp; Analysen
                </h2>
              </div>
              <a
                href={siteConfig.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline hidden sm:inline-block"
              >
                Zu Atlas Markets →
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal stagger>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
              {gridPosts.slice(0, siteConfig.postsPerPage).map((post) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          </ScrollReveal>

          {gridPosts.length > siteConfig.postsPerPage && (
            <ScrollReveal delay={200}>
              <div className="text-center mt-10">
                <p className="text-sm" style={{ color: "#9CA3AF" }}>
                  {gridPosts.length - siteConfig.postsPerPage} weitere Artikel
                  verfügbar.
                </p>
              </div>
            </ScrollReveal>
          )}
        </section>
      )}

      {/* Empty state */}
      {allPosts.length === 0 && (
        <section className="max-w-[680px] mx-auto px-5 sm:px-8 pb-24 text-center">
          <div
            className="rounded-lg p-12 border border-[#E5E5E0]"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <h2
              className="font-serif text-xl font-semibold mb-3"
              style={{ color: "#1A1A1A" }}
            >
              Artikel kommen bald
            </h2>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              Lege deine ersten Markdown-Artikel in{" "}
              <code
                className="text-xs px-1 py-0.5 rounded"
                style={{ backgroundColor: "#F3F3EE", color: "#16a34a" }}
              >
                content/blog/
              </code>{" "}
              ab.
            </p>
          </div>
        </section>
      )}

      {/* CTA section */}
      <ScrollReveal>
        <section
          className="border-t border-[#E5E5E0] py-20 px-5 sm:px-8"
          style={{ backgroundColor: "#F3F3EE" }}
        >
          <div className="max-w-[680px] mx-auto text-center">
            <p
              className="text-xs font-semibold tracking-[0.1em] uppercase mb-4"
              style={{ color: "#9CA3AF" }}
            >
              Atlas Markets
            </p>
            <h2
              className="font-serif text-[1.75rem] sm:text-[2.25rem] font-bold tracking-tight mb-4"
              style={{ color: "#1A1A1A" }}
            >
              Vorhersagen handeln, nicht nur tippen.
            </h2>
            <p
              className="text-[1rem] leading-relaxed mb-8 max-w-lg mx-auto"
              style={{ color: "#6B7280" }}
            >
              {siteConfig.ctaSubtext}
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
        </section>
      </ScrollReveal>
    </>
  );
}
