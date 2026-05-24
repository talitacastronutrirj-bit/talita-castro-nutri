-- =====================================================================
-- Migration 003 — FAQ (perguntas frequentes editáveis pelo admin)
-- =====================================================================
--
-- Cada item tem pergunta e resposta multi-idioma (JSONB).
-- Cliente cadastra/edita pelo /admin/faq.

CREATE TABLE IF NOT EXISTS faq_items (
  id            SERIAL PRIMARY KEY,
  question      JSONB NOT NULL DEFAULT '{}'::jsonb,
  answer        JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS faq_items_active_order_idx
  ON faq_items (is_active, display_order);
