/**
 * Migration runner simples — lê arquivos SQL de ./migrations/ em ordem e executa.
 *
 * Uso:
 *   npx tsx scripts/migrate.ts
 *
 * Como ele guarda o estado: tabela `_migrations` com os arquivos já aplicados.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const MIGRATIONS_DIR = join(process.cwd(), "migrations");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("❌ DATABASE_URL não definida. Configure em .env.local.");
    process.exit(1);
  }

  const sql = neon(url);

  // Garante a tabela de controle
  await sql`
    CREATE TABLE IF NOT EXISTS _migrations (
      filename   VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  const applied = await sql`SELECT filename FROM _migrations`;
  const appliedSet = new Set(applied.map((r) => r.filename as string));

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let appliedCount = 0;

  for (const file of files) {
    if (appliedSet.has(file)) {
      console.log(`✓ ${file} (já aplicada)`);
      continue;
    }

    const sqlContent = readFileSync(join(MIGRATIONS_DIR, file), "utf8");
    console.log(`→ Aplicando ${file}...`);

    try {
      // Neon HTTP só aceita uma statement por requisição.
      // Split em `;` no final de linha (heurística simples mas suficiente pro nosso SQL).
      const rawStatements = sqlContent.split(/;\s*$/m);

      const statements = rawStatements
        .map((s) => s.trim())
        .filter((s) => {
          if (s.length === 0) return false;
          // Mantém statements que tenham QUALQUER conteúdo não-comentário.
          // (Não basta startsWith("--") — INSERTs precedidos de comentário não podem ser descartados.)
          const withoutComments = s
            .split("\n")
            .filter((line) => {
              const trimmed = line.trim();
              return trimmed.length > 0 && !trimmed.startsWith("--");
            })
            .join("\n");
          return withoutComments.length > 0;
        });

      for (const statement of statements) {
        await sql.query(statement);
      }

      await sql`INSERT INTO _migrations (filename) VALUES (${file})`;
      console.log(`✅ ${file} aplicada`);
      appliedCount++;
    } catch (err) {
      console.error(`❌ Falha em ${file}:`, err);
      process.exit(1);
    }
  }

  if (appliedCount === 0) {
    console.log("Nada novo pra aplicar.");
  } else {
    console.log(`\n${appliedCount} migration(s) aplicada(s).`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
