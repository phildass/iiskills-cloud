-- ============================================
-- ADD E.164 CONSTRAINT AND INDEXES FOR profiles.phone
-- ============================================
--
-- SAFE migration: works whether or not profiles.phone already exists.
--
-- Steps:
--   1. Add phone column if missing (must run first so later steps succeed)
--   2. Validate + add E.164 CHECK constraint (allow NULL)
--   3. Add UNIQUE partial index (only non-NULL values must be unique)
--   4. Add lookup index for fast phone-based queries
--
-- E.164 format: starts with +, country code 1-9, then 6-14 more digits.
-- Example valid values: +919876543210, +12025551234
-- NULL is explicitly allowed (phone is optional on profile creation).
--
-- CREATED: 2026-03-06
-- AUTHOR: iiskills-cloud team
-- ============================================

-- Step 1: Add phone column (nullable – collected during onboarding or payment flow)
-- IF NOT EXISTS ensures this is idempotent even if add_registration_fields already ran.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text;

-- Step 2: Add E.164 CHECK constraint (allow NULL)
-- Drop first so re-running the migration is idempotent.
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_phone_e164_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_phone_e164_check
    CHECK (phone IS NULL OR phone ~ '^\+[1-9][0-9]{6,14}$');

-- Step 3: Unique index on phone for non-NULL values
-- Prevents two profiles sharing the same phone number.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx
  ON public.profiles(phone)
  WHERE phone IS NOT NULL;

-- Step 4: Regular index for fast phone-based lookups (admin search, auth flows)
CREATE INDEX IF NOT EXISTS profiles_phone_idx
  ON public.profiles(phone);
