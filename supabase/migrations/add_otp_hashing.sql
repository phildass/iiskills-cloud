-- ============================================
-- OTP HASHING MIGRATION
-- ============================================
--
-- Adds otp_hash column for secure OTP storage using HMAC-SHA256.
-- Transitions away from storing plain OTP values.
--
-- CREATED: 2026-02-28
-- PURPOSE: Implement OTP hashing (never store plain OTP in DB)
--
-- CHANGES:
-- 1. Add otp_hash column (nullable for safe transition from plain otp)
-- 2. Make otp column nullable (safe transition - column will be dropped later)
-- 3. Drop unique constraint that included plain otp column
-- 4. Add composite indexes for efficient lookups
-- ============================================

-- Add otp_hash column (nullable for safe transition)
ALTER TABLE public.otps
  ADD COLUMN IF NOT EXISTS otp_hash TEXT;

-- Make otp column nullable for safe transition (was NOT NULL)
ALTER TABLE public.otps
  ALTER COLUMN otp DROP NOT NULL;

-- Drop the unique constraint that references the plain otp column
ALTER TABLE public.otps
  DROP CONSTRAINT IF EXISTS unique_active_otp_per_user_app;

-- Add composite indexes for efficient OTP lookups
CREATE INDEX IF NOT EXISTS idx_otps_email_app_created
  ON public.otps(email, app_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_otps_phone_app_created
  ON public.otps(phone, app_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_otps_payment_transaction_id
  ON public.otps(payment_transaction_id);

-- Comments
COMMENT ON COLUMN public.otps.otp_hash IS 'HMAC-SHA256 hash of the OTP. Plain OTP is never stored. Computed via hashOtp() in lib/otpService.js.';
COMMENT ON COLUMN public.otps.otp IS '[DEPRECATED] Plain OTP value. Transitioning to otp_hash. Will be dropped in a future migration once all rows use otp_hash.';
