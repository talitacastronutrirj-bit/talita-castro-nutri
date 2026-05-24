// =================================================================
// TESTIMONIALS — CRUD multi-idioma
// =================================================================

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

export type Testimonial = {
  id: number;
  authorName: string;
  authorRole: string | null;
  photoUrl: string | null;
  quote: LocalizedText;
  rating: number | null;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  author_name: string;
  author_role: string | null;
  photo_url: string | null;
  quote: unknown;
  rating: number | null;
  display_order: number;
  is_active: boolean;
};

function toTestimonial(r: DbRow): Testimonial {
  return {
    id: r.id,
    authorName: r.author_name,
    authorRole: r.author_role,
    photoUrl: r.photo_url,
    quote: toLocalized(r.quote),
    rating: r.rating,
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  try {
    const rows = (await sql`
      SELECT id, author_name, author_role, photo_url, quote, rating,
             display_order, is_active
      FROM testimonials
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toTestimonial);
  } catch (err) {
    console.warn("[testimonials] DB inacessível:", err);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const rows = (await sql`
    SELECT id, author_name, author_role, photo_url, quote, rating,
           display_order, is_active
    FROM testimonials
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toTestimonial);
}

export async function getTestimonialById(
  id: number
): Promise<Testimonial | null> {
  const rows = (await sql`
    SELECT id, author_name, author_role, photo_url, quote, rating,
           display_order, is_active
    FROM testimonials
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toTestimonial(rows[0]);
}

export type TestimonialInput = {
  authorName: string;
  authorRole?: string | null;
  photoUrl?: string | null;
  quote: LocalizedText;
  rating?: number | null;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createTestimonial(
  input: TestimonialInput
): Promise<number> {
  const rows = (await sql`
    INSERT INTO testimonials
      (author_name, author_role, photo_url, quote, rating,
       display_order, is_active)
    VALUES (
      ${input.authorName},
      ${input.authorRole ?? null},
      ${input.photoUrl ?? null},
      ${JSON.stringify(input.quote)}::jsonb,
      ${input.rating ?? null},
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateTestimonial(
  id: number,
  input: TestimonialInput
): Promise<void> {
  await sql`
    UPDATE testimonials
    SET
      author_name   = ${input.authorName},
      author_role   = ${input.authorRole ?? null},
      photo_url     = ${input.photoUrl ?? null},
      quote         = ${JSON.stringify(input.quote)}::jsonb,
      rating        = ${input.rating ?? null},
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteTestimonial(id: number): Promise<void> {
  await sql`DELETE FROM testimonials WHERE id = ${id}`;
}
