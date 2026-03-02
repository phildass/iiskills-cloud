-- ============================================
-- OTP TABLE: MAKE EMAIL NULLABLE + ADD LEAD_NAME
-- ============================================
--
-- This migration:
-- 1. Makes otps.email nullable to support phone-only admin OTP generation
-- 2. Adds a nullable lead_name column for auditability of admin-generated OTPs
--
-- CREATED: 2026-03-02
-- PURPOSE: Allow admin to generate OTPs using only Name + Phone (email optional)
-- ============================================

-- Make email nullable (phone-only OTPs don't require an email address)
ALTER TABLE public.otps ALTER COLUMN email DROP NOT NULL;

-- Add lead_name for auditability of admin-generated OTPs
ALTER TABLE public.otps ADD COLUMN IF NOT EXISTS lead_name TEXT;

COMMENT ON COLUMN public.otps.email IS 'User email address. Nullable for phone-only admin-generated OTPs.';
COMMENT ON COLUMN public.otps.lead_name IS 'Full name of the lead/recipient, stored for admin-generated OTPs only.';
