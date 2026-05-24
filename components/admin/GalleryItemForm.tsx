import Link from "next/link";
import ImageUpload from "./ImageUpload";
import { LocalizedTextarea } from "./LocalizedInput";
import type { GalleryItem } from "@/lib/gallery";

type Props = {
  action: (formData: FormData) => Promise<void>;
  item?: GalleryItem;
  cancelHref: string;
  submitLabel: string;
};

export default function GalleryItemForm({
  action,
  item,
  cancelHref,
  submitLabel,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border bg-page p-6 md:p-8"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {item && <input type="hidden" name="id" value={item.id} />}

      {/* Imagens */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--bg-dark)" }}
          >
            Imagem principal{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (ou &quot;antes&quot;, se for comparação)
            </span>
          </label>
          <ImageUpload
            name="beforeImageUrl"
            context="hero"
            aspectRatio="square"
            defaultValue={item?.beforeImageUrl ?? ""}
            label="Selecionar imagem"
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--bg-dark)" }}
          >
            Imagem &quot;depois&quot;{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (opcional — preencha pra criar comparador antes/depois)
            </span>
          </label>
          <ImageUpload
            name="afterImageUrl"
            context="hero"
            aspectRatio="square"
            defaultValue={item?.afterImageUrl ?? ""}
            label="Selecionar imagem"
          />
        </div>
      </div>

      {/* Legenda */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Legenda{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (opcional)
          </span>
        </label>
        <LocalizedTextarea
          name="caption"
          defaultValue={item?.caption}
          rows={3}
          placeholder={{
            pt: "Ex: Paciente perdeu 12kg em 6 meses com plano alimentar",
            en: "Ex: Patient lost 12kg in 6 months with custom meal plan",
            it: "Es: Paziente ha perso 12kg in 6 mesi con dieta personalizzata",
          }}
        />
      </div>

      {/* Categoria + Ordem + Ativo */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Categoria{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (opcional)
            </span>
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={item?.category ?? ""}
            placeholder="Ex: Emagrecimento"
            maxLength={64}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Ordem
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min="0"
            defaultValue={item?.displayOrder ?? 999}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item?.isActive ?? true}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm" style={{ color: "var(--bg-dark)" }}>
              Mostrar no site
            </span>
          </label>
        </div>
      </div>

      {/* Ações */}
      <div
        className="flex items-center justify-end gap-3 border-t pt-5"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <Link
          href={cancelHref}
          className="rounded border px-4 py-2 text-sm hover:bg-page-2"
          style={{ borderColor: "var(--border-soft)" }}
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="rounded btn-dark px-4 py-2 text-sm font-medium"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
