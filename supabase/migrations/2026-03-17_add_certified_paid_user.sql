-- ============================================
-- ADD CERTIFIED PAID USER FIELDS MIGRATION
-- ============================================
--
-- Adds annual access entitlement tracking to user_app_access:
--   - is_certified_paid_user: marks records created via real payment
--   - entitlement_type: describes how access was granted (e.g. 'annual_paid')
--
-- CREATED: 2026-03-17
-- PURPOSE: Support annual paid entitlement display on user dashboard
-- ============================================

ALTER TABLE public.user_app_access
  ADD COLUMN IF NOT EXISTS is_certified_paid_user BOOLEAN DEFAULT false NOT NULL,
  ADD COLUMN IF NOT EXISTS entitlement_type VARCHAR(50);

-- Add index for efficient dashboard queries filtering on certified paid users
CREATE INDEX IF NOT EXISTS idx_user_app_access_certified_paid
  ON public.user_app_access(user_id, is_certified_paid_user)
  WHERE is_certified_paid_user = true AND is_active = true;

COMMENT ON COLUMN public.user_app_access.is_certified_paid_user IS
  'True when access was granted via a real payment (annual_paid). Used by dashboard to show Paid badge.';
COMMENT ON COLUMN public.user_app_access.entitlement_type IS
  'Type of entitlement, e.g. ''annual_paid''. NULL for admin/free grants.';
