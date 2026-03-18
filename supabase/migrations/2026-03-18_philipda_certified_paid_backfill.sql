-- ---------------------------------------------------------------------------
-- Migration: 2026-03-18_philipda_certified_paid_backfill.sql
--
-- Backfills is_certified_paid_user = true for the philipda@gmail.com test
-- account so that is_certified_paid_user logic (Priority 3 in hasAppAccess)
-- correctly bypasses the per-lesson paywall for all paid apps.
--
-- Only updates rows where is_certified_paid_user is currently false to avoid
-- overwriting any already-corrected records.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Resolve user UUID from auth.users by email
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'philipda@gmail.com'
  LIMIT 1;

  IF v_user_id IS NULL THEN
    RAISE NOTICE 'philipda@gmail.com not found in auth.users — skipping backfill.';
    RETURN;
  END IF;

  RAISE NOTICE 'Backfilling is_certified_paid_user for user_id=%', v_user_id;

  -- Update existing active paid-app access rows
  UPDATE public.user_app_access
  SET
    is_certified_paid_user = true,
    entitlement_type       = 'annual_paid',
    updated_at             = NOW()
  WHERE user_id  = v_user_id
    AND app_id   IN ('learn-ai', 'learn-developer', 'learn-management', 'learn-pr')
    AND is_active = true
    AND is_certified_paid_user = false;

  -- Insert missing rows for any paid app the user doesn't yet have a record for
  INSERT INTO public.user_app_access
    (user_id, app_id, granted_via, is_active, is_certified_paid_user, entitlement_type,
     expires_at, access_granted_at)
  SELECT
    v_user_id,
    app_id,
    'admin',
    true,
    true,
    'annual_paid',
    (NOW() + INTERVAL '1 year'),
    NOW()
  FROM (VALUES
    ('learn-ai'),
    ('learn-developer'),
    ('learn-management'),
    ('learn-pr')
  ) AS paid_apps(app_id)
  WHERE NOT EXISTS (
    SELECT 1 FROM public.user_app_access uaa
    WHERE uaa.user_id = v_user_id
      AND uaa.app_id  = paid_apps.app_id
      AND uaa.is_active = true
  );

  RAISE NOTICE 'Backfill complete for philipda@gmail.com (user_id=%).',  v_user_id;
END;
$$;
