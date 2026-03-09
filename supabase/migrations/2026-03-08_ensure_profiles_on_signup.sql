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
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS
  'Ensures a public.profiles row exists for every new auth.users entry.';

-- Trigger on auth.users -------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Back-fill: create missing profiles rows for existing users -
-- Uses INSERT … SELECT so existing rows are never overwritten.
INSERT INTO public.profiles (id, email)
SELECT id, email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
