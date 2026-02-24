# Content Aggregation and Isolation Guide

## Overview

The Universal Admin Dashboard aggregates content from multiple sources across all `learn-*` apps in the monorepo. This guide explains how content is tagged, isolated, and displayed to ensure data integrity and proper separation between apps.

## Content Sources

The admin dashboard pulls content from **three primary sources**:

### 1. Supabase Database
- **Type**: Production database
- **Badge**: Green "Supabase" badge
- **Priority**: Highest (takes precedence in deduplication)
- **Tables**: `courses`, `modules`, `lessons`, `profiles`, `questions`
- **Field**: `_source: 'supabase'`

### 2. Local Content
- **Type**: Mock/test data from `seeds/content.json`
- **Badge**: Blue "Local" badge
- **Priority**: Medium
- **File**: `seeds/content.json` in project root
- **Field**: `_source: 'local'`

### 3. Auto-Discovered Content
- **Type**: Content discovered from individual `learn-*` apps
- **Badge**: Purple "Discovered" badge
- **Priority**: Lowest
- **Location**: All `apps/learn-*/` directories
- **Field**: `_source: 'discovered'`
- **Discovery Path**: Scans multiple patterns (see below)

## Content Tagging System

### Standardized App Identification

All content items MUST include a standardized `appId` field that identifies which app the content belongs to. This is critical for content isolation.

**Field**: `appId`
**Format**: `"learn-{app-name}"` (e.g., `"learn-apt"`, `"learn-ai"`, `"learn-jee"`)

### Legacy Fields (Maintained for Backward Compatibility)

- `_discoveredFrom`: Original field used by content discovery
- `app`: Alternative app identifier in some schemas
- `subdomain`: Used in Supabase for site identification

### Metadata Fields

Every piece of content includes these metadata fields:

```javascript
{
  id: "unique-content-id",
  title: "Content Title",
  appId: "learn-apt",           // ✅ PRIMARY app identifier
  _source: "discovered",         // Source: supabase | local | discovered
  _discoveredFrom: "learn-apt",  // Legacy: original app (for discovered content)
  _discoveredAt: "2024-01-29...", // Timestamp of discovery
  // ... other content-specific fields
}
```

## Content Discovery Patterns

The content discovery system scans these locations in each `learn-*` app:

```javascript
const CONTENT_FILE_PATTERNS = [
  'data/courses.json',
  'data/modules.json',
  'data/lessons.json',
  'data/content.json',
  'data/newsletters.json',
  'seeds/content.json',
  'content/courses.json',
  'content/data.json',
  'public/data/courses.json',
  'manifest.json',  // App-level manifest
];
```

## Content Isolation Rules

### 🚨 CRITICAL: No Cross-App Contamination

**Rule #1**: Content from one app must NEVER appear under another app.

**Rule #2**: All data aggregation methods MUST support `appId` filtering.

**Rule #3**: Admin UI MUST clearly display the source app for every content item.

### Filtering by App

When fetching content for a specific app, use the `appId` option:

```javascript
// Fetch courses for a specific app only
const aptCourses = await provider.getCourses({ appId: 'learn-apt' });

// Fetch ALL courses (from all apps)
const allCourses = await provider.getCourses();
```

### API Endpoint Usage

```bash
# Get all courses from all apps
GET /api/courses

# Get courses from a specific app
GET /api/courses?appId=learn-apt

# Get list of all apps with content
GET /api/apps
```

## Data Aggregation Flow

```
1. Initialize Supabase client
   ↓
2. Load local content from seeds/content.json
   ↓
3. Run content discovery across all learn-* apps
   ↓
4. Tag all content with source metadata (_source, appId)
   ↓
5. Merge data with deduplication by ID
   └→ Supabase data takes precedence
      └→ Then local data
         └→ Finally discovered data
```

## Admin UI Display

### Dashboard Statistics

The admin dashboard shows:
- **Total counts** across all apps
- **Source breakdown**: Supabase vs Local vs Discovered
- **Per-app breakdown**: Courses/Modules/Lessons per app
- **App list**: All discovered apps with content counts

### Content Tables

When displaying content (e.g., courses list):
- **App/Source Column**: Shows which app the content belongs to
- **Source Badge**: Color-coded badge showing data source
- **Filter Option**: Dropdown to filter by app

### Color Coding

- 🟢 **Green**: Supabase (production data)
- 🔵 **Blue**: Local (test/mock data)
- 🟣 **Purple**: Discovered (from learn-* apps)

## Adding New Apps

When adding a new `learn-*` app:

1. **Create app directory**: `apps/learn-{name}/`
2. **Add content file**: Use one of the discovery patterns above
3. **Include appId**: Ensure all content items have `"appId": "learn-{name}"`
4. **Manifest format** (recommended):

```json
{
  "app": "learn-{name}",
  "version": "1.0.0",
  "items": [
    {
      "id": "unique-id",
      "app": "learn-{name}",  // ✅ Include app identifier
      "title": "Content Title",
      "type": "course",
      // ... other fields
    }
  ]
}
```

5. **Restart admin dashboard**: Content will be auto-discovered on next load

## Testing Content Isolation

To verify content isolation is working:

### Test Case 1: Unique Content Per App
```bash
# Add unique content to learn-apt
# Add unique content to learn-ai
# Verify each app shows ONLY its own content
```

### Test Case 2: Same-Named Content
```bash
# Add "Introduction to AI" course in learn-ai
# Add "Introduction to AI" course in learn-apt
# Verify each appears only under its correct app
```

### Test Case 3: Filter by App
```bash
# Navigate to admin courses page
# Select "learn-apt" from filter dropdown
# Verify ONLY learn-apt content is shown
```

## Security: Authentication Bypass

### Development Mode

For development/testing, authentication can be bypassed:

```bash
# .env.local
NEXT_PUBLIC_DISABLE_AUTH=true
```

**⚠️ WARNING**: This shows a RED banner in the admin UI.

### Production Mode

For production, authentication MUST be enabled:

```bash
# .env.production
NEXT_PUBLIC_DISABLE_AUTH=false
```

**❌ NEVER deploy with auth bypass enabled**

### Environment Checks

The system includes safeguards:
- Console warnings when auth is bypassed
- Different colored banners (RED for security risk, ORANGE for dev mode)
- Clear messaging about security implications

## API Reference

### UnifiedContentProvider Methods

```javascript
const provider = await createUnifiedContentProvider();

// Get content (optionally filtered by app)
await provider.getCourses({ appId: 'learn-apt' });
await provider.getModules({ appId: 'learn-jee' });
await provider.getLessons({ appId: 'learn-neet' });

// Get all apps with content
await provider.getAllApps();

// Get content for specific app
await provider.getAppContent('learn-apt');

// Get statistics
await provider.getStats();
```

### API Endpoints

- `GET /api/courses?appId=learn-apt` - Get courses for specific app
- `GET /api/modules?appId=learn-apt` - Get modules for specific app
- `GET /api/lessons?appId=learn-apt` - Get lessons for specific app
- `GET /api/apps` - Get all apps with content counts
- `GET /api/stats` - Get aggregated statistics

## Troubleshooting

### Content Not Appearing

1. **Check file location**: Ensure content file is in a discovered path
2. **Verify appId**: All items must have `appId` field
3. **Check console logs**: Look for discovery logs on admin page load
4. **Clear cache**: Content discovery has 5-minute cache

### Content Mixing Between Apps

1. **Check appId field**: Ensure all content has correct `appId`
2. **Verify filters**: Make sure API calls use `appId` parameter
3. **Check UI filter**: Ensure UI is using the correct filter value

### Missing Source Badge

1. **Check _source field**: Should be 'supabase', 'local', or 'discovered'
2. **Verify data flow**: Ensure content passes through proper aggregation

## Future Improvements

- [ ] Add content validation on import
- [ ] Implement automatic appId assignment
- [ ] Add migration tool for legacy content
- [ ] Create content audit CLI tool
- [ ] Add automated tests for content isolation
- [ ] Implement real-time content sync

## Support

For issues or questions about content aggregation:
1. Check console logs in admin dashboard
2. Verify content file structure matches discovery patterns
3. Ensure all content items have required `appId` field
4. Review this guide for proper tagging conventions
