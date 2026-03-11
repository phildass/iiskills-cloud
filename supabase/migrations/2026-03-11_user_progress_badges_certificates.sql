-- ============================================================
-- User Progress, Badges, Certificates and Dashboard Profile Fields
-- ============================================================
-- Adds:
--   1. Extra columns to public.profiles for dashboard and field-locking rules
--   2. user_lesson_progress  – tracks lesson start/completion/score per user
--   3. user_badges           – idempotent badge awards (pass a quiz → earn a badge)
--   4. user_certificates     – certificate metadata for paid courses
-- ============================================================

-- ── 1. Extra profile columns ─────────────────────────────────────────────────

ALTER TABLE public.profiles
  -- When the user first submitted their profile (locks most fields)
  ADD COLUMN IF NOT EXISTS profile_submitted_at  TIMESTAMPTZ,
  -- How many times the user has changed their name (max 1 after first submission)
  ADD COLUMN IF NOT EXISTS name_change_count     INTEGER NOT NULL DEFAULT 0,
  -- Education fields (unlocked – can be changed at any time)
  ADD COLUMN IF NOT EXISTS education_self        TEXT,
  ADD COLUMN IF NOT EXISTS education_father      TEXT,
  ADD COLUMN IF NOT EXISTS education_mother      TEXT;

-- Ensure columns expected by the dashboard query exist (guard against schema drift)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone           TEXT,
  ADD COLUMN IF NOT EXISTS username        TEXT,
  ADD COLUMN IF NOT EXISTS is_paid_user    BOOLEAN,
  ADD COLUMN IF NOT EXISTS paid_at         TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_completed BOOLEAN;

-- ── 2. user_lesson_progress ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_lesson_progress (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id        TEXT NOT NULL,
  module_id     TEXT NOT NULL,
  lesson_id     TEXT NOT NULL,
  started_at    TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  last_seen_at  TIMESTAMPTZ,
  last_score    INTEGER,
  passed        BOOLEAN NOT NULL DEFAULT false,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, app_id, module_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS user_lesson_progress_user_app_idx
  ON public.user_lesson_progress (user_id, app_id);

CREATE INDEX IF NOT EXISTS user_lesson_progress_user_idx
  ON public.user_lesson_progress (user_id);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ulp_select_own" ON public.user_lesson_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "ulp_insert_own" ON public.user_lesson_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ulp_update_own" ON public.user_lesson_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ulp_service_role_all" ON public.user_lesson_progress
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.user_lesson_progress TO authenticated;
GRANT ALL ON public.user_lesson_progress TO service_role;

-- ── 3. user_badges ───────────────────────────────────────────────────────────
-- Idempotent: UNIQUE constraint on (user_id, app_id, module_id, lesson_id)
-- so passing the same lesson quiz again does NOT create a duplicate badge.

CREATE TABLE IF NOT EXISTS public.user_badges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id      TEXT NOT NULL,
  module_id   TEXT NOT NULL,
  lesson_id   TEXT NOT NULL,
  badge_type  TEXT,               -- optional: 'lesson', 'module', 'final', etc.
  score       INTEGER,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, app_id, module_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS user_badges_user_idx
  ON public.user_badges (user_id);

CREATE INDEX IF NOT EXISTS user_badges_user_app_idx
  ON public.user_badges (user_id, app_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ub_select_own" ON public.user_badges
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "ub_insert_own" ON public.user_badges
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ub_update_own" ON public.user_badges
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "ub_service_role_all" ON public.user_badges
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT, UPDATE ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;

-- ── 4. user_certificates ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_certificates (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id          TEXT NOT NULL,
  certificate_no  TEXT UNIQUE,
  course_name     TEXT,
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  score           INTEGER,
  metadata        JSONB DEFAULT '{}'::jsonb,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_certificates_user_idx
  ON public.user_certificates (user_id);

CREATE INDEX IF NOT EXISTS user_certificates_user_app_idx
  ON public.user_certificates (user_id, app_id);

ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "uc_select_own" ON public.user_certificates
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "uc_service_role_all" ON public.user_certificates
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT ON public.user_certificates TO authenticated;
GRANT ALL ON public.user_certificates TO service_role;
