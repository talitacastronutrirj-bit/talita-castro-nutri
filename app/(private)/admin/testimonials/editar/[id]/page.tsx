import Link from "next/link";
import { notFound } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { getTestimonialById } from "@/lib/testimonials";
import { updateExistingTestimonial } from "../../actions";

export const metadata = { title: "Editar depoimento" };

const ERRORS: Record<string, string> = {
  "missing-name": "Preencha o nome do autor.",
  "missing-quote": "Preencha o texto do depoimento.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditTestimonialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const testimonial = await getTestimonialById(numericId);
  if (!testimonial) notFound();

  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar: {testimonial.authorName}
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
        action={updateExistingTestimonial}
        testimonial={testimonial}
        cancelHref="/admin/testimonials"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
