"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createGalleryItem,
  deleteGalleryItem,
  updateGalleryItem,
  type GalleryItemInput,
} from "@/lib/gallery";
import { readLocalizedFromFormData } from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): GalleryItemInput {
  const beforeImageUrl = String(formData.get("beforeImageUrl") ?? "").trim();
  const afterImageUrl =
    String(formData.get("afterImageUrl") ?? "").trim() || null;
  const caption = readLocalizedFromFormData(formData, "caption");
  const category = String(formData.get("category") ?? "").trim() || null;
  const displayOrder = Number(formData.get("displayOrder") ?? 999);
  const isActive = formData.get("isActive") === "on";

  return {
    beforeImageUrl,
    afterImageUrl,
    caption,
    category,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
    isActive,
  };
}

function validate(input: GalleryItemInput): string | null {
  if (!input.beforeImageUrl) return "missing-image";
  return null;
}

export async function createNewGalleryItem(formData: FormData) {
  await requireSession();

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/gallery/novo?error=${err}`);

  try {
    await createGalleryItem(input);
  } catch (e) {
    console.error("[gallery] create failed:", e);
    redirect("/admin/gallery/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/gallery?saved=created");
}

export async function updateExistingGalleryItem(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/gallery");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/gallery/editar/${id}?error=${err}`);

  try {
    await updateGalleryItem(id, input);
  } catch (e) {
    console.error("[gallery] update failed:", e);
    redirect(`/admin/gallery/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/gallery?saved=updated");
}

export async function deleteExistingGalleryItem(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/gallery");

  try {
    await deleteGalleryItem(id);
  } catch (e) {
    console.error("[gallery] delete failed:", e);
    redirect("/admin/gallery?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/gallery?saved=deleted");
}
