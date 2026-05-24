"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createPricingPlan,
  deletePricingPlan,
  updatePricingPlan,
  type PricingPlanInput,
  type Currency,
} from "@/lib/pricing";
import {
  isLocalizedEmpty,
  readLocalizedFromFormData,
} from "@/lib/localized";

const VALID_CURRENCIES: Currency[] = ["BRL", "USD", "EUR", "GBP", "CAD", "AUD"];

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): PricingPlanInput {
  const name = readLocalizedFromFormData(formData, "name");
  const description = readLocalizedFromFormData(formData, "description");
  const priceRaw = String(formData.get("price") ?? "0").replace(",", ".");
  const price = parseFloat(priceRaw);
  const currencyRaw = String(formData.get("currency") ?? "BRL");
  const currency: Currency = VALID_CURRENCIES.includes(currencyRaw as Currency)
    ? (currencyRaw as Currency)
    : "BRL";
  const priceSuffix = readLocalizedFromFormData(formData, "priceSuffix");
  const features = readLocalizedFromFormData(formData, "features");
  const ctaText = readLocalizedFromFormData(formData, "ctaText");
  const ctaLink = String(formData.get("ctaLink") ?? "").trim() || null;
  const isFeatured = formData.get("isFeatured") === "on";
  const isActive = formData.get("isActive") === "on";
  const displayOrder = Number(formData.get("displayOrder") ?? 999);

  return {
    name,
    description,
    price: isNaN(price) ? 0 : price,
    currency,
    priceSuffix,
    features,
    ctaText,
    ctaLink,
    isFeatured,
    isActive,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
  };
}

function validate(input: PricingPlanInput): string | null {
  if (isLocalizedEmpty(input.name)) return "missing-name";
  if (input.price < 0) return "invalid-price";
  return null;
}

export async function createNewPricingPlan(formData: FormData) {
  await requireSession();
  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/pricing/novo?error=${err}`);

  try {
    await createPricingPlan(input);
  } catch (e) {
    console.error("[pricing] create failed:", e);
    redirect("/admin/pricing/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/pricing?saved=created");
}

export async function updateExistingPricingPlan(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/pricing");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/pricing/editar/${id}?error=${err}`);

  try {
    await updatePricingPlan(id, input);
  } catch (e) {
    console.error("[pricing] update failed:", e);
    redirect(`/admin/pricing/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/pricing?saved=updated");
}

export async function deleteExistingPricingPlan(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/pricing");

  try {
    await deletePricingPlan(id);
  } catch (e) {
    console.error("[pricing] delete failed:", e);
    redirect("/admin/pricing?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/pricing?saved=deleted");
}
