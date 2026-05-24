"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALES, type Locale } from "@/i18n/config";

// Dropdown com bandeiras pra trocar de idioma.
// Click na bandeira do idioma atual abre/fecha. Click em outro idioma
// navega pra mesma rota no novo locale (preservando query string e hash).

const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  it: "Italiano",
};

const LOCALE_FLAGS: Record<Locale, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  it: "🇮🇹",
};

const LOCALE_CODES: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  it: "IT",
};

export default function LanguageSwitcher({
  className = "",
  variant = "compact",
}: {
  className?: string;
  /** "compact" = só código (PT/EN/IT). "full" = bandeira + nome */
  variant?: "compact" | "full";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  function switchTo(newLocale: Locale) {
    if (newLocale === locale) {
      setOpen(false);
      return;
    }
    // router.replace troca o locale sem adicionar nova entrada no history
    router.replace(pathname, { locale: newLocale });
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Idioma"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium hover:opacity-80 transition-opacity border"
        style={{
          borderColor: "var(--border-soft)",
          color: "var(--text-dark)",
        }}
      >
        <span className="text-base leading-none">{LOCALE_FLAGS[locale]}</span>
        {variant === "compact" ? (
          <span>{LOCALE_CODES[locale]}</span>
        ) : (
          <span>{LOCALE_LABELS[locale]}</span>
        )}
        <svg
          className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[160px] rounded-lg border shadow-lg overflow-hidden z-50"
          style={{
            background: "var(--bg-page)",
            borderColor: "var(--border-soft)",
          }}
        >
          {LOCALES.map((l) => {
            const isActive = l === locale;
            return (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => switchTo(l)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                    isActive
                      ? "font-medium bg-page-2"
                      : "hover:bg-page-2"
                  }`}
                  style={{ color: "var(--text-dark)" }}
                >
                  <span className="text-base leading-none">
                    {LOCALE_FLAGS[l]}
                  </span>
                  <span>{LOCALE_LABELS[l]}</span>
                  {isActive && (
                    <svg
                      className="w-3.5 h-3.5 ml-auto text-accent"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
