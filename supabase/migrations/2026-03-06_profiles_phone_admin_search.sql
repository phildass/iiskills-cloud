-- ============================================
-- PROFILES PHONE: E.164 CONSTRAINT + INDEXES
-- ============================================
--
-- Enforces E.164 phone format (or NULL) on profiles.phone,
-- adds a UNIQUE partial index and a lookup index.
--
-- E.164 format: starts with +, followed by 7–15 digits
-- e.g. +919876543210, +12025551234
--
-- CREATED: 2026-03-06
-- AUTHOR: iiskills-cloud team
-- ============================================

-- Add CHECK constraint: phone must match E.164 format, or be NULL
-- Drop first to make this migration idempotent
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_phone_e164_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_phone_e164_check
  CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{6,14}$');

-- UNIQUE partial index: ensures no two non-NULL phones are the same
-- Also serves as the primary fast-lookup index
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx
  ON public.profiles(phone)
  WHERE phone IS NOT NULL;

-- Plain index for fast lookups (e.g. WHERE phone = '...'), satisfying any
-- planner path that doesn't use the partial unique index
CREATE INDEX IF NOT EXISTS profiles_phone_idx
  ON public.profiles(phone)
  WHERE phone IS NOT NULL;

COMMENT ON CONSTRAINT profiles_phone_e164_check ON public.profiles IS
  'Phone must be NULL or a valid E.164 number: + followed by 7–15 digits (e.g. +919876543210).';
