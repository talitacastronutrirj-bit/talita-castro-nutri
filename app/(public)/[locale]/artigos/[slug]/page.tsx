import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import WhatsAppCTA from "@/components/WhatsAppCTA";
import { Link } from "@/i18n/navigation";
import { getAllSlugs, getPostBySlug, formatDate } from "@/lib/posts";
import { LOCALES, pickLocale, type Locale } from "@/i18n/config";

type Params = { locale: Locale; slug: string };

export async function generateStaticParams() {
  // Resiliente a falta de DATABASE_URL no build time: se o DB não estiver
  // acessível, retorna lista vazia e Next gera as páginas on-demand (SSR).
  try {
    const slugs = await getAllSlugs();
    // Cross-product: gera 1 página por slug × locale
    return LOCALES.flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    );
  } catch (err) {
    console.warn("[artigos/[slug]] DB inacessível no build, fallback pra SSR:", err);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const title = pickLocale(post.title, locale);
  const excerpt = pickLocale(post.excerpt, locale);
  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      type: "article",
      publishedTime: post.date,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [post, t] = await Promise.all([
    getPostBySlug(slug),
    getTranslations(),
  ]);
  if (!post) notFound();

  const title = pickLocale(post.title, locale);
  const content = pickLocale(post.content, locale);

  return (
    <article className="py-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          href="/artigos"
          className="text-sm inline-flex items-center gap-2 mb-8 hover:opacity-70 text-dark"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          ← {t("nav.articles")}
        </Link>

        <div className="text-xs uppercase tracking-widest text-accent mb-3">
          {post.category}
        </div>
        <h1
          className="font-serif text-3xl md:text-4xl leading-tight mb-4"
          style={{ color: "var(--bg-dark)" }}
        >
          {title}
        </h1>
        <div className="text-sm mb-10 text-dark" style={{ opacity: 0.6 }}>
          {formatDate(post.date, locale)} · {post.readingTime}
          {post.author && ` · ${post.author}`}
        </div>

        {post.cover ? (
          <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-12 relative">
            <Image
              src={post.cover}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.3) 100%)",
              }}
            />
          </div>
        ) : null}

        <div className="prose-custom">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>

        <div className="mt-16 p-8 bg-dark text-light rounded-2xl text-center">
          <WhatsAppCTA className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full font-semibold">
            {t("cta.whatsapp")}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </WhatsAppCTA>
        </div>
      </div>
    </article>
  );
}
