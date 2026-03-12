-- public.profiles table schema
-- This table stores user profile information and admin status
-- Used for centralized admin validation across all apps

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  full_name text,
  gender text,
  date_of_birth date,
  age integer,
  education text,
  qualification text,
  location text,
  state text,
  district text,
  country text,
  specify_country text,
  is_admin boolean DEFAULT false NOT NULL,
  subscribed_to_newsletter boolean DEFAULT true NOT NULL,
  -- Payment status (denormalised for fast lookups; kept in sync by API / triggers)
  is_paid_user boolean NOT NULL DEFAULT false,
  paid_at timestamptz,
  -- Post-payment onboarding fields
  phone text,
  username text,
  registration_completed boolean NOT NULL DEFAULT false,
  -- Profile field-locking fields (set on first profile submission)
  profile_submitted_at timestamptz,
  name_change_count integer NOT NULL DEFAULT 0,
  -- Extended education fields (always editable)
  education_self text,
  education_father text,
  education_mother text,
  -- Moderation fields
  moderation_strikes integer NOT NULL DEFAULT 0,
  is_banned boolean NOT NULL DEFAULT false,
  banned_at timestamptz,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile.
-- Note: is_admin is protected via the handle_protect_is_admin trigger below,
-- not via a recursive RLS subquery (which can cause infinite-loop errors).
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Service role bypasses RLS (used by server-side API with service_role key)
CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create or replace function to handle new user creation
-- This automatically creates a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
DECLARE
  v_subscribed boolean;
BEGIN
  -- Get subscription preference from metadata, default to true
  v_subscribed := COALESCE((new.raw_user_meta_data->>'subscribed_to_newsletter')::boolean, true);
  
  INSERT INTO public.profiles (
    id, 
    is_admin,
    subscribed_to_newsletter,
    first_name,
    last_name,
    full_name
  )
  VALUES (
    new.id, 
    false,
    v_subscribed,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    subscribed_to_newsletter = v_subscribed,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = timezone('utc'::text, now());
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists and recreate
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Add index for faster admin lookups
CREATE INDEX IF NOT EXISTS profiles_is_admin_idx ON public.profiles(is_admin) WHERE is_admin = true;

-- Add index for user lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);

-- Add index for paid-user lookups
CREATE INDEX IF NOT EXISTS profiles_is_paid_user_idx ON public.profiles(is_paid_user) WHERE is_paid_user = true;

-- Unique partial index on username (allows NULL for unregistered users)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_idx
  ON public.profiles(username)
  WHERE username IS NOT NULL;

-- Phone E.164 check constraint and unique index
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_phone_e164_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_phone_e164_check
  CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{6,14}$');
CREATE UNIQUE INDEX IF NOT EXISTS profiles_phone_unique_idx
  ON public.profiles(phone)
  WHERE phone IS NOT NULL;

-- Trigger: protect is_admin from being changed by authenticated users
-- (The RLS UPDATE policy no longer uses a recursive subquery for this;
--  a BEFORE UPDATE trigger is the safe alternative.)
CREATE OR REPLACE FUNCTION public.handle_protect_is_admin()
RETURNS trigger AS $$
BEGIN
  -- Prevent authenticated users from elevating or clearing is_admin via normal UPDATE.
  -- Service-role calls bypass this trigger's guard because they set is_admin directly
  -- through a separate admin-only code path.
  IF NEW.is_admin <> OLD.is_admin THEN
    RAISE EXCEPTION 'Changing is_admin is not allowed via profile update';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_profile_protect_is_admin ON public.profiles;
CREATE TRIGGER on_profile_protect_is_admin
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (pg_trigger_depth() = 0)
  EXECUTE FUNCTION public.handle_protect_is_admin();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Admin setup instructions:
-- To make a user an admin, run this SQL query in Supabase SQL Editor:
-- 
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
--
-- To verify admin users:
-- SELECT u.email, p.is_admin, p.created_at
-- FROM auth.users u
-- JOIN public.profiles p ON u.id = p.id
-- WHERE p.is_admin = true;
