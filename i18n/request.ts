// Configuração que o next-intl chama no servidor a cada request.
// Recebe o `locale` extraído da URL (via middleware) e devolve as
// mensagens UI correspondentes (carregadas de messages/*.json).

import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, isLocale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fallback: se URL não tiver locale válido, usa o default
  if (!locale || !isLocale(locale)) {
    locale = DEFAULT_LOCALE;
  }

  let messages;
  try {
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return {
    locale,
    messages,
  };
});
