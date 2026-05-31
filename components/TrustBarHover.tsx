// =================================================================
// TrustBarHover — 4 colunas que expandem no hover/touch
// =================================================================
//
// Cada coluna no estado normal mostra label + value compactos.
// Ao passar mouse (ou tocar/focar) numa coluna, ela "cresce"
// (flex-grow maior) e revela a descrição completa. As outras
// colunas encolhem proporcionalmente.
//
// Mobile (sem hover): primeira coluna abre por padrão; toque em
// outra alterna a aberta.
//
// Acessibilidade:
// - Cada coluna é um <button> com aria-expanded
// - Foco no teclado também expande
// - Em mobile, sem nada selecionado, todos os textos ficam visíveis
//   (graceful degradation pra evitar layout quebrado)

"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { TrustBarItem } from "./TrustBarSlider";

type Props = {
  items: TrustBarItem[];
};

export default function TrustBarHover({ items }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      className="bg-darkest text-light border-y overflow-hidden"
      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      aria-label="Destaques"
    >
      <div className="max-w-6xl mx-auto px-2 md:px-6">
        <div
          className="flex flex-col md:flex-row items-stretch min-h-[140px] md:min-h-[180px] gap-1"
          // Tira o gap padrão entre colunas em mobile
        >
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => !isTouch && setOpenIdx(idx)}
                onMouseLeave={() => !isTouch && setOpenIdx(null)}
                onFocus={() => setOpenIdx(idx)}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                aria-label={`${item.label} — ${item.value}`}
                className="group text-left appearance-none px-5 md:px-6 py-5 md:py-6 transition-all duration-500 ease-out border-l border-r md:border-l-0 md:border-r-0 md:border-t md:border-b first:border-l-0 last:border-r-0"
                style={{
                  flex: isOpen ? "3 1 0" : "1 1 0",
                  background: isOpen
                    ? "var(--bg-dark-3)"
                    : "transparent",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                <div
                  className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] mb-2 transition-colors"
                  style={{
                    color: isOpen
                      ? "var(--accent-bright)"
                      : "var(--accent)",
                  }}
                >
                  {item.label}
                </div>

                <div
                  className={
                    isOpen
                      ? "font-serif text-2xl md:text-3xl leading-tight flex items-center flex-wrap gap-1"
                      : "font-serif text-xl md:text-2xl leading-tight flex items-center flex-wrap gap-1"
                  }
                  style={{ transition: "font-size 400ms" }}
                >
                  {item.valueNode}
                </div>

                {/* Descrição: aparece com fade quando aberta */}
                <div
                  className="overflow-hidden transition-all duration-500 ease-out"
                  style={{
                    maxHeight: isOpen ? 200 : 0,
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? "0.75rem" : 0,
                  }}
                >
                  {item.description && (
                    <p className="text-sm md:text-[15px] leading-relaxed text-light-soft">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Indicador "clique pra expandir" só em touch e quando fechado */}
                {isTouch && !isOpen && item.description && (
                  <div
                    className="text-[10px] mt-2"
                    style={{ color: "var(--accent-soft)", opacity: 0.7 }}
                  >
                    + tocar para ver mais
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
