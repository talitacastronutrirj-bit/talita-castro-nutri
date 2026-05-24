// =================================================================
// POSTS (blog) — CRUD multi-idioma
// =================================================================
//
// title, excerpt, content são LocalizedText {pt, en, it} no DB (JSONB).
// Slug é único e compartilhado entre idiomas — a mesma URL `/[locale]/artigos/<slug>`
// serve todas as locales, mostrando o conteúdo no idioma da request.

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";
import { DEFAULT_LOCALE, type Locale } from "@/i18n/config";

export type Post = {
  id: number;
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category: string;
  cover: string | null;
  content: LocalizedText;
  author: string;
  readingTime: string;
  date: string; // YYYY-MM-DD
  isPublished: boolean;
};

type DbRow = {
  id: number;
  slug: string;
  title: unknown;
  excerpt: unknown;
  category: string | null;
  cover_url: string | null;
  content: unknown;
  author: string | null;
  reading_time: string | null;
  is_published: boolean;
  published_at: string | null;
};

function toPost(r: DbRow): Post {
  const date = r.published_at
    ? new Date(r.published_at).toISOString().slice(0, 10)
    : "";
  return {
    id: r.id,
    slug: r.slug,
    title: toLocalized(r.title),
    excerpt: toLocalized(r.excerpt),
    category: r.category ?? "",
    cover: r.cover_url,
    content: toLocalized(r.content),
    author: r.author ?? "",
    readingTime: r.reading_time ?? "",
    date,
    isPublished: r.is_published,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  try {
    const rows = (await sql`
      SELECT id, slug, title, excerpt, category, cover_url, content,
             author, reading_time, is_published, published_at
      FROM posts
      WHERE is_published = TRUE
      ORDER BY published_at DESC NULLS LAST, id DESC
    `) as DbRow[];
    return rows.map(toPost);
  } catch (err) {
    console.warn("[posts] DB inacessível, retornando lista vazia:", err);
    return [];
  }
}

export async function getAllPostsIncludingDrafts(): Promise<Post[]> {
  const rows = (await sql`
    SELECT id, slug, title, excerpt, category, cover_url, content,
           author, reading_time, is_published, published_at
    FROM posts
    ORDER BY published_at DESC NULLS LAST, id DESC
  `) as DbRow[];
  return rows.map(toPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = (await sql`
    SELECT id, slug, title, excerpt, category, cover_url, content,
           author, reading_time, is_published, published_at
    FROM posts
    WHERE slug = ${slug}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toPost(rows[0]);
}

export async function getAllSlugs(): Promise<string[]> {
  const rows = (await sql`
    SELECT slug FROM posts WHERE is_published = TRUE
  `) as { slug: string }[];
  return rows.map((r) => r.slug);
}

export type PostInput = {
  slug: string;
  title: LocalizedText;
  excerpt: LocalizedText;
  category?: string | null;
  coverUrl?: string | null;
  content: LocalizedText;
  author?: string | null;
  readingTime?: string | null;
  isPublished?: boolean;
  publishedAt?: Date | string | null;
};

export async function createPost(input: PostInput): Promise<number> {
  const publishedAt = input.isPublished
    ? input.publishedAt ?? new Date()
    : input.publishedAt ?? null;

  const rows = (await sql`
    INSERT INTO posts
      (slug, title, excerpt, category, cover_url, content,
       author, reading_time, is_published, published_at)
    VALUES (
      ${input.slug},
      ${JSON.stringify(input.title)}::jsonb,
      ${JSON.stringify(input.excerpt)}::jsonb,
      ${input.category ?? null},
      ${input.coverUrl ?? null},
      ${JSON.stringify(input.content)}::jsonb,
      ${input.author ?? null},
      ${input.readingTime ?? null},
      ${input.isPublished ?? false},
      ${publishedAt}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updatePost(id: number, input: PostInput): Promise<void> {
  const publishedAt = input.isPublished
    ? input.publishedAt ?? new Date()
    : null;

  await sql`
    UPDATE posts
    SET
      slug         = ${input.slug},
      title        = ${JSON.stringify(input.title)}::jsonb,
      excerpt      = ${JSON.stringify(input.excerpt)}::jsonb,
      category     = ${input.category ?? null},
      cover_url    = ${input.coverUrl ?? null},
      content      = ${JSON.stringify(input.content)}::jsonb,
      author       = ${input.author ?? null},
      reading_time = ${input.readingTime ?? null},
      is_published = ${input.isPublished ?? false},
      published_at = ${publishedAt},
      updated_at   = NOW()
    WHERE id = ${id}
  `;
}

export async function deletePost(id: number): Promise<void> {
  await sql`DELETE FROM posts WHERE id = ${id}`;
}

// =================================================================
// Formatação de data por idioma
// =================================================================

const MONTHS: Record<Locale, string[]> = {
  pt: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  it: [
    "gennaio",
    "febbraio",
    "marzo",
    "aprile",
    "maggio",
    "giugno",
    "luglio",
    "agosto",
    "settembre",
    "ottobre",
    "novembre",
    "dicembre",
  ],
};

export function formatDate(iso: string, locale: Locale = DEFAULT_LOCALE): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  const months = MONTHS[locale] ?? MONTHS.pt;
  const day = String(d).padStart(2, "0");
  const month = months[m - 1];
  if (locale === "en") return `${month} ${day}, ${y}`;
  if (locale === "it") return `${day} ${month} ${y}`;
  return `${day} de ${month} de ${y}`;
}
