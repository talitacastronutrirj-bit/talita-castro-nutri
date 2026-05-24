import Image from "next/image";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/lib/settings";

export default async function Footer() {
  const settings = await getSiteSettings();

  type SocialLink = { label: string; href: string; icon: React.ReactNode };
  const socialLinks: SocialLink[] = [];
  if (settings.instagramUrl) {
    socialLinks.push({
      label: "Instagram",
      href: settings.instagramUrl,
      icon: <InstagramIcon />,
    });
  }
  if (settings.facebookUrl) {
    socialLinks.push({
      label: "Facebook",
      href: settings.facebookUrl,
      icon: <FacebookIcon />,
    });
  }
  if (settings.linkedinUrl) {
    socialLinks.push({
      label: "LinkedIn",
      href: settings.linkedinUrl,
      icon: <LinkedInIcon />,
    });
  }

  return (
    <footer
      className="bg-darkest border-t text-light-soft text-sm"
      style={{ borderColor: "var(--border-soft-dark)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-12 gap-10">
        {/* Coluna 1: logo + descrição + redes sociais */}
        <div className="md:col-span-4">
          <Image
            src="/images/logo.png"
            alt={site.name}
            width={160}
            height={80}
            className="h-20 w-auto mb-4"
          />
          <p className="leading-relaxed text-xs">
            {site.name}. Atendimento jurídico personalizado.
          </p>

          {socialLinks.length > 0 && (
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 grid place-items-center rounded-full border transition-colors hover:bg-accent/20"
                  style={{
                    borderColor: "var(--border-soft-dark)",
                    color: "var(--accent)",
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Coluna 2: credenciais */}
        <div className="md:col-span-3">
          <div className="text-light font-medium mb-3">Credenciais</div>
          <ul className="space-y-1 text-xs">
            {site.oab.rj.map((n) => (
              <li key={`rj-${n}`}>OAB/RJ {n}</li>
            ))}
            {site.oab.es.map((n) => (
              <li key={`es-${n}`}>OAB/ES {n}</li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: endereços (todos os escritórios) */}
        <div className="md:col-span-5">
          <div className="text-light font-medium mb-3">Escritórios</div>
          <ul className="space-y-4 text-xs">
            {site.offices.map((o) => (
              <li key={o.id}>
                <div className="text-light font-medium mb-0.5">
                  {o.city} · {o.state}
                </div>
                <div className="leading-relaxed">
                  {o.address}
                  {o.neighborhood && (
                    <>
                      <br />
                      {o.neighborhood}
                    </>
                  )}
                </div>
                <a
                  href={o.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 hover:text-accent"
                >
                  {o.whatsapp.display}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t" style={{ borderColor: "var(--border-soft-dark)" }}>
              <a
                href={`mailto:${site.email}`}
                className="hover:text-accent"
              >
                {site.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="border-t"
        style={{ borderColor: "var(--border-soft-dark)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 text-xs flex flex-wrap gap-3 justify-between text-light-soft-2">
          <span>
            © {new Date().getFullYear()} {site.name}. Todos os direitos
            reservados.
          </span>
          <span>nogueiraporto.adv.br</span>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12.07C22 6.51 17.52 2 12 2S2 6.51 2 12.07c0 5 3.66 9.15 8.44 9.93v-7.03h-2.54v-2.9h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V22c4.78-.78 8.44-4.93 8.44-9.93z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14zM8.34 18.34V10.5H5.67v7.84h2.67zM7 9.33A1.55 1.55 0 105.67 7.5 1.55 1.55 0 007 9.33zm11.33 9V14.1c0-2.5-1.34-3.67-3.12-3.67a2.7 2.7 0 00-2.45 1.35V10.5h-2.67v7.84h2.67v-4.36c0-1.15.22-2.27 1.65-2.27 1.41 0 1.43 1.32 1.43 2.34v4.29h2.49z" />
    </svg>
  );
}
