"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { TeamMember } from "@/lib/team";
import { pickLocale, type Locale } from "@/i18n/config";

type Props = {
  member: TeamMember;
};

export default function TeamMemberCard({ member }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const headingId = useId();

  const bio = pickLocale(member.bio, locale);
  const details = pickLocale(member.details, locale);
  const hasDetails = details.length > 0;

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

  function handleHoverEnter() {
    if (!hasDetails) return;
    // Desktop: pequeno delay pra não disparar acidentalmente ao passar o mouse
    const t = setTimeout(() => setOpen(true), 220);
    setHoverTimer(t);
  }

  function handleHoverLeave() {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoverTimer(null);
  }

  function handleClick() {
    if (!hasDetails) return;
    setOpen(true);
  }

  function close() {
    if (hoverTimer) clearTimeout(hoverTimer);
    setHoverTimer(null);
    setOpen(false);
  }

  return (
    <>
      <article
        className={`card-hover rounded-2xl overflow-hidden border bg-page ${
          hasDetails ? "cursor-pointer" : ""
        }`}
        style={{ borderColor: "var(--border-soft)" }}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
        onClick={handleClick}
        role={hasDetails ? "button" : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        onKeyDown={(e) => {
          if (hasDetails && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        aria-haspopup={hasDetails ? "dialog" : undefined}
      >
        <div
          className="aspect-[3/4] grid place-items-center relative"
          style={{ background: "var(--bg-dark)" }}
        >
          {member.photoUrl ? (
            <Image
              src={member.photoUrl}
              alt={member.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
              className="object-cover"
            />
          ) : (
            <div className="font-serif text-6xl text-accent">
              {member.initials || member.name.charAt(0)}
            </div>
          )}

          {hasDetails && (
            <div
              className="absolute bottom-3 right-3 z-10 grid place-items-center w-9 h-9 rounded-full backdrop-blur-sm border opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
              style={{
                background: "rgba(0,0,0,0.4)",
                borderColor: "var(--accent)",
              }}
              aria-hidden="true"
            >
              <svg
                className="w-4 h-4 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="text-[10px] uppercase tracking-[0.25em] text-accent mb-1.5">
            {member.role}
          </div>
          <h3
            className="font-serif text-xl mb-2"
            style={{ color: "var(--bg-dark)" }}
          >
            {member.name}
          </h3>
          {member.credentials.length > 0 ? (
            <div
              className="text-xs leading-relaxed border-t pt-3 mt-3 text-dark"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {member.credentials.map((credential) => (
                <div
                  key={credential}
                  className="text-accent font-medium mb-0.5"
                >
                  {credential}
                </div>
              ))}
            </div>
          ) : bio ? (
            <div className="text-xs leading-relaxed pt-3 text-dark">{bio}</div>
          ) : null}

          {hasDetails && (
            <div
              className="mt-3 pt-3 border-t text-[11px] text-accent font-medium uppercase tracking-widest opacity-70"
              style={{ borderColor: "var(--border-soft)" }}
            >
              {t("cta.viewDetails")} →
            </div>
          )}
        </div>
      </article>

      {/* Modal/Popover */}
      {mounted && open && hasDetails
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              style={{
                background: "rgba(12, 31, 61, 0.82)",
                backdropFilter: "blur(6px)",
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
                className="relative rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border"
                style={{
                  background: "var(--bg-page)",
                  borderColor: "var(--border-soft)",
                }}
                onMouseLeave={close}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fechar"
                  className="absolute top-4 right-4 w-9 h-9 grid place-items-center rounded-full hover:opacity-70 text-dark transition-colors z-10"
                  style={{ background: "rgba(255,255,255,0.9)" }}
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

                <div className="grid md:grid-cols-5 gap-0">
                  {/* Lado esquerdo: foto */}
                  <div
                    className="md:col-span-2 aspect-square md:aspect-auto grid place-items-center relative md:min-h-[400px]"
                    style={{ background: "var(--bg-dark)" }}
                  >
                    {member.photoUrl ? (
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 40vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="font-serif text-7xl text-accent">
                        {member.initials || member.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Lado direito: info */}
                  <div className="md:col-span-3 p-7 md:p-8">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-accent mb-2">
                      {member.role}
                    </div>
                    <h2
                      id={headingId}
                      className="font-serif text-2xl md:text-3xl mb-3 leading-tight pr-8"
                      style={{ color: "var(--bg-dark)" }}
                    >
                      {member.name}
                    </h2>

                    <div className="gold-rule w-12 mb-5" />

                    {member.credentials.length > 0 && (
                      <div className="mb-5">
                        {member.credentials.map((credential) => (
                          <div
                            key={credential}
                            className="text-sm text-accent font-medium mb-1"
                          >
                            {credential}
                          </div>
                        ))}
                      </div>
                    )}

                    {bio && (
                      <p className="text-sm leading-relaxed text-dark mb-5">
                        {bio}
                      </p>
                    )}

                    {details && (
                      <div
                        className="text-sm leading-relaxed text-dark whitespace-pre-line border-t pt-5"
                        style={{ borderColor: "var(--border-soft)" }}
                      >
                        {details}
                      </div>
                    )}
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
