-- Courses and AI-Powered Newsletter System Migration
-- 
-- This migration creates tables for course management and AI-generated newsletters
-- Run this in your Supabase SQL Editor:
-- Dashboard → SQL Editor → New Query → Paste this script → Run

-- ============================================
-- COURSES TABLE
-- ============================================
-- Stores all courses/learning content
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  highlights TEXT[], -- Array of key features
  duration TEXT, -- e.g., "4 weeks", "30 hours"
  category TEXT, -- e.g., "Data Science", "Marketing"
  target_audience TEXT, -- Who should take this
  topics_skills TEXT[], -- Array of topics/skills covered
  price DECIMAL(10,2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  subdomain TEXT, -- Which learning app this belongs to
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_subdomain ON courses(subdomain);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_published_at ON courses(published_at DESC);

-- Add comments
COMMENT ON TABLE courses IS 'Stores all courses and learning content across iiskills.cloud';
COMMENT ON COLUMN courses.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN courses.highlights IS 'Array of key features/benefits';
COMMENT ON COLUMN courses.topics_skills IS 'Array of topics and skills covered';
COMMENT ON COLUMN courses.subdomain IS 'Learning app subdomain (e.g., learn-ai, learn-math)';

-- ============================================
-- NEWSLETTER EDITIONS TABLE
-- ============================================
-- Stores AI-generated newsletter editions
CREATE TABLE IF NOT EXISTS newsletter_editions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  edition_number SERIAL,
  title TEXT NOT NULL, -- e.g., "Skilling #42: AI Mastery is Here! 🚀"
  subject_line TEXT NOT NULL, -- Email subject
  intro_text TEXT, -- Catchy opening paragraph
  course_summary TEXT, -- AI-generated lively summary
  highlights_section TEXT, -- Formatted highlights
  cta_text TEXT, -- Call-to-action text
  fun_fact TEXT, -- "Did You Know?" or "Pro Tip"
  emoji_block TEXT, -- Fun emoji section
  html_content TEXT, -- Full HTML email template
  web_content TEXT, -- Full HTML for web view
  generation_prompt TEXT, -- The AI prompt used
  ai_metadata JSONB, -- Store AI generation metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'failed')),
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  sent_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_editions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_course ON newsletter_editions(course_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_sent_at ON newsletter_editions(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_edition ON newsletter_editions(edition_number DESC);

-- Add comments
COMMENT ON TABLE newsletter_editions IS 'AI-generated newsletter editions for the "Skilling" newsletter';
COMMENT ON COLUMN newsletter_editions.edition_number IS 'Sequential edition number';
COMMENT ON COLUMN newsletter_editions.html_content IS 'Full HTML for email';
COMMENT ON COLUMN newsletter_editions.web_content IS 'Full HTML for web archive view';
COMMENT ON COLUMN newsletter_editions.ai_metadata IS 'JSON metadata from AI generation';

-- ============================================
-- NEWSLETTER QUEUE TABLE
-- ============================================
-- Tracks newsletter generation and sending tasks
CREATE TABLE IF NOT EXISTS newsletter_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  newsletter_id UUID REFERENCES newsletter_editions(id) ON DELETE SET NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('generate', 'send', 'resend')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_queue_status ON newsletter_queue(status);
CREATE INDEX IF NOT EXISTS idx_queue_course ON newsletter_queue(course_id);
CREATE INDEX IF NOT EXISTS idx_queue_type ON newsletter_queue(task_type);

-- Add comments
COMMENT ON TABLE newsletter_queue IS 'Queue for newsletter generation and sending tasks';
COMMENT ON COLUMN newsletter_queue.task_type IS 'Type of task: generate, send, or resend';

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_queue ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access to published courses" ON courses;
DROP POLICY IF EXISTS "Admin full access to courses" ON courses;
DROP POLICY IF EXISTS "Public read access to sent newsletters" ON newsletter_editions;
DROP POLICY IF EXISTS "Admin full access to newsletters" ON newsletter_editions;
DROP POLICY IF EXISTS "Admin full access to queue" ON newsletter_queue;

-- Courses policies
CREATE POLICY "Public read access to published courses" ON courses
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admin full access to courses" ON courses
  USING (true)
  WITH CHECK (true);

-- Newsletter editions policies
CREATE POLICY "Public read access to sent newsletters" ON newsletter_editions
  FOR SELECT 
  USING (status = 'sent');

CREATE POLICY "Admin full access to newsletters" ON newsletter_editions
  USING (true)
  WITH CHECK (true);

-- Queue policies (admin only)
CREATE POLICY "Admin full access to queue" ON newsletter_queue
  USING (true)
  WITH CHECK (true);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp on courses
CREATE OR REPLACE FUNCTION update_courses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION update_courses_updated_at();

-- Update updated_at timestamp on newsletter_editions
CREATE OR REPLACE FUNCTION update_newsletter_editions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_newsletter_editions_updated_at ON newsletter_editions;
CREATE TRIGGER update_newsletter_editions_updated_at
  BEFORE UPDATE ON newsletter_editions
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_editions_updated_at();

-- Update updated_at timestamp on newsletter_queue
CREATE OR REPLACE FUNCTION update_newsletter_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_newsletter_queue_updated_at ON newsletter_queue;
CREATE TRIGGER update_newsletter_queue_updated_at
  BEFORE UPDATE ON newsletter_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_queue_updated_at();

-- ============================================
-- AUTO-GENERATE NEWSLETTER ON COURSE PUBLISH
-- ============================================

-- Function to queue newsletter generation when a course is published
CREATE OR REPLACE FUNCTION queue_newsletter_on_course_publish()
RETURNS TRIGGER AS $$
BEGIN
  -- Only queue if status changed to 'published'
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    INSERT INTO newsletter_queue (course_id, task_type, status)
    VALUES (NEW.id, 'generate', 'pending');
    
    -- Update published_at timestamp
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS queue_newsletter_on_publish ON courses;
CREATE TRIGGER queue_newsletter_on_publish
  BEFORE UPDATE ON courses
  FOR EACH ROW
  EXECUTE FUNCTION queue_newsletter_on_course_publish();

-- Also trigger on INSERT if already published
CREATE OR REPLACE FUNCTION queue_newsletter_on_course_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' THEN
    INSERT INTO newsletter_queue (course_id, task_type, status)
    VALUES (NEW.id, 'generate', 'pending');
    
    NEW.published_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS queue_newsletter_on_insert ON courses;
CREATE TRIGGER queue_newsletter_on_insert
  BEFORE INSERT ON courses
  FOR EACH ROW
  EXECUTE FUNCTION queue_newsletter_on_course_insert();

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'AI-Powered Newsletter System tables created successfully!';
  RAISE NOTICE 'Tables: courses, newsletter_editions, newsletter_queue';
  RAISE NOTICE 'Auto-trigger enabled: Newsletter will be queued when course is published';
END $$;
