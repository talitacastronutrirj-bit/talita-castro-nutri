-- =====================================================================
-- Migration 002 — Practice areas / Services / Specialties
-- =====================================================================
--
-- CRUD de "áreas de atuação" / "serviços" / "especialidades" (cliente
-- escolhe a label da seção via setting). Multi-idioma desde o começo:
-- title e body são JSONB {pt, en, it}.

CREATE TABLE IF NOT EXISTS practice_areas (
  id            SERIAL PRIMARY KEY,
  title         JSONB NOT NULL DEFAULT '{}'::jsonb,
  body          JSONB NOT NULL DEFAULT '{}'::jsonb,
  icon          VARCHAR(64) NOT NULL DEFAULT 'document',
  highlighted   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS practice_areas_active_order_idx
  ON practice_areas (is_active, display_order);

-- Sem seed: cliente cadastra suas próprias áreas pelo admin.
