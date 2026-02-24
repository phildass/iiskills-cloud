-- ============================================
-- USER APP ACCESS TABLE MIGRATION
-- ============================================
-- 
-- This migration creates a user_app_access table to track which apps
-- users have access to, enabling bundle logic and access control.
--
-- CREATED: 2026-02-18
-- AUTHOR: iiskills-cloud team
-- PURPOSE: Track user access to apps with bundle support
-- ============================================

-- Create user_app_access table
CREATE TABLE IF NOT EXISTS public.user_app_access (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- User and app references
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_id TEXT NOT NULL,
  
  -- Access metadata
  access_granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  granted_via TEXT NOT NULL CHECK (granted_via IN ('payment', 'bundle', 'otp', 'admin', 'free')),
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  
  -- Expiration support (NULL = permanent)
  expires_at TIMESTAMPTZ,
  
  -- Status tracking
  is_active BOOLEAN DEFAULT true NOT NULL,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Unique constraint: one access record per user per app
  UNIQUE(user_id, app_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_app_access_user_id ON public.user_app_access(user_id);
CREATE INDEX IF NOT EXISTS idx_user_app_access_app_id ON public.user_app_access(app_id);
CREATE INDEX IF NOT EXISTS idx_user_app_access_user_app ON public.user_app_access(user_id, app_id);
CREATE INDEX IF NOT EXISTS idx_user_app_access_active ON public.user_app_access(user_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_app_access_payment ON public.user_app_access(payment_id) WHERE payment_id IS NOT NULL;

-- Add helpful comments
COMMENT ON TABLE public.user_app_access IS 'Tracks which users have access to which apps, with bundle support';
COMMENT ON COLUMN public.user_app_access.granted_via IS 'How access was granted: payment, bundle (from another app purchase), otp, admin, or free';
COMMENT ON COLUMN public.user_app_access.payment_id IS 'If granted via payment, reference to the payment record';
COMMENT ON COLUMN public.user_app_access.expires_at IS 'When access expires (NULL = permanent access)';

-- Add bundle_apps column to payments table
ALTER TABLE public.payments ADD COLUMN IF NOT EXISTS bundle_apps TEXT[] DEFAULT NULL;
COMMENT ON COLUMN public.payments.bundle_apps IS 'Array of app_ids unlocked by this payment (for bundle purchases)';

-- Enable Row Level Security
ALTER TABLE public.user_app_access ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own access" ON public.user_app_access;
DROP POLICY IF EXISTS "Admins can view all access" ON public.user_app_access;
DROP POLICY IF EXISTS "Service role can manage access" ON public.user_app_access;

-- Users can view their own access
CREATE POLICY "Users can view their own access" ON public.user_app_access
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all access records
CREATE POLICY "Admins can view all access" ON public.user_app_access
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Service role (API) can manage all access records
CREATE POLICY "Service role can manage access" ON public.user_app_access
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_user_app_access_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_user_app_access_updated ON public.user_app_access;
CREATE TRIGGER on_user_app_access_updated
  BEFORE UPDATE ON public.user_app_access
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_app_access_updated_at();

-- Grant necessary permissions
GRANT SELECT ON public.user_app_access TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.user_app_access TO service_role;
