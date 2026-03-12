-- ============================================================
-- ENSURE PROFILES ROW ON USER SIGNUP
-- ============================================================
--
-- Creates a trigger on auth.users so that every new Supabase
-- user automatically gets a corresponding row in public.profiles.
-- This prevents the "profile row missing" scenario that can block
-- the payment token flow (POST /api/payments/generate-token).
--
-- The trigger is IDEMPOTENT: safe to run multiple times.
--
-- CREATED: 2026-03-08
-- AUTHOR:  iiskills-cloud team
-- ============================================================

-- Function called by the trigger ----------------------------
-- NOTE: public.profiles has no `email` column; email lives in auth.users.
-- We seed first_name/last_name/full_name from signup metadata when available.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_subscribed boolean;
BEGIN
  v_subscribed := COALESCE(
    (NEW.raw_user_meta_data->>'subscribed_to_newsletter')::boolean,
    true
  );

  INSERT INTO public.profiles (
    id,
    is_admin,
    subscribed_to_newsletter,
    first_name,
    last_name,
    full_name
  )
  VALUES (
    NEW.id,
    false,
    v_subscribed,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    subscribed_to_newsletter = EXCLUDED.subscribed_to_newsletter,
    first_name = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name  = COALESCE(EXCLUDED.last_name,  public.profiles.last_name),
    full_name  = COALESCE(EXCLUDED.full_name,  public.profiles.full_name);

  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS
  'Ensures a public.profiles row exists for every new auth.users entry. '
  'Seeds name fields from signup metadata when present.';

-- Trigger on auth.users -------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Back-fill: create missing profiles rows for existing users -
-- Uses INSERT … SELECT so existing rows are never overwritten.
INSERT INTO public.profiles (id)
SELECT id
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
