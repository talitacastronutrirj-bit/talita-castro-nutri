// =================================================================
// ROOT LAYOUT — área privada (admin + login, monolíngue)
// =================================================================
//
// Este é o root layout das rotas /admin/* e /login (sem prefixo de
// idioma). O admin tem seu próprio sub-layout em (private)/admin/
// que renderiza header/nav próprio. /login renderiza só a tela.

import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import "../globals.css";

// Admin é dinâmico (lê cookie de sessão), mas como é route group de
// outro root, define no layout filho (admin/layout.tsx) e em login/page.tsx.

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default async function PrivateRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aplica paleta no <html> do admin pra UI ficar coerente com o site público
  const settings = await getSiteSettings();

  return (
    <html
      lang="pt-BR"
      data-palette={settings.palette}
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
