# Content Sync to Supabase - Quick Reference

## 🚀 Quick Start

### Prerequisites Checklist
- [ ] Supabase project created
- [ ] Required tables exist in Supabase (see schema below)
- [ ] GitHub repository access

### Setup (One-Time)

1. **Get Supabase Credentials**
   - URL: Supabase Dashboard → Settings → API → Project URL
   - Key: Supabase Dashboard → Settings → API → service_role key (reveal)

2. **Add GitHub Secrets**
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Add: `SUPABASE_URL` = your Supabase URL
   - Add: `SUPABASE_SERVICE_ROLE_KEY` = your service role key

3. **Done!** The sync will run automatically on every push to main that affects content files.

## 📦 What Gets Synced

```
Repository Content Sources          →  Supabase Tables
────────────────────────────────────────────────────────
/seeds/content.json                 →  courses, modules, lessons, questions
/data/sync-platform/**/*.json       →  content_library (future)
/apps/learn-*/data/seed.json        →  courses, modules, lessons, questions
/apps/learn-govt-jobs/data/         →  geography, government_jobs
  ├── geography.json
  └── deadlines.json
/data/squads/**/*.json              →  (logged, schema TBD)
/data/fixtures/**/*.json            →  (logged, schema TBD)
```

## 🧪 Testing

### Local Test (Dry Run)
```bash
# No Supabase credentials needed
DRY_RUN=true node scripts/sync_to_supabase.js
```

### Local Test (Real Sync)
```bash
# Create .env.local with your credentials
cat > .env.local << EOF
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-service-role-key
EOF

# Run sync
node scripts/sync_to_supabase.js
```

### Test GitHub Action
1. Go to: Actions → Sync Content to Supabase
2. Click: Run workflow
3. Wait for completion
4. Check logs for any errors

## 📋 Required Supabase Tables

### Core Content Tables
```sql
-- courses table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_description TEXT,
  full_description TEXT,
  duration TEXT,
  category TEXT,
  subdomain TEXT,
  price INTEGER DEFAULT 0,
  is_free BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, slug)
);

-- lessons table
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  duration TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

-- questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice',
  options JSONB,
  correct_answer TEXT,
  explanation TEXT,
  difficulty TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Specialized Tables
```sql
-- geography table
CREATE TABLE geography (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'country', 'state', 'district'
  parent_id UUID REFERENCES geography(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, type, parent_id)
);

-- government_jobs table
CREATE TABLE government_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT,
  level TEXT,  -- 'central', 'state'
  location_state TEXT,
  location_district TEXT,
  position_type TEXT,
  education_requirement TEXT,
  age_min INTEGER,
  age_max INTEGER,
  age_relaxations JSONB,
  physical_fitness_required BOOLEAN DEFAULT false,
  application_deadline TIMESTAMPTZ,
  notification_date TIMESTAMPTZ,
  exam_date TIMESTAMPTZ,
  physical_test_date TIMESTAMPTZ,
  interview_date TIMESTAMPTZ,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Workflow fails with "Missing Supabase credentials" | Check GitHub Secrets are set correctly |
| "Table does not exist" error | Apply Supabase migrations or create tables manually |
| Admin shows no data | Check RLS policies, verify sync succeeded |
| Unknown content types logged | Review and extend schema or update sync script |
| Sync is slow | Normal for first run; subsequent runs are faster (upserts) |

## 📊 Monitoring

### Check Workflow Status
- Go to: Repository → Actions tab
- Look for: ✅ (success) or ❌ (failure)
- Click run to see detailed logs

### Verify Data in Supabase
```sql
-- Check record counts
SELECT 'courses' as table_name, COUNT(*) as count FROM courses
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'lessons', COUNT(*) FROM lessons
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'geography', COUNT(*) FROM geography
UNION ALL
SELECT 'government_jobs', COUNT(*) FROM government_jobs;
```

## 🔒 Security Notes

- ✅ Service role key required (has admin access)
- ✅ Store keys in GitHub Secrets only
- ✅ Never commit credentials to code
- ✅ Workflow permissions explicitly limited
- ✅ Sensitive files excluded from artifacts
- ⚠️ Review RLS policies for production

## 📚 More Information

- Full setup guide: `SUPABASE_SYNC_SETUP.md`
- Sync script: `scripts/sync_to_supabase.js`
- Workflow: `.github/workflows/sync-content.yml`

## 🎯 Success Criteria

After setup, you should see:
- ✅ Workflow runs automatically on content changes
- ✅ All content visible in Supabase tables
- ✅ Admin section shows all content
- ✅ No manual intervention needed
- ✅ Unknown types logged for review

---

**Need Help?** See `SUPABASE_SYNC_SETUP.md` for detailed troubleshooting.
