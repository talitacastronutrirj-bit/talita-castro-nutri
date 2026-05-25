import { getTranslations } from "next-intl/server";
import { site, resolveSiteData } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";
import WhatsAppCTA from "./WhatsAppCTA";

export default async function Contato() {
  const [t, settings] = await Promise.all([
    getTranslations(),
    getSiteSettings(),
  ]);
  const siteData = resolveSiteData(settings);

  if (!siteData.email && !siteData.primaryWhatsapp.number && site.offices.length === 0) {
    return null;
  }

  return (
    <section
      id="contato"
      className="py-16 md:py-24 bg-dark text-light relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
            {t("nav.contact")}
          </div>
          <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
            {t("nav.contact")}
          </h2>
        </div>

        {site.offices.length > 0 && (
          <div
            className={`grid gap-6 mb-10 mx-auto ${
              site.offices.length === 1
                ? "md:grid-cols-1 max-w-md"
                : site.offices.length === 2
                  ? "md:grid-cols-2 max-w-3xl"
                  : "md:grid-cols-3 max-w-5xl"
            }`}
          >
            {site.offices.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl p-7 border bg-dark-2"
                style={{ borderColor: "var(--border-soft-dark)" }}
              >
                <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">
                  {o.city} · {o.state}
                </div>
                <h3 className="font-serif text-2xl mb-4">{o.city}</h3>
                <div className="space-y-2 text-sm text-light-soft mb-6">
                  <div>{o.address}</div>
                  <div>
                    {o.neighborhood} · {o.city} · {o.state}
                  </div>
                </div>
                <WhatsAppCTA
                  office={o.id}
                  primaryWhatsapp={siteData.primaryWhatsapp}
                  siteName={siteData.name}
                  className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full font-semibold text-sm w-full justify-center"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20z" />
                  </svg>
                  {t("cta.whatsappShort")} · {o.whatsapp.display}
                </WhatsAppCTA>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          {siteData.primaryWhatsapp.number && (
            <WhatsAppCTA
              primaryWhatsapp={siteData.primaryWhatsapp}
              siteName={siteData.name}
              className="inline-flex items-center gap-2 btn-primary px-7 py-4 rounded-full font-semibold"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20z" />
              </svg>
              {t("cta.whatsappShort")} · {siteData.primaryWhatsapp.display}
            </WhatsAppCTA>
          )}
          {siteData.email && (
            <a
              href={`mailto:${siteData.email}`}
              className="inline-flex items-center gap-2 btn-outline-light px-7 py-4 rounded-full font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {siteData.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
