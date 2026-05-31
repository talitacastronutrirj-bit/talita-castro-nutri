import Link from "next/link";
import HowItWorksForm from "@/components/admin/HowItWorksForm";
import { createNewHowItWorks } from "../actions";

export const metadata = { title: "Nova etapa" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-description": "Preencha a descrição.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewHowItWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Nova etapa
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
        action={createNewHowItWorks}
        cancelHref="/admin/como-funciona"
        submitLabel="Adicionar etapa"
      />
    </div>
  );
}
