// Sitemap multi-idioma — emite uma URL por (rota × locale) com alternates
// hreflang pra Google entender as variantes.

import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { LOCALES } from "@/i18n/config";

function languagesMap(path: string) {
  return Object.fromEntries(
    LOCALES.map((loc) => [loc, `${site.url}/${loc}${path}`])
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  try {
    posts = await getAllPosts();
  } catch (err) {
    console.warn("[sitemap] sem DB acessível, gerando só rotas estáticas:", err);
  }

  const entries: MetadataRoute.Sitemap = [];

  // Home + lista de artigos em cada idioma
  for (const locale of LOCALES) {
    entries.push({
      url: `${site.url}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
      alternates: { languages: languagesMap("") },
    });
    entries.push({
      url: `${site.url}/${locale}/artigos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: languagesMap("/artigos") },
    });
  }

  // Cada artigo em cada idioma
  for (const post of posts) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${site.url}/${locale}/artigos/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: languagesMap(`/artigos/${post.slug}`),
        },
      });
    }
  }

  return entries;
}
