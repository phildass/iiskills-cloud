# Admin Panel Production Deployment & Troubleshooting Guide

## Overview

The iiskills-cloud admin panel is a Next.js application that provides a unified dashboard for managing all content across the platform. It aggregates data from multiple sources and provides comprehensive error reporting for debugging.

**Production URL**: https://app.iiskills.cloud/admin (proxied to port 3023)

## Key Features

✅ **Unified Data Aggregation**: Automatically merges data from Supabase and local content  
✅ **Graceful Fallback**: Works with Supabase only, local only, or both  
✅ **Comprehensive Error Reporting**: Detailed stack traces and diagnostics in all environments  
✅ **Health Check Endpoint**: Monitor system status and data source availability  
✅ **Zero Configuration**: Auto-discovers and aggregates all available data sources

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Deployment                      │
│         https://app.iiskills.cloud/admin                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ (Nginx Proxy)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Admin App (Port 3023)                           │
│           apps/iiskills-admin (Next.js)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│         Unified Content Provider (lib/)                      │
│   Auto-aggregates from all available sources                │
└────────┬──────────────────────────────┬─────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌─────────────────────┐
│ Supabase DB     │          │ Local Content       │
│ (Production)    │          │ seeds/content.json  │
│                 │          │ (Fallback/Test)     │
└─────────────────┘          └─────────────────────┘
```

## Environment Variables

### Required in Production

```bash
# Supabase Configuration (REQUIRED for production data)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Temporarily disable Supabase (fallback to local only)
NEXT_PUBLIC_SUPABASE_SUSPENDED=false

# Optional: Force local-only mode (not recommended for production)
NEXT_PUBLIC_USE_LOCAL_CONTENT=false
```

### How to Set Environment Variables

**Option 1: System Environment Variables** (Recommended)
```bash
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

**Option 2: .env.local File** (Development)
```bash
# In /root/iiskills-cloud/apps/iiskills-admin/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option 3: PM2 Ecosystem File** (Alternative)
```javascript
// In ecosystem.config.js
env: {
  NODE_ENV: "production",
  NEXT_PUBLIC_SUPABASE_URL: "https://your-project.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "your-anon-key-here"
}
```

## Deployment Steps

### 1. Build the Admin App

```bash
cd /root/iiskills-cloud/apps/iiskills-admin
yarn build
# or
npm run build
```

### 2. Set Environment Variables

Ensure Supabase credentials are set (see above).

### 3. Start with PM2

```bash
# Start all apps including admin
pm2 start ecosystem.config.js

# Or start admin only
pm2 start ecosystem.config.js --only iiskills-admin

# Check status
pm2 status

# View logs
pm2 logs iiskills-admin
```

### 4. Verify Deployment

```bash
# Check health endpoint
curl http://localhost:3023/api/health

# Expected response:
{
  "status": "OK",
  "message": "All systems operational",
  "timestamp": "2024-01-29T12:00:00.000Z",
  "dataSources": {
    "supabase": "AVAILABLE",
    "localContent": "AVAILABLE",
    "mode": "merged"
  },
  "dataCounts": {
    "courses": 10,
    "modules": 30,
    "lessons": 150,
    "users": 1000
  }
}
```

### 5. Test Admin Dashboard

Visit: https://app.iiskills.cloud/admin

Expected behavior:
- Dashboard loads without errors
- Statistics display (courses, users, modules, lessons)
- Data source breakdown shows Supabase + Local counts
- No "Oops! Something went wrong" error

## Troubleshooting

### Issue: "Oops! Something went wrong"

**Diagnosis Steps:**

1. **Check Browser Console (F12)**
   - Look for JavaScript errors
   - Check Network tab for failed API calls
   - Note any error messages or stack traces

2. **Check Server Logs**
   ```bash
   pm2 logs iiskills-admin --lines 100
   ```
   Look for:
   - Error messages with `❌` prefix
   - Stack traces
   - Environment variable status

3. **Verify Health Check**
   ```bash
   curl http://localhost:3023/api/health | jq
   ```
   
   Check:
   - `status`: Should be "OK" or "WARNING"
   - `dataSources`: Verify Supabase availability
   - `errors`: Any data fetch errors listed

4. **Check Environment Variables**
   ```bash
   pm2 show iiskills-admin
   ```
   Verify:
   - NEXT_PUBLIC_SUPABASE_URL is set correctly
   - NEXT_PUBLIC_SUPABASE_ANON_KEY is set correctly
   - No SUPABASE_SUSPENDED=true flag

**Common Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Missing Supabase credentials | Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY |
| Invalid Supabase credentials | Verify credentials in Supabase dashboard |
| Supabase suspended | Remove or set NEXT_PUBLIC_SUPABASE_SUSPENDED=false |
| seeds/content.json missing | Create seeds/content.json with sample data |
| Next.js build error | Run `yarn build` in admin directory and check for errors |
| Port 3023 not accessible | Check firewall, nginx config, or PM2 status |

### Issue: Admin Shows No Data

**Diagnosis:**

1. Check health endpoint: `curl http://localhost:3023/api/health`
2. Check data source status in dashboard (bottom of page)
3. Check PM2 logs for data fetch errors

**Solutions:**

- If Supabase is empty: Populate database or ensure local content exists
- If local content missing: Create `seeds/content.json` with sample data
- If both empty: Dashboard will correctly show 0 - this is expected

### Issue: Production Error with No Details

**Solution:** Enhanced error reporting is now ALWAYS enabled in admin panel.

1. Check browser console - full stack traces are displayed
2. Check PM2 logs - server-side errors logged with full details
3. Visit `/api/health` - system diagnostics available
4. Error boundary shows full error details with troubleshooting tips

### Issue: "Local Mode Only" Warning Banner

**Cause:** Admin is running in local-only mode (Supabase disabled)

**Solution:**
```bash
# Remove local-only flags
unset NEXT_PUBLIC_USE_LOCAL_CONTENT
unset NEXT_PUBLIC_SUPABASE_SUSPENDED

# Set Supabase credentials
export NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
export NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"

# Restart admin
pm2 restart iiskills-admin
```

## Data Source Management

### Supabase (Primary Source)

**Advantages:**
- Production data
- Real user information
- Real-time updates
- Persistent storage

**When to Use:**
- Production environment
- Real data management
- Multi-user access

### Local Content (Fallback Source)

**Location:** `seeds/content.json`

**Advantages:**
- Works without database
- Fast for testing
- Version controlled
- No network dependency

**When to Use:**
- Development/testing
- Offline work
- Backup data
- Demo environments

### Unified Mode (Default)

The admin automatically uses BOTH sources:
- Supabase data takes precedence
- Local data fills gaps
- Never shows empty unless both are empty
- Source badges indicate origin

## Monitoring & Alerts

### Health Check Endpoint

**URL:** `/api/health`

**Use Cases:**
- Uptime monitoring (UptimeRobot, Pingdom)
- Load balancer health checks
- CI/CD deployment verification
- Manual diagnostics

**Response Codes:**
- `200` - OK or WARNING (system operational)
- `503` - ERROR (critical failure)

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs iiskills-admin

# Get detailed app info
pm2 show iiskills-admin

# Restart if needed
pm2 restart iiskills-admin
```

### Log Patterns to Watch

```bash
# Errors (investigate immediately)
pm2 logs iiskills-admin | grep "❌"

# Warnings (monitor)
pm2 logs iiskills-admin | grep "⚠️"

# Success indicators (normal)
pm2 logs iiskills-admin | grep "✅"
```

## API Endpoints Reference

All endpoints return JSON with consistent structure:
```json
{
  "data": [...],     // Actual data (array or object)
  "error": null,     // Error message if failed
  "timestamp": "...", // ISO timestamp (on errors)
  "stack": "..."     // Stack trace (non-production only)
}
```

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/health` | GET | System diagnostics | Health status report |
| `/api/stats` | GET | Dashboard statistics | Total counts + source breakdown |
| `/api/courses` | GET | List all courses | Array of courses with _source |
| `/api/modules` | GET | List all modules | Array of modules with _source |
| `/api/lessons` | GET | List all lessons | Array of lessons with _source |
| `/api/users` | GET | List all users/profiles | Array of profiles with _source |

## Security Notes

⚠️ **Important Security Considerations:**

1. **No Authentication:** Admin panel currently has auth disabled
   - Recommended: Add authentication middleware in production
   - Consider: IP whitelist, basic auth, or OAuth

2. **Public API Endpoints:** All `/api/*` endpoints are publicly accessible
   - Consider: Add API key authentication
   - Consider: Rate limiting

3. **Error Details:** Full error details exposed in admin panel
   - This is intentional for admin debugging
   - Not exposed to non-admin users

4. **Environment Variables:** Credentials in process environment
   - Use secrets management in production
   - Rotate keys regularly

## Future Enhancements

Potential improvements:

- [ ] Auto-discovery of content from learn-* apps
- [ ] Sync button to migrate local → Supabase
- [ ] Edit local content via web UI
- [ ] Authentication middleware
- [ ] Rate limiting
- [ ] Audit logging
- [ ] Data import/export tools
- [ ] Real-time updates via websockets
- [ ] Content validation and schema enforcement

## Support

### Getting Help

1. **Check this guide** - Most issues covered here
2. **Review error details** - Browser console + PM2 logs
3. **Run health check** - `/api/health` endpoint
4. **Check documentation** - `UNIFIED_ADMIN_DASHBOARD.md`

### Reporting Issues

When reporting issues, include:
- Error message and stack trace
- Health check output (`/api/health`)
- PM2 logs (`pm2 logs iiskills-admin`)
- Environment variables (sanitized)
- Steps to reproduce
- Expected vs actual behavior

---

## Quick Reference Commands

```bash
# Build admin app
cd /root/iiskills-cloud/apps/iiskills-admin && yarn build

# Start with PM2
pm2 start ecosystem.config.js --only iiskills-admin

# Check status
pm2 status iiskills-admin

# View logs
pm2 logs iiskills-admin --lines 50

# Test health
curl http://localhost:3023/api/health | jq

# Restart
pm2 restart iiskills-admin

# Stop
pm2 stop iiskills-admin

# Delete from PM2
pm2 delete iiskills-admin
```

---

**Last Updated:** 2024-01-29  
**Version:** 2.0 (Production-Ready with Enhanced Diagnostics)
