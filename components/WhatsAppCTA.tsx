"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { site } from "@/lib/site";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
  /** Qual escritório o usuário quer falar com. Se omitido, mostra todos. */
  office?: string;
};

export default function WhatsAppCTA({
  className,
  style,
  children,
  ariaLabel,
  office,
}: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headingId = useId();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  const officesToShow = office
    ? site.offices.filter((o) => o.id === office)
    : site.offices;

  // Se só tem 1 WhatsApp pra mostrar (ou caiu no primaryWhatsapp), abre
  // direto sem modal — UX mais ágil. Modal só faz sentido com múltiplas
  // opções pra escolher.
  const skipModal = officesToShow.length <= 1;
  const directHref =
    officesToShow.length === 1
      ? officesToShow[0].whatsapp.href
      : site.primaryWhatsapp.href;

  if (skipModal) {
    return (
      <a
        href={directHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel ?? t("cta.whatsapp")}
        className={`appearance-none ${className ?? ""}`}
        style={style}
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel ?? t("cta.whatsapp")}
        aria-haspopup="dialog"
        className={`appearance-none cursor-pointer ${className ?? ""}`}
        style={style}
      >
        {children}
      </button>

      {mounted && open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{
                background: "rgba(12, 31, 61, 0.8)",
                backdropFilter: "blur(4px)",
                animation: "fade-in 180ms ease-out",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
            >
              <div
                className="relative rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                style={{ background: "var(--bg-page)" }}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="✕"
                  className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full hover:opacity-70 text-dark transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round" />
                  </svg>
                </button>

                <div className="p-7 md:p-8">
                  <h2
                    id={headingId}
                    className="font-serif text-2xl md:text-[1.7rem] leading-tight mb-4 pr-8"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    {t("labels.location")}
                  </h2>
                  <div className="gold-rule w-16 mb-5" />

                  <p className="text-sm leading-relaxed mb-5 text-dark">
                    {site.name}
                  </p>

                  <div className="space-y-2.5">
                    {officesToShow.map((o) => (
                      <a
                        key={o.id}
                        href={o.whatsapp.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={close}
                        className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3.5 rounded-full font-semibold w-full transition-colors"
                      >
                        <WhatsAppIcon />
                        {o.city} · {o.whatsapp.display}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.52 3.48A12 12 0 003.45 20.42L2 22l1.66-1.42a12 12 0 0016.86-17.1zM12 20a8 8 0 01-4.07-1.11l-.29-.17-3 .8.8-2.92-.18-.3A8 8 0 1112 20z" />
    </svg>
  );
}
