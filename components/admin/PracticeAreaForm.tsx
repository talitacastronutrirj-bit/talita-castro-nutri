import Link from "next/link";
import type { PracticeArea } from "@/lib/practice-areas";
import {
  ICON_OPTIONS,
  PracticeAreaIcon,
} from "@/lib/practice-area-icons";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";

type Props = {
  action: (formData: FormData) => Promise<void>;
  area?: PracticeArea;
  cancelHref: string;
  submitLabel: string;
};

export default function PracticeAreaForm({
  action,
  area,
  cancelHref,
  submitLabel,
}: Props) {
  const currentIcon = area?.icon ?? ICON_OPTIONS[0].value;

  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border bg-page p-6 md:p-8"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {area && <input type="hidden" name="id" value={area.id} />}

      {/* Título */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Título da área
        </label>
        <LocalizedInput
          name="title"
          defaultValue={area?.title}
          required
          maxLength={128}
          placeholder={{
            pt: "Ex: Nutrição esportiva",
            en: "Ex: Sports nutrition",
            it: "Es: Nutrizione sportiva",
          }}
        />
      </div>

      {/* Descrição */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Descrição
        </label>
        <LocalizedTextarea
          name="body"
          defaultValue={area?.body}
          rows={4}
          required
          placeholder={{
            pt: "Tópicos da área, principais demandas...",
            en: "Topics of the practice, common cases...",
            it: "Argomenti dell'area, casi principali...",
          }}
          hint="Mantenha enxuto — 2 a 4 linhas no card."
        />
      </div>

      {/* Ícone — picker visual */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--bg-dark)" }}
        >
          Ícone
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {ICON_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="cursor-pointer aspect-square rounded-lg border p-2 grid place-items-center hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition"
              title={opt.label}
              style={{ borderColor: "var(--border-soft)" }}
            >
              <input
                type="radio"
                name="icon"
                value={opt.value}
                defaultChecked={currentIcon === opt.value}
                className="sr-only"
              />
              <PracticeAreaIcon
                iconKey={opt.value}
                className="w-6 h-6"
                stroke="var(--bg-dark)"
              />
            </label>
          ))}
        </div>
        <p
          className="text-[11px] text-dark mt-2"
          style={{ opacity: 0.6 }}
        >
          Passe o mouse sobre cada ícone para ver o nome. Se nenhum ícone
          combinar perfeitamente, escolha o mais próximo.
        </p>
      </div>

      {/* Destacado + Ordem + Ativo */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <div>
          <label
            htmlFor="displayOrder"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Ordem de exibição
          </label>
          <input
            id="displayOrder"
            name="displayOrder"
            type="number"
            min="0"
            defaultValue={area?.displayOrder ?? 999}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
          <p
            className="text-[11px] text-dark mt-1"
            style={{ opacity: 0.6 }}
          >
            Menor número aparece primeiro.
          </p>
        </div>

        <div className="flex items-center pt-7">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="highlighted"
              defaultChecked={area?.highlighted ?? false}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm" style={{ color: "var(--bg-dark)" }}>
              Destacar (especialidade)
            </span>
          </label>
        </div>

        <div className="flex items-center pt-7">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={area?.isActive ?? true}
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
