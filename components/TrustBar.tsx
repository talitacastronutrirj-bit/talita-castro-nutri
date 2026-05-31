// =================================================================
// TrustBar — banner rotativo (server wrapper)
// =================================================================
//
// Server component: busca os 4 itens das settings, pré-renderiza os
// valores (com bandeiras SVG quando necessário) e passa pro
// TrustBarSlider (client) que faz auto-play/bullets/animação.

import { Fragment, type ReactNode } from "react";
import { getLocale } from "next-intl/server";
import { getSiteSettings } from "@/lib/settings";
import { pickLocale, type Locale } from "@/i18n/config";
import { CountryFlag, flagCodeFromEmoji } from "./CountryFlag";
import TrustBarSlider, { type TrustBarItem } from "./TrustBarSlider";
import TrustBarHover from "./TrustBarHover";

// Captura sequências de 2 Regional Indicators = uma bandeira Unicode
const FLAG_RE = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;

/**
 * Renderiza o valor substituindo bandeiras Unicode por SVGs inline.
 * Roda no server — gera ReactNode pré-construído que o slider exibe.
 */
function renderValueWithFlags(value: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  const matches = [...value.matchAll(FLAG_RE)];
  for (const match of matches) {
    const idx = match.index ?? 0;
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
          className="inline-block w-12 h-8 md:w-16 md:h-10 align-middle mx-1"
          title={code}
        />
      );
    } else {
      parts.push(<Fragment key={key++}>{match[0]}</Fragment>);
    }
    lastIndex = idx + match[0].length;
  }
  if (lastIndex < value.length) {
    parts.push(<Fragment key={key++}>{value.slice(lastIndex)}</Fragment>);
  }

  return parts.length > 0 ? <>{parts}</> : <>{value}</>;
}

export default async function TrustBar() {
  const [settings, locale] = await Promise.all([
    getSiteSettings(),
    getLocale() as Promise<Locale>,
  ]);

  const raw = [
    {
      label: pickLocale(settings.trustBar1Label, locale),
      value: pickLocale(settings.trustBar1Value, locale),
      description: pickLocale(settings.trustBar1Description, locale),
    },
    {
      label: pickLocale(settings.trustBar2Label, locale),
      value: pickLocale(settings.trustBar2Value, locale),
      description: pickLocale(settings.trustBar2Description, locale),
    },
    {
      label: pickLocale(settings.trustBar3Label, locale),
      value: pickLocale(settings.trustBar3Value, locale),
      description: pickLocale(settings.trustBar3Description, locale),
    },
    {
      label: pickLocale(settings.trustBar4Label, locale),
      value: pickLocale(settings.trustBar4Value, locale),
      description: pickLocale(settings.trustBar4Description, locale),
    },
  ];

  const items: TrustBarItem[] = raw
    .filter((it) => it.value && it.value.trim().length > 0)
    .map((it) => ({
      ...it,
      valueNode: renderValueWithFlags(it.value),
    }));

  if (items.length === 0) return null;

  // Cliente escolhe modo em /admin/aparencia → Banner rotativo:
  // - "slider": carrossel automático (1 destaque por vez, 5s)
  // - "hover":  4 colunas que expandem no hover/touch
  if (settings.trustBarMode === "hover") {
    return <TrustBarHover items={items} />;
  }
  return <TrustBarSlider items={items} />;
}
