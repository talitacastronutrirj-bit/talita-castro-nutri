// =================================================================
// ROOT LAYOUT — área pública (multi-idioma)
// =================================================================
//
// Este é um dos 2 root layouts do app (o outro está em (private)/).
// Cobre tudo que está dentro de (public)/[locale]/* — home, artigos.
//
// Define <html lang> dinâmico baseado no locale da URL, carrega as
// mensagens UI (next-intl), aplica fontes + paleta, e renderiza
// Header/Footer/FloatingWhatsapp compartilhados pelas páginas públicas.

import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsapp from "@/components/FloatingWhatsapp";
import { getSiteSettings } from "@/lib/settings";
import { site } from "@/lib/site";
import { LOCALES, isLocale, type Locale } from "@/i18n/config";
import "../../globals.css";

// ISR: páginas públicas em cache de 60s (admin invalida via revalidatePath).
export const revalidate = 60;

// Pre-renderiza /pt, /en, /it no build.
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Open Graph locale codes
  const ogLocaleMap: Record<Locale, string> = {
    pt: "pt_BR",
    en: "en_US",
    it: "it_IT",
  };

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${site.tagline}`,
      template: `%s | ${site.name}`,
    },
    description: site.tagline,
    authors: [{ name: site.name }],
    openGraph: {
      type: "website",
      locale: ogLocaleMap[locale] ?? "pt_BR",
      url: `${site.url}/${locale}`,
      siteName: site.name,
      title: `${site.name} — ${site.tagline}`,
      description: site.tagline,
    },
    alternates: {
      canonical: `${site.url}/${locale}`,
      languages: Object.fromEntries(
        LOCALES.map((loc) => [loc, `${site.url}/${loc}`])
      ),
    },
    robots: { index: true, follow: true },
  };
}

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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PublicRootLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  // Habilita uso de useTranslations() em Server Components nesta árvore
  setRequestLocale(locale);

  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  return (
    <html
      lang={locale}
      data-palette={settings.palette}
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsapp />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
