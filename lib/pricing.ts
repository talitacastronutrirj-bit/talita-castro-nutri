// =================================================================
// PRICING PLANS — CRUD multi-idioma + multi-moeda
// =================================================================

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";
import type { Locale } from "@/i18n/config";

export type Currency = "BRL" | "USD" | "EUR" | "GBP" | "CAD" | "AUD";

export type PricingPlan = {
  id: number;
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  currency: Currency;
  priceSuffix: LocalizedText;
  features: LocalizedText;
  ctaText: LocalizedText;
  ctaLink: string | null;
  isFeatured: boolean;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  name: unknown;
  description: unknown;
  price: string | number; // Postgres NUMERIC vem como string
  currency: string;
  price_suffix: unknown;
  features: unknown;
  cta_text: unknown;
  cta_link: string | null;
  is_featured: boolean;
  display_order: number;
  is_active: boolean;
};

function toPlan(r: DbRow): PricingPlan {
  return {
    id: r.id,
    name: toLocalized(r.name),
    description: toLocalized(r.description),
    price: typeof r.price === "string" ? parseFloat(r.price) : r.price,
    currency: r.currency as Currency,
    priceSuffix: toLocalized(r.price_suffix),
    features: toLocalized(r.features),
    ctaText: toLocalized(r.cta_text),
    ctaLink: r.cta_link,
    isFeatured: r.is_featured,
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActivePricingPlans(): Promise<PricingPlan[]> {
  try {
    const rows = (await sql`
      SELECT id, name, description, price, currency, price_suffix,
             features, cta_text, cta_link, is_featured,
             display_order, is_active
      FROM pricing_plans
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toPlan);
  } catch (err) {
    console.warn("[pricing] DB inacessível:", err);
    return [];
  }
}

export async function getAllPricingPlans(): Promise<PricingPlan[]> {
  const rows = (await sql`
    SELECT id, name, description, price, currency, price_suffix,
           features, cta_text, cta_link, is_featured,
           display_order, is_active
    FROM pricing_plans
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toPlan);
}

export async function getPricingPlanById(
  id: number
): Promise<PricingPlan | null> {
  const rows = (await sql`
    SELECT id, name, description, price, currency, price_suffix,
           features, cta_text, cta_link, is_featured,
           display_order, is_active
    FROM pricing_plans
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toPlan(rows[0]);
}

export type PricingPlanInput = {
  name: LocalizedText;
  description: LocalizedText;
  price: number;
  currency: Currency;
  priceSuffix: LocalizedText;
  features: LocalizedText;
  ctaText: LocalizedText;
  ctaLink?: string | null;
  isFeatured?: boolean;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createPricingPlan(
  input: PricingPlanInput
): Promise<number> {
  const rows = (await sql`
    INSERT INTO pricing_plans
      (name, description, price, currency, price_suffix, features,
       cta_text, cta_link, is_featured, display_order, is_active)
    VALUES (
      ${JSON.stringify(input.name)}::jsonb,
      ${JSON.stringify(input.description)}::jsonb,
      ${input.price},
      ${input.currency},
      ${JSON.stringify(input.priceSuffix)}::jsonb,
      ${JSON.stringify(input.features)}::jsonb,
      ${JSON.stringify(input.ctaText)}::jsonb,
      ${input.ctaLink ?? null},
      ${input.isFeatured ?? false},
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updatePricingPlan(
  id: number,
  input: PricingPlanInput
): Promise<void> {
  await sql`
    UPDATE pricing_plans
    SET
      name          = ${JSON.stringify(input.name)}::jsonb,
      description   = ${JSON.stringify(input.description)}::jsonb,
      price         = ${input.price},
      currency      = ${input.currency},
      price_suffix  = ${JSON.stringify(input.priceSuffix)}::jsonb,
      features      = ${JSON.stringify(input.features)}::jsonb,
      cta_text      = ${JSON.stringify(input.ctaText)}::jsonb,
      cta_link      = ${input.ctaLink ?? null},
      is_featured   = ${input.isFeatured ?? false},
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deletePricingPlan(id: number): Promise<void> {
  await sql`DELETE FROM pricing_plans WHERE id = ${id}`;
}

/**
 * Formata o preço de acordo com a moeda e o locale.
 * Usa Intl.NumberFormat (nativo) que conhece convenções de cada idioma:
 *   BRL pt: "R$ 199,90"
 *   USD en: "$199.90"
 *   EUR it: "199,90 €"
 */
export function formatPrice(
  price: number,
  currency: Currency,
  locale: Locale
): string {
  const localeMap: Record<Locale, string> = {
    pt: "pt-BR",
    en: "en-US",
    it: "it-IT",
  };
  try {
    return new Intl.NumberFormat(localeMap[locale] ?? "pt-BR", {
      style: "currency",
      currency,
      // Esconde decimais se for inteiro
      minimumFractionDigits: price % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(price);
  } catch {
    return `${currency} ${price.toFixed(2)}`;
  }
}
