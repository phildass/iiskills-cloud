# Technical Summary: Course-to-Subdomain Linking Architecture

## Overview
This document provides a technical analysis of the iiskills.cloud repository's architecture for linking courses to subdomain applications, along with implementation details and recommendations.

## Current Architecture

### Application Structure
The repository contains **14 independent Next.js applications**:

1. **Main Application** (`/` - root directory)
   - Primary website at `iiskills.cloud`
   - Runs on port 3000 in development
   - Contains course catalog, landing pages, authentication

2. **Subdomain Applications** (13 total)
   - `learn-ai` - Artificial Intelligence course
   - `learn-apt` - Aptitude training
   - `learn-chemistry` - Chemistry mastery
   - `learn-data-science` - Data Science fundamentals
   - `learn-geography` - Geography exploration (FREE)
   - `learn-jee` - JEE exam preparation
   - `learn-leadership` - Leadership development
   - `learn-management` - Management skills
   - `learn-math` - Mathematics
   - `learn-neet` - NEET exam preparation
   - `learn-physics` - Physics mastery
   - `learn-pr` - Public Relations
   - `learn-winning` - Success strategies

### Deployment Model: **Independent Subdomain Applications**

Each `learn-*` directory is a **completely independent Next.js application** with:
- Its own `package.json` and dependencies
- Its own `pages/`, `components/`, and `lib/` directories
- Its own Supabase authentication client
- Designed to run on a separate subdomain (e.g., `learn-ai.iiskills.cloud`)

## Key Findings

### 1. Subdomains are NOT Integrated into Main App
**Important:** The subdomain apps are **independent applications**, not routes within the main app.

**What this means:**
- Clicking a link from the main app opens a **new, separate application**
- Each subdomain app must be deployed and run independently
- They do NOT render as part of the main app's routing
- They share authentication via Supabase cross-subdomain cookies

### 2. Current Routing Setup

#### Main App (`next.config.js`)
```javascript
async rewrites() {
  return [
    // Only admin subdomain is rewritten to /admin routes
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'admin.iiskills.cloud' }],
      destination: '/admin/:path*',
    }
  ]
}
```

**Analysis:**
- Main app only has rewrites for `admin.iiskills.cloud` subdomain
- No rewrites exist for `learn-*` subdomains
- This confirms subdomain apps are meant to be deployed independently

### 3. Gap Between Courses and Subdomain Apps

**Courses Listed:** 58 courses in `pages/courses.js`
**Subdomain Apps Available:** 13 applications

**Coverage:**
- Only ~22% of listed courses have dedicated subdomain applications
- The remaining 45 courses are listed but don't have corresponding apps yet
- This is intentional - the platform is being built incrementally

## Implementation: Automated Linking Solution

### Created Utilities

#### 1. `utils/courseSubdomainMapperClient.js`
Browser-compatible utility that:
- Maps course names to subdomain applications
- Generates appropriate URLs for development and production
- Handles name normalization (e.g., "Learn AI" → "learn-ai")
- Returns null for courses without subdomain apps

**Key Functions:**
```javascript
getCourseSubdomainLink(courseName, isDevelopment)
// Returns: { subdomain, productionUrl, localUrl, url, exists }

courseHasSubdomain(courseName)
// Returns: boolean

getAllSubdomains(isDevelopment)
// Returns: array of all available subdomain metadata
```

#### 2. Updated `pages/courses.js`
- Automatically detects which courses have subdomain apps
- Shows "Course App Available" indicator for linked courses
- "Access Course" button links to subdomain URL
- Adapts URLs based on environment (dev vs production)

#### 3. Updated `pages/learn-modules.js`
- Automatically discovers all subdomain directories
- Generates module cards programmatically
- Links adapt to environment automatically

## How It Works

### Local Development
1. **Main app:** `npm run dev` on port 3000
2. **Each subdomain app:** Must be started separately
   ```bash
   cd learn-ai
   npm run dev  # Runs on port 3007
   ```

3. **Navigation:**
   - User clicks "Access Course" on main app
   - Opens `http://localhost:3007` (new tab)
   - Separate app loads with its own routing

### Production Deployment
1. **Main app:** Deployed to `iiskills.cloud`
2. **Each subdomain app:** Deployed to its own subdomain
   - `learn-ai` → `learn-ai.iiskills.cloud`
   - `learn-jee` → `learn-jee.iiskills.cloud`
   - etc.

3. **Navigation:**
   - User clicks "Access Course" on main app
   - Opens `https://learn-ai.iiskills.cloud` (new tab)
   - Separate app loads on its subdomain

### Authentication Flow
**Shared Authentication via Supabase:**
- All apps use the same Supabase project
- Session cookies are scoped to `.iiskills.cloud` domain
- User logs in once on main app
- Same session works across all subdomain apps
- Logout on any app logs out everywhere

## Deployment Requirements

### DNS Configuration
For each subdomain app, create a DNS A/CNAME record:
```
learn-ai.iiskills.cloud     → Server IP or Vercel domain
learn-jee.iiskills.cloud    → Server IP or Vercel domain
learn-apt.iiskills.cloud    → Server IP or Vercel domain
... (for all 13 subdomains)
```

### Server Deployment (e.g., VPS with Nginx)
Each app needs:
1. **Separate process** (using PM2 or similar)
2. **Unique port** (3001-3013)
3. **Nginx reverse proxy** configuration

Example Nginx config for one subdomain:
```nginx
server {
    listen 80;
    server_name learn-ai.iiskills.cloud;
    
    location / {
        proxy_pass http://localhost:3007;
        proxy_set_header Host $host;
    }
}
```

### Vercel Deployment
Each app can be deployed as a separate Vercel project with custom domain:
1. Link each `learn-*` directory as a separate project
2. Set custom domain to subdomain
3. Configure Supabase environment variables for each

## Adding New Courses with Subdomains

### Step 1: Create Subdomain App
```bash
# Example: Create learn-cybersecurity
cp -r learn-ai learn-cybersecurity
cd learn-cybersecurity
# Update package.json name
# Update README.md
# Customize content
```

### Step 2: Update Mapper
Edit `utils/courseSubdomainMapperClient.js`:
```javascript
const AVAILABLE_SUBDOMAINS = [
  // ... existing subdomains
  'learn-cybersecurity'  // Add new subdomain
]

const PORT_MAP = {
  // ... existing ports
  'learn-cybersecurity': '3014'  // Assign unique port
}
```

### Step 3: Deploy
1. Set up DNS record for `learn-cybersecurity.iiskills.cloud`
2. Deploy app to subdomain
3. **That's it!** - Courses page will automatically show "Access Course" button

**No code changes needed** to `courses.js` or `learn-modules.js` - they auto-discover!

## Recommendations

### 1. Maintain Independent Architecture
**Recommendation:** Keep subdomain apps as independent applications
- **Pros:**
  - Independent scaling (popular courses get more resources)
  - Easier maintenance (update one app without affecting others)
  - Better organization of code
  - Parallel development possible
  
- **Cons:**
  - More complex deployment
  - Shared code must be duplicated or managed carefully

### 2. Shared Component Library
**Recommendation:** Create a shared npm package for common components

Current state: `components/shared/` has shared components but they're copied to each app

Better approach:
```bash
# Create shared package
mkdir packages/iiskills-shared-components
npm init
# Publish to npm or use workspace monorepo
```

Then import in each app:
```javascript
import { SharedNavbar } from '@iiskills/shared-components'
```

### 3. Monorepo Structure
**Recommendation:** Consider using a monorepo tool (Turborepo, Nx, Lerna)

Benefits:
- Share code efficiently across apps
- Run all apps with one command
- Shared build configuration
- Better dependency management

Example with Turborepo:
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build"
  }
}
```

### 4. Environment Configuration
**Recommendation:** Use environment-aware URL generation (already implemented!)

The mapper automatically uses:
- `localhost:PORT` in development
- `https://subdomain.iiskills.cloud` in production

Based on `process.env.NODE_ENV`

### 5. Course-Subdomain Mapping Strategy
**Current approach:** Manual list in `courseSubdomainMapperClient.js`

**Alternative approaches:**
1. **Database-driven:** Store course-to-subdomain mapping in Supabase
2. **File-based discovery:** Read filesystem (requires build-time generation)
3. **API endpoint:** Main app queries available subdomains dynamically

**Recommendation:** Keep current approach for simplicity, consider database when scaling to 50+ subdomains

## Testing the Implementation

### Local Testing
1. Start main app:
   ```bash
   npm run dev
   ```

2. Start a subdomain app:
   ```bash
   cd learn-ai
   npm install
   npm run dev
   ```

3. Test navigation:
   - Visit `http://localhost:3000/courses`
   - Find "Learn AI" course card
   - Should show "✓ Course App Available"
   - Click "Access Course →"
   - Should open `http://localhost:3007` in new tab

### Production Testing
1. Ensure subdomain DNS is configured
2. Deploy each app to its subdomain
3. Test from main site `https://iiskills.cloud/courses`
4. Verify links open correct subdomain apps

## Security Considerations

### Cross-Subdomain Authentication
✅ **Implemented:** Supabase cookies scoped to `.iiskills.cloud`

**Verify in Supabase dashboard:**
- Authentication → Settings
- Cookie domain: `.iiskills.cloud`
- Ensures session works across all subdomains

### CORS Configuration
May need to configure CORS for API calls between domains:
```javascript
// In Supabase or API routes
headers: {
  'Access-Control-Allow-Origin': 'https://*.iiskills.cloud',
  'Access-Control-Allow-Credentials': 'true'
}
```

## Conclusion

### Architecture Summary
- **Type:** Multi-app subdomain architecture
- **Apps:** 1 main + 13 independent subdomain apps
- **Linking:** Automated via utility functions
- **Deployment:** Each app deployed independently
- **Authentication:** Shared via Supabase cross-subdomain sessions

### Link Behavior
- ✅ Links from main app **open subdomain app in new tab**
- ✅ Subdomain apps are **independent, not rendered in main app**
- ✅ URLs automatically adapt to **development vs production**
- ✅ New subdomains can be added by **updating one config file**

### Next Steps
1. ✅ Automated linking implemented
2. ✅ Development and production URLs handled
3. 📝 Document deployment process for each subdomain
4. 🔄 Consider monorepo structure for easier management
5. 🎯 Create shared component library to reduce duplication

---

**Last Updated:** January 2026
**Repository:** phildass/iiskills-cloud
**Architecture:** Independent Subdomain Applications with Shared Authentication
