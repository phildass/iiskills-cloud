-- ============================================================
-- DATABASE OVERHAUL: BROWSEABILITY + QUIZ GATING
-- ============================================================
-- Changes:
--   1. courses: add is_published (generated from status), replace
--      global unique(slug) with unique(subdomain, slug)
--   2. modules: add composite index (course_id, level, order_index),
--      set level DEFAULT 'basic'
--   3. certificate_eligibility: add skipped_to_level column
--   4. Backfill: create default 'basic' module per course with no modules
--   5. lesson_quiz_attempts: lower pass threshold from 4 to 3 (≥60%)
--
-- CREATED: 2026-02-22
-- ============================================================

-- ============================================================
-- 1. COURSES: is_published + (subdomain, slug) uniqueness
-- ============================================================

-- Add is_published as a stored generated boolean derived from status
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN
    GENERATED ALWAYS AS (status = 'published') STORED;

CREATE INDEX IF NOT EXISTS idx_courses_is_published ON public.courses(is_published);

COMMENT ON COLUMN public.courses.is_published
  IS 'Derived boolean: true when status = ''published''. Use for published-only queries.';

-- Replace global unique on slug with per-subdomain uniqueness.
-- The original constraint is named courses_slug_key (created by UNIQUE NOT NULL in courses_and_newsletter.sql).
ALTER TABLE public.courses DROP CONSTRAINT IF EXISTS courses_slug_key;

ALTER TABLE public.courses
  ADD CONSTRAINT courses_subdomain_slug_unique UNIQUE (subdomain, slug);

COMMENT ON CONSTRAINT courses_subdomain_slug_unique ON public.courses
  IS 'Slug must be unique within each subdomain, enabling stable per-app URLs.';

-- ============================================================
-- 2. MODULES: composite index + level default
-- ============================================================

-- Composite index supports "fetch all modules for a course ordered by level then position"
CREATE INDEX IF NOT EXISTS idx_modules_course_level_order
  ON public.modules(course_id, level, order_index);

-- Default new modules to 'basic' so level is never inadvertently null
ALTER TABLE public.modules
  ALTER COLUMN level SET DEFAULT 'basic';

-- ============================================================
-- 3. CERTIFICATE_ELIGIBILITY: add skipped_to_level
-- ============================================================

ALTER TABLE public.certificate_eligibility
  ADD COLUMN IF NOT EXISTS skipped_to_level TEXT
    CHECK (skipped_to_level IN ('intermediate', 'advanced'));

COMMENT ON COLUMN public.certificate_eligibility.skipped_to_level
  IS 'The level the user skipped to, causing cert ineligibility (intermediate or advanced).';

-- ============================================================
-- 4. BACKFILL: default 'basic' module per course
-- ============================================================
-- For any course that currently has no modules, insert a placeholder
-- 'basic' module so lessons can be attached without orphaning them.

INSERT INTO public.modules (course_id, title, slug, level, order_index, is_published)
SELECT
  c.id,
  c.title,
  'basic',
  'basic',
  0,
  true
FROM public.courses c
WHERE NOT EXISTS (
  SELECT 1 FROM public.modules m WHERE m.course_id = c.id
)
ON CONFLICT (course_id, slug) DO NOTHING;

-- ============================================================
-- 5. LESSON_QUIZ_ATTEMPTS: lower pass threshold to 3/5 (≥60%)
-- ============================================================
-- The generated column `passed` was previously score >= 4 (80%).
-- The new requirement is score >= 3 (60%).
-- Generated columns must be dropped and re-added to change the expression.

ALTER TABLE public.lesson_quiz_attempts DROP COLUMN IF EXISTS passed;

ALTER TABLE public.lesson_quiz_attempts
  ADD COLUMN passed BOOLEAN GENERATED ALWAYS AS (score >= 3) STORED;

COMMENT ON COLUMN public.lesson_quiz_attempts.passed
  IS 'True when score >= 3 out of 5 (≥60% pass threshold).';

-- ============================================================
-- SUCCESS
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE '=========================================';
  RAISE NOTICE 'DB OVERHAUL MIGRATION COMPLETE';
  RAISE NOTICE '=========================================';
  RAISE NOTICE '  courses.is_published added (generated)';
  RAISE NOTICE '  courses: UNIQUE(subdomain, slug) enforced';
  RAISE NOTICE '  modules: composite index + level default';
  RAISE NOTICE '  certificate_eligibility.skipped_to_level added';
  RAISE NOTICE '  courses with no modules backfilled';
  RAISE NOTICE '  lesson_quiz_attempts.passed threshold -> 3/5';
  RAISE NOTICE '=========================================';
END $$;
