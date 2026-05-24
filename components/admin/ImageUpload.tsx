"use client";

import { useId, useRef, useState } from "react";
import { getCloudinarySignature } from "@/lib/cloudinary-actions";

type Props = {
  name: string;
  defaultValue?: string;
  context?: "team" | "blog" | "hero";
  aspectRatio?: "square" | "wide";
  label?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function ImageUpload({
  name,
  defaultValue = "",
  context = "blog",
  aspectRatio = "wide",
  label = "Selecionar imagem",
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const aspectClass = aspectRatio === "square" ? "aspect-square" : "aspect-[16/9]";

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED.includes(file.type)) {
      setError("Formato não suportado. Envie JPG, PNG, WEBP ou GIF.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Imagem maior que 5MB. Reduza antes de enviar.");
      e.target.value = "";
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      const sig = await getCloudinarySignature(context);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", sig.signature);
      formData.append("timestamp", String(sig.timestamp));
      formData.append("api_key", sig.apiKey);
      formData.append("folder", sig.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`;

      const result = await new Promise<{ secure_url: string }>(
        (resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", uploadUrl);
          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              setProgress(Math.round((ev.loaded / ev.total) * 100));
            }
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch {
                reject(new Error("Resposta inválida do Cloudinary."));
              }
            } else {
              reject(
                new Error(
                  `Cloudinary respondeu ${xhr.status}: ${xhr.responseText}`
                )
              );
            }
          };
          xhr.onerror = () => reject(new Error("Erro de rede no upload."));
          xhr.send(formData);
        }
      );

      setUrl(result.secure_url);
    } catch (err) {
      console.error("Upload failed", err);
      setError(err instanceof Error ? err.message : "Falha no upload.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleRemove() {
    setUrl("");
    setError(null);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={url} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="sr-only"
        id={inputId}
        disabled={uploading}
      />

      {!url && !uploading && (
        <label
          htmlFor={inputId}
          className={`flex flex-col items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors hover:opacity-80 ${aspectClass}`}
          style={{
            borderColor: "var(--border-soft)",
            background: "var(--bg-page-2)",
          }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            style={{ color: "var(--bg-dark)", opacity: 0.4 }}
          >
            <path
              d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--bg-dark)" }}
          >
            {label}
          </span>
          <span
            className="text-xs"
            style={{ color: "var(--text-dark)", opacity: 0.6 }}
          >
            JPG, PNG, WEBP ou GIF · até 5MB
          </span>
        </label>
      )}

      {uploading && (
        <div
          className={`rounded-xl px-4 py-6 grid place-items-center ${aspectClass}`}
          style={{
            background: "var(--bg-page-2)",
            borderColor: "var(--border-soft)",
          }}
        >
          <div className="w-full max-w-xs">
            <div className="flex items-center gap-3 mb-3 justify-center">
              <svg
                className="w-5 h-5 animate-spin text-accent"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.25"
                />
                <path
                  d="M12 2a10 10 0 0110 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="text-sm font-medium"
                style={{ color: "var(--bg-dark)" }}
              >
                Enviando... {progress}%
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: "var(--border-soft)" }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: "var(--accent)",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {url && !uploading && (
        <div className="space-y-2">
          <div
            className={`relative rounded-xl overflow-hidden border ${aspectClass}`}
            style={{
              background: "var(--bg-page-2)",
              borderColor: "var(--border-soft)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt="Pré-visualização"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <label
              htmlFor={inputId}
              className="cursor-pointer rounded border px-3 py-1.5 text-xs font-medium hover:bg-page-2"
              style={{
                borderColor: "var(--border-soft)",
                color: "var(--text-dark)",
              }}
            >
              Trocar imagem
            </label>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
            >
              Remover
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}
