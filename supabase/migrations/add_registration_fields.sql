-- ============================================
-- ADD REGISTRATION COMPLETION FIELDS TO PROFILES
-- ============================================
--
-- Adds username, registration_completed, and phone columns to public.profiles
-- to support the post-payment onboarding / complete-registration flow.
--
-- username: unique handle generated on first registration completion
-- registration_completed: flag set to true once user sets a password and
--   completes the post-payment onboarding step
-- phone: user phone number (nullable) collected during onboarding
--
-- CREATED: 2026-03-04
-- AUTHOR: iiskills-cloud team
-- ============================================

-- Add phone column (nullable – collected during onboarding or payment flow)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text;

-- Add username column (unique, generated on first registration completion)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text;

-- Unique constraint on username (allows NULL for unregistered users)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_idx
  ON public.profiles(username)
  WHERE username IS NOT NULL;

-- Add registration_completed column (false until user completes post-payment onboarding)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS registration_completed boolean NOT NULL DEFAULT false;

-- Index for fast lookup of unregistered paid users
CREATE INDEX IF NOT EXISTS profiles_registration_completed_idx
  ON public.profiles(registration_completed)
  WHERE registration_completed = false;

-- ============================================
-- Helper function: generate a unique username
-- called by the complete-registration API
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_unique_username(p_base text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_candidate text;
  v_attempts  int := 0;
  v_base      text;
BEGIN
  -- Sanitise: keep only letters, lowercase, truncate to 10 chars
  v_base := LOWER(REGEXP_REPLACE(p_base, '[^a-zA-Z]', '', 'g'));
  IF LENGTH(v_base) = 0 THEN
    v_base := 'user';
  END IF;
  v_base := LEFT(v_base, 10);

  LOOP
    v_attempts := v_attempts + 1;
    -- Append 4 random digits
    v_candidate := v_base || LPAD(FLOOR(RANDOM() * 9000 + 1000)::int::text, 4, '0');

    -- Check uniqueness
    IF NOT EXISTS (
      SELECT 1 FROM public.profiles WHERE username = v_candidate
    ) THEN
      RETURN v_candidate;
    END IF;

    -- Safety valve: try up to 20 times, then append timestamp fragment
    IF v_attempts >= 20 THEN
      RETURN v_base || EXTRACT(EPOCH FROM NOW())::bigint % 100000;
    END IF;
  END LOOP;
END;
$$;

COMMENT ON FUNCTION public.generate_unique_username IS
  'Generates a unique username by appending 4 random digits to a sanitised name base. Retries up to 20 times on collision.';
