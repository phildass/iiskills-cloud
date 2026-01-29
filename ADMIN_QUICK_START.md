# Universal Admin Dashboard - Quick Start Guide

## Access the Dashboard

### Option 1: Development Mode (Recommended for Testing)
```bash
# 1. Set environment variables in apps/main/.env.local
echo "NEXT_PUBLIC_DEBUG_ADMIN=true" >> apps/main/.env.local
echo "DEBUG_ADMIN=true" >> apps/main/.env.local
echo "NEXT_PUBLIC_SUPABASE_SUSPENDED=true" >> apps/main/.env.local

# 2. Start the dev server
cd apps/main
npm run dev

# 3. Visit http://localhost:3000/admin/universal
```

### Option 2: Production Mode
1. Visit `/admin/universal`
2. Set your admin password (first time only)
3. Enter password on subsequent visits

## Dashboard Features

### 📱 App Switcher (Left Sidebar)
- Click any app to view its content
- 6 apps available:
  - 🧠 Aptitude Tests
  - 🏏 Cricket Content
  - 📚 JEE Exam Prep
  - 🔬 NEET Exam Prep
  - 🏛️ IAS Exam Prep
  - 🏢 Government Jobs

### 🔍 Global Search (Top Bar)
- Search across all apps simultaneously
- Searches title and description fields
- Click result to edit

### ✏️ Content Management
1. **View Content**: Select an app from sidebar
2. **Create New**: Click "+ Create New" button
3. **Edit**: Click any content card
4. **Delete**: Open editor, click "Delete" button

### 📝 Dynamic Forms
Forms auto-generate based on app schema:
- Text fields for titles, IDs
- Textareas for descriptions
- Number inputs with validation
- Date pickers for deadlines
- Dropdowns for categories
- Array fields for objectives (add/remove items)

## Adding a New App

Edit `apps/main/lib/admin/contentRegistry.js`:

```javascript
'my-new-app': {
  id: 'my-new-app',
  name: 'my-new-app',
  displayName: 'My New App',
  description: 'App description',
  contentType: 'json', // or 'markdown'
  dataPath: 'apps/my-new-app/manifest.json',
  icon: '🎓',
  fields: [
    { 
      name: 'id', 
      label: 'ID', 
      type: 'text', 
      required: true 
    },
    { 
      name: 'title', 
      label: 'Title', 
      type: 'text', 
      required: true 
    },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Cat 1', value: 'cat1' },
        { label: 'Cat 2', value: 'cat2' }
      ]
    }
  ]
}
```

## Field Types

| Type | Description | Example |
|------|-------------|---------|
| `text` | Single line input | Title, ID |
| `textarea` | Multi-line input | Description |
| `number` | Numeric input | Duration, count |
| `date` | Date/time picker | Deadline, exam date |
| `select` | Dropdown | Difficulty, category |
| `array` | List of items | Objectives, tags |
| `nested` | Object (coming soon) | Address, metadata |

## API Endpoints

### Get All Apps
```bash
GET /api/admin/apps
```

### Get App Schema
```bash
GET /api/admin/apps?app_id=learn-apt
```

### Get Content
```bash
# All content from an app
GET /api/admin/content?source_app=learn-apt

# Specific content item
GET /api/admin/content?source_app=learn-apt&content_id=test-001

# Global search
GET /api/admin/content?search=physics
```

### Create Content
```bash
POST /api/admin/content
{
  "source_app": "learn-apt",
  "data": {
    "id": "test-001",
    "title": "My Test",
    "description": "Test description"
  }
}
```

### Update Content
```bash
PUT /api/admin/content
{
  "source_app": "learn-apt",
  "content_id": "test-001",
  "data": {
    "title": "Updated Title"
  }
}
```

### Delete Content
```bash
DELETE /api/admin/content?source_app=learn-apt&content_id=test-001
```

## Troubleshooting

### Dashboard Not Loading
```bash
# Clear Next.js cache
cd apps/main
rm -rf .next
npm run dev
```

### Content Not Showing
1. Check manifest files exist:
   - `apps/learn-apt/manifest.json`
   - `apps/learn-cricket/CONTENT.md`
   - `apps/learn-govt-jobs/data/*.json`

2. Verify paths in `contentRegistry.js`

### Authentication Issues
```bash
# Clear localStorage in browser console
localStorage.clear()

# Or set DEBUG_ADMIN=true in .env.local
```

### API Errors
1. Check server logs in terminal
2. Open browser DevTools → Network tab
3. Look for 500 errors and check response

## Environment Variables

```env
# Development (bypass auth)
DEBUG_ADMIN=true
NEXT_PUBLIC_DEBUG_ADMIN=true

# Disable Supabase for testing
NEXT_PUBLIC_SUPABASE_SUSPENDED=true

# Production (secure mode)
DEBUG_ADMIN=false
NEXT_PUBLIC_DEBUG_ADMIN=false
```

## File Locations

```
apps/main/
├── pages/admin/universal.js          # Admin page route
├── pages/api/admin/                  # API endpoints
│   ├── apps.js                       # Schema API
│   ├── content.js                    # Content CRUD
│   └── auth.js                       # Authentication
├── components/
│   ├── UniversalAdminDashboard.js    # Main dashboard
│   └── admin/                        # UI components
└── lib/admin/                        # Core libraries
    ├── contentRegistry.js            # App schemas
    └── contentManager.js             # Content service
```

## Next Steps

1. ✅ Dashboard is running at `/admin/universal`
2. 📝 Create manifest files for your apps
3. 🔧 Customize schemas in `contentRegistry.js`
4. 🎨 Add new apps as needed
5. 🚀 Deploy to production (disable DEBUG_ADMIN)

## Support

For detailed information, see:
- `UNIVERSAL_ADMIN_DASHBOARD.md` - Full documentation
- `apps/main/lib/admin/contentRegistry.js` - Schema examples
- `apps/main/components/admin/ContentEditor.js` - Form examples

## Security Reminders

- ⚠️ Never set `DEBUG_ADMIN=true` in production
- 🔒 Implement password hashing before production
- 🛡️ Add rate limiting to API routes
- 📝 Enable audit logging for changes
- 🔐 Use environment variables for secrets
