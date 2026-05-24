// =================================================================
// GALLERY — CRUD de fotos (single image OU antes/depois)
// =================================================================

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

export type GalleryItem = {
  id: number;
  beforeImageUrl: string;
  afterImageUrl: string | null;
  caption: LocalizedText;
  category: string | null;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  before_image_url: string;
  after_image_url: string | null;
  caption: unknown;
  category: string | null;
  display_order: number;
  is_active: boolean;
};

function toItem(r: DbRow): GalleryItem {
  return {
    id: r.id,
    beforeImageUrl: r.before_image_url,
    afterImageUrl: r.after_image_url,
    caption: toLocalized(r.caption),
    category: r.category,
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveGallery(): Promise<GalleryItem[]> {
  try {
    const rows = (await sql`
      SELECT id, before_image_url, after_image_url, caption, category,
             display_order, is_active
      FROM gallery_items
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toItem);
  } catch (err) {
    console.warn("[gallery] DB inacessível:", err);
    return [];
  }
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  const rows = (await sql`
    SELECT id, before_image_url, after_image_url, caption, category,
           display_order, is_active
    FROM gallery_items
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toItem);
}

export async function getGalleryItemById(
  id: number
): Promise<GalleryItem | null> {
  const rows = (await sql`
    SELECT id, before_image_url, after_image_url, caption, category,
           display_order, is_active
    FROM gallery_items
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toItem(rows[0]);
}

export type GalleryItemInput = {
  beforeImageUrl: string;
  afterImageUrl?: string | null;
  caption?: LocalizedText;
  category?: string | null;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createGalleryItem(
  input: GalleryItemInput
): Promise<number> {
  const rows = (await sql`
    INSERT INTO gallery_items
      (before_image_url, after_image_url, caption, category,
       display_order, is_active)
    VALUES (
      ${input.beforeImageUrl},
      ${input.afterImageUrl ?? null},
      ${JSON.stringify(input.caption ?? {})}::jsonb,
      ${input.category ?? null},
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateGalleryItem(
  id: number,
  input: GalleryItemInput
): Promise<void> {
  await sql`
    UPDATE gallery_items
    SET
      before_image_url = ${input.beforeImageUrl},
      after_image_url  = ${input.afterImageUrl ?? null},
      caption          = ${JSON.stringify(input.caption ?? {})}::jsonb,
      category         = ${input.category ?? null},
      display_order    = ${input.displayOrder ?? 999},
      is_active        = ${input.isActive ?? true},
      updated_at       = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteGalleryItem(id: number): Promise<void> {
  await sql`DELETE FROM gallery_items WHERE id = ${id}`;
}
