import Image from "next/image";
import Link from "next/link";
import { getAllPostsIncludingDrafts, formatDate } from "@/lib/posts";
import { deleteExistingPost } from "./actions";

export const metadata = { title: "Blog" };

const NOTICES: Record<string, string> = {
  published: "Artigo publicado com sucesso.",
  "draft-saved": "Rascunho salvo.",
  deleted: "Artigo removido.",
};
const ERRORS: Record<string, string> = {
  db: "Erro ao acessar o banco de dados.",
};

export default async function PostsListPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { saved, error } = await searchParams;
  const posts = await getAllPostsIncludingDrafts();

  return (
    <div>
      {saved && NOTICES[saved] && (
        <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {NOTICES[saved]}
        </div>
      )}
      {error && ERRORS[error] && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {ERRORS[error]}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2
            className="font-serif text-2xl font-semibold"
            style={{ color: "var(--bg-dark)" }}
          >
            Blog
          </h2>
          <p className="text-sm text-dark" style={{ opacity: 0.7 }}>
            Posts publicados e rascunhos do blog do site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-sm text-dark hover:opacity-70"
            style={{ opacity: 0.7 }}
          >
            ← Voltar
          </Link>
          <Link
            href="/admin/artigos/novo"
            className="rounded btn-dark px-4 py-2 text-sm font-medium"
          >
            Novo artigo
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div
          className="rounded-2xl border bg-page p-8 text-center text-sm"
          style={{ borderColor: "var(--border-soft)" }}
        >
          Nenhum artigo cadastrado ainda.
        </div>
      ) : (
        <ul
          className="rounded-2xl border bg-page overflow-hidden"
          style={{ borderColor: "var(--border-soft)" }}
        >
          {posts.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-4 px-5 py-4 border-b last:border-b-0"
              style={{ borderColor: "var(--border-soft)" }}
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div
                  className="w-20 h-12 rounded-md overflow-hidden grid place-items-center shrink-0 border"
                  style={{
                    background: "var(--bg-dark)",
                    borderColor: "var(--border-soft)",
                  }}
                >
                  {p.cover ? (
                    <Image
                      src={p.cover}
                      alt={p.title.pt || Object.values(p.title)[0] || ""}
                      width={80}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-serif text-xs text-accent">—</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {p.isPublished ? (
                      <Link
                        href={`/artigos/${p.slug}`}
                        target="_blank"
                        className="font-medium hover:underline"
                        style={{ color: "var(--bg-dark)" }}
                      >
                        {p.title.pt || Object.values(p.title)[0] || "—"}
                      </Link>
                    ) : (
                      <span
                        className="font-medium"
                        style={{ color: "var(--bg-dark)" }}
                      >
                        {p.title.pt || Object.values(p.title)[0] || "—"}
                      </span>
                    )}
                    {!p.isPublished && (
                      <span className="text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 bg-amber-100 text-amber-800">
                        Rascunho
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xs text-dark mt-0.5"
                    style={{ opacity: 0.7 }}
                  >
                    {p.category}
                    {p.isPublished && p.date && (
                      <> · {formatDate(p.date)}</>
                    )}
                    {" · "}
                    <span style={{ opacity: 0.6 }}>{p.slug}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/admin/artigos/editar/${p.slug}`}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Editar
                </Link>
                <form action={deleteExistingPost}>
                  <input type="hidden" name="id" value={p.id} />
                  <button
                    type="submit"
                    className="text-xs text-red-700 hover:underline font-medium"
                    aria-label={`Remover ${p.title}`}
                  >
                    Remover
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
