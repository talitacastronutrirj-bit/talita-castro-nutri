import { neon } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL não está definida. Configure em .env.local (dev) ou nas env vars do Netlify (prod)."
    );
  }
  return url;
}

let _sql: ReturnType<typeof neon> | null = null;

function ensureSql(): ReturnType<typeof neon> {
  if (!_sql) {
    _sql = neon(getDatabaseUrl());
  }
  return _sql;
}

/**
 * Tagged template literal pra queries Neon.
 * Lazy: só conecta quando a primeira query roda. Permite build estático
 * passar mesmo sem DATABASE_URL definida (ex: build inicial do Netlify
 * antes da env var ser configurada).
 */
export const sql: ReturnType<typeof neon> = ((
  strings: TemplateStringsArray,
  ...values: unknown[]
) => {
  return ensureSql()(strings, ...values);
}) as unknown as ReturnType<typeof neon>;
