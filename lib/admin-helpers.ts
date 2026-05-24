/**
 * Helpers compartilhados pelas server actions do admin.
 */

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Estima tempo de leitura em minutos (200 palavras/min, mínimo 1).
 * Retorna no formato "X min".
 */
export function estimateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

/**
 * Computa iniciais a partir do nome (2 letras).
 */
export function computeInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((p) => p.length > 0);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Parse linhas em array (uma por linha, trim, sem vazias).
 */
export function parseLines(input: string): string[] {
  return input
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}
