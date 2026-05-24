// =================================================================
// TEAM MEMBERS — CRUD multi-idioma
// =================================================================
//
// Coluna `credentials` (era `oab_credentials`) é array de strings —
// genérico pra OAB, CRN, CRM, etc.
//
// `bio` e `details` são LocalizedText {pt, en, it} (JSONB).
//
// `name` e `role` ficam como string única (nome próprio + cargo curto)
// — em raros casos cliente pode querer traduzir, mas 99% mantém igual.

import { sql } from "./db";
import { toLocalized, type LocalizedText } from "./localized";

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  credentials: string[];
  photoUrl: string | null;
  initials: string | null;
  bio: LocalizedText;
  details: LocalizedText;
  displayOrder: number;
  isActive: boolean;
};

type DbRow = {
  id: number;
  name: string;
  role: string;
  credentials: string[] | null;
  photo_url: string | null;
  initials: string | null;
  bio: unknown;
  details: unknown;
  display_order: number;
  is_active: boolean;
};

function toMember(r: DbRow): TeamMember {
  return {
    id: r.id,
    name: r.name,
    role: r.role,
    credentials: r.credentials ?? [],
    photoUrl: r.photo_url,
    initials: r.initials,
    bio: toLocalized(r.bio),
    details: toLocalized(r.details),
    displayOrder: r.display_order,
    isActive: r.is_active,
  };
}

export async function getActiveTeam(): Promise<TeamMember[]> {
  try {
    const rows = (await sql`
      SELECT id, name, role, credentials, photo_url, initials,
             bio, details, display_order, is_active
      FROM team_members
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC
    `) as DbRow[];
    return rows.map(toMember);
  } catch (err) {
    console.error("[team] erro lendo DB:", err);
    return [];
  }
}

export async function getAllTeam(): Promise<TeamMember[]> {
  const rows = (await sql`
    SELECT id, name, role, credentials, photo_url, initials,
           bio, details, display_order, is_active
    FROM team_members
    ORDER BY display_order ASC, id ASC
  `) as DbRow[];
  return rows.map(toMember);
}

export async function getTeamMemberById(
  id: number
): Promise<TeamMember | null> {
  const rows = (await sql`
    SELECT id, name, role, credentials, photo_url, initials,
           bio, details, display_order, is_active
    FROM team_members
    WHERE id = ${id}
    LIMIT 1
  `) as DbRow[];
  if (rows.length === 0) return null;
  return toMember(rows[0]);
}

export type TeamMemberInput = {
  name: string;
  role: string;
  credentials: string[];
  photoUrl?: string | null;
  initials?: string | null;
  bio?: LocalizedText;
  details?: LocalizedText;
  displayOrder?: number;
  isActive?: boolean;
};

export async function createTeamMember(
  input: TeamMemberInput
): Promise<number> {
  const rows = (await sql`
    INSERT INTO team_members
      (name, role, credentials, photo_url, initials, bio, details,
       display_order, is_active)
    VALUES (
      ${input.name},
      ${input.role},
      ${input.credentials},
      ${input.photoUrl ?? null},
      ${input.initials ?? null},
      ${JSON.stringify(input.bio ?? {})}::jsonb,
      ${JSON.stringify(input.details ?? {})}::jsonb,
      ${input.displayOrder ?? 999},
      ${input.isActive ?? true}
    )
    RETURNING id
  `) as { id: number }[];
  return rows[0].id;
}

export async function updateTeamMember(
  id: number,
  input: TeamMemberInput
): Promise<void> {
  await sql`
    UPDATE team_members
    SET
      name          = ${input.name},
      role          = ${input.role},
      credentials   = ${input.credentials},
      photo_url     = ${input.photoUrl ?? null},
      initials      = ${input.initials ?? null},
      bio           = ${JSON.stringify(input.bio ?? {})}::jsonb,
      details       = ${JSON.stringify(input.details ?? {})}::jsonb,
      display_order = ${input.displayOrder ?? 999},
      is_active     = ${input.isActive ?? true},
      updated_at    = NOW()
    WHERE id = ${id}
  `;
}

export async function deleteTeamMember(id: number): Promise<void> {
  await sql`DELETE FROM team_members WHERE id = ${id}`;
}

export async function reorderTeamMembers(
  orderedIds: number[]
): Promise<void> {
  for (let i = 0; i < orderedIds.length; i++) {
    await sql`
      UPDATE team_members
      SET display_order = ${i + 1}, updated_at = NOW()
      WHERE id = ${orderedIds[i]}
    `;
  }
}
