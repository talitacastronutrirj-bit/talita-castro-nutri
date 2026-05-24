import Link from "next/link";
import PracticeAreaForm from "@/components/admin/PracticeAreaForm";
import { createPracticeArea } from "../actions";

export const metadata = { title: "Nova área de atuação" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-body": "Preencha a descrição.",
  "missing-icon": "Escolha um ícone.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewAreaPage({
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
          Nova área de atuação
        </h2>
        <Link
          href="/admin/areas"
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

      <PracticeAreaForm
        action={createPracticeArea}
        cancelHref="/admin/areas"
        submitLabel="Adicionar área"
      />
    </div>
  );
}
