-- ============================================
-- APP-SPECIFIC OTP SCHEMA MIGRATION
-- ============================================
-- 
-- This migration enhances the OTP system to support app/course-specific
-- OTP dispatch after payment. OTPs are now bound to specific apps/courses
-- and cannot be reused across different apps.
--
-- CREATED: 2026-02-17
-- AUTHOR: iiskills-cloud team
-- PURPOSE: Implement secure, app-specific OTP verification after payment
--
-- CHANGES:
-- 1. Drop existing otps table if it exists (simple schema)
-- 2. Create new otps table with app/course context
-- 3. Add proper indexes for performance
-- 4. Enable Row Level Security
-- ============================================

-- Drop the old simple OTP table if it exists
DROP TABLE IF EXISTS public.otps;

-- Create enhanced OTP table with app/course context
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User identification
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- App/Course context (required - OTP is bound to specific app/course)
  app_id TEXT NOT NULL,
  
  -- OTP details
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Delivery tracking
  delivery_channel TEXT NOT NULL CHECK (delivery_channel IN ('sms', 'email', 'both')),
  email_sent BOOLEAN DEFAULT false,
  sms_sent BOOLEAN DEFAULT false,
  
  -- Verification tracking
  verified_at TIMESTAMPTZ,
  verification_attempts INTEGER DEFAULT 0,
  
  -- Metadata
  reason TEXT DEFAULT 'payment_verification',
  payment_transaction_id TEXT,
  admin_generated BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure OTP uniqueness per app within validity period
  CONSTRAINT unique_active_otp_per_user_app UNIQUE (email, app_id, otp)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_otps_email ON public.otps(email);
CREATE INDEX IF NOT EXISTS idx_otps_phone ON public.otps(phone);
CREATE INDEX IF NOT EXISTS idx_otps_app_id ON public.otps(app_id);
CREATE INDEX IF NOT EXISTS idx_otps_user_id ON public.otps(user_id);
CREATE INDEX IF NOT EXISTS idx_otps_expires_at ON public.otps(expires_at);
CREATE INDEX IF NOT EXISTS idx_otps_verified_at ON public.otps(verified_at);
CREATE INDEX IF NOT EXISTS idx_otps_created_at ON public.otps(created_at);

-- Composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_otps_email_app_verified ON public.otps(email, app_id, verified_at);

-- Add helpful comments
COMMENT ON TABLE public.otps IS 'App-specific OTP verification codes generated after payment or admin action';
COMMENT ON COLUMN public.otps.app_id IS 'App/course identifier (e.g., learn-ai, learn-pr). OTP is ONLY valid for this app.';
COMMENT ON COLUMN public.otps.delivery_channel IS 'How the OTP was/will be delivered: sms, email, or both';
COMMENT ON COLUMN public.otps.verified_at IS 'Timestamp when OTP was successfully verified. NULL means not yet verified.';
COMMENT ON COLUMN public.otps.verification_attempts IS 'Number of verification attempts. Used for rate limiting.';
COMMENT ON COLUMN public.otps.reason IS 'Why OTP was generated: payment_verification, admin_generated, error_compensation, etc.';

-- Enable Row Level Security
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own OTPs" ON public.otps;
DROP POLICY IF EXISTS "Admins can view all OTPs" ON public.otps;
DROP POLICY IF EXISTS "Service role can insert OTPs" ON public.otps;
DROP POLICY IF EXISTS "Service role can update OTPs" ON public.otps;

-- Users can view their own OTPs
CREATE POLICY "Users can view their own OTPs" ON public.otps
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can view all OTPs
CREATE POLICY "Admins can view all OTPs" ON public.otps
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow service role (API) to insert OTPs
CREATE POLICY "Service role can insert OTPs" ON public.otps
  FOR INSERT
  WITH CHECK (true);

-- Allow service role (API) to update OTPs (for verification)
CREATE POLICY "Service role can update OTPs" ON public.otps
  FOR UPDATE
  USING (true);

-- Function to clean up expired OTPs (optional, for maintenance)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.otps
  WHERE expires_at < NOW() - INTERVAL '24 hours'
  AND verified_at IS NULL;
END;
$$;

COMMENT ON FUNCTION cleanup_expired_otps IS 'Deletes expired, unverified OTPs older than 24 hours. Run periodically for cleanup.';
