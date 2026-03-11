-- ============================================================
-- My Dashboard — Course Progress Summary
--
-- Adds a composite index to user_lesson_progress to efficiently
-- compute the "last active lesson" per (user_id, app_id) —
-- the query used by GET /api/dashboard for lastLessonByApp.
--
-- No destructive changes. All existing data is preserved.
-- ============================================================

-- ── Efficient "last lesson per user+app" lookup ───────────────────────────────
-- Used by /api/dashboard to build lastLessonByApp without a full scan.
CREATE INDEX IF NOT EXISTS user_lesson_progress_user_app_last_seen_idx
  ON public.user_lesson_progress (user_id, app_id, last_seen_at DESC NULLS LAST);

-- ── Ensure lesson_id and module_id columns exist ─────────────────────────────
-- These were created in 2026-03-11_user_progress_badges_certificates.sql but
-- guard against schema drift.
ALTER TABLE public.user_lesson_progress
  ADD COLUMN IF NOT EXISTS last_seen_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS module_id     TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS lesson_id     TEXT NOT NULL DEFAULT '';
