import { getTranslations } from "next-intl/server";
import { getActiveTeam } from "@/lib/team";
import TeamMemberCard from "./TeamMemberCard";

export default async function Equipe() {
  const [team, t] = await Promise.all([getActiveTeam(), getTranslations()]);

  // Esconde a seção inteira se não tem ninguém cadastrado
  if (team.length === 0) return null;

  return (
    <section id="equipe" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            {t("nav.team")}
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            {t("nav.team")}
          </h2>
          <div className="gold-rule w-24 mx-auto mb-3" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {team.map((m) => (
            <TeamMemberCard key={m.id} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}
