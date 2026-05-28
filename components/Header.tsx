import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { resolveSiteData } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import { getActiveTeam } from "@/lib/team";
import WhatsAppCTA from "./WhatsAppCTA";
import LanguageSwitcher from "./LanguageSwitcher";

export default async function Header() {
  const [t, settings, team] = await Promise.all([
    getTranslations(),
    getSiteSettings(),
    getActiveTeam(),
  ]);
  const siteData = resolveSiteData(settings);
  // Profissional autônomo (1 membro + layout solo) → menu mostra
  // "Profissional" em vez de "Equipe"
  const isSolo = team.length === 1 && settings.teamSoloLayout !== "team";
  const teamLabel = isSolo ? t("nav.professional") : t("nav.team");

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur border-b"
      style={{
        background: "rgba(251, 248, 243, 0.9)",
        borderColor: "var(--border-soft)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src={siteData.logoUrl}
            alt={siteData.name}
            width={180}
            height={72}
            priority
            className="h-16 w-auto"
            style={{
              filter: "drop-shadow(0 0 2px rgba(12,31,61,0.25))",
            }}
            unoptimized={siteData.logoUrl.startsWith("https://res.cloudinary.com")}
          />
        </Link>

        <nav
          className="hidden md:flex items-center gap-8 text-sm"
          style={{ color: "var(--text-dark)" }}
        >
          <Link href="/#areas" className="hover:opacity-70">
            {t("nav.services")}
          </Link>
          <Link href="/#equipe" className="hover:opacity-70">
            {teamLabel}
          </Link>
          <Link href="/#faq" className="hover:opacity-70">
            {t("nav.faq")}
          </Link>
          <Link href="/artigos" className="hover:opacity-70">
            {t("nav.articles")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <WhatsAppCTA
            primaryWhatsapp={siteData.primaryWhatsapp}
            siteName={siteData.name}
            className="hidden md:inline-flex items-center gap-2 btn-dark px-4 py-2 rounded-full text-sm font-medium"
          >
            {t("cta.talkNow")}
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
    </header>
  );
}
