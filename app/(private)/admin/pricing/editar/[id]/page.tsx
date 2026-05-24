import Link from "next/link";
import { notFound } from "next/navigation";
import PricingPlanForm from "@/components/admin/PricingPlanForm";
import { getPricingPlanById } from "@/lib/pricing";
import { updateExistingPricingPlan } from "../../actions";

export const metadata = { title: "Editar pacote" };

const ERRORS: Record<string, string> = {
  "missing-name": "Preencha o nome do pacote.",
  "invalid-price": "Preço inválido.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditPricingPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const plan = await getPricingPlanById(numericId);
  if (!plan) notFound();

  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar: {plan.name.pt || Object.values(plan.name)[0] || "—"}
        </h2>
        <Link
          href="/admin/pricing"
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

      <PricingPlanForm
        action={updateExistingPricingPlan}
        plan={plan}
        cancelHref="/admin/pricing"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
