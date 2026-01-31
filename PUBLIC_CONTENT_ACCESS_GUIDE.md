# Universal Public Content Access - Implementation Guide

## Overview

The iiskills-cloud platform is now configured in **FULLY PUBLIC/UNRESTRICTED mode**. All content from all learn-* apps is accessible without authentication, paywalls, or access restrictions.

## Current Status

### ✅ What's Enabled

- **Universal Content Aggregation**: All 12+ active learn-* apps are scanned and their content is aggregated
- **Public Access**: No login or authentication required anywhere
- **No Paywalls**: All paid content is now freely accessible
- **Source Attribution**: Every content item is tagged with its source app and data backend
- **Admin Dashboard**: Fully accessible without authentication
- **Health Monitoring**: `/api/healthz` endpoint shows complete content inventory

### 📦 Active Apps

The following apps are currently active and included in content aggregation:

| App | Display Name | Icon | Content Type | Status |
|-----|--------------|------|--------------|--------|
| learn-apt | Aptitude Tests | 🧠 | JSON | ✅ Active |
| learn-cricket | Cricket Content | 🏏 | Markdown | ✅ Active |
| learn-govt-jobs | Government Jobs | 🏢 | JSON | ✅ Active |
| learn-ai | AI & Machine Learning | 🤖 | JSON | ✅ Active |
| learn-chemistry | Chemistry | 🧪 | JSON | ✅ Active |
| learn-geography | Geography | 🌍 | JSON | ✅ Active |
| learn-leadership | Leadership | 👔 | JSON | ✅ Active |
| learn-management | Management | 📊 | JSON | ✅ Active |
| learn-math | Mathematics | 📐 | JSON | ✅ Active |
| learn-physics | Physics | ⚛️ | JSON | ✅ Active |
| learn-pr | Public Relations | 📢 | JSON | ✅ Active |
| learn-winning | Winning Strategies | 🏆 | JSON | ✅ Active |

**Note**: Apps in `apps-backup/` directory are intentionally excluded from content aggregation.

## Configuration

### Environment Variables

The system uses the following environment variables to control access:

```bash
# Universal Public Access (DEFAULT)
NEXT_PUBLIC_DISABLE_AUTH=false  # false = public access enabled

# Admin Dashboard Public Access (DEFAULT)
DEBUG_ADMIN=true                # true = no authentication required
NEXT_PUBLIC_DEBUG_ADMIN=true

# Paywall Disabled (DEFAULT)
NEXT_PUBLIC_PAYWALL_ENABLED=false  # false = no paywall
```

### Configuration Files

1. **Content Registry** (`apps/main/lib/admin/contentRegistry.js`)
   - Central registry of all apps and their content schemas
   - Defines content types, data paths, and fields for each app

2. **Content Manager** (`apps/main/lib/admin/contentManager.js`)
   - Handles content loading from filesystem and Supabase
   - Supports recursive directory scanning
   - Adds source attribution to all content items

3. **Protected Routes** (Updated for public access)
   - `apps/main/components/ProtectedRoute.js` - Admin routes
   - `apps/main/components/UserProtectedRoute.js` - User routes
   - `apps/main/components/PaidUserProtectedRoute.js` - Paid content routes

## Content Structure

### File Organization

Each learn-* app follows this structure:

```
learn-{app-name}/
├── manifest.json          # Main content manifest (JSON apps)
├── CONTENT.md            # Content file (Markdown apps)
├── data/                 # Additional data files (optional)
│   ├── *.json           # JSON data files
│   └── ...
└── public/
    └── manifest.json    # PWA manifest (separate from content)
```

### Content Discovery

The system automatically discovers content from:

1. **JSON Manifests**: `manifest.json` files with `items` array
2. **Markdown Files**: `CONTENT.md` files parsed into sections
3. **Data Directories**: Recursive scanning of `data/` folders for JSON files

### Source Attribution

Every content item includes:

```javascript
{
  id: "unique-content-id",
  appId: "learn-app-name",
  title: "Content Title",
  type: "App Display Name",
  data: { /* content data */ },
  source: "filesystem",        // or "supabase"
  sourceApp: "learn-app-name",
  sourceBackend: "filesystem"  // or "supabase"
}
```

## API Endpoints

### Content API

**Endpoint**: `/api/admin/content`

**Methods**:
- `GET` - Retrieve content
- `POST` - Create content
- `PUT` - Update content
- `DELETE` - Remove content

**Query Parameters**:
- `source_app` - App identifier (e.g., "learn-apt")
- `content_id` - Content item ID
- `search` - Search query (searches across all apps)

**Examples**:

```bash
# Get all content from an app
GET /api/admin/content?source_app=learn-apt

# Get specific content item
GET /api/admin/content?source_app=learn-apt&content_id=apt-logical-reasoning-1

# Search across all apps
GET /api/admin/content?search=test
```

### Health Check API

**Endpoint**: `/api/healthz`

**Method**: `GET`

**Response**:
```json
{
  "health": {
    "status": "healthy",
    "timestamp": "2024-01-29T12:00:00Z",
    "mode": "PUBLIC_ACCESS",
    "authentication": "DISABLED",
    "paywall": "DISABLED"
  },
  "stats": {
    "totalApps": 15,
    "totalContent": 26,
    "contentByApp": { /* per-app counts */ },
    "contentByBackend": {
      "filesystem": 26,
      "supabase": 0
    }
  },
  "contentInventory": [ /* detailed inventory */ ]
}
```

## Testing

### Content Aggregation Test

Run the content aggregation test to verify all apps are discovered:

```bash
node test-content-aggregation.js
```

This will:
- Scan all registered apps
- Count content items per app
- Test search functionality
- Display a summary table

### Manual Testing

1. **Admin Dashboard**: Visit `/admin` (no login required)
2. **Content API**: Test `/api/admin/content?source_app=learn-apt`
3. **Health Check**: Visit `/api/healthz` to see full inventory
4. **Learn Apps**: Visit any learn-* app homepage (all publicly accessible)

## Adding New Apps

To add a new learn-* app to the content aggregation system:

### Step 1: Create the App

```bash
cd apps/
mkdir learn-{new-app}
cd learn-{new-app}
npm init -y
```

### Step 2: Add Content Manifest

Create `manifest.json`:

```json
{
  "app": "learn-{new-app}",
  "version": "1.0.0",
  "contentTypes": ["course", "lesson"],
  "items": [
    {
      "id": "content-1",
      "type": "course",
      "title": "Sample Course",
      "description": "Course description",
      "tags": ["tag1", "tag2"],
      "app": "learn-{new-app}",
      "status": "published"
    }
  ],
  "lastUpdated": "2024-01-29T12:00:00Z"
}
```

### Step 3: Register in Content Registry

Add to `apps/main/lib/admin/contentRegistry.js`:

```javascript
'learn-{new-app}': {
  id: 'learn-{new-app}',
  name: 'learn-{new-app}',
  displayName: 'New App Display Name',
  description: 'App description',
  contentType: 'json',  // or 'markdown'
  dataPath: 'learn-{new-app}/manifest.json',
  icon: '📚',
  fields: [
    { name: 'id', label: 'ID', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ],
},
```

### Step 4: Verify

```bash
node test-content-aggregation.js
```

The new app should appear in the summary table.

## Re-enabling Authentication

To restore authentication and access control:

### Step 1: Update Environment Variables

In `.env.local`:

```bash
# Enable authentication
NEXT_PUBLIC_DISABLE_AUTH=true  # true = require authentication

# Require admin authentication
DEBUG_ADMIN=false
NEXT_PUBLIC_DEBUG_ADMIN=false

# Enable paywall
NEXT_PUBLIC_PAYWALL_ENABLED=true
```

### Step 2: Configure Supabase

1. Set up Supabase project
2. Add credentials to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Copy credentials to each app's `.env.local`

### Step 3: Restart Apps

```bash
# Stop all apps
pm2 stop all

# Restart with new config
pm2 start ecosystem.config.js
```

## Troubleshooting

### No Content Found

**Problem**: Content aggregation returns 0 items for an app

**Solutions**:
1. Check if `manifest.json` exists at the configured path
2. Verify JSON structure has `items` array
3. Check file permissions
4. Review logs: `node test-content-aggregation.js`

### Authentication Still Required

**Problem**: Login prompt still appears

**Solutions**:
1. Verify `.env.local` has correct values
2. Check `NEXT_PUBLIC_DISABLE_AUTH=false`
3. Restart the app completely
4. Clear browser cache/cookies

### App Not Showing in Registry

**Problem**: New app not appearing in content inventory

**Solutions**:
1. Add to `contentRegistry.js`
2. Verify app is in `apps/` directory (not `apps-backup/`)
3. Check dataPath is correct
4. Restart server

## Architecture Notes

### Future-Proof Design

The system is designed to be:

1. **Monorepo-friendly**: Automatically discovers apps in `apps/` directory
2. **Format-agnostic**: Supports JSON, Markdown, and can be extended
3. **Multi-backend**: Can aggregate from filesystem, Supabase, and other sources
4. **Source-tracked**: Every content item knows where it came from
5. **Extensible**: Easy to add new apps and content types

### Content Flow

```
learn-* apps → ContentManager → ContentRegistry → APIs/Dashboard
     ↓              ↓                 ↓                ↓
  manifest.json   scan files    map schemas      display data
  CONTENT.md      parse content  validate        with attribution
  data/*.json     add metadata   aggregate       
```

### Security Considerations

When re-enabling authentication:

1. **Admin Routes**: Check `is_admin` in profiles table, not user_metadata
2. **API Endpoints**: Validate JWT tokens on server-side
3. **Middleware**: Use proper session validation
4. **CORS**: Configure allowed origins
5. **Rate Limiting**: Add rate limits to prevent abuse

## Support

For questions or issues:
1. Check this documentation
2. Review code comments in modified files
3. Run test script: `node test-content-aggregation.js`
4. Check health endpoint: `/api/healthz`
5. Review implementation summary in PR description
