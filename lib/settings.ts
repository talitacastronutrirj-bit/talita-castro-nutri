// =================================================================
// SITE SETTINGS — store key/value (parte JSONB pra i18n)
// =================================================================
//
// Settings dividem-se em dois grupos:
//
// 1. SCALARS — valores simples (paleta, hero_mode, URLs de redes).
//    Salvos como texto puro no `value`.
//
// 2. LOCALIZED — textos editáveis pelo cliente em múltiplos idiomas.
//    Salvos como JSON string no `value` (formato {pt, en, it}).
//    O parser `toLocalized()` faz fallback se vier string solta ou vazio.

import { sql } from "./db";
import {
  emptyLocalized,
  toLocalized,
  type LocalizedText,
} from "./localized";

// ─── Tipos ────────────────────────────────────────────────────

export type Palette =
  // ─── Institucional (escuro, formal — direito, finanças, B2B) ───
  | "navy"
  | "emerald"
  | "black"
  | "wine"
  | "graphite"
  | "coffee"
  // ─── Pastel (claro, acolhedor — saúde, wellness, beleza, terapia) ───
  | "sage"
  | "blush"
  | "honey"
  | "mint";

// Paletas pastel ganham tipografia alternativa (mais delicada/feminina)
// no layout. Lista usada por components/Header e <html> data-attr.
export const PASTEL_PALETTES: Palette[] = ["sage", "blush", "honey", "mint"];

export type HeroMode = "logo" | "image";

export type HeroEntrance =
  | "none"
  | "fade"
  | "slide"
  | "zoom"
  | "rotate"
  | "spin";

export type HeroIdle = "none" | "float" | "pulse" | "slowrotate";

// Como o site capta agendamentos:
// - "whatsapp": só WhatsApp (default — mais simples)
// - "calendly": embed do Calendly inline na home (cliente agenda direto)
// - "both": Calendly + WhatsApp como opções alternativas
export type BookingMode = "whatsapp" | "calendly" | "both";

export type SiteSettings = {
  // ─── Identificação do profissional (editável pelo admin) ───
  // Sobrescrevem os defaults de lib/site.ts. Vazios = usa lib/site.ts.
  siteName: string;
  siteShortName: string;
  contactEmail: string;
  credentialType: string;        // "CRN-4", "OAB/RJ", "CRM/SP", etc
  credentialNumbers: string[];   // ["12345", "67890"]
  primaryWhatsappNumber: string; // "5521987654321" (DDI + DDD + número)
  primaryWhatsappDisplay: string; // "(21) 98765-4321"
  logoUrl: string;               // URL Cloudinary OU "" (cai pra placeholder /images/logo.svg)

  // Scalars (mesmo valor pra todos os idiomas)
  palette: Palette;
  heroMode: HeroMode;
  heroImageUrl: string;       // Foto que aparece NO CARD do hero quando heroMode=image
  heroBackgroundUrl: string;  // Imagem de FUNDO do hero (atrás dos textos) — "" cai pro CSS default
  heroLogoEntrance: HeroEntrance;
  heroLogoIdle: HeroIdle;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  bookingMode: BookingMode;
  calendlyUrl: string;

  // Localized (objeto {pt, en, it} pra cada)
  heroEyebrow: LocalizedText;
  heroHeading: LocalizedText;
  heroDescription: LocalizedText;
  trustBar1Label: LocalizedText;
  trustBar1Value: LocalizedText;
  trustBar2Label: LocalizedText;
  trustBar2Value: LocalizedText;
  trustBar3Label: LocalizedText;
  trustBar3Value: LocalizedText;
  trustBar4Label: LocalizedText;
  trustBar4Value: LocalizedText;
};

// ─── Defaults (template — cliente substitui via admin) ────────

const DEFAULTS: SiteSettings = {
  // Identificação — vazios = usa fallback de lib/site.ts
  siteName: "",
  siteShortName: "",
  contactEmail: "",
  credentialType: "",
  credentialNumbers: [],
  primaryWhatsappNumber: "",
  primaryWhatsappDisplay: "",
  logoUrl: "",

  palette: "navy",
  heroMode: "logo",
  heroImageUrl: "",
  heroBackgroundUrl: "",
  heroLogoEntrance: "slide",
  heroLogoIdle: "none",
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  bookingMode: "whatsapp",
  calendlyUrl: "",
  // Defaults com PT preenchido pra preview funcionar antes do cliente editar
  heroEyebrow: { pt: "Atendimento profissional", en: "", it: "" },
  heroHeading: {
    pt: "Cuidado com\n*técnica e proximidade*.",
    en: "Care with\n*expertise and closeness*.",
    it: "Cura con\n*competenza e vicinanza*.",
  },
  heroDescription: {
    pt: "Edite este texto em /admin/aparencia → Textos do hero.",
    en: "Edit this text in /admin/aparencia → Hero texts.",
    it: "Modifica questo testo in /admin/aparencia → Testi dell'hero.",
  },
  trustBar1Label: emptyLocalized(),
  trustBar1Value: emptyLocalized(),
  trustBar2Label: emptyLocalized(),
  trustBar2Value: emptyLocalized(),
  trustBar3Label: emptyLocalized(),
  trustBar3Value: emptyLocalized(),
  trustBar4Label: emptyLocalized(),
  trustBar4Value: emptyLocalized(),
};

// ─── Mapeamento JS → DB ──────────────────────────────────────

const KEY_MAP = {
  // identificação
  siteName: "site_name",
  siteShortName: "site_short_name",
  contactEmail: "contact_email",
  credentialType: "credential_type",
  credentialNumbers: "credential_numbers",
  primaryWhatsappNumber: "primary_whatsapp_number",
  primaryWhatsappDisplay: "primary_whatsapp_display",
  logoUrl: "logo_url",
  // scalars
  palette: "palette",
  heroMode: "hero_mode",
  heroImageUrl: "hero_image_url",
  heroBackgroundUrl: "hero_background_url",
  heroLogoEntrance: "hero_logo_entrance",
  heroLogoIdle: "hero_logo_idle",
  instagramUrl: "instagram_url",
  facebookUrl: "facebook_url",
  linkedinUrl: "linkedin_url",
  bookingMode: "booking_mode",
  calendlyUrl: "calendly_url",
  // localized
  heroEyebrow: "hero_eyebrow",
  heroHeading: "hero_heading",
  heroDescription: "hero_description",
  trustBar1Label: "trust_bar_1_label",
  trustBar1Value: "trust_bar_1_value",
  trustBar2Label: "trust_bar_2_label",
  trustBar2Value: "trust_bar_2_value",
  trustBar3Label: "trust_bar_3_label",
  trustBar3Value: "trust_bar_3_value",
  trustBar4Label: "trust_bar_4_label",
  trustBar4Value: "trust_bar_4_value",
} as const;

// Conjunto de chaves que armazenam LocalizedText (JSON serializado).
// Usado pra decidir parse string vs JSON na leitura.
const LOCALIZED_KEYS = new Set<keyof typeof KEY_MAP>([
  "heroEyebrow",
  "heroHeading",
  "heroDescription",
  "trustBar1Label",
  "trustBar1Value",
  "trustBar2Label",
  "trustBar2Value",
  "trustBar3Label",
  "trustBar3Value",
  "trustBar4Label",
  "trustBar4Value",
]);

// Helper: pega valor do mapa OU default
function getScalar<K extends keyof SiteSettings>(
  map: Map<string, string>,
  key: K
): string {
  return map.get(KEY_MAP[key]) ?? "";
}

function getLocalized<K extends keyof SiteSettings>(
  map: Map<string, string>,
  key: K,
  fallback: LocalizedText
): LocalizedText {
  const raw = map.get(KEY_MAP[key]);
  if (!raw) return fallback;
  const parsed = toLocalized(raw);
  // Se TUDO veio vazio, usa o fallback (defaults com PT preenchido)
  return Object.values(parsed).some((v) => v && v.length > 0)
    ? parsed
    : fallback;
}

// ─── Leitura ─────────────────────────────────────────────────

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = (await sql`SELECT key, value FROM settings`) as {
      key: string;
      value: string;
    }[];
    const map = new Map<string, string>();
    for (const r of rows) map.set(r.key, r.value);

    // Parser pra array de strings (newline-separated). Usado em credentialNumbers.
    const credentialNumbersRaw = getScalar(map, "credentialNumbers");
    const credentialNumbers = credentialNumbersRaw
      ? credentialNumbersRaw
          .split("\n")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : DEFAULTS.credentialNumbers;

    return {
      siteName: getScalar(map, "siteName") || DEFAULTS.siteName,
      siteShortName: getScalar(map, "siteShortName") || DEFAULTS.siteShortName,
      contactEmail: getScalar(map, "contactEmail") || DEFAULTS.contactEmail,
      credentialType:
        getScalar(map, "credentialType") || DEFAULTS.credentialType,
      credentialNumbers,
      primaryWhatsappNumber:
        getScalar(map, "primaryWhatsappNumber") ||
        DEFAULTS.primaryWhatsappNumber,
      primaryWhatsappDisplay:
        getScalar(map, "primaryWhatsappDisplay") ||
        DEFAULTS.primaryWhatsappDisplay,
      logoUrl: getScalar(map, "logoUrl") || DEFAULTS.logoUrl,

      palette:
        (getScalar(map, "palette") as Palette) || DEFAULTS.palette,
      heroMode:
        (getScalar(map, "heroMode") as HeroMode) || DEFAULTS.heroMode,
      heroImageUrl: getScalar(map, "heroImageUrl") || DEFAULTS.heroImageUrl,
      heroBackgroundUrl:
        getScalar(map, "heroBackgroundUrl") || DEFAULTS.heroBackgroundUrl,
      heroLogoEntrance:
        (getScalar(map, "heroLogoEntrance") as HeroEntrance) ||
        DEFAULTS.heroLogoEntrance,
      heroLogoIdle:
        (getScalar(map, "heroLogoIdle") as HeroIdle) || DEFAULTS.heroLogoIdle,
      instagramUrl: getScalar(map, "instagramUrl") || DEFAULTS.instagramUrl,
      facebookUrl: getScalar(map, "facebookUrl") || DEFAULTS.facebookUrl,
      linkedinUrl: getScalar(map, "linkedinUrl") || DEFAULTS.linkedinUrl,
      bookingMode:
        (getScalar(map, "bookingMode") as BookingMode) ||
        DEFAULTS.bookingMode,
      calendlyUrl: getScalar(map, "calendlyUrl") || DEFAULTS.calendlyUrl,

      heroEyebrow: getLocalized(map, "heroEyebrow", DEFAULTS.heroEyebrow),
      heroHeading: getLocalized(map, "heroHeading", DEFAULTS.heroHeading),
      heroDescription: getLocalized(
        map,
        "heroDescription",
        DEFAULTS.heroDescription
      ),
      trustBar1Label: getLocalized(
        map,
        "trustBar1Label",
        DEFAULTS.trustBar1Label
      ),
      trustBar1Value: getLocalized(
        map,
        "trustBar1Value",
        DEFAULTS.trustBar1Value
      ),
      trustBar2Label: getLocalized(
        map,
        "trustBar2Label",
        DEFAULTS.trustBar2Label
      ),
      trustBar2Value: getLocalized(
        map,
        "trustBar2Value",
        DEFAULTS.trustBar2Value
      ),
      trustBar3Label: getLocalized(
        map,
        "trustBar3Label",
        DEFAULTS.trustBar3Label
      ),
      trustBar3Value: getLocalized(
        map,
        "trustBar3Value",
        DEFAULTS.trustBar3Value
      ),
      trustBar4Label: getLocalized(
        map,
        "trustBar4Label",
        DEFAULTS.trustBar4Label
      ),
      trustBar4Value: getLocalized(
        map,
        "trustBar4Value",
        DEFAULTS.trustBar4Value
      ),
    };
  } catch (err) {
    console.error(
      "[settings] erro ao ler do DB, caindo pros defaults:",
      err
    );
    return DEFAULTS;
  }
}

// ─── Escrita ─────────────────────────────────────────────────

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<void> {
  const updates: { key: string; value: string }[] = [];

  for (const key of Object.keys(patch) as (keyof SiteSettings)[]) {
    const value = patch[key];
    if (value === undefined) continue;
    const dbKey = KEY_MAP[key];
    if (!dbKey) continue;

    if (LOCALIZED_KEYS.has(key)) {
      // Serializa LocalizedText como JSON
      updates.push({
        key: dbKey,
        value: JSON.stringify(value),
      });
    } else if (Array.isArray(value)) {
      // Array de strings (credentialNumbers) — junta com newline pra
      // ficar legível no DB e fácil de editar como textarea
      updates.push({
        key: dbKey,
        value: value.join("\n"),
      });
    } else {
      // Scalar — converte pra string
      updates.push({ key: dbKey, value: String(value) });
    }
  }

  for (const { key, value } of updates) {
    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${value}, NOW())
      ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value, updated_at = NOW()
    `;
  }
}
