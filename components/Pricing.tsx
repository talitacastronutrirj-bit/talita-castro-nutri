import { getLocale, getTranslations } from "next-intl/server";
import { getActivePricingPlans, formatPrice } from "@/lib/pricing";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function Pricing() {
  const [plans, locale, t] = await Promise.all([
    getActivePricingPlans(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (plans.length === 0) return null;

  return (
    <section id="precos" className="py-16 md:py-24 bg-page">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.pricing")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.pricing")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div
          className={`grid gap-6 mx-auto items-start ${
            plans.length === 1
              ? "max-w-md"
              : plans.length === 2
                ? "md:grid-cols-2 max-w-4xl"
                : "md:grid-cols-3 max-w-6xl"
          }`}
        >
          {plans.map((plan) => {
            const featuresText = pickLocale(plan.features, locale);
            const featuresList = featuresText
              .split("\n")
              .map((l) => l.trim())
              .filter((l) => l.length > 0);

            return (
              <article
                key={plan.id}
                className={`rounded-2xl border bg-page p-7 flex flex-col h-full transition-all ${
                  plan.isFeatured
                    ? "ring-2 shadow-2xl md:scale-[1.03]"
                    : "shadow-sm"
                }`}
                style={{
                  borderColor: plan.isFeatured
                    ? "var(--accent)"
                    : "var(--border-soft)",
                  ...(plan.isFeatured && {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    "--tw-ring-color": "var(--accent)" as unknown,
                  } as React.CSSProperties),
                }}
              >
                {plan.isFeatured && (
                  <span
                    className="self-start mb-4 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--accent)",
                      color: "var(--bg-dark)",
                    }}
                  >
                    ★ Recomendado
                  </span>
                )}

                <h3
                  className="font-serif text-2xl mb-2"
                  style={{ color: "var(--bg-dark)" }}
                >
                  {pickLocale(plan.name, locale)}
                </h3>

                <p
                  className="text-sm text-dark mb-5 leading-relaxed"
                  style={{ opacity: 0.75 }}
                >
                  {pickLocale(plan.description, locale)}
                </p>

                <div className="mb-6">
                  <div
                    className="font-serif text-4xl font-semibold"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {formatPrice(plan.price, plan.currency, locale)}
                  </div>
                  {pickLocale(plan.priceSuffix, locale) && (
                    <div
                      className="text-xs text-dark mt-1"
                      style={{ opacity: 0.65 }}
                    >
                      {pickLocale(plan.priceSuffix, locale)}
                    </div>
                  )}
                </div>

                {featuresList.length > 0 && (
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {featuresList.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-dark"
                      >
                        <span
                          className="mt-1 grid place-items-center w-4 h-4 rounded-full shrink-0"
                          style={{
                            background: "rgba(201, 169, 97, 0.18)",
                          }}
                        >
                          <svg
                            className="w-2.5 h-2.5 text-accent"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="leading-relaxed">
                          {feat.replace(/^[•\-*]\s*/, "")}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {plan.ctaLink && (
                  <a
                    href={plan.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-center px-5 py-3 rounded-full font-semibold text-sm transition-colors ${
                      plan.isFeatured
                        ? "btn-primary"
                        : "btn-outline-dark"
                    }`}
                  >
                    {pickLocale(plan.ctaText, locale) || t("cta.schedule")}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
