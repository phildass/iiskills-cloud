# ✅ Schema v2 Migration Checklist

Use this checklist when running the Schema v2 migrations in your Supabase Dashboard.

---

## 📋 Pre-Migration

- [ ] Backed up database (or verified auto-backups are enabled in Supabase)
- [ ] Confirmed project in Supabase Dashboard is correct
- [ ] Have the migration files ready to copy/paste

---

## 🚀 Migration Steps

### Step 1: Main Schema Migration

- [ ] Opened Supabase Dashboard → SQL Editor
- [ ] Clicked "New Query"
- [ ] Copied contents of `supabase/migrations/standardized_schema_v2.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run" (or pressed Ctrl+Enter)
- [ ] Saw success message:
  ```
  NOTICE: STANDARDIZED SCHEMA V2 MIGRATION COMPLETE!
  ```
- [ ] Checked for any error messages (if any, stop and troubleshoot)

**Time taken:** ________

### Step 2: Helper Functions

- [ ] Clicked "New Query" in SQL Editor
- [ ] Copied contents of `supabase/migrations/helper_functions.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Saw success message:
  ```
  NOTICE: HELPER FUNCTIONS CREATED SUCCESSFULLY!
  ```
- [ ] Checked for any error messages

**Time taken:** ________

### Step 3: Seed Apps Data

- [ ] Clicked "New Query" in SQL Editor
- [ ] Copied contents of `supabase/migrations/seed_apps_data.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] Saw success message:
  ```
  NOTICE: APPS REGISTRY SEED DATA COMPLETE!
  NOTICE: Total apps in registry: 16
  ```
- [ ] Checked for any error messages

**Time taken:** ________

---

## ✅ Verification Steps

### Visual Verification

- [ ] Went to Supabase Dashboard → Table Editor
- [ ] Confirmed new tables appear:
  - [ ] `apps`
  - [ ] `user_progress`
  - [ ] `certificates`
  - [ ] `subscriptions`
  - [ ] `analytics_events`
  - [ ] `content_library`
- [ ] Clicked on `profiles` table
  - [ ] Confirmed new columns: `app_preferences`, `last_visited_app`, `last_visited_at`
- [ ] Clicked on `courses` table
  - [ ] Confirmed new columns: `instructor_id`, `difficulty_level`, `rating`, etc.
- [ ] Clicked on `apps` table
  - [ ] Confirmed 16 rows of data (all learning apps)

### Automated Validation

- [ ] Clicked "New Query" in SQL Editor
- [ ] Copied contents of `supabase/migrations/validate_schema_v2.sql`
- [ ] Pasted into SQL Editor
- [ ] Clicked "Run"
- [ ] All checks show "✓ PASS":
  - [ ] Tables Check: 8/8
  - [ ] Apps Seeded: 16/16
  - [ ] Helper Functions: 8/8
  - [ ] RLS Enabled: 8/8
  - [ ] Indexes Created: 29+
  - [ ] Profiles Enhanced: 3/3
  - [ ] Courses Enhanced: 11/11
  - [ ] Triggers Created: 5+
- [ ] Saw final message: "✓ ALL CHECKS PASSED!"

---

## 🎉 Post-Migration

- [ ] All existing apps still work (smoke test)
- [ ] No errors in application logs
- [ ] Documented completion date: __________________
- [ ] Notified team that schema v2 is live

---

## 📚 Next Steps (Optional)

- [ ] Read `SUPABASE_SCHEMA_V2.md` for full documentation
- [ ] Read `SCHEMA_V2_QUICK_REFERENCE.md` for developer examples
- [ ] Update app code to use new features:
  - [ ] Progress tracking
  - [ ] Subscription checks
  - [ ] Certificate issuance
  - [ ] Analytics tracking
- [ ] Configure app-specific features in `apps` table
- [ ] Set up payment webhooks for subscriptions

---

## 🐛 Troubleshooting

### If Migration Fails

1. [ ] Check error message in SQL Editor output
2. [ ] Consult Troubleshooting section in `SUPABASE_SCHEMA_V2.md`
3. [ ] Check if migration was already run (many errors are safe to ignore)
4. [ ] If needed, refer to rollback instructions in `supabase/migrations/README.md`

### Common Issues

- **"relation already exists"** → ✅ Safe to ignore (migrations are idempotent)
- **"column already exists"** → ✅ Safe to ignore (migrations are idempotent)
- **"permission denied"** → Check RLS policies and authentication
- **No apps in registry** → Make sure you ran `seed_apps_data.sql`

---

## 📊 Migration Summary

**Total time spent:** ________ minutes

**Files created:**
- ✅ 6 new tables
- ✅ 8 helper functions
- ✅ 11 RLS policies
- ✅ 29+ indexes
- ✅ 5+ triggers
- ✅ Enhanced 2 existing tables
- ✅ Seeded 16 apps

**Status:** 
- [ ] ✅ Complete and verified
- [ ] ⚠️ Complete with minor issues (document below)
- [ ] ❌ Failed (document issues below)

**Notes:**
```
_____________________________________
_____________________________________
_____________________________________
```

---

**Completed by:** ______________________  
**Date:** ______________________  
**Time:** ______________________

---

**Documentation:**
- Full Guide: `SUPABASE_SCHEMA_V2.md`
- Migration Instructions: `supabase/migrations/README.md`
- Developer Guide: `SCHEMA_V2_QUICK_REFERENCE.md`
