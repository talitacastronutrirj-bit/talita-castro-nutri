"use client";

import { useState } from "react";
import type { PaletteSwatch } from "@/lib/palette-colors";

type Props = {
  /** Cor inicial em hex "#rrggbb" ou string vazia */
  defaultValue: string;
  /** Cores oficiais da paleta ativa (pra mostrar como atalhos clicáveis) */
  paletteColors?: PaletteSwatch[];
  /** Nome da paleta ativa (pra exibir no label dos swatches) */
  paletteName?: string;
};

/**
 * Color picker pro accent customizado. Componente client porque precisa
 * de useState pra atualizar o label dinamicamente e botão "Limpar".
 *
 * Backend (action) interpreta valor vazio como "usar accent da paleta".
 *
 * Mostra swatches clicáveis com as cores oficiais da paleta ativa
 * (passadas via paletteColors) pra escolha rápida sem digitar hex.
 */
export default function AccentColorPicker({
  defaultValue,
  paletteColors = [],
  paletteName,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const isCustom = value !== "";

  return (
    <>
      {/* Atalhos: clica numa cor oficial da paleta ativa pra usá-la */}
      {paletteColors.length > 0 && (
        <div className="mb-4">
          <div
            className="text-[11px] uppercase tracking-wider mb-2 text-dark"
            style={{ opacity: 0.7 }}
          >
            Atalhos da paleta {paletteName ? `"${paletteName}"` : "atual"}
          </div>
          <div className="flex gap-2 flex-wrap">
            {paletteColors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setValue(c.hex)}
                className="group flex items-center gap-2 rounded-full border px-2 py-1.5 transition hover:border-amber-400"
                style={{
                  borderColor:
                    value === c.hex
                      ? "var(--accent)"
                      : "var(--border-soft)",
                  background: value === c.hex ? "var(--bg-page-2)" : "transparent",
                }}
                title={`${c.name} (${c.hex})`}
              >
                <span
                  className="w-6 h-6 rounded-full border"
                  style={{
                    background: c.hex,
                    borderColor: "rgba(0,0,0,0.1)",
                  }}
                />
                <span
                  className="text-xs font-medium pr-1"
                  style={{ color: "var(--bg-dark)" }}
                >
                  {c.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <label
          className="relative inline-flex items-center gap-3 cursor-pointer rounded-xl border p-3"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <input
            type="color"
            name="customAccentColor"
            value={value || "#c9a961"}
            onChange={(e) => setValue(e.target.value)}
            className="w-12 h-12 rounded cursor-pointer border-0"
            style={{ padding: 0 }}
          />
          <div>
            <div
              className="font-medium text-sm font-mono"
              style={{ color: "var(--bg-dark)" }}
            >
              {isCustom ? value : "Usando accent da paleta"}
            </div>
            <div
              className="text-[11px] text-dark mt-0.5"
              style={{ opacity: 0.6 }}
            >
              Clique no quadrado pra escolher
            </div>
          </div>
        </label>

        {isCustom && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-xs underline text-dark"
            style={{ opacity: 0.7 }}
          >
            Voltar a usar o accent da paleta
          </button>
        )}
      </div>

      {/* Preview ao vivo das 3 variantes derivadas */}
      <div className="mt-4 grid grid-cols-3 gap-2 max-w-md">
        {[
          { label: "Soft", pct: 70 },
          { label: "Normal", pct: 100 },
          { label: "Hover", pct: 85, dark: true },
        ].map((s) => {
          // Quando isCustom, usa a cor escolhida; senão, var(--accent) da paleta
          const baseColor = isCustom ? value : "var(--accent)";
          const mixWith = s.dark ? "black" : "white";
          const background =
            s.pct === 100
              ? baseColor
              : `color-mix(in srgb, ${baseColor} ${s.pct}%, ${mixWith})`;
          return (
            <div
              key={s.label}
              className="rounded-lg p-2 text-center transition-colors"
              style={{
                background,
                color: "white",
                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
              }}
            >
              <div className="text-[10px] uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
