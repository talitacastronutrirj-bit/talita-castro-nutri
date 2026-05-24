import { getActiveTeam } from "@/lib/team";
import TeamMemberCard from "./TeamMemberCard";

export default async function Equipe() {
  const team = await getActiveTeam();

  return (
    <section id="equipe" className="py-16 md:py-24 bg-page-2">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">
            A banca
          </div>
          <h2
            className="font-serif text-3xl md:text-4xl mb-4"
            style={{ color: "var(--bg-dark)" }}
          >
            Quem cuida do seu caso
          </h2>
          <div className="gold-rule w-24 mx-auto mb-3" />
          <p
            className="text-sm max-w-xl mx-auto leading-relaxed text-dark"
          >
            Equipe estruturada com sócios titulares, advogados associados e
            equipe de apoio dedicada — todos com atendimento direto ao cliente.
            <span className="block text-[11px] mt-2 opacity-70">
              Passe o mouse sobre o card (ou toque, no celular) para ver os
              detalhes completos.
            </span>
          </p>
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
