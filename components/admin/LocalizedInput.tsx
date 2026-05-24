"use client";

import { useState } from "react";
import { LOCALES, type Locale } from "@/i18n/config";
import type { LocalizedText } from "@/lib/localized";

// =================================================================
// LocalizedInput / LocalizedTextarea
// =================================================================
//
// Inputs do admin com abas pra cada idioma habilitado.
// Cada campo virá no FormData como `<name>__<locale>`:
//   heroHeading__pt, heroHeading__en, heroHeading__it
//
// O helper `readLocalizedFromFormData(formData, "heroHeading")` em
// lib/localized.ts cuida de remontar o objeto LocalizedText na server
// action.
//
// Uso:
//   <LocalizedInput
//     name="heroHeading"
//     defaultValue={settings.heroHeading}
//     label="Título do hero"
//   />
//
//   <LocalizedTextarea
//     name="heroDescription"
//     defaultValue={settings.heroDescription}
//     rows={3}
//   />

type CommonProps = {
  name: string;
  defaultValue?: LocalizedText | null;
  label?: React.ReactNode;
  hint?: React.ReactNode;
  required?: boolean;
  maxLength?: number;
};

type InputProps = CommonProps & {
  type?: "text" | "url";
  placeholder?: Partial<Record<Locale, string>> | string;
};

type TextareaProps = CommonProps & {
  rows?: number;
  placeholder?: Partial<Record<Locale, string>> | string;
};

const LOCALE_LABELS: Record<Locale, string> = {
  pt: "Português",
  en: "Inglês",
  it: "Italiano",
};

const LOCALE_FLAGS: Record<Locale, string> = {
  pt: "🇧🇷",
  en: "🇺🇸",
  it: "🇮🇹",
};

function getPlaceholder(
  placeholder: Partial<Record<Locale, string>> | string | undefined,
  locale: Locale
): string {
  if (!placeholder) return "";
  if (typeof placeholder === "string") return placeholder;
  return placeholder[locale] ?? "";
}

function renderHeader(
  label: React.ReactNode,
  activeLocale: Locale,
  setActiveLocale: (l: Locale) => void,
  values: LocalizedText
) {
  return (
    <div>
      {label && (
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          {label}
        </label>
      )}
      <div
        className="flex items-center gap-1 mb-2 rounded-lg p-1 border"
        style={{
          background: "var(--bg-page-2)",
          borderColor: "var(--border-soft)",
        }}
      >
        {LOCALES.map((l) => {
          const isActive = l === activeLocale;
          const hasValue = !!values[l] && values[l]!.trim().length > 0;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setActiveLocale(l)}
              className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                isActive ? "bg-white shadow-sm" : "hover:bg-white/50"
              }`}
              style={{
                color: isActive ? "var(--bg-dark)" : "var(--text-dark)",
              }}
            >
              <span>{LOCALE_FLAGS[l]}</span>
              <span>{LOCALE_LABELS[l]}</span>
              {hasValue && <span className="text-emerald-600 text-[10px]">●</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LocalizedInput({
  name,
  defaultValue,
  label,
  hint,
  required,
  maxLength,
  type = "text",
  placeholder,
}: InputProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("pt");
  const [values, setValues] = useState<LocalizedText>(() => {
    const initial: LocalizedText = {};
    for (const l of LOCALES) initial[l] = defaultValue?.[l] ?? "";
    return initial;
  });

  function updateValue(locale: Locale, value: string) {
    setValues((prev) => ({ ...prev, [locale]: value }));
  }

  return (
    <div>
      {renderHeader(label, activeLocale, setActiveLocale, values)}

      {/* Inputs ocultos pros idiomas não-ativos (preservam valor no submit) */}
      {LOCALES.map((l) =>
        l === activeLocale ? (
          <input
            key={l}
            type={type}
            name={`${name}__${l}`}
            value={values[l] ?? ""}
            onChange={(e) => updateValue(l, e.target.value)}
            // Required só vale pro idioma default (pt) — pra obrigar pelo menos 1 versão
            required={required && l === "pt"}
            maxLength={maxLength}
            placeholder={getPlaceholder(placeholder, l)}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        ) : (
          <input
            key={l}
            type="hidden"
            name={`${name}__${l}`}
            value={values[l] ?? ""}
          />
        )
      )}

      {hint && (
        <p
          className="text-[11px] text-dark mt-1.5 leading-relaxed"
          style={{ opacity: 0.6 }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function LocalizedTextarea({
  name,
  defaultValue,
  label,
  hint,
  required,
  maxLength,
  rows = 4,
  placeholder,
}: TextareaProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>("pt");
  const [values, setValues] = useState<LocalizedText>(() => {
    const initial: LocalizedText = {};
    for (const l of LOCALES) initial[l] = defaultValue?.[l] ?? "";
    return initial;
  });

  function updateValue(locale: Locale, value: string) {
    setValues((prev) => ({ ...prev, [locale]: value }));
  }

  return (
    <div>
      {renderHeader(label, activeLocale, setActiveLocale, values)}

      {LOCALES.map((l) =>
        l === activeLocale ? (
          <textarea
            key={l}
            name={`${name}__${l}`}
            value={values[l] ?? ""}
            onChange={(e) => updateValue(l, e.target.value)}
            required={required && l === "pt"}
            maxLength={maxLength}
            rows={rows}
            placeholder={getPlaceholder(placeholder, l)}
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        ) : (
          <textarea
            key={l}
            name={`${name}__${l}`}
            value={values[l] ?? ""}
            readOnly
            style={{ display: "none" }}
          />
        )
      )}

      {hint && (
        <p
          className="text-[11px] text-dark mt-1.5 leading-relaxed"
          style={{ opacity: 0.6 }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}
