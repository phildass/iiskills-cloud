-- ============================================
-- SEED DATA FOR APPS REGISTRY
-- ============================================
-- 
-- This file populates the apps registry with all 16 learning apps
-- in the iiskills.cloud platform.
--
-- CREATED: 2026-01-26
-- AUTHOR: iiskills-cloud team
--
-- PREREQUISITES: Run standardized_schema_v2.sql and helper_functions.sql first
--
-- ============================================

-- Insert all learning apps
-- Uses ON CONFLICT DO NOTHING to make this script idempotent
INSERT INTO public.apps (subdomain, display_name, description, category, features, status)
VALUES
  (
    'learn-ai',
    'AI Mastery',
    'Master Artificial Intelligence and Machine Learning',
    'Technology',
    '{"paywall": true, "certificates": true, "ai_assistant": true, "course_count": 0, "difficulty_levels": ["beginner", "intermediate", "advanced"]}'::JSONB,
    'active'
  ),
  (
    'learn-math',
    'Math Excellence',
    'Advanced Mathematics Learning',
    'Science',
    '{"paywall": true, "certificates": true, "practice_problems": true, "difficulty_levels": ["beginner", "intermediate", "advanced", "expert"]}'::JSONB,
    'active'
  ),
  (
    'learn-jee',
    'JEE Preparation',
    'Complete JEE (Joint Entrance Exam) Preparation',
    'Exam Prep',
    '{"paywall": true, "certificates": true, "mock_tests": true, "previous_years": true, "live_classes": false}'::JSONB,
    'active'
  ),
  (
    'learn-neet',
    'NEET Preparation',
    'Complete NEET (Medical Entrance) Exam Preparation',
    'Exam Prep',
    '{"paywall": true, "certificates": true, "mock_tests": true, "previous_years": true, "biology_focus": true}'::JSONB,
    'active'
  ),
  (
    'learn-cricket',
    'Cricket Knowledge',
    'Learn Cricket Inside Out - Rules, Strategies, and History',
    'Sports',
    '{"paywall": false, "certificates": false, "free_content": true, "video_tutorials": true}'::JSONB,
    'active'
  ),
  (
    'learn-physics',
    'Physics Mastery',
    'Advanced Physics Learning - From Fundamentals to Advanced Topics',
    'Science',
    '{"paywall": true, "certificates": true, "lab_simulations": true, "interactive_demos": true}'::JSONB,
    'active'
  ),
  (
    'learn-chemistry',
    'Chemistry Pro',
    'Master Chemistry Concepts - Organic, Inorganic, and Physical',
    'Science',
    '{"paywall": true, "certificates": true, "periodic_table": true, "reaction_simulator": true}'::JSONB,
    'active'
  ),
  (
    'learn-data-science',
    'Data Science',
    'Complete Data Science Path - From Basics to Advanced Analytics',
    'Technology',
    '{"paywall": true, "certificates": true, "hands_on_projects": true, "jupyter_notebooks": true, "datasets": true}'::JSONB,
    'active'
  ),
  (
    'learn-apt',
    'Aptitude Training',
    'Aptitude and Reasoning Skills Development',
    'Skills',
    '{"paywall": true, "certificates": true, "timed_tests": true, "competitive_exams": true}'::JSONB,
    'active'
  ),
  (
    'learn-ias',
    'IAS Preparation',
    'Civil Services Exam Preparation - UPSC IAS/IPS/IFS',
    'Exam Prep',
    '{"paywall": true, "certificates": true, "current_affairs": true, "essay_writing": true, "interview_prep": true}'::JSONB,
    'active'
  ),
  (
    'learn-govt-jobs',
    'Government Jobs',
    'Government Job Exam Preparation - SSC, Banking, Railways',
    'Exam Prep',
    '{"paywall": true, "certificates": true, "mock_tests": true, "notification_alerts": true}'::JSONB,
    'active'
  ),
  (
    'learn-leadership',
    'Leadership Skills',
    'Develop Leadership Capabilities and Management Skills',
    'Skills',
    '{"paywall": true, "certificates": true, "case_studies": true, "leadership_assessment": true}'::JSONB,
    'active'
  ),
  (
    'learn-management',
    'Management Training',
    'Business Management Skills - Strategy, Operations, and Leadership',
    'Business',
    '{"paywall": true, "certificates": true, "mba_prep": true, "business_simulations": true}'::JSONB,
    'active'
  ),
  (
    'learn-winning',
    'Winning Mindset',
    'Success and Personal Development - Mindset, Habits, and Growth',
    'Personal Dev',
    '{"paywall": false, "certificates": true, "motivational_content": true, "goal_tracking": true}'::JSONB,
    'active'
  ),
  (
    'learn-pr',
    'Public Relations',
    'PR and Communication Skills - Media, Branding, and Corporate Communication',
    'Business',
    '{"paywall": true, "certificates": true, "media_training": true, "crisis_management": true}'::JSONB,
    'active'
  ),
  (
    'learn-geography',
    'Geography Mastery',
    'World Geography and GIS - Physical, Political, and Economic Geography',
    'Science',
    '{"paywall": true, "certificates": true, "interactive_maps": true, "gis_tools": true, "map_quizzes": true}'::JSONB,
    'active'
  )
ON CONFLICT (subdomain) DO NOTHING;

-- ============================================
-- VERIFY INSERTION
-- ============================================

DO $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM public.apps;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'APPS REGISTRY SEED DATA COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total apps in registry: %', v_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Apps by category:';
  RAISE NOTICE '  • Technology: learn-ai, learn-data-science';
  RAISE NOTICE '  • Science: learn-math, learn-physics, learn-chemistry, learn-geography';
  RAISE NOTICE '  • Exam Prep: learn-jee, learn-neet, learn-ias, learn-govt-jobs';
  RAISE NOTICE '  • Skills: learn-apt, learn-leadership';
  RAISE NOTICE '  • Business: learn-management, learn-pr';
  RAISE NOTICE '  • Sports: learn-cricket';
  RAISE NOTICE '  • Personal Dev: learn-winning';
  RAISE NOTICE '';
  RAISE NOTICE '✓ All apps are set to "active" status';
  RAISE NOTICE '✓ Features configured per app (paywalls, certificates, etc.)';
  RAISE NOTICE '✓ Ready for production use!';
  RAISE NOTICE '========================================';
END $$;
