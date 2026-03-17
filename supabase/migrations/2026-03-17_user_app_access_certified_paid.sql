-- ============================================
-- MIGRATION: Add certified paid user fields to user_app_access
-- ============================================
--
-- Adds two new columns to user_app_access to track certified paid status:
--   is_certified_paid_user  — true when the user has paid for this app
--   entitlement_type        — describes the type of access (e.g. 'annual_paid')
--
-- When a user pays for an app or bundle, grantAppAccess sets:
--   is_active               = true
--   is_certified_paid_user  = true
--   entitlement_type        = 'annual_paid'
--   expires_at              = one year from payment date
--
-- CREATED: 2026-03-17
-- ============================================

-- Add is_certified_paid_user column (boolean, default false)
ALTER TABLE public.user_app_access
  ADD COLUMN IF NOT EXISTS is_certified_paid_user BOOLEAN NOT NULL DEFAULT false;

-- Add entitlement_type column (varchar, nullable)
ALTER TABLE public.user_app_access
  ADD COLUMN IF NOT EXISTS entitlement_type VARCHAR(50) DEFAULT NULL;

-- Add index for fast lookup of certified paid users per app
CREATE INDEX IF NOT EXISTS idx_user_app_access_certified
  ON public.user_app_access(user_id, app_id, is_certified_paid_user)
  WHERE is_certified_paid_user = true AND is_active = true;

-- Helpful comments
COMMENT ON COLUMN public.user_app_access.is_certified_paid_user
  IS 'True when the user is a certified paid user for this app (paid via payment or bundle).';

COMMENT ON COLUMN public.user_app_access.entitlement_type
  IS 'Type of entitlement: annual_paid (paid access for 1 year), or NULL for non-payment grants (admin, free, otp).';

-- Backfill: mark existing payment/bundle records as certified paid users
-- Only update records where granted_via is payment or bundle and there is a payment_id
UPDATE public.user_app_access
SET
  is_certified_paid_user = true,
  entitlement_type = 'annual_paid'
WHERE
  granted_via IN ('payment', 'bundle')
  AND payment_id IS NOT NULL
  AND is_certified_paid_user = false;
