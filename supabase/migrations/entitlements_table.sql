-- ============================================
-- ENTITLEMENTS TABLE MIGRATION
-- ============================================
--
-- Creates the entitlements table to track user course access.
-- Users purchase access via aienter.in/payments/iiskills (Razorpay).
-- Admin grants entitlement after verifying payment reference.
--
-- Entitlement validity: 1 year from purchased_at.
-- Bundle: Learn AI + Learn Developer — buy one, get one free (app_id = 'ai-developer-bundle').
--
-- CREATED: 2026-02-25
-- AUTHOR: iiskills-cloud team
-- ============================================

CREATE TABLE IF NOT EXISTS public.entitlements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- App identifier (e.g. learn-ai, learn-developer, learn-management, learn-pr)
  -- Use 'ai-developer-bundle' to grant access to both learn-ai AND learn-developer
  app_id TEXT NOT NULL,

  -- Optional course-level granularity
  course_id TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'expired', 'revoked')),

  -- Timestamps
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 year'),

  -- How entitlement was granted
  source TEXT NOT NULL DEFAULT 'admin'
    CHECK (source IN ('razorpay', 'admin', 'manual', 'bundle')),

  -- Payment reference (Razorpay payment ID or order ID)
  payment_reference TEXT,

  -- Admin who granted (if source = 'admin' or 'manual')
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for efficient access checks
CREATE INDEX IF NOT EXISTS idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_app_id ON public.entitlements(app_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_app ON public.entitlements(user_id, app_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_status ON public.entitlements(user_id, app_id, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_expires ON public.entitlements(expires_at) WHERE status = 'active';

-- Helpful comments
COMMENT ON TABLE public.entitlements IS 'Tracks user entitlements (paid access) for iiskills.cloud courses and apps. Validity: 1 year.';
COMMENT ON COLUMN public.entitlements.app_id IS 'App/course ID, e.g. learn-ai, learn-developer, learn-management, learn-pr. Use ai-developer-bundle for the 2-in-1 bundle.';
COMMENT ON COLUMN public.entitlements.source IS 'How the entitlement was granted: razorpay (webhook), admin (manual grant after payment verification), manual (override), bundle (from bundle purchase).';
COMMENT ON COLUMN public.entitlements.expires_at IS 'Access expires 1 year after purchase by default. Null = perpetual (admin override).';

-- Enable Row Level Security
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Admins can manage all entitlements" ON public.entitlements;
DROP POLICY IF EXISTS "Service role full access" ON public.entitlements;

-- Users can read their own entitlements
CREATE POLICY "Users can read own entitlements" ON public.entitlements
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read and manage all entitlements
CREATE POLICY "Admins can manage all entitlements" ON public.entitlements
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- Helper function: auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.set_entitlements_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entitlements_updated_at ON public.entitlements;
CREATE TRIGGER trg_entitlements_updated_at
  BEFORE UPDATE ON public.entitlements
  FOR EACH ROW EXECUTE FUNCTION public.set_entitlements_updated_at();
