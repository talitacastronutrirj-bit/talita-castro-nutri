import Link from "next/link";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";
import type { FaqItem } from "@/lib/faq";

type Props = {
  action: (formData: FormData) => Promise<void>;
  item?: FaqItem;
  cancelHref: string;
  submitLabel: string;
};

export default function FaqItemForm({
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

      {/* Pergunta */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Pergunta
        </label>
        <LocalizedInput
          name="question"
          defaultValue={item?.question}
          required
          placeholder={{
            pt: "Ex: Como funciona a consulta online?",
            en: "Ex: How does the online consultation work?",
            it: "Es: Come funziona la consulenza online?",
          }}
        />
      </div>

      {/* Resposta */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Resposta
        </label>
        <LocalizedTextarea
          name="answer"
          defaultValue={item?.answer}
          rows={5}
          required
          placeholder={{
            pt: "Resposta direta, em 3-5 linhas...",
            en: "Direct answer, 3-5 lines...",
            it: "Risposta diretta, 3-5 righe...",
          }}
          hint="Quebras de linha são preservadas."
        />
      </div>

      {/* Ordem + Ativo */}
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
            defaultValue={item?.displayOrder ?? 999}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div className="sm:col-span-2 flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={item?.isActive ?? true}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm" style={{ color: "var(--bg-dark)" }}>
              Mostrar no site (ativo)
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
