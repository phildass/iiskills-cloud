-- ============================================
-- VALIDATION SCRIPT FOR SCHEMA V2
-- ============================================
-- 
-- Run this script in Supabase SQL Editor after running all migrations
-- to verify everything was created correctly.
--
-- All checks should return the expected count/result.
--
-- ============================================

-- Check 1: Verify all tables exist
SELECT 
  'Tables Check' AS check_name,
  COUNT(*) AS found,
  8 AS expected,
  CASE WHEN COUNT(*) = 8 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'apps', 
    'user_progress', 
    'certificates', 
    'subscriptions', 
    'analytics_events', 
    'content_library',
    'profiles',
    'courses'
  );

-- Check 2: Verify apps were seeded
SELECT 
  'Apps Seeded' AS check_name,
  COUNT(*) AS found,
  16 AS expected,
  CASE WHEN COUNT(*) >= 16 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM public.apps;

-- Check 3: Verify helper functions exist
SELECT 
  'Helper Functions' AS check_name,
  COUNT(*) AS found,
  8 AS expected,
  CASE WHEN COUNT(*) >= 8 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_admin',
    'has_active_subscription',
    'get_user_progress_summary',
    'generate_certificate_number',
    'generate_verification_code',
    'update_updated_at_column',
    'increment_content_access_count',
    'update_course_enrollment_count'
  );

-- Check 4: Verify RLS is enabled
SELECT 
  'RLS Enabled' AS check_name,
  COUNT(*) AS found,
  8 AS expected,
  CASE WHEN COUNT(*) = 8 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'apps',
    'user_progress',
    'certificates',
    'subscriptions',
    'analytics_events',
    'content_library',
    'profiles',
    'courses'
  )
  AND rowsecurity = true;

-- Check 5: Verify indexes exist
SELECT 
  'Indexes Created' AS check_name,
  COUNT(*) AS found,
  29 AS expected_minimum,
  CASE WHEN COUNT(*) >= 29 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'apps',
    'user_progress',
    'certificates',
    'subscriptions',
    'analytics_events',
    'content_library'
  );

-- Check 6: Verify new columns in profiles
SELECT 
  'Profiles Enhanced' AS check_name,
  COUNT(*) AS found,
  3 AS expected,
  CASE WHEN COUNT(*) = 3 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name IN (
    'app_preferences',
    'last_visited_app',
    'last_visited_at'
  );

-- Check 7: Verify new columns in courses
SELECT 
  'Courses Enhanced' AS check_name,
  COUNT(*) AS found,
  11 AS expected,
  CASE WHEN COUNT(*) = 11 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'courses'
  AND column_name IN (
    'instructor_id',
    'instructor_name',
    'difficulty_level',
    'estimated_hours',
    'language',
    'prerequisites',
    'learning_outcomes',
    'certificate_enabled',
    'enrollment_count',
    'rating',
    'review_count'
  );

-- Check 8: Verify triggers exist
SELECT 
  'Triggers Created' AS check_name,
  COUNT(*) AS found,
  5 AS expected_minimum,
  CASE WHEN COUNT(*) >= 5 THEN '✓ PASS' ELSE '✗ FAIL' END AS status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND trigger_name LIKE '%updated_at%';

-- ============================================
-- DETAILED TABLE INFORMATION
-- ============================================

-- List all apps in registry
SELECT 
  subdomain,
  display_name,
  category,
  status,
  features->>'paywall' AS has_paywall,
  features->>'certificates' AS has_certificates
FROM public.apps
ORDER BY category, subdomain;

-- Show table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'apps',
    'user_progress',
    'certificates',
    'subscriptions',
    'analytics_events',
    'content_library',
    'profiles',
    'courses'
  )
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
DECLARE
  v_tables_count INTEGER;
  v_apps_count INTEGER;
  v_functions_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_tables_count
  FROM information_schema.tables 
  WHERE table_schema = 'public'
    AND table_name IN ('apps', 'user_progress', 'certificates', 'subscriptions', 'analytics_events', 'content_library');
  
  SELECT COUNT(*) INTO v_apps_count FROM public.apps;
  
  SELECT COUNT(*) INTO v_functions_count
  FROM information_schema.routines 
  WHERE routine_schema = 'public'
    AND routine_name IN ('is_admin', 'has_active_subscription', 'get_user_progress_summary');
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VALIDATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables found: % (expected: 6)', v_tables_count;
  RAISE NOTICE 'Apps seeded: % (expected: 16)', v_apps_count;
  RAISE NOTICE 'Functions found: % (expected: 3+)', v_functions_count;
  RAISE NOTICE '';
  
  IF v_tables_count = 6 AND v_apps_count >= 16 AND v_functions_count >= 3 THEN
    RAISE NOTICE '✓ ALL CHECKS PASSED!';
    RAISE NOTICE 'Your schema v2 migration is complete and ready to use.';
  ELSE
    RAISE NOTICE '✗ SOME CHECKS FAILED!';
    RAISE NOTICE 'Please review the validation results above.';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
