-- ============================================================
-- Refund Requests Migration
-- Table: public.refund_requests
-- Purpose: Store user refund requests with admin workflow
-- ============================================================

-- Refund request status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'refund_request_status') THEN
    CREATE TYPE refund_request_status AS ENUM ('pending', 'approved', 'rejected');
  END IF;
END
$$;

-- ── refund_requests table ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purchase_id   uuid REFERENCES public.purchases(id) ON DELETE SET NULL,
  course_slug   text NOT NULL,
  amount_paise  integer NOT NULL DEFAULT 0 CHECK (amount_paise >= 0),
  reason        text NOT NULL CHECK (char_length(reason) >= 5 AND char_length(reason) <= 1000),
  status        refund_request_status NOT NULL DEFAULT 'pending',
  admin_note    text,
  acted_by      text,
  acted_at      timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for listing by user (user portal)
CREATE INDEX IF NOT EXISTS refund_requests_user_id_idx
  ON public.refund_requests (user_id, created_at DESC);

-- Index for admin listing by status, newest first
CREATE INDEX IF NOT EXISTS refund_requests_status_created_idx
  ON public.refund_requests (status, created_at DESC);

-- ── Row-Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- Users can insert their own refund requests
CREATE POLICY "refund_requests_insert_own" ON public.refund_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can read their own refund requests
CREATE POLICY "refund_requests_select_own" ON public.refund_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role (admin API) can do everything
CREATE POLICY "refund_requests_service_role_all" ON public.refund_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Grant permissions ────────────────────────────────────────────────────────
GRANT SELECT, INSERT ON public.refund_requests TO authenticated;
GRANT ALL ON public.refund_requests TO service_role;
