// =================================================================
// HowItWorks — seção pública "Como funciona"
// =================================================================
//
// Renderiza 3-5 cards de etapas do atendimento. Auto-esconde quando
// não há nenhum step cadastrado (segue padrão das outras seções).
//
// Grid responsivo:
// - 1 step: 1 col centralizada
// - 2 steps: 2 cols
// - 3 steps: 3 cols
// - 4+ steps: 2 cols (sm) / 4 cols (lg)

import { getLocale, getTranslations } from "next-intl/server";
import { getActiveHowItWorks, type HowItWorksIcon } from "@/lib/how-it-works";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function HowItWorks() {
  const [steps, locale, t] = await Promise.all([
    getActiveHowItWorks(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);

  if (steps.length === 0) return null;

  const cols =
    steps.length === 1
      ? "md:grid-cols-1 max-w-md mx-auto"
      : steps.length === 2
        ? "md:grid-cols-2 max-w-3xl mx-auto"
        : steps.length === 3
          ? "md:grid-cols-3"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="como-funciona" className="py-16 md:py-24 bg-page">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.howItWorks")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("headings.howItWorksTitle")}
          </h2>
          <div className="gold-rule w-24 mx-auto mb-3" />
        </div>

        <div className={`grid gap-6 ${cols}`}>
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative rounded-2xl border p-6 bg-page-2 transition hover:shadow-lg"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {/* Número da etapa */}
              <div
                className="absolute -top-3 -left-3 w-9 h-9 rounded-full grid place-items-center font-serif text-sm font-semibold border-2 bg-page"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </div>

              {/* Ícone */}
              <div
                className="w-12 h-12 rounded-full grid place-items-center mb-4"
                style={{ background: "var(--accent)" }}
              >
                <StepIcon
                  iconKey={step.iconKey}
                  className="w-6 h-6"
                  stroke="var(--bg-dark)"
                />
              </div>

              <h3
                className="font-serif text-lg font-semibold mb-2 leading-tight"
                style={{ color: "var(--bg-dark)" }}
              >
                {pickLocale(step.title, locale)}
              </h3>

              <p className="text-sm leading-relaxed text-dark whitespace-pre-line">
                {pickLocale(step.description, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============== Ícones SVG inline ==============
// Mantém sincronizado com HOW_IT_WORKS_ICONS em lib/how-it-works.ts

type IconProps = {
  iconKey: HowItWorksIcon;
  className?: string;
  stroke?: string;
};

export function StepIcon({ iconKey, className = "w-6 h-6", stroke = "currentColor" }: IconProps) {
  const common = {
    className,
    fill: "none",
    stroke,
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24",
  };

  switch (iconKey) {
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );
    case "videoCall":
      return (
        <svg {...common}>
          <rect x="2" y="6" width="14" height="12" rx="2" />
          <path d="M22 8l-6 4 6 4V8z" />
        </svg>
      );
    case "document":
      return (
        <svg {...common}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M9 13h6M9 17h6" />
        </svg>
      );
    case "chat":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.4 8.4 0 01-3.8-.9L3 21l1.9-5.1a8.4 8.4 0 1116 .6z" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
        </svg>
      );
    case "heart":
      return (
        <svg {...common}>
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
      );
    case "checkList":
      return (
        <svg {...common}>
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      );
    case "creditCard":
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "shoppingBag":
      return (
        <svg {...common}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 11-8 0" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
