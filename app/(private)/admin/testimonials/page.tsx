import Link from "next/link";
import Image from "next/image";
import { getAllTestimonials } from "@/lib/testimonials";
import { deleteExistingTestimonial } from "./actions";

export const metadata = { title: "Depoimentos" };

export default async function TestimonialsListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const items = await getAllTestimonials();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Depoimentos
          </h2>
          <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
            Provas sociais que aparecem na home pública.
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
            href="/admin/testimonials/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            + Novo depoimento
          </Link>
        </div>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {saved === "created" && "Depoimento criado."}
          {saved === "updated" && "Depoimento atualizado."}
          {saved === "deleted" && "Depoimento removido."}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erro ao salvar. Verifique os campos e tente novamente.
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-10 text-center text-dark"
          style={{ borderColor: "var(--border-soft)", opacity: 0.7 }}
        >
          Nenhum depoimento cadastrado.{" "}
          <Link
            href="/admin/testimonials/novo"
            className="text-accent font-medium hover:underline"
          >
            Adicionar primeiro depoimento
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((t) => (
            <li
              key={t.id}
              className="rounded-2xl border bg-page p-4 flex items-center gap-4"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {t.photoUrl ? (
                <div className="w-12 h-12 rounded-full overflow-hidden relative shrink-0">
                  <Image
                    src={t.photoUrl}
                    alt={t.authorName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div
                  className="w-12 h-12 rounded-full grid place-items-center shrink-0 font-serif"
                  style={{
                    background: "var(--bg-dark)",
                    color: "var(--accent)",
                  }}
                >
                  {t.authorName.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="font-medium"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {t.authorName}
                  </span>
                  {t.authorRole && (
                    <span className="text-xs text-dark" style={{ opacity: 0.7 }}>
                      · {t.authorRole}
                    </span>
                  )}
                  {t.rating && (
                    <span className="text-accent text-xs">
                      {"★".repeat(t.rating)}
                    </span>
                  )}
                  {!t.isActive && (
                    <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-stone-200 text-stone-700">
                      Inativo
                    </span>
                  )}
                </div>
                <p
                  className="text-xs text-dark mt-0.5 truncate"
                  style={{ opacity: 0.7 }}
                >
                  {t.quote.pt || Object.values(t.quote)[0] || ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] text-dark mr-2"
                  style={{ opacity: 0.5 }}
                >
                  #{t.displayOrder}
                </span>
                <Link
                  href={`/admin/testimonials/editar/${t.id}`}
                  className="text-sm rounded border px-3 py-1.5 hover:bg-page-2"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  Editar
                </Link>
                <form action={deleteExistingTestimonial}>
                  <input type="hidden" name="id" value={t.id} />
                  <button
                    type="submit"
                    className="text-sm rounded border px-3 py-1.5 text-red-600 hover:bg-red-50"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    Excluir
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
