# Supabase Migrations Guide

## 📚 Overview

This directory contains SQL migration files for the iiskills.cloud platform. These migrations create and enhance the database schema to support all 16+ learning apps with shared functionality.

---

## 📁 Migration Files

### Current Migrations (v2 - Latest)

1. **`standardized_schema_v2.sql`** - Main schema with 6 new tables
2. **`helper_functions.sql`** - Utility functions and triggers
3. **`seed_apps_data.sql`** - Populate apps registry with all learning apps

### Legacy Migrations (v1)

- `newsletter_subscribers.sql` - Newsletter subscription system
- `courses_and_newsletter.sql` - Course catalog and AI newsletter
- `add_newsletter_subscription_to_profiles.sql` - Profile enhancements
- `add_newsletter_approval_workflow.sql` - Newsletter approval flow

---

## 🎯 Migration Order

**⚠️ CRITICAL: Run migrations in this exact order!**

### For Fresh Database (No Existing Schema)

1. First, create the base profiles table:
   - Run `../profiles_schema.sql` (if not already exists)

2. Then run legacy migrations (if needed):
   - `newsletter_subscribers.sql`
   - `courses_and_newsletter.sql`
   - `add_newsletter_subscription_to_profiles.sql`
   - `add_newsletter_approval_workflow.sql`

3. Finally, run v2 migrations:
   - `standardized_schema_v2.sql` ✅
   - `helper_functions.sql` ✅
   - `seed_apps_data.sql` ✅

### For Existing Database (Upgrading to v2)

If you already have the profiles and courses tables:

1. **`standardized_schema_v2.sql`** - Creates new tables and enhances existing ones
2. **`helper_functions.sql`** - Adds utility functions
3. **`seed_apps_data.sql`** - Populates apps registry

**Time Required:** ~5-10 minutes total

---

## 🚀 How to Run Migrations in Supabase Dashboard

### Step 1: Access Supabase Dashboard

1. Navigate to https://supabase.com
2. Sign in to your account
3. Select your **iiskills-cloud** project

### Step 2: Open SQL Editor

1. Click **SQL Editor** in the left sidebar
2. Click the **New Query** button

### Step 3: Run Each Migration

For each migration file:

1. **Open the file** on your local machine (in this `migrations` folder)
2. **Copy the entire contents** (Ctrl+A, Ctrl+C)
3. **Paste into SQL Editor** in Supabase
4. **Click "Run"** button (or press Ctrl+Enter)
5. **Wait for success message** in the output panel

**Expected Output:**
```
NOTICE: ========================================
NOTICE: [MIGRATION NAME] COMPLETE!
NOTICE: ========================================
```

6. **Repeat** for the next migration file

---

## ✅ How to Verify Migrations Succeeded

### Method 1: Check Tables (Visual)

1. Go to **Table Editor** in left sidebar
2. Verify you see these new tables:
   - ✅ `apps`
   - ✅ `user_progress`
   - ✅ `certificates`
   - ✅ `subscriptions`
   - ✅ `analytics_events`
   - ✅ `content_library`

### Method 2: Run Verification Queries

In SQL Editor, run:

```sql
-- Check all tables exist
SELECT table_name 
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
  )
ORDER BY table_name;
```

**Expected:** All 8 table names should be returned.

```sql
-- Check apps were seeded
SELECT COUNT(*) as total_apps FROM public.apps;
```

**Expected:** Should return `16`.

```sql
-- Check functions were created
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_admin',
    'has_active_subscription',
    'get_user_progress_summary',
    'generate_certificate_number',
    'generate_verification_code'
  )
ORDER BY routine_name;
```

**Expected:** All 5 function names should be returned.

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN (
    'apps',
    'user_progress',
    'certificates',
    'subscriptions',
    'analytics_events',
    'content_library'
  );
```

**Expected:** All tables should have `rowsecurity = true`.

---

## 🔄 Rollback Instructions

### ⚠️ Important Notes

- These migrations are **additive** (they don't delete existing data)
- Rollback is generally **not needed**
- Only rollback if you encounter critical errors

### Full Rollback (If Needed)

If you need to completely remove the v2 schema:

```sql
-- Drop new tables (in reverse order due to dependencies)
DROP TABLE IF EXISTS public.content_library CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;

-- Drop helper functions
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_active_subscription(TEXT);
DROP FUNCTION IF EXISTS public.get_user_progress_summary(TEXT);
DROP FUNCTION IF EXISTS public.generate_certificate_number(TEXT);
DROP FUNCTION IF EXISTS public.generate_verification_code();
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.increment_content_access_count(UUID);
DROP FUNCTION IF EXISTS public.update_course_enrollment_count() CASCADE;

-- Revert profiles table changes
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS app_preferences,
  DROP COLUMN IF EXISTS last_visited_app,
  DROP COLUMN IF EXISTS last_visited_at;

-- Revert courses table changes
ALTER TABLE public.courses 
  DROP COLUMN IF EXISTS instructor_id,
  DROP COLUMN IF EXISTS instructor_name,
  DROP COLUMN IF EXISTS difficulty_level,
  DROP COLUMN IF EXISTS estimated_hours,
  DROP COLUMN IF EXISTS language,
  DROP COLUMN IF EXISTS prerequisites,
  DROP COLUMN IF EXISTS learning_outcomes,
  DROP COLUMN IF EXISTS certificate_enabled,
  DROP COLUMN IF EXISTS enrollment_count,
  DROP COLUMN IF EXISTS rating,
  DROP COLUMN IF EXISTS review_count;
```

**⚠️ WARNING:** This will delete all data in the new tables!

### Partial Rollback (Remove Only New Tables)

If you want to keep the enhanced columns but remove new tables:

```sql
DROP TABLE IF EXISTS public.content_library CASCADE;
DROP TABLE IF EXISTS public.analytics_events CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.apps CASCADE;
```

---

## 📋 What to Do After Migration

### 1. **No Immediate Action Required**

All existing apps will continue to work without code changes. The migrations are backward compatible.

### 2. **Optional: Update Your Apps**

To use new features, update your application code:

#### Track User Progress

```typescript
// In your app's course/lesson component
const { error } = await supabase
  .from('user_progress')
  .upsert({
    user_id: user.id,
    app_subdomain: 'learn-ai',
    content_type: 'course',
    content_id: courseId,
    content_slug: courseSlug,
    progress_percentage: 75,
    status: 'in_progress',
    time_spent_seconds: 3600
  });
```

#### Check Subscription Access

```typescript
// Check if user has premium access
const { data: hasAccess } = await supabase
  .rpc('has_active_subscription', { 
    p_app_subdomain: 'learn-ai' 
  });

if (!hasAccess) {
  // Show paywall
}
```

#### Get User Progress

```typescript
// Get user's progress summary
const { data: progress } = await supabase
  .rpc('get_user_progress_summary', { 
    p_app_subdomain: null // or specific app
  });

console.log(progress);
// [
//   { app: 'learn-ai', total_items: 25, completed_items: 15, ... },
//   { app: 'learn-math', total_items: 40, completed_items: 30, ... }
// ]
```

#### Issue Certificates

```typescript
// Issue a certificate on course completion
const { data: certNumber } = await supabase
  .rpc('generate_certificate_number', { 
    p_app_subdomain: 'learn-ai' 
  });

const { data: verifyCode } = await supabase
  .rpc('generate_verification_code');

const { error } = await supabase
  .from('certificates')
  .insert({
    certificate_number: certNumber,
    user_id: user.id,
    app_subdomain: 'learn-ai',
    course_title: 'AI Fundamentals',
    user_name: user.full_name,
    completion_date: new Date().toISOString().split('T')[0],
    verification_code: verifyCode,
    status: 'active'
  });
```

### 3. **Monitor Performance**

The migrations add numerous indexes for performance. Monitor your queries to ensure they're using the indexes:

```sql
EXPLAIN ANALYZE
SELECT * FROM user_progress 
WHERE user_id = 'user-uuid' 
  AND app_subdomain = 'learn-ai';
```

---

## 🐛 Common Issues and Solutions

### Issue: "relation already exists"

**Cause:** Migration was already run  
**Solution:** This is normal! The migrations use `CREATE TABLE IF NOT EXISTS` and are idempotent. You can safely ignore this.

### Issue: "permission denied for table"

**Cause:** RLS policies are active  
**Solution:** Make sure you're authenticated. For testing, you can use:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Re-enable when done
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Issue: "column already exists"

**Cause:** Enhancement was already applied  
**Solution:** This is expected! The migrations handle this gracefully with `ADD COLUMN IF NOT EXISTS`.

### Issue: Function not found

**Cause:** helper_functions.sql wasn't run  
**Solution:** Run helper_functions.sql from the SQL Editor.

### Issue: No apps in registry

**Cause:** seed_apps_data.sql wasn't run  
**Solution:** Run seed_apps_data.sql from the SQL Editor.

---

## 🔧 Maintenance

### Regular Tasks

1. **Backup Before Major Changes**
   - Use Supabase's built-in backup feature before running new migrations

2. **Monitor Table Sizes**
   ```sql
   SELECT 
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   WHERE schemaname = 'public'
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```

3. **Vacuum Analyze**
   ```sql
   VACUUM ANALYZE public.user_progress;
   VACUUM ANALYZE public.analytics_events;
   ```

### Adding New Migrations

When adding new migrations:

1. Create a descriptive filename with date: `YYYY_MM_DD_description.sql`
2. Add to this README under "Migration Files"
3. Make migrations idempotent (use `IF NOT EXISTS`, `CREATE OR REPLACE`, etc.)
4. Add success messages using `RAISE NOTICE`
5. Document rollback procedures

---

## 📖 Additional Resources

- **Full Documentation:** See `SUPABASE_SCHEMA_V2.md` in project root
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## ✅ Quick Checklist

Use this checklist when running migrations:

- [ ] Backed up database (or verified auto-backups are enabled)
- [ ] Opened Supabase Dashboard → SQL Editor
- [ ] Ran `standardized_schema_v2.sql` ✅
- [ ] Verified success message appeared
- [ ] Ran `helper_functions.sql` ✅
- [ ] Verified success message appeared
- [ ] Ran `seed_apps_data.sql` ✅
- [ ] Verified success message appeared
- [ ] Checked Table Editor for new tables
- [ ] Verified 16 apps in `apps` table
- [ ] Ran verification queries (all passed)
- [ ] Tested a sample query in each new table
- [ ] Existing apps still work (smoke test)
- [ ] Documented completion date: __________

---

**Last Updated:** 2026-01-26  
**Migration Version:** v2.0  
**Total Migration Time:** ~5-10 minutes
