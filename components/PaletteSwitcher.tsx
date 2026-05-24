"use client";

import { useEffect, useState } from "react";

type Palette = "navy" | "emerald" | "black";

const CYCLE: Record<Palette, { next: Palette; label: string }> = {
  navy: { next: "emerald", label: "Verde institucional" },
  emerald: { next: "black", label: "Preto & Dourado" },
  black: { next: "navy", label: "Marinho clássico" },
};

const STORAGE_KEY = "np-palette";

export default function PaletteSwitcher() {
  const [palette, setPalette] = useState<Palette>("navy");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem(STORAGE_KEY) as Palette) || "navy";
    setPalette(saved);
    document.documentElement.setAttribute("data-palette", saved);
  }, []);

  const handleClick = () => {
    const next = CYCLE[palette].next;
    setPalette(next);
    document.documentElement.setAttribute("data-palette", next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  if (!mounted) return null;

  const label =
    palette === "navy"
      ? "Marinho clássico"
      : palette === "emerald"
        ? "Verde institucional"
        : "Preto & Dourado";

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 left-6 z-[60] inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-[13px] font-medium cursor-pointer shadow-2xl transition-all hover:-translate-y-0.5"
      style={{
        background: "var(--bg-dark)",
        color: "var(--text-light)",
        border: "1px solid var(--accent)",
      }}
      aria-label="Alternar paleta de cores"
    >
      <span
        className="w-3.5 h-3.5 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow:
            "0 0 0 2px var(--bg-dark), 0 0 0 3px var(--accent)",
        }}
      />
      {label}
      <svg
        className="w-3.5 h-3.5 opacity-70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 12a9 9 0 109-9M21 3v6h-6" />
      </svg>
    </button>
  );
}
