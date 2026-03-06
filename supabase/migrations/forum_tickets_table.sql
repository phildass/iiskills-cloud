-- ============================================================
-- forum_tickets — User support ticket system
-- User-facing name: "Tickets"
-- DB table: public.forum_tickets (kept to avoid churn)
-- ============================================================

-- Ticket type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_issue_type') THEN
    CREATE TYPE ticket_issue_type AS ENUM (
      'payment_auth_not_made',
      'payment_wrongly_made_refund',
      'paid_course_not_satisfactory',
      'other'
    );
  END IF;
END$$;

-- Ticket status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
  END IF;
END$$;

-- Main tickets table
CREATE TABLE IF NOT EXISTS public.forum_tickets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT NOT NULL,
  issue_type      ticket_issue_type NOT NULL,
  other_text      TEXT CHECK (char_length(other_text) <= 100),
  proof_file_path TEXT,             -- storage path: tickets/{user_id}/{filename}
  status          ticket_status NOT NULL DEFAULT 'open',
  admin_note      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS forum_tickets_user_id_idx ON public.forum_tickets(user_id);
CREATE INDEX IF NOT EXISTS forum_tickets_status_idx  ON public.forum_tickets(status);
CREATE INDEX IF NOT EXISTS forum_tickets_created_at_idx ON public.forum_tickets(created_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS forum_tickets_updated_at ON public.forum_tickets;
CREATE TRIGGER forum_tickets_updated_at
  BEFORE UPDATE ON public.forum_tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.forum_tickets ENABLE ROW LEVEL SECURITY;

-- Users can insert their own tickets
CREATE POLICY "tickets_insert_own" ON public.forum_tickets
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can read only their own tickets
CREATE POLICY "tickets_select_own" ON public.forum_tickets
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Service role (admin APIs) can read/write all tickets
CREATE POLICY "tickets_service_role_all" ON public.forum_tickets
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Storage bucket: tickets ────────────────────────────────────────────────────
-- Create the bucket for proof-of-payment uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tickets',
  'tickets',
  false,
  10485760,  -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: users can upload/read within their own user_id folder
CREATE POLICY "tickets_storage_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'tickets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "tickets_storage_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'tickets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admin (service role) can read all files in the tickets bucket
CREATE POLICY "tickets_storage_service_role_all" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'tickets')
  WITH CHECK (bucket_id = 'tickets');

-- Grant table access to authenticated and service_role
GRANT SELECT, INSERT ON public.forum_tickets TO authenticated;
GRANT ALL ON public.forum_tickets TO service_role;
