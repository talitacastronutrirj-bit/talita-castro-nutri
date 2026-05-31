import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  LocalizedInput,
  LocalizedTextarea,
} from "@/components/admin/LocalizedInput";
import AccentColorPicker from "@/components/admin/AccentColorPicker";
import ColorChoicePicker from "@/components/admin/ColorChoicePicker";
import { getSiteSettings } from "@/lib/settings";
import { PALETTE_COLORS } from "@/lib/palette-colors";
import { saveAppearance } from "./actions";

export const metadata = { title: "Aparência" };

const PALETTE_OPTIONS = [
  // Institucionais (formal, B2B, jurídico, finanças)
  { value: "navy", label: "Marinho clássico", swatch: "#0c1f3d", accent: "#c9a961", group: "institutional" },
  { value: "emerald", label: "Verde institucional", swatch: "#064e3b", accent: "#b08d57", group: "institutional" },
  { value: "black", label: "Preto & Dourado", swatch: "#0a0a0a", accent: "#c9a161", group: "institutional" },
  { value: "wine", label: "Vinho & Dourado", swatch: "#5c1a1b", accent: "#c9a161", group: "institutional" },
  { value: "graphite", label: "Grafite & Bronze", swatch: "#2c3036", accent: "#b07b3a", group: "institutional" },
  { value: "coffee", label: "Café & Creme", swatch: "#3d2914", accent: "#d4a574", group: "institutional" },
  // Pastel (saúde, wellness, beleza, terapia, nutrição)
  { value: "sage", label: "Sage (sálvia & nude)", swatch: "#6b8e6b", accent: "#b89978", group: "pastel" },
  { value: "blush", label: "Blush (rosa pó & nude)", swatch: "#b08b85", accent: "#c4977f", group: "pastel" },
  { value: "honey", label: "Honey (mel & terracota)", swatch: "#c89968", accent: "#c97a5a", group: "pastel" },
  { value: "mint", label: "Mint (menta & rose gold)", swatch: "#7ab8a0", accent: "#c89690", group: "pastel" },
  // Vibrantes (saúde com alto contraste — nutri, derma, estética)
  { value: "rouge", label: "Rouge (cereja & sage)", swatch: "#691c29", accent: "#b63249", group: "vibrant" },
] as const;

const ENTRANCE_OPTIONS = [
  { value: "none", label: "Sem efeito" },
  { value: "fade", label: "Fade in" },
  { value: "slide", label: "Slide vindo de baixo" },
  { value: "zoom", label: "Zoom suave" },
  { value: "rotate", label: "Rotação suave" },
  { value: "spin", label: "Spin 360°" },
] as const;

const IDLE_OPTIONS = [
  { value: "none", label: "Sem efeito" },
  { value: "float", label: "Flutuação contínua" },
  { value: "pulse", label: "Pulse contínuo" },
  { value: "slowrotate", label: "Rotação lenta contínua" },
] as const;

export default async function AppearancePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Aparência
        </h2>
        <Link
          href="/admin"
          className="text-sm text-dark hover:opacity-70"
          style={{ opacity: 0.7 }}
        >
          ← Voltar
        </Link>
      </div>

      {saved && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Configurações salvas. As alterações já estão no site público.
        </div>
      )}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Valor inválido em &quot;{error}&quot;. Verifique e tente novamente.
        </div>
      )}

      <form
        action={saveAppearance}
        className="space-y-8 rounded-2xl border bg-page p-6 md:p-8"
        style={{ borderColor: "var(--border-soft)" }}
      >
        {/* ============ IDENTIFICAÇÃO DO PROFISSIONAL ============ */}
        <section>
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Identificação
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Seus dados profissionais. Aparecem no Header, Footer, metadata
            (Google) e no botão flutuante de WhatsApp.
          </p>

          <div className="space-y-4">
            {/* Logo */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--bg-dark)" }}
              >
                Logo da marca{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (aparece no Header e Footer)
                </span>
              </label>
              <ImageUpload
                name="logoUrl"
                context="hero"
                aspectRatio="wide"
                defaultValue={settings.logoUrl}
                label="Selecionar logo"
              />
              <p
                className="text-[11px] text-dark mt-1.5"
                style={{ opacity: 0.6 }}
              >
                Idealmente PNG ou SVG com fundo transparente. Se vazio, usa
                <code> /images/logo.svg </code> (placeholder do template).
                <br />
                <strong>Não é o mesmo</strong> da imagem do hero — esse logo
                aparece no topo do site em todas as páginas.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="siteName"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Nome completo / nome do negócio
                </label>
                <input
                  id="siteName"
                  name="siteName"
                  type="text"
                  defaultValue={settings.siteName}
                  placeholder="Ex: Talita Castro · Nutricionista"
                  className="block w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="siteShortName"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Nome curto{" "}
                  <span
                    className="font-normal text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    (atalho usado em copyright)
                  </span>
                </label>
                <input
                  id="siteShortName"
                  name="siteShortName"
                  type="text"
                  defaultValue={settings.siteShortName}
                  placeholder="Ex: Talita Castro"
                  className="block w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="contactEmail"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Email institucional
                </label>
                <input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={settings.contactEmail}
                  placeholder="contato@exemplo.com"
                  className="block w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="credentialType"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Tipo de credencial{" "}
                  <span
                    className="font-normal text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    (CRN, OAB, CRM, CREA…)
                  </span>
                </label>
                <input
                  id="credentialType"
                  name="credentialType"
                  type="text"
                  defaultValue={settings.credentialType}
                  placeholder="Ex: CRN-4"
                  maxLength={16}
                  className="block w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="credentialNumbers"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Números da credencial{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (um por linha)
                </span>
              </label>
              <textarea
                id="credentialNumbers"
                name="credentialNumbers"
                rows={2}
                defaultValue={settings.credentialNumbers.join("\n")}
                placeholder="12345&#10;67890"
                className="block w-full rounded-lg border px-3 py-2 text-sm font-mono"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="primaryWhatsappNumber"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  WhatsApp{" "}
                  <span
                    className="font-normal text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    (DDI+DDD+número, só dígitos)
                  </span>
                </label>
                <input
                  id="primaryWhatsappNumber"
                  name="primaryWhatsappNumber"
                  type="text"
                  defaultValue={settings.primaryWhatsappNumber}
                  placeholder="Ex: 5521987654321"
                  pattern="\d*"
                  className="block w-full rounded-lg border px-3 py-2 text-sm font-mono"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="primaryWhatsappDisplay"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--bg-dark)" }}
                >
                  WhatsApp formatado{" "}
                  <span
                    className="font-normal text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    (como aparece pro usuário)
                  </span>
                </label>
                <input
                  id="primaryWhatsappDisplay"
                  name="primaryWhatsappDisplay"
                  type="text"
                  defaultValue={settings.primaryWhatsappDisplay}
                  placeholder="Ex: (21) 98765-4321"
                  className="block w-full rounded-lg border px-3 py-2 text-sm"
                  style={{
                    borderColor: "var(--border-soft)",
                    background: "white",
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============ PALETA ============ */}
        <section className="pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Paleta de cores
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Define o esquema de cores do site inteiro. Paletas pastel
            usam tipografia mais delicada (Playfair Display) e elementos
            decorativos sutis — ideais pra saúde, wellness e beleza.
          </p>

          {(["vibrant", "pastel", "institutional"] as const).map((group) => {
            const items = PALETTE_OPTIONS.filter((o) => o.group === group);
            if (items.length === 0) return null;
            const label =
              group === "vibrant"
                ? "Vibrante · saúde com alto contraste"
                : group === "pastel"
                  ? "Pastel · saúde, wellness, beleza (cores suaves)"
                  : "Institucional · formal, jurídico, finanças";
            return (
              <div key={group} className="mb-6 last:mb-0">
                <div
                  className="text-[11px] uppercase tracking-[0.2em] mb-3"
                  style={{ color: "var(--bg-dark)", opacity: 0.6 }}
                >
                  {label}
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  {items.map((opt) => (
                    <label
                      key={opt.value}
                      className="cursor-pointer rounded-xl border p-4 hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition"
                      style={{ borderColor: "var(--border-soft)" }}
                    >
                      <input
                        type="radio"
                        name="palette"
                        value={opt.value}
                        defaultChecked={settings.palette === opt.value}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="w-8 h-8 rounded-full ring-2"
                          style={{
                            background: opt.swatch,
                            boxShadow: `inset 0 0 0 3px ${opt.accent}`,
                          }}
                        />
                        <span
                          className="font-medium text-sm"
                          style={{ color: "var(--bg-dark)" }}
                        >
                          {opt.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Intensidade da paleta — slider de 3 stops */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
            <h4
              className="font-serif text-base font-semibold mb-1"
              style={{ color: "var(--bg-dark)" }}
            >
              Intensidade das cores
            </h4>
            <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
              Ajusta a intensidade da paleta sem trocar de cor. Suave deixa
              o site mais lavado/sereno; Vibrante traz mais punch e contraste.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    value: "soft",
                    label: "Suave",
                    description: "Mais lavado, sereno",
                  },
                  {
                    value: "normal",
                    label: "Normal",
                    description: "Cores da paleta",
                  },
                  {
                    value: "vibrant",
                    label: "Vibrante",
                    description: "Mais punch, contraste",
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="cursor-pointer rounded-xl border p-3 hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition text-center"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <input
                    type="radio"
                    name="paletteIntensity"
                    value={opt.value}
                    defaultChecked={settings.paletteIntensity === opt.value}
                    className="sr-only"
                  />
                  <div
                    className="font-medium text-sm"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {opt.label}
                  </div>
                  <div
                    className="text-[11px] mt-0.5 text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    {opt.description}
                  </div>
                </label>
              ))}
            </div>

            {/* Barra visual sugerindo o slider */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-dark" style={{ opacity: 0.5 }}>
                Suave
              </span>
              <div
                className="flex-1 h-1.5 rounded-full"
                style={{
                  background: `linear-gradient(90deg,
                    color-mix(in srgb, var(--accent) 65%, white) 0%,
                    var(--accent) 50%,
                    color-mix(in srgb, var(--accent) 85%, black) 100%)`,
                }}
              />
              <span className="text-[10px] uppercase tracking-wider text-dark" style={{ opacity: 0.5 }}>
                Vibrante
              </span>
            </div>
          </div>

          {/* ─── COR DOS DETALHES (accent custom) ─── */}
          <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--border-soft)" }}>
            <h4
              className="font-serif text-base font-semibold mb-1"
              style={{ color: "var(--bg-dark)" }}
            >
              Cor dos detalhes
            </h4>
            <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
              Cor de destaque usada em botões, links, separadores e ícones.
              Por padrão herda da paleta escolhida acima. Mude pra qualquer
              cor — variantes (hover, claro, brilhante) são geradas automaticamente.
            </p>

            <AccentColorPicker
              defaultValue={settings.customAccentColor}
              paletteColors={PALETTE_COLORS[settings.palette] ?? []}
              paletteName={
                PALETTE_OPTIONS.find((p) => p.value === settings.palette)
                  ?.label ?? settings.palette
              }
            />
          </div>
        </section>

        {/* ============ TEXTOS DO HERO ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Textos do hero
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Os 3 textos que aparecem no topo do site. Edite em cada idioma
            usando as abas. Se deixar vazio em algum idioma, o site cai pro
            português como fallback.
          </p>

          <div className="space-y-6">
            <LocalizedInput
              name="heroEyebrow"
              defaultValue={settings.heroEyebrow}
              label={
                <>
                  Texto pequeno superior{" "}
                  <span
                    className="font-normal text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    (eyebrow, todo em maiúsculas no site)
                  </span>
                </>
              }
              maxLength={80}
              placeholder={{
                pt: "Atendimento online · Brasil e exterior",
                en: "Online consultation · Worldwide",
                it: "Consulenza online · Italia e estero",
              }}
            />

            <LocalizedTextarea
              name="heroHeading"
              defaultValue={settings.heroHeading}
              label="Título grande do hero"
              rows={4}
              placeholder={{
                pt: "Linha 1,\nlinha 2\n*destaque dourado*.",
                en: "Line 1,\nline 2\n*golden highlight*.",
                it: "Riga 1,\nriga 2\n*evidenza dorata*.",
              }}
              hint={
                <>
                  Pressione Enter para quebrar linha. Coloque a parte em
                  destaque entre asteriscos: <code>*texto destacado*</code> —
                  fica em itálico dourado.
                </>
              }
            />

            <LocalizedTextarea
              name="heroDescription"
              defaultValue={settings.heroDescription}
              label="Descrição (parágrafo abaixo do título)"
              rows={4}
              placeholder={{
                pt: "Descrição curta do atendimento e diferenciais...",
                en: "Short description of services and differentials...",
                it: "Breve descrizione del servizio e dei punti di forza...",
              }}
              hint="Quebras de linha são preservadas. Mantenha o texto enxuto (idealmente até 3 linhas) para não estourar o layout."
            />
          </div>
        </section>

        {/* ============ BARRA DE DESTAQUE (TRUST BAR) ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Banner de destaques (abaixo do hero)
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Faixa escura com até 4 destaques. Cada item tem 3 campos:{" "}
            <strong>Título</strong> (eyebrow pequeno), <strong>Destaque</strong>{" "}
            (grande — aceita emojis e bandeiras 🇧🇷 🇺🇸 🇮🇹) e{" "}
            <strong>Descrição</strong> (subtexto explicativo). Deixe o destaque
            vazio para esconder aquele slot.
          </p>

          {/* Seletor de modo de apresentação */}
          <div className="mb-6">
            <div
              className="text-[11px] uppercase tracking-widest mb-2 font-medium"
              style={{ color: "var(--bg-dark)", opacity: 0.7 }}
            >
              Estilo do banner
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    value: "hover",
                    label: "Hover expansivo",
                    description:
                      "4 colunas lado a lado. Passar o mouse (ou tocar no celular) numa coluna expande ela e revela a descrição. Mais elegante, sem auto-play.",
                  },
                  {
                    value: "slider",
                    label: "Slider rotativo",
                    description:
                      "1 destaque grande por vez, ocupa o banner inteiro. Roda automaticamente a cada 5s com fade. Visual mais impactante.",
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="cursor-pointer rounded-xl border p-4 hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <input
                    type="radio"
                    name="trustBarMode"
                    value={opt.value}
                    defaultChecked={settings.trustBarMode === opt.value}
                    className="sr-only"
                  />
                  <div
                    className="font-medium text-sm mb-1"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {opt.label}
                  </div>
                  <div
                    className="text-[11px] leading-relaxed text-dark"
                    style={{ opacity: 0.7 }}
                  >
                    {opt.description}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {([1, 2, 3, 4] as const).map((n) => {
              const labelKey = `trustBar${n}Label` as keyof typeof settings;
              const valueKey = `trustBar${n}Value` as keyof typeof settings;
              const descKey = `trustBar${n}Description` as keyof typeof settings;
              const label = settings[labelKey] as typeof settings.trustBar1Label;
              const value = settings[valueKey] as typeof settings.trustBar1Value;
              const description = settings[descKey] as typeof settings.trustBar1Description;
              return (
                <div
                  key={n}
                  className="space-y-3 pb-5 border-b last:border-b-0"
                  style={{ borderColor: "var(--border-soft)" }}
                >
                  <div
                    className="text-[11px] uppercase tracking-widest font-medium"
                    style={{ color: "var(--accent)" }}
                  >
                    Slide {n}
                  </div>
                  <div className="grid sm:grid-cols-12 gap-3 items-start">
                    <div className="sm:col-span-4">
                      <LocalizedInput
                        name={`trustBar${n}Label`}
                        defaultValue={label}
                        label="Título (eyebrow)"
                        maxLength={40}
                      />
                    </div>
                    <div className="sm:col-span-8">
                      <LocalizedInput
                        name={`trustBar${n}Value`}
                        defaultValue={value}
                        label="Destaque (grande)"
                        maxLength={80}
                      />
                    </div>
                  </div>
                  <LocalizedTextarea
                    name={`trustBar${n}Description`}
                    defaultValue={description}
                    rows={2}
                    label={
                      <>
                        Descrição{" "}
                        <span
                          className="font-normal text-dark"
                          style={{ opacity: 0.6 }}
                        >
                          (opcional — explicação curta abaixo do destaque)
                        </span>
                      </>
                    }
                    maxLength={200}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ============ BOOKING (WhatsApp / Calendly) ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Booking / Agendamento
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Como o site capta novos contatos. WhatsApp é o default mais
            simples. Calendly permite que o cliente agende horário sozinho
            direto no site.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="bookingMode"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Modo de booking
              </label>
              <select
                id="bookingMode"
                name="bookingMode"
                defaultValue={settings.bookingMode}
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              >
                <option value="whatsapp">
                  Apenas WhatsApp (cliente fala via WhatsApp)
                </option>
                <option value="calendly">
                  Apenas Calendly (cliente agenda direto no site)
                </option>
                <option value="both">
                  Ambos (WhatsApp + Calendly lado a lado)
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="calendlyUrl"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                URL do Calendly{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (obrigatório se usar &quot;Calendly&quot; ou
                  &quot;Ambos&quot;)
                </span>
              </label>
              <input
                id="calendlyUrl"
                name="calendlyUrl"
                type="url"
                defaultValue={settings.calendlyUrl}
                placeholder="https://calendly.com/seu-nome/consulta-30min"
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
              <p
                className="text-[11px] text-dark mt-1.5"
                style={{ opacity: 0.6 }}
              >
                Crie em calendly.com (plano grátis), publique um tipo de
                evento e cole a URL pública aqui.
              </p>
            </div>
          </div>
        </section>

        {/* ============ REDES SOCIAIS ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Redes sociais
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            URLs das redes sociais. Os ícones aparecem no rodapé do site
            apenas se o link estiver preenchido.
          </p>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="instagramUrl"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Instagram
              </label>
              <input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                defaultValue={settings.instagramUrl}
                placeholder="https://www.instagram.com/seuperfil/"
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="facebookUrl"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Facebook
              </label>
              <input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={settings.facebookUrl}
                placeholder="https://www.facebook.com/suapagina/"
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="linkedinUrl"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                LinkedIn{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (opcional)
                </span>
              </label>
              <input
                id="linkedinUrl"
                name="linkedinUrl"
                type="url"
                defaultValue={settings.linkedinUrl}
                placeholder="https://www.linkedin.com/company/sua-empresa/"
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
            </div>
          </div>
        </section>

        {/* ============ HERO (CARD VISUAL) ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Hero — imagens
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Hero é o topo do site (primeira coisa que o visitante vê).
            Aqui você configura:
            <br />
            1. <strong>Card lateral</strong> (lado direito) — pode mostrar
            seu logo animado OU uma foto que você escolher.
            <br />
            2. <strong>Imagem de fundo</strong> (atrás dos textos) — opcional,
            uma foto que cobre toda a área do hero.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3">
              <label
                className="flex-1 cursor-pointer rounded-xl border p-4 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <input
                  type="radio"
                  name="heroMode"
                  value="logo"
                  defaultChecked={settings.heroMode === "logo"}
                  className="sr-only"
                />
                <div
                  className="font-medium text-sm mb-1"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Logo do site
                </div>
                <div className="text-xs text-dark" style={{ opacity: 0.7 }}>
                  Mostra o logo configurado acima com efeitos animados.
                </div>
              </label>

              <label
                className="flex-1 cursor-pointer rounded-xl border p-4 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <input
                  type="radio"
                  name="heroMode"
                  value="image"
                  defaultChecked={settings.heroMode === "image"}
                  className="sr-only"
                />
                <div
                  className="font-medium text-sm mb-1"
                  style={{ color: "var(--bg-dark)" }}
                >
                  Imagem personalizada
                </div>
                <div className="text-xs text-dark" style={{ opacity: 0.7 }}>
                  Substitui pela imagem que você fornecer (URL abaixo, ou
                  upload na próxima fase).
                </div>
              </label>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--bg-dark)" }}
              >
                ① Foto do card lateral do hero{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (só usada se &quot;Imagem personalizada&quot; está marcada
                  acima)
                </span>
              </label>
              <ImageUpload
                name="heroImageUrl"
                context="hero"
                aspectRatio="wide"
                defaultValue={settings.heroImageUrl}
                label="Selecionar foto do card"
              />
              <p
                className="text-[11px] text-dark mt-2"
                style={{ opacity: 0.6 }}
              >
                Foto vertical funciona melhor (card é 4:5). Pode ser uma
                foto sua, do consultório, ou de algo simbólico. Ignorada
                se o modo acima for &quot;Logo do site&quot;.
              </p>
            </div>

            {/* Toggle: mostrar o card (retângulo) ou logo solta */}
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="heroCardEnabled"
                  defaultChecked={settings.heroCardEnabled}
                  className="mt-1 w-4 h-4 cursor-pointer accent-amber-500"
                />
                <div>
                  <div
                    className="font-medium text-sm"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    Mostrar moldura do card lateral
                  </div>
                  <div
                    className="text-[11px] text-dark mt-1 leading-relaxed"
                    style={{ opacity: 0.7 }}
                  >
                    Quando marcado, a logo (ou foto) aparece dentro de um
                    retângulo arredondado com borda e sombra. <br />
                    Desmarque pra deixar a logo &quot;solta&quot; flutuando,
                    sem moldura — visual mais minimalista.
                  </div>
                </div>
              </label>
            </div>

            {/* Cor de fundo do card (visível quando modo=logo, ou sem foto) */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--bg-dark)" }}
              >
                Cor de fundo do card lateral{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (ignorada se a moldura está desativada acima)
                </span>
              </label>
              <p
                className="text-[11px] text-dark mb-3"
                style={{ opacity: 0.6 }}
              >
                Aparece atrás do logo (quando modo=logo) ou como fallback
                quando não há foto. Escolha uma cor da paleta ou um hex livre.
              </p>

              <ColorChoicePicker
                fieldName="heroCardBackground"
                defaultValue={settings.heroCardBackground}
                withAlpha
                presets={[
                  {
                    value: "",
                    label: "Padrão (escuro)",
                    preview: "var(--bg-dark)",
                    previewText: "var(--text-light)",
                  },
                  {
                    value: "page",
                    label: "Claro do site",
                    preview: "var(--bg-page)",
                    previewText: "var(--text-dark)",
                  },
                  {
                    value: "accent",
                    label: "Accent",
                    preview: "var(--accent)",
                    previewText: "white",
                  },
                ]}
              />
            </div>

            {/* Cor sólida fixa do fundo do hero (sobrescreve a foto + cross-fade) */}
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--bg-dark)" }}
              >
                ② Cor sólida do fundo do hero{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (substitui a animação por uma cor fixa)
                </span>
              </label>
              <p
                className="text-[11px] text-dark mb-3"
                style={{ opacity: 0.6 }}
              >
                Por padrão o fundo do hero tem uma foto + animação suave
                alternando entre 2 cores da paleta. Escolha uma opção abaixo
                pra deixar uma <strong>cor fixa</strong> em vez disso. A foto
                de fundo (item ③ abaixo) é ignorada quando você escolhe cor sólida.
              </p>

              <ColorChoicePicker
                fieldName="heroBackgroundColor"
                defaultValue={settings.heroBackgroundColor}
                withAlpha
                presets={[
                  {
                    value: "",
                    label: "Animado (padrão)",
                    preview:
                      "linear-gradient(135deg, var(--bg-dark) 0%, var(--accent-soft) 100%)",
                    previewText: "white",
                  },
                  {
                    value: "dark",
                    label: "Escuro da paleta",
                    preview: "var(--bg-dark)",
                    previewText: "var(--text-light)",
                  },
                  {
                    value: "page",
                    label: "Claro do site",
                    preview: "var(--bg-page)",
                    previewText: "var(--text-dark)",
                  },
                  {
                    value: "accent",
                    label: "Accent",
                    preview: "var(--accent)",
                    previewText: "white",
                  },
                ]}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--bg-dark)" }}
              >
                ③ Foto de FUNDO do hero{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (atrás de TODO o hero — só se cor sólida acima for &quot;Animado&quot;)
                </span>
              </label>
              <ImageUpload
                name="heroBackgroundUrl"
                context="hero"
                aspectRatio="wide"
                defaultValue={settings.heroBackgroundUrl}
                label="Selecionar foto de fundo"
              />
              <p
                className="text-[11px] text-dark mt-2"
                style={{ opacity: 0.6 }}
              >
                Aparece atrás dos textos do hero (com sobreposição da paleta
                pra garantir legibilidade). Se vazio, usa a imagem padrão do
                template (ingredientes frescos). <strong>Dica:</strong> escolha
                fotos horizontais com bastante área neutra. Em paletas pastel
                (sage/blush/honey/mint), a imagem é ignorada — usa só o
                gradient da paleta.
              </p>
            </div>
          </div>
        </section>

        {/* ============ LAYOUT EQUIPE/SOBRE ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Layout da seção Equipe
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Quando você cadastra <strong>1 só profissional</strong> na Equipe
            (atendimento autônomo), o site pode apresentar como &quot;Sobre&quot;
            em vez de &quot;Equipe&quot;. Quando há 2+ profissionais, sempre
            usa grid. Esta opção só afeta o caso solo.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            {(
              [
                {
                  value: "about-centered",
                  label: "Centralizada com hover",
                  description:
                    "Foto grande centralizada. Nome e bio aparecem com efeito quando passa o mouse / toca.",
                },
                {
                  value: "about-side",
                  label: "Foto à esquerda + bio",
                  description:
                    "Foto à esquerda e bio em texto visível à direita (lado a lado).",
                },
                {
                  value: "team",
                  label: "Grid de equipe",
                  description:
                    "Mantém o layout de cards (mesmo solo). Útil se vai adicionar mais pessoas em breve.",
                },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="cursor-pointer rounded-xl border p-4 hover:border-amber-400 has-[:checked]:ring-2 has-[:checked]:ring-amber-400 has-[:checked]:border-amber-400 transition"
                style={{ borderColor: "var(--border-soft)" }}
              >
                <input
                  type="radio"
                  name="teamSoloLayout"
                  value={opt.value}
                  defaultChecked={settings.teamSoloLayout === opt.value}
                  className="sr-only"
                />
                <div
                  className="font-medium text-sm mb-1"
                  style={{ color: "var(--bg-dark)" }}
                >
                  {opt.label}
                </div>
                <div
                  className="text-[11px] leading-relaxed text-dark"
                  style={{ opacity: 0.7 }}
                >
                  {opt.description}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* ============ EFEITOS DA LOGO ============ */}
        <section
          className="pt-6 border-t"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-1"
            style={{ color: "var(--bg-dark)" }}
          >
            Efeitos da logo no hero
          </h3>
          <p className="text-xs text-dark mb-4" style={{ opacity: 0.7 }}>
            Aplicados quando o hero está no modo &quot;Logo&quot;. Sem efeito
            quando em modo &quot;Imagem&quot;.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="heroLogoEntrance"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Entrada{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (toca 1× ao abrir)
                </span>
              </label>
              <select
                id="heroLogoEntrance"
                name="heroLogoEntrance"
                defaultValue={settings.heroLogoEntrance}
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              >
                {ENTRANCE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="heroLogoIdle"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Contínuo{" "}
                <span
                  className="font-normal text-dark"
                  style={{ opacity: 0.6 }}
                >
                  (loop)
                </span>
              </label>
              <select
                id="heroLogoIdle"
                name="heroLogoIdle"
                defaultValue={settings.heroLogoIdle}
                className="block w-full rounded-lg border px-3 py-2 text-sm"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              >
                {IDLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ============ AÇÕES ============ */}
        <div
          className="flex items-center justify-end gap-3 border-t pt-6"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <Link
            href="/admin"
            className="rounded border px-4 py-2 text-sm hover:bg-page-2"
            style={{ borderColor: "var(--border-soft)" }}
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
