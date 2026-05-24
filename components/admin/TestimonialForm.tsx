import Link from "next/link";
import ImageUpload from "./ImageUpload";
import { LocalizedTextarea } from "./LocalizedInput";
import type { Testimonial } from "@/lib/testimonials";

type Props = {
  action: (formData: FormData) => Promise<void>;
  testimonial?: Testimonial;
  cancelHref: string;
  submitLabel: string;
};

export default function TestimonialForm({
  action,
  testimonial,
  cancelHref,
  submitLabel,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border bg-page p-6 md:p-8"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {testimonial && (
        <input type="hidden" name="id" value={testimonial.id} />
      )}

      {/* Foto */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--bg-dark)" }}
        >
          Foto do autor{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (opcional — sem foto, mostra a inicial)
          </span>
        </label>
        <ImageUpload
          name="photoUrl"
          context="team"
          aspectRatio="square"
          defaultValue={testimonial?.photoUrl ?? ""}
          label="Selecionar foto"
        />
      </div>

      {/* Nome + cargo */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="authorName"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Nome do autor
          </label>
          <input
            id="authorName"
            name="authorName"
            type="text"
            required
            defaultValue={testimonial?.authorName ?? ""}
            placeholder="Ex: Maria S."
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="authorRole"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Cargo / Relação{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (opcional)
            </span>
          </label>
          <input
            id="authorRole"
            name="authorRole"
            type="text"
            defaultValue={testimonial?.authorRole ?? ""}
            placeholder="Ex: Paciente desde 2022"
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>
      </div>

      {/* Quote multi-idioma */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Depoimento
        </label>
        <LocalizedTextarea
          name="quote"
          defaultValue={testimonial?.quote}
          rows={5}
          required
          placeholder={{
            pt: "Texto do depoimento da pessoa...",
            en: "Person's testimonial text...",
            it: "Testo della testimonianza...",
          }}
          hint="Quebras de linha são preservadas. Mantenha conciso (3-6 linhas)."
        />
      </div>

      {/* Rating + Ordem + Ativo */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Estrelas{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (opcional, 1-5)
            </span>
          </label>
          <select
            id="rating"
            name="rating"
            defaultValue={testimonial?.rating?.toString() ?? ""}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          >
            <option value="">— sem estrelas</option>
            <option value="5">★★★★★ (5)</option>
            <option value="4">★★★★☆ (4)</option>
            <option value="3">★★★☆☆ (3)</option>
            <option value="2">★★☆☆☆ (2)</option>
            <option value="1">★☆☆☆☆ (1)</option>
          </select>
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
            defaultValue={testimonial?.displayOrder ?? 999}
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
              defaultChecked={testimonial?.isActive ?? true}
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
