-- ============================================================
-- MIGRATION: content_stats table
-- ============================================================
-- Stores the canonical platform content counts that drive the
-- admin dashboard.  Populated by scripts/sync-content-stats.js.
--
-- Architecture: 8 sites × 3 courses × 10 modules × 10 lessons
--   = 24 courses, 240 modules, 2,400 lessons
--
-- CREATED: 2026-03-18
-- ============================================================

CREATE TABLE IF NOT EXISTS public.content_stats (
  id                TEXT        PRIMARY KEY,          -- e.g. 'global_production_stats'
  total_sites       INTEGER     NOT NULL DEFAULT 8,
  total_courses     INTEGER     NOT NULL DEFAULT 24,
  total_modules     INTEGER     NOT NULL DEFAULT 240,
  total_lessons     INTEGER     NOT NULL DEFAULT 2400,
  courses_per_site  INTEGER     NOT NULL DEFAULT 3,
  modules_per_course INTEGER    NOT NULL DEFAULT 10,
  lessons_per_module INTEGER    NOT NULL DEFAULT 10,
  last_verified     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed the single production stats row immediately
INSERT INTO public.content_stats (
  id, total_sites, total_courses, total_modules, total_lessons,
  courses_per_site, modules_per_course, lessons_per_module, last_verified
) VALUES (
  'global_production_stats', 8, 24, 240, 2400, 3, 10, 10, now()
) ON CONFLICT (id) DO UPDATE SET
  total_sites        = EXCLUDED.total_sites,
  total_courses      = EXCLUDED.total_courses,
  total_modules      = EXCLUDED.total_modules,
  total_lessons      = EXCLUDED.total_lessons,
  courses_per_site   = EXCLUDED.courses_per_site,
  modules_per_course = EXCLUDED.modules_per_course,
  lessons_per_module = EXCLUDED.lessons_per_module,
  last_verified      = EXCLUDED.last_verified,
  updated_at         = now();

-- RLS: admin-only read; script writes via service-role (bypasses RLS)
ALTER TABLE public.content_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read content_stats"
  ON public.content_stats FOR SELECT
  TO service_role
  USING (true);

GRANT SELECT ON public.content_stats TO service_role;

COMMENT ON TABLE public.content_stats IS
  'Canonical platform content counts (8×3×10×10). '
  'Populated by scripts/sync-content-stats.js via the service role.';
