-- ============================================
-- PAYMENTS TABLE MIGRATION
-- ============================================
-- 
-- This migration creates a payments table to track all payment
-- transactions associated with app/course purchases.
--
-- CREATED: 2026-02-17
-- AUTHOR: iiskills-cloud team
-- PURPOSE: Track payment history for OTP generation and verification
-- ============================================

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Payment gateway details
  payment_id TEXT UNIQUE NOT NULL,
  payment_gateway TEXT DEFAULT 'razorpay' CHECK (payment_gateway IN ('razorpay', 'aienter', 'manual')),
  
  -- App/Course context
  app_id TEXT NOT NULL,
  
  -- User details
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_phone TEXT,
  
  -- Payment details
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'captured' CHECK (status IN ('captured', 'failed', 'refunded', 'pending')),
  
  -- Additional metadata
  payment_notes JSONB DEFAULT '{}',
  refund_id TEXT,
  refund_amount DECIMAL(10,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  refunded_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON public.payments(payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_app_id ON public.payments(app_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON public.payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_payments_email_app ON public.payments(user_email, app_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_app ON public.payments(user_id, app_id);

-- Add helpful comments
COMMENT ON TABLE public.payments IS 'Payment transaction records for app/course purchases';
COMMENT ON COLUMN public.payments.payment_id IS 'Unique payment ID from payment gateway (e.g., Razorpay payment ID)';
COMMENT ON COLUMN public.payments.app_id IS 'App/course identifier this payment is for';
COMMENT ON COLUMN public.payments.payment_notes IS 'Additional metadata from payment gateway (JSON)';
COMMENT ON COLUMN public.payments.status IS 'Payment status: captured (successful), failed, refunded, pending';

-- Enable Row Level Security
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Service role can update payments" ON public.payments;

-- Users can view their own payments
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Admins can view all payments
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Allow service role (API) to insert payments
CREATE POLICY "Service role can insert payments" ON public.payments
  FOR INSERT
  WITH CHECK (true);

-- Allow service role (API) to update payments (for refunds, status changes)
CREATE POLICY "Service role can update payments" ON public.payments
  FOR UPDATE
  USING (true);
