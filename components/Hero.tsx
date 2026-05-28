import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import WhatsAppCTA from "./WhatsAppCTA";
import OrganicDecor from "./OrganicDecor";
import { getSiteSettings, PASTEL_PALETTES } from "@/lib/settings";
import { renderHeroHeading } from "@/lib/hero-text";
import { resolveSiteData } from "@/lib/site";
import { pickLocale, type Locale } from "@/i18n/config";

export default async function Hero() {
  const [settings, locale, t] = await Promise.all([
    getSiteSettings(),
    getLocale() as Promise<Locale>,
    getTranslations(),
  ]);
  const siteData = resolveSiteData(settings);
  const useImage = settings.heroMode === "image" && settings.heroImageUrl;

  // Background custom sobrescreve a foto default do .hero-grad. Mas em
  // paletas pastel, o CSS força gradient da paleta — não devemos sobrepor
  // a foto via style inline (style inline ganha de CSS).
  const isPastel = PASTEL_PALETTES.includes(settings.palette);
  const heroBgStyle =
    !isPastel && settings.heroBackgroundUrl
      ? { backgroundImage: `url("${settings.heroBackgroundUrl}")` }
      : undefined;

  return (
    <section className="hero-grad text-light relative" style={heroBgStyle}>
      <OrganicDecor variant="hero" />
      <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-12 gap-10 items-center" style={{ zIndex: 2 }}>
        <div className="md:col-span-7">
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.3em] mb-5 text-accent-bright"
            style={{
              textShadow:
                "0 1px 2px rgba(0,0,0,0.95), 0 2px 6px rgba(0,0,0,0.85), 0 4px 14px rgba(0,0,0,0.7)",
            }}
          >
            {pickLocale(settings.heroEyebrow, locale)}
          </div>
          <h1
            className="font-serif font-semibold text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-5"
            style={{
              textShadow:
                "0 1px 2px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.55)",
            }}
          >
            {renderHeroHeading(pickLocale(settings.heroHeading, locale))}
          </h1>
          <p
            className="text-base md:text-lg font-medium text-light max-w-xl mb-8 leading-relaxed whitespace-pre-line"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
          >
            {pickLocale(settings.heroDescription, locale)}
          </p>
          <div className="flex flex-wrap gap-4">
            <WhatsAppCTA
              primaryWhatsapp={siteData.primaryWhatsapp}
              siteName={siteData.name}
              className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full font-semibold"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20z" />
              </svg>
              {t("cta.whatsappShort")}
            </WhatsAppCTA>
            <a
              href="#areas"
              className="inline-flex items-center gap-2 btn-outline-light px-6 py-3 rounded-full font-medium"
            >
              {t("cta.knowMore")}
            </a>
          </div>
        </div>

        <div className="md:col-span-5 hidden md:block">
          <div
            className="aspect-[4/5] rounded-2xl overflow-hidden border shadow-2xl relative"
            style={{
              // Border neutra (não derivada do accent) pra não brigar com
              // accents fortes (vermelho, neon, etc). Em pastel: claro
              // translúcido. Em institucional: dourado tradicional do
              // accent (que ali é sutil dourado, não brigaria).
              borderColor: isPastel
                ? "rgba(255, 255, 255, 0.4)"
                : "var(--accent)",
              borderWidth: isPastel ? "2px" : "1px",
              background: useImage
                ? "transparent"
                : resolveCardBackground(settings.heroCardBackground),
              boxShadow: isPastel
                ? "0 20px 50px -15px rgba(0,0,0,0.35), 0 8px 20px -10px rgba(0,0,0,0.2)"
                : undefined,
            }}
          >
            {useImage ? (
              <Image
                src={settings.heroImageUrl}
                alt={siteData.name}
                fill
                sizes="(max-width: 768px) 0px, 40vw"
                priority
                className="object-cover"
                unoptimized={settings.heroImageUrl.startsWith("https://res.cloudinary.com")}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-12">
                <Image
                  src={siteData.logoUrl}
                  alt={siteData.name}
                  width={280}
                  height={280}
                  priority
                  className="hero-logo w-full h-auto max-w-[280px]"
                  style={{
                    filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.4))",
                    animation: buildAnimation(
                      settings.heroLogoEntrance,
                      settings.heroLogoIdle
                    ),
                  }}
                  unoptimized={siteData.logoUrl.startsWith("https://res.cloudinary.com")}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Resolve heroCardBackground setting:
// - ""        (default) → cor escura da paleta (--bg-dark-tint)
// - "page"             → fundo claro do site (--bg-page)
// - "accent"           → cor de destaque da paleta (--accent-tint)
// - "#rrggbb"          → hex livre escolhido pelo cliente
function resolveCardBackground(value: string): string {
  if (value === "page") return "var(--bg-page)";
  if (value === "accent") return "var(--accent-tint)";
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return "var(--bg-dark-tint)";
}

function buildAnimation(
  entrance: string,
  idle: string
): string | undefined {
  const ENTRANCE: Record<
    string,
    { name: string; duration: string; easing: string }
  > = {
    fade: { name: "heroLogoFade", duration: "1.6s", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    slide: { name: "heroLogoSlide", duration: "1.6s", easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    zoom: { name: "heroLogoZoom", duration: "1.5s", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" },
    rotate: { name: "heroLogoRotate", duration: "1.8s", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
    spin: { name: "heroLogoSpin", duration: "2.4s", easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
  };
  const IDLE: Record<string, { name: string; duration: string; easing: string }> = {
    float: { name: "heroLogoFloat", duration: "5s", easing: "ease-in-out" },
    pulse: { name: "heroLogoPulse", duration: "4s", easing: "ease-in-out" },
    slowrotate: { name: "heroLogoSlowRotate", duration: "40s", easing: "linear" },
  };

  const parts: string[] = [];
  const e = ENTRANCE[entrance];
  const i = IDLE[idle];

  if (e) parts.push(`${e.name} ${e.duration} ${e.easing} 0.25s 1 both`);
  if (i) {
    const delay = e ? `${parseFloat(e.duration) + 0.5}s` : "0s";
    parts.push(`${i.name} ${i.duration} ${i.easing} ${delay} infinite`);
  }
  return parts.length > 0 ? parts.join(", ") : undefined;
}
