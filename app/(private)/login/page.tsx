import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { login } from "./actions";

// Login lê cookie pra detectar se já tá logado e redirecionar.
// Sempre dinâmico — sobrescreve revalidate do layout raiz.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

const ERRORS: Record<string, string> = {
  invalid: "Senha incorreta. Tente novamente.",
  config: "Configuração do admin ausente. Contate o desenvolvedor.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/admin");

  const { error } = await searchParams;
  const errorMsg = error ? ERRORS[error] : null;

  return (
    <section className="py-20 md:py-28 bg-page-2 min-h-[calc(100vh-160px)]">
      <div className="max-w-md mx-auto px-6">
        <div className="rounded-2xl border bg-page p-8 shadow-sm" style={{ borderColor: "var(--border-soft)" }}>
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-2">
            Administração
          </div>
          <h1
            className="font-serif text-3xl mb-2"
            style={{ color: "var(--bg-dark)" }}
          >
            Painel da banca
          </h1>
          <p className="text-sm text-dark mb-8" style={{ opacity: 0.7 }}>
            Entre com a senha de administrador para gerenciar o site.
          </p>

          {errorMsg && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMsg}
            </div>
          )}

          <form action={login} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--bg-dark)" }}
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                className="block w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: "var(--border-soft)",
                  background: "white",
                }}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 btn-dark px-4 py-3 rounded-full text-sm font-medium"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
