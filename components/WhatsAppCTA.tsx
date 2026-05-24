"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { site } from "@/lib/site";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  ariaLabel?: string;
  /** Qual escritório o usuário quer falar com. Se omitido, mostra todos. */
  office?: string;
};

const SCOPE_ITEMS = [
  "Atendimento jurídico personalizado",
  "Contato direto com o advogado",
];

export default function WhatsAppCTA({
  className,
  style,
  children,
  ariaLabel,
  office,
}: Props) {
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

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ariaLabel}
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
                  aria-label="Fechar"
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
                  <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
                    Antes de continuar
                  </div>
                  <h2
                    id={headingId}
                    className="font-serif text-2xl md:text-[1.7rem] leading-tight mb-4 pr-8"
                    style={{ color: "var(--bg-dark)" }}
                  >
                    Antes de continuar
                  </h2>
                  <div className="gold-rule w-16 mb-5" />

                  <p className="text-sm leading-relaxed mb-5 text-dark">
                    {site.name} — atendimento jurídico personalizado.
                  </p>

                  <ul className="space-y-2.5 mb-6">
                    {SCOPE_ITEMS.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2.5 text-sm text-dark"
                      >
                        <span
                          className="mt-1 grid place-items-center w-4 h-4 rounded-full shrink-0"
                          style={{ background: "rgba(201, 169, 97, 0.15)" }}
                        >
                          <svg
                            className="w-2.5 h-2.5 text-accent"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M5 12l5 5L20 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div
                    className="rounded-xl p-4 mb-6 text-xs space-y-1 border text-dark"
                    style={{
                      background: "var(--bg-page-2)",
                      borderColor: "var(--border-soft)",
                    }}
                  >
                    {site.oab.rj.length > 0 && (
                      <div>
                        <span
                          className="font-medium"
                          style={{ color: "var(--bg-dark)" }}
                        >
                          OAB/RJ:
                        </span>{" "}
                        {site.oab.rj.join(" · ")}
                      </div>
                    )}
                    {site.oab.es.length > 0 && (
                      <div>
                        <span
                          className="font-medium"
                          style={{ color: "var(--bg-dark)" }}
                        >
                          OAB/ES:
                        </span>{" "}
                        {site.oab.es.join(" · ")}
                      </div>
                    )}
                    <div
                      className="text-[11px] pt-1"
                      style={{ opacity: 0.7 }}
                    >
                      Atendimento direto com {site.shortName}
                    </div>
                  </div>

                  {officesToShow.length === 1 ? (
                    <a
                      href={officesToShow[0].whatsapp.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={close}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-full font-semibold w-full transition-colors"
                    >
                      <WhatsAppIcon />
                      Continuar · {officesToShow[0].city}
                    </a>
                  ) : (
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
                          Continuar · {o.city} · {o.whatsapp.display}
                        </a>
                      ))}
                    </div>
                  )}

                  <p
                    className="text-[11px] text-center mt-4 text-dark"
                    style={{ opacity: 0.6 }}
                  >
                    Você será direcionado para uma conversa direta com a banca.
                  </p>
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
