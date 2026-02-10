# Content Sync Architecture & Extension Guide

## System Overview

The content sync system is designed to automatically keep Supabase in sync with all content in the repository. It's built with extensibility in mind, allowing easy addition of new content sources and types.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Repository Content                        │
│  (/seeds/, /data/, /apps/learn-*/data/, etc.)              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Push to main branch
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              GitHub Actions Workflow                         │
│        (.github/workflows/sync-content.yml)                 │
│                                                              │
│  1. Checkout code                                           │
│  2. Setup Node 20                                           │
│  3. Install dependencies                                    │
│  4. Create .env.local from secrets                          │
│  5. Run sync script                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ node scripts/sync_to_supabase.js
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Sync Script Logic                           │
│          (scripts/sync_to_supabase.js)                      │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 1. File Discovery (recursive scan)                 │    │
│  │    - findFiles() with pattern matching             │    │
│  │    - Skip node_modules, .git, etc.                │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 2. Content Processing                              │    │
│  │    - Read & parse JSON files                       │    │
│  │    - Detect content type by structure/filename    │    │
│  │    - Transform to database format                  │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 3. Database Sync                                   │    │
│  │    - Check if exists (by unique key)              │    │
│  │    - Upsert (insert or update)                    │    │
│  │    - Track statistics & errors                     │    │
│  └────────────────────────────────────────────────────┘    │
│                         │                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ 4. Reporting                                       │    │
│  │    - Log processed files                           │    │
│  │    - Report unknown types                          │    │
│  │    - Print summary statistics                      │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Supabase API
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Supabase Database                         │
│                                                              │
│  Tables: courses, modules, lessons, questions,              │
│          geography, government_jobs, content_library        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Read via Supabase API
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   Admin Interface                            │
│            (Always shows latest content)                     │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Principles

### 1. **Idempotency**
- Multiple runs with same data produce same result
- Uses `upsert` instead of `insert` to handle duplicates
- Unique keys prevent duplicate entries

### 2. **Comprehensive Discovery**
- Recursively scans all directories
- Pattern-based file matching
- Future-proof: finds new content automatically

### 3. **Graceful Degradation**
- File read errors are logged but don't stop sync
- Database errors are tracked per-item
- Missing files are skipped with warnings

### 4. **Extensibility**
- Unknown content types are logged, not rejected
- Modular processing functions
- Easy to add new content sources

### 5. **Observability**
- Detailed logging with timestamps
- Statistics tracking (created, updated, errors)
- Clear success/failure indicators

## Content Flow Examples

### Example 1: Main Seed File
```
/seeds/content.json
    ↓
readJsonFile()
    ↓
Parse: { courses: [...], modules: [...], lessons: [...], questions: [...] }
    ↓
migrateCourses() → Upsert to courses table
    ↓ (returns course ID mapping)
migrateModules() → Upsert to modules table
    ↓ (returns module ID mapping)
migrateLessons() → Upsert to lessons table
    ↓ (returns lesson ID mapping)
migrateQuestions() → Upsert to questions table
```

### Example 2: Geography Data
```
/apps/learn-govt-jobs/data/geography.json
    ↓
readJsonFile()
    ↓
Parse: [{ name: "India", type: "country", children: [...] }]
    ↓
processGeography()
    ↓
Upsert country → Get country_id
    ↓
For each state:
    Upsert state with parent_id = country_id → Get state_id
        ↓
    For each district:
        Upsert district with parent_id = state_id
```

### Example 3: Unknown Content Type
```
/data/new-content/something.json
    ↓
readJsonFile()
    ↓
Parse: { newField1: "...", newField2: [...] }
    ↓
No matching processor
    ↓
Add to stats.unknownTypes[]
    ↓
Log in summary with keys: newField1, newField2
    ↓
Recommendation: Extend schema or add processor
```

## How to Extend

### Adding a New Content Source

**Step 1: Identify the Content**
- Where is it located? (e.g., `/data/new-source/*.json`)
- What structure does it have?
- Which Supabase table should store it?

**Step 2: Add File Discovery**

Option A: Already discovered (in `/data/`)
```javascript
// Already handled by processOtherData()
// Just add type detection and processing
```

Option B: New directory
```javascript
// In main() function, add:
const newSourceDir = path.join(rootDir, 'data', 'new-source');
if (fs.existsSync(newSourceDir)) {
  await processNewSource(newSourceDir);
}
```

**Step 3: Add Processing Function**
```javascript
/**
 * Process new content source
 */
async function processNewSource(sourceDir) {
  log('🆕 Processing new content source...');
  
  const files = findFiles(sourceDir, /\.json$/);
  
  for (const file of files) {
    stats.filesProcessed++;
    const data = readJsonFile(file);
    if (!data) continue;
    
    if (DRY_RUN) {
      log(`[DRY RUN] Would process ${file}`, 'info');
      stats.newSource.created++;
      continue;
    }
    
    // Process each item
    for (const item of data) {
      try {
        const { error } = await supabase
          .from('new_table')
          .upsert({
            // Map fields
            field1: item.field1,
            field2: item.field2,
          }, {
            onConflict: 'unique_key_field',
            ignoreDuplicates: false,
          });
        
        if (error) {
          log(`Error upserting item: ${error.message}`, 'error');
          stats.newSource.errors++;
        } else {
          stats.newSource.created++;
        }
      } catch (err) {
        log(`Exception processing item: ${err.message}`, 'error');
        stats.newSource.errors++;
      }
    }
  }
}
```

**Step 4: Add Statistics Tracking**
```javascript
// In stats object initialization
const stats = {
  // ... existing stats ...
  newSource: { created: 0, updated: 0, errors: 0, files: [] },
};
```

**Step 5: Add to Summary Report**
```javascript
// In main() function summary
console.log(`  New Source:     ${stats.newSource.created} processed, ${stats.newSource.errors} errors`);
```

**Step 6: Update Workflow Triggers** (if in new directory)
```yaml
# In .github/workflows/sync-content.yml
on:
  push:
    paths:
      - 'seeds/**'
      - 'data/**'
      - 'data/new-source/**'  # Add this if specific path
      # ...
```

### Adding Support for New File Types

Currently supports: `.json`

To add `.yaml`, `.js`, `.ts`, etc.:

**Step 1: Update File Patterns**
```javascript
// In findFiles() calls
const files = findFiles(dir, /\.(json|yaml|yml)$/);
```

**Step 2: Add Parser**
```javascript
function readFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const ext = path.extname(filePath);
    
    switch (ext) {
      case '.json':
        return JSON.parse(content);
      case '.yaml':
      case '.yml':
        return yaml.parse(content);  // Requires: const yaml = require('yaml');
      case '.js':
      case '.ts':
        // For JS/TS exports, use require() or dynamic import
        return require(filePath);
      default:
        log(`Unsupported file type: ${ext}`, 'warn');
        return null;
    }
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'error');
    return null;
  }
}
```

### Extending for Dynamic Content

For content that changes frequently or needs real-time sync:

**Option 1: Webhook Trigger**
```javascript
// Add endpoint in your app
app.post('/api/sync-content', async (req, res) => {
  // Verify webhook secret
  if (req.headers['x-sync-secret'] !== process.env.SYNC_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Trigger sync
  const { main } = require('../scripts/sync_to_supabase.js');
  await main();
  
  res.json({ success: true });
});
```

**Option 2: Scheduled Sync**
```yaml
# In workflow file
on:
  schedule:
    - cron: '0 */6 * * *'  # Every 6 hours
  push:
    branches: [main]
```

**Option 3: Manual Sync Script**
```bash
# scripts/manual-sync.sh
#!/bin/bash
SUPABASE_URL=$1 SUPABASE_KEY=$2 node scripts/sync_to_supabase.js
```

## Testing Extensions

### Unit Test Template
```javascript
// test/sync-extensions.test.js
const { processNewSource } = require('../scripts/sync_to_supabase.js');

describe('New Source Processing', () => {
  it('should process new content type', async () => {
    const mockData = { /* ... */ };
    const result = await processNewSource(mockData);
    expect(result.created).toBeGreaterThan(0);
  });
  
  it('should handle errors gracefully', async () => {
    const invalidData = null;
    const result = await processNewSource(invalidData);
    expect(result.errors).toBe(0);
  });
});
```

### Integration Test
```bash
# Test against staging Supabase
SUPABASE_URL=$STAGING_URL \
SUPABASE_KEY=$STAGING_KEY \
node scripts/sync_to_supabase.js

# Verify in staging database
psql $STAGING_DB -c "SELECT COUNT(*) FROM new_table;"
```

## Performance Considerations

### Current Performance
- ~1-5 seconds for typical repositories
- Scales linearly with content volume
- Network latency is main bottleneck

### Optimization Strategies

**1. Batch Operations**
```javascript
// Instead of individual upserts
for (const item of items) {
  await supabase.from('table').upsert(item);
}

// Use batch upsert
const batchSize = 100;
for (let i = 0; i < items.length; i += batchSize) {
  const batch = items.slice(i, i + batchSize);
  await supabase.from('table').upsert(batch);
}
```

**2. Parallel Processing**
```javascript
// Process multiple content sources in parallel
await Promise.all([
  migrateCourses(seedData.courses, file),
  processGeography(geoFile),
  processGovernmentJobs(jobsFile),
]);
```

**3. Incremental Sync**
```javascript
// Track last sync time
const lastSync = await getLastSyncTime();

// Only process files modified since last sync
const modifiedFiles = files.filter(f => {
  const stat = fs.statSync(f);
  return stat.mtime > lastSync;
});
```

**4. Database Indexes**
```sql
-- Add indexes for faster lookups
CREATE INDEX idx_courses_slug ON courses(slug);
CREATE INDEX idx_modules_course_slug ON modules(course_id, slug);
CREATE INDEX idx_lessons_module_slug ON lessons(module_id, slug);
```

## Troubleshooting Extensions

### Common Issues

**1. "Unknown content type" Logged**
- Good! The system is working as designed
- Review the logged keys to understand structure
- Add processor if content is important
- Update schema if needed

**2. Processing but Not Appearing in Admin**
- Check Supabase table has data: `SELECT * FROM table LIMIT 10;`
- Verify RLS policies allow service role access
- Check admin queries use correct table/column names
- Verify admin Supabase client configuration

**3. Sync Slow for Large Files**
- Use batch operations (see Performance section)
- Consider pagination for very large datasets
- Add progress logging: `log(`Processing ${i}/${total}...`);`

**4. Duplicate Detection Not Working**
- Verify `onConflict` column exists and is unique
- Check constraint exists: `\d table_name` in psql
- Ensure upsert key matches unique constraint

## Best Practices

1. **Always Add Dry-Run Support**: New processors should check `DRY_RUN` flag
2. **Track Statistics**: Add to `stats` object for visibility
3. **Log Generously**: Use appropriate log levels (info, warn, error)
4. **Handle Nulls**: Use optional chaining and default values
5. **Test Incrementally**: Test with small datasets first
6. **Document Schema**: Keep table creation SQL in docs
7. **Version Migrations**: Use Supabase migrations for schema changes
8. **Monitor Performance**: Log timing for slow operations

## Future Enhancements

Potential areas for improvement:

- [ ] Add incremental sync (only changed files)
- [ ] Support for binary content (images, PDFs)
- [ ] Content validation before sync
- [ ] Rollback capability for failed syncs
- [ ] Sync history tracking
- [ ] Content diffing and changelog
- [ ] Multi-environment support (dev, staging, prod)
- [ ] Content approval workflow
- [ ] Conflict resolution strategies
- [ ] Real-time sync via webhooks

## Resources

- Supabase JS Client Docs: https://supabase.com/docs/reference/javascript
- GitHub Actions Docs: https://docs.github.com/en/actions
- Node.js File System: https://nodejs.org/api/fs.html
- JSON Schema: https://json-schema.org/

---

**Questions or Issues?** Open an issue or discussion in the repository.
