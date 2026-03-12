-- ============================================================
-- Fix profiles table: RLS policies + service_role access
-- ============================================================
--
-- Problems addressed:
--
--   1. The "Users can update own profile" RLS policy contained a recursive
--      subquery in its WITH CHECK clause:
--        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = NEW.is_admin
--      This causes an infinite-loop / stack-overflow error when any authenticated
--      user tries to update their own profile row.
--
--   2. The profiles table had no explicit service_role policy.  While Supabase's
--      service_role key bypasses RLS automatically, adding an explicit policy
--      is consistent with every other table in this schema and makes the intent
--      clear to future maintainers.
--
--   3. The GRANT statements were missing GRANT ALL TO service_role, meaning
--      table-level privileges were only granted to authenticated.
--
-- Fix strategy:
--   - Replace the recursive WITH CHECK with a simple auth.uid() = id check.
--   - Protect is_admin from unprivileged changes via a BEFORE UPDATE trigger
--     (handle_protect_is_admin) instead of a recursive RLS subquery.
--   - Add the service_role ALL policy + GRANT ALL.
--
-- CREATED: 2026-03-12
-- AUTHOR:  iiskills-cloud team
-- ============================================================

-- ── 1. Drop the broken UPDATE policy ─────────────────────────────────────────
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ── 2. Recreate UPDATE policy without the recursive subquery ─────────────────
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── 3. Add service_role ALL policy (idempotent) ───────────────────────────────
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

CREATE POLICY "Service role can manage all profiles"
  ON public.profiles FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- ── 4. Ensure SELECT / INSERT policies also scope to authenticated role ────────
-- (Idempotent: drop then recreate)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- ── 5. Trigger: protect is_admin from being changed by regular users ──────────
-- Replaces the recursive RLS subquery approach.  Service-role calls (e.g.
-- admin panel) set is_admin via direct SQL that runs outside the trigger guard
-- (pg_trigger_depth() > 0 or via a SECURITY DEFINER function).
CREATE OR REPLACE FUNCTION public.handle_protect_is_admin()
RETURNS trigger AS $$
BEGIN
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

-- ── 6. Grant service_role full table access ────────────────────────────────────
GRANT ALL ON public.profiles TO service_role;

COMMENT ON POLICY "Service role can manage all profiles" ON public.profiles IS
  'Service-role key (used by server-side Next.js APIs) bypasses RLS for all profile operations.';

COMMENT ON FUNCTION public.handle_protect_is_admin IS
  'Prevents is_admin from being changed via normal authenticated UPDATE. '
  'Replaces the former recursive WITH CHECK subquery in the RLS UPDATE policy.';
