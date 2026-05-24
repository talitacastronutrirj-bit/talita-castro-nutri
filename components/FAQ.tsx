import { getLocale, getTranslations } from "next-intl/server";
import { getActiveFaq } from "@/lib/faq";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function FAQ() {
  const [items, locale, t] = await Promise.all([
    getActiveFaq(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  // Esconde a seção inteira se não tem FAQ cadastrada
  if (items.length === 0) return null;

  return (
    <section id="faq" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.faq")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.faq")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <details
              key={item.id}
              className="rounded-xl p-5 border bg-page"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <summary
                className="flex justify-between items-center font-medium cursor-pointer"
                style={{ color: "var(--bg-dark)" }}
              >
                <span>{pickLocale(item.question, locale)}</span>
                <span className="faq-icon text-2xl text-accent font-light">
                  +
                </span>
              </summary>
              <div className="mt-4 text-sm leading-relaxed text-dark whitespace-pre-line">
                {pickLocale(item.answer, locale)}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
