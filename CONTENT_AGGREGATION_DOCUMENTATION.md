# Content Aggregation Documentation

## Overview
The admin dashboard now aggregates content from multiple sources to provide a comprehensive view of all available courses, modules, and lessons across the platform.

## Architecture

### Content Sources
1. **Supabase Database** - Remote database containing user-created courses
2. **Local Filesystem** - Content stored in app directories
   - `manifest.json` files - App-specific content manifests
   - `data/` directories - Additional content (e.g., curriculum.js)
   - `seeds/content.json` - Seed data for development

### Aggregation Flow
```
┌─────────────────────────────────────────────────────────┐
│                  ContentManager                          │
│                                                           │
│  getAllContentFromAllApps()                              │
│    ├─> Load seed data (seeds/content.json)              │
│    └─> For each app in APP_REGISTRY:                    │
│         ├─> loadAppContent(app)                          │
│              ├─> loadFromFileSystem(app)                 │
│              │    ├─> Load manifest.json                 │
│              │    └─> Scan data/ and content/ dirs       │
│              │         ├─> Parse JSON files              │
│              │         ├─> Parse JS files (curriculum)   │
│              │         └─> Parse MD files                │
│              └─> loadFromSupabase(app)                   │
│                   └─> Fetch courses by subdomain         │
└─────────────────────────────────────────────────────────┘
```

## Content Manager API

### Methods

#### `getAllCourses()`
Returns all courses from all sources.
- Filters content where `type === 'Course'` or has course-like properties
- Returns items with `sourceApp` and `sourceBackend` tags

#### `getAllModules()`
Returns all modules from all sources.
- Filters content where `type === 'Module'`
- Includes modules from seed data, manifests, and curriculum files

#### `getAllLessons()`
Returns all lessons from all sources.
- Filters content where `type === 'Lesson'` or `type === 'lesson'`
- Includes lessons from all apps and sources

#### `getAllContent(sourceApp)`
Returns all content for a specific app.
- Aggregates from both filesystem and Supabase
- Tagged with source information

#### `searchAllContent(query)`
Searches across all content.
- Searches in title, description, and tags
- Returns matching items from all sources

## Admin API Endpoints

### GET `/api/admin/content`

#### Query Parameters
- `type` - Filter by type: `courses`, `modules`, `lessons`, `all`
- `source_app` - Filter by specific app (e.g., `learn-physics`)
- `search` - Search query string

#### Examples
```javascript
// Get all courses
GET /api/admin/content?type=courses

// Get all modules
GET /api/admin/content?type=modules

// Get all lessons
GET /api/admin/content?type=lessons

// Get all content from learn-physics
GET /api/admin/content?source_app=learn-physics

// Search for "physics"
GET /api/admin/content?search=physics
```

#### Response Format
```json
{
  "contents": [
    {
      "id": "course-1",
      "appId": "learn-jee",
      "title": "Sample Course - JEE Preparation",
      "type": "Course",
      "data": { /* course data */ },
      "source": "filesystem",
      "sourceApp": "learn-jee",
      "sourceBackend": "filesystem"
    }
  ]
}
```

## Supported File Formats

### 1. JSON Manifests (`manifest.json`)
```json
{
  "app": "learn-cricket",
  "items": [
    {
      "id": "cricket-rules-basics",
      "type": "lesson",
      "title": "Cricket Rules - The Basics",
      "description": "Learn fundamental rules..."
    }
  ]
}
```

### 2. JavaScript Modules (`curriculum.js`)
```javascript
export const physicsCurriculum = {
  levels: [
    {
      id: "beginner",
      modules: [
        {
          id: "m1-1",
          name: "Introduction to Physics",
          lessons: [...]
        }
      ]
    }
  ]
};
```

### 3. Seed Data (`seeds/content.json`)
```json
{
  "courses": [...],
  "modules": [...],
  "lessons": [...]
}
```

## Content Tagging

All content items are tagged with:
- `source` - Where the data came from (`filesystem` or `supabase`)
- `sourceApp` - Which app owns the content (e.g., `learn-physics`)
- `sourceBackend` - Same as source (for UI display)

## Adding New Content Sources

### 1. Add to App Registry
Update `apps/main/lib/admin/contentRegistry.js`:
```javascript
'learn-newapp': {
  id: 'learn-newapp',
  name: 'learn-newapp',
  displayName: 'New App',
  contentType: 'json',
  dataPath: 'apps/learn-newapp/manifest.json',
  icon: '📚',
  fields: [...]
}
```

### 2. Create Manifest
Create `apps/learn-newapp/manifest.json`:
```json
{
  "app": "learn-newapp",
  "version": "1.0.0",
  "contentTypes": ["course", "lesson"],
  "items": []
}
```

### 3. Content Will Automatically Aggregate
The ContentManager will automatically:
- Load the manifest
- Scan data/ and content/ directories
- Parse JSON, JS, and MD files
- Tag content with source information

## UI Integration

### Admin Dashboard
Shows aggregated stats:
- Total Courses (from all sources)
- Total Modules (from all sources)
- Total Lessons (from all sources)

### Admin Pages
- `/admin/courses` - Shows all courses with source tags
- `/admin/modules` - Shows all modules with source tags
- `/admin/lessons` - Shows all lessons with source tags

## Future Enhancements
- [ ] Real-time content updates
- [ ] Content caching for performance
- [ ] Duplicate detection across sources
- [ ] Content synchronization tools
- [ ] Version tracking
- [ ] Content search with filters
- [ ] Export/import functionality

## Troubleshooting

### No Content Showing
1. Check that `process.cwd()` resolves correctly (should be monorepo root)
2. Verify manifest.json files exist and are valid JSON
3. Check console for parsing errors
4. Ensure APP_REGISTRY includes the app

### JS Files Not Loading
1. Ensure files use `export const` syntax
2. Check that regex can extract the data object
3. Look for parsing errors in server logs
4. Verify the data structure matches expected format

### Supabase Content Missing
1. Check Supabase connection (not suspended)
2. Verify subdomain matches in courses table
3. Check for Supabase errors in logs
4. Ensure NEXT_PUBLIC_SUPABASE_URL is set
