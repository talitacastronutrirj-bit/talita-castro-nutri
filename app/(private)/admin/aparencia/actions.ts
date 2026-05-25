"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import {
  updateSiteSettings,
  type Palette,
  type HeroMode,
  type HeroEntrance,
  type HeroIdle,
  type BookingMode,
} from "@/lib/settings";
import { readLocalizedFromFormData } from "@/lib/localized";

const PALETTES: Palette[] = [
  "navy",
  "emerald",
  "black",
  "wine",
  "graphite",
  "coffee",
];
const HERO_MODES: HeroMode[] = ["logo", "image"];
const ENTRANCES: HeroEntrance[] = [
  "none",
  "fade",
  "slide",
  "zoom",
  "rotate",
  "spin",
];
const IDLES: HeroIdle[] = ["none", "float", "pulse", "slowrotate"];
const BOOKING_MODES: BookingMode[] = ["whatsapp", "calendly", "both"];

export async function saveAppearance(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  // ─── Identificação do profissional ────────────────────────
  const siteName = String(formData.get("siteName") ?? "").trim();
  const siteShortName = String(formData.get("siteShortName") ?? "").trim();
  const contactEmail = String(formData.get("contactEmail") ?? "").trim();
  const credentialType = String(formData.get("credentialType") ?? "").trim();
  const credentialNumbersRaw = String(
    formData.get("credentialNumbers") ?? ""
  );
  const credentialNumbers = credentialNumbersRaw
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const primaryWhatsappNumber = String(
    formData.get("primaryWhatsappNumber") ?? ""
  )
    .replace(/[^\d]/g, ""); // só dígitos (DDI + DDD + número)
  const primaryWhatsappDisplay = String(
    formData.get("primaryWhatsappDisplay") ?? ""
  ).trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim();

  // ─── Scalars ──────────────────────────────────────────────
  const palette = String(formData.get("palette") ?? "") as Palette;
  const heroMode = String(formData.get("heroMode") ?? "") as HeroMode;
  const heroImageUrl = String(formData.get("heroImageUrl") ?? "").trim();
  const heroLogoEntrance = String(
    formData.get("heroLogoEntrance") ?? ""
  ) as HeroEntrance;
  const heroLogoIdle = String(formData.get("heroLogoIdle") ?? "") as HeroIdle;
  const instagramUrl = String(formData.get("instagramUrl") ?? "").trim();
  const facebookUrl = String(formData.get("facebookUrl") ?? "").trim();
  const linkedinUrl = String(formData.get("linkedinUrl") ?? "").trim();
  const bookingMode = String(formData.get("bookingMode") ?? "whatsapp") as BookingMode;
  const calendlyUrl = String(formData.get("calendlyUrl") ?? "").trim();

  // ─── Localized (lê <name>__pt, <name>__en, <name>__it) ────
  const heroEyebrow = readLocalizedFromFormData(formData, "heroEyebrow");
  const heroHeading = readLocalizedFromFormData(formData, "heroHeading");
  const heroDescription = readLocalizedFromFormData(formData, "heroDescription");
  const trustBar1Label = readLocalizedFromFormData(formData, "trustBar1Label");
  const trustBar1Value = readLocalizedFromFormData(formData, "trustBar1Value");
  const trustBar2Label = readLocalizedFromFormData(formData, "trustBar2Label");
  const trustBar2Value = readLocalizedFromFormData(formData, "trustBar2Value");
  const trustBar3Label = readLocalizedFromFormData(formData, "trustBar3Label");
  const trustBar3Value = readLocalizedFromFormData(formData, "trustBar3Value");
  const trustBar4Label = readLocalizedFromFormData(formData, "trustBar4Label");
  const trustBar4Value = readLocalizedFromFormData(formData, "trustBar4Value");

  // ─── Validações ───────────────────────────────────────────
  if (!PALETTES.includes(palette)) {
    redirect("/admin/aparencia?error=palette");
  }
  if (!HERO_MODES.includes(heroMode)) {
    redirect("/admin/aparencia?error=heroMode");
  }
  if (!ENTRANCES.includes(heroLogoEntrance)) {
    redirect("/admin/aparencia?error=entrance");
  }
  if (!IDLES.includes(heroLogoIdle)) {
    redirect("/admin/aparencia?error=idle");
  }
  if (!BOOKING_MODES.includes(bookingMode)) {
    redirect("/admin/aparencia?error=booking");
  }

  await updateSiteSettings({
    siteName,
    siteShortName,
    contactEmail,
    credentialType,
    credentialNumbers,
    primaryWhatsappNumber,
    primaryWhatsappDisplay,
    logoUrl,
    palette,
    heroMode,
    heroImageUrl,
    heroLogoEntrance,
    heroLogoIdle,
    heroEyebrow,
    heroHeading,
    heroDescription,
    instagramUrl,
    facebookUrl,
    linkedinUrl,
    bookingMode,
    calendlyUrl,
    trustBar1Label,
    trustBar1Value,
    trustBar2Label,
    trustBar2Value,
    trustBar3Label,
    trustBar3Value,
    trustBar4Label,
    trustBar4Value,
  });

  revalidatePath("/", "layout");
  redirect("/admin/aparencia?saved=1");
}
