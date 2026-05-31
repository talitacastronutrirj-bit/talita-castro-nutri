// =================================================================
// TrustBarSlider — banner rotativo com auto-play + bullets
// =================================================================
//
// Substitui o grid estático antigo. Cada item ocupa o banner inteiro:
// label (eyebrow) + value (destaque grande, com bandeiras renderizadas)
// + descrição (subtexto explicativo).
//
// Comportamento:
// - Auto-play 5s entre slides, com fade
// - Pause on hover/focus
// - Bullets clicáveis pra navegação manual
// - Setas opcionais
// - Respeita prefers-reduced-motion (desliga animação)
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
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-14 min-h-[160px] md:min-h-[200px] flex items-center justify-center">
        {/* Slides empilhados — só o ativo fica visível com fade */}
        <div className="relative w-full" aria-live="polite">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="text-center transition-opacity duration-700"
              style={{
                position: idx === active ? "relative" : "absolute",
                inset: idx === active ? undefined : 0,
                opacity: idx === active ? 1 : 0,
                pointerEvents: idx === active ? "auto" : "none",
              }}
              aria-hidden={idx !== active}
            >
              <div className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-accent mb-3 md:mb-4">
                {item.label}
              </div>
              <div className="font-serif text-3xl md:text-5xl leading-tight mb-3 md:mb-4 flex items-center justify-center gap-2 flex-wrap">
                {item.valueNode}
              </div>
              {item.description && (
                <p className="text-sm md:text-base text-light-soft max-w-2xl mx-auto leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          ))}
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
