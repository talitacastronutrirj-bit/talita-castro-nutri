import Link from "next/link";
import PostForm from "@/components/admin/PostForm";
import { createNewPost } from "../actions";

export const metadata = { title: "Novo artigo" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-excerpt": "Preencha o resumo.",
  "missing-content": "Preencha o conteúdo.",
  "missing-slug": "Não consegui gerar slug a partir do título. Informe manualmente.",
  "slug-exists": "Já existe um artigo com esse slug. Edite a URL.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Novo artigo
        </h2>
        <Link
          href="/admin/artigos"
          className="text-sm text-dark hover:opacity-70"
          style={{ opacity: 0.7 }}
        >
          ← Voltar
        </Link>
      </div>

      {errMsg && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errMsg}
        </div>
      )}

      <PostForm
        action={createNewPost}
        cancelHref="/admin/artigos"
        submitLabel="Salvar artigo"
      />
    </div>
  );
}
