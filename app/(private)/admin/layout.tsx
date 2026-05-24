import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { logout } from "../login/actions";

// Admin precisa ler cookie de sessão a cada request — sempre dinâmico.
// Sobrescreve o `revalidate = 60` do layout raiz.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Administração",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <section className="bg-page-2 py-10 md:py-14 min-h-[calc(100vh-160px)]">
      <div className="max-w-5xl mx-auto px-4">
        <header
          className="mb-8 flex items-center justify-between border-b pb-4"
          style={{ borderColor: "var(--border-soft)" }}
        >
          <div>
            <Link
              href="/admin"
              className="font-serif text-xl font-semibold hover:opacity-70"
              style={{ color: "var(--bg-dark)" }}
            >
              Administração
            </Link>
            <p className="text-xs text-dark" style={{ opacity: 0.6 }}>
              Conectado como {session.username}
            </p>
          </div>

          <nav className="flex items-center gap-5 text-sm text-dark">
            <Link href="/admin/aparencia" className="hover:opacity-70">
              Aparência
            </Link>
            <Link href="/admin/areas" className="hover:opacity-70">
              Áreas
            </Link>
            <Link href="/admin/equipe" className="hover:opacity-70">
              Equipe
            </Link>
            <Link href="/admin/artigos" className="hover:opacity-70">
              Artigos
            </Link>
            <Link
              href="/"
              target="_blank"
              className="hover:opacity-70 inline-flex items-center gap-1"
            >
              Ver site
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M14 3h7v7M21 3L10 14M21 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h5" />
              </svg>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded border px-3 py-1.5 text-xs hover:bg-page"
                style={{ borderColor: "var(--border-soft)" }}
              >
                Sair
              </button>
            </form>
          </nav>
        </header>

        {children}
      </div>
    </section>
  );
}
