-- ============================================
-- ADD PAID USER FIELDS TO PROFILES
-- ============================================
--
-- Adds is_paid_user and paid_at columns to public.profiles
-- to track payment status directly on the profile record.
--
-- is_paid_user: denormalized flag set when any active entitlement exists
-- paid_at: timestamp of when the user first became a paid user
--
-- CREATED: 2026-03-01
-- AUTHOR: iiskills-cloud team
-- ============================================

-- Add is_paid_user column (defaults to false for existing rows)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_paid_user boolean NOT NULL DEFAULT false;

-- Add paid_at column (null = never paid)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

-- Index for efficient paid-user lookups
CREATE INDEX IF NOT EXISTS profiles_is_paid_user_idx
  ON public.profiles(is_paid_user)
  WHERE is_paid_user = true;

-- ============================================
-- Linking function: called after OTP verification or entitlement grant
-- Finds purchases (payments table) by email and sets is_paid_user=true
-- ============================================
CREATE OR REPLACE FUNCTION public.link_paid_status_by_email(p_user_id uuid, p_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the user already has an active entitlement
  IF EXISTS (
    SELECT 1 FROM public.entitlements
    WHERE user_id = p_user_id
      AND status = 'active'
      AND (expires_at IS NULL OR expires_at > NOW())
  ) THEN
    UPDATE public.profiles
    SET
      is_paid_user = true,
      paid_at = COALESCE(paid_at, NOW())
    WHERE id = p_user_id;
    RETURN;
  END IF;

  -- Fallback: check payments table by email
  IF EXISTS (
    SELECT 1 FROM public.payments
    WHERE LOWER(user_email) = LOWER(p_email)
      AND status = 'captured'
  ) THEN
    UPDATE public.profiles
    SET
      is_paid_user = true,
      paid_at = COALESCE(paid_at, NOW())
    WHERE id = p_user_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.link_paid_status_by_email IS
  'Sets profiles.is_paid_user=true for a user who has an active entitlement or a captured payment matching their email. Idempotent.';
