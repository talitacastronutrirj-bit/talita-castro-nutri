import Image from "next/image";
import Link from "next/link";
import { getAllTeam } from "@/lib/team";
import { deleteMember } from "./actions";

export const metadata = { title: "Equipe" };

const NOTICES: Record<string, string> = {
  created: "Membro adicionado com sucesso.",
  updated: "Membro atualizado.",
  deleted: "Membro removido.",
};
const ERRORS: Record<string, string> = {
  db: "Erro ao acessar o banco de dados. Tente novamente.",
};

export default async function TeamListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const team = await getAllTeam();

  return (
    <div>
      {saved && NOTICES[saved] && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {NOTICES[saved]}
        </div>
      )}
      {error && ERRORS[error] && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {ERRORS[error]}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold"
            style={{ color: "var(--bg-dark)" }}
          >
            Equipe
          </h2>
          <p
            className="text-sm text-dark"
            style={{ opacity: 0.7 }}
          >
            Profissionais e equipe de apoio que aparecem na seção &quot;Equipe&quot;.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-dark hover:opacity-70"
            style={{ opacity: 0.7 }}
          >
            ← Voltar
          </Link>
          <Link
            href="/admin/equipe/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            Novo membro
          </Link>
        </div>
      </div>

      {team.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-8 text-center text-sm"
          style={{ borderColor: "var(--border-soft)" }}
        >
          Nenhum membro cadastrado ainda.
        </div>
      ) : (
        <ul
          className="rounded-2xl border bg-page overflow-hidden"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {team.map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden grid place-items-center shrink-0"
                  style={{ background: "var(--bg-dark)" }}
                >
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-base text-accent">
                      {m.initials || m.name.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-medium"
                      style={{ color: "var(--bg-dark)" }}
                    >
                      {m.name}
                    </span>
                    {!m.isActive && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-stone-200 text-stone-700">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-dark mt-0.5" style={{ opacity: 0.7 }}>
                    {m.role}
                    {m.credentials.length > 0 && (
                      <> · {m.credentials.join(" · ")}</>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-dark mr-2" style={{ opacity: 0.5 }}>
                  #{m.displayOrder}
                </span>
                <Link
                  href={`/admin/equipe/editar/${m.id}`}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Editar
                </Link>
                <form action={deleteMember}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-700 hover:underline font-medium"
                    aria-label={`Remover ${m.name}`}
                  >
                    Remover
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
