import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { getActiveGallery } from "@/lib/gallery";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function Gallery() {
  const [items, locale, t] = await Promise.all([
    getActiveGallery(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (items.length === 0) return null;

  return (
    <section id="galeria" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.gallery")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.gallery")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const caption = pickLocale(item.caption, locale);
            const hasAfter = Boolean(item.afterImageUrl);

            return (
              <article
                key={item.id}
                className="card-hover rounded-2xl overflow-hidden border bg-page group"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="aspect-square relative overflow-hidden bg-dark">
                  {/* Imagem "antes" sempre presente */}
                  <Image
                    src={item.beforeImageUrl}
                    alt={caption || t("labels.before")}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                    className="object-cover"
                  />

                  {/* Imagem "depois" sobre a "antes", aparece no hover */}
                  {hasAfter && (
                    <>
                      <Image
                        src={item.afterImageUrl!}
                        alt={`${caption || ""} — ${t("labels.after")}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                        className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      {/* Badge "Antes / Depois" no canto */}
                      <div className="absolute top-3 left-3 flex gap-1 z-10">
                        <span
                          className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium opacity-100 group-hover:opacity-0 transition-opacity"
                          style={{
                            background: "rgba(0,0,0,0.65)",
                            color: "var(--accent)",
                          }}
                        >
                          {t("labels.before")}
                        </span>
                        <span
                          className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            background: "rgba(0,0,0,0.65)",
                            color: "var(--accent)",
                          }}
                        >
                          {t("labels.after")}
                        </span>
                      </div>
                    </>
                  )}

                  {item.category && (
                    <span
                      className="absolute bottom-3 right-3 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full font-medium z-10"
                      style={{
                        background: "rgba(0,0,0,0.65)",
                        color: "var(--accent)",
                      }}
                    >
                      {item.category}
                    </span>
                  )}
                </div>

                {caption && (
                  <div className="p-5">
                    <p className="text-sm leading-relaxed text-dark whitespace-pre-line">
                      {caption}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
