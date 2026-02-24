-- ============================================
-- HELPER FUNCTIONS FOR STANDARDIZED SCHEMA V2
-- ============================================
-- 
-- This file contains utility functions for working with the
-- standardized schema across all learning apps.
--
-- CREATED: 2026-01-26
-- AUTHOR: iiskills-cloud team
--
-- FUNCTIONS CREATED:
--   1. is_admin() - Check if current user is an admin
--   2. has_active_subscription() - Check user subscription status
--   3. get_user_progress_summary() - Get aggregated progress data
--   4. update_updated_at_column() - Trigger function for timestamps
--
-- PREREQUISITES: Run standardized_schema_v2.sql first
--
-- ============================================

-- ============================================
-- A. ENHANCED ADMIN CHECK FUNCTION
-- ============================================
-- Checks if the current authenticated user is an admin

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin() IS 'Returns true if the current user is an admin, false otherwise';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ============================================
-- B. SUBSCRIPTION CHECK FUNCTION
-- ============================================
-- Checks if user has an active subscription for a specific app or platform-wide

CREATE OR REPLACE FUNCTION public.has_active_subscription(p_app_subdomain TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = auth.uid()
      AND status = 'active'
      AND (app_subdomain = p_app_subdomain OR app_subdomain IS NULL)
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.has_active_subscription(TEXT) IS 'Returns true if user has an active subscription for the specified app or platform-wide. Pass NULL to check for any active subscription.';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.has_active_subscription(TEXT) TO authenticated;

-- ============================================
-- C. GET USER PROGRESS SUMMARY FUNCTION
-- ============================================
-- Returns aggregated progress statistics for the current user

CREATE OR REPLACE FUNCTION public.get_user_progress_summary(p_app_subdomain TEXT DEFAULT NULL)
RETURNS TABLE (
  app TEXT,
  total_items INTEGER,
  completed_items INTEGER,
  in_progress_items INTEGER,
  total_time_seconds BIGINT,
  completion_percentage DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    up.app_subdomain::TEXT,
    COUNT(*)::INTEGER,
    COUNT(*) FILTER (WHERE up.status = 'completed')::INTEGER,
    COUNT(*) FILTER (WHERE up.status = 'in_progress')::INTEGER,
    COALESCE(SUM(up.time_spent_seconds), 0)::BIGINT,
    ROUND(
      (COUNT(*) FILTER (WHERE up.status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0) * 100),
      2
    )
  FROM public.user_progress up
  WHERE up.user_id = auth.uid()
    AND (p_app_subdomain IS NULL OR up.app_subdomain = p_app_subdomain)
  GROUP BY up.app_subdomain;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_progress_summary(TEXT) IS 'Returns aggregated progress statistics for the current user across all apps or for a specific app';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_progress_summary(TEXT) TO authenticated;

-- ============================================
-- D. UPDATE UPDATED_AT TIMESTAMP FUNCTION
-- ============================================
-- Generic trigger function to update the updated_at column

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at_column() IS 'Trigger function to automatically update the updated_at timestamp';

-- ============================================
-- E. APPLY TRIGGERS TO NEW TABLES
-- ============================================

-- User Progress table
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON public.user_progress;
CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Subscriptions table
DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Content Library table
DROP TRIGGER IF EXISTS update_content_library_updated_at ON public.content_library;
CREATE TRIGGER update_content_library_updated_at
  BEFORE UPDATE ON public.content_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Apps table
DROP TRIGGER IF EXISTS update_apps_updated_at ON public.apps;
CREATE TRIGGER update_apps_updated_at
  BEFORE UPDATE ON public.apps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- F. CERTIFICATE NUMBER GENERATOR FUNCTION
-- ============================================
-- Generates unique certificate numbers in format: CERT-YYYY-APP-NNNNN

CREATE OR REPLACE FUNCTION public.generate_certificate_number(p_app_subdomain TEXT)
RETURNS TEXT AS $$
DECLARE
  v_year TEXT;
  v_app_code TEXT;
  v_sequence INTEGER;
  v_cert_number TEXT;
BEGIN
  -- Get current year
  v_year := TO_CHAR(CURRENT_DATE, 'YYYY');
  
  -- Get app code (first 3-4 letters of subdomain after 'learn-')
  v_app_code := UPPER(REPLACE(SUBSTRING(p_app_subdomain FROM 7), '-', ''));
  IF LENGTH(v_app_code) > 4 THEN
    v_app_code := SUBSTRING(v_app_code FROM 1 FOR 4);
  END IF;
  
  -- Get next sequence number for this app and year
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(certificate_number FROM LENGTH(certificate_number) - 4 FOR 5) AS INTEGER)
  ), 0) + 1
  INTO v_sequence
  FROM public.certificates
  WHERE app_subdomain = p_app_subdomain
    AND EXTRACT(YEAR FROM issue_date) = CAST(v_year AS INTEGER);
  
  -- Format: CERT-2026-AI-00123
  v_cert_number := FORMAT('CERT-%s-%s-%s', 
    v_year, 
    v_app_code, 
    LPAD(v_sequence::TEXT, 5, '0')
  );
  
  RETURN v_cert_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.generate_certificate_number(TEXT) IS 'Generates a unique certificate number in format CERT-YYYY-APP-NNNNN';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.generate_certificate_number(TEXT) TO authenticated;

-- ============================================
-- G. VERIFICATION CODE GENERATOR FUNCTION
-- ============================================
-- Generates unique 12-character verification codes for certificates

CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    -- Generate random 12-character alphanumeric code
    v_code := UPPER(
      SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12)
    );
    
    -- Check if code already exists
    SELECT EXISTS(
      SELECT 1 FROM public.certificates WHERE verification_code = v_code
    ) INTO v_exists;
    
    -- Exit loop if code is unique
    EXIT WHEN NOT v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.generate_verification_code() IS 'Generates a unique 12-character verification code for certificates';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.generate_verification_code() TO authenticated;

-- ============================================
-- H. UPDATE ENROLLMENT COUNT FUNCTION
-- ============================================
-- Updates course enrollment count when user progress is created

CREATE OR REPLACE FUNCTION public.update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if this is a course content type
  IF NEW.content_type = 'course' THEN
    UPDATE public.courses
    SET enrollment_count = enrollment_count + 1
    WHERE slug = NEW.content_slug OR id::TEXT = NEW.content_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_course_enrollment_count() IS 'Automatically updates course enrollment count when user starts a course';

-- Apply trigger
DROP TRIGGER IF EXISTS update_enrollment_on_progress ON public.user_progress;
CREATE TRIGGER update_enrollment_on_progress
  AFTER INSERT ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_course_enrollment_count();

-- ============================================
-- I. UPDATE CONTENT ACCESS COUNT FUNCTION
-- ============================================
-- Increments access count when content is viewed

CREATE OR REPLACE FUNCTION public.increment_content_access_count(p_content_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.content_library
  SET access_count = access_count + 1
  WHERE id = p_content_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.increment_content_access_count(UUID) IS 'Increments the access count for a content item';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.increment_content_access_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_content_access_count(UUID) TO anon;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'HELPER FUNCTIONS CREATED SUCCESSFULLY!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Functions available:';
  RAISE NOTICE '  ✓ is_admin() - Check admin status';
  RAISE NOTICE '  ✓ has_active_subscription() - Check subscription';
  RAISE NOTICE '  ✓ get_user_progress_summary() - Get progress stats';
  RAISE NOTICE '  ✓ generate_certificate_number() - Create cert numbers';
  RAISE NOTICE '  ✓ generate_verification_code() - Create verify codes';
  RAISE NOTICE '  ✓ update_updated_at_column() - Auto-update timestamps';
  RAISE NOTICE '  ✓ increment_content_access_count() - Track views';
  RAISE NOTICE '';
  RAISE NOTICE 'Triggers applied:';
  RAISE NOTICE '  ✓ Auto-update updated_at on 4 tables';
  RAISE NOTICE '  ✓ Auto-update enrollment count';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Run seed_apps_data.sql';
  RAISE NOTICE '========================================';
END $$;
