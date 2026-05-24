import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryItemForm from "@/components/admin/GalleryItemForm";
import { getGalleryItemById } from "@/lib/gallery";
import { updateExistingGalleryItem } from "../../actions";

export const metadata = { title: "Editar foto" };

const ERRORS: Record<string, string> = {
  "missing-image": "Selecione a imagem principal.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditGalleryItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) notFound();

  const item = await getGalleryItemById(numericId);
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
          Editar foto #{item.id}
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
        action={updateExistingGalleryItem}
        item={item}
        cancelHref="/admin/gallery"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
