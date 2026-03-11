-- ============================================
-- FIX PURCHASES STATUS CHECK CONSTRAINT
-- ============================================
--
-- Production blocker: /api/payments/confirm fails with
--   "violates check constraint purchases_status_check"
-- when attempting to UPDATE purchases SET status = 'paid'.
--
-- Root cause: The constraint in production may not include 'paid'
-- as a valid status value if the table was created before the
-- 2026-03-09_purchases_table.sql migration was applied
-- (CREATE TABLE IF NOT EXISTS does not update existing constraints).
--
-- Fix: Explicitly drop and recreate the constraint to allow
-- 'created', 'paid', and 'failed' as valid status values.
--
-- IDEMPOTENT: Uses DROP CONSTRAINT IF EXISTS before ADD CONSTRAINT.
-- Safe to run multiple times.
--
-- To apply in Supabase:
--   Open the Supabase Dashboard → SQL Editor → paste and run this file.
--
-- CREATED: 2026-03-11
-- AUTHOR: iiskills-cloud team
-- ============================================

ALTER TABLE public.purchases
  DROP CONSTRAINT IF EXISTS purchases_status_check;

ALTER TABLE public.purchases
  ADD CONSTRAINT purchases_status_check
  CHECK (status IN ('created', 'paid', 'failed'));
