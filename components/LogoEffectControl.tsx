"use client";

import { useEffect, useState } from "react";

type Entrance =
  | "none"
  | "fade"
  | "slide"
  | "zoom"
  | "rotate"
  | "spin";
type Idle = "none" | "float" | "pulse" | "slowrotate";

const ENTRANCE_PRESETS: Record<
  Exclude<Entrance, "none">,
  { name: string; duration: string; easing: string }
> = {
  fade: {
    name: "heroLogoFade",
    duration: "1.6s",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  slide: {
    name: "heroLogoSlide",
    duration: "1.6s",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  },
  zoom: {
    name: "heroLogoZoom",
    duration: "1.5s",
    easing: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  rotate: {
    name: "heroLogoRotate",
    duration: "1.8s",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  spin: {
    name: "heroLogoSpin",
    duration: "2.4s",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

const IDLE_PRESETS: Record<
  Exclude<Idle, "none">,
  { name: string; duration: string; easing: string }
> = {
  float: { name: "heroLogoFloat", duration: "5s", easing: "ease-in-out" },
  pulse: { name: "heroLogoPulse", duration: "4s", easing: "ease-in-out" },
  slowrotate: {
    name: "heroLogoSlowRotate",
    duration: "40s",
    easing: "linear",
  },
};

function applyEffects(entrance: Entrance, idle: Idle) {
  const logo = document.querySelector<HTMLElement>(".hero-logo");
  if (!logo) return;

  const parts: string[] = [];
  if (entrance !== "none") {
    const e = ENTRANCE_PRESETS[entrance];
    parts.push(`${e.name} ${e.duration} ${e.easing} 0.25s 1 both`);
  }
  if (idle !== "none") {
    const i = IDLE_PRESETS[idle];
    const delay =
      entrance !== "none"
        ? `${parseFloat(ENTRANCE_PRESETS[entrance].duration) + 0.5}s`
        : "0s";
    parts.push(`${i.name} ${i.duration} ${i.easing} ${delay} infinite`);
  }

  // Force reflow para re-disparar a entrada
  logo.style.animation = "none";
  void logo.offsetWidth;
  logo.style.animation = parts.join(", ");
}

export default function LogoEffectControl() {
  const [entrance, setEntrance] = useState<Entrance>("none");
  const [idle, setIdle] = useState<Idle>("none");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    applyEffects(entrance, idle);
  }, [entrance, idle, mounted]);

  if (!mounted) return null;

  return (
    <div
      className="fixed left-6 z-[60] flex flex-col gap-1 px-3.5 py-2.5 rounded-2xl shadow-2xl min-w-[240px]"
      style={{
        bottom: "76px",
        background: "var(--bg-dark)",
        color: "var(--text-light)",
        border: "1px solid var(--accent)",
      }}
    >
      <div
        className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] font-semibold pb-1"
        style={{ color: "var(--accent)" }}
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M13 3l3.5 6L23 12l-6.5 3L13 21l-3.5-6L3 12l6.5-3L13 3z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Efeitos da logo</span>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span style={{ opacity: 0.7 }}>Entrada</span>
        <select
          value={entrance}
          onChange={(e) => setEntrance(e.target.value as Entrance)}
          className="appearance-none bg-transparent border-none text-[12px] font-medium cursor-pointer pr-4 py-0.5 focus:outline-none"
          style={{
            color: "var(--text-light)",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23c9a961' stroke-width='1.5'%3E%3Cpath d='M2 4l3 3 3-3'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        >
          <option value="none">Sem efeito</option>
          <option value="fade">Fade in</option>
          <option value="slide">Slide</option>
          <option value="zoom">Zoom</option>
          <option value="rotate">Rotação suave</option>
          <option value="spin">Spin 360°</option>
        </select>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span style={{ opacity: 0.7 }}>Contínuo</span>
        <select
          value={idle}
          onChange={(e) => setIdle(e.target.value as Idle)}
          className="appearance-none bg-transparent border-none text-[12px] font-medium cursor-pointer pr-4 py-0.5 focus:outline-none"
          style={{
            color: "var(--text-light)",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10' fill='none' stroke='%23c9a961' stroke-width='1.5'%3E%3Cpath d='M2 4l3 3 3-3'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
          }}
        >
          <option value="none">Sem efeito</option>
          <option value="float">Flutuação</option>
          <option value="pulse">Pulse</option>
          <option value="slowrotate">Rotação lenta</option>
        </select>
      </div>
    </div>
  );
}
