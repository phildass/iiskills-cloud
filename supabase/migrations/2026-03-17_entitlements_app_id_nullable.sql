-- ============================================
-- MIGRATION: Make entitlements.app_id nullable
-- ============================================
--
-- Background
-- ----------
-- /api/payments/confirm previously inserted entitlement rows using only
-- `course_slug`, leaving `app_id` unset.  Because `app_id` was declared
-- NOT NULL, those inserts silently failed — entitled users had no
-- entitlement row and were incorrectly shown the paywall.
--
-- Fix applied alongside this migration
-- -------------------------------------
-- • confirm.js now sets BOTH app_id and course_slug on every insert.
-- • /api/entitlement.js now queries by both columns and always falls back
--   to user_app_access (fixes users granted via grantAppAccess / admin dashboard).
--
-- This migration
-- --------------
-- 1. Drops the NOT NULL constraint on app_id so that any rows already in
--    production (inserted before the confirm.js fix) remain valid.
-- 2. Backfills app_id from course_slug for those rows.
-- 3. Adds an index on course_slug for fast lookups by the entitlement API.
--
-- CREATED: 2026-03-17
-- ============================================

-- 1. Drop NOT NULL on app_id
ALTER TABLE public.entitlements
  ALTER COLUMN app_id DROP NOT NULL;

COMMENT ON COLUMN public.entitlements.app_id IS
  'App/course ID used by admin-grant flow (e.g. learn-ai, ai-developer-bundle). '
  'NULL is allowed for Razorpay-sourced rows inserted before 2026-03-17 — use '
  'course_slug for those rows. New inserts must set both columns.';

-- 2. Backfill app_id from course_slug where app_id is NULL
UPDATE public.entitlements
  SET app_id = course_slug
  WHERE app_id IS NULL AND course_slug IS NOT NULL;

-- 3. Index on course_slug so the entitlement API OR query is efficient
CREATE INDEX IF NOT EXISTS idx_entitlements_course_slug
  ON public.entitlements(user_id, course_slug)
  WHERE course_slug IS NOT NULL;
