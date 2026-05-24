import Link from "next/link";
import ImageUpload from "./ImageUpload";
import { LocalizedInput, LocalizedTextarea } from "./LocalizedInput";
import type { Post } from "@/lib/posts";

type Props = {
  action: (formData: FormData) => Promise<void>;
  post?: Post;
  cancelHref: string;
  submitLabel: string;
};

export default function PostForm({
  action,
  post,
  cancelHref,
  submitLabel,
}: Props) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl border bg-page p-6 md:p-8"
      style={{ borderColor: "var(--border-soft)" }}
    >
      {post && <input type="hidden" name="id" value={post.id} />}

      {/* Cover */}
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--bg-dark)" }}
        >
          Capa do artigo{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (opcional)
          </span>
        </label>
        <ImageUpload
          name="coverUrl"
          context="blog"
          aspectRatio="wide"
          defaultValue={post?.cover ?? ""}
          label="Selecionar capa"
        />
      </div>

      {/* Título */}
      <div>
        <label
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Título
        </label>
        <LocalizedInput
          name="title"
          defaultValue={post?.title}
          required
          placeholder={{
            pt: "Ex: 5 dicas de nutrição para brasileiros nos EUA",
            en: "Ex: 5 nutrition tips for Brazilians in the US",
            it: "Es: 5 consigli di nutrizione per brasiliani in Italia",
          }}
        />
      </div>

      {/* Slug + Categoria */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Slug{" "}
            <span
              className="font-normal text-dark"
              style={{ opacity: 0.6 }}
            >
              {post ? "(URL fixa)" : "(gerado a partir do título se vazio)"}
            </span>
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={post?.slug ?? ""}
            placeholder="inventario-extrajudicial"
            className="block w-full rounded-lg border px-3 py-2 text-sm font-mono"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--bg-dark)" }}
          >
            Categoria
          </label>
          <input
            id="category"
            name="category"
            type="text"
            defaultValue={post?.category ?? "Artigo"}
            placeholder="Imobiliário · Registral"
            className="block w-full rounded-lg border px-3 py-2 text-sm"
            style={{
              borderColor: "var(--border-soft)",
              background: "white",
            }}
          />
        </div>
      </div>

      {/* Resumo */}
      <div>
        <label
          htmlFor="excerpt"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Resumo{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (aparece nos cards e na previsualização do Google)
          </span>
        </label>
        <LocalizedTextarea
          name="excerpt"
          defaultValue={post?.excerpt}
          rows={3}
          required
        />
      </div>

      {/* Autor */}
      <div>
        <label
          htmlFor="author"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Autor
        </label>
        <input
          id="author"
          name="author"
          type="text"
          defaultValue={post?.author ?? ""}
          placeholder="Ex: Nome do autor"
          className="block w-full rounded-lg border px-3 py-2 text-sm"
          style={{
            borderColor: "var(--border-soft)",
            background: "white",
          }}
        />
      </div>

      {/* Conteúdo */}
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium mb-1.5"
          style={{ color: "var(--bg-dark)" }}
        >
          Conteúdo{" "}
          <span
            className="font-normal text-dark"
            style={{ opacity: 0.6 }}
          >
            (Markdown — use ## para títulos, **negrito**, etc.)
          </span>
        </label>
        <LocalizedTextarea
          name="content"
          defaultValue={post?.content}
          rows={20}
          required
          placeholder={{
            pt: "Escreva o artigo aqui...\n\n## Seção\n\nUse ## para subtítulos. Use **palavra** para negrito.",
            en: "Write the article here...\n\n## Section\n\nUse ## for subtitles. Use **word** for bold.",
            it: "Scrivi qui l'articolo...\n\n## Sezione\n\nUsa ## per i sottotitoli. Usa **parola** per il grassetto.",
          }}
        />
        <p className="text-[11px] text-dark mt-1" style={{ opacity: 0.6 }}>
          Tempo de leitura é calculado automaticamente (200 palavras/min).
        </p>
      </div>

      {/* Publicação */}
      <div
        className="flex items-center gap-3 pt-4 border-t"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isPublished"
            defaultChecked={post?.isPublished ?? false}
            className="w-4 h-4 accent-amber-500"
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--bg-dark)" }}
          >
            Publicar agora
          </span>
        </label>
        <span className="text-xs text-dark" style={{ opacity: 0.6 }}>
          Se desmarcado, salva como rascunho (não aparece no site).
        </span>
      </div>

      {/* Ações */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href={cancelHref}
          className="rounded border px-4 py-2 text-sm hover:bg-page-2"
          style={{ borderColor: "var(--border-soft)" }}
        >
          Cancelar
        </Link>
        <button
          type="submit"
          className="rounded btn-dark px-4 py-2 text-sm font-medium"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
