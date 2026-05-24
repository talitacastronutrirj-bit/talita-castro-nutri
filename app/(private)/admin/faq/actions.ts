"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createFaqItem,
  deleteFaqItem,
  updateFaqItem,
  type FaqItemInput,
} from "@/lib/faq";
import {
  isLocalizedEmpty,
  readLocalizedFromFormData,
} from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): FaqItemInput {
  const question = readLocalizedFromFormData(formData, "question");
  const answer = readLocalizedFromFormData(formData, "answer");
  const displayOrder = Number(formData.get("displayOrder") ?? 999);
  const isActive = formData.get("isActive") === "on";

  return {
    question,
    answer,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
    isActive,
  };
}

function validate(input: FaqItemInput): string | null {
  if (isLocalizedEmpty(input.question)) return "missing-question";
  if (isLocalizedEmpty(input.answer)) return "missing-answer";
  return null;
}

export async function createNewFaqItem(formData: FormData) {
  await requireSession();
  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/faq/novo?error=${err}`);

  try {
    await createFaqItem(input);
  } catch (e) {
    console.error("[faq] create failed:", e);
    redirect("/admin/faq/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/faq?saved=created");
}

export async function updateExistingFaqItem(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/faq");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/faq/editar/${id}?error=${err}`);

  try {
    await updateFaqItem(id, input);
  } catch (e) {
    console.error("[faq] update failed:", e);
    redirect(`/admin/faq/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/faq?saved=updated");
}

export async function deleteExistingFaqItem(formData: FormData) {
  await requireSession();
  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/faq");

  try {
    await deleteFaqItem(id);
  } catch (e) {
    console.error("[faq] delete failed:", e);
    redirect("/admin/faq?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/faq?saved=deleted");
}
