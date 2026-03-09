-- ============================================
-- PURCHASES TABLE MIGRATION
-- ============================================
--
-- Creates the public.purchases table to track purchases created
-- BEFORE the user is redirected to aienter.in/payments/iiskills.
--
-- Flow:
--   1. POST /api/payments/create-purchase → INSERT row (status='created')
--   2. User pays on aienter.in via Razorpay
--   3. POST /api/payments/confirm → UPDATE row (status='paid', razorpay fields)
--
-- Ownership: user_id FK (preferred) + metadata.user_id (fallback) both written
-- by create-purchase and validated by confirm.
--
-- Idempotency:
--   - Unique partial index on razorpay_payment_id (where not null) prevents
--     duplicate payment acknowledgements.
--   - confirm.js checks iiskills_ack_at to detect already-processed callbacks.
--   - create-purchase.js deduplicates double-clicks by reusing an existing
--     'created' purchase for the same user/course/amount in the last 10 minutes.
--
-- CREATED: 2026-03-09
-- AUTHOR: iiskills-cloud team
-- ============================================

CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- User who initiated the purchase (FK for direct ownership validation)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Course / app being purchased
  course_slug TEXT NOT NULL,

  -- Destination app host (e.g. learn-ai.iiskills.cloud)
  target_app_host TEXT,

  -- Customer identity (from profile at time of purchase)
  customer_phone TEXT NOT NULL,
  customer_name TEXT,

  -- Amount in smallest currency unit
  amount_paise INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',

  -- Purchase lifecycle status
  status TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created', 'paid', 'failed')),

  -- Razorpay payment identifiers (set when payment is confirmed)
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,

  -- Timestamps
  paid_at TIMESTAMPTZ,
  iiskills_ack_at TIMESTAMPTZ,  -- set when /api/payments/confirm processes this row
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Additional metadata (includes user_id, email for legacy/fallback validation)
  metadata JSONB DEFAULT '{}'::jsonb
);

-- ── Indexes ────────────────────────────────────────────────────────────────────

-- Fast lookup by user
CREATE INDEX IF NOT EXISTS idx_purchases_user_id
  ON public.purchases(user_id);

-- Fast lookup by course for a user (used for idempotency dedup on create)
CREATE INDEX IF NOT EXISTS idx_purchases_user_course
  ON public.purchases(user_id, course_slug);

-- Status-filtered lookup
CREATE INDEX IF NOT EXISTS idx_purchases_status
  ON public.purchases(status);

-- Uniqueness on razorpay_payment_id prevents duplicate payment acknowledgements
CREATE UNIQUE INDEX IF NOT EXISTS idx_purchases_razorpay_payment_id_unique
  ON public.purchases(razorpay_payment_id)
  WHERE razorpay_payment_id IS NOT NULL;

-- ── Comments ───────────────────────────────────────────────────────────────────

COMMENT ON TABLE public.purchases IS
  'Tracks iiskills.cloud purchases created before redirect to aienter.in. Updated to paid status by /api/payments/confirm after Razorpay payment.';

COMMENT ON COLUMN public.purchases.user_id IS
  'Supabase auth user UUID — the authenticated user who created this purchase. Used for ownership validation in /api/payments/confirm.';

COMMENT ON COLUMN public.purchases.iiskills_ack_at IS
  'Timestamp when /api/payments/confirm successfully processed this purchase. NULL = not yet acknowledged. Used for idempotency.';

COMMENT ON COLUMN public.purchases.metadata IS
  'JSON metadata including user_id and email written at purchase creation. Legacy/fallback for ownership validation when user_id column is null.';

COMMENT ON COLUMN public.purchases.razorpay_payment_id IS
  'Razorpay payment ID, unique where not null, to prevent duplicate payment grants.';

-- ── Row Level Security ─────────────────────────────────────────────────────────

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Users can read their own purchases
DROP POLICY IF EXISTS "Users can read own purchases" ON public.purchases;
CREATE POLICY "Users can read own purchases" ON public.purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read and manage all purchases
DROP POLICY IF EXISTS "Admins can manage all purchases" ON public.purchases;
CREATE POLICY "Admins can manage all purchases" ON public.purchases
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Service role can insert/update purchases (used by /api/payments/* routes)
DROP POLICY IF EXISTS "Service role full access on purchases" ON public.purchases;
CREATE POLICY "Service role full access on purchases" ON public.purchases
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── Auto-update updated_at ────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_purchases_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_purchases_updated_at ON public.purchases;
CREATE TRIGGER trg_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.set_purchases_updated_at();
