// =================================================================
// CONFIG i18n DO TEMPLATE
// =================================================================
//
// Pra cada novo cliente baseado neste template:
// - Edita LOCALES (remove ou adiciona idiomas)
// - Edita DEFAULT_LOCALE (idioma de redirect quando ninguém indicou)
//
// O resto do código se adapta automaticamente.
//
// Mais tarde, quando tivermos config dinâmica do admin (idiomas
// habilitados via DB), esta lista vira o "máximo possível" e o admin
// escolhe um subconjunto.

export const LOCALES = ["pt", "en", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt";

// Pra UI strings em arquivos messages/*.json: localized = ALL locales.
// Pra conteúdo no DB: cada campo é {pt, en, it} mas pode ter strings
// vazias — o helper `pickLocale()` faz fallback pro DEFAULT_LOCALE.

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pega o valor de um campo multi-idioma {pt, en, it} no idioma atual,
 * com fallback pro idioma padrão e depois pro primeiro valor não-vazio.
 *
 * Uso:
 *   const heading = pickLocale(settings.hero_heading, "en");
 *   // → tenta `en`, depois `pt` (default), depois qualquer não-vazio
 */
export function pickLocale(
  field: Partial<Record<Locale, string | null | undefined>> | null | undefined,
  locale: Locale
): string {
  if (!field) return "";
  if (field[locale] && field[locale]!.trim().length > 0) return field[locale]!;
  if (field[DEFAULT_LOCALE] && field[DEFAULT_LOCALE]!.trim().length > 0) {
    return field[DEFAULT_LOCALE]!;
  }
  // Último fallback: primeiro valor não vazio
  for (const loc of LOCALES) {
    const v = field[loc];
    if (v && v.trim().length > 0) return v;
  }
  return "";
}
