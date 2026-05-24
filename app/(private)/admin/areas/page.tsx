import Link from "next/link";
import { getAllAreas } from "@/lib/practice-areas";
import { PracticeAreaIcon } from "@/lib/practice-area-icons";
import { deletePracticeArea } from "./actions";

export const metadata = { title: "Áreas de atuação" };

const NOTICES: Record<string, string> = {
  created: "Área adicionada com sucesso.",
  updated: "Área atualizada.",
  deleted: "Área removida.",
};
const ERRORS: Record<string, string> = {
  db: "Erro ao acessar o banco de dados. Tente novamente.",
};

export default async function AreasListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const areas = await getAllAreas();

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
            Áreas de atuação
          </h2>
          <p
            className="text-sm text-dark"
            style={{ opacity: 0.7 }}
          >
            Cards que aparecem na seção &quot;Como podemos te ajudar&quot; do site.
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
            href="/admin/areas/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            Nova área
          </Link>
        </div>
      </div>

      {areas.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-8 text-center text-sm"
          style={{ borderColor: "var(--border-soft)" }}
        >
          Nenhuma área cadastrada ainda.
        </div>
      ) : (
        <ul
          className="rounded-2xl border bg-page overflow-hidden"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {areas.map((a) => (
            <li
              key={a.id}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className="w-12 h-12 rounded-full grid place-items-center shrink-0"
                  style={{ background: "var(--bg-dark)" }}
                >
                  <PracticeAreaIcon
                    iconKey={a.icon}
                    className="w-6 h-6 text-accent"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-medium"
                      style={{ color: "var(--bg-dark)" }}
                    >
                      {a.title.pt || Object.values(a.title)[0] || "—"}
                    </span>
                    {a.highlighted && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-amber-100 text-amber-800">
                        Destaque
                      </span>
                    )}
                    {!a.isActive && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-stone-200 text-stone-700">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-dark mt-0.5 truncate"
                    style={{ opacity: 0.7 }}
                  >
                    {a.body.pt || Object.values(a.body)[0] || ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] text-dark mr-2"
                  style={{ opacity: 0.5 }}
                >
                  #{a.displayOrder}
                </span>
                <Link
                  href={`/admin/areas/editar/${a.id}`}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Editar
                </Link>
                <form action={deletePracticeArea}>
                  <input type="hidden" name="id" value={a.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-700 hover:underline font-medium"
                    aria-label={`Remover ${a.title}`}
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
