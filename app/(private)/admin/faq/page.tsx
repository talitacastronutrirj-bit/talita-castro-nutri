import Link from "next/link";
import { getAllFaq } from "@/lib/faq";
import { deleteExistingFaqItem } from "./actions";

export const metadata = { title: "FAQ" };

export default async function FaqListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const items = await getAllFaq().catch(() => []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            FAQ
          </h2>
          <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
            Perguntas frequentes — aparecem expansíveis na home pública.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href="/admin"
            className="text-sm text-dark hover:opacity-70"
            style={{ opacity: 0.7 }}
          >
            ← Voltar
          </Link>
          <Link
            href="/admin/faq/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            + Nova pergunta
          </Link>
        </div>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {saved === "created" && "Pergunta criada."}
          {saved === "updated" && "Pergunta atualizada."}
          {saved === "deleted" && "Pergunta removida."}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erro ao salvar. Verifique os campos.
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-10 text-center text-dark"
          style={{ borderColor: "var(--border-soft)", opacity: 0.7 }}
        >
          Nenhuma pergunta cadastrada.{" "}
          <Link
            href="/admin/faq/novo"
            className="text-accent font-medium hover:underline"
          >
            Adicionar primeira pergunta
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-2xl border bg-page p-4"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="font-medium"
                      style={{ color: "var(--bg-dark)" }}
                    >
                      {it.question.pt || Object.values(it.question)[0] || "—"}
                    </span>
                    {!it.isActive && (
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-dark line-clamp-2"
                    style={{ opacity: 0.7 }}
                  >
                    {it.answer.pt || Object.values(it.answer)[0] || ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className="text-[11px] text-dark mr-2"
                    style={{ opacity: 0.5 }}
                  >
                    #{it.displayOrder}
                  </span>
                  <Link
                    href={`/admin/faq/editar/${it.id}`}
                    className="text-sm rounded border px-3 py-1.5 hover:bg-page-2"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    Editar
                  </Link>
                  <form action={deleteExistingFaqItem}>
                    <input type="hidden" name="id" value={it.id} />
                    <button
                      type="submit"
                      className="text-sm rounded border px-3 py-1.5 text-red-600 hover:bg-red-50"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
