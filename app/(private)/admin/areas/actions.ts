"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createArea,
  deleteArea,
  updateArea,
  type PracticeAreaInput,
} from "@/lib/practice-areas";
import {
  isLocalizedEmpty,
  readLocalizedFromFormData,
} from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): PracticeAreaInput {
  const title = readLocalizedFromFormData(formData, "title");
  const body = readLocalizedFromFormData(formData, "body");
  const icon = String(formData.get("icon") ?? "document").trim();
  const highlighted = formData.get("highlighted") === "on";
  const isActive = formData.get("isActive") === "on";
  const displayOrder = Number(formData.get("displayOrder") ?? 999);

  return {
    title,
    body,
    icon,
    highlighted,
    isActive,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
  };
}

function validate(input: PracticeAreaInput): string | null {
  if (isLocalizedEmpty(input.title)) return "missing-title";
  if (isLocalizedEmpty(input.body)) return "missing-body";
  if (!input.icon) return "missing-icon";
  return null;
}

export async function createPracticeArea(formData: FormData) {
  await requireSession();

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/areas/novo?error=${err}`);

  try {
    await createArea(input);
  } catch (e) {
    console.error("[areas] create failed:", e);
    redirect("/admin/areas/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/areas?saved=created");
}

export async function updatePracticeArea(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/areas");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/areas/editar/${id}?error=${err}`);

  try {
    await updateArea(id, input);
  } catch (e) {
    console.error("[areas] update failed:", e);
    redirect(`/admin/areas/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/areas?saved=updated");
}

export async function deletePracticeArea(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/areas");

  try {
    await deleteArea(id);
  } catch (e) {
    console.error("[areas] delete failed:", e);
    redirect("/admin/areas?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/areas?saved=deleted");
}
