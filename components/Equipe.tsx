import { getTranslations } from "next-intl/server";
import { getActiveTeam } from "@/lib/team";
import { getSiteSettings } from "@/lib/settings";
import TeamMemberCard from "./TeamMemberCard";
import TeamMemberSolo from "./TeamMemberSolo";

export default async function Equipe() {
  const [team, t, settings] = await Promise.all([
    getActiveTeam(),
    getTranslations(),
    getSiteSettings(),
  ]);

  // Esconde a seção inteira se não tem ninguém cadastrado
  if (team.length === 0) return null;

  // Profissional autônomo (1 membro só) → layout customizável:
  // - "team":           grid normal (como múltiplos membros)
  // - "about-centered": foto grande centralizada + bio no hover
  // - "about-side":     foto à esquerda + bio em texto à direita
  const isSolo = team.length === 1;
  const useSoloLayout = isSolo && settings.teamSoloLayout !== "team";
  // Quando solo: eyebrow "PROFISSIONAL" + h2 com o NOME dela em destaque
  // (a pessoa é o foco, não um título genérico).
  // Pra equipe (2+ pessoas): ambos viram "Equipe" (foco no grupo).
  const eyebrowLabel = useSoloLayout
    ? t("nav.professional")
    : t("nav.team");
  const headingLabel = useSoloLayout ? team[0].name : t("nav.team");
  // Cargo da pessoa solo, mostrado como subtítulo abaixo do nome
  const headingSubtitle = useSoloLayout ? team[0].role : null;

  return (
    <section id="equipe" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {eyebrowLabel}
          </div>
          <h2
            className="font-serif text-3xl md:text-5xl mb-3"
            style={{ color: "var(--bg-dark)" }}
          >
            {headingLabel}
          </h2>
          {headingSubtitle && (
            <div
              className="text-sm md:text-base font-medium mb-4"
              style={{ color: "var(--accent)" }}
            >
              {headingSubtitle}
            </div>
          )}
          <div className="gold-rule w-24 mx-auto mb-3" />
        </div>

        {useSoloLayout ? (
          <TeamMemberSolo
            member={team[0]}
            layout={
              settings.teamSoloLayout as "about-centered" | "about-side"
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((m) => (
              <TeamMemberCard key={m.id} member={m} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
