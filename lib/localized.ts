// =================================================================
// LOCALIZED TEXT — tipo + utilities para conteúdo multi-idioma
// =================================================================
//
// Padrão do template:
// - Toda string visível ao usuário que é EDITÁVEL pelo cliente vira
//   um objeto `LocalizedText` com 1 chave por idioma suportado.
// - No banco, esses campos são JSONB.
// - Na UI, usar `pickLocale()` do `i18n/config.ts` pra obter o valor
//   correto pro idioma da request atual.

import { LOCALES, type Locale } from "@/i18n/config";

/**
 * Estrutura de campo de texto multi-idioma.
 * Todas as locales são opcionais — `pickLocale()` faz fallback.
 *
 * Exemplo de uso no DB (JSONB):
 *   { "pt": "Bem-vinda", "en": "Welcome", "it": "Benvenuti" }
 */
export type LocalizedText = Partial<Record<Locale, string>>;

/**
 * Cria um LocalizedText vazio (todas as locales = "").
 * Útil pra inicializar campos novos.
 */
export function emptyLocalized(): LocalizedText {
  return Object.fromEntries(LOCALES.map((l) => [l, ""])) as LocalizedText;
}

/**
 * Aceita várias formas de input e normaliza pra LocalizedText:
 * - undefined / null → vazio
 * - string (legacy) → {pt: string, en: "", it: ""}
 * - objeto parcial → preenche locales faltantes com ""
 * - objeto JSON string (vindo do DB) → parse + normaliza
 */
export function toLocalized(
  input: unknown,
  defaultLocale: Locale = "pt"
): LocalizedText {
  if (input == null) return emptyLocalized();

  // String → assume que é no idioma default (compat com dados legacy)
  if (typeof input === "string") {
    // Pode ser JSON serializado vindo de coluna TEXT
    const trimmed = input.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
      try {
        return toLocalized(JSON.parse(trimmed), defaultLocale);
      } catch {
        // Não era JSON válido — trata como texto puro
      }
    }
    const result = emptyLocalized();
    result[defaultLocale] = input;
    return result;
  }

  // Objeto
  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const result = emptyLocalized();
    for (const locale of LOCALES) {
      const v = obj[locale];
      if (typeof v === "string") result[locale] = v;
    }
    return result;
  }

  return emptyLocalized();
}

/**
 * Retorna true se TODOS os valores forem vazios.
 */
export function isLocalizedEmpty(field: LocalizedText | null | undefined): boolean {
  if (!field) return true;
  return LOCALES.every((l) => !field[l] || field[l]!.trim().length === 0);
}

/**
 * Helper pra ler FormData do admin com campos multi-idioma.
 * Convenção: o form envia campos nomeados `<name>__<locale>`
 * (ex: heroHeading__pt, heroHeading__en, heroHeading__it).
 */
export function readLocalizedFromFormData(
  formData: FormData,
  fieldName: string
): LocalizedText {
  const result = emptyLocalized();
  for (const locale of LOCALES) {
    const value = formData.get(`${fieldName}__${locale}`);
    if (typeof value === "string") {
      result[locale] = value.trim();
    }
  }
  return result;
}
