"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
  type TeamMemberInput,
} from "@/lib/team";
import { computeInitials, parseLines } from "@/lib/admin-helpers";
import { readLocalizedFromFormData } from "@/lib/localized";

async function requireSession() {
  const session = await getSession();
  if (!session) redirect("/login");
}

function readInput(formData: FormData): TeamMemberInput {
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  // Renomeado de oabCredentials → credentials (mais genérico: CRN, OAB, CRM, etc)
  const credsRaw = String(formData.get("credentials") ?? "");
  const photoUrl = String(formData.get("photoUrl") ?? "").trim() || null;
  const initialsRaw = String(formData.get("initials") ?? "").trim();
  const bio = readLocalizedFromFormData(formData, "bio");
  const details = readLocalizedFromFormData(formData, "details");
  const displayOrder = Number(formData.get("displayOrder") ?? 999);
  const isActive = formData.get("isActive") === "on";

  return {
    name,
    role,
    credentials: parseLines(credsRaw),
    photoUrl,
    initials: initialsRaw || computeInitials(name),
    bio,
    details,
    displayOrder: isNaN(displayOrder) ? 999 : displayOrder,
    isActive,
  };
}

function validate(input: TeamMemberInput): string | null {
  if (!input.name) return "missing-name";
  if (!input.role) return "missing-role";
  return null;
}

export async function createMember(formData: FormData) {
  await requireSession();

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/equipe/novo?error=${err}`);

  try {
    await createTeamMember(input);
  } catch (e) {
    console.error("[equipe] create failed:", e);
    redirect("/admin/equipe/novo?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/equipe?saved=created");
}

export async function updateMember(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/equipe");

  const input = readInput(formData);
  const err = validate(input);
  if (err) redirect(`/admin/equipe/editar/${id}?error=${err}`);

  try {
    await updateTeamMember(id, input);
  } catch (e) {
    console.error("[equipe] update failed:", e);
    redirect(`/admin/equipe/editar/${id}?error=db`);
  }

  revalidatePath("/", "layout");
  redirect("/admin/equipe?saved=updated");
}

export async function deleteMember(formData: FormData) {
  await requireSession();

  const idRaw = String(formData.get("id") ?? "");
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) redirect("/admin/equipe");

  try {
    await deleteTeamMember(id);
  } catch (e) {
    console.error("[equipe] delete failed:", e);
    redirect("/admin/equipe?error=db");
  }

  revalidatePath("/", "layout");
  redirect("/admin/equipe?saved=deleted");
}
