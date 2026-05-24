import Link from "next/link";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { createNewTestimonial } from "../actions";

export const metadata = { title: "Novo depoimento" };

const ERRORS: Record<string, string> = {
  "missing-name": "Preencha o nome do autor.",
  "missing-quote": "Preencha o texto do depoimento.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewTestimonialPage({
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
          Novo depoimento
        </h2>
        <Link
          href="/admin/testimonials"
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

      <TestimonialForm
        action={createNewTestimonial}
        cancelHref="/admin/testimonials"
        submitLabel="Adicionar depoimento"
      />
    </div>
  );
}
