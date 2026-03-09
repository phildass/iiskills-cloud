-- ============================================
-- ENTITLEMENTS TABLE ENHANCEMENTS
-- ============================================
--
-- Adds columns and constraints needed by /api/payments/confirm:
--
-- 1. course_slug (TEXT) — confirm.js stores the resolved course/app slug here.
--    Separate from app_id so the entitlement check in /api/entitlement.js
--    can continue using app_id while the payment flow uses course_slug.
--
-- 2. purchase_id (UUID) — links the entitlement back to the purchases row.
--
-- 3. Unique constraint on (user_id, course_slug) WHERE course_slug IS NOT NULL
--    — prevents duplicate entitlements for the same user+course (idempotency).
--
-- CREATED: 2026-03-09
-- AUTHOR: iiskills-cloud team
-- ============================================

-- ── 1. Add course_slug column (nullable — existing rows keep NULL) ─────────────
ALTER TABLE public.entitlements
  ADD COLUMN IF NOT EXISTS course_slug TEXT;

COMMENT ON COLUMN public.entitlements.course_slug IS
  'Resolved course/app slug stored by /api/payments/confirm (e.g. learn-ai). Distinct from app_id which is used by legacy admin-grant flow.';

-- ── 2. Add purchase_id column (nullable FK to public.purchases) ───────────────
ALTER TABLE public.entitlements
  ADD COLUMN IF NOT EXISTS purchase_id UUID;

COMMENT ON COLUMN public.entitlements.purchase_id IS
  'UUID of the corresponding public.purchases row. NULL for admin-granted entitlements.';

-- Index for purchase_id lookups
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase_id
  ON public.entitlements(purchase_id)
  WHERE purchase_id IS NOT NULL;

-- ── 3. Unique constraint on (user_id, course_slug) ────────────────────────────
-- Prevents duplicate entitlement grants for the same user+course.
-- Only applies where course_slug IS NOT NULL (Razorpay-sourced entitlements).
CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_user_course_slug_unique
  ON public.entitlements(user_id, course_slug)
  WHERE course_slug IS NOT NULL;
