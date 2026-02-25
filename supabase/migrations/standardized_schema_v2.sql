-- ============================================
-- STANDARDIZED MULTI-APP SUPABASE SCHEMA V2
-- ============================================
-- 
-- This migration creates a comprehensive, standardized database schema
-- that allows all 15+ learning apps to work seamlessly with shared
-- user data, progress tracking, certificates, subscriptions, and analytics.
--
-- CREATED: 2026-01-26
-- AUTHOR: iiskills-cloud team
-- 
-- TABLES CREATED:
--   1. public.apps - Centralized registry of all learning apps
--   2. public.user_progress - Track user progress across all apps
--   3. public.certificates - Standardized certificate issuance
--   4. public.subscriptions - Centralized payment tracking
--   5. public.analytics_events - User behavior tracking
--   6. public.content_library - Shared resources across apps
--
-- TABLES ENHANCED:
--   1. public.profiles - Added app preferences and last visited tracking
--   2. public.courses - Added instructor, difficulty, and rating fields
--
-- RUN ORDER: Run this file first, then helper_functions.sql, then seed_apps_data.sql
--
-- ============================================

-- ============================================
-- A. APPS REGISTRY TABLE
-- ============================================
-- Centralized registry of all learning apps/subdomains

CREATE TABLE IF NOT EXISTS public.apps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subdomain TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon_url TEXT,
  theme_colors JSONB DEFAULT '{}',
  features JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'deprecated')),
  domain TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_apps_subdomain ON public.apps(subdomain);
CREATE INDEX IF NOT EXISTS idx_apps_status ON public.apps(status);

-- Add helpful comments
COMMENT ON TABLE public.apps IS 'Centralized registry of all learning apps and subdomains in the iiskills.cloud platform';
COMMENT ON COLUMN public.apps.subdomain IS 'Unique subdomain identifier (e.g., learn-ai, learn-math)';
COMMENT ON COLUMN public.apps.display_name IS 'Human-readable name shown in UI';
COMMENT ON COLUMN public.apps.theme_colors IS 'JSONB object containing theme color definitions';
COMMENT ON COLUMN public.apps.features IS 'JSONB object containing enabled features (paywall, certificates, etc.)';
COMMENT ON COLUMN public.apps.status IS 'Current status: active, maintenance, or deprecated';

-- Enable Row Level Security
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access to apps" ON public.apps;
DROP POLICY IF EXISTS "Admin full access to apps" ON public.apps;

-- Public can read all apps (for app discovery)
CREATE POLICY "Public read access to apps" ON public.apps
  FOR SELECT 
  USING (true);

-- Only admins can modify apps
CREATE POLICY "Admin full access to apps" ON public.apps
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- B. USER PROGRESS TABLE
-- ============================================
-- Track user progress across all apps uniformly

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_subdomain TEXT NOT NULL,
  content_type TEXT NOT NULL,
  content_id TEXT NOT NULL,
  content_slug TEXT,
  progress_percentage DECIMAL(5,2) DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
  time_spent_seconds BIGINT DEFAULT 0,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, app_subdomain, content_type, content_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_app_subdomain ON public.user_progress(app_subdomain);
CREATE INDEX IF NOT EXISTS idx_user_progress_status ON public.user_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_progress_last_accessed ON public.user_progress(last_accessed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_composite ON public.user_progress(user_id, app_subdomain, status);

-- Add helpful comments
COMMENT ON TABLE public.user_progress IS 'Tracks user progress across all learning apps uniformly';
COMMENT ON COLUMN public.user_progress.content_type IS 'Type of content (e.g., course, module, lesson, quiz)';
COMMENT ON COLUMN public.user_progress.content_id IS 'Unique identifier of the content item';
COMMENT ON COLUMN public.user_progress.progress_percentage IS 'Completion percentage from 0 to 100';
COMMENT ON COLUMN public.user_progress.time_spent_seconds IS 'Total time spent in seconds';
COMMENT ON COLUMN public.user_progress.metadata IS 'Additional tracking data (quiz scores, notes, etc.)';

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;

-- Users can only access their own progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- C. CERTIFICATES TABLE
-- ============================================
-- Standardized certificate issuance across all apps

CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_subdomain TEXT NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title TEXT NOT NULL,
  user_name TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
  completion_date DATE NOT NULL,
  pdf_url TEXT,
  verification_code TEXT UNIQUE NOT NULL,
  grade TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON public.certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_certificates_app_subdomain ON public.certificates(app_subdomain);
CREATE INDEX IF NOT EXISTS idx_certificates_verification_code ON public.certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_certificates_certificate_number ON public.certificates(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(status);

-- Add helpful comments
COMMENT ON TABLE public.certificates IS 'Standardized certificate issuance across all learning apps';
COMMENT ON COLUMN public.certificates.certificate_number IS 'Unique certificate number (e.g., CERT-2026-AI-00123)';
COMMENT ON COLUMN public.certificates.verification_code IS 'Unique code for public verification';
COMMENT ON COLUMN public.certificates.pdf_url IS 'URL to downloadable PDF certificate';
COMMENT ON COLUMN public.certificates.metadata IS 'Additional certificate data (skills, topics covered, etc.)';

-- Enable Row Level Security
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own certificates" ON public.certificates;
DROP POLICY IF EXISTS "Public can verify certificates by code" ON public.certificates;

-- Users can view their own certificates
CREATE POLICY "Users can view own certificates" ON public.certificates
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Public can verify certificates using verification code
CREATE POLICY "Public can verify certificates by code" ON public.certificates
  FOR SELECT 
  USING (true);

-- ============================================
-- D. SUBSCRIPTIONS TABLE
-- ============================================
-- Centralized payment tracking for all apps

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  app_subdomain TEXT,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'monthly', 'yearly', 'lifetime')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
  starts_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ,
  payment_provider TEXT,
  payment_id TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  features JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_app_subdomain ON public.subscriptions(app_subdomain);
CREATE INDEX IF NOT EXISTS idx_subscriptions_expires_at ON public.subscriptions(expires_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_active ON public.subscriptions(user_id, status, expires_at) WHERE status = 'active';

-- Add helpful comments
COMMENT ON TABLE public.subscriptions IS 'Centralized payment and subscription tracking for all apps';
COMMENT ON COLUMN public.subscriptions.app_subdomain IS 'App-specific subscription, or NULL for platform-wide access';
COMMENT ON COLUMN public.subscriptions.plan_type IS 'Type of subscription plan';
COMMENT ON COLUMN public.subscriptions.expires_at IS 'Expiration date (NULL for lifetime plans)';
COMMENT ON COLUMN public.subscriptions.features IS 'JSONB object of enabled features for this subscription';
COMMENT ON COLUMN public.subscriptions.metadata IS 'Additional subscription data (coupon codes, referrals, etc.)';

-- Enable Row Level Security
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT 
  USING (auth.uid() = user_id);

-- ============================================
-- E. ANALYTICS EVENTS TABLE
-- ============================================
-- Track user behavior across all apps

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  app_subdomain TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_category TEXT,
  event_data JSONB DEFAULT '{}',
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_app_event_time ON public.analytics_events(app_subdomain, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user_time ON public.analytics_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON public.analytics_events(session_id);

-- Add helpful comments
COMMENT ON TABLE public.analytics_events IS 'Tracks user behavior and events across all learning apps';
COMMENT ON COLUMN public.analytics_events.event_type IS 'Type of event (page_view, video_watched, quiz_completed, etc.)';
COMMENT ON COLUMN public.analytics_events.event_category IS 'Category grouping (engagement, conversion, etc.)';
COMMENT ON COLUMN public.analytics_events.event_data IS 'Additional event-specific data';

-- Enable Row Level Security
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert analytics events" ON public.analytics_events;

-- Allow public inserts only (for tracking anonymous users)
CREATE POLICY "Public can insert analytics events" ON public.analytics_events
  FOR INSERT 
  WITH CHECK (true);

-- ============================================
-- F. CONTENT LIBRARY TABLE
-- ============================================
-- Shared resources across multiple apps

CREATE TABLE IF NOT EXISTS public.content_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  mime_type TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  allowed_apps TEXT[] DEFAULT '{}',
  uploader_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  access_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_library_content_type ON public.content_library(content_type);
CREATE INDEX IF NOT EXISTS idx_content_library_tags ON public.content_library USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_content_library_allowed_apps ON public.content_library USING GIN(allowed_apps);
CREATE INDEX IF NOT EXISTS idx_content_library_uploader ON public.content_library(uploader_id);

-- Add helpful comments
COMMENT ON TABLE public.content_library IS 'Shared resources and content across multiple learning apps';
COMMENT ON COLUMN public.content_library.content_type IS 'Type of content (video, pdf, audio, image, etc.)';
COMMENT ON COLUMN public.content_library.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN public.content_library.allowed_apps IS 'Array of app subdomains that can access this content';
COMMENT ON COLUMN public.content_library.access_count IS 'Number of times content has been accessed';

-- Enable Row Level Security
ALTER TABLE public.content_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public content is viewable by everyone" ON public.content_library;
DROP POLICY IF EXISTS "Users can view content for their apps" ON public.content_library;

-- Public content is viewable by everyone
CREATE POLICY "Public content is viewable by everyone" ON public.content_library
  FOR SELECT 
  USING (is_public = true);

-- Authenticated users can view content (RLS will be refined by app logic)
CREATE POLICY "Users can view content for their apps" ON public.content_library
  FOR SELECT 
  USING (auth.uid() IS NOT NULL);

-- ============================================
-- G. ENHANCE PROFILES TABLE
-- ============================================
-- Add app preferences and tracking

DO $$ 
BEGIN
  -- Add columns if they don't exist
  ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS app_preferences JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS last_visited_app TEXT,
    ADD COLUMN IF NOT EXISTS last_visited_at TIMESTAMPTZ;
  
  RAISE NOTICE 'Enhanced profiles table with app preferences and tracking';
EXCEPTION
  WHEN duplicate_column THEN
    RAISE NOTICE 'Columns already exist in profiles table, skipping...';
END $$;

-- Add index for last visited app
CREATE INDEX IF NOT EXISTS idx_profiles_last_visited_app ON public.profiles(last_visited_app);

-- Add comments
COMMENT ON COLUMN public.profiles.app_preferences IS 'JSONB object storing user preferences per app';
COMMENT ON COLUMN public.profiles.last_visited_app IS 'Subdomain of the last visited app';
COMMENT ON COLUMN public.profiles.last_visited_at IS 'Timestamp of last app visit';

-- ============================================
-- H. ENHANCE COURSES TABLE
-- ============================================
-- Add instructor, difficulty, and rating fields

DO $$ 
BEGIN
  -- Add columns if they don't exist
  ALTER TABLE public.courses
    ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES auth.users(id),
    ADD COLUMN IF NOT EXISTS instructor_name TEXT,
    ADD COLUMN IF NOT EXISTS difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(5,2),
    ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
    ADD COLUMN IF NOT EXISTS prerequisites TEXT[],
    ADD COLUMN IF NOT EXISTS learning_outcomes TEXT[],
    ADD COLUMN IF NOT EXISTS certificate_enabled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2),
    ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
  
  RAISE NOTICE 'Enhanced courses table with instructor and rating fields';
EXCEPTION
  WHEN duplicate_column THEN
    RAISE NOTICE 'Columns already exist in courses table, skipping...';
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_subdomain_enhanced ON public.courses(subdomain);
CREATE INDEX IF NOT EXISTS idx_courses_difficulty ON public.courses(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_courses_rating ON public.courses(rating DESC) WHERE rating IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON public.courses(instructor_id);

-- Add comments
COMMENT ON COLUMN public.courses.instructor_id IS 'Reference to user who created/teaches the course';
COMMENT ON COLUMN public.courses.difficulty_level IS 'Course difficulty: beginner, intermediate, advanced, or expert';
COMMENT ON COLUMN public.courses.estimated_hours IS 'Estimated time to complete in hours';
COMMENT ON COLUMN public.courses.prerequisites IS 'Array of prerequisite topics or courses';
COMMENT ON COLUMN public.courses.learning_outcomes IS 'Array of expected learning outcomes';
COMMENT ON COLUMN public.courses.certificate_enabled IS 'Whether course offers a certificate upon completion';
COMMENT ON COLUMN public.courses.enrollment_count IS 'Total number of enrollments';
COMMENT ON COLUMN public.courses.rating IS 'Average rating (0-5 scale)';
COMMENT ON COLUMN public.courses.review_count IS 'Total number of reviews';

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'STANDARDIZED SCHEMA V2 MIGRATION COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  ✓ public.apps (centralized app registry)';
  RAISE NOTICE '  ✓ public.user_progress (progress tracking)';
  RAISE NOTICE '  ✓ public.certificates (certificate management)';
  RAISE NOTICE '  ✓ public.subscriptions (payment tracking)';
  RAISE NOTICE '  ✓ public.analytics_events (behavior tracking)';
  RAISE NOTICE '  ✓ public.content_library (shared resources)';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables enhanced:';
  RAISE NOTICE '  ✓ public.profiles (app preferences added)';
  RAISE NOTICE '  ✓ public.courses (instructor & ratings added)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Run helper_functions.sql for utility functions';
  RAISE NOTICE '  2. Run seed_apps_data.sql to populate app registry';
  RAISE NOTICE '========================================';
END $$;
