-- =====================================================================
-- Migration 005 — Galeria (single image OU antes/depois)
-- =====================================================================
--
-- Cada item pode ser:
-- - Foto única (only before_image_url, after = NULL) — galeria de
--   atendimentos, fotos do consultório, eventos, etc.
-- - Antes/depois (both filled) — transformações de pacientes,
--   tipico em nutrição/estética.
--
-- A UI decide o layout pela presença ou não de after_image_url.

CREATE TABLE IF NOT EXISTS gallery_items (
  id                SERIAL PRIMARY KEY,
  before_image_url  TEXT NOT NULL,
  after_image_url   TEXT, -- NULL = imagem única (sem comparador)
  caption           JSONB NOT NULL DEFAULT '{}'::jsonb,
  category          VARCHAR(64), -- ex "Emagrecimento", "Gestante"
  display_order     INTEGER NOT NULL DEFAULT 0,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS gallery_items_active_order_idx
  ON gallery_items (is_active, display_order);
