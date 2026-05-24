import Link from "next/link";
import GalleryItemForm from "@/components/admin/GalleryItemForm";
import { createNewGalleryItem } from "../actions";

export const metadata = { title: "Nova foto" };

const ERRORS: Record<string, string> = {
  "missing-image": "Selecione a imagem principal.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewGalleryItemPage({
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
          Nova foto
        </h2>
        <Link
          href="/admin/gallery"
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

      <GalleryItemForm
        action={createNewGalleryItem}
        cancelHref="/admin/gallery"
        submitLabel="Adicionar foto"
      />
    </div>
  );
}
