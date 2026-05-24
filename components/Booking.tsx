import { getTranslations } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import WhatsAppCTA from "./WhatsAppCTA";

// =================================================================
// BOOKING — seção de agendamento configurável
// =================================================================
//
// Lê settings.bookingMode + settings.calendlyUrl pra decidir o layout:
// - whatsapp: bloco grande com botão WhatsApp (modal de seleção
//             de unidade se múltiplas offices)
// - calendly: embed inline do Calendly
// - both:     coluna esquerda Calendly + coluna direita WhatsApp
//
// Se mode = calendly/both mas calendlyUrl vazio, fallback pra
// whatsapp apenas. Se não tem WhatsApp também, esconde a seção.

export default async function Booking() {
  const [settings, t] = await Promise.all([
    getSiteSettings(),
    getTranslations(),
  ]);

  const wantsCalendly =
    settings.bookingMode === "calendly" || settings.bookingMode === "both";
  const hasCalendly = wantsCalendly && Boolean(settings.calendlyUrl?.trim());

  const wantsWhatsApp =
    settings.bookingMode === "whatsapp" ||
    settings.bookingMode === "both" ||
    !hasCalendly;

  const hasWhatsApp =
    wantsWhatsApp &&
    (site.offices.length > 0 || Boolean(site.primaryWhatsapp.number));

  if (!hasCalendly && !hasWhatsApp) return null;

  const showBoth = hasCalendly && hasWhatsApp && settings.bookingMode === "both";

  return (
    <section
      id="agendar"
      className="py-16 md:py-24 bg-page"
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("cta.schedule")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("cta.schedule")}
          </h2>
          <div className="gold-rule w-24 mx-auto" />
        </div>

        <div
          className={`grid gap-6 ${showBoth ? "md:grid-cols-2" : "max-w-2xl mx-auto"}`}
        >
          {hasCalendly && (
            <div
              className="rounded-2xl border bg-page p-2 overflow-hidden"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {/* Embed do Calendly via iframe. O Calendly entrega responsivo
                  por padrão. height fixo é o mínimo recomendado pelo Calendly. */}
              <iframe
                src={settings.calendlyUrl}
                width="100%"
                height="640"
                frameBorder="0"
                title="Calendly"
                className="rounded-xl"
              />
            </div>
          )}

          {hasWhatsApp && (
            <div
              className={`rounded-2xl p-8 bg-dark text-light flex flex-col items-center justify-center text-center ${
                showBoth ? "" : "min-h-[200px]"
              }`}
            >
              <div className="mb-3">
                <svg className="w-12 h-12 text-accent" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-2">{t("cta.whatsapp")}</h3>
              <p className="text-sm text-light-soft mb-6">
                {site.name}
              </p>
              <WhatsAppCTA className="inline-flex items-center gap-2 btn-primary px-6 py-3 rounded-full font-semibold">
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
          )}
        </div>
      </div>
    </section>
  );
}
