import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getAllPosts, formatDate } from "@/lib/posts";
import { pickLocale, type Locale } from "@/i18n/config";
import { site } from "@/lib/site";

export default async function ArtigosSection() {
  const [posts, locale, t] = await Promise.all([
    getAllPosts().then((p) => p.slice(0, 2)),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (posts.length === 0) return null;

  return (
    <section id="artigos" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.articles")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.articles")}
          </h2>
          <div className="gold-rule w-24 mx-auto mb-3" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {posts.map((post) => {
            const title = pickLocale(post.title, locale);
            const excerpt = pickLocale(post.excerpt, locale);
            return (
              <Link
                key={post.slug}
                href={`/artigos/${post.slug}`}
                className="card-hover group block rounded-2xl overflow-hidden border bg-page"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="aspect-[16/10] relative overflow-hidden">
                  {post.cover ? (
                    <>
                      <Image
                        src={post.cover}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div
                      className="absolute inset-0 grid place-items-center"
                      style={{ background: "var(--bg-dark)" }}
                    >
                      <span className="font-serif text-6xl text-accent">
                        {site.shortName.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-7">
                  <div className="text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
                    {post.category}
                  </div>
                  <h3
                    className="font-serif text-2xl leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4"
                    style={{
                      color: "var(--bg-dark)",
                      textDecorationColor: "var(--accent)",
                    }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-5 text-dark">
                    {excerpt}
                  </p>
                  <div
                    className="flex items-center justify-between text-xs text-dark"
                    style={{ opacity: 0.7 }}
                  >
                    <span>
                      {formatDate(post.date, locale)} · {post.readingTime}
                    </span>
                    <span className="inline-flex items-center gap-1 text-accent font-medium opacity-100">
                      {t("cta.continueReading")}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
