import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import Areas from "@/components/Areas";
import Equipe from "@/components/Equipe";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import FAQ from "@/components/FAQ";
import ArtigosSection from "@/components/ArtigosSection";
import Contato from "@/components/Contato";
import type { Locale } from "@/i18n/config";

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  // Habilita useTranslations() em todos os Server Components renderizados
  // por esta página. Obrigatório quando se quer SSG/ISR com next-intl.
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <TrustBar />
      <Areas />
      <Equipe />
      <Gallery />
      <Testimonials />
      <FAQ />
      <ArtigosSection />
      <Contato />
    </>
  );
}
