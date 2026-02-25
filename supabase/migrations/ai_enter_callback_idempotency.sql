-- ============================================
-- ai-enter Payment Callback: Idempotency Index
-- ============================================
--
-- The payments table already has `payment_id TEXT UNIQUE NOT NULL` which
-- ensures idempotency: a duplicate razorpay_payment_id causes a unique
-- constraint violation (pg error 23505), handled gracefully by the callback
-- handler at /api/payments/ai-enter/callback.
--
-- This migration also adds the 'aienter' gateway value to the CHECK
-- constraint (already included in the original migration; this is a
-- no-op guard for environments that were set up before that change).
--
-- CREATED: 2026-02-25
-- AUTHOR: iiskills-cloud team
-- ============================================

-- Ensure the aienter gateway value is accepted (idempotent ALTER)
DO $$
BEGIN
  -- Drop and re-create constraint only if 'aienter' is missing
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'payments_payment_gateway_check'
      AND consrc LIKE '%aienter%'
  ) THEN
    ALTER TABLE public.payments
      DROP CONSTRAINT IF EXISTS payments_payment_gateway_check;

    ALTER TABLE public.payments
      ADD CONSTRAINT payments_payment_gateway_check
      CHECK (payment_gateway IN ('razorpay', 'aienter', 'manual'));
  END IF;
END$$;

-- Service-role INSERT policy (idempotent)
DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
CREATE POLICY "Service role can insert payments" ON public.payments
  FOR INSERT WITH CHECK (true);
