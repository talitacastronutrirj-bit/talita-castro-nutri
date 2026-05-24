// Middleware do Next que:
// 1. Detecta o idioma preferido do visitante (cookie OU Accept-Language do browser)
// 2. Redireciona `/` → `/pt` (ou `/en` ou `/it`) conforme detecção
// 3. Mantém prefixo de idioma nas URLs internas
//
// Não roda em rotas /admin (admin é monolíngue, edita os 3 idiomas).
// Não roda em /api, _next, etc.

import createMiddleware from "next-intl/middleware";
import { LOCALES, DEFAULT_LOCALE } from "./i18n/config";

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  // "as-needed": URL fica /sobre (não /pt/sobre) quando idioma = default.
  // "always": sempre prefixa (/pt/sobre, /en/sobre, /it/sobre).
  // Escolhi "always" pra ficar explícito em cada URL — melhor SEO multi-idioma.
  localePrefix: "always",
  // Detecta idioma automaticamente pelo Accept-Language na 1ª visita
  localeDetection: true,
});

export const config = {
  // Aplica em tudo MENOS: /admin/*, /login, /api/*, /_next/*, /images/*, favicon, etc.
  matcher: [
    "/((?!admin|login|api|_next|images|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
