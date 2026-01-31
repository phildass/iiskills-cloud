# Content Centralization to Supabase

## Overview

This document describes the comprehensive content centralization system that migrates ALL educational content from local files across all learn-apps into Supabase. This is a critical foundational requirement for the iiskills-cloud platform.

## Mission & Importance

**Our mission is to centralize every piece of educational content** from all learn-apps—spanning general subjects (Math, Physics, etc.), trivia, cricket content, exam prep (JEE, NEET, IAS), and government jobs content—into Supabase under a unified, normalized schema.

### Why This Matters

1. **Seamless Content Access** - Reliable, fast access for all users and admins
2. **Consistent APIs** - Unified data queries across all apps
3. **Scalable Onboarding** - Easy addition of new subjects/modules/apps
4. **Future-Proof** - Ready for analytics and automation
5. **Single Source of Truth** - No siloed content in local files

## Database Schema

### Core Content Tables

#### 1. **courses** (already exists)
Primary course/program container.

```sql
- id: UUID (PK)
- title: TEXT
- slug: TEXT (unique)
- short_description: TEXT
- full_description: TEXT
- duration: TEXT
- category: TEXT
- subdomain: TEXT (which app)
- price: DECIMAL
- is_free: BOOLEAN
- status: TEXT (draft/published/archived)
```

#### 2. **modules** (NEW)
Modules/chapters within courses.

```sql
- id: UUID (PK)
- course_id: UUID (FK -> courses)
- title: TEXT
- slug: TEXT
- description: TEXT
- order_index: INTEGER
- duration: TEXT
- is_published: BOOLEAN
- prerequisites: TEXT[]
- learning_objectives: TEXT[]
- metadata: JSONB
```

#### 3. **lessons** (NEW)
Individual lessons within modules.

```sql
- id: UUID (PK)
- module_id: UUID (FK -> modules)
- title: TEXT
- slug: TEXT
- content: TEXT
- content_type: TEXT (text/video/audio/interactive/quiz/assignment)
- duration: TEXT
- order_index: INTEGER
- is_published: BOOLEAN
- is_free: BOOLEAN
- video_url: TEXT
- attachments: JSONB
- metadata: JSONB
```

#### 4. **questions** (NEW)
Quiz/test questions.

```sql
- id: UUID (PK)
- lesson_id: UUID (FK -> lessons, optional)
- module_id: UUID (FK -> modules, optional)
- question_text: TEXT
- question_type: TEXT (multiple_choice/true_false/short_answer/essay/code)
- options: JSONB
- correct_answer: TEXT
- explanation: TEXT
- difficulty: TEXT (easy/medium/hard/expert)
- points: INTEGER
- time_limit_seconds: INTEGER
- tags: TEXT[]
- metadata: JSONB
```

### Specialized Content Tables

#### 5. **trivia** (NEW)
Trivia questions for cricket, general knowledge, etc.

```sql
- id: UUID (PK)
- app_subdomain: TEXT
- category: TEXT
- subcategory: TEXT
- question: TEXT
- answer: TEXT
- difficulty: TEXT
- fun_fact: TEXT
- source: TEXT
- tags: TEXT[]
- metadata: JSONB
- is_published: BOOLEAN
```

#### 6. **biographical_content** (NEW)
Biographical information (cricket players, leaders, etc.).

```sql
- id: UUID (PK)
- app_subdomain: TEXT
- person_name: TEXT
- person_slug: TEXT
- category: TEXT
- short_bio: TEXT
- full_bio: TEXT
- birth_date: DATE
- nationality: TEXT
- achievements: TEXT[]
- career_highlights: JSONB
- statistics: JSONB
- image_url: TEXT
- tags: TEXT[]
- metadata: JSONB
- is_published: BOOLEAN
```

#### 7. **government_jobs** (NEW)
Government job postings (district/state/central level).

```sql
- id: UUID (PK)
- job_id: TEXT (unique)
- title: TEXT
- department: TEXT
- level: TEXT (district/state/central)
- location_country: TEXT
- location_state: TEXT
- location_district: TEXT
- position_type: TEXT
- vacancy_count: INTEGER
- education_requirement: TEXT
- age_min: INTEGER
- age_max: INTEGER
- age_relaxations: JSONB
- experience_requirement: TEXT
- physical_fitness_required: BOOLEAN
- nationality_requirement: TEXT
- additional_criteria: TEXT[]
- application_deadline: TIMESTAMPTZ
- notification_date: TIMESTAMPTZ
- exam_date: TIMESTAMPTZ
- salary_range: TEXT
- status: TEXT (open/closed/cancelled)
- application_url: TEXT
- notification_pdf_url: TEXT
- tags: TEXT[]
- metadata: JSONB
```

#### 8. **geography** (NEW)
Hierarchical geography data (country > state > district > city).

```sql
- id: UUID (PK)
- name: TEXT
- type: TEXT (country/state/district/city)
- parent_id: UUID (FK -> geography, self-reference)
- code: TEXT
- population: BIGINT
- area_sqkm: DECIMAL
- coordinates: JSONB
- metadata: JSONB
```

#### 9. **content_source_mapping** (NEW)
Audit trail for content migration.

```sql
- id: UUID (PK)
- content_table: TEXT
- content_id: UUID
- source_app: TEXT
- source_file: TEXT
- source_format: TEXT
- migrated_at: TIMESTAMPTZ
- migration_version: TEXT
- metadata: JSONB
```

## Content Inventory

### Current Content Sources

1. **seeds/content.json**
   - 3 sample courses (JEE, NEET, Leadership)
   - 3 modules
   - 3 lessons
   - 2 questions

2. **learn-govt-jobs/data/**
   - `geography.json` - Hierarchical geography (8 states, 37+ districts)
   - `deadlines.json` - Job deadlines and exam dates
   - `eligibility.ts` - Eligibility criteria templates

3. **learn-management/data/**
   - `newsletters.json` - Newsletter data (currently empty)

### Future Content to Migrate

- Cricket trivia questions
- Cricket player biographies
- Math course content (all levels)
- Physics course content (all levels)
- Chemistry course content
- JEE/NEET/IAS exam prep materials
- AI/Data Science modules
- Leadership and management content

## Migration Process

### Step 1: Run Schema Migration

```bash
# In Supabase Dashboard -> SQL Editor
# Run: supabase/migrations/content_centralization_schema.sql
```

This creates all the necessary tables with proper indexes, RLS policies, and triggers.

### Step 2: Set Environment Variables

```bash
export SUPABASE_URL="your-project-url"
export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### Step 3: Run Migration Script

```bash
# Install dependencies if needed
yarn install

# Run the migration
node scripts/migrate-content-to-supabase.ts
```

### Step 4: Verify Migration

```bash
# Check the Supabase dashboard or run queries:
SELECT COUNT(*) FROM public.courses;
SELECT COUNT(*) FROM public.modules;
SELECT COUNT(*) FROM public.lessons;
SELECT COUNT(*) FROM public.questions;
SELECT COUNT(*) FROM public.geography;
SELECT COUNT(*) FROM public.government_jobs;
```

## Content Access Patterns

### Fetching Course Hierarchy

```typescript
// Get course with modules and lessons
const { data: course } = await supabase
  .from('courses')
  .select(`
    *,
    modules (
      *,
      lessons (
        *,
        questions (*)
      )
    )
  `)
  .eq('slug', 'jee-preparation-sample')
  .single();
```

### Fetching Government Jobs by Location

```typescript
// Get jobs for a specific state
const { data: jobs } = await supabase
  .from('government_jobs')
  .select('*')
  .eq('location_state', 'Bihar')
  .eq('status', 'open')
  .order('application_deadline', { ascending: true });
```

### Fetching Geography Hierarchy

```typescript
// Get all states in India with districts
const { data: states } = await supabase
  .from('geography')
  .select(`
    *,
    children:geography!parent_id (*)
  `)
  .eq('type', 'state')
  .order('name');
```

### Fetching Trivia by Category

```typescript
// Get cricket trivia
const { data: trivia } = await supabase
  .from('trivia')
  .select('*')
  .eq('category', 'cricket')
  .eq('is_published', true)
  .limit(10);
```

## API Endpoints to Update

### Current Endpoints (to be refactored)

1. `/api/modules` - Currently loads from local files
2. `/api/courses` - Currently loads from seed data
3. App-specific content loaders

### New Unified Endpoints

1. `/api/content/courses` - Fetch courses with filters
2. `/api/content/modules/:courseId` - Fetch modules for a course
3. `/api/content/lessons/:moduleId` - Fetch lessons for a module
4. `/api/content/government-jobs` - Fetch government jobs
5. `/api/content/geography` - Fetch geography data
6. `/api/content/trivia` - Fetch trivia questions

## Row Level Security (RLS)

All tables have RLS enabled with two main policies:

1. **Public Read Access** - Anyone can read published content
2. **Admin Full Access** - Admins can create/update/delete content

### Example Policies

```sql
-- Public can read published content
CREATE POLICY "Public read published modules" ON public.modules
  FOR SELECT USING (is_published = true);

-- Admins have full access
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
```

## Adding New Content

### For Admins (via Dashboard)

```typescript
// Insert new course
const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'Advanced Mathematics',
    slug: 'advanced-mathematics',
    short_description: 'Master advanced math concepts',
    subdomain: 'learn-math',
    category: 'Mathematics',
    is_free: false,
    price: 4999,
    status: 'published'
  });
```

### Via Migration Scripts

1. Add content to appropriate JSON files
2. Update migration script to parse new format
3. Run migration script again (it's idempotent)

## Validation & Integrity

### Data Validation Rules

1. **Courses** - Must have unique slug
2. **Modules** - Must belong to a course, unique slug per course
3. **Lessons** - Must belong to a module, unique slug per module
4. **Questions** - Must belong to either lesson or module
5. **Geography** - Must have valid parent (except countries)

### Referential Integrity

All foreign keys cascade on delete to maintain consistency:
- Delete course → deletes modules → deletes lessons → deletes questions
- Delete geography parent → deletes children

## Backup & Recovery

### Manual Backup

```bash
# Export all content tables
supabase db dump --table courses --table modules --table lessons > backup.sql
```

### Automated Backups

Supabase provides automatic daily backups. Enable point-in-time recovery for additional safety.

## Performance Optimization

### Indexes Created

1. Course slug (unique, fast lookups)
2. Module course_id + order_index (sorted lists)
3. Lesson module_id + order_index (sorted lists)
4. Geography parent_id (hierarchical queries)
5. Government jobs location and deadline (filtering)
6. GIN indexes on JSONB and array columns

### Query Optimization Tips

1. Always use `.select()` to specify needed fields
2. Use `.limit()` for pagination
3. Add `.order()` for consistent results
4. Consider using views for complex joins

## Monitoring & Analytics

### Health Check Endpoint

Create a `/api/content/health` endpoint to verify:
- Total content counts per table
- Recent migration status
- Content freshness (last updated timestamps)

### Analytics Queries

```sql
-- Content distribution by app
SELECT subdomain, COUNT(*) 
FROM courses 
GROUP BY subdomain;

-- Most popular categories
SELECT category, COUNT(*) 
FROM courses 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Geography coverage
SELECT type, COUNT(*) 
FROM geography 
GROUP BY type;
```

## Future Enhancements

1. **Content Versioning** - Track content changes over time
2. **Content Translation** - Multi-language support
3. **Content Recommendations** - ML-based suggestions
4. **Content Analytics** - Track engagement and effectiveness
5. **Automated Migration** - CI/CD integration for content updates

## Troubleshooting

### Common Issues

**Issue**: Migration fails with "relation does not exist"  
**Solution**: Run schema migration SQL first

**Issue**: Foreign key constraint violations  
**Solution**: Ensure courses exist before creating modules

**Issue**: Duplicate key errors  
**Solution**: Migration script uses upsert - check for actual conflicts

**Issue**: RLS prevents data access  
**Solution**: Verify user is authenticated or content is published

## Support & Contact

For issues or questions:
1. Check migration logs for errors
2. Verify Supabase connection
3. Review RLS policies
4. Check application logs

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0  
**Maintainer**: iiskills-cloud content migration team
