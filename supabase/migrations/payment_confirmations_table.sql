-- ============================================================
-- payment_confirmations table
-- ============================================================
--
-- Stores confirmed payments forwarded by aienter.in to
-- https://iiskills.cloud/api/payments/confirm after Razorpay
-- webhook verification on the aienter.in side.
--
-- UNIQUE constraint on razorpay_payment_id ensures idempotency:
-- duplicate POSTs from aienter.in are detected and handled
-- gracefully (HTTP 200, no duplicate rows).
--
-- CREATED: 2026-03-01
-- AUTHOR: iiskills-cloud team
-- ============================================================

CREATE TABLE IF NOT EXISTS public.payment_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- aienter.in purchase identifier
  purchase_id TEXT NOT NULL,

  -- App/course context
  app_id TEXT NOT NULL,
  course_slug TEXT,

  -- Payment details (amounts in paise as supplied by aienter.in)
  amount_paise INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',

  -- Customer contact
  customer_phone TEXT NOT NULL,

  -- Razorpay identifiers
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT UNIQUE NOT NULL,

  -- When the payment occurred (as reported by aienter.in)
  paid_at TIMESTAMPTZ,

  -- Record timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_payment_confirmations_razorpay_payment_id
  ON public.payment_confirmations(razorpay_payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_purchase_id
  ON public.payment_confirmations(purchase_id);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_app_id
  ON public.payment_confirmations(app_id);

CREATE INDEX IF NOT EXISTS idx_payment_confirmations_customer_phone
  ON public.payment_confirmations(customer_phone);

-- Helpful comments
COMMENT ON TABLE public.payment_confirmations IS
  'Payment confirmations forwarded by aienter.in after Razorpay webhook verification';

COMMENT ON COLUMN public.payment_confirmations.purchase_id IS
  'UUID from the aienter.in purchases table';

COMMENT ON COLUMN public.payment_confirmations.razorpay_payment_id IS
  'Razorpay payment ID; UNIQUE to ensure idempotent processing';

COMMENT ON COLUMN public.payment_confirmations.amount_paise IS
  'Payment amount in smallest currency unit (paise for INR)';

-- Enable Row Level Security
ALTER TABLE public.payment_confirmations ENABLE ROW LEVEL SECURITY;

-- Service role can insert confirmations (called by API route)
DROP POLICY IF EXISTS "Service role can insert payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Service role can insert payment_confirmations"
  ON public.payment_confirmations
  FOR INSERT WITH CHECK (true);

-- Service role can select (for idempotency lookups)
DROP POLICY IF EXISTS "Service role can select payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Service role can select payment_confirmations"
  ON public.payment_confirmations
  FOR SELECT USING (true);

-- Admins can view all confirmations
DROP POLICY IF EXISTS "Admins can view payment_confirmations" ON public.payment_confirmations;
CREATE POLICY "Admins can view payment_confirmations"
  ON public.payment_confirmations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );
