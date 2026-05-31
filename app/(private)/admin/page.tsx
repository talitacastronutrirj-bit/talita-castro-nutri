import Link from "next/link";
import { getAllTeam } from "@/lib/team";
import { getAllPostsIncludingDrafts } from "@/lib/posts";
import { getAllAreas } from "@/lib/practice-areas";
import { getAllTestimonials } from "@/lib/testimonials";
import { getAllGallery } from "@/lib/gallery";
import { getAllFaq } from "@/lib/faq";
import { getAllPricingPlans } from "@/lib/pricing";
import { getAllHowItWorks } from "@/lib/how-it-works";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminDashboard() {
  const [team, posts, areas, testimonials, gallery, faq, pricing, howItWorks, settings] =
    await Promise.all([
      getAllTeam(),
      getAllPostsIncludingDrafts(),
      getAllAreas(),
      getAllTestimonials().catch(() => []),
      getAllGallery().catch(() => []),
      getAllFaq().catch(() => []),
      getAllPricingPlans().catch(() => []),
      getAllHowItWorks().catch(() => []),
      getSiteSettings(),
    ]);

  const activeMembers = team.filter((m) => m.isActive).length;
  const publishedPosts = posts.filter((p) => p.isPublished).length;
  const draftPosts = posts.length - publishedPosts;
  const activeAreas = areas.filter((a) => a.isActive).length;
  const activeTestimonials = testimonials.filter((t) => t.isActive).length;
  const activeGallery = gallery.filter((g) => g.isActive).length;
  const activeFaq = faq.filter((f) => f.isActive).length;
  const activePricing = pricing.filter((p) => p.isActive).length;
  const activeHowItWorks = howItWorks.filter((h) => h.isActive).length;

  const PALETTE_LABELS: Record<string, string> = {
    navy: "Marinho clássico",
    emerald: "Verde institucional",
    black: "Preto & Dourado",
    wine: "Vinho & Dourado",
    graphite: "Grafite & Bronze",
    coffee: "Café & Creme",
  };

  const cards = [
    {
      href: "/admin/aparencia",
      title: "Aparência",
      description: "Paleta de cores, hero, redes sociais e barra de destaque.",
      meta: `${PALETTE_LABELS[settings.palette]} · Hero: ${settings.heroMode === "logo" ? "Logo" : "Imagem"}`,
    },
    {
      href: "/admin/areas",
      title: "Áreas de atuação",
      description:
        "Cards da seção “Como podemos te ajudar” — adicionar, editar, reordenar.",
      meta:
        activeAreas > 0
          ? `${activeAreas} área${activeAreas === 1 ? "" : "s"} ativa${activeAreas === 1 ? "" : "s"}`
          : "Nenhuma área ativa",
    },
    {
      href: "/admin/como-funciona",
      title: "Como funciona",
      description:
        "Etapas do atendimento (3-5 cards). Útil pra atendimento online/internacional.",
      meta:
        activeHowItWorks > 0
          ? `${activeHowItWorks} etapa${activeHowItWorks === 1 ? "" : "s"} ativa${activeHowItWorks === 1 ? "" : "s"}`
          : "Nenhuma etapa",
    },
    {
      href: "/admin/equipe",
      title: "Equipe",
      description:
        "Adicionar, remover e reordenar profissionais e equipe de apoio.",
      meta: `${activeMembers} membro${activeMembers === 1 ? "" : "s"} ativo${activeMembers === 1 ? "" : "s"}`,
    },
    {
      href: "/admin/testimonials",
      title: "Depoimentos",
      description:
        "Provas sociais de pacientes/clientes — texto + foto + estrelas.",
      meta:
        activeTestimonials > 0
          ? `${activeTestimonials} ativo${activeTestimonials === 1 ? "" : "s"}`
          : "Nenhum cadastrado",
    },
    {
      href: "/admin/gallery",
      title: "Galeria",
      description:
        "Fotos do trabalho ou antes/depois (transformações de pacientes).",
      meta:
        activeGallery > 0
          ? `${activeGallery} foto${activeGallery === 1 ? "" : "s"} ativa${activeGallery === 1 ? "" : "s"}`
          : "Nenhuma foto",
    },
    {
      href: "/admin/pricing",
      title: "Preços / Pacotes",
      description:
        "Pacotes de serviço com preço, moeda e features (multi-moeda).",
      meta:
        activePricing > 0
          ? `${activePricing} pacote${activePricing === 1 ? "" : "s"}`
          : "Nenhum cadastrado",
    },
    {
      href: "/admin/faq",
      title: "FAQ",
      description:
        "Perguntas frequentes — multi-idioma, expansíveis na home.",
      meta:
        activeFaq > 0
          ? `${activeFaq} pergunta${activeFaq === 1 ? "" : "s"}`
          : "Nenhuma cadastrada",
    },
    {
      href: "/admin/artigos",
      title: "Blog",
      description: "Publicar, editar e remover posts do blog.",
      meta:
        draftPosts > 0
          ? `${publishedPosts} publicado${publishedPosts === 1 ? "" : "s"} · ${draftPosts} rascunho${draftPosts === 1 ? "" : "s"}`
          : `${publishedPosts} publicado${publishedPosts === 1 ? "" : "s"}`,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2
          className="font-serif text-2xl font-semibold mb-1"
          style={{ color: "var(--bg-dark)" }}
        >
          Painel
        </h2>
        <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
          Gerencie a aparência do site, a equipe e os posts do blog.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="card-hover block rounded-2xl border bg-page p-6 hover:shadow-lg transition"
            style={{ borderColor: "var(--border-soft)" }}
          >
            <h3
              className="font-serif text-xl mb-2"
              style={{ color: "var(--bg-dark)" }}
            >
              {c.title}
            </h3>
            <p className="text-sm text-dark mb-4">{c.description}</p>
            <div className="text-[11px] uppercase tracking-widest text-accent font-medium">
              {c.meta}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
