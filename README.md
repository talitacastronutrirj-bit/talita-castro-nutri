# Nogueira Porto Advogados — Site Institucional

Site institucional da banca **Nogueira Porto Advogados** (Niterói/RJ + Vila Velha/ES).

Áreas: Direito Imobiliário, Registral e Notarial · Família · Sucessões · Consumidor · Trabalhista · Previdenciário · Criminal · Pessoas com Deficiência.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **Estilo:** Tailwind CSS v4 + Cormorant Garamond + Inter
- **Banco (Fase 2):** Neon (PostgreSQL serverless · São Paulo)
- **Imagens (Fase 2):** Cloudinary (upload assinado)
- **Hospedagem:** Netlify (auto-deploy a cada push em `main`)
- **Domínio:** nogueiraporto.adv.br

## Status

| Fase | Estado |
|---|---|
| Mockup HTML estático | ✅ Concluído (substituído por Next.js) |
| Fase 1 — Site público em Next.js | ✅ Implementado |
| Fase 2 — Admin (equipe + blog + aparência) | 🚧 Pendente (aguardando credenciais Neon + Cloudinary) |
| Fase 3 — Apontamento de domínio | 🟡 Aguardando aprovação do cliente |

## Estrutura

```
app/
├── layout.tsx              Header + Footer + FloatingWhatsapp
├── page.tsx                Home (todas as seções)
├── globals.css             Paletas (3) + animações + fontes
├── sitemap.ts              Sitemap dinâmico
├── robots.ts               robots.txt
└── artigos/
    ├── page.tsx            Listagem de artigos
    └── [slug]/page.tsx     Post individual (renderiza markdown)

components/
├── Header.tsx              Sticky com logo + nav + CTA
├── Hero.tsx                Animado, logo no card, hero overlay palette-aware
├── TrustBar.tsx            4 destaques institucionais
├── Areas.tsx               8 áreas de atuação (Imobiliário em destaque)
├── Equipe.tsx              Cards dos sócios + apoio (mock data → DB)
├── QuandoProcurar.tsx      Lista de situações comuns
├── FAQ.tsx                 Native <details> accordion
├── ArtigosSection.tsx      2 últimos posts na home
├── Contato.tsx             2 escritórios lado a lado
├── Footer.tsx
├── FloatingWhatsapp.tsx    Botão verde fixo com pulse
├── WhatsAppCTA.tsx         Modal de qualificação antes do WhatsApp
├── PaletteSwitcher.tsx     [TEMP] Toggle entre 3 paletas
└── LogoEffectControl.tsx   [TEMP] Seletor de efeitos (entrada + contínuo)

lib/
├── site.ts                 Config (nome, OAB, endereços, WhatsApps)
├── team.ts                 Mock data da equipe (→ Neon na Fase 2)
└── posts.ts                Mock data dos posts (→ Neon na Fase 2)

public/images/
└── logo-np.png             Logo principal da banca
```

## Paletas

3 paletas alternáveis via `data-palette` no `<html>` (persiste em localStorage):

- `navy` — Marinho clássico (padrão)
- `emerald` — Verde institucional
- `black` — Preto & Dourado

Todas usam Cormorant Garamond (serif) + Inter (sans), com accent dourado consistente entre paletas. Definidas em `app/globals.css`.

## Efeitos da logo (hero)

Combináveis via 2 dimensões — **entrada** (toca 1×) + **contínuo** (loop):

- Entrada: `fade` · `slide` · `zoom` · `rotate` · `spin`
- Contínuo: `float` · `pulse` · `slowrotate`

Configurados pelo cliente no admin (Fase 2).

## Modal de qualificação WhatsApp

Antes de enviar a mensagem, o visitante vê um modal mostrando o escopo da banca + credenciais. Filtra contatos fora do nicho. Mesma estratégia aplicada com sucesso em [drnacionalidade.com.br](https://drnacionalidade.com.br).

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## Deploy

Auto-deploy via Netlify a cada push em `main`. Configurar variáveis de ambiente em Site Settings → Environment Variables (Fase 2):

- `DATABASE_URL` (Neon)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `ADMIN_PASSWORD`, `SESSION_SECRET`

## Desenvolvido por

M. M. Carvalho · MEI 41.180.810/0001-54

📧 mmcarvalho.dev@gmail.com · 💬 (21) 99809-2744
