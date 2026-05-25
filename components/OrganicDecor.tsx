// =================================================================
// OrganicDecor — formas SVG sutis em background pra paletas pastel
// =================================================================
//
// Renderiza folhas estilizadas + blobs orgânicos absolutamente
// posicionados, com opacidade baixa, usando as próprias cores da
// paleta ativa via currentColor.
//
// Só aparecem nas paletas pastel (sage/blush/honey/mint). Em paletas
// institucionais (navy/black/etc), o componente retorna null pra não
// quebrar o vibe formal.
//
// Usado em Hero, Booking, etc — wrap em um div com `position: relative`.

import { getSiteSettings } from "@/lib/settings";
import { PASTEL_PALETTES } from "@/lib/settings";

type Variant = "hero" | "section" | "minimal";

type Props = {
  variant?: Variant;
  /** Sobreescreve detecção automática (útil pra teste). */
  forceShow?: boolean;
};

export default async function OrganicDecor({ variant = "section", forceShow }: Props) {
  const settings = await getSiteSettings();
  const isPastel = PASTEL_PALETTES.includes(settings.palette);

  if (!forceShow && !isPastel) return null;

  if (variant === "hero") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 1 }}
      >
        {/* Blob grande superior direito */}
        <svg
          className="absolute -top-20 -right-20 w-[480px] h-[480px]"
          viewBox="0 0 400 400"
          fill="currentColor"
          style={{ color: "var(--accent-soft)", opacity: 0.18 }}
        >
          <path d="M200,40 C290,40 360,110 360,200 C360,290 290,360 200,360 C110,360 40,290 40,200 C40,110 110,40 200,40 Z" />
        </svg>
        {/* Folha estilizada inferior esquerda */}
        <svg
          className="absolute bottom-8 -left-12 w-[280px] h-[280px]"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          style={{ color: "var(--text-light)", opacity: 0.25 }}
        >
          <path d="M100,20 C140,30 170,60 175,100 C175,150 140,180 100,180 C80,170 70,140 75,100 C80,60 80,30 100,20 Z" />
          <path d="M100,30 C100,50 100,170 100,180" strokeLinecap="round" />
        </svg>
        {/* Círculo orgânico médio direita-meio */}
        <svg
          className="absolute top-1/2 -right-32 w-[320px] h-[320px] -translate-y-1/2"
          viewBox="0 0 200 200"
          fill="currentColor"
          style={{ color: "var(--text-light)", opacity: 0.08 }}
        >
          <ellipse cx="100" cy="100" rx="95" ry="80" transform="rotate(15 100 100)" />
        </svg>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <svg
          className="absolute top-12 right-8 w-32 h-32"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          style={{ color: "var(--accent)", opacity: 0.2 }}
        >
          <path d="M50,15 C70,20 80,40 80,60 C80,80 65,90 50,85 C40,70 40,55 45,40 C48,25 48,18 50,15 Z" />
        </svg>
      </div>
    );
  }

  // variant === "section"
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Blob suave no topo direito */}
      <svg
        className="absolute -top-24 -right-24 w-[360px] h-[360px]"
        viewBox="0 0 200 200"
        fill="currentColor"
        style={{ color: "var(--accent-soft)", opacity: 0.12 }}
      >
        <path d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z" />
      </svg>
      {/* Folha inferior esquerda */}
      <svg
        className="absolute -bottom-16 -left-8 w-[240px] h-[240px]"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ color: "var(--bg-dark)", opacity: 0.1 }}
      >
        <path d="M100,20 C140,40 170,80 170,120 C170,160 140,180 100,180 C90,160 85,130 90,100 C95,70 95,40 100,20 Z" />
      </svg>
    </div>
  );
}
