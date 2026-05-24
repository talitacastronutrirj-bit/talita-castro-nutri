import { getLocale, getTranslations } from "next-intl/server";
import { getActiveAreas } from "@/lib/practice-areas";
import { PracticeAreaIcon } from "@/lib/practice-area-icons";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function Areas() {
  const [areas, locale, t] = await Promise.all([
    getActiveAreas(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (areas.length === 0) return null;

  return (
    <section id="areas" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.services")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.services")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) =>
            area.highlighted ? (
              <article
                key={area.id}
                className="card-hover bg-dark text-light rounded-2xl p-8 relative overflow-hidden"
              >
                <div
                  className="w-12 h-12 rounded-full grid place-items-center mb-5"
                  style={{ background: "var(--accent)" }}
                >
                  <PracticeAreaIcon
                    iconKey={area.icon}
                    className="w-6 h-6"
                    stroke="var(--bg-dark)"
                  />
                </div>
                <h3 className="font-serif text-2xl mb-3">
                  {pickLocale(area.title, locale)}
                </h3>
                <p className="text-light-soft leading-relaxed text-sm mb-4">
                  {pickLocale(area.body, locale)}
                </p>
                <span className="inline-flex items-center gap-1 text-accent text-xs font-medium uppercase tracking-wider">
                  {t("labels.specialty")}
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
              </article>
            ) : (
              <article
                key={area.id}
                className="card-hover rounded-2xl p-8 border bg-page"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <div className="w-12 h-12 rounded-full bg-dark grid place-items-center mb-5">
                  <PracticeAreaIcon
                    iconKey={area.icon}
                    className="w-6 h-6 text-accent"
                  />
                </div>
                <h3
                  className="font-serif text-2xl mb-3"
                  style={{ color: "var(--bg-dark)" }}
                >
                  {pickLocale(area.title, locale)}
                </h3>
                <p className="leading-relaxed text-sm text-dark">
                  {pickLocale(area.body, locale)}
                </p>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
