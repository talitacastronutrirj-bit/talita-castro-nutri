import Link from "next/link";
import { notFound } from "next/navigation";
import PracticeAreaForm from "@/components/admin/PracticeAreaForm";
import { getAreaById } from "@/lib/practice-areas";
import { updatePracticeArea } from "../../actions";

export const metadata = { title: "Editar área de atuação" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-body": "Preencha a descrição.",
  "missing-icon": "Escolha um ícone.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditAreaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id: idRaw } = await params;
  const { error } = await searchParams;
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) notFound();

  const area = await getAreaById(id);
  if (!area) notFound();

  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar: {area.title.pt || Object.values(area.title)[0] || "—"}
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
        action={updatePracticeArea}
        area={area}
        cancelHref="/admin/areas"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
