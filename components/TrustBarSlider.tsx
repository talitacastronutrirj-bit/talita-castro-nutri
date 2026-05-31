// =================================================================
// TrustBarSlider — banner com slide horizontal contínuo
// =================================================================
//
// Cada item ocupa o banner inteiro. O conteúdo desliza:
// - Entra da direita (translateX 100% → 0)
// - Permanece visível ~3.5s
// - Sai pela esquerda (translateX 0 → -100%)
// - Próximo item entra pela direita simultaneamente
//
// Transição rápida (500ms ease-out), sem fade — visual decisivo
// estilo "news ticker" / banner de aeroporto.
//
// - Pause on hover/focus
// - Bullets clicáveis pra navegação manual
// - Respeita prefers-reduced-motion (mostra só o primeiro estático)
// - Acessível (ARIA live region, keyboard nav)

"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export type TrustBarItem = {
  label: string;
  value: string; // pode conter texto cru — TrustBar.tsx faz o render com flags
  description: string;
  // Pré-renderizado pelo server (com bandeiras SVG quando necessário)
  valueNode: ReactNode;
};

type Props = {
  items: TrustBarItem[];
  /** Tempo em ms entre slides. Default 5000. */
  intervalMs?: number;
};

export default function TrustBarSlider({ items, intervalMs = 5000 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Respeita preferência do usuário por menos movimento
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) setPaused(true);
  }, []);

  // Auto-play
  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setInterval(() => {
      setActive((cur) => (cur + 1) % items.length);
    }, intervalMs);
    return () => clearInterval(t);
  }, [paused, items.length, intervalMs]);

  // Keyboard nav (←/→) quando o container tem foco
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActive((c) => (c - 1 + items.length) % items.length);
      } else if (e.key === "ArrowRight") {
        setActive((c) => (c + 1) % items.length);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section
      ref={containerRef}
      className="bg-darkest text-light relative overflow-hidden border-y"
      style={{ borderColor: "rgba(255, 255, 255, 0.08)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
      aria-roledescription="carrossel"
      aria-label="Destaques"
    >
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 min-h-[160px] md:min-h-[200px] flex items-center justify-center overflow-hidden">
        {/* Slides empilhados — translateX faz slide horizontal.
            Distância "circular" determina posição:
              delta  0 → translateX(0)      → centro, visível
              delta -1 → translateX(-100%)  → saindo pela esquerda
              delta +1 → translateX(100%)   → esperando à direita
              outros: ficam à direita sem transição (escondidos) */}
        <div className="relative w-full" aria-live="polite">
          {items.map((item, idx) => {
            const total = items.length;
            // Distância circular: -1 e +1 são "vizinhos próximos" mesmo
            // quando idx e active estão nas extremidades do array
            let delta = idx - active;
            if (delta > total / 2) delta -= total;
            else if (delta < -total / 2) delta += total;

            const isActive = delta === 0;
            const isLeaving = delta === -1;
            // Itens visíveis (ativo + saindo) animam; outros ficam estáticos
            const shouldAnimate = isActive || isLeaving;

            const translateX = isActive
              ? "0%"
              : isLeaving
                ? "-100%"
                : "100%";

            return (
              <div
                key={idx}
                className="text-center absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  transform: `translateX(${translateX})`,
                  transition: shouldAnimate
                    ? "transform 500ms cubic-bezier(0.4, 0, 0.2, 1)"
                    : "none",
                  pointerEvents: isActive ? "auto" : "none",
                }}
                aria-hidden={!isActive}
              >
                <div className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent mb-3 md:mb-4">
                  {item.label}
                </div>
                <div className="font-serif text-3xl md:text-5xl leading-tight mb-3 md:mb-4 flex items-center justify-center gap-2 flex-wrap">
                  {item.valueNode}
                </div>
                {item.description && (
                  <p className="text-sm md:text-base text-light-soft max-w-2xl mx-auto leading-relaxed px-4">
                    {item.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bullets */}
      {items.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className="block transition-all"
              style={{
                width: idx === active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  idx === active
                    ? "var(--accent)"
                    : "rgba(255, 255, 255, 0.35)",
              }}
              aria-label={`Slide ${idx + 1}`}
              aria-current={idx === active ? "true" : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
