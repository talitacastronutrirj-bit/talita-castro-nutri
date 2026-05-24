// =================================================================
// PRACTICE AREAS — CRUD multi-idioma de "áreas de atuação"
// =================================================================
//
// title e body são LocalizedText ({pt, en, it}). No DB ficam como
// JSONB. O Neon driver retorna JSONB direto como objeto JS.

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

export type PracticeArea = {
  id: number;
  title: LocalizedText;
  body: LocalizedText;
  icon: string;
  highlighted: boolean;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  title: unknown; // JSONB do Neon vem como objeto, mas tipamos solto
  body: unknown;
  icon: string;
  highlighted: boolean;
  display_order: number;
  is_active: boolean;
};

function toArea(r: DbRow): PracticeArea {
  return {
    id: r.id,
    title: toLocalized(r.title),
    body: toLocalized(r.body),
    icon: r.icon,
    highlighted: r.highlighted,
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveAreas(): Promise<PracticeArea[]> {
  try {
    const rows = (await sql`
      SELECT id, title, body, icon, highlighted, display_order, is_active
      FROM practice_areas
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toArea);
  } catch (err) {
    console.error("[practice-areas] erro lendo DB:", err);
    return [];
  }
}

export async function getAllAreas(): Promise<PracticeArea[]> {
  const rows = (await sql`
    SELECT id, title, body, icon, highlighted, display_order, is_active
    FROM practice_areas
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toArea);
}

export async function getAreaById(id: number): Promise<PracticeArea | null> {
  const rows = (await sql`
    SELECT id, title, body, icon, highlighted, display_order, is_active
    FROM practice_areas
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toArea(rows[0]);
}

export type PracticeAreaInput = {
  title: LocalizedText;
  body: LocalizedText;
  icon: string;
  highlighted?: boolean;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createArea(input: PracticeAreaInput): Promise<number> {
  // JSONB no Neon: passamos objeto JS direto, driver serializa
  const rows = (await sql`
    INSERT INTO practice_areas
      (title, body, icon, highlighted, display_order, is_active)
    VALUES (
      ${JSON.stringify(input.title)}::jsonb,
      ${JSON.stringify(input.body)}::jsonb,
      ${input.icon},
      ${input.highlighted ?? false},
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateArea(
  id: number,
  input: PracticeAreaInput
): Promise<void> {
  await sql`
    UPDATE practice_areas
    SET
      title         = ${JSON.stringify(input.title)}::jsonb,
      body          = ${JSON.stringify(input.body)}::jsonb,
      icon          = ${input.icon},
      highlighted   = ${input.highlighted ?? false},
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteArea(id: number): Promise<void> {
  await sql`DELETE FROM practice_areas WHERE id = ${id}`;
}
