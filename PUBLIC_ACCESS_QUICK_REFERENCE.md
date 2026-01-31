# Quick Reference: Universal Public Content Access

## TL;DR - What Changed

✅ **All content is now publicly accessible without authentication**
✅ **All 12+ learn-* apps are aggregated and visible**
✅ **Admin dashboard is public (no login required)**
✅ **Content is tagged with source app and backend**
✅ **Health endpoint available at `/api/healthz`**

## Key Environment Variables

```bash
# Public Access (DEFAULT)
NEXT_PUBLIC_DISABLE_AUTH=false          # false = public mode
DEBUG_ADMIN=true                        # true = admin access without login
NEXT_PUBLIC_DEBUG_ADMIN=true
NEXT_PUBLIC_PAYWALL_ENABLED=false       # false = no paywall
```

## Quick Test Commands

```bash
# Test content aggregation
node test-content-aggregation.js

# Check health endpoint
curl http://localhost:3000/api/healthz

# Get app content
curl http://localhost:3000/api/admin/content?source_app=learn-apt

# Search across all apps
curl http://localhost:3000/api/admin/content?search=test
```

## Modified Files

### Core System
- `apps/main/lib/admin/contentRegistry.js` - Added 9 new apps
- `apps/main/lib/admin/contentManager.js` - Recursive scanning, source attribution
- `apps/main/pages/api/admin/content.js` - Public access enabled
- `apps/main/pages/api/healthz.js` - **NEW** health check endpoint

### Authentication Bypass
- `apps/main/components/ProtectedRoute.js` - Admin routes now public
- `apps/main/components/UserProtectedRoute.js` - User routes now public
- `apps/main/components/PaidUserProtectedRoute.js` - Paid routes now public
- `learn-apt/src/middleware.ts` - Admin middleware bypassed

### Configuration
- `.env.local.example` - Updated defaults to public mode

### Testing
- `test-content-aggregation.js` - **NEW** test script

## Active Apps

| App | Status | Content Count |
|-----|--------|--------------|
| learn-apt | ✅ | 5 items |
| learn-cricket | ✅ | 16 items |
| learn-govt-jobs | ✅ | 5 items |
| learn-ai | ✅ | Ready for content |
| learn-chemistry | ✅ | Ready for content |
| learn-geography | ✅ | Ready for content |
| learn-leadership | ✅ | Ready for content |
| learn-management | ✅ | Ready for content |
| learn-math | ✅ | Ready for content |
| learn-physics | ✅ | Ready for content |
| learn-pr | ✅ | Ready for content |
| learn-winning | ✅ | Ready for content |

## Re-enable Authentication (When Needed)

**In `.env.local`:**

```bash
NEXT_PUBLIC_DISABLE_AUTH=true           # true = require auth
DEBUG_ADMIN=false                       # false = require admin login
NEXT_PUBLIC_DEBUG_ADMIN=false
NEXT_PUBLIC_PAYWALL_ENABLED=true        # true = enable paywall
```

**Then restart all apps:**

```bash
pm2 restart all
```

## Content Source Attribution

Every content item now includes:

```javascript
{
  sourceApp: "learn-apt",       // Which app owns this content
  sourceBackend: "filesystem"   // Where it's stored (filesystem/supabase)
}
```

## Health Check Response

```json
{
  "health": {
    "status": "healthy",
    "mode": "PUBLIC_ACCESS",
    "authentication": "DISABLED",
    "paywall": "DISABLED"
  },
  "stats": {
    "totalApps": 15,
    "totalContent": 26,
    "contentByApp": { /* per-app stats */ }
  }
}
```

## Adding New Content

### For Existing Apps

Edit `learn-{app}/manifest.json`:

```json
{
  "items": [
    {
      "id": "new-content-1",
      "title": "New Content",
      "description": "Description",
      "status": "published"
    }
  ]
}
```

### For New Apps

1. Create app in `learn-{new}/`
2. Add `manifest.json` with content
3. Register in `contentRegistry.js`
4. Test: `node test-content-aggregation.js`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Still seeing login | Check `NEXT_PUBLIC_DISABLE_AUTH=false` in `.env.local` |
| No content found | Verify `manifest.json` path in `contentRegistry.js` |
| App not in list | Add to `contentRegistry.js` and restart |
| Search not working | Check ContentManager logs for errors |

## Documentation

- **Full Guide**: `PUBLIC_CONTENT_ACCESS_GUIDE.md`
- **Environment Setup**: `.env.local.example`
- **Content Registry**: `apps/main/lib/admin/contentRegistry.js`

## Support Endpoints

- **Health Check**: `GET /api/healthz`
- **Content List**: `GET /api/admin/content?source_app={app-id}`
- **Search**: `GET /api/admin/content?search={query}`
- **Admin Dashboard**: `/admin`
