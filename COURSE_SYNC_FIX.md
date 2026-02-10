# Course Sync Fix - Complete Documentation

## Problem Summary

Only 3 courses were appearing in the admin section and Supabase dashboard, despite having many more course files in the repository.

## Root Cause Analysis

### Issues Found

1. **Incomplete Migration Script**: The existing `scripts/migrate-content-to-supabase.ts` only read from `seeds/content.json` (which contains only 3 courses)

2. **Multiple Content Sources Not Discovered**:
   - ❌ `apps/learn-ai/data/seed.json` - 10 modules (NOT being imported)
   - ❌ `data/sync-platform/**/*.json` - Individual module/lesson files (NOT being imported)
   - ✅ `seeds/content.json` - 3 courses (ONLY source being imported)

3. **No File Discovery**: The script had hardcoded file paths instead of auto-discovering content

4. **Silent Failures**: No warnings or logging for skipped files or failed imports

5. **Admin UI Using Mock Data**: Admin pages were loading from local `curriculumGenerator` instead of Supabase

6. **No Environment Variable Validation**: Script didn't clearly show which environment variables were missing

## Solution Implemented

### 1. New Comprehensive Sync Script

Created `/scripts/sync_to_supabase.js` with the following features:

**Auto-Discovery**:
- Scans `seeds/content.json` for legacy content
- Discovers all `apps/learn-*/data/seed.json` files
- Finds all module and lesson files in `data/sync-platform/`

**Enhanced Logging**:
- Timestamp on every log message
- Verbose mode (`--verbose` or `-v`) for detailed output
- Warnings for skipped files
- Error tracking and reporting
- Summary statistics at the end

**Dry-Run Mode**:
- Test without making changes (`--dry-run`)
- See what would be imported before running for real

**Environment Validation**:
- Clear error messages for missing credentials
- Shows which environment variables are set/missing
- Supports multiple credential formats (SERVICE_ROLE_KEY, SUPABASE_KEY, ANON_KEY)

**Primary Key Handling**:
- Uses slug-based lookups for courses
- Upserts (insert or update) to avoid duplicates
- Maps old IDs to new Supabase UUIDs

### 2. Script Capabilities

The new script syncs:
- **Courses**: 5 total (3 from seeds + 2 auto-generated from app data)
- **Modules**: 14 total (3 from seeds + 10 from learn-ai + 1 from sync-platform)
- **Lessons**: 3 from seeds + more from sync-platform
- **Questions**: Available in seeds (can be enabled)

### 3. Usage

```bash
# Dry run (test without making changes)
node scripts/sync_to_supabase.js --dry-run

# Dry run with verbose logging
node scripts/sync_to_supabase.js --dry-run --verbose

# Actual sync (requires environment variables)
SUPABASE_URL="your-url" SUPABASE_SERVICE_ROLE_KEY="your-key" node scripts/sync_to_supabase.js

# With verbose logging
SUPABASE_URL="your-url" SUPABASE_SERVICE_ROLE_KEY="your-key" node scripts/sync_to_supabase.js --verbose
```

### 4. Environment Variables

The script requires:

**Required (one of)**:
- `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (recommended - has admin access)
- OR `SUPABASE_KEY` 
- OR `SUPABASE_ANON_KEY` (limited access)

**Verification**:
The script validates all environment variables and shows which ones are set/missing.

## Verification Results

### Dry-Run Test Results

```
Files Scanned:  4
Courses:        5 created (vs 3 previously)
Modules:        14 created (vs 3 previously)
Lessons:        3 created
```

### Content Discovery

**Seeds Content** (`/seeds/content.json`):
- ✅ 3 courses
- ✅ 3 modules
- ✅ 3 lessons
- ✅ Questions (available)

**Learn-AI** (`/apps/learn-ai/data/seed.json`):
- ✅ 1 auto-generated course ("Ai Course")
- ✅ 10 modules:
  1. Introduction to AI
  2. Types of AI
  3. Data Science Fundamentals
  4. Python for AI
  5. Supervised Learning
  6. Unsupervised Learning
  7. Neural Networks
  8. AI Monetization
  9. AI Tools & Frameworks
  10. Career Pathways in AI

**Sync Platform** (`/data/sync-platform/`):
- ✅ 1 module (The Art of Prompting)
- ✅ 1 lesson
- ✅ 1 quiz file

## Next Steps for User

### 1. Set Environment Variables

Add to your `.env.local` or environment:

```bash
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: Ensure BOTH your sync script AND admin/frontend apps use the SAME environment variables!

### 2. Run the Sync Script

```bash
# Test first
node scripts/sync_to_supabase.js --dry-run --verbose

# Then run for real
node scripts/sync_to_supabase.js --verbose
```

### 3. Verify in Supabase Dashboard

1. Go to your Supabase dashboard
2. Navigate to Table Editor
3. Check the `courses` table - should see 5+ courses
4. Check the `modules` table - should see 14+ modules
5. Check the `lessons` table - should see 3+ lessons

### 4. Fix Admin UI (if needed)

The admin pages at `/apps/learn-geography/pages/admin/index.js` (and similar) currently load mock data from `curriculumGenerator`. To show real Supabase data:

**Option A**: Update admin pages to query Supabase
**Option B**: Use the main admin dashboard (if it queries Supabase correctly)

Example code to fetch from Supabase:
```javascript
const { data: courses } = await supabase
  .from('courses')
  .select('*')
  .eq('status', 'published');
```

### 5. Address SSR/SSG Concerns

If your admin UI uses Static Site Generation (SSG):

**Problem**: Content won't update without a rebuild

**Solutions**:
1. **Use Server-Side Rendering (SSR)** - Data fetched on each request
   ```javascript
   export async function getServerSideProps() {
     // Fetch from Supabase here
   }
   ```

2. **Use Incremental Static Regeneration (ISR)** - Rebuild pages periodically
   ```javascript
   export async function getStaticProps() {
     return {
       props: { ... },
       revalidate: 60, // Rebuild every 60 seconds
     }
   }
   ```

3. **Use Client-Side Fetching** - Fetch on page load
   ```javascript
   useEffect(() => {
     // Fetch from Supabase client-side
   }, []);
   ```

### 6. Add to Deployment Pipeline

Add to your deployment scripts or CI/CD:

```bash
# In your deploy script
node scripts/sync_to_supabase.js
```

Or create a GitHub Action to run on content changes.

## Maintenance

### Adding New Content

1. Add course files to appropriate directory:
   - `seeds/content.json` - for unified content
   - `apps/learn-APPNAME/data/seed.json` - for app-specific
   - `data/sync-platform/` - for individual files

2. Run sync script:
   ```bash
   node scripts/sync_to_supabase.js --verbose
   ```

3. Verify in Supabase dashboard

### Monitoring

The script provides detailed output:
- ✅ Success messages (green checkmarks)
- ⚠️ Warnings (yellow warning signs)
- ❌ Errors (red X marks)
- Summary statistics at the end

### Troubleshooting

**Issue**: "Missing Supabase credentials"
- Solution: Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` environment variables

**Issue**: Courses not appearing in admin
- Check: Admin UI fetches from Supabase (not mock data)
- Check: Environment variables match between script and admin
- Check: Supabase RLS policies allow reading

**Issue**: Duplicate courses
- The script uses upsert (update if exists, insert if new)
- Based on `slug` field for courses
- Based on `course_id + slug` for modules

## Files Changed

1. **Created**: `/scripts/sync_to_supabase.js` - New comprehensive sync script
2. **Created**: `/COURSE_SYNC_FIX.md` - This documentation

## Security Considerations

- ✅ Uses `SUPABASE_SERVICE_ROLE_KEY` for admin operations
- ✅ Environment variables validated before use
- ✅ Supports dry-run mode for testing
- ⚠️ Keep service role key secret (has full database access)
- ✅ Admin UI should use `SUPABASE_ANON_KEY` (limited access)

## Testing Checklist

- [x] Script runs without errors in dry-run mode
- [x] Script discovers all content sources
- [x] Environment validation works correctly
- [x] Logging shows all operations
- [ ] Real sync with actual Supabase credentials (user needs to run)
- [ ] Verify courses appear in Supabase dashboard
- [ ] Verify admin UI shows all courses
- [ ] Test with new content additions

## Summary

**Before**: 3 courses visible (from seeds/content.json only)
**After**: 5 courses, 14 modules, 3+ lessons (from all sources)

**Key Improvements**:
1. ✅ Auto-discovers ALL content files
2. ✅ Comprehensive logging and error reporting
3. ✅ Dry-run mode for safe testing
4. ✅ Environment variable validation
5. ✅ Upsert logic prevents duplicates
6. ✅ Clear documentation and next steps
