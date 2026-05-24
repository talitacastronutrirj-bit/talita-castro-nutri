import Link from "next/link";
import { notFound } from "next/navigation";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { getTeamMemberById } from "@/lib/team";
import { updateMember } from "../../actions";

export const metadata = { title: "Editar membro da equipe" };

const ERRORS: Record<string, string> = {
  "missing-name": "Preencha o nome.",
  "missing-role": "Preencha o cargo.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditMemberPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: idRaw } = await params;
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) notFound();

  const member = await getTeamMemberById(id);
  if (!member) notFound();

  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar membro
        </h2>
        <Link
          href="/admin/equipe"
          className="text-sm text-dark hover:opacity-70"
          style={{ opacity: 0.7 }}
        >
          ← Voltar
        </Link>
      </div>

      {errMsg && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errMsg}
        </div>
      )}

      <TeamMemberForm
        action={updateMember}
        member={member}
        cancelHref="/admin/equipe"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
