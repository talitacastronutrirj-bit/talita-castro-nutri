-- =====================================================================
-- Migration 001 — Schema inicial (multi-idioma desde o começo)
-- =====================================================================
--
-- Estrutura projetada pra templates reusáveis. Campos de texto editáveis
-- pelo cliente são JSONB no formato {"pt": "...", "en": "...", "it": "..."}
-- pra suportar múltiplos idiomas sem mexer no schema depois.
--
-- Campos que NÃO são editáveis pelo cliente (slugs, URLs, dates) seguem
-- como tipos nativos.

-- ─── settings ────────────────────────────────────────────────
-- Chave-valor. Algumas chaves são scalars (palette, hero_mode), outras
-- são JSON serializado contendo LocalizedText ({pt, en, it}).
-- O helper lib/settings.ts cuida de parsear de acordo.
CREATE TABLE IF NOT EXISTS settings (
  key        VARCHAR(64) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── team_members ────────────────────────────────────────────
-- Bio e details viram JSONB por causa de i18n.
-- Nome e role ficam VARCHAR porque normalmente são idênticos em todos
-- os idiomas (nome próprio + cargo curto). Se um cliente quiser
-- traduzir, pode usar { "pt": "Sócia Fundadora", "en": "Founding Partner" }
-- — por isso role também é flexível como VARCHAR + parsing JSON opcional.
CREATE TABLE IF NOT EXISTS team_members (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  role            VARCHAR(255) NOT NULL,
  credentials     TEXT[],
  photo_url       TEXT,
  initials        VARCHAR(4),
  bio             JSONB NOT NULL DEFAULT '{}'::jsonb,
  details         JSONB NOT NULL DEFAULT '{}'::jsonb,
  display_order   INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS team_members_active_order_idx
  ON team_members (is_active, display_order);

-- ─── posts (blog) ────────────────────────────────────────────
-- Cada post tem versão por idioma (title, excerpt, content como JSONB).
-- Slug é único e compartilhado entre idiomas (URLs ficam /[locale]/artigos/[slug]).
-- O conteúdo render usa pickLocale() pra mostrar no idioma atual.
CREATE TABLE IF NOT EXISTS posts (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  title         JSONB NOT NULL DEFAULT '{}'::jsonb,
  excerpt       JSONB NOT NULL DEFAULT '{}'::jsonb,
  content       JSONB NOT NULL DEFAULT '{}'::jsonb,
  category      VARCHAR(128),
  cover_url     TEXT,
  author        VARCHAR(128),
  reading_time  VARCHAR(32),
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS posts_published_idx
  ON posts (is_published, published_at DESC);

-- =====================================================================
-- Seed inicial (apenas settings não-localizados)
-- =====================================================================

-- Defaults da paleta e hero. Strings simples (não-localizadas).
INSERT INTO settings (key, value) VALUES
  ('palette',             'navy'),
  ('hero_mode',           'logo'),
  ('hero_image_url',      ''),
  ('hero_logo_entrance',  'slide'),
  ('hero_logo_idle',      'none')
ON CONFLICT (key) DO NOTHING;

-- Settings localizados (JSON serializado). Vazios — cliente preenche
-- no /admin/aparencia. O parser em lib/settings.ts entende "{}" como
-- objeto vazio e cai pros defaults do código.
INSERT INTO settings (key, value) VALUES
  ('hero_eyebrow',     '{}'),
  ('hero_heading',     '{}'),
  ('hero_description', '{}'),
  ('trust_bar_1_label', '{}'),
  ('trust_bar_1_value', '{}'),
  ('trust_bar_2_label', '{}'),
  ('trust_bar_2_value', '{}'),
  ('trust_bar_3_label', '{}'),
  ('trust_bar_3_value', '{}'),
  ('trust_bar_4_label', '{}'),
  ('trust_bar_4_value', '{}')
ON CONFLICT (key) DO NOTHING;

-- Settings não-localizados (URLs de redes sociais)
INSERT INTO settings (key, value) VALUES
  ('instagram_url', ''),
  ('facebook_url',  ''),
  ('linkedin_url',  '')
ON CONFLICT (key) DO NOTHING;
