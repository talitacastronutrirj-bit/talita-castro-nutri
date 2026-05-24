import Link from "next/link";
import Image from "next/image";
import { getAllGallery } from "@/lib/gallery";
import { deleteExistingGalleryItem } from "./actions";

export const metadata = { title: "Galeria" };

export default async function GalleryListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const items = await getAllGallery();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Galeria
          </h2>
          <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
            Fotos (única) ou antes/depois. Aparece na home pública.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Link
            href="/admin"
            className="text-sm text-dark hover:opacity-70"
            style={{ opacity: 0.7 }}
          >
            ← Voltar
          </Link>
          <Link
            href="/admin/gallery/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            + Nova foto
          </Link>
        </div>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {saved === "created" && "Foto adicionada."}
          {saved === "updated" && "Foto atualizada."}
          {saved === "deleted" && "Foto removida."}
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Erro ao salvar. Verifique os campos.
        </div>
      )}

      {items.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-10 text-center text-dark"
          style={{ borderColor: "var(--border-soft)", opacity: 0.7 }}
        >
          Nenhuma foto cadastrada.{" "}
          <Link
            href="/admin/gallery/novo"
            className="text-accent font-medium hover:underline"
          >
            Adicionar primeira foto
          </Link>
          .
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <li
              key={it.id}
              className="rounded-2xl border bg-page p-3"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex gap-2 mb-3">
                <div className="aspect-square relative flex-1 rounded-lg overflow-hidden bg-dark">
                  <Image
                    src={it.beforeImageUrl}
                    alt="antes"
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                {it.afterImageUrl && (
                  <div className="aspect-square relative flex-1 rounded-lg overflow-hidden bg-dark">
                    <Image
                      src={it.afterImageUrl}
                      alt="depois"
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="px-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {it.category && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {it.category}
                    </span>
                  )}
                  {it.afterImageUrl && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Antes / Depois
                    </span>
                  )}
                  {!it.isActive && (
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                      Inativo
                    </span>
                  )}
                  <span
                    className="text-[10px] text-dark ml-auto"
                    style={{ opacity: 0.5 }}
                  >
                    #{it.displayOrder}
                  </span>
                </div>
                {it.caption.pt && (
                  <p
                    className="text-xs text-dark mb-3 line-clamp-2"
                    style={{ opacity: 0.7 }}
                  >
                    {it.caption.pt}
                  </p>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/gallery/editar/${it.id}`}
                    className="flex-1 text-center text-sm rounded border px-3 py-1.5 hover:bg-page-2"
                    style={{ borderColor: "var(--border-soft)" }}
                  >
                    Editar
                  </Link>
                  <form action={deleteExistingGalleryItem}>
                    <input type="hidden" name="id" value={it.id} />
                    <button
                      type="submit"
                      className="text-sm rounded border px-3 py-1.5 text-red-600 hover:bg-red-50"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      Excluir
                    </button>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
