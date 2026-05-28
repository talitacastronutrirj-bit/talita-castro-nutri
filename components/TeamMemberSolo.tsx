// =================================================================
// TeamMemberSolo — apresentação grande pra profissional autônomo
// =================================================================
//
// Renderizado pela Equipe quando há 1 só membro ativo E
// settings.teamSoloLayout != "team". Dois layouts:
//
// - about-centered : Foto grande centralizada (3/4), nome + cargo + bio
//                    aparecem com efeito quando hover/click na foto
// - about-side     : Foto à esquerda (3/4), texto sempre visível à
//                    direita (nome, cargo, bio completa)

"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale } from "next-intl";
import type { TeamMember } from "@/lib/team";
import { pickLocale, type Locale } from "@/i18n/config";

type Props = {
  member: TeamMember;
  layout: "about-centered" | "about-side";
  /** Texto traduzido pra "Sobre" (i18n via useTranslations no parent) */
  aboutLabel: string;
};

export default function TeamMemberSolo({ member, layout, aboutLabel }: Props) {
  const locale = useLocale() as Locale;
  const bio = pickLocale(member.bio, locale);
  const details = pickLocale(member.details, locale);
  const [hovered, setHovered] = useState(false);

  if (layout === "about-side") {
    return (
      <div className="grid md:grid-cols-12 gap-10 lg:gap-16 items-center max-w-5xl mx-auto">
        {/* Foto à esquerda */}
        <div className="md:col-span-5">
          <div
            className="aspect-[3/4] rounded-2xl overflow-hidden relative shadow-2xl"
            style={{ background: "var(--bg-dark)" }}
          >
            {member.photoUrl ? (
              <Image
                src={member.photoUrl}
                alt={member.name}
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
                unoptimized={member.photoUrl.startsWith("https://res.cloudinary.com")}
                priority
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center font-serif text-7xl text-accent">
                {member.initials || member.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Texto à direita */}
        <div className="md:col-span-7 space-y-5">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent">
            {aboutLabel}
          </div>
          <h3
            className="font-serif text-3xl md:text-4xl leading-tight"
            style={{ color: "var(--bg-dark)" }}
          >
            {member.name}
          </h3>
          {member.role && (
            <div
              className="text-sm font-medium"
              style={{ color: "var(--accent)" }}
            >
              {member.role}
            </div>
          )}
          <div className="gold-rule w-16" />
          {bio && (
            <p className="text-base leading-relaxed text-dark whitespace-pre-line">
              {bio}
            </p>
          )}
          {details && (
            <div className="text-sm leading-relaxed text-dark whitespace-pre-line" style={{ opacity: 0.85 }}>
              {details}
            </div>
          )}
        </div>
      </div>
    );
  }

  // layout === "about-centered"
  return (
    <div className="max-w-md mx-auto">
      <div
        className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group shadow-2xl"
        style={{ background: "var(--bg-dark)" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setHovered((v) => !v)}
      >
        {member.photoUrl ? (
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized={member.photoUrl.startsWith("https://res.cloudinary.com")}
            priority
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center font-serif text-7xl text-accent">
            {member.initials || member.name.charAt(0)}
          </div>
        )}

        {/* Overlay com bio — fade in no hover */}
        <div
          className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.15) 80%, transparent 100%)",
            opacity: hovered ? 1 : 0,
            color: "var(--text-light)",
          }}
        >
          <div className="text-[10px] uppercase tracking-[0.3em] text-accent-bright mb-2">
            {aboutLabel}
          </div>
          <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-1">
            {member.name}
          </h3>
          {member.role && (
            <div className="text-xs font-medium text-accent-soft mb-3">
              {member.role}
            </div>
          )}
          {bio && (
            <p
              className="text-sm leading-relaxed text-light-soft whitespace-pre-line"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 5,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {bio}
            </p>
          )}
        </div>

        {/* Nome sempre visível em baixo quando não-hover */}
        <div
          className="absolute bottom-0 left-0 right-0 p-5 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            opacity: hovered ? 0 : 1,
            color: "var(--text-light)",
            pointerEvents: "none",
          }}
        >
          <h3 className="font-serif text-xl md:text-2xl leading-tight">
            {member.name}
          </h3>
          {member.role && (
            <div className="text-xs font-medium text-accent-bright mt-1">
              {member.role}
            </div>
          )}
        </div>
      </div>

      {/* Dica abaixo da foto */}
      <p
        className="text-center text-xs text-dark mt-4"
        style={{ opacity: 0.6 }}
      >
        Passe o mouse ou toque na foto pra ver mais
      </p>
    </div>
  );
}
