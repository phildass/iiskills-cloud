# Standardized Multi-App Supabase Schema v2

## 📋 Overview

This schema provides a comprehensive, standardized database structure that enables all 16+ learning apps in the iiskills.cloud platform to share user data, progress tracking, certificates, subscriptions, and analytics seamlessly.

**Created:** 2026-01-26  
**Version:** 2.0  
**Status:** Production Ready

---

## 🗂️ Table of Contents

1. [New Tables](#new-tables)
2. [Enhanced Tables](#enhanced-tables)
3. [Helper Functions](#helper-functions)
4. [Migration Instructions](#migration-instructions)
5. [Example Queries](#example-queries)
6. [RLS Policy Explanations](#rls-policy-explanations)
7. [Troubleshooting](#troubleshooting)

---

## 🆕 New Tables

### 1. `public.apps` - Apps Registry

Centralized registry of all learning apps and subdomains.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `subdomain` (TEXT, UNIQUE) - App subdomain (e.g., `learn-ai`)
- `display_name` (TEXT) - Human-readable name (e.g., `AI Mastery`)
- `description` (TEXT) - App description
- `category` (TEXT) - Category (Technology, Science, Exam Prep, etc.)
- `icon_url` (TEXT) - URL to app icon
- `theme_colors` (JSONB) - Theme color definitions
- `features` (JSONB) - Enabled features (paywall, certificates, etc.)
- `status` (TEXT) - Status: `active`, `maintenance`, `deprecated`
- `domain` (TEXT) - Custom domain (if any)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_apps_subdomain` on `subdomain`
- `idx_apps_status` on `status`

**Use Cases:**
- App discovery and listing
- Feature flag management per app
- Maintenance mode toggling

---

### 2. `public.user_progress` - User Progress Tracking

Track user progress across all apps uniformly.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK) - References `auth.users`
- `app_subdomain` (TEXT) - Which app this progress belongs to
- `content_type` (TEXT) - Type: `course`, `module`, `lesson`, `quiz`
- `content_id` (TEXT) - Unique content identifier
- `content_slug` (TEXT) - URL-friendly identifier
- `progress_percentage` (DECIMAL) - 0-100 completion percentage
- `status` (TEXT) - Status: `not_started`, `in_progress`, `completed`, `abandoned`
- `time_spent_seconds` (BIGINT) - Total time spent
- `last_accessed_at` (TIMESTAMPTZ) - Last access timestamp
- `completed_at` (TIMESTAMPTZ) - Completion timestamp
- `metadata` (JSONB) - Additional data (quiz scores, notes, etc.)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Unique Constraint:** `(user_id, app_subdomain, content_type, content_id)`

**Indexes:**
- `idx_user_progress_user_id` on `user_id`
- `idx_user_progress_app_subdomain` on `app_subdomain`
- `idx_user_progress_status` on `status`
- `idx_user_progress_last_accessed` on `last_accessed_at DESC`
- `idx_user_progress_composite` on `(user_id, app_subdomain, status)`

**Use Cases:**
- Resume where user left off
- Show completion percentage
- Generate progress reports

---

### 3. `public.certificates` - Certificate Management

Standardized certificate issuance across all apps.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `certificate_number` (TEXT, UNIQUE) - Certificate number (e.g., `CERT-2026-AI-00123`)
- `user_id` (UUID, FK) - References `auth.users`
- `app_subdomain` (TEXT) - Issuing app
- `course_id` (UUID, FK) - References `courses` (nullable)
- `course_title` (TEXT) - Course name
- `user_name` (TEXT) - Name on certificate
- `issue_date` (DATE) - Issue date
- `completion_date` (DATE) - Completion date
- `pdf_url` (TEXT) - URL to downloadable PDF
- `verification_code` (TEXT, UNIQUE) - 12-character verification code
- `grade` (TEXT) - Grade/score (if applicable)
- `metadata` (JSONB) - Additional data (skills, topics covered)
- `status` (TEXT) - Status: `active`, `revoked`, `expired`
- `created_at` (TIMESTAMPTZ) - Creation timestamp

**Indexes:**
- `idx_certificates_user_id` on `user_id`
- `idx_certificates_app_subdomain` on `app_subdomain`
- `idx_certificates_verification_code` on `verification_code`
- `idx_certificates_certificate_number` on `certificate_number`
- `idx_certificates_status` on `status`

**Use Cases:**
- Issue certificates on course completion
- Public certificate verification
- Certificate gallery for users

---

### 4. `public.subscriptions` - Subscription Management

Centralized payment and subscription tracking for all apps.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK) - References `auth.users`
- `app_subdomain` (TEXT, nullable) - App-specific or platform-wide (NULL)
- `plan_type` (TEXT) - Plan: `free`, `monthly`, `yearly`, `lifetime`
- `status` (TEXT) - Status: `active`, `cancelled`, `expired`, `trial`
- `starts_at` (TIMESTAMPTZ) - Start date
- `expires_at` (TIMESTAMPTZ) - Expiration date (NULL for lifetime)
- `payment_provider` (TEXT) - Payment provider name
- `payment_id` (TEXT) - External payment ID
- `amount` (DECIMAL) - Payment amount
- `currency` (TEXT) - Currency code (default: `USD`)
- `features` (JSONB) - Enabled features for this subscription
- `metadata` (JSONB) - Additional data (coupon codes, referrals)
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_subscriptions_user_id` on `user_id`
- `idx_subscriptions_status` on `status`
- `idx_subscriptions_app_subdomain` on `app_subdomain`
- `idx_subscriptions_expires_at` on `expires_at`
- `idx_subscriptions_active` on `(user_id, status, expires_at)` WHERE `status = 'active'`

**Use Cases:**
- Check if user has access to premium content
- Platform-wide subscriptions (app_subdomain = NULL)
- Subscription expiration management

---

### 5. `public.analytics_events` - Analytics Tracking

Track user behavior and events across all apps.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `user_id` (UUID, FK, nullable) - References `auth.users` (nullable for anonymous)
- `app_subdomain` (TEXT) - Which app the event occurred in
- `event_type` (TEXT) - Event type (e.g., `page_view`, `video_watched`)
- `event_category` (TEXT) - Category (e.g., `engagement`, `conversion`)
- `event_data` (JSONB) - Event-specific data
- `session_id` (TEXT) - Session identifier
- `user_agent` (TEXT) - Browser user agent
- `ip_address` (INET) - IP address
- `created_at` (TIMESTAMPTZ) - Event timestamp

**Indexes:**
- `idx_analytics_app_event_time` on `(app_subdomain, event_type, created_at DESC)`
- `idx_analytics_user_time` on `(user_id, created_at DESC)`
- `idx_analytics_session` on `session_id`

**Use Cases:**
- Track user engagement
- Analyze popular content
- Generate analytics reports

---

### 6. `public.content_library` - Shared Content

Shared resources and content across multiple apps.

**Columns:**
- `id` (UUID, PK) - Unique identifier
- `title` (TEXT) - Content title
- `content_type` (TEXT) - Type: `video`, `pdf`, `audio`, `image`
- `file_url` (TEXT) - URL to file
- `duration_seconds` (INTEGER) - Duration for media
- `file_size_bytes` (BIGINT) - File size
- `mime_type` (TEXT) - MIME type
- `description` (TEXT) - Content description
- `tags` (TEXT[]) - Array of tags
- `is_public` (BOOLEAN) - Public access flag
- `allowed_apps` (TEXT[]) - Array of allowed app subdomains
- `uploader_id` (UUID, FK) - References `auth.users`
- `access_count` (INTEGER) - Number of accesses
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

**Indexes:**
- `idx_content_library_content_type` on `content_type`
- `idx_content_library_tags` on `tags` (GIN index)
- `idx_content_library_allowed_apps` on `allowed_apps` (GIN index)
- `idx_content_library_uploader` on `uploader_id`

**Use Cases:**
- Share videos across multiple apps
- Centralized media library
- Content reusability

---

## 🔧 Enhanced Tables

### 1. `public.profiles` - User Profiles

**New Columns Added:**
- `app_preferences` (JSONB) - User preferences per app
- `last_visited_app` (TEXT) - Last visited app subdomain
- `last_visited_at` (TIMESTAMPTZ) - Last visit timestamp

**New Index:**
- `idx_profiles_last_visited_app` on `last_visited_app`

**Use Cases:**
- Remember user's last location
- Store app-specific settings

---

### 2. `public.courses` - Course Catalog

**New Columns Added:**
- `instructor_id` (UUID, FK) - References `auth.users`
- `instructor_name` (TEXT) - Instructor name
- `difficulty_level` (TEXT) - Difficulty: `beginner`, `intermediate`, `advanced`, `expert`
- `estimated_hours` (DECIMAL) - Estimated completion time
- `language` (TEXT) - Course language (default: `en`)
- `prerequisites` (TEXT[]) - Array of prerequisites
- `learning_outcomes` (TEXT[]) - Array of learning outcomes
- `certificate_enabled` (BOOLEAN) - Certificate availability
- `enrollment_count` (INTEGER) - Total enrollments
- `rating` (DECIMAL) - Average rating (0-5)
- `review_count` (INTEGER) - Number of reviews

**New Indexes:**
- `idx_courses_subdomain_enhanced` on `subdomain`
- `idx_courses_difficulty` on `difficulty_level`
- `idx_courses_rating` on `rating DESC` (partial index)
- `idx_courses_instructor` on `instructor_id`

**Use Cases:**
- Filter courses by difficulty
- Show instructor information
- Display ratings and reviews

---

## 🛠️ Helper Functions

### 1. `is_admin()`

Check if the current user is an admin.

**Returns:** `BOOLEAN`

**Example:**
```sql
SELECT is_admin();
-- Returns: true or false
```

**Usage in RLS Policies:**
```sql
CREATE POLICY "Admins can do anything"
  ON some_table
  USING (is_admin());
```

---

### 2. `has_active_subscription(p_app_subdomain TEXT)`

Check if user has an active subscription for a specific app or platform-wide.

**Parameters:**
- `p_app_subdomain` (TEXT, optional) - App to check, or NULL for any subscription

**Returns:** `BOOLEAN`

**Examples:**
```sql
-- Check for any active subscription
SELECT has_active_subscription(NULL);

-- Check for learn-ai subscription
SELECT has_active_subscription('learn-ai');
```

**Usage in Application:**
```typescript
const { data, error } = await supabase
  .rpc('has_active_subscription', { p_app_subdomain: 'learn-ai' });

if (data) {
  // User has access
}
```

---

### 3. `get_user_progress_summary(p_app_subdomain TEXT)`

Get aggregated progress statistics for the current user.

**Parameters:**
- `p_app_subdomain` (TEXT, optional) - App to filter, or NULL for all apps

**Returns:** Table with columns:
- `app` (TEXT) - App subdomain
- `total_items` (INTEGER) - Total items tracked
- `completed_items` (INTEGER) - Completed items
- `in_progress_items` (INTEGER) - In-progress items
- `total_time_seconds` (BIGINT) - Total time spent
- `completion_percentage` (DECIMAL) - Overall completion %

**Examples:**
```sql
-- Get progress across all apps
SELECT * FROM get_user_progress_summary(NULL);

-- Get progress for learn-math
SELECT * FROM get_user_progress_summary('learn-math');
```

**Sample Output:**
```
app          | total_items | completed | in_progress | total_time | completion_%
-------------|-------------|-----------|-------------|------------|-------------
learn-ai     | 25          | 15        | 8           | 18000      | 60.00
learn-math   | 40          | 30        | 5           | 25200      | 75.00
```

---

### 4. `generate_certificate_number(p_app_subdomain TEXT)`

Generate a unique certificate number.

**Parameters:**
- `p_app_subdomain` (TEXT) - App subdomain

**Returns:** `TEXT` (format: `CERT-YYYY-APP-NNNNN`)

**Example:**
```sql
SELECT generate_certificate_number('learn-ai');
-- Returns: CERT-2026-AI-00001
```

---

### 5. `generate_verification_code()`

Generate a unique 12-character verification code for certificates.

**Returns:** `TEXT` (12-character alphanumeric)

**Example:**
```sql
SELECT generate_verification_code();
-- Returns: A3F7K9M2P1Q8
```

---

### 6. `increment_content_access_count(p_content_id UUID)`

Increment the access count for a content item.

**Parameters:**
- `p_content_id` (UUID) - Content library item ID

**Returns:** `VOID`

**Example:**
```sql
SELECT increment_content_access_count('550e8400-e29b-41d4-a716-446655440000');
```

---

## 📝 Migration Instructions

### **Step 1: Access Supabase Dashboard**

1. Go to https://supabase.com
2. Sign in to your account
3. Select your project (the one used by iiskills-cloud)

### **Step 2: Navigate to SQL Editor**

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**

### **Step 3: Run Migrations in Order**

**⚠️ IMPORTANT: Run in this exact order!**

#### Migration 1: Main Schema

1. Open the file: `supabase/migrations/standardized_schema_v2.sql`
2. Copy the entire contents
3. Paste into the SQL Editor
4. Click **Run** (or press Ctrl+Enter)
5. Wait for success message in console

**Expected Output:**
```
NOTICE: ========================================
NOTICE: STANDARDIZED SCHEMA V2 MIGRATION COMPLETE!
NOTICE: ========================================
...
```

#### Migration 2: Helper Functions

1. Click **New Query** again
2. Open the file: `supabase/migrations/helper_functions.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for success message

**Expected Output:**
```
NOTICE: ========================================
NOTICE: HELPER FUNCTIONS CREATED SUCCESSFULLY!
NOTICE: ========================================
...
```

#### Migration 3: Seed Data

1. Click **New Query** again
2. Open the file: `supabase/migrations/seed_apps_data.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click **Run**
6. Wait for success message

**Expected Output:**
```
NOTICE: ========================================
NOTICE: APPS REGISTRY SEED DATA COMPLETE!
NOTICE: Total apps in registry: 16
NOTICE: ========================================
...
```

### **Step 4: Verify Tables Were Created**

1. Go to **Table Editor** in the left sidebar
2. You should see these new tables:
   - ✅ `apps`
   - ✅ `user_progress`
   - ✅ `certificates`
   - ✅ `subscriptions`
   - ✅ `analytics_events`
   - ✅ `content_library`

3. Check that existing tables were enhanced:
   - Click on `profiles` table
   - Verify new columns: `app_preferences`, `last_visited_app`, `last_visited_at`
   - Click on `courses` table
   - Verify new columns: `instructor_id`, `difficulty_level`, `rating`, etc.

### **Step 5: Verify Data Was Seeded**

1. In the Table Editor, click on the `apps` table
2. You should see 16 rows with all the learning apps
3. Verify apps include: `learn-ai`, `learn-math`, `learn-jee`, etc.

---

## 💡 Example Queries

### Track User Progress

```sql
-- Insert or update user progress
INSERT INTO user_progress (
  user_id, 
  app_subdomain, 
  content_type, 
  content_id, 
  content_slug,
  progress_percentage,
  status,
  time_spent_seconds
)
VALUES (
  auth.uid(),
  'learn-ai',
  'course',
  'ai-fundamentals',
  'ai-fundamentals',
  45.5,
  'in_progress',
  3600
)
ON CONFLICT (user_id, app_subdomain, content_type, content_id)
DO UPDATE SET
  progress_percentage = EXCLUDED.progress_percentage,
  status = EXCLUDED.status,
  time_spent_seconds = user_progress.time_spent_seconds + EXCLUDED.time_spent_seconds,
  last_accessed_at = NOW();
```

### Issue a Certificate

```sql
INSERT INTO certificates (
  certificate_number,
  user_id,
  app_subdomain,
  course_title,
  user_name,
  completion_date,
  verification_code,
  status
)
VALUES (
  generate_certificate_number('learn-ai'),
  auth.uid(),
  'learn-ai',
  'AI Fundamentals',
  'John Doe',
  CURRENT_DATE,
  generate_verification_code(),
  'active'
);
```

### Check Subscription Access

```sql
-- Check if user can access premium content
SELECT has_active_subscription('learn-ai') AS has_access;

-- Get user's active subscriptions
SELECT 
  app_subdomain,
  plan_type,
  starts_at,
  expires_at
FROM subscriptions
WHERE user_id = auth.uid()
  AND status = 'active'
  AND (expires_at IS NULL OR expires_at > NOW());
```

### Get User's Learning Dashboard

```sql
-- Get comprehensive progress across all apps
SELECT 
  a.display_name,
  a.category,
  p.total_items,
  p.completed_items,
  p.completion_percentage,
  ROUND(p.total_time_seconds / 3600.0, 1) AS hours_spent
FROM get_user_progress_summary(NULL) p
JOIN apps a ON a.subdomain = p.app
ORDER BY p.completion_percentage DESC;
```

### Track Analytics Event

```sql
INSERT INTO analytics_events (
  user_id,
  app_subdomain,
  event_type,
  event_category,
  event_data,
  session_id
)
VALUES (
  auth.uid(),
  'learn-ai',
  'video_watched',
  'engagement',
  '{"video_id": "intro-to-ml", "duration_watched": 300, "total_duration": 600}'::JSONB,
  'session_abc123'
);
```

### Get Popular Content

```sql
-- Most accessed content in content library
SELECT 
  title,
  content_type,
  access_count,
  tags
FROM content_library
WHERE is_public = true
ORDER BY access_count DESC
LIMIT 10;
```

---

## 🔒 RLS Policy Explanations

### `apps` Table

- **Public Read:** Everyone can view apps (for discovery)
- **Admin Write:** Only admins can create/update apps

### `user_progress` Table

- **Own Data Only:** Users can only view/insert/update their own progress
- **No Cross-User Access:** Users cannot see other users' progress

### `certificates` Table

- **Own Certificates:** Users can view their own certificates
- **Public Verification:** Anyone can verify certificates using verification code

### `subscriptions` Table

- **Own Data Only:** Users can only view their own subscriptions
- **Insert by Payment System:** Typically inserted by backend payment webhooks

### `analytics_events` Table

- **Insert Only:** Anyone can insert events (for anonymous tracking)
- **No Read Access via RLS:** Analytics should be read via backend/admin tools

### `content_library` Table

- **Public Content:** Public content is viewable by everyone
- **Authenticated Access:** Authenticated users can view content (refined by app logic)

---

## 🔍 Troubleshooting

### Issue: Tables not appearing in Table Editor

**Solution:**
1. Refresh the page
2. Make sure you're in the correct project
3. Check the SQL Editor output for errors
4. Verify you ran all migrations in order

### Issue: "Permission denied" errors

**Solution:**
1. Make sure RLS policies are correctly created
2. Verify you're authenticated (check `auth.uid()`)
3. For testing, you can temporarily disable RLS:
   ```sql
   ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
   ```
   **⚠️ Remember to re-enable it!**

### Issue: Foreign key constraint errors

**Solution:**
1. Make sure the `profiles` and `courses` tables exist first
2. Run migrations in the correct order
3. Check that referenced data exists

### Issue: Duplicate key errors when running seed data

**Solution:**
This is expected! The seed data script uses `ON CONFLICT DO NOTHING`, so re-running it is safe and won't create duplicates.

### Issue: Functions not working

**Solution:**
1. Make sure helper_functions.sql ran successfully
2. Check function permissions with:
   ```sql
   SELECT routine_name, routine_type
   FROM information_schema.routines
   WHERE routine_schema = 'public';
   ```
3. Re-run helper_functions.sql if needed (it's idempotent)

### Issue: Timestamp triggers not working

**Solution:**
1. Verify triggers were created:
   ```sql
   SELECT trigger_name, event_object_table
   FROM information_schema.triggers
   WHERE trigger_schema = 'public';
   ```
2. Re-run helper_functions.sql to recreate triggers

---

## 🎯 What Gets Created

### ✅ 6 New Tables
- All with proper indexes
- All with RLS policies configured
- All with helpful comments

### ✅ 2 Enhanced Tables
- New columns added (non-destructive)
- New indexes for performance
- Backward compatible

### ✅ 7 Helper Functions
- Admin checking
- Subscription validation
- Progress aggregation
- Certificate number generation
- And more!

### ✅ 16 Apps Seeded
- All learning apps populated
- Features configured
- Ready for production

### ✅ Automatic Triggers
- Auto-update timestamps
- Auto-increment enrollment counts
- Auto-track content access

---

## 🚀 Next Steps

After migration is complete:

1. **No Code Changes Required:** All existing apps will continue to work
2. **Optional Enhancements:** Update your app code to use new tables for enhanced features
3. **Monitor Performance:** New indexes should improve query performance
4. **Start Using Features:**
   - Track user progress
   - Issue certificates
   - Manage subscriptions
   - Collect analytics

---

## 📞 Support

If you encounter issues:

1. Check the Troubleshooting section above
2. Review the migration output for error messages
3. Verify all prerequisites are met
4. Check Supabase logs in the Dashboard

---

## 📄 License

This schema is part of the iiskills.cloud project.

---

**Last Updated:** 2026-01-26  
**Schema Version:** 2.0  
**Compatible With:** Supabase PostgreSQL 15+
