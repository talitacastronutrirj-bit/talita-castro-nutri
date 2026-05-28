// =================================================================
// ColorChoicePicker — escolha entre presets OU cor customizada com alpha
// =================================================================
//
// Usado em /admin/aparencia em campos onde o cliente escolhe uma cor
// (fundo do hero, fundo do card do hero, etc).
//
// Suporta:
// - Grid de presets (ex: "Animado", "Escuro da paleta", "Claro do site")
// - Opção "Customizada" que abre color picker visual + input hex
// - Slider de transparência opcional (gera hex 8 dígitos #rrggbbaa)
//
// O componente gerencia o estado internamente e envia o valor final
// num <input type="hidden" name={fieldName}>.

"use client";

import { useState } from "react";

export type ColorPreset = {
  /** Valor enviado quando esse preset é escolhido (ex: "", "page", "accent") */
  value: string;
  label: string;
  /** CSS background pra preview (cor ou gradient ou var() da paleta) */
  preview: string;
  /** Cor do texto "Aa" no preview */
  previewText: string;
};

type Props = {
  /** Nome do hidden input que vai pro form */
  fieldName: string;
  /** Valor atual do banco (preset name OU hex 6/8) */
  defaultValue: string;
  /** Opções predefinidas mostradas no grid */
  presets: ColorPreset[];
  /** Permite ajuste de transparência (gera hex 8 dígitos) */
  withAlpha?: boolean;
};

export default function ColorChoicePicker({
  fieldName,
  defaultValue,
  presets,
  withAlpha = false,
}: Props) {
  const isHex = /^#[0-9a-fA-F]{6,8}$/.test(defaultValue);

  // Estado: "custom" significa hex livre; outros valores = preset selecionado
  const [selected, setSelected] = useState<string>(
    isHex ? "custom" : defaultValue
  );

  // Cor base hex 6 dígitos (sem alpha)
  const [baseHex, setBaseHex] = useState<string>(() => {
    if (isHex) return defaultValue.slice(0, 7).toLowerCase();
    return "#ffffff";
  });

  // Alpha 0-100. Quando hex 8 dígitos, converte os 2 últimos pra %.
  const [alpha, setAlpha] = useState<number>(() => {
    if (isHex && defaultValue.length === 9) {
      const a = parseInt(defaultValue.slice(7, 9), 16);
      return Math.round((a / 255) * 100);
    }
    return 100;
  });

  // Valor final que vai pro form
  const finalValue =
    selected === "custom"
      ? withAlpha && alpha < 100
        ? `${baseHex}${Math.round((alpha * 255) / 100)
            .toString(16)
            .padStart(2, "0")}`
        : baseHex
      : selected;

  // Preview pra "preview" da opção custom no grid
  const customPreview =
    withAlpha && alpha < 100
      ? `linear-gradient(45deg, #fff 25%, #f0f0f0 25%, #f0f0f0 50%, #fff 50%, #fff 75%, #f0f0f0 75%) 0 0/12px 12px, ${baseHex}`
      : baseHex;

  return (
    <>
      <input type="hidden" name={fieldName} value={finalValue} />

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {presets.map((opt) => (
          <label
            key={opt.value}
            className="cursor-pointer rounded-xl border overflow-hidden hover:border-amber-400 transition"
            style={{
              borderColor:
                selected === opt.value
                  ? "rgb(251, 191, 36)"
                  : "var(--border-soft)",
              boxShadow:
                selected === opt.value
                  ? "0 0 0 2px rgb(251, 191, 36)"
                  : undefined,
            }}
          >
            <input
              type="radio"
              name={`__${fieldName}__preset`}
              value={opt.value}
              checked={selected === opt.value}
              onChange={() => setSelected(opt.value)}
              className="sr-only"
            />
            <div
              className="h-14 grid place-items-center"
              style={{
                background: opt.preview,
                color: opt.previewText,
              }}
            >
              <span className="font-serif text-sm">Aa</span>
            </div>
            <div className="text-[11px] font-medium text-center py-2 text-dark">
              {opt.label}
            </div>
          </label>
        ))}

        {/* Opção custom */}
        <label
          className="cursor-pointer rounded-xl border overflow-hidden hover:border-amber-400 transition"
          style={{
            borderColor:
              selected === "custom"
                ? "rgb(251, 191, 36)"
                : "var(--border-soft)",
            boxShadow:
              selected === "custom"
                ? "0 0 0 2px rgb(251, 191, 36)"
                : undefined,
          }}
        >
          <input
            type="radio"
            name={`__${fieldName}__preset`}
            value="custom"
            checked={selected === "custom"}
            onChange={() => setSelected("custom")}
            className="sr-only"
          />
          <div
            className="h-14 grid place-items-center"
            style={{ background: customPreview, color: "#333" }}
          >
            <span className="font-serif text-sm">Aa</span>
          </div>
          <div className="text-[11px] font-medium text-center py-2 text-dark">
            Customizada
          </div>
        </label>
      </div>

      {/* Painel expandido quando "Customizada" tá selecionado */}
      {selected === "custom" && (
        <div
          className="mt-4 p-4 rounded-xl border space-y-4"
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-page-2)",
          }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="color"
              value={baseHex}
              onChange={(e) => setBaseHex(e.target.value.toLowerCase())}
              className="w-14 h-14 rounded cursor-pointer border-0"
              style={{ padding: 0 }}
              aria-label="Escolher cor"
            />
            <input
              type="text"
              value={baseHex}
              onChange={(e) => {
                const v = e.target.value.toLowerCase();
                if (/^#[0-9a-f]{0,6}$/.test(v)) setBaseHex(v);
              }}
              onBlur={(e) => {
                // Completa o hex se ficou incompleto
                if (!/^#[0-9a-f]{6}$/.test(e.target.value)) {
                  setBaseHex("#ffffff");
                }
              }}
              className="w-32 rounded-lg border px-3 py-2 text-sm font-mono"
              style={{
                borderColor: "var(--border-soft)",
                background: "white",
              }}
              placeholder="#000000"
              pattern="^#[0-9a-fA-F]{6}$"
              aria-label="Hex"
            />

            {/* Preview do resultado final (com alpha aplicado) */}
            <div className="flex items-center gap-2 ml-auto">
              <div
                className="w-10 h-10 rounded border"
                style={{
                  background: `linear-gradient(45deg, #fff 25%, #f0f0f0 25%, #f0f0f0 50%, #fff 50%, #fff 75%, #f0f0f0 75%) 0 0/8px 8px`,
                  borderColor: "var(--border-soft)",
                }}
                aria-hidden
              >
                <div
                  className="w-full h-full rounded"
                  style={{ background: finalValue }}
                />
              </div>
              <span
                className="text-[11px] font-mono text-dark"
                style={{ opacity: 0.7 }}
              >
                {finalValue}
              </span>
            </div>
          </div>

          {withAlpha && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor={`${fieldName}-alpha`}
                  className="text-xs font-medium text-dark"
                >
                  Transparência
                </label>
                <span
                  className="text-xs font-mono text-dark"
                  style={{ opacity: 0.7 }}
                >
                  {alpha}% opaco
                </span>
              </div>
              <input
                id={`${fieldName}-alpha`}
                type="range"
                min={0}
                max={100}
                value={alpha}
                onChange={(e) => setAlpha(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500"
                style={{
                  // Gradient mostrando a cor com alpha real
                  background: `linear-gradient(90deg, transparent, ${baseHex})`,
                }}
              />
              <p
                className="text-[10px] mt-1 text-dark"
                style={{ opacity: 0.55 }}
              >
                0% = totalmente transparente · 100% = cor sólida
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
