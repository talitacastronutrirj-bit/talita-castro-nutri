import Link from "next/link";
import FaqItemForm from "@/components/admin/FaqItemForm";
import { createNewFaqItem } from "../actions";

export const metadata = { title: "Nova pergunta" };

const ERRORS: Record<string, string> = {
  "missing-question": "Preencha a pergunta.",
  "missing-answer": "Preencha a resposta.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewFaqItemPage({
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
          Nova pergunta
        </h2>
        <Link
          href="/admin/faq"
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

      <FaqItemForm
        action={createNewFaqItem}
        cancelHref="/admin/faq"
        submitLabel="Adicionar pergunta"
      />
    </div>
  );
}
