import { getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { pickLocale, type Locale } from "@/i18n/config";

// Detecta se o valor contém emojis (bandeiras, símbolos, ícones). Quando
// tem, renderizamos com tamanho maior e mais respiro — fica visualmente
// forte. Útil pra trust bar de "🇧🇷 🇺🇸 🇮🇹" tipo "países atendidos".
const EMOJI_RE =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

function hasEmoji(s: string): boolean {
  try {
    return EMOJI_RE.test(s);
  } catch {
    return false;
  }
}

export default async function TrustBar() {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getLocale() as Promise<Locale>,
  ]);

  const items = [
    {
      label: pickLocale(settings.trustBar1Label, locale),
      value: pickLocale(settings.trustBar1Value, locale),
    },
    {
      label: pickLocale(settings.trustBar2Label, locale),
      value: pickLocale(settings.trustBar2Value, locale),
    },
    {
      label: pickLocale(settings.trustBar3Label, locale),
      value: pickLocale(settings.trustBar3Value, locale),
    },
    {
      label: pickLocale(settings.trustBar4Label, locale),
      value: pickLocale(settings.trustBar4Value, locale),
    },
  ].filter((item) => item.value && item.value.trim().length > 0);

  if (items.length === 0) return null;

  return (
    <section
      className="bg-darkest text-light border-t"
      style={{ borderColor: "rgba(201, 169, 97, 0.2)" }}
    >
      <div
        className={`max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 ${
          items.length === 3
            ? "md:grid-cols-3"
            : items.length === 2
              ? "md:grid-cols-2"
              : items.length === 1
                ? "md:grid-cols-1"
                : "md:grid-cols-4"
        } gap-6 text-center`}
      >
        {items.map((item, idx) => {
          const valueHasEmoji = hasEmoji(item.value);
          return (
            <div key={idx}>
              <div className="text-xs uppercase tracking-widest text-accent mb-1">
                {item.label}
              </div>
              <div
                className={
                  valueHasEmoji
                    ? "font-serif text-2xl md:text-3xl tracking-wide leading-tight"
                    : "font-serif text-lg"
                }
                style={
                  valueHasEmoji
                    ? { letterSpacing: "0.15em" }
                    : undefined
                }
              >
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
