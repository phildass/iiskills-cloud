-- ============================================
-- DUAL-APP SYNC SYSTEM FOR LEARN-DEVELOPER & LEARN-AI
-- ============================================
-- 
-- This migration creates tables and functions to enable cross-app
-- synchronization between learn-developer and learn-ai apps.
-- 
-- FEATURES:
--   1. Shared/bridge modules that unlock in both apps
--   2. Cross-app progress tracking and sync
--   3. Universal certification for completing both apps
--   4. 30% pass-gate auto-unlock mechanism
--
-- CREATED: 2026-02-06
-- AUTHOR: iiskills-cloud dual-app team
-- 
-- RUN ORDER: Run after standardized_schema_v2.sql
--
-- ============================================

-- ============================================
-- A. SYNC MODULES TABLE
-- ============================================
-- Defines which modules are shared/synced between apps

CREATE TABLE IF NOT EXISTS public.sync_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT UNIQUE NOT NULL,
  description TEXT,
  dev_module_id TEXT NOT NULL,
  ai_module_id TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('shared', 'bridge')),
  unlock_threshold DECIMAL(5,2) DEFAULT 30.00 CHECK (unlock_threshold >= 0 AND unlock_threshold <= 100),
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sync_modules_category ON public.sync_modules(category);
CREATE INDEX IF NOT EXISTS idx_sync_modules_active ON public.sync_modules(is_active);
CREATE INDEX IF NOT EXISTS idx_sync_modules_dev_module ON public.sync_modules(dev_module_id);
CREATE INDEX IF NOT EXISTS idx_sync_modules_ai_module ON public.sync_modules(ai_module_id);

-- Comments
COMMENT ON TABLE public.sync_modules IS 'Defines shared/bridge modules that sync between learn-developer and learn-ai apps';
COMMENT ON COLUMN public.sync_modules.category IS 'Type: shared (available in both) or bridge (cross-app integration)';
COMMENT ON COLUMN public.sync_modules.unlock_threshold IS 'Percentage threshold to unlock related content in sibling app';
COMMENT ON COLUMN public.sync_modules.dev_module_id IS 'Module ID in learn-developer app';
COMMENT ON COLUMN public.sync_modules.ai_module_id IS 'Module ID in learn-ai app';

-- Enable Row Level Security
ALTER TABLE public.sync_modules ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read sync modules" ON public.sync_modules
  FOR SELECT 
  USING (true);

-- Only admins can modify
CREATE POLICY "Admin full access to sync modules" ON public.sync_modules
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
-- B. CROSS APP UNLOCKS TABLE
-- ============================================
-- Tracks when content is auto-unlocked in sibling app

CREATE TABLE IF NOT EXISTS public.cross_app_unlocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source_app TEXT NOT NULL CHECK (source_app IN ('learn-developer', 'learn-ai')),
  target_app TEXT NOT NULL CHECK (target_app IN ('learn-developer', 'learn-ai')),
  source_content_id TEXT NOT NULL,
  target_content_id TEXT NOT NULL,
  unlock_reason TEXT NOT NULL CHECK (unlock_reason IN ('module_completion', 'pass_gate_30', 'sync_module', 'manual_override')),
  source_progress_percentage DECIMAL(5,2),
  unlocked_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, source_app, target_app, source_content_id, target_content_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cross_unlocks_user ON public.cross_app_unlocks(user_id);
CREATE INDEX IF NOT EXISTS idx_cross_unlocks_target ON public.cross_app_unlocks(target_app, target_content_id);
CREATE INDEX IF NOT EXISTS idx_cross_unlocks_source ON public.cross_app_unlocks(source_app, source_content_id);
CREATE INDEX IF NOT EXISTS idx_cross_unlocks_reason ON public.cross_app_unlocks(unlock_reason);

-- Comments
COMMENT ON TABLE public.cross_app_unlocks IS 'Tracks auto-unlocked content in sibling app based on progress';
COMMENT ON COLUMN public.cross_app_unlocks.unlock_reason IS 'Reason for unlock: module_completion, pass_gate_30, sync_module, or manual_override';
COMMENT ON COLUMN public.cross_app_unlocks.source_progress_percentage IS 'User progress percentage when unlock was triggered';

-- Enable Row Level Security
ALTER TABLE public.cross_app_unlocks ENABLE ROW LEVEL SECURITY;

-- Users can view own unlocks
CREATE POLICY "Users can view own unlocks" ON public.cross_app_unlocks
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert own unlocks (via app logic)
CREATE POLICY "Users can insert own unlocks" ON public.cross_app_unlocks
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- C. UNIVERSAL CERTIFICATES TABLE
-- ============================================
-- Tracks completion of BOTH apps for Universal Technical Lead certificate

CREATE TABLE IF NOT EXISTS public.universal_certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  certificate_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  dev_certificate_id UUID REFERENCES public.certificates(id),
  ai_certificate_id UUID REFERENCES public.certificates(id),
  dev_completion_date DATE,
  ai_completion_date DATE,
  issue_date DATE DEFAULT CURRENT_DATE NOT NULL,
  pdf_url TEXT,
  verification_code TEXT UNIQUE NOT NULL,
  grade_dev TEXT,
  grade_ai TEXT,
  combined_grade TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_universal_certs_user ON public.universal_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_universal_certs_verification ON public.universal_certificates(verification_code);
CREATE INDEX IF NOT EXISTS idx_universal_certs_status ON public.universal_certificates(status);

-- Comments
COMMENT ON TABLE public.universal_certificates IS 'Universal Technical Lead certificates for completing both learn-developer and learn-ai';
COMMENT ON COLUMN public.universal_certificates.combined_grade IS 'Combined achievement grade across both apps';

-- Enable Row Level Security
ALTER TABLE public.universal_certificates ENABLE ROW LEVEL SECURITY;

-- Users can view own certificates
CREATE POLICY "Users can view own universal certificates" ON public.universal_certificates
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Public can verify certificates
CREATE POLICY "Public can verify universal certificates" ON public.universal_certificates
  FOR SELECT 
  USING (true);

-- ============================================
-- D. MENTOR MODE TRACKING
-- ============================================
-- Tracks users who unlock mentor mode (30%+ in both apps)

CREATE TABLE IF NOT EXISTS public.mentor_mode (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  dev_progress_percentage DECIMAL(5,2) DEFAULT 0,
  ai_progress_percentage DECIMAL(5,2) DEFAULT 0,
  is_mentor_active BOOLEAN DEFAULT false,
  mentor_since TIMESTAMPTZ,
  helped_users_count INTEGER DEFAULT 0,
  mentor_rating DECIMAL(3,2),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_mentor_mode_user ON public.mentor_mode(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_mode_active ON public.mentor_mode(is_mentor_active) WHERE is_mentor_active = true;
CREATE INDEX IF NOT EXISTS idx_mentor_mode_rating ON public.mentor_mode(mentor_rating DESC NULLS LAST);

-- Comments
COMMENT ON TABLE public.mentor_mode IS 'Tracks users who achieved mentor status by completing 30%+ in both apps';
COMMENT ON COLUMN public.mentor_mode.is_mentor_active IS 'Mentor mode activated when both apps reach 30% or more';

-- Enable Row Level Security
ALTER TABLE public.mentor_mode ENABLE ROW LEVEL SECURITY;

-- Users can view own mentor status
CREATE POLICY "Users can view own mentor status" ON public.mentor_mode
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can view active mentors
CREATE POLICY "Users can view active mentors" ON public.mentor_mode
  FOR SELECT 
  USING (is_mentor_active = true);

-- Users can insert/update own mentor status
CREATE POLICY "Users can manage own mentor status" ON public.mentor_mode
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- E. FUNCTIONS FOR CROSS-APP SYNC
-- ============================================

-- Function to check if content should be unlocked in sibling app
CREATE OR REPLACE FUNCTION public.check_cross_app_unlock(
  p_user_id UUID,
  p_source_app TEXT,
  p_content_id TEXT,
  p_progress_percentage DECIMAL
)
RETURNS JSONB AS $$
DECLARE
  v_target_app TEXT;
  v_sync_module RECORD;
  v_unlock_needed BOOLEAN := false;
  v_result JSONB;
BEGIN
  -- Determine target app
  v_target_app := CASE 
    WHEN p_source_app = 'learn-developer' THEN 'learn-ai'
    WHEN p_source_app = 'learn-ai' THEN 'learn-developer'
  END;
  
  -- Check if this is a sync module
  IF p_source_app = 'learn-developer' THEN
    SELECT * INTO v_sync_module FROM public.sync_modules 
    WHERE dev_module_id = p_content_id AND is_active = true;
  ELSE
    SELECT * INTO v_sync_module FROM public.sync_modules 
    WHERE ai_module_id = p_content_id AND is_active = true;
  END IF;
  
  -- If it's a sync module and threshold is met
  IF v_sync_module.id IS NOT NULL AND p_progress_percentage >= v_sync_module.unlock_threshold THEN
    v_unlock_needed := true;
    
    -- Insert unlock record if not already exists
    INSERT INTO public.cross_app_unlocks (
      user_id, source_app, target_app, source_content_id, target_content_id,
      unlock_reason, source_progress_percentage, metadata
    )
    VALUES (
      p_user_id, p_source_app, v_target_app, p_content_id,
      CASE WHEN p_source_app = 'learn-developer' THEN v_sync_module.ai_module_id ELSE v_sync_module.dev_module_id END,
      CASE WHEN p_progress_percentage >= 100 THEN 'module_completion' ELSE 'pass_gate_30' END,
      p_progress_percentage,
      jsonb_build_object('sync_module_name', v_sync_module.module_name)
    )
    ON CONFLICT (user_id, source_app, target_app, source_content_id, target_content_id) 
    DO UPDATE SET 
      source_progress_percentage = EXCLUDED.source_progress_percentage,
      metadata = EXCLUDED.metadata;
  END IF;
  
  v_result := jsonb_build_object(
    'unlock_needed', v_unlock_needed,
    'target_app', v_target_app,
    'sync_module', CASE WHEN v_sync_module.id IS NOT NULL THEN 
      jsonb_build_object('name', v_sync_module.module_name, 'category', v_sync_module.category)
    ELSE NULL END
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.check_cross_app_unlock(UUID, TEXT, TEXT, DECIMAL) IS 'Checks and creates cross-app unlock when threshold is met';
GRANT EXECUTE ON FUNCTION public.check_cross_app_unlock(UUID, TEXT, TEXT, DECIMAL) TO authenticated;

-- Function to update mentor mode status
CREATE OR REPLACE FUNCTION public.update_mentor_mode_status(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_dev_progress DECIMAL;
  v_ai_progress DECIMAL;
  v_is_mentor BOOLEAN := false;
BEGIN
  -- Calculate average progress in learn-developer
  SELECT COALESCE(AVG(progress_percentage), 0) INTO v_dev_progress
  FROM public.user_progress
  WHERE user_id = p_user_id 
    AND app_subdomain = 'learn-developer'
    AND content_type = 'module';
  
  -- Calculate average progress in learn-ai
  SELECT COALESCE(AVG(progress_percentage), 0) INTO v_ai_progress
  FROM public.user_progress
  WHERE user_id = p_user_id 
    AND app_subdomain = 'learn-ai'
    AND content_type = 'module';
  
  -- Check if mentor status should be activated (30% in both)
  v_is_mentor := (v_dev_progress >= 30 AND v_ai_progress >= 30);
  
  -- Insert or update mentor mode record
  INSERT INTO public.mentor_mode (
    user_id, dev_progress_percentage, ai_progress_percentage, is_mentor_active, mentor_since
  )
  VALUES (
    p_user_id, v_dev_progress, v_ai_progress, v_is_mentor,
    CASE WHEN v_is_mentor THEN NOW() ELSE NULL END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    dev_progress_percentage = EXCLUDED.dev_progress_percentage,
    ai_progress_percentage = EXCLUDED.ai_progress_percentage,
    is_mentor_active = EXCLUDED.is_mentor_active,
    mentor_since = CASE 
      WHEN NOT mentor_mode.is_mentor_active AND EXCLUDED.is_mentor_active THEN NOW()
      WHEN mentor_mode.is_mentor_active AND NOT EXCLUDED.is_mentor_active THEN NULL
      ELSE mentor_mode.mentor_since
    END,
    updated_at = NOW();
  
  RETURN v_is_mentor;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_mentor_mode_status(UUID) IS 'Updates mentor mode status based on progress in both apps';
GRANT EXECUTE ON FUNCTION public.update_mentor_mode_status(UUID) TO authenticated;

-- Function to get combined progress across both apps
CREATE OR REPLACE FUNCTION public.get_dual_app_progress(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_result JSONB;
  v_dev_modules_completed INTEGER;
  v_ai_modules_completed INTEGER;
  v_dev_avg_progress DECIMAL;
  v_ai_avg_progress DECIMAL;
  v_unlocks_count INTEGER;
BEGIN
  -- Get learn-developer stats
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COALESCE(AVG(progress_percentage), 0)
  INTO v_dev_modules_completed, v_dev_avg_progress
  FROM public.user_progress
  WHERE user_id = p_user_id 
    AND app_subdomain = 'learn-developer'
    AND content_type = 'module';
  
  -- Get learn-ai stats
  SELECT 
    COUNT(*) FILTER (WHERE status = 'completed'),
    COALESCE(AVG(progress_percentage), 0)
  INTO v_ai_modules_completed, v_ai_avg_progress
  FROM public.user_progress
  WHERE user_id = p_user_id 
    AND app_subdomain = 'learn-ai'
    AND content_type = 'module';
  
  -- Get cross-app unlocks count
  SELECT COUNT(*) INTO v_unlocks_count
  FROM public.cross_app_unlocks
  WHERE user_id = p_user_id;
  
  v_result := jsonb_build_object(
    'learn_developer', jsonb_build_object(
      'modules_completed', v_dev_modules_completed,
      'average_progress', v_dev_avg_progress
    ),
    'learn_ai', jsonb_build_object(
      'modules_completed', v_ai_modules_completed,
      'average_progress', v_ai_avg_progress
    ),
    'cross_app_unlocks', v_unlocks_count,
    'combined_progress', (v_dev_avg_progress + v_ai_avg_progress) / 2,
    'mentor_eligible', (v_dev_avg_progress >= 30 AND v_ai_avg_progress >= 30)
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_dual_app_progress(UUID) IS 'Returns combined progress statistics across both learn-developer and learn-ai apps';
GRANT EXECUTE ON FUNCTION public.get_dual_app_progress(UUID) TO authenticated;

-- ============================================
-- F. SEED INITIAL SYNC MODULES
-- ============================================
-- Populate the sync modules for shared content

INSERT INTO public.sync_modules (module_name, description, dev_module_id, ai_module_id, category, unlock_threshold) VALUES
  ('Logic & Algorithms', 'Fundamental logic and algorithmic thinking - shared across code and AI', 'logic-algorithms', 'logic-algorithms', 'shared', 30.00),
  ('Data Structures', 'Arrays, lists, objects, and how both code and AI models use memory structures', 'data-structures', 'data-structures', 'shared', 30.00),
  ('API Management', 'Building, consuming, and managing APIs in development and AI integrations', 'api-management', 'api-management', 'shared', 30.00)
ON CONFLICT (module_name) DO NOTHING;

-- ============================================
-- G. UPDATE TRIGGERS
-- ============================================

-- Trigger to automatically update mentor mode when progress changes
CREATE OR REPLACE FUNCTION public.auto_update_mentor_mode()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update if the change is in learn-developer or learn-ai
  IF NEW.app_subdomain IN ('learn-developer', 'learn-ai') THEN
    PERFORM public.update_mentor_mode_status(NEW.user_id);
  END IF;
  
  -- Check for cross-app unlock
  IF NEW.app_subdomain IN ('learn-developer', 'learn-ai') AND NEW.content_type = 'module' THEN
    PERFORM public.check_cross_app_unlock(NEW.user_id, NEW.app_subdomain, NEW.content_id, NEW.progress_percentage);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_mentor_mode ON public.user_progress;
CREATE TRIGGER trigger_auto_mentor_mode
  AFTER INSERT OR UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_update_mentor_mode();

-- ============================================
-- H. UPDATED_AT TRIGGERS
-- ============================================

-- Sync modules
CREATE OR REPLACE FUNCTION public.handle_sync_modules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sync_modules_updated_at ON public.sync_modules;
CREATE TRIGGER update_sync_modules_updated_at
  BEFORE UPDATE ON public.sync_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_sync_modules_updated_at();

-- Mentor mode
DROP TRIGGER IF EXISTS update_mentor_mode_updated_at ON public.mentor_mode;
CREATE TRIGGER update_mentor_mode_updated_at
  BEFORE UPDATE ON public.mentor_mode
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- END OF MIGRATION
-- ============================================
