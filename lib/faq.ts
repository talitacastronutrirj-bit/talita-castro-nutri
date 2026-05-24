// =================================================================
// FAQ — CRUD multi-idioma de perguntas frequentes
// =================================================================

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

export type FaqItem = {
  id: number;
  question: LocalizedText;
  answer: LocalizedText;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  question: unknown;
  answer: unknown;
  display_order: number;
  is_active: boolean;
};

function toItem(r: DbRow): FaqItem {
  return {
    id: r.id,
    question: toLocalized(r.question),
    answer: toLocalized(r.answer),
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveFaq(): Promise<FaqItem[]> {
  try {
    const rows = (await sql`
      SELECT id, question, answer, display_order, is_active
      FROM faq_items
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toItem);
  } catch (err) {
    console.warn("[faq] DB inacessível:", err);
    return [];
  }
}

export async function getAllFaq(): Promise<FaqItem[]> {
  const rows = (await sql`
    SELECT id, question, answer, display_order, is_active
    FROM faq_items
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toItem);
}

export async function getFaqItemById(id: number): Promise<FaqItem | null> {
  const rows = (await sql`
    SELECT id, question, answer, display_order, is_active
    FROM faq_items
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toItem(rows[0]);
}

export type FaqItemInput = {
  question: LocalizedText;
  answer: LocalizedText;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createFaqItem(input: FaqItemInput): Promise<number> {
  const rows = (await sql`
    INSERT INTO faq_items
      (question, answer, display_order, is_active)
    VALUES (
      ${JSON.stringify(input.question)}::jsonb,
      ${JSON.stringify(input.answer)}::jsonb,
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateFaqItem(
  id: number,
  input: FaqItemInput
): Promise<void> {
  await sql`
    UPDATE faq_items
    SET
      question      = ${JSON.stringify(input.question)}::jsonb,
      answer        = ${JSON.stringify(input.answer)}::jsonb,
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteFaqItem(id: number): Promise<void> {
  await sql`DELETE FROM faq_items WHERE id = ${id}`;
}
