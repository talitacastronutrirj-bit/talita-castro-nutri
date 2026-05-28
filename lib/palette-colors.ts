// =================================================================
// Cores oficiais de cada paleta — referência canônica
// =================================================================
//
// Usado pelo AccentColorPicker no admin pra mostrar swatches rápidos
// da paleta ativa. Cliente clica numa cor da paleta e ela vira o
// accent custom — sem precisar digitar hex.
//
// Mantém sincronizado com os valores CSS em app/globals.css.

import type { Palette } from "./settings";

export type PaletteSwatch = {
  /** Nome curto/descritivo */
  name: string;
  /** Hex "#rrggbb" — exatamente o que vai pro AccentColorPicker */
  hex: string;
  /** Como essa cor é usada por padrão na paleta */
  role: "bg" | "dark" | "accent" | "secondary";
};

export const PALETTE_COLORS: Record<Palette, PaletteSwatch[]> = {
  // ─── Institucionais ───
  navy: [
    { name: "Marinho", hex: "#0c1f3d", role: "dark" },
    { name: "Dourado", hex: "#c9a961", role: "accent" },
    { name: "Creme", hex: "#fbf8f3", role: "bg" },
  ],
  emerald: [
    { name: "Esmeralda", hex: "#064e3b", role: "dark" },
    { name: "Bronze", hex: "#b08d57", role: "accent" },
    { name: "Creme", hex: "#f5f0e8", role: "bg" },
  ],
  black: [
    { name: "Preto", hex: "#0a0a0a", role: "dark" },
    { name: "Dourado", hex: "#c9a161", role: "accent" },
    { name: "Creme", hex: "#f8f5ed", role: "bg" },
  ],
  wine: [
    { name: "Vinho", hex: "#5c1a1b", role: "dark" },
    { name: "Dourado", hex: "#c9a161", role: "accent" },
    { name: "Creme", hex: "#faf6ef", role: "bg" },
  ],
  graphite: [
    { name: "Grafite", hex: "#2c3036", role: "dark" },
    { name: "Bronze", hex: "#b07b3a", role: "accent" },
    { name: "Cinza claro", hex: "#f4f3f0", role: "bg" },
  ],
  coffee: [
    { name: "Café", hex: "#3d2914", role: "dark" },
    { name: "Caramelo", hex: "#d4a574", role: "accent" },
    { name: "Creme", hex: "#f9f3e8", role: "bg" },
  ],

  // ─── Pastel ───
  sage: [
    { name: "Sálvia escura", hex: "#3a5a3a", role: "dark" },
    { name: "Terracota", hex: "#a67148", role: "accent" },
    { name: "Sálvia média", hex: "#6b8e6b", role: "secondary" },
    { name: "Creme", hex: "#faf6f0", role: "bg" },
  ],
  blush: [
    { name: "Rosa escuro", hex: "#6a4540", role: "dark" },
    { name: "Terracota rosado", hex: "#b46850", role: "accent" },
    { name: "Rose médio", hex: "#a47770", role: "secondary" },
    { name: "Pó", hex: "#fcf7f4", role: "bg" },
  ],
  honey: [
    { name: "Mel escuro", hex: "#6b4520", role: "dark" },
    { name: "Terracota queimado", hex: "#b8492a", role: "accent" },
    { name: "Mel", hex: "#b8854a", role: "secondary" },
    { name: "Creme", hex: "#fcf7ec", role: "bg" },
  ],
  mint: [
    { name: "Menta escura", hex: "#2d564a", role: "dark" },
    { name: "Rose gold", hex: "#b06a5a", role: "accent" },
    { name: "Menta média", hex: "#5a9580", role: "secondary" },
    { name: "Offwhite", hex: "#f5fbf8", role: "bg" },
  ],

  // ─── Vibrantes ───
  rouge: [
    // Cores oficiais da ID Visual da Talita
    { name: "Cereja", hex: "#b63249", role: "accent" },
    { name: "Sage", hex: "#9fbf9b", role: "secondary" },
    { name: "Bordô", hex: "#691c29", role: "dark" },
    { name: "Creme", hex: "#f7f5dd", role: "bg" },
  ],
};
