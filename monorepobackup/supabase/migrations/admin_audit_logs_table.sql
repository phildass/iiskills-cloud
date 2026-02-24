-- Admin Audit Logs Table
-- 
-- This table stores audit logs for all admin authentication and setup events.
-- Used to track who performed admin setup, when they logged in, and any failures.
--
-- Security: Only accessible via service role key (RLS blocks all user access)

CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp timestamp with time zone DEFAULT now() NOT NULL,
  event_type text NOT NULL, -- 'ADMIN_SETUP_SUCCESS', 'LOGIN_SUCCESS', 'LOGIN_FAILED', etc.
  ip_address text,
  user_agent text,
  details jsonb, -- Additional event-specific details
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_timestamp ON public.admin_audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_event_type ON public.admin_audit_logs(event_type);

-- Enable Row Level Security
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Block all regular user access
CREATE POLICY "Block all user access to admin_audit_logs" 
  ON public.admin_audit_logs 
  USING (false);

-- Policy: Allow service role full access
CREATE POLICY "Allow service role access to admin_audit_logs"
  ON public.admin_audit_logs
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant explicit permissions to service role
GRANT ALL ON public.admin_audit_logs TO service_role;

-- Add comment
COMMENT ON TABLE public.admin_audit_logs IS 'Audit logs for admin authentication and setup events. Only accessible via service role.';
