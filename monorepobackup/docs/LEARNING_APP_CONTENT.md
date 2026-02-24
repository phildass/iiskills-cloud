# Learning App Content Structure

This document describes the content structure used by all `learn-*` apps in the iiskills-cloud monorepo.

## Overview

Each learning app stores its content in a standardized JSON format that can be discovered and displayed by the universal admin dashboard.

## Directory Structure

Each `learn-*` app should have the following structure:

```
apps/learn-{app}/
├── data/
│   └── seed.json          # Main content file
├── pages/                 # Next.js pages
├── components/           # React components
└── package.json
```

## Content File Format

The `data/seed.json` file contains modules and lessons in the following format:

```json
{
  "modules": [
    {
      "id": 1,
      "title": "Module Title",
      "description": "Module description",
      "difficulty": "Beginner|Intermediate|Advanced",
      "order": 1,
      "lesson_count": 10
    }
  ],
  "lessons": [
    {
      "id": "1-1",
      "module_id": 1,
      "lesson_number": 1,
      "title": "Lesson Title",
      "content": "<h2>HTML content</h2><p>Lesson body...</p>",
      "duration_minutes": 15,
      "is_free": true,
      "order": 1
    }
  ]
}
```

## Field Descriptions

### Module Fields

- `id` (number): Unique identifier within the app
- `title` (string): Display name of the module
- `description` (string): Brief description of module content
- `difficulty` (string): One of "Beginner", "Intermediate", or "Advanced"
- `order` (number): Display order in the app
- `lesson_count` (number): Number of lessons in this module

### Lesson Fields

- `id` (string): Unique identifier (typically "{module_id}-{lesson_number}")
- `module_id` (number): Reference to parent module
- `lesson_number` (number): Order within the module
- `title` (string): Display name of the lesson
- `content` (string): HTML content of the lesson
- `duration_minutes` (number): Estimated completion time
- `is_free` (boolean): Whether lesson is freely accessible
- `order` (number): Display order in the module

## Admin Dashboard Integration

The content is automatically discovered by:

1. **ContentManager** (`apps/main/lib/admin/contentManager.js`)
   - Scans all registered apps for `data/` directories
   - Parses `seed.json` files
   - Aggregates content from all sources (filesystem + Supabase)

2. **ContentRegistry** (`apps/main/lib/admin/contentRegistry.js`)
   - Each app must be registered in `APP_REGISTRY`
   - Defines app metadata and data paths

3. **Admin API** (`apps/main/pages/api/admin/content.js`)
   - Provides REST endpoints for content access
   - Supports filtering by type (courses/modules/lessons)
   - Enables universal search across all apps

## Current Apps with Content

All 12 learning apps have content:

- learn-ai (100 lessons in 10 modules)
- learn-apt (100 lessons in 10 modules)
- learn-biology (100 lessons in 10 modules)
- learn-chemistry (100 lessons in 10 modules)
- learn-developer (100 lessons in 10 modules)
- learn-finesse (100 lessons in 10 modules)
- learn-geography (100 lessons in 10 modules)
- learn-govt-jobs (100 lessons in 10 modules)
- learn-management (100 lessons in 10 modules)
- learn-math (100 lessons in 10 modules)
- learn-physics (100 lessons in 10 modules)
- learn-pr (100 lessons in 10 modules)

## Adding New Content

To add new content to a learning app:

1. Edit the `apps/learn-{app}/data/seed.json` file
2. Follow the JSON structure shown above
3. Ensure module IDs are unique within the app
4. Ensure lesson IDs follow the pattern "{module_id}-{lesson_number}"
5. Content will be automatically discovered on next admin panel load

## Generating Content

Use the content generation script to create seed data:

```bash
node scripts/generate-all-app-content.js
```

This will regenerate `seed.json` files for all apps with template content.

## Testing Content

To verify content is properly structured and discoverable:

```bash
# Test content discovery
node scripts/test-content-discovery.js

# Validate content structure (looks for content/ directories)
node scripts/validate-content.js
```

## Syncing to Supabase

Content can be synced from filesystem to Supabase:

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
  node scripts/sync_to_supabase.js
```

Use `--dry-run` flag to preview changes without making them.

## Notes

- The admin panel aggregates content from BOTH filesystem (`data/seed.json`) and Supabase
- Duplicate IDs between sources are handled through deduplication
- First lesson in each module should typically be free (`is_free: true`)
- Content is displayed in the admin panel at `/admin/modules` and `/admin/lessons`
