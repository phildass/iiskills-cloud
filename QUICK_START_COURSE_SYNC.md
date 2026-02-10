# Course Sync Quick Start Guide

## Problem
Only 3 courses showing in admin/Supabase, but you have more course files in your repository.

## Solution
Use the new `sync_to_supabase.js` script that auto-discovers ALL content.

## Quick Steps

### 1. Test First (Dry Run)
```bash
cd /home/runner/work/iiskills-cloud/iiskills-cloud
node scripts/sync_to_supabase.js --dry-run --verbose
```

Expected output:
```
Files Scanned:  4
Courses:        5 created (vs 3 previously)
Modules:        14 created (vs 3 previously)
Lessons:        3 created
```

### 2. Set Environment Variables

Add to `.env.local`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Or export them:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your-key"
```

### 3. Run the Sync
```bash
node scripts/sync_to_supabase.js --verbose
```

### 4. Verify in Supabase
1. Open Supabase Dashboard
2. Go to Table Editor
3. Check `courses` table → Should have 5+ courses
4. Check `modules` table → Should have 14+ modules
5. Check `lessons` table → Should have 3+ lessons

### 5. Fix Admin UI (if needed)

Current admin pages load mock data. To fix:

**Option A: Update admin query** (Recommended)
```javascript
// In /apps/learn-geography/pages/admin/index.js (line 39-54)
const loadData = async () => {
  try {
    // Replace this:
    const { getAllModules } = await import('../../lib/curriculumGenerator');
    setModules(getAllModules());
    
    // With this:
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const { data: courses } = await supabase
      .from('courses')
      .select('*')
      .eq('status', 'published');
    
    const { data: modules } = await supabase
      .from('modules')
      .select('*');
    
    setModules(modules || []);
    setCourses(courses || []);
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    setLoading(false);
  }
};
```

**Option B: Use a centralized admin dashboard**
If you have a main admin dashboard that already queries Supabase, use that instead.

## What Gets Synced

### Content Sources Discovered:
1. ✅ `seeds/content.json` → 3 courses, 3 modules, 3 lessons
2. ✅ `apps/learn-ai/data/seed.json` → 1 course (auto-generated), 10 modules
3. ✅ `data/sync-platform/learn-ai/basics/*.json` → 1 module, 1 lesson

### Total Content:
- **5 courses** (up from 3)
- **14 modules** (up from 3)
- **3+ lessons**

## Troubleshooting

### "Missing Supabase credentials"
Set environment variables (see step 2 above)

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install --legacy-peer-deps
```

### Courses still not showing in admin
1. Check environment variables match between sync script and admin
2. Verify admin code queries Supabase (not mock data)
3. Clear browser cache or hard refresh (Ctrl+Shift+R)
4. Check Supabase RLS policies allow reading

### Want to add more content?
1. Add files to any of these locations:
   - `seeds/content.json`
   - `apps/learn-APPNAME/data/seed.json` (e.g., `apps/learn-ai/data/seed.json`)
   - `data/sync-platform/`
2. Run: `node scripts/sync_to_supabase.js --verbose`
3. Verify in Supabase dashboard

## Environment Variables Checklist

Make sure BOTH your sync script AND admin/frontend use the SAME variables:

```bash
# For sync script (use SERVICE_ROLE_KEY for full access)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# For admin/frontend (use ANON_KEY for limited access)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
```

⚠️ **Important**: The URLs must be IDENTICAL!

## Next Steps After Sync

1. ✅ Run sync script
2. ✅ Verify in Supabase dashboard
3. ⏳ Update admin UI to query Supabase
4. ⏳ Test admin UI shows all courses
5. ⏳ Consider SSR/ISR for dynamic content
6. ⏳ Add sync to deployment pipeline

## Full Documentation

- **Problem Analysis**: See `COURSE_SYNC_FIX.md`
- **Script Documentation**: See `scripts/README.md`
- **Script Source**: `scripts/sync_to_supabase.js`

## Support

If you still have issues:
1. Run with `--dry-run --verbose` to see what's happening
2. Check the detailed documentation in `COURSE_SYNC_FIX.md`
3. Verify environment variables are set correctly
4. Check Supabase dashboard for imported data
