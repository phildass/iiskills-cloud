-- ============================================================
-- Tickets System Migration
-- Table: public.forum_tickets
-- Purpose: In-app support/payment tickets to replace email support
-- ============================================================

-- Ticket status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
    CREATE TYPE ticket_status AS ENUM ('not_seen_yet', 'under_review', 'resolved');
  END IF;
END
$$;

-- Issue type enum
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
END
$$;

-- ── forum_tickets table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.forum_tickets (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name          text NOT NULL,
  phone         text,
  email         text NOT NULL,
  issue_type    ticket_issue_type NOT NULL,
  other_text    text CHECK (
                  (issue_type = 'other' AND other_text IS NOT NULL AND char_length(other_text) <= 100)
                  OR (issue_type != 'other' AND other_text IS NULL)
                ),
  proof_path    text,
  status        ticket_status NOT NULL DEFAULT 'not_seen_yet',
  resolved_at   timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for listing by user (user portal)
CREATE INDEX IF NOT EXISTS forum_tickets_user_id_idx ON public.forum_tickets (user_id, created_at DESC);

-- Index for admin listing oldest-first by status
CREATE INDEX IF NOT EXISTS forum_tickets_status_created_idx ON public.forum_tickets (status, created_at ASC);

-- ── Row-Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.forum_tickets ENABLE ROW LEVEL SECURITY;

-- Users can insert their own tickets
CREATE POLICY "tickets_insert_own" ON public.forum_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can select their own tickets
CREATE POLICY "tickets_select_own" ON public.forum_tickets
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role (admin API) can do everything
CREATE POLICY "tickets_service_role_all" ON public.forum_tickets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ── Grant permissions ────────────────────────────────────────────────────────
GRANT SELECT, INSERT ON public.forum_tickets TO authenticated;
GRANT ALL ON public.forum_tickets TO service_role;

-- ── Storage bucket for proof uploads ────────────────────────────────────────
-- NOTE: Supabase storage buckets cannot be created via SQL migration.
-- Run the following in the Supabase dashboard or via the management API:
--
--   1. Create bucket: ticket-proofs (private, not public)
--   2. Storage RLS policies (via dashboard SQL editor):
--
-- INSERT INTO storage.buckets (id, name, public) VALUES ('ticket-proofs', 'ticket-proofs', false)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "ticket_proofs_insert_own" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'ticket-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);
--
-- CREATE POLICY "ticket_proofs_select_own" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'ticket-proofs' AND (storage.foldername(name))[1] = auth.uid()::text);
--
-- CREATE POLICY "ticket_proofs_service_role" ON storage.objects
--   FOR ALL TO service_role
--   USING (bucket_id = 'ticket-proofs')
--   WITH CHECK (bucket_id = 'ticket-proofs');
