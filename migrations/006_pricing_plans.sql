-- =====================================================================
-- Migration 006 — Pricing plans / Pacotes
-- =====================================================================
--
-- Pacotes de serviço com preço e moeda. Multi-idioma em nome, descrição,
-- features e CTA. Preço é numérico (não-localizado, mas formatado por
-- locale via Intl.NumberFormat). Currency é ISO-4217 (BRL/USD/EUR/etc).
--
-- Features ficam como TEXT JSONB com linhas separadas por \n — cada
-- linha vira um bullet na UI. Mais simples que array de objetos.

CREATE TABLE IF NOT EXISTS pricing_plans (
  id            SERIAL PRIMARY KEY,
  name          JSONB NOT NULL DEFAULT '{}'::jsonb,
  description   JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Preço como numeric pra suportar valores decimais (ex 199.90)
  price         NUMERIC(10, 2) NOT NULL DEFAULT 0,
  -- ISO-4217: BRL, USD, EUR, etc
  currency      VARCHAR(3) NOT NULL DEFAULT 'BRL',
  -- Sufixo curto: " / mês", " / consulta", " (à vista)" — multi-idioma
  price_suffix  JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Lista de features (uma por linha) — multi-idioma como string
  features      JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Texto do botão CTA — multi-idioma
  cta_text      JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- Link do botão: pode ser WhatsApp (wa.me), Calendly, mailto, etc
  cta_link      TEXT,
  -- Destaque visual (border dourada + escala maior)
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pricing_plans_active_order_idx
  ON pricing_plans (is_active, display_order);
