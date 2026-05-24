import Link from "next/link";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getPostBySlug } from "@/lib/posts";
import { updateExistingPost } from "../../actions";

export const metadata = { title: "Editar artigo" };

const ERRORS: Record<string, string> = {
  "missing-title": "Preencha o título.",
  "missing-excerpt": "Preencha o resumo.",
  "missing-content": "Preencha o conteúdo.",
  "missing-slug": "Slug inválido.",
  db: "Erro ao salvar no banco. Tente novamente.",
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { error } = await searchParams;
  const errMsg = error ? ERRORS[error] : null;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2
          className="font-serif text-2xl font-semibold"
          style={{ color: "var(--bg-dark)" }}
        >
          Editar artigo
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
        action={updateExistingPost}
        post={post}
        cancelHref="/admin/artigos"
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
