"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createTestimonial,
  deleteTestimonial,
  updateTestimonial,
  type TestimonialInput,
} from "@/lib/testimonials";
import {
  isLocalizedEmpty,
  readLocalizedFromFormData,
} from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): TestimonialInput {
  const authorName = String(formData.get("authorName") ?? "").trim();
  const authorRole = String(formData.get("authorRole") ?? "").trim() || null;
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const quote = readLocalizedFromFormData(formData, "quote");
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const rating = ratingRaw ? Number(ratingRaw) : null;
  const displayOrder = Number(formData.get("displayOrder") ?? 999);
  const isActive = formData.get("isActive") === "on";

  return {
    authorName,
    authorRole,
    photoUrl,
    quote,
    rating: rating && !isNaN(rating) ? rating : null,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
    isActive,
  };
}

function validate(input: TestimonialInput): string | null {
  if (!input.authorName) return "missing-name";
  if (isLocalizedEmpty(input.quote)) return "missing-quote";
  return null;
}

export async function createNewTestimonial(formData: FormData) {
  await requireSession();

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/testimonials/novo?error=${err}`);

  try {
    await createTestimonial(input);
  } catch (e) {
    console.error("[testimonials] create failed:", e);
    redirect("/admin/testimonials/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/testimonials?saved=created");
}

export async function updateExistingTestimonial(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/testimonials");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/testimonials/editar/${id}?error=${err}`);

  try {
    await updateTestimonial(id, input);
  } catch (e) {
    console.error("[testimonials] update failed:", e);
    redirect(`/admin/testimonials/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/testimonials?saved=updated");
}

export async function deleteExistingTestimonial(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/testimonials");

  try {
    await deleteTestimonial(id);
  } catch (e) {
    console.error("[testimonials] delete failed:", e);
    redirect("/admin/testimonials?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/testimonials?saved=deleted");
}
