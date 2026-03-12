-- ============================================================
-- Fix handle_new_user() trigger to not reference non-existent email column
-- ============================================================
--
-- The migration 2026-03-08_ensure_profiles_on_signup.sql introduced a
-- broken version of handle_new_user() that attempted to INSERT into a
-- non-existent `email` column on public.profiles.
--
-- When applied:
--   1. The CREATE OR REPLACE FUNCTION succeeds (body is parsed lazily).
--   2. On every new user signup, the trigger fires and the INSERT fails:
--        ERROR: column "email" of relation "profiles" does not exist
--   3. This rolls back the profiles row creation, leaving new users without
--      a profiles row (or even failing signup entirely depending on Supabase
--      version/configuration).
--   4. Subsequent /api/profile/update calls return 404 "Profile not found"
--      or 500 "Failed to fetch profile" — the persistent errors reported in
--      the debug issue.
--
-- Fix: restore the correct handle_new_user() that seeds name fields from
--   signup metadata without referencing the non-existent email column.
--   Also back-fill any profiles rows that were missed due to the broken trigger.
--
-- CREATED: 2026-03-12
-- AUTHOR:  iiskills-cloud team
-- ============================================================

-- ── 1. Replace the broken trigger function ────────────────────────────────────
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

-- ── 2. Re-attach the trigger (idempotent) ─────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 3. Back-fill profiles rows for users who were missed ──────────────────────
-- Users who signed up while the broken trigger was in place will not have a
-- profiles row. Create one for each such user (no name info available since
-- the metadata is not stored in auth.users after signup, but the row must
-- exist so the profile API does not return 404).
INSERT INTO public.profiles (id, is_admin, subscribed_to_newsletter)
SELECT au.id, false, true
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.id = au.id
)
ON CONFLICT (id) DO NOTHING;
