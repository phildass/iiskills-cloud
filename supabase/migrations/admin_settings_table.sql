-- Admin Settings Table
-- This table stores secure admin configuration including hashed password
-- Used for password-first admin authentication (TEST MODE ONLY)
--
-- ⚠️ WARNING: This is for TEST MODE only - DO NOT KEEP IN PRODUCTION
-- After testing, this table should be dropped and authentication should
-- revert to Supabase user-based authentication

-- Create admin_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Only service role can access admin_settings" ON public.admin_settings;

-- Only service role can access admin_settings (no user access via RLS)
-- This table should ONLY be accessed server-side with service_role key
CREATE POLICY "Only service role can access admin_settings" 
  ON public.admin_settings
  USING (false);

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_admin_settings_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_admin_settings_updated ON public.admin_settings;
CREATE TRIGGER on_admin_settings_updated
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_admin_settings_updated_at();

-- Add index for faster key lookups
CREATE INDEX IF NOT EXISTS admin_settings_key_idx ON public.admin_settings(key);

-- IMPORTANT: This table bypasses RLS and should only be accessed server-side
-- using SUPABASE_SERVICE_ROLE_KEY, never the anon key

-- To drop this table after testing, run:
-- DROP TABLE IF EXISTS public.admin_settings CASCADE;
-- DROP FUNCTION IF EXISTS public.handle_admin_settings_updated_at() CASCADE;
