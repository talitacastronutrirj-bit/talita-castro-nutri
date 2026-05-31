// =================================================================
// How It Works — CRUD das etapas do atendimento
// =================================================================
//
// Etapas explicando o fluxo de atendimento. Cada etapa tem ícone
// (escolhido entre opções predefinidas), título e descrição em
// PT/EN/IT. Útil pra deixar claro como funciona — especialmente em
// atendimento online/internacional.

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

// Ícones disponíveis pras etapas. Renderizados em SVG inline no
// componente público — manter a lista sincronizada lá.
export const HOW_IT_WORKS_ICONS = [
  "calendar",      // Agendamento
  "videoCall",     // Consulta online
  "document",      // Plano / PDF
  "chat",          // Acompanhamento WhatsApp
  "globe",         // Internacional / qualquer país
  "heart",         // Cuidado contínuo
  "checkList",     // Avaliação / anamnese
  "creditCard",    // Pagamento
  "clock",         // Fuso horário
  "shoppingBag",   // Lista de compras
] as const;

export type HowItWorksIcon = (typeof HOW_IT_WORKS_ICONS)[number];

export function isValidIcon(s: string): s is HowItWorksIcon {
  return (HOW_IT_WORKS_ICONS as readonly string[]).includes(s);
}

export type HowItWorksStep = {
  id: number;
  iconKey: HowItWorksIcon;
  title: LocalizedText;
  description: LocalizedText;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  icon_key: string;
  title: unknown;
  description: unknown;
  display_order: number;
  is_active: boolean;
};

function toStep(r: DbRow): HowItWorksStep {
  return {
    id: r.id,
    iconKey: isValidIcon(r.icon_key) ? r.icon_key : "calendar",
    title: toLocalized(r.title),
    description: toLocalized(r.description),
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveHowItWorks(): Promise<HowItWorksStep[]> {
  try {
    const rows = (await sql`
      SELECT id, icon_key, title, description, display_order, is_active
      FROM how_it_works_steps
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toStep);
  } catch (err) {
    console.warn("[how-it-works] DB inacessível:", err);
    return [];
  }
}

export async function getAllHowItWorks(): Promise<HowItWorksStep[]> {
  const rows = (await sql`
    SELECT id, icon_key, title, description, display_order, is_active
    FROM how_it_works_steps
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toStep);
}

export async function getHowItWorksById(
  id: number
): Promise<HowItWorksStep | null> {
  const rows = (await sql`
    SELECT id, icon_key, title, description, display_order, is_active
    FROM how_it_works_steps
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toStep(rows[0]);
}

export type HowItWorksInput = {
  iconKey: HowItWorksIcon;
  title: LocalizedText;
  description: LocalizedText;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createHowItWorks(
  input: HowItWorksInput
): Promise<number> {
  const rows = (await sql`
    INSERT INTO how_it_works_steps
      (icon_key, title, description, display_order, is_active)
    VALUES (
      ${input.iconKey},
      ${JSON.stringify(input.title)}::jsonb,
      ${JSON.stringify(input.description)}::jsonb,
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateHowItWorks(
  id: number,
  input: HowItWorksInput
): Promise<void> {
  await sql`
    UPDATE how_it_works_steps
    SET
      icon_key      = ${input.iconKey},
      title         = ${JSON.stringify(input.title)}::jsonb,
      description   = ${JSON.stringify(input.description)}::jsonb,
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteHowItWorks(id: number): Promise<void> {
  await sql`DELETE FROM how_it_works_steps WHERE id = ${id}`;
}
