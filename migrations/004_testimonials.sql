-- =====================================================================
-- Migration 004 — Depoimentos / Testimonials
-- =====================================================================
--
-- Depoimentos de pacientes/clientes pra exibir como prova social.
-- Quote é multi-idioma (paciente pode ter dito em PT, mas tradução
-- pra EN/IT pode ser feita pelo profissional pra atingir público
-- internacional).

CREATE TABLE IF NOT EXISTS testimonials (
  id            SERIAL PRIMARY KEY,
  author_name   VARCHAR(128) NOT NULL,
  -- Cargo/relação opcional ("Paciente desde 2022", "Cliente corporativo")
  author_role   VARCHAR(128),
  photo_url     TEXT,
  -- Texto do depoimento em múltiplos idiomas
  quote         JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Avaliação opcional 1-5 estrelas (NULL = não exibir)
  rating        SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS testimonials_active_order_idx
  ON testimonials (is_active, display_order);
