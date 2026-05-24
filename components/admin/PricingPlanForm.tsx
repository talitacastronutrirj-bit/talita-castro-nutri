import Link from "next/link";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";
import type { PricingPlan } from "@/lib/pricing";

type Props = {
  action: (formData: FormData) => Promise<void>;
  plan?: PricingPlan;
  cancelHref: string;
  submitLabel: string;
};

const CURRENCIES = [
  { value: "BRL", label: "R$ — Real (BRL)" },
  { value: "USD", label: "$ — Dólar (USD)" },
  { value: "EUR", label: "€ — Euro (EUR)" },
  { value: "GBP", label: "£ — Libra (GBP)" },
  { value: "CAD", label: "C$ — Dólar canadense (CAD)" },
  { value: "AUD", label: "A$ — Dólar australiano (AUD)" },
];

export default function PricingPlanForm({
  action,
  plan,
  cancelHref,
  submitLabel,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border bg-page p-6 md:p-8"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {plan && <input type="hidden" name="id" value={plan.id} />}

      {/* Nome do plano */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Nome do plano
        </label>
        <LocalizedInput
          name="name"
          defaultValue={plan?.name}
          required
          placeholder={{
            pt: "Ex: Acompanhamento mensal",
            en: "Ex: Monthly follow-up",
            it: "Es: Monitoraggio mensile",
          }}
        />
      </div>

      {/* Descrição curta */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Descrição curta
        </label>
        <LocalizedTextarea
          name="description"
          defaultValue={plan?.description}
          rows={2}
          placeholder={{
            pt: "Ex: Plano para quem quer acompanhamento contínuo",
            en: "Ex: Plan for ongoing personalized support",
            it: "Es: Piano per chi cerca supporto continuo",
          }}
        />
      </div>

      {/* Preço + moeda + sufixo */}
      <div className="grid sm:grid-cols-12 gap-4">
        <div className="sm:col-span-3">
          <label
            htmlFor="price"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Preço
          </label>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={plan?.price ?? 0}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div className="sm:col-span-4">
          <label
            htmlFor="currency"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Moeda
          </label>
          <select
            id="currency"
            name="currency"
            defaultValue={plan?.currency ?? "BRL"}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          >
            {CURRENCIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-5">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Sufixo do preço{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (ex: &quot;/ mês&quot;)
            </span>
          </label>
          <LocalizedInput
            name="priceSuffix"
            defaultValue={plan?.priceSuffix}
            placeholder={{
              pt: "/ mês",
              en: "/ month",
              it: "/ mese",
            }}
            maxLength={40}
          />
        </div>
      </div>

      {/* Features (uma por linha) */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Features incluídas{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (uma por linha)
          </span>
        </label>
        <LocalizedTextarea
          name="features"
          defaultValue={plan?.features}
          rows={6}
          placeholder={{
            pt: "Consulta inicial de 60 min\nPlano alimentar personalizado\nAcompanhamento por WhatsApp\nRevisão mensal",
            en: "Initial 60-min consultation\nPersonalized meal plan\nWhatsApp follow-up\nMonthly review",
            it: "Consulenza iniziale 60 min\nPiano alimentare personalizzato\nFollow-up via WhatsApp\nRevisione mensile",
          }}
          hint="Cada linha vira um bullet. Use traços/asteriscos no início se quiser (são removidos automaticamente)."
        />
      </div>

      {/* CTA */}
      <div className="grid sm:grid-cols-12 gap-4">
        <div className="sm:col-span-5">
          <label
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Texto do botão
          </label>
          <LocalizedInput
            name="ctaText"
            defaultValue={plan?.ctaText}
            placeholder={{
              pt: "Agendar consulta",
              en: "Schedule consultation",
              it: "Prenota consulenza",
            }}
            maxLength={40}
          />
        </div>

        <div className="sm:col-span-7">
          <label
            htmlFor="ctaLink"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Link do botão{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              (WhatsApp, Calendly, mailto, etc)
            </span>
          </label>
          <input
            id="ctaLink"
            name="ctaLink"
            type="url"
            defaultValue={plan?.ctaLink ?? ""}
            placeholder="https://wa.me/55... ou https://calendly.com/..."
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>
      </div>

      {/* Destaque + Ordem + Ativo */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
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
            defaultValue={plan?.displayOrder ?? 999}
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
              name="isFeatured"
              defaultChecked={plan?.isFeatured ?? false}
              className="w-4 h-4 accent-amber-500"
            />
            <span className="text-sm" style={{ color: "var(--bg-dark)" }}>
              Destaque (★ Recomendado)
            </span>
          </label>
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              defaultChecked={plan?.isActive ?? true}
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
