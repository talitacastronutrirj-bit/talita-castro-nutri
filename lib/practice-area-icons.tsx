import React from "react";

/**
 * Ícones predefinidos pras áreas de atuação.
 * O admin escolhe uma das chaves; o componente Areas.tsx renderiza pelo nome.
 *
 * Adicionar novo ícone:
 *   1. Achar o path SVG (viewBox 0 0 24 24, sem fill, stroke-width herdado)
 *   2. Adicionar entrada no objeto ICON_PATHS com key descritiva
 *   3. Adicionar entrada em ICON_OPTIONS com label legível
 */

export const ICON_PATHS: Record<string, React.ReactNode> = {
  house: <path d="M3 12l9-9 9 9M5 10v10h14V10" />,
  heart: (
    <path d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.18L12 21z" />
  ),
  document: <path d="M3 7h18M3 12h18M3 17h12" />,
  cart: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 002 1.6h9.7a2 2 0 002-1.6L23 6H6" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4" y="6" width="16" height="14" rx="2" />
      <path d="M8 6V4a2 2 0 014 0v2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  gavel: <path d="M3 12l3 3 5-5 4 4 6-6" />,
  accessibility: (
    <>
      <circle cx="12" cy="8" r="3" />
      <path d="M12 11v6M8 14h8" />
    </>
  ),
  balance: (
    <>
      <path d="M12 3v18M5 8l-3 6a4 4 0 008 0l-3-6M19 8l-3 6a4 4 0 008 0l-3-6" />
      <path d="M3 21h18" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M10 21v-4h4v4" />
    </>
  ),
  car: (
    <>
      <path d="M3 17l1.5-5h15L21 17m-15 0h12m-15 0v3h3v-3m9 0v3h3v-3" />
      <circle cx="7" cy="17" r="1.5" />
      <circle cx="17" cy="17" r="1.5" />
    </>
  ),
  scale: (
    <>
      <path d="M12 3v18" />
      <path d="M3 7h18" />
      <path d="M7 7l-3 6h6l-3-6zM17 7l-3 6h6l-3-6z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13 13 0 010 18M12 3a13 13 0 000 18" />
    </>
  ),
  bank: (
    <>
      <path d="M3 9l9-6 9 6M3 9h18M5 9v10M19 9v10M9 11v6M12 11v6M15 11v6M3 21h18" />
    </>
  ),
  contract: (
    <>
      <path d="M4 2h12l4 4v16H4V2z" />
      <path d="M16 2v4h4M8 12h8M8 16h6" />
    </>
  ),
  family: (
    <>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2" />
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2M15 13a3 3 0 013 3v2" />
    </>
  ),
};

export type IconKey = keyof typeof ICON_PATHS;

export const ICON_OPTIONS: { value: string; label: string }[] = [
  { value: "house", label: "Casa (Imobiliário)" },
  { value: "heart", label: "Coração (Família)" },
  { value: "document", label: "Documento (Sucessões/Inventário)" },
  { value: "cart", label: "Carrinho (Consumidor)" },
  { value: "briefcase", label: "Pasta (Trabalhista)" },
  { value: "shield", label: "Escudo (Defesa)" },
  { value: "gavel", label: "Martelo (Criminal)" },
  { value: "accessibility", label: "Pessoa (Acessibilidade/PCD)" },
  { value: "balance", label: "Balança (Geral/Justiça)" },
  { value: "building", label: "Edifício (Empresarial)" },
  { value: "car", label: "Veículo (Trânsito)" },
  { value: "scale", label: "Régua (Tributário)" },
  { value: "globe", label: "Globo (Internacional)" },
  { value: "bank", label: "Banco (Bancário/Financeiro)" },
  { value: "contract", label: "Contrato (Cível)" },
  { value: "family", label: "Família (Vínculos)" },
];

/**
 * Renderiza o path SVG do ícone pela chave.
 * Se a chave não existir, devolve o ícone "document" como fallback.
 */
export function PracticeAreaIcon({
  iconKey,
  className,
  stroke,
}: {
  iconKey: string;
  className?: string;
  stroke?: string;
}) {
  const paths = ICON_PATHS[iconKey] ?? ICON_PATHS.document;
  return (
    <svg
      className={className}
      fill="none"
      stroke={stroke ?? "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
    >
      {paths}
    </svg>
  );
}
