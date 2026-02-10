# Supabase Content Sync Setup Guide

This guide provides step-by-step instructions for setting up automated content synchronization from your repository to Supabase.

## Overview

The content sync system automatically syncs ALL content in your repository to Supabase whenever changes are pushed to the `main` branch. This makes Supabase the single source of truth for your admin section.

### What Gets Synced

The sync script recursively scans and syncs:

- **Main seed data**: `/seeds/content.json` (courses, modules, lessons, questions)
- **Sync platform content**: `/data/sync-platform/**` (structured content for all apps)
- **App-specific seeds**: `/apps/learn-*/data/seed.json`
- **App content directories**: `/apps/learn-*/content/**` (future-proofing)
- **Geography data**: `/apps/learn-govt-jobs/data/geography.json`
- **Government jobs**: `/apps/learn-govt-jobs/data/deadlines.json`
- **Other data sources**: `/data/squads/**`, `/data/fixtures/**`

## Prerequisites

Before setting up the sync system, ensure you have:

1. A Supabase project with all required tables created
2. Repository admin access to set GitHub Secrets
3. Node.js 20+ installed locally for testing

## Step 1: Get Supabase Credentials

### 1.1 Get Your Supabase URL

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (e.g., `https://xxxxx.supabase.co`)

### 1.2 Get Your Service Role Key

⚠️ **Important**: You need the **Service Role Key**, NOT the anon key!

1. In the same **Settings** → **API** page
2. Scroll down to **Project API keys**
3. Find the **service_role** key (it's hidden by default)
4. Click **Reveal** and copy the key
5. **Keep this key secret!** It has admin access to your database

## Step 2: Set Up GitHub Secrets

### 2.1 Navigate to Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2.2 Add SUPABASE_URL Secret

1. Name: `SUPABASE_URL`
2. Secret: Paste your Supabase Project URL (from Step 1.1)
3. Click **Add secret**

### 2.3 Add SUPABASE_SERVICE_ROLE_KEY Secret

1. Click **New repository secret** again
2. Name: `SUPABASE_SERVICE_ROLE_KEY`
3. Secret: Paste your Service Role Key (from Step 1.2)
4. Click **Add secret**

### 2.4 Verify Secrets

You should now see two secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

✅ Secrets are encrypted and hidden. You won't be able to view them again, but you can update them.

## Step 3: Verify Supabase Schema

Ensure your Supabase database has the following tables:

### Required Tables

1. **courses**: `id`, `slug`, `title`, `short_description`, `full_description`, `duration`, `category`, `subdomain`, `price`, `is_free`, `status`, `created_at`, `updated_at`

2. **modules**: `id`, `course_id`, `slug`, `title`, `description`, `order_index`, `created_at`, `updated_at`

3. **lessons**: `id`, `module_id`, `slug`, `title`, `content`, `duration`, `order_index`, `created_at`, `updated_at`

4. **questions**: `id`, `lesson_id`, `question_text`, `question_type`, `options`, `correct_answer`, `explanation`, `difficulty`, `created_at`, `updated_at`

5. **geography**: `id`, `name`, `type`, `parent_id`, `created_at`, `updated_at`

6. **government_jobs**: `id`, `job_id`, `title`, `department`, `level`, `location_state`, `location_district`, `position_type`, `education_requirement`, `age_min`, `age_max`, `age_relaxations`, `physical_fitness_required`, `application_deadline`, `notification_date`, `exam_date`, `physical_test_date`, `interview_date`, `status`, `created_at`, `updated_at`

7. **content_library** (optional): For storing sync-platform and other structured content

### Schema Migration

If you don't have these tables, run the migrations in `/supabase/migrations/` directory:

```bash
# Using Supabase CLI
supabase db push

# Or manually apply migrations in Supabase Dashboard → SQL Editor
```

## Step 4: Test the Sync Locally (Optional but Recommended)

Before relying on the GitHub Action, test the sync script locally:

### 4.1 Install Dependencies

```bash
yarn install
```

### 4.2 Create Local Environment File

Create a `.env.local` file in the root directory:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-service-role-key-here
```

⚠️ **Never commit `.env.local` to Git!** (It's already in `.gitignore`)

### 4.3 Run the Sync Script

```bash
node scripts/sync_to_supabase.js
```

### 4.4 Expected Output

You should see output like:

```
========================================
  COMPREHENSIVE CONTENT SYNC TO SUPABASE
========================================

[timestamp] ℹ️  Supabase URL: https://xxxxx.supabase.co
[timestamp] ℹ️  Starting comprehensive content sync...

[timestamp] 📦 Processing main seed file...
[timestamp] 📚 Migrating 3 courses from /path/to/seeds/content.json...
[timestamp] ✅ Courses: 3 created, 0 updated, 0 errors
[timestamp] 📖 Migrating 10 modules from /path/to/seeds/content.json...
...

========================================
  SYNC COMPLETE!
========================================

📊 Summary:
  ⏱️  Duration: 2.45s
  📁 Files Processed: 25
  ⏭️  Files Skipped: 0

📚 Content Synced:
  Courses:        3 created, 0 updated, 0 errors
  Modules:        10 created, 0 updated, 0 errors
  Lessons:        45 created, 0 updated, 0 errors
  Questions:      150 created, 0 updated, 0 errors
  Geography:      500 created, 0 errors
  Govt Jobs:      100 created, 0 errors
  Sync Platform:  25 processed, 0 errors
  ...

[timestamp] ✅ Sync completed successfully! ✨
```

### 4.5 Verify in Supabase

1. Go to Supabase Dashboard → **Table Editor**
2. Check each table to verify data was imported
3. Check row counts match the sync output

## Step 5: Test the GitHub Action

### 5.1 Trigger the Workflow Manually

1. Go to your repository on GitHub
2. Click **Actions** (top menu)
3. Select **Sync Content to Supabase** workflow
4. Click **Run workflow** → **Run workflow**
5. Wait for the workflow to complete

### 5.2 Check Workflow Status

- Green checkmark (✅) = Success
- Red X (❌) = Failure

### 5.3 View Workflow Logs

1. Click on the workflow run
2. Click on the **Sync Content to Supabase** job
3. Expand each step to view detailed logs
4. Look for the sync summary at the end

### 5.4 Troubleshooting Workflow Failures

If the workflow fails:

1. **Check secrets**: Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
2. **Check table schema**: Ensure all required tables exist in Supabase
3. **Check logs**: Look for specific error messages in the workflow output
4. **Download logs**: Failed runs upload logs as artifacts (available for 7 days)

## Step 6: Automatic Sync on Content Changes

Once set up, the sync happens automatically when you push changes to:

- `/seeds/**`
- `/data/**`
- `/apps/learn-*/data/**`
- `/apps/learn-*/content/**`

### Workflow Behavior

- **Triggered on**: Push to `main` branch affecting content files
- **Concurrency**: Only one sync at a time (prevents conflicts)
- **Duration**: ~1-5 minutes depending on content volume
- **On failure**: Uploads logs as artifacts for debugging

## Error Handling & Monitoring

### Built-in Error Handling

The sync script includes robust error handling:

1. **File read errors**: Logged and skipped (doesn't stop entire sync)
2. **Database upsert errors**: Logged per-item, continues with remaining items
3. **Unknown content types**: Logged with recommendations for schema extension
4. **Network errors**: Fatal error with stack trace

### Error Notifications

The workflow includes a failure notification step. To enable notifications:

1. Set up a webhook URL (e.g., Slack, Discord, Teams)
2. Add it as a GitHub Secret: `NOTIFICATION_WEBHOOK_URL`
3. Uncomment the notification code in `.github/workflows/sync-content.yml`:

```yaml
- name: Send notification on failure
  if: failure()
  run: |
    curl -X POST ${{ secrets.NOTIFICATION_WEBHOOK_URL }} \
      -H 'Content-Type: application/json' \
      -d '{"text":"Content sync failed for ${{ github.repository }}"}'
```

### Monitoring Recommendations

1. **Check workflow runs regularly**: Go to Actions tab weekly
2. **Review unknown types**: When logged, extend schema or handle in sync script
3. **Monitor sync duration**: Increasing duration may indicate performance issues
4. **Set up email notifications**: GitHub can email you on workflow failures

## Advanced Configuration

### Customizing Sync Triggers

Edit `.github/workflows/sync-content.yml` to change when sync runs:

```yaml
on:
  push:
    branches:
      - main
      - production  # Add more branches
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight UTC
  workflow_dispatch:  # Manual trigger
```

### Adding New Content Sources

When you add new content directories:

1. Add them to the `paths` filter in the workflow
2. Update `sync_to_supabase.js` to process them
3. Extend Supabase schema if needed
4. Test locally before pushing

### Performance Optimization

For large repositories:

1. Use batch inserts/updates (already implemented via `upsert`)
2. Add pagination for very large datasets
3. Consider partial syncs (only changed files)
4. Use database indexes for faster lookups

## Troubleshooting Guide

### Problem: "Missing Supabase credentials" Error

**Solution**: Verify GitHub Secrets are set correctly

```bash
# Secrets should be visible in:
# Repository → Settings → Secrets and variables → Actions
```

### Problem: "Table does not exist" Error

**Solution**: Run Supabase migrations

```bash
supabase db push
# Or apply migrations manually in Supabase Dashboard
```

### Problem: Sync Succeeds but Admin Shows No Data

**Possible causes**:
1. Admin is reading from wrong Supabase instance
2. Row Level Security (RLS) is blocking access
3. Admin queries use different table/column names

**Solution**:
```sql
-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'courses';

-- Temporarily disable RLS for testing
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;

-- Check data exists
SELECT COUNT(*) FROM courses;
```

### Problem: "Permission denied" Errors

**Solution**: Ensure you're using the **Service Role Key**, not the anon key

```bash
# Service role key starts with: eyJhbGc...
# It's much longer than the anon key
# Get it from: Supabase Dashboard → Settings → API → service_role key
```

### Problem: Sync is Slow

**Optimizations**:
1. Add database indexes on frequently queried columns
2. Use batch operations (already implemented)
3. Reduce log verbosity
4. Consider incremental syncs

## Security Best Practices

1. ✅ **Use Service Role Key**: Required for admin operations
2. ✅ **Store in GitHub Secrets**: Never hardcode credentials
3. ✅ **Limit access**: Only give repository collaborators access to secrets
4. ✅ **Rotate keys regularly**: Update secrets every 90 days
5. ✅ **Monitor access logs**: Check Supabase logs for unusual activity
6. ✅ **Use RLS policies**: Protect data even if keys are compromised

## Getting Help

If you encounter issues:

1. Check this guide thoroughly
2. Review workflow logs in GitHub Actions
3. Check Supabase logs in Dashboard → Logs
4. Test sync script locally with verbose logging
5. Verify table schemas match expected structure

## Success Checklist

Before going live, verify:

- [ ] GitHub Secrets are set (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] All required Supabase tables exist
- [ ] Local test sync completed successfully
- [ ] Manual workflow run succeeded
- [ ] Admin section shows all synced content
- [ ] Automatic sync triggers on content changes
- [ ] Error notifications are configured (optional)
- [ ] Documentation is updated for your team

## Summary

You now have a fully automated content sync system:

1. ✅ **Comprehensive coverage**: All content sources are synced
2. ✅ **Automatic**: Triggers on every content change
3. ✅ **Reliable**: Robust error handling and logging
4. ✅ **Monitored**: GitHub Actions provides full visibility
5. ✅ **Extensible**: Easy to add new content sources

Your admin section will always show up-to-date content from Supabase! 🎉
