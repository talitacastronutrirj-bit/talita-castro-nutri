import Link from "next/link";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";
import {
  HOW_IT_WORKS_ICONS,
  type HowItWorksStep,
} from "@/lib/how-it-works";
import { StepIcon } from "@/components/HowItWorks";

type Props = {
  action: (formData: FormData) => Promise<void>;
  item?: HowItWorksStep;
  cancelHref: string;
  submitLabel: string;
};

// Labels human-readable pros ícones (PT — admin é mono-idioma).
const ICON_LABELS: Record<(typeof HOW_IT_WORKS_ICONS)[number], string> = {
  calendar: "Agendamento",
  videoCall: "Videochamada",
  document: "Documento / Plano",
  chat: "Mensagem / WhatsApp",
  globe: "Internacional",
  heart: "Cuidado contínuo",
  checkList: "Avaliação / Anamnese",
  creditCard: "Pagamento",
  clock: "Fuso horário",
  shoppingBag: "Lista de compras",
};

export default function HowItWorksForm({
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

      {/* Seletor de ícone */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--bg-dark)" }}
        >
          Ícone do card
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {HOW_IT_WORKS_ICONS.map((key) => (
            <label
              key={key}
              className="cursor-pointer rounded-xl border p-3 hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <input
                type="radio"
                name="iconKey"
                value={key}
                defaultChecked={(item?.iconKey ?? "calendar") === key}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-9 h-9 rounded-full grid place-items-center"
                  style={{ background: "var(--accent)" }}
                >
                  <StepIcon
                    iconKey={key}
                    className="w-5 h-5"
                    stroke="var(--bg-dark)"
                  />
                </div>
                <span
                  className="text-[10px] text-center leading-tight"
                  style={{ color: "var(--bg-dark)" }}
                >
                  {ICON_LABELS[key]}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Título */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Título do card
        </label>
        <LocalizedInput
          name="title"
          defaultValue={item?.title}
          required
          placeholder={{
            pt: "Ex: Agendamento",
            en: "Ex: Booking",
            it: "Es: Prenotazione",
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
          name="description"
          defaultValue={item?.description}
          rows={4}
          required
          placeholder={{
            pt: "Como você agenda, no fuso da sua região...",
            en: "How you book, in your timezone...",
            it: "Come prenoti, nel tuo fuso orario...",
          }}
          hint="2-4 linhas. Quebras de linha são preservadas."
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
