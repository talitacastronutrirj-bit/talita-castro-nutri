# Nutri Template — Site institucional multi-idioma

Template comercial reutilizável para profissionais autônomos
(nutricionistas, advogados, psicólogos, médicos, terapeutas, etc.) que
precisam de site institucional com admin próprio.

Tudo que é texto/imagem visível ao usuário fica editável no `/admin`,
em 3 idiomas (PT / EN / IT) — sem precisar de dev pra mudar conteúdo.

## Stack

- **Framework:** Next.js 16 (App Router, Server Components, Server Actions)
- **i18n:** next-intl v4 (PT / EN / IT, locale prefix sempre, detecção automática)
- **Banco:** Neon (PostgreSQL serverless) — JSONB pra campos multi-idioma
- **Imagens:** Cloudinary (upload assinado via admin)
- **Estilo:** Tailwind CSS v4 + Cormorant Garamond + Inter
- **Auth admin:** JWT (jose) + cookie httpOnly
- **Hospedagem:** Netlify (auto-deploy a cada push em `main`)

## Filosofia

- **Template-mãe é genérico.** Nada de nome, logo ou contato hardcoded.
- **`/admin/aparencia` é o "instalador"** — primeiro acesso, o cliente
  preenche identificação (nome, CRN/OAB/CRM/etc, WhatsApp, e-mail, logo)
  e a partir daí tudo flui dos dados do banco.
- **Cada cliente tem seu próprio repo, Neon e Cloudinary** — isolamento
  total. Atualizações do template-mãe são puxadas via `git pull template main`.

## Estrutura

```
app/
├── (public)/[locale]/         Páginas públicas (com prefixo /pt /en /it)
│   ├── layout.tsx              <html lang> dinâmico + Header/Footer
│   ├── page.tsx                Home (todas as seções configuráveis)
│   └── artigos/                Listagem + post individual
├── (private)/                  Admin (sem prefixo de locale)
│   ├── admin/                  CRUD de cada seção
│   └── login/                  Login simples (senha)
├── sitemap.ts                  Sitemap dinâmico
└── robots.ts                   robots.txt

components/                     Hero, Areas, Equipe, FAQ, Testimonials,
                                Gallery, Pricing, Booking, etc.

lib/
├── site.ts                     Defaults estáticos + resolveSiteData(settings)
├── settings.ts                 Get/save de configurações (Neon)
├── localized.ts                Helpers pra campos JSONB multi-idioma
├── practice-areas.ts           CRUD de áreas
├── team.ts                     CRUD de equipe
├── posts.ts                    CRUD do blog
├── testimonials.ts             CRUD de depoimentos
├── gallery.ts                  CRUD de antes/depois (Cloudinary)
└── pricing.ts                  CRUD de planos (multi-moeda)

migrations/                     SQL versionado (rodar com `npm run migrate`)
messages/                       Strings de UI por idioma (pt.json, en.json, it.json)
i18n/                           next-intl config + navegação localizada
public/images/logo.svg          Placeholder neutro (sobrescrito via Cloudinary)
```

## Paletas

6 paletas alternáveis via `/admin/aparencia` (persiste em DB):

- `navy` · `emerald` · `black` · `nutri` · `derma` · `psi`

Definidas em `app/globals.css`. Cada paleta tem `--bg-*`, `--text-*` e
`--accent` próprios. Todas usam Cormorant Garamond (serif) + Inter (sans).

## Hero animado

2 dimensões combináveis — **entrada** (toca 1×) + **contínuo** (loop):

- Entrada: `fade` · `slide` · `zoom` · `rotate` · `spin`
- Contínuo: `float` · `pulse` · `slowrotate`

Configurados pelo cliente em `/admin/aparencia`.

## Booking

Modo configurável em `/admin/aparencia`:

- `whatsapp` — botão grande pra WhatsApp principal
- `calendly` — iframe inline do Calendly
- `both` — Calendly + WhatsApp lado a lado

## Desenvolvimento

```bash
npm install
npm run migrate      # aplica migrations 001-006 no Neon
npm run dev          # http://localhost:3000
npm run build        # production build
npm run lint
```

## Variáveis de ambiente

Copia pra `.env.local` (dev) e pra **Netlify > Environment**:

```
DATABASE_URL=postgresql://...neon.tech/...
JWT_SECRET=<gerar: openssl rand -base64 32>
ADMIN_USERNAME=admin
ADMIN_PASSWORD=<senha forte>
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_FOLDER=<slug-do-cliente>
NEXT_PUBLIC_BASE_URL=https://...
```

## Aplicar a um novo cliente

```bash
# 1. Cria repo novo no GitHub do cliente
# 2. Clona o template
git clone https://github.com/mmcarvalhodev/nutri-template.git cliente-x
cd cliente-x

# 3. Reconfigura remotes
git remote remove origin
git remote add origin https://github.com/cliente-x/cliente-x.git
git remote add template https://github.com/mmcarvalhodev/nutri-template.git
git push -u origin main

# 4. Provisiona infra: Neon project + Cloudinary + Netlify (cada um isolado)
# 5. Configura .env.local + Netlify env vars
# 6. npm run migrate
# 7. Cliente acessa /admin e preenche o site
```

Pra trazer melhorias do template-mãe pra um cliente já em produção:

```bash
git pull template main
git push origin main
```

## Desenvolvido por

M. M. Carvalho · MEI 41.180.810/0001-54

📧 mmcarvalho.dev@gmail.com
