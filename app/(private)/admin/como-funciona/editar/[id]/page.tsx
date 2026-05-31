import Link from "next/link";
import { notFound } from "next/navigation";
import HowItWorksForm from "@/components/admin/HowItWorksForm";
import { getHowItWorksById } from "@/lib/how-it-works";
import { updateExistingHowItWorks } from "../../actions";

export const metadata = { title: "Editar etapa" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-description": "Preencha a descrição.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditHowItWorksPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: idStr } = await params;
  const { error } = await searchParams;
  const id = parseInt(idStr, 10);
  if (isNaN(id)) notFound();

  const item = await getHowItWorksById(id);
  if (!item) notFound();

  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar etapa
        </h2>
        <Link
          href="/admin/como-funciona"
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

      <HowItWorksForm
        action={updateExistingHowItWorks}
        item={item}
        cancelHref="/admin/como-funciona"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
