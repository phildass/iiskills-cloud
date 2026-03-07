-- ============================================================
-- Admin Invites Table
--
-- Stores pending admin invitations for users who don't yet have
-- a Supabase account. On first login, the trigger / login callback
-- detects a matching invite and sets profiles.is_admin = true.
--
-- CREATED: 2026-03-06
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_invites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Invited person
  email TEXT NOT NULL,
  name TEXT,

  -- Who created the invite (superadmin)
  invited_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invited_by_email TEXT,

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'revoked')),
  fulfilled_at TIMESTAMPTZ,
  fulfilled_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Notes
  notes TEXT,

  UNIQUE(email)
);

CREATE INDEX IF NOT EXISTS idx_admin_invites_email ON public.admin_invites(email);
CREATE INDEX IF NOT EXISTS idx_admin_invites_status ON public.admin_invites(status);

ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block all user access to admin_invites"
  ON public.admin_invites
  USING (false);

CREATE POLICY "Allow service role access to admin_invites"
  ON public.admin_invites
  TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.admin_invites TO service_role;

COMMENT ON TABLE public.admin_invites IS 'Pending admin invitations. On first login of the invited email, is_admin is set to true automatically.';
