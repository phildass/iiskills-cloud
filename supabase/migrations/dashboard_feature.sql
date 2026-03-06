-- ============================================================
-- Dashboard Feature Migration
-- Tables: course_messages, ticket_replies, moderation_logs
-- Also adds moderation columns (strikes, ban) to profiles
-- ============================================================

-- ── 1. Add moderation columns to profiles ────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS moderation_strikes INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_banned BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS banned_at TIMESTAMPTZ;

-- Prevent authenticated users from updating moderation fields directly.
-- Only service_role (server-side admin code paths) can modify these columns.
REVOKE UPDATE (moderation_strikes, is_banned, banned_at)
  ON public.profiles
  FROM authenticated;

-- ── 2. course_messages table ─────────────────────────────────────────────────
-- Stores per-course communication threads between a learner and admins.
CREATE TABLE IF NOT EXISTS public.course_messages (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_app_id   TEXT NOT NULL,          -- e.g. 'learn-ai', 'learn-developer'
  message         TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  is_admin_reply  BOOLEAN NOT NULL DEFAULT false,
  -- parent_id links admin replies back to the learner's original message
  parent_id       UUID REFERENCES public.course_messages(id) ON DELETE SET NULL,
  read_by_user    BOOLEAN NOT NULL DEFAULT false,
  read_by_admin   BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_messages_user_course_idx
  ON public.course_messages (user_id, course_app_id, created_at DESC);

CREATE INDEX IF NOT EXISTS course_messages_admin_unread_idx
  ON public.course_messages (course_app_id, read_by_admin, created_at DESC)
  WHERE read_by_admin = false AND is_admin_reply = false;

ALTER TABLE public.course_messages ENABLE ROW LEVEL SECURITY;

-- Learners can view their own messages and admin replies to their messages
CREATE POLICY "course_messages_select_own" ON public.course_messages
  FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR (
      is_admin_reply = true
      AND parent_id IN (
        SELECT id FROM public.course_messages WHERE user_id = auth.uid()
      )
    )
  );

-- Learners can insert messages for their own user_id
CREATE POLICY "course_messages_insert_own" ON public.course_messages
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND is_admin_reply = false);

-- Learners can only mark their own non-admin-reply messages as read.
-- They cannot modify admin replies or other message columns.
CREATE POLICY "course_messages_update_own_read" ON public.course_messages
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id AND is_admin_reply = false)
  WITH CHECK (auth.uid() = user_id AND is_admin_reply = false);

-- Restrict column-level UPDATE for authenticated users to read_by_user only.
-- This prevents learners from modifying message content, is_admin_reply, parent_id, etc.
REVOKE UPDATE ON public.course_messages FROM authenticated;
GRANT UPDATE (read_by_user) ON public.course_messages TO authenticated;

-- Service role can do everything
CREATE POLICY "course_messages_service_role_all" ON public.course_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.course_messages TO authenticated;
GRANT ALL ON public.course_messages TO service_role;

-- ── 3. ticket_replies table ──────────────────────────────────────────────────
-- Stores the conversation thread for each support ticket.
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id    UUID NOT NULL REFERENCES public.forum_tickets(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin     BOOLEAN NOT NULL DEFAULT false,
  message      TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 2000),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ticket_replies_ticket_idx
  ON public.ticket_replies (ticket_id, created_at ASC);

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Users can select replies for tickets they own
CREATE POLICY "ticket_replies_select_own" ON public.ticket_replies
  FOR SELECT TO authenticated
  USING (
    ticket_id IN (
      SELECT id FROM public.forum_tickets WHERE user_id = auth.uid()
    )
  );

-- Users can insert replies for their own tickets
CREATE POLICY "ticket_replies_insert_own" ON public.ticket_replies
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND is_admin = false
    AND ticket_id IN (
      SELECT id FROM public.forum_tickets WHERE user_id = auth.uid()
    )
  );

-- Service role can do everything
CREATE POLICY "ticket_replies_service_role_all" ON public.ticket_replies
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT SELECT, INSERT ON public.ticket_replies TO authenticated;
GRANT ALL ON public.ticket_replies TO service_role;

-- ── 4. moderation_logs table ─────────────────────────────────────────────────
-- Records every rejected content submission for admin review.
CREATE TABLE IF NOT EXISTS public.moderation_logs (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type    TEXT NOT NULL CHECK (content_type IN ('ticket', 'course_message')),
  content_snippet TEXT,
  rejection_reason TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS moderation_logs_user_idx
  ON public.moderation_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS moderation_logs_admin_idx
  ON public.moderation_logs (created_at DESC);

ALTER TABLE public.moderation_logs ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write moderation logs
CREATE POLICY "moderation_logs_service_role_all" ON public.moderation_logs
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

GRANT ALL ON public.moderation_logs TO service_role;
