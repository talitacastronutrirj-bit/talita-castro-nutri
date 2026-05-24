import Link from "next/link";
import { notFound } from "next/navigation";
import FaqItemForm from "@/components/admin/FaqItemForm";
import { getFaqItemById } from "@/lib/faq";
import { updateExistingFaqItem } from "../../actions";

export const metadata = { title: "Editar pergunta" };

const ERRORS: Record<string, string> = {
  "missing-question": "Preencha a pergunta.",
  "missing-answer": "Preencha a resposta.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditFaqItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const item = await getFaqItemById(numericId);
  if (!item) notFound();

  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar pergunta #{item.id}
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
        action={updateExistingFaqItem}
        item={item}
        cancelHref="/admin/faq"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
