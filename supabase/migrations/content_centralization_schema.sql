-- ============================================
-- CONTENT CENTRALIZATION SCHEMA
-- ============================================
-- 
-- This migration creates comprehensive tables to centralize ALL educational
-- content from all learn-apps into Supabase. This includes:
-- - General subjects (Math, Physics, Chemistry, etc.)
-- - Government jobs content (geography, deadlines, eligibility)
-- - Cricket trivia and biographical content
-- - Exam preparation (JEE, NEET, IAS)
-- - Management and leadership content
--
-- CREATED: 2026-01-29
-- AUTHOR: iiskills-cloud content migration team
-- 
-- RUN ORDER: Run after standardized_schema_v2.sql and courses_and_newsletter.sql
--
-- ============================================

-- ============================================
-- A. MODULES TABLE
-- ============================================
-- Stores modules/chapters within courses

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration TEXT,
  is_published BOOLEAN DEFAULT true,
  prerequisites TEXT[],
  learning_objectives TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(course_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_modules_order ON public.modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_modules_published ON public.modules(is_published);

-- Comments
COMMENT ON TABLE public.modules IS 'Modules/chapters within courses across all learning apps';
COMMENT ON COLUMN public.modules.order_index IS 'Display order within the course (0-based)';
COMMENT ON COLUMN public.modules.prerequisites IS 'Array of prerequisite module slugs';
COMMENT ON COLUMN public.modules.learning_objectives IS 'Array of learning objectives for this module';

-- ============================================
-- B. LESSONS TABLE
-- ============================================
-- Stores individual lessons within modules

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'video', 'audio', 'interactive', 'quiz', 'assignment')),
  duration TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  is_free BOOLEAN DEFAULT false,
  video_url TEXT,
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(module_id, slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON public.lessons(module_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_published ON public.lessons(is_published);
CREATE INDEX IF NOT EXISTS idx_lessons_content_type ON public.lessons(content_type);

-- Comments
COMMENT ON TABLE public.lessons IS 'Individual lessons within modules';
COMMENT ON COLUMN public.lessons.content_type IS 'Type of lesson content: text, video, audio, interactive, quiz, or assignment';
COMMENT ON COLUMN public.lessons.attachments IS 'JSONB array of file attachments (PDFs, images, etc.)';

-- ============================================
-- C. QUESTIONS TABLE
-- ============================================
-- Stores quiz/test questions linked to lessons

CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay', 'code')),
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  points INTEGER DEFAULT 1,
  time_limit_seconds INTEGER,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CHECK (lesson_id IS NOT NULL OR module_id IS NOT NULL)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_lesson ON public.questions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_questions_module ON public.questions(module_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_tags ON public.questions USING GIN(tags);

-- Comments
COMMENT ON TABLE public.questions IS 'Quiz and test questions for lessons and modules';
COMMENT ON COLUMN public.questions.question_type IS 'Type of question: multiple_choice, true_false, short_answer, essay, or code';
COMMENT ON COLUMN public.questions.options IS 'JSONB array of answer options for multiple choice questions';

-- ============================================
-- D. TRIVIA TABLE
-- ============================================
-- Stores trivia content (cricket, general knowledge, etc.)

CREATE TABLE IF NOT EXISTS public.trivia (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_subdomain TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  fun_fact TEXT,
  source TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trivia_app ON public.trivia(app_subdomain);
CREATE INDEX IF NOT EXISTS idx_trivia_category ON public.trivia(category);
CREATE INDEX IF NOT EXISTS idx_trivia_difficulty ON public.trivia(difficulty);
CREATE INDEX IF NOT EXISTS idx_trivia_tags ON public.trivia USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_trivia_published ON public.trivia(is_published);

-- Comments
COMMENT ON TABLE public.trivia IS 'Trivia questions for cricket, general knowledge, and other apps';
COMMENT ON COLUMN public.trivia.category IS 'Main category (e.g., cricket, history, science)';
COMMENT ON COLUMN public.trivia.subcategory IS 'Optional subcategory (e.g., players, matches, records)';

-- ============================================
-- E. BIOGRAPHICAL CONTENT TABLE
-- ============================================
-- Stores biographical information (cricket players, historical figures, etc.)

CREATE TABLE IF NOT EXISTS public.biographical_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  app_subdomain TEXT NOT NULL,
  person_name TEXT NOT NULL,
  person_slug TEXT NOT NULL,
  category TEXT NOT NULL,
  short_bio TEXT,
  full_bio TEXT,
  birth_date DATE,
  nationality TEXT,
  achievements TEXT[],
  career_highlights JSONB,
  statistics JSONB,
  image_url TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(app_subdomain, person_slug)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bio_app ON public.biographical_content(app_subdomain);
CREATE INDEX IF NOT EXISTS idx_bio_category ON public.biographical_content(category);
CREATE INDEX IF NOT EXISTS idx_bio_slug ON public.biographical_content(person_slug);
CREATE INDEX IF NOT EXISTS idx_bio_tags ON public.biographical_content USING GIN(tags);

-- Comments
COMMENT ON TABLE public.biographical_content IS 'Biographical information for notable people (athletes, leaders, etc.)';
COMMENT ON COLUMN public.biographical_content.category IS 'Category of person (athlete, politician, scientist, etc.)';
COMMENT ON COLUMN public.biographical_content.career_highlights IS 'JSONB object with career milestones';
COMMENT ON COLUMN public.biographical_content.statistics IS 'JSONB object with relevant statistics';

-- ============================================
-- F. GOVERNMENT JOBS TABLE
-- ============================================
-- Stores government job postings and information

CREATE TABLE IF NOT EXISTS public.government_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('district', 'state', 'central')),
  location_country TEXT DEFAULT 'India',
  location_state TEXT,
  location_district TEXT,
  position_type TEXT,
  vacancy_count INTEGER,
  education_requirement TEXT NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  age_relaxations JSONB,
  experience_requirement TEXT,
  physical_fitness_required BOOLEAN DEFAULT false,
  nationality_requirement TEXT DEFAULT 'Indian',
  additional_criteria TEXT[],
  application_deadline TIMESTAMPTZ,
  notification_date TIMESTAMPTZ,
  exam_date TIMESTAMPTZ,
  physical_test_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  salary_range TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  application_url TEXT,
  notification_pdf_url TEXT,
  tags TEXT[],
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_govt_jobs_level ON public.government_jobs(level);
CREATE INDEX IF NOT EXISTS idx_govt_jobs_state ON public.government_jobs(location_state);
CREATE INDEX IF NOT EXISTS idx_govt_jobs_district ON public.government_jobs(location_district);
CREATE INDEX IF NOT EXISTS idx_govt_jobs_status ON public.government_jobs(status);
CREATE INDEX IF NOT EXISTS idx_govt_jobs_deadline ON public.government_jobs(application_deadline);
CREATE INDEX IF NOT EXISTS idx_govt_jobs_tags ON public.government_jobs USING GIN(tags);

-- Comments
COMMENT ON TABLE public.government_jobs IS 'Government job postings at district, state, and central levels';
COMMENT ON COLUMN public.government_jobs.level IS 'Job level: district, state, or central';
COMMENT ON COLUMN public.government_jobs.age_relaxations IS 'JSONB object with age relaxation rules for different categories';

-- ============================================
-- G. GEOGRAPHY HIERARCHY TABLE
-- ============================================
-- Stores hierarchical geography data (country > state > district)

CREATE TABLE IF NOT EXISTS public.geography (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('country', 'state', 'district', 'city')),
  parent_id UUID REFERENCES public.geography(id) ON DELETE CASCADE,
  code TEXT,
  population BIGINT,
  area_sqkm DECIMAL(10,2),
  coordinates JSONB,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(name, type, parent_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_geography_type ON public.geography(type);
CREATE INDEX IF NOT EXISTS idx_geography_parent ON public.geography(parent_id);
CREATE INDEX IF NOT EXISTS idx_geography_name ON public.geography(name);

-- Comments
COMMENT ON TABLE public.geography IS 'Hierarchical geography data for India (country > state > district > city)';
COMMENT ON COLUMN public.geography.type IS 'Geographic level: country, state, district, or city';
COMMENT ON COLUMN public.geography.coordinates IS 'JSONB object with lat/lng coordinates';

-- ============================================
-- H. CONTENT SOURCE MAPPING TABLE
-- ============================================
-- Tracks which content came from which source/app

CREATE TABLE IF NOT EXISTS public.content_source_mapping (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_table TEXT NOT NULL,
  content_id UUID NOT NULL,
  source_app TEXT NOT NULL,
  source_file TEXT,
  source_format TEXT,
  migrated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  migration_version TEXT,
  metadata JSONB DEFAULT '{}',
  UNIQUE(content_table, content_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_content_source_app ON public.content_source_mapping(source_app);
CREATE INDEX IF NOT EXISTS idx_content_source_table ON public.content_source_mapping(content_table);

-- Comments
COMMENT ON TABLE public.content_source_mapping IS 'Tracks the origin of migrated content for audit and rollback purposes';
COMMENT ON COLUMN public.content_source_mapping.content_table IS 'Name of the table containing the content';
COMMENT ON COLUMN public.content_source_mapping.content_id IS 'UUID of the content item';
COMMENT ON COLUMN public.content_source_mapping.source_app IS 'App subdomain that originally owned the content';

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trivia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biographical_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geography ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_source_mapping ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read published modules" ON public.modules;
DROP POLICY IF EXISTS "Public read published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Public read questions" ON public.questions;
DROP POLICY IF EXISTS "Public read published trivia" ON public.trivia;
DROP POLICY IF EXISTS "Public read published bios" ON public.biographical_content;
DROP POLICY IF EXISTS "Public read government jobs" ON public.government_jobs;
DROP POLICY IF EXISTS "Public read geography" ON public.geography;
DROP POLICY IF EXISTS "Admin full access modules" ON public.modules;
DROP POLICY IF EXISTS "Admin full access lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admin full access questions" ON public.questions;
DROP POLICY IF EXISTS "Admin full access trivia" ON public.trivia;
DROP POLICY IF EXISTS "Admin full access bios" ON public.biographical_content;
DROP POLICY IF EXISTS "Admin full access govt jobs" ON public.government_jobs;
DROP POLICY IF EXISTS "Admin full access geography" ON public.geography;
DROP POLICY IF EXISTS "Admin read content source" ON public.content_source_mapping;

-- Public read access to published content
CREATE POLICY "Public read published modules" ON public.modules
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read published lessons" ON public.lessons
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read questions" ON public.questions
  FOR SELECT USING (true);

CREATE POLICY "Public read published trivia" ON public.trivia
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read published bios" ON public.biographical_content
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read government jobs" ON public.government_jobs
  FOR SELECT USING (true);

CREATE POLICY "Public read geography" ON public.geography
  FOR SELECT USING (true);

-- Admin full access to all tables
CREATE POLICY "Admin full access modules" ON public.modules
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

CREATE POLICY "Admin full access lessons" ON public.lessons
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

CREATE POLICY "Admin full access questions" ON public.questions
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

CREATE POLICY "Admin full access trivia" ON public.trivia
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

CREATE POLICY "Admin full access bios" ON public.biographical_content
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

CREATE POLICY "Admin full access govt jobs" ON public.government_jobs
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

CREATE POLICY "Admin full access geography" ON public.geography
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

CREATE POLICY "Admin read content source" ON public.content_source_mapping
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
DROP TRIGGER IF EXISTS update_modules_updated_at ON public.modules;
CREATE TRIGGER update_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_lessons_updated_at ON public.lessons;
CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON public.questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_trivia_updated_at ON public.trivia;
CREATE TRIGGER update_trivia_updated_at
  BEFORE UPDATE ON public.trivia
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bio_updated_at ON public.biographical_content;
CREATE TRIGGER update_bio_updated_at
  BEFORE UPDATE ON public.biographical_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_govt_jobs_updated_at ON public.government_jobs;
CREATE TRIGGER update_govt_jobs_updated_at
  BEFORE UPDATE ON public.government_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_geography_updated_at ON public.geography;
CREATE TRIGGER update_geography_updated_at
  BEFORE UPDATE ON public.geography
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CONTENT CENTRALIZATION SCHEMA COMPLETE!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  ✓ public.modules (course modules/chapters)';
  RAISE NOTICE '  ✓ public.lessons (individual lessons)';
  RAISE NOTICE '  ✓ public.questions (quiz questions)';
  RAISE NOTICE '  ✓ public.trivia (trivia content)';
  RAISE NOTICE '  ✓ public.biographical_content (bios)';
  RAISE NOTICE '  ✓ public.government_jobs (job postings)';
  RAISE NOTICE '  ✓ public.geography (hierarchical geo data)';
  RAISE NOTICE '  ✓ public.content_source_mapping (audit trail)';
  RAISE NOTICE '';
  RAISE NOTICE 'Next step: Run migration scripts to populate tables';
  RAISE NOTICE '========================================';
END $$;
