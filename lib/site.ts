// =================================================================
// SITE — Configuração estática do template
// =================================================================
//
// Filosofia do template:
// - TUDO que é texto/imagem visível ao usuário fica no BANCO,
//   editável pelo admin em múltiplos idiomas.
// - Este arquivo guarda apenas o "irredutível": URL canônica,
//   nome curto pra fallback, e tipos de seções.
//
// Pra cada novo cliente baseado neste template:
// 1. Edita `name`, `url`, `email` aqui
// 2. Tudo o resto é editado via /admin

export const site = {
  // Nome do profissional / negócio
  name: "Novo Site",
  shortName: "Site",
  // Tagline curta (uso em fallback de metadata)
  tagline: "Atendimento profissional",
  // URL canônica
  url: "https://novo-site.vercel.app",
  // Email institucional (fallback se DB não tiver contact_email)
  email: "contato@exemplo.com",

  // ╭─────────────────────────────────────────────────────────╮
  // │ COMPAT SHIM — campos abaixo serão substituídos por DB   │
  // │ durante a migração. Mantidos vazios pra build não       │
  // │ quebrar enquanto refatoramos componente por componente. │
  // ╰─────────────────────────────────────────────────────────╯

  cnpj: null as string | null,

  // Escritórios/locais físicos — vai migrar pra tabela `locations`
  offices: [] as Array<{
    id: string;
    city: string;
    state: string;
    address: string;
    neighborhood: string;
    whatsapp: { number: string; display: string; href: string };
  }>,

  // WhatsApp principal — vai migrar pra setting + multi-país
  primaryWhatsapp: {
    number: "5500000000000",
    display: "(00) 00000-0000",
    href: "https://wa.me/5500000000000",
  },

  // Credenciais profissionais — vai migrar pra setting
  oab: {
    rj: [] as string[],
    es: [] as string[],
  },

  // Redes sociais — já é editável via settings (DB)
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
  },
} as const;

export type Office = (typeof site.offices)[number];
