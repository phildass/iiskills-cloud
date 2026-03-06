-- ============================================================
-- Admin Audit Events Table
--
-- Stores audit trail for all privileged admin actions.
-- Separate from admin_audit_logs (which tracks authentication).
--
-- CREATED: 2026-03-06
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_audit_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Who performed the action
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- null if emergency admin
  actor_email TEXT,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('supabase_admin', 'emergency_admin')),

  -- What action was performed
  action TEXT NOT NULL,  -- e.g. grant_entitlement, revoke_entitlement, create_admin, revoke_admin, ban_user, unban_user, update_ticket_status

  -- Affected target
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_email_or_phone TEXT,

  -- Context
  app_id TEXT,
  course_title_snapshot TEXT,

  -- Extra freeform data (previous_value, new_value, ticket_id, reason, etc.)
  metadata JSONB
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_created_at ON public.admin_audit_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_action ON public.admin_audit_events(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_actor_email ON public.admin_audit_events(actor_email);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_target_user_id ON public.admin_audit_events(target_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_events_app_id ON public.admin_audit_events(app_id);

-- Enable Row Level Security
ALTER TABLE public.admin_audit_events ENABLE ROW LEVEL SECURITY;

-- Block all regular user access
CREATE POLICY "Block all user access to admin_audit_events"
  ON public.admin_audit_events
  USING (false);

-- Allow service role full access
CREATE POLICY "Allow service role access to admin_audit_events"
  ON public.admin_audit_events
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.admin_audit_events TO service_role;

COMMENT ON TABLE public.admin_audit_events IS 'Audit trail for privileged admin actions. Only accessible via service role.';
COMMENT ON COLUMN public.admin_audit_events.action IS 'Action enum: grant_entitlement, revoke_entitlement, create_admin, revoke_admin, ban_user, unban_user, update_ticket_status';
COMMENT ON COLUMN public.admin_audit_events.actor_type IS 'supabase_admin = authenticated via Supabase; emergency_admin = authenticated via passphrase cookie/header';
