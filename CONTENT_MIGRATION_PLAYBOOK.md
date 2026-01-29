# Content Migration Playbook

## Quick Start Guide

This playbook guides you through migrating all educational content from local files to Supabase.

## Prerequisites

- [ ] Supabase project created
- [ ] Environment variables configured:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY` (for migrations)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for client access)
- [ ] Node.js 16+ installed
- [ ] Repository dependencies installed (`yarn install`)

## Migration Steps

### Step 1: Run Database Schema Migration

**Estimated Time**: 5-10 minutes

1. Open your Supabase Dashboard
2. Navigate to: SQL Editor
3. Run migrations in this order:

```bash
# 1. Run standardized schema v2 (if not already done)
supabase/migrations/standardized_schema_v2.sql

# 2. Run courses and newsletter tables (if not already done)
supabase/migrations/courses_and_newsletter.sql

# 3. Run content centralization schema (NEW)
supabase/migrations/content_centralization_schema.sql
```

4. Verify tables created:

```sql
-- Check all content tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'courses', 'modules', 'lessons', 'questions',
    'trivia', 'biographical_content', 'government_jobs',
    'geography', 'content_source_mapping'
  )
ORDER BY table_name;

-- Should return 9 rows
```

### Step 2: Prepare Environment

**Estimated Time**: 2 minutes

1. Create `.env.local` file in repository root:

```bash
# Copy example file
cp .env.local.example .env.local
```

2. Add Supabase credentials:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Verify credentials:

```bash
node -e "console.log('URL:', process.env.SUPABASE_URL)"
```

### Step 3: Run Content Migration Script

**Estimated Time**: 2-5 minutes (depends on content volume)

1. Make migration script executable:

```bash
chmod +x scripts/migrate-content-to-supabase.ts
```

2. Run the migration:

```bash
# Using npx with tsx
npx tsx scripts/migrate-content-to-supabase.ts

# OR compile and run
npx tsc scripts/migrate-content-to-supabase.ts
node scripts/migrate-content-to-supabase.js
```

3. Monitor output for errors:

```
[2026-01-29T10:00:00.000Z] 📚 Migrating 3 courses...
[2026-01-29T10:00:01.000Z] ✅ Courses: 3 created, 0 updated, 0 errors
[2026-01-29T10:00:01.000Z] 📖 Migrating 3 modules...
[2026-01-29T10:00:02.000Z] ✅ Modules: 3 created, 0 updated, 0 errors
...
```

4. If errors occur, check:
   - Database connection (check credentials)
   - Schema migrations completed
   - Data format in source files

### Step 4: Verify Migration Success

**Estimated Time**: 5 minutes

Run verification queries in Supabase SQL Editor:

```sql
-- 1. Count records in each table
SELECT 'courses' AS table_name, COUNT(*) AS count FROM public.courses
UNION ALL
SELECT 'modules', COUNT(*) FROM public.modules
UNION ALL
SELECT 'lessons', COUNT(*) FROM public.lessons
UNION ALL
SELECT 'questions', COUNT(*) FROM public.questions
UNION ALL
SELECT 'geography', COUNT(*) FROM public.geography
UNION ALL
SELECT 'government_jobs', COUNT(*) FROM public.government_jobs;

-- 2. Verify course hierarchy
SELECT 
  c.title AS course,
  COUNT(DISTINCT m.id) AS module_count,
  COUNT(DISTINCT l.id) AS lesson_count,
  COUNT(DISTINCT q.id) AS question_count
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
LEFT JOIN questions q ON q.lesson_id = l.id
GROUP BY c.id, c.title
ORDER BY c.title;

-- 3. Check geography hierarchy
SELECT 
  type,
  COUNT(*) AS count
FROM geography
GROUP BY type
ORDER BY 
  CASE type
    WHEN 'country' THEN 1
    WHEN 'state' THEN 2
    WHEN 'district' THEN 3
    WHEN 'city' THEN 4
  END;

-- 4. Verify government jobs
SELECT 
  level,
  status,
  COUNT(*) AS count
FROM government_jobs
GROUP BY level, status
ORDER BY level, status;
```

Expected results:
- Courses: 3+
- Modules: 3+
- Lessons: 3+
- Questions: 2+
- Geography: 40+ (1 country, 8 states, 37+ districts)
- Government Jobs: 4+

### Step 5: Test API Endpoints

**Estimated Time**: 5 minutes

1. Start the development server:

```bash
cd apps/main
yarn dev
```

2. Test endpoints using curl or browser:

```bash
# Test courses endpoint
curl "http://localhost:3000/api/content/courses?limit=5"

# Test modules endpoint
curl "http://localhost:3000/api/content/modules?course_slug=jee-preparation-sample"

# Test government jobs
curl "http://localhost:3000/api/content/government-jobs?status=open&limit=5"

# Test geography
curl "http://localhost:3000/api/content/geography?type=state&include_children=true"
```

3. Verify responses:
   - Status: 200 OK
   - Data returned in expected format
   - No error messages

### Step 6: Update App Content Loaders

**Estimated Time**: 30-60 minutes per app

For each learn-app, update content loading to use Supabase:

#### Example: Update learn-govt-jobs

**Before** (loading from local file):
```javascript
import geographyData from '../data/geography.json';

export function getGeography() {
  return geographyData;
}
```

**After** (loading from Supabase):
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function getGeography() {
  const { data, error } = await supabase
    .from('geography')
    .select('*')
    .eq('type', 'state')
    .order('name');
  
  if (error) throw error;
  return data;
}
```

Repeat for all content loaders in each app.

### Step 7: Remove/Archive Local Content Files

**Estimated Time**: 10 minutes

Once migration is verified and apps are using Supabase:

1. Move local content files to archive:

```bash
mkdir -p archive/legacy-content
mv apps/*/data/*.json archive/legacy-content/
mv seeds/content.json archive/legacy-content/
```

2. Update `.gitignore` to exclude archive:

```bash
echo "archive/" >> .gitignore
```

3. Document migration in commit:

```bash
git add .
git commit -m "Archive legacy local content files - now using Supabase"
```

## Troubleshooting

### Issue: "relation does not exist"

**Cause**: Schema migration not completed  
**Solution**: Run all schema migrations in Supabase SQL Editor

### Issue: "Missing Supabase credentials"

**Cause**: Environment variables not set  
**Solution**: Check `.env.local` file and restart server

### Issue: "Foreign key constraint violations"

**Cause**: Attempting to create child records before parents  
**Solution**: Migration script handles order automatically, check for custom modifications

### Issue: "Duplicate key errors"

**Cause**: Content already exists in database  
**Solution**: Migration script uses upsert, check for actual conflicts in data

### Issue: RLS prevents data access

**Cause**: Row Level Security policies blocking access  
**Solution**: Verify user authentication or check is_published flag

## Rollback Procedure

If you need to rollback the migration:

### Option 1: Drop and Recreate Tables

```sql
-- Drop tables in reverse order (children first)
DROP TABLE IF EXISTS public.content_source_mapping;
DROP TABLE IF EXISTS public.questions;
DROP TABLE IF EXISTS public.lessons;
DROP TABLE IF EXISTS public.modules;
DROP TABLE IF EXISTS public.trivia;
DROP TABLE IF EXISTS public.biographical_content;
DROP TABLE IF EXISTS public.government_jobs;
DROP TABLE IF EXISTS public.geography;

-- Re-run schema migration
-- (execute content_centralization_schema.sql again)
```

### Option 2: Delete Data Only

```sql
-- Clear all data but keep schema
DELETE FROM public.content_source_mapping;
DELETE FROM public.questions;
DELETE FROM public.lessons;
DELETE FROM public.modules;
DELETE FROM public.trivia;
DELETE FROM public.biographical_content;
DELETE FROM public.government_jobs;
DELETE FROM public.geography;
-- Courses table may have other data, be careful
DELETE FROM public.courses WHERE subdomain IN ('learn-jee', 'learn-neet', 'learn-leadership');
```

## Adding New Content

### Via Admin Dashboard

1. Navigate to admin panel
2. Select "Content Management"
3. Choose content type (Course, Module, Lesson, etc.)
4. Fill in required fields
5. Click "Save"

### Via API

```javascript
const { data, error } = await supabase
  .from('courses')
  .insert({
    title: 'New Course',
    slug: 'new-course',
    subdomain: 'learn-math',
    status: 'published',
    is_free: false,
    price: 4999
  });
```

### Via Migration Script

1. Add content to appropriate JSON file
2. Update migration script if needed
3. Re-run migration (upsert handles duplicates)

## Performance Optimization

### Enable Caching

Add caching layer for frequently accessed content:

```javascript
const CACHE_TTL = 60 * 60; // 1 hour

export async function getCachedCourses(subdomain) {
  const cacheKey = `courses:${subdomain}`;
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) return cached;
  
  // Fetch from Supabase
  const courses = await fetchCoursesFromSupabase(subdomain);
  
  // Store in cache
  setInCache(cacheKey, courses, CACHE_TTL);
  
  return courses;
}
```

### Create Database Views

For complex queries, create views:

```sql
CREATE VIEW course_summary AS
SELECT 
  c.*,
  COUNT(DISTINCT m.id) AS module_count,
  COUNT(DISTINCT l.id) AS lesson_count
FROM courses c
LEFT JOIN modules m ON m.course_id = c.id
LEFT JOIN lessons l ON l.module_id = m.id
GROUP BY c.id;
```

### Add Indexes

Monitor slow queries and add indexes:

```sql
-- Example: Index for searching courses by category
CREATE INDEX IF NOT EXISTS idx_courses_category_status 
ON courses(category, status);
```

## Monitoring

### Health Check Endpoint

Create endpoint to monitor content status:

```javascript
// /api/content/health
export default async function handler(req, res) {
  const stats = {
    courses: await countRecords('courses'),
    modules: await countRecords('modules'),
    lessons: await countRecords('lessons'),
    questions: await countRecords('questions'),
    geography: await countRecords('geography'),
    governmentJobs: await countRecords('government_jobs'),
  };
  
  return res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    content_stats: stats
  });
}
```

### Regular Audits

Schedule regular checks:
- Weekly: Verify record counts
- Monthly: Check for orphaned records
- Quarterly: Review and optimize indexes

## Next Steps

After successful migration:

1. [ ] Update all learn-apps to use Supabase
2. [ ] Add content CRUD operations to admin panel
3. [ ] Implement content versioning
4. [ ] Add content analytics
5. [ ] Set up automated backups
6. [ ] Create content contribution workflow
7. [ ] Add multi-language support
8. [ ] Implement content recommendations

## Support

For issues or questions:
- Check documentation: CONTENT_CENTRALIZATION_GUIDE.md
- Review API docs: CONTENT_API_DOCUMENTATION.md
- Check Supabase logs
- Test with curl/Postman

---

**Last Updated**: 2026-01-29  
**Version**: 1.0.0  
**Maintainer**: iiskills-cloud content migration team
