import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getActiveTestimonials } from "@/lib/testimonials";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function Testimonials() {
  const [items, locale, t] = await Promise.all([
    getActiveTestimonials(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (items.length === 0) return null;

  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.testimonials")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.testimonials")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div
          className={`grid gap-6 mx-auto ${
            items.length === 1
              ? "max-w-2xl"
              : items.length === 2
                ? "md:grid-cols-2 max-w-4xl"
                : "md:grid-cols-2 lg:grid-cols-3 max-w-6xl"
          }`}
        >
          {items.map((it) => (
            <article
              key={it.id}
              className="card-hover rounded-2xl p-7 border bg-page flex flex-col"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {/* Aspas decorativas */}
              <div className="text-accent text-5xl font-serif leading-none mb-3">
                &ldquo;
              </div>

              <p className="text-sm leading-relaxed text-dark mb-6 flex-1 whitespace-pre-line">
                {pickLocale(it.quote, locale)}
              </p>

              {it.rating !== null && it.rating > 0 && (
                <div className="flex gap-0.5 mb-4 text-accent text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < (it.rating ?? 0) ? "★" : "☆"}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border-soft)" }}>
                {it.photoUrl ? (
                  <div className="w-11 h-11 rounded-full overflow-hidden relative shrink-0">
                    <Image
                      src={it.photoUrl}
                      alt={it.authorName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-11 h-11 rounded-full grid place-items-center shrink-0 font-serif text-sm"
                    style={{
                      background: "var(--bg-dark)",
                      color: "var(--accent)",
                    }}
                  >
                    {it.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <div
                    className="font-medium text-sm"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {it.authorName}
                  </div>
                  {it.authorRole && (
                    <div className="text-xs text-dark" style={{ opacity: 0.65 }}>
                      {it.authorRole}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
