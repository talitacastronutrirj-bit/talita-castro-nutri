/**
 * Sanity check do banco — lista tabelas e conta linhas.
 * Uso: npx tsx scripts/check-db.ts
 */
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

async function main() {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);

  console.log("\n=== Tabelas ===");
  const tables = await sql`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  for (const t of tables) console.log(" -", t.table_name);

  console.log("\n=== settings ===");
  const settings = await sql`SELECT key, value FROM settings ORDER BY key`;
  for (const s of settings) console.log(`  ${s.key} = ${s.value}`);

  console.log("\n=== team_members ===");
  const team =
    await sql`SELECT id, name, role, oab_credentials FROM team_members ORDER BY display_order`;
  for (const m of team)
    console.log(`  [${m.id}] ${m.name} — ${m.role}${m.oab_credentials ? " · " + (m.oab_credentials as string[]).join(", ") : ""}`);

  console.log("\n=== posts ===");
  const posts =
    await sql`SELECT id, slug, title, is_published FROM posts ORDER BY published_at DESC`;
  for (const p of posts)
    console.log(`  [${p.id}] ${p.slug} — "${p.title}" (${p.is_published ? "publicado" : "rascunho"})`);

  console.log("\n=== _migrations ===");
  const migs = await sql`SELECT filename, applied_at FROM _migrations`;
  for (const m of migs)
    console.log(`  ${m.filename} aplicada em ${m.applied_at}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
