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

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile (but NOT the is_admin field)
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      -- Ensure is_admin field is not being changed
      (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = NEW.is_admin
    )
  );

-- Users can insert their own profile on signup
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

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

-- Grant necessary permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;

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
