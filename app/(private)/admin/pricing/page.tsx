import Link from "next/link";
import { getAllPricingPlans, formatPrice } from "@/lib/pricing";
import { deleteExistingPricingPlan } from "./actions";

export const metadata = { title: "Preços" };

export default async function PricingListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const plans = await getAllPricingPlans().catch(() => []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Preços / Pacotes
          </h2>
          <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
            Pacotes de serviço com preço, moeda e features.
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
            href="/admin/pricing/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            + Novo pacote
          </Link>
        </div>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {saved === "created" && "Pacote criado."}
          {saved === "updated" && "Pacote atualizado."}
          {saved === "deleted" && "Pacote removido."}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erro ao salvar. Verifique os campos.
        </div>
      )}

      {plans.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-10 text-center text-dark"
          style={{ borderColor: "var(--border-soft)", opacity: 0.7 }}
        >
          Nenhum pacote cadastrado.{" "}
          <Link
            href="/admin/pricing/novo"
            className="text-accent font-medium hover:underline"
          >
            Adicionar primeiro pacote
          </Link>
          .
        </div>
      ) : (
        <ul className="space-y-3">
          {plans.map((p) => (
            <li
              key={p.id}
              className="rounded-2xl border bg-page p-4 flex items-center gap-4"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className="font-medium"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {p.name.pt || Object.values(p.name)[0] || "—"}
                  </span>
                  <span className="text-accent font-medium text-sm">
                    {formatPrice(p.price, p.currency, "pt")}
                  </span>
                  {p.isFeatured && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      ★ Destaque
                    </span>
                  )}
                  {!p.isActive && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      Inativo
                    </span>
                  )}
                </div>
                <p
                  className="text-xs text-dark line-clamp-1"
                  style={{ opacity: 0.7 }}
                >
                  {p.description.pt || Object.values(p.description)[0] || ""}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="text-[11px] text-dark mr-2"
                  style={{ opacity: 0.5 }}
                >
                  #{p.displayOrder}
                </span>
                <Link
                  href={`/admin/pricing/editar/${p.id}`}
                  className="text-sm rounded border px-3 py-1.5 hover:bg-page-2"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  Editar
                </Link>
                <form action={deleteExistingPricingPlan}>
                  <input type="hidden" name="id" value={p.id} />
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
