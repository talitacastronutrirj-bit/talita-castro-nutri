-- =====================================================================
-- Migration 007 — How It Works (etapas do atendimento)
-- =====================================================================
--
-- Cards explicando como funciona o atendimento — útil pra
-- profissionais que atendem 100% online ou internacionalmente.
-- Cada card tem: ícone (key string), título + descrição multi-idioma.
-- Recomendado 3-5 etapas.

CREATE TABLE IF NOT EXISTS how_it_works_steps (
  id            SERIAL PRIMARY KEY,
  icon_key      VARCHAR(50) NOT NULL DEFAULT 'calendar',
  title         JSONB NOT NULL DEFAULT '{}'::jsonb,
  description   JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS how_it_works_steps_active_order_idx
  ON how_it_works_steps (is_active, display_order);
