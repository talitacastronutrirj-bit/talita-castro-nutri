"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createHowItWorks,
  deleteHowItWorks,
  isValidIcon,
  updateHowItWorks,
  type HowItWorksInput,
} from "@/lib/how-it-works";
import {
  isLocalizedEmpty,
  readLocalizedFromFormData,
} from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): HowItWorksInput {
  const iconRaw = String(formData.get("iconKey") ?? "calendar");
  const iconKey = isValidIcon(iconRaw) ? iconRaw : "calendar";
  const title = readLocalizedFromFormData(formData, "title");
  const description = readLocalizedFromFormData(formData, "description");
  const displayOrder = Number(formData.get("displayOrder") ?? 999);
  const isActive = formData.get("isActive") === "on";

  return {
    iconKey,
    title,
    description,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
    isActive,
  };
}

function validate(input: HowItWorksInput): string | null {
  if (isLocalizedEmpty(input.title)) return "missing-title";
  if (isLocalizedEmpty(input.description)) return "missing-description";
  return null;
}

export async function createNewHowItWorks(formData: FormData) {
  await requireSession();
  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/como-funciona/novo?error=${err}`);

  try {
    await createHowItWorks(input);
  } catch (e) {
    console.error("[how-it-works] create failed:", e);
    redirect("/admin/como-funciona/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/como-funciona?saved=created");
}

export async function updateExistingHowItWorks(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/como-funciona");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/como-funciona/editar/${id}?error=${err}`);

  try {
    await updateHowItWorks(id, input);
  } catch (e) {
    console.error("[how-it-works] update failed:", e);
    redirect(`/admin/como-funciona/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/como-funciona?saved=updated");
}

export async function deleteExistingHowItWorks(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/como-funciona");

  try {
    await deleteHowItWorks(id);
  } catch (e) {
    console.error("[how-it-works] delete failed:", e);
    redirect("/admin/como-funciona?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/como-funciona?saved=deleted");
}
