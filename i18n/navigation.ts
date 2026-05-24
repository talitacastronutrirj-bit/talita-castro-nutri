// Helpers de navegação locale-aware do next-intl.
//
// Usar `Link` daqui em vez do `next/link` em qualquer link que deve
// respeitar o idioma ativo. Exemplo:
//
//   import { Link } from "@/i18n/navigation";
//   <Link href="/artigos">Artigos</Link>
//   // → renderiza /pt/artigos, /en/artigos ou /it/artigos
//
// Também exporta `redirect`, `usePathname` e `useRouter` localized
// (importantes pro switch de idioma e ações que redirecionam).

import { createNavigation } from "next-intl/navigation";
import { LOCALES, DEFAULT_LOCALE } from "./config";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: "always",
  });
