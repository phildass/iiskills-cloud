# Admin App Setup Guide

## Overview

The **iiskills-admin** app is a separate Next.js application within the monorepo that provides a dedicated admin dashboard for managing content. This app runs exclusively in **LOCAL CONTENT MODE**, which means:

- ✅ No authentication required (no login needed)
- ✅ All data loaded from `seeds/content.json` (local test data)
- ✅ No Supabase connection (completely isolated from production database)
- ✅ Distinct PM2 process with its own port (3023)
- ✅ Separate build output (`.next` directory)
- ✅ Independent environment configuration

## Architecture

```
iiskills-cloud/
├── apps/
│   ├── main/           # Main website (Supabase + auth)
│   └── iiskills-admin/ # Admin dashboard (LOCAL MODE ONLY)
│       ├── pages/
│       │   ├── index.js     # Dashboard homepage (at /)
│       │   ├── courses.js   # Manage courses
│       │   ├── users.js     # Manage users
│       │   ├── modules.js   # Manage modules
│       │   ├── lessons.js   # Manage lessons
│       │   └── settings.js  # Admin settings
│       ├── components/
│       ├── lib/
│       │   ├── supabaseClient.js      # Configured for local mode
│       │   └── localContentProvider.js # Reads from seeds/content.json
│       ├── .env.local      # NEXT_PUBLIC_USE_LOCAL_CONTENT=true
│       └── package.json    # Port 3023
├── seeds/
│   └── content.json    # Test data for admin app
└── ecosystem.config.js # PM2 config with admin app entry
```

## Features

### 1. Complete Isolation
- **Separate Directory**: `apps/iiskills-admin` (distinct from all other apps)
- **Separate Port**: 3023 (no conflicts with other apps)
- **Separate Build**: Own `.next` directory with no sharing
- **Separate Environment**: Own `.env.local` file

### 2. Local Content Mode
- Reads all data from `seeds/content.json`
- No database connection required
- No authentication needed
- Perfect for testing and QA

### 3. Admin Features
- Dashboard with statistics (courses, users, modules, lessons)
- View and browse courses
- View user profiles
- View modules and lessons
- Settings page with password change UI (mock implementation)
- Warning banner: "LOCAL MODE - NOT FOR PRODUCTION"

### 4. Routes
- `/` - Admin Dashboard (root route)
- `/admin` - Redirects to `/` (for convenience)
- `/courses` - Manage courses
- `/users` - Manage users
- `/modules` - Manage modules
- `/lessons` - Manage lessons
- `/settings` - Admin settings

## Quick Start

### 1. Install Dependencies

```bash
cd /root/iiskills-cloud/apps/iiskills-admin
npm install
```

### 2. Build the App

```bash
npm run build
```

### 3. Start with PM2

```bash
# From repo root
pm2 start ecosystem.config.js --only iiskills-admin

# Check status
pm2 list

# View logs
pm2 logs iiskills-admin
```

### 4. Access the Admin Dashboard

Open your browser to:
```
http://localhost:3023
```

Or configure nginx/proxy to serve at:
```
http://admin.iiskills.cloud
```

## Environment Configuration

The admin app's `.env.local` file is pre-configured for local content mode:

```bash
# Local Content Mode (REQUIRED)
NEXT_PUBLIC_USE_LOCAL_CONTENT=true

# Supabase (NOT USED - placeholders only)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key-not-used-in-local-mode
NEXT_PUBLIC_SUPABASE_SUSPENDED=true

# Authentication & Paywall (DISABLED)
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_DISABLE_PAYWALL=true
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Other settings
NEXT_PUBLIC_SITE_URL=http://localhost:3023
NEXT_PUBLIC_TESTING_MODE=true
```

**⚠️ IMPORTANT**: Do NOT change `NEXT_PUBLIC_USE_LOCAL_CONTENT` to `false` in the admin app. The admin app is designed to work only in local content mode.

## PM2 Configuration

The admin app is configured in `ecosystem.config.js`:

```javascript
{
  name: "iiskills-admin",
  script: "node_modules/.bin/next",
  args: "start -p 3023",
  cwd: "/root/iiskills-cloud/apps/iiskills-admin",
  env: { 
    NODE_ENV: "production",
    NEXT_PUBLIC_USE_LOCAL_CONTENT: "true",
    NEXT_PUBLIC_SUPABASE_SUSPENDED: "true",
    NEXT_PUBLIC_DISABLE_AUTH: "true",
    NEXT_PUBLIC_DISABLE_PAYWALL: "true",
    NEXT_PUBLIC_PAYWALL_ENABLED: "false",
    NEXT_PUBLIC_TESTING_MODE: "true"
  }
}
```

## Isolation Verification

### Check Build Isolation

```bash
# Each app should have its own .next directory
ls -la /root/iiskills-cloud/apps/main/.next
ls -la /root/iiskills-cloud/apps/iiskills-admin/.next

# These should be different directories
```

### Check Process Isolation

```bash
# List all PM2 processes
pm2 list

# Should see separate processes:
# - iiskills-main (port 3000)
# - iiskills-admin (port 3023)
# - Other apps...
```

### Check Environment Isolation

```bash
# Main app should use Supabase
curl http://localhost:3000/api/health

# Admin app should use local content
curl http://localhost:3023
```

## Deployment

### Option 1: Subdomain (Recommended)

Configure nginx/proxy to route `admin.iiskills.cloud` to port 3023:

```nginx
# /etc/nginx/sites-available/admin.iiskills.cloud
server {
    listen 80;
    server_name admin.iiskills.cloud;

    location / {
        proxy_pass http://localhost:3023;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Path-based (Alternative)

Configure nginx to route `iiskills.cloud/admin` to port 3023:

```nginx
location /admin {
    proxy_pass http://localhost:3023;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

## Testing Data

The admin app displays data from `seeds/content.json`. To update test data:

1. Edit `/root/iiskills-cloud/seeds/content.json`
2. Restart the admin app:
   ```bash
   pm2 restart iiskills-admin
   ```
3. Refresh the browser

## Security Considerations

### ⚠️ DO NOT Use in Production

The admin app is designed for **local testing and QA only**. It should NOT be exposed in production because:

- No authentication required
- No data validation
- No audit logging
- Mock password change functionality
- Test data only

### Production Admin Dashboard

For production, use the main app's admin routes with proper authentication:
- `https://iiskills.cloud/admin/login` (requires admin credentials)
- Admin access controlled via Supabase `profiles.is_admin` field

## Troubleshooting

### Admin app shows "No courses found"

**Solution**: Check that `seeds/content.json` exists and contains data:
```bash
cat /root/iiskills-cloud/seeds/content.json | jq '.courses | length'
```

### Port 3023 already in use

**Solution**: Stop the process using port 3023:
```bash
pm2 stop iiskills-admin
# or
lsof -ti:3023 | xargs kill -9
```

### Admin app connects to Supabase instead of local content

**Solution**: Verify `.env.local` has correct settings:
```bash
cd /root/iiskills-cloud/apps/iiskills-admin
cat .env.local | grep NEXT_PUBLIC_USE_LOCAL_CONTENT
# Should output: NEXT_PUBLIC_USE_LOCAL_CONTENT=true
```

Then rebuild and restart:
```bash
npm run build
pm2 restart iiskills-admin
```

### Changes not reflected after updating seeds/content.json

**Solution**: Restart the admin app to reload data:
```bash
pm2 restart iiskills-admin
```

## Development

### Run in Development Mode

```bash
cd /root/iiskills-cloud/apps/iiskills-admin
npm run dev
```

Access at: `http://localhost:3023`

### Make Changes

1. Edit files in `apps/iiskills-admin/`
2. Changes hot-reload in development mode
3. Build for production: `npm run build`
4. Deploy: `pm2 restart iiskills-admin`

## Maintenance

### Update Dependencies

```bash
cd /root/iiskills-cloud/apps/iiskills-admin
npm update
npm audit fix
```

### Clean Build

```bash
cd /root/iiskills-cloud/apps/iiskills-admin
rm -rf .next node_modules
npm install
npm run build
```

### View Logs

```bash
pm2 logs iiskills-admin
pm2 logs iiskills-admin --lines 100
```

## Summary

The admin app provides a completely isolated environment for:
- ✅ Testing admin features without affecting production
- ✅ Viewing content structure from local JSON files
- ✅ No authentication hassle during development
- ✅ Safe experimentation with admin UI

For production admin access, always use the authenticated admin routes in the main app.

## Support

For questions or issues:
1. Check this documentation
2. Verify environment configuration in `.env.local`
3. Check PM2 logs: `pm2 logs iiskills-admin`
4. Ensure `seeds/content.json` is valid JSON
5. Verify port 3023 is not in use by another process
