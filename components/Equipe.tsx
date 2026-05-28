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
  const sectionLabel = useSoloLayout
    ? t("nav.about")
    : t("nav.team");

  return (
    <section id="equipe" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {sectionLabel}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {sectionLabel}
          </h2>
          <div className="gold-rule w-24 mx-auto mb-3" />
        </div>

        {useSoloLayout ? (
          <TeamMemberSolo
            member={team[0]}
            layout={
              settings.teamSoloLayout as "about-centered" | "about-side"
            }
            aboutLabel={t("nav.about")}
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
