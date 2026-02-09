# Admin Access Guide for Localhost Development

This guide explains how to access and use the admin section during local development on the iiskills-cloud monorepo.

## Quick Start

### Access the Admin Dashboard

Visit: **http://localhost:3000/admin**

The admin dashboard provides:
- ✅ Full authority to view, edit, and check all lessons, content, and test questions
- ✅ Quick navigation to all apps running on localhost
- ✅ User management and platform state access
- ✅ Multi-site content management

## Authentication Modes

The admin section supports three authentication modes for different use cases:

### Mode 1: Local Development (First-Time / Open Access)

**Use Case**: Initial setup, rapid development, no authentication barriers

**Setup**:
```bash
# In apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=true
```

**Behavior**:
- ✅ Immediate access to admin section - no login required
- ✅ Full admin authority without any password
- ✅ Perfect for first-time setup and rapid development
- ⚠️ Shows security warning banner (expected during development)

**When to Use**:
- First visit to set up the platform
- Local development and testing
- Rapid content editing without login friction
- Quick demos without authentication setup

### Mode 2: Secret Password Access (Subsequent Visits)

**Use Case**: Secure access for staging, demos, or team testing

**Setup**:
```bash
# In apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=your_custom_password
```

**Behavior**:
- 🔐 Shows password prompt on first access
- ✅ Once entered, password persists in browser session
- ✅ No need to re-enter password on subsequent page visits
- 🔄 Password required again after browser restart or logout

**Default Password**: `iiskills123` (if NEXT_PUBLIC_ADMIN_SECRET_PASSWORD not set)

**When to Use**:
- Online demos and presentations
- QA testing with team members
- Staging environments
- Protecting admin access without full authentication setup

**Security Notes**:
- ⚠️ Default password is public - use custom password for staging
- ⚠️ Client-side storage can be manipulated - for testing only
- ✅ Change password by updating NEXT_PUBLIC_ADMIN_SECRET_PASSWORD

### Mode 3: Full Authentication (Production)

**Use Case**: Production deployment with proper user authentication

**Setup**:
```bash
# In apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=false
# Don't set NEXT_PUBLIC_ADMIN_SECRET_PASSWORD (or leave empty)

# Configure Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Behavior**:
- 🔐 Full Supabase authentication required
- 👤 Users must have admin role in profiles table
- ✅ Proper role-based access control
- 🔒 Production-ready security

**When to Use**:
- Production deployments
- When managing real user data
- Multi-user admin access with different permissions

## Localhost App Navigation

The admin dashboard includes a dedicated **"Localhost Development Navigation"** section with direct links to all apps:

### Available Apps and Ports

| App | Port | Localhost URL | Description |
|-----|------|---------------|-------------|
| **Main Domain** | 3000 | http://localhost:3000 | Primary hub and landing |
| **Learn AI** | 3024 | http://localhost:3024 | AI & Machine Learning |
| **Learn Management** | 3016 | http://localhost:3016 | Business Management |
| **Learn PR** | 3021 | http://localhost:3021 | Public Relations |
| **Learn Math** | 3017 | http://localhost:3017 | Mathematics |
| **Learn Physics** | 3020 | http://localhost:3020 | Physics Mastery |
| **Learn Chemistry** | 3005 | http://localhost:3005 | Chemistry |
| **Learn Geography** | 3011 | http://localhost:3011 | World Geography |
| **Learn Govt Jobs** | 3013 | http://localhost:3013 | Government Exams |
| **Learn APT** | 3002 | http://localhost:3002 | Aptitude Tests |
| **Learn Developer** | 3007 | http://localhost:3007 | Web Development Bootcamp |

### Starting Apps

To run apps locally, navigate to their directory and start them:

```bash
# Start a single app
cd apps/learn-math
npm run dev  # Runs on port 3017

# Start all apps (from root)
npm run dev  # Uses Turbo to run all apps
```

## Admin Features & Authority

The admin section provides full authority to:

### Content Management
- ✅ **View all courses** - Browse courses across all apps
- ✅ **Edit lessons** - Modify lesson content and structure
- ✅ **Manage modules** - Organize course modules
- ✅ **Update content** - Edit static pages and content
- ✅ **Test questions** - Review and modify test questions

### User Management
- ✅ **View users** - See all registered users
- ✅ **Manage accounts** - User administration
- ✅ **Check roles** - Verify user permissions

### Platform State
- ✅ **Statistics** - View platform-wide metrics
- ✅ **Site health** - Check status of all apps
- ✅ **Content counts** - Track courses, modules, lessons per app

### Multi-Site Navigation
- ✅ **Quick links** - Direct access to all learning apps
- ✅ **Port mapping** - Clear visibility of localhost ports
- ✅ **Visual dashboard** - Color-coded app cards

## Troubleshooting Admin Access

### Problem: Cannot access /admin (redirects or 404)

**Solutions**:
1. Check environment variable:
   ```bash
   # In apps/main/.env.local
   NEXT_PUBLIC_DISABLE_AUTH=true
   ```

2. Restart the server:
   ```bash
   cd apps/main
   npm run dev
   ```

3. Clear browser cache and localStorage:
   ```javascript
   // In browser console
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

### Problem: Password prompt shows but don't know password

**Solutions**:
1. Check environment variable for custom password:
   ```bash
   # Look for this in apps/main/.env.local
   NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=custom_password
   ```

2. Try default password: `iiskills123`

3. Switch to open access mode:
   ```bash
   # Set in apps/main/.env.local
   NEXT_PUBLIC_DISABLE_AUTH=true
   ```
   Restart server after change.

### Problem: Apps not accessible on localhost links

**Solutions**:
1. Make sure the app is running:
   ```bash
   cd apps/learn-math  # Example
   npm run dev
   ```

2. Check for port conflicts:
   ```bash
   lsof -i :3017  # Check if port is in use
   ```

3. Verify package.json has correct port:
   ```json
   {
     "scripts": {
       "dev": "next dev -p 3017"
     }
   }
   ```

### Problem: Session logic issues or auth errors

**Solutions**:
1. Check ProtectedRoute logic in components
2. Verify Supabase credentials if using Mode 3
3. Check browser console for detailed error messages
4. Clear all storage and try again:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   ```

## Environment Setup

### For Each App (Including Main)

Each app needs its own `.env.local` file. Copy from `.env.local.example`:

```bash
# From root directory
cp apps/main/.env.local.example apps/main/.env.local
cp apps/learn-math/.env.local.example apps/learn-math/.env.local
# ... repeat for all apps
```

### Required Variables for Admin Access

```bash
# Minimum for local development
NEXT_PUBLIC_DISABLE_AUTH=true

# For secret password mode
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=your_password

# For full auth (optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Quick Setup Script

```bash
#!/bin/bash
# setup-env.sh

echo "Setting up environment files..."

APPS="main learn-ai learn-math learn-physics learn-chemistry learn-geography learn-govt-jobs learn-apt learn-developer learn-management learn-pr"

for app in $APPS; do
  if [ -f "apps/$app/.env.local.example" ]; then
    cp "apps/$app/.env.local.example" "apps/$app/.env.local"
    echo "✅ Created apps/$app/.env.local"
  fi
done

echo "✨ Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit apps/main/.env.local and set NEXT_PUBLIC_DISABLE_AUTH=true"
echo "2. Run: npm run dev"
echo "3. Visit: http://localhost:3000/admin"
```

## Security Best Practices

### Local Development
✅ **Safe to use**: `NEXT_PUBLIC_DISABLE_AUTH=true`
✅ **No sensitive data**: Perfect for development
✅ **Warning banners**: Expected during development

### Staging/Demos
✅ **Use custom password**: Set `NEXT_PUBLIC_ADMIN_SECRET_PASSWORD`
✅ **Share password securely**: Don't commit to git
⚠️ **Rotate password**: If exposed or after demos

### Production
❌ **Never use**: `NEXT_PUBLIC_DISABLE_AUTH=true`
❌ **Avoid secret password**: Unless absolutely necessary
✅ **Use Supabase auth**: Proper authentication required
✅ **Monitor access**: Check audit logs regularly

## Summary of Recommended Flow

For localhost development, follow this progression:

### 1. Initial Setup (First Visit)
```bash
# apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=true
```
- Start server: `npm run dev`
- Visit: http://localhost:3000/admin
- Explore admin features
- Set up content and configuration

### 2. Team Demo (Subsequent Visits)
```bash
# apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=team_demo_2024
```
- Share password with team
- Password persists in session
- More secure than open access

### 3. Production Deployment
```bash
# apps/main/.env.local
NEXT_PUBLIC_DISABLE_AUTH=false
# Remove NEXT_PUBLIC_ADMIN_SECRET_PASSWORD
# Configure Supabase authentication
```
- Full role-based access control
- Production-ready security
- Audit trails and monitoring

## Additional Resources

- **SECRET_PASSWORD_IMPLEMENTATION_SUMMARY.md** - Detailed implementation docs
- **README_ADMIN_SETUP.md** - First-time setup guide
- **UNIFIED_ADMIN_DASHBOARD.md** - Dashboard features and capabilities
- **PORT_ASSIGNMENTS.md** - Complete port reference
- **.env.local.example** - All environment variables

## Support

If you encounter issues:
1. Check browser console for error messages
2. Verify .env.local files exist in all apps
3. Restart server after environment changes
4. Clear browser storage if session issues persist
5. Review this guide for troubleshooting steps

---

**Last Updated**: February 2026
**Version**: 1.0
**Status**: Active for Localhost Development
