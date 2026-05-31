import { Fragment } from "react";
import { getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { pickLocale, type Locale } from "@/i18n/config";
import { CountryFlag, flagCodeFromEmoji } from "./CountryFlag";

// Detecta se o valor contém emojis (bandeiras, símbolos, ícones). Quando
// tem, renderizamos com tamanho maior e mais respiro.
const EMOJI_RE =
  /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

// Captura sequências de 2 Regional Indicators = uma bandeira Unicode
const FLAG_RE = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

function hasEmoji(s: string): boolean {
  try {
    return EMOJI_RE.test(s);
  } catch {
    return false;
  }
}

/**
 * Renderiza o valor, substituindo bandeiras Unicode (🇧🇷 🇺🇸 🇮🇹) por
 * SVGs inline (CountryFlag). Mantém texto puro e outros emojis no lugar.
 * Necessário porque Windows não renderiza emojis de bandeira nativamente.
 */
function renderValueWithFlags(value: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const matches = [...value.matchAll(FLAG_RE)];
  for (const match of matches) {
    const idx = match.index ?? 0;
    // Texto antes da bandeira
    if (idx > lastIndex) {
      parts.push(
        <Fragment key={key++}>{value.slice(lastIndex, idx)}</Fragment>
      );
    }
    const code = flagCodeFromEmoji(match[0]);
    if (code) {
      parts.push(
        <CountryFlag
          key={key++}
          code={code}
          className="inline-block w-8 h-6 align-middle mx-0.5"
          title={code}
        />
      );
    } else {
      parts.push(<Fragment key={key++}>{match[0]}</Fragment>);
    }
    lastIndex = idx + match[0].length;
  }
  // Texto depois da última bandeira
  if (lastIndex < value.length) {
    parts.push(<Fragment key={key++}>{value.slice(lastIndex)}</Fragment>);
  }

  return parts.length > 0 ? parts : value;
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
                    ? "font-serif text-xl md:text-2xl tracking-wide leading-tight flex items-center justify-center gap-1"
                    : "font-serif text-lg"
                }
              >
                {renderValueWithFlags(item.value)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
