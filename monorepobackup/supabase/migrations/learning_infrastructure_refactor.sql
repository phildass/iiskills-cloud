-- ============================================================
-- LEARNING INFRASTRUCTURE REFACTOR MIGRATION
-- ============================================================
-- Adds:
--   1. certificate_eligibility table (per user per paid app)
--   2. app_key + level columns on modules and lessons
--   3. module_final_attempts table (20-question final test tracking)
--   4. lesson_quiz_attempts table (5-question lesson quiz tracking)
--
-- CREATED: 2026-02-21
-- ============================================================

-- ============================================================
-- 1. CERTIFICATE ELIGIBILITY TABLE
-- ============================================================
-- Records whether a user is eligible for a certificate per paid app.
-- A user becomes ineligible when they skip levels.

CREATE TABLE IF NOT EXISTS public.certificate_eligibility (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_key       TEXT NOT NULL,
  is_eligible   BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, app_key)
);

CREATE INDEX IF NOT EXISTS idx_cert_eligibility_user_app ON public.certificate_eligibility(user_id, app_key);

COMMENT ON TABLE public.certificate_eligibility IS 'Tracks certificate eligibility per user per paid app. Set to false when user skips levels.';

ALTER TABLE public.certificate_eligibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own eligibility" ON public.certificate_eligibility;
DROP POLICY IF EXISTS "Users can upsert own eligibility" ON public.certificate_eligibility;
DROP POLICY IF EXISTS "Admins can view all eligibility" ON public.certificate_eligibility;

CREATE POLICY "Users can view own eligibility" ON public.certificate_eligibility
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upsert own eligibility" ON public.certificate_eligibility
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all eligibility" ON public.certificate_eligibility
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================================
-- 2. ADD app_key AND level COLUMNS TO MODULES TABLE
-- ============================================================
-- Allows filtering modules by app and level (basic|intermediate|advanced)

ALTER TABLE public.modules
  ADD COLUMN IF NOT EXISTS app_key TEXT,
  ADD COLUMN IF NOT EXISTS level  TEXT CHECK (level IN ('basic', 'intermediate', 'advanced'));

CREATE INDEX IF NOT EXISTS idx_modules_app_key ON public.modules(app_key);
CREATE INDEX IF NOT EXISTS idx_modules_level   ON public.modules(level);

COMMENT ON COLUMN public.modules.app_key IS 'App identifier this module belongs to (e.g., learn-physics)';
COMMENT ON COLUMN public.modules.level   IS 'Learning level: basic, intermediate, or advanced';

-- ============================================================
-- 3. ADD app_key AND level COLUMNS TO LESSONS TABLE
-- ============================================================
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS app_key TEXT,
  ADD COLUMN IF NOT EXISTS level  TEXT CHECK (level IN ('basic', 'intermediate', 'advanced'));

CREATE INDEX IF NOT EXISTS idx_lessons_app_key ON public.lessons(app_key);
CREATE INDEX IF NOT EXISTS idx_lessons_level   ON public.lessons(level);

-- ============================================================
-- 4. MODULE FINAL ATTEMPTS TABLE
-- ============================================================
-- Tracks attempts on the 20-question module final test.
-- Passing threshold: >= 14 out of 20.

CREATE TABLE IF NOT EXISTS public.module_final_attempts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_key      TEXT NOT NULL,
  module_id    TEXT NOT NULL,
  score        INTEGER NOT NULL CHECK (score >= 0 AND score <= 20),
  passed       BOOLEAN GENERATED ALWAYS AS (score >= 14) STORED,
  attempted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_module_final_user_module ON public.module_final_attempts(user_id, app_key, module_id);

COMMENT ON TABLE public.module_final_attempts IS '20-question module final test attempts. pass threshold = 14/20.';

ALTER TABLE public.module_final_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own final attempts" ON public.module_final_attempts;
DROP POLICY IF EXISTS "Admins view all final attempts" ON public.module_final_attempts;

CREATE POLICY "Users manage own final attempts" ON public.module_final_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins view all final attempts" ON public.module_final_attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
  );

-- ============================================================
-- 5. LESSON QUIZ ATTEMPTS TABLE
-- ============================================================
-- Tracks attempts on the 5-question lesson quiz.
-- Passing threshold: >= 4 out of 5.

CREATE TABLE IF NOT EXISTS public.lesson_quiz_attempts (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_key      TEXT NOT NULL,
  module_id    TEXT NOT NULL,
  lesson_id    TEXT NOT NULL,
  score        INTEGER NOT NULL CHECK (score >= 0 AND score <= 5),
  passed       BOOLEAN GENERATED ALWAYS AS (score >= 4) STORED,
  attempted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lesson_quiz_user_lesson ON public.lesson_quiz_attempts(user_id, app_key, lesson_id);

COMMENT ON TABLE public.lesson_quiz_attempts IS '5-question lesson quiz attempts. pass threshold = 4/5.';

ALTER TABLE public.lesson_quiz_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own quiz attempts" ON public.lesson_quiz_attempts;

CREATE POLICY "Users manage own quiz attempts" ON public.lesson_quiz_attempts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
