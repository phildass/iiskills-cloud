# IISKILLS Cloud

Professional, scalable business site built with Next.js + Tailwind CSS  
Inspired by iiskills.in and customized for the Indian Institute of Professional Skills Development.

## 🆕 New Features

### 📚 Centralized Content in Supabase (NEW!)
**All educational content is now centralized in Supabase!**
- **Single Source of Truth** - All courses, modules, lessons, and questions in one database
- **Unified Schema** - Consistent structure across all 13+ learning apps
- **Government Jobs Content** - Complete geography, deadlines, and eligibility data
- **Trivia & Bios** - Support for cricket trivia and biographical content
- **RESTful APIs** - 6 unified endpoints for all content types
- **Easy Migration** - Automated scripts to import content from any source
- **Admin Management** - Content CRUD via Supabase dashboard and APIs
- **Future-Ready** - Extensible schema for new content types

📚 **Complete Documentation:**
- [CONTENT_CENTRALIZATION_GUIDE.md](CONTENT_CENTRALIZATION_GUIDE.md) - Complete schema and implementation guide
- [CONTENT_API_DOCUMENTATION.md](CONTENT_API_DOCUMENTATION.md) - All API endpoint documentation
- [CONTENT_MIGRATION_PLAYBOOK.md](CONTENT_MIGRATION_PLAYBOOK.md) - Step-by-step migration guide
- [CONTENT_CENTRALIZATION_SUMMARY.md](CONTENT_CENTRALIZATION_SUMMARY.md) - Implementation summary

🎯 **API Endpoints:**
- `/api/content/courses` - All courses with filtering and pagination
- `/api/content/modules` - Modules for any course
- `/api/content/lessons` - Lessons with quiz questions
- `/api/content/government-jobs` - Government job postings
- `/api/content/geography` - Hierarchical geography data
- `/api/content/trivia` - Trivia questions for all categories

### 🌍 Universal Public Content Access (CURRENT MODE)
**All content from all learn-* apps is now publicly accessible!**
- **No authentication required** - Full access to all courses, modules, and lessons
- **12+ active apps aggregated** - Content from learn-apt, learn-cricket, learn-govt-jobs, and more
- **Source attribution** - Every content item tagged with its source app and backend
- **Admin dashboard public** - Full admin interface accessible without login
- **Health monitoring** - `/api/healthz` endpoint shows complete content inventory
- **Future-proof** - Easy to add new apps and content sources

📚 **Complete Guides:**
- [PUBLIC_CONTENT_ACCESS_GUIDE.md](PUBLIC_CONTENT_ACCESS_GUIDE.md) - Complete implementation guide
- [PUBLIC_ACCESS_QUICK_REFERENCE.md](PUBLIC_ACCESS_QUICK_REFERENCE.md) - Quick reference for developers

🔧 **Configuration:**
```bash
NEXT_PUBLIC_DISABLE_AUTH=false  # Public access enabled
DEBUG_ADMIN=true                # Admin access without login
NEXT_PUBLIC_PAYWALL_ENABLED=false  # No paywall
```

**To re-enable authentication:** See [PUBLIC_CONTENT_ACCESS_GUIDE.md](PUBLIC_CONTENT_ACCESS_GUIDE.md#re-enabling-authentication)

### 🔐 Multi-App Authentication System
**Seamless authentication across all 18+ apps in the ecosystem!**
- **Register once, access everywhere** - Single account works on all apps and subdomains
- **Intelligent redirects** - Users stay on the app they logged into
- **App-to-app navigation** - Navigate between apps without re-authentication
- **Session persistence** - Automatic cross-domain session management
- **App registry** - Centralized configuration for all apps
- **Easy expansion** - Add new apps to the ecosystem with minimal configuration

📚 **Complete Guides:**
- [MULTI_APP_AUTH_GUIDE.md](MULTI_APP_AUTH_GUIDE.md) - Complete multi-app authentication guide
- [SUPABASE_MULTI_APP_CONFIG.md](SUPABASE_MULTI_APP_CONFIG.md) - Supabase configuration for multi-app setup
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - Technical architecture overview

🎯 **Demo:** Visit `/multi-app-demo` to see the system in action

### 🚀 Skilling Newsletter - AI-Powered Course Announcements
**Automatically generated, engaging newsletters for every new course!**
- AI-powered content generation using GPT-4o-mini
- Millennial/Gen Z-focused tone with emojis and fun copy
- Automatically triggered when courses are published
- Sends to all newsletter subscribers via **Resend** (with domain authentication)
- Public archive at `/newsletter/archive`
- Admin management at `/admin/newsletters` and `/admin/courses-manage`

📚 **Complete guide:** See [SKILLING_NEWSLETTER_README.md](SKILLING_NEWSLETTER_README.md)

📧 **Email Setup:** See [RESEND_DOMAIN_SETUP.md](RESEND_DOMAIN_SETUP.md) for domain authentication

### Universal reCAPTCHA Protection
🔒 **Security across all subdomains!** A single reCAPTCHA configuration protects the entire platform:
- **One site key for all apps** - Register once at iiskills.cloud, covers all subdomains
- **Universal bot protection** - Currently used for newsletter signups; ready for auth/registration
- **Consistent security** - Same validation rules across all apps
- **Easy setup** - Configure once in Google reCAPTCHA admin, deploy everywhere

📚 **Setup Guide:** See [UNIVERSAL_RECAPTCHA_SETUP.md](UNIVERSAL_RECAPTCHA_SETUP.md) for complete configuration instructions.

### Newsletter Subscription System
📧 **Subscribe to stay updated!** All apps now include a unified newsletter subscription system:
- Newsletter signup available on every domain and subdomain
- Modal popup on initial visit (configurable intervals)
- Dedicated `/newsletter` page on all apps
- Google reCAPTCHA v3 protection against bots
- Supabase backend for email storage

### AI Assistant
🤖 **Get instant help!** A floating AI chatbot assistant is available everywhere:
- Site-aware responses based on current subdomain
- Accessible from any page
- Helpful guidance for courses, registration, and navigation
- Unobtrusive design with expandable chat window

📚 **Learn more:** See [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) for complete documentation.

### 🗄️ Standardized Multi-App Database Schema v2
**Unified data architecture for all 16+ learning apps!** Our new schema provides seamless data sharing:
- **Progress Tracking** - Track user progress across all apps uniformly
- **Certificates** - Standardized certificate issuance with verification codes
- **Subscriptions** - Centralized payment tracking (app-specific or platform-wide)
- **Analytics** - Unified event tracking and user behavior analysis
- **Content Library** - Shared resources across multiple apps
- **Apps Registry** - Centralized configuration for all learning apps

**🎯 Quick Start:**
1. After PR merge, go to [Supabase Dashboard](https://supabase.com) → SQL Editor
2. Run 3 migration files (takes ~5-10 minutes)
3. Verify with included validation script
4. Start using new features in your apps!

**📚 Complete Documentation:**
- [SUPABASE_SCHEMA_V2.md](SUPABASE_SCHEMA_V2.md) - Full schema documentation with examples
- [SCHEMA_V2_QUICK_REFERENCE.md](SCHEMA_V2_QUICK_REFERENCE.md) - Developer quick reference with TypeScript examples
- [SCHEMA_V2_MIGRATION_CHECKLIST.md](SCHEMA_V2_MIGRATION_CHECKLIST.md) - Step-by-step migration checklist
- [supabase/migrations/README.md](supabase/migrations/README.md) - Migration instructions and troubleshooting

**✨ What You Get:**
- ✅ 6 new tables with RLS security and performance indexes
- ✅ 8 helper functions for common operations
- ✅ 16 apps pre-seeded in registry
- ✅ All migrations are idempotent (safe to re-run)
- ✅ No manual data entry required!

### 🔍 Content Quality & Validation Tools (NEW!)
**Automated content validation and quality assurance for all learning apps!**
- **Universal Content Schema** - Standardized JSON schema for courses, modules, and lessons
- **Content Validator** - Validates all content files for required fields and schema compliance
- **Orphan Checker** - Detects orphaned content and broken parent-child links
- **Duplicate ID Detection** - Finds duplicate IDs across all apps
- **Auto App Registry** - Automatically discovers and registers new apps
- **CI Integration** - Run validators in CI/CD pipelines

📚 **Quick Commands:**
```bash
# Validate all content files
npm run validate-content

# Check for orphans and broken links
npm run check-orphans

# Generate app registry from apps/
npm run generate:registry

# Validate specific app
npm run validate-content -- --app=learn-ai --verbose
npm run check-orphans -- --app=learn-cricket
```

📋 **Content Structure:**
Each learning app maintains content in standardized directories:
```
learn-*/
├── content/
│   ├── courses/    # Course definitions (JSON)
│   ├── modules/    # Module definitions (JSON)
│   └── lessons/    # Lesson content (JSON)
```

📖 **Complete Guides:**
- [ADDING_NEW_APP.md](ADDING_NEW_APP.md) - Complete guide to adding new learning apps
- [ROUTING_CONFIGURATION.md](ROUTING_CONFIGURATION.md) - Domain routing and Nginx/Traefik setup
- [lib/contentSchema.js](lib/contentSchema.js) - Content schema reference

🔧 **Admin API:**
- `/api/admin/check-orphans` - REST API for orphan detection (supports `?app=learn-ai` filter)

## 🌟 New to iiskills.cloud?

**See our [ONBOARDING.md](ONBOARDING.md) guide to get started!**

Learn how to:
- Create your account once and access all apps
- Use universal login across the entire platform
- Choose from multiple sign-in methods
- Navigate between different learning modules seamlessly

## Project Structure

This is a **Yarn v4 (Berry) monorepo** with all applications organized in the `apps/` directory.

### Monorepo Structure

```
iiskills-cloud/
├── apps/                          # All active workspace applications
│   ├── main/                      # Main iiskills.cloud website (app.iiskills.cloud)
│   │                              # Contains universal admin dashboard
│   ├── learn-ai/                  # AI learning module
│   ├── learn-apt/                 # Aptitude assessment
│   ├── learn-chemistry/           # Chemistry learning
│   ├── learn-cricket/             # Cricket knowledge (FREE)
│   ├── learn-geography/           # Geography learning
│   ├── learn-govt-jobs/           # Government jobs prep
│   ├── learn-leadership/          # Leadership development
│   ├── learn-management/          # Management skills
│   ├── learn-math/                # Mathematics
│   ├── learn-physics/             # Physics mastery
│   ├── learn-pr/                  # Public Relations
│   └── learn-winning/             # Success strategies
├── apps-backup/                   # Archived legacy apps (not deployed)
│   ├── admin/                     # Legacy admin app
│   ├── coming-soon/               # Legacy coming soon page
│   ├── iiskills-admin/            # Legacy admin dashboard
│   ├── learn-data-science/        # Archived app
│   ├── learn-ias/                 # Archived app
│   ├── learn-jee/                 # Archived app
│   └── learn-neet/                # Archived app
├── packages/                       # Shared packages
│   └── core/                      # Core utilities
├── components/                     # Shared components
├── lib/                           # Shared libraries
├── utils/                         # Shared utilities
└── package.json                   # Root package.json

```

### Building and Running Apps

The monorepo uses Yarn workspaces for dependency management. All apps are configured as workspaces and can be managed from the root.

**Install dependencies:**
```bash
yarn install
```

**Build all apps:**
```bash
yarn build
```

**Run a specific app in development mode:**
```bash
cd apps/main && yarn dev             # Main app (with universal admin)
cd learn-ai && yarn dev         # Learn AI app
cd learn-chemistry && yarn dev  # Learn Chemistry app
# ... etc
```

**List all workspaces:**
```bash
yarn workspaces list
```

## 🎓 Production Applications

This repository contains **13 production-ready Next.js applications** (main + 12 learning apps):

### Main Platform
- **Main App** (`apps/main/`) - The primary iiskills.cloud website with universal admin dashboard

### Active Learning Apps (Production)
- **Learn-AI** (`learn-ai/`) - Artificial Intelligence fundamentals
- **Learn-Apt** (`learn-apt/`) - Aptitude assessment with AI-powered career guidance
- **Learn-Chemistry** (`learn-chemistry/`) - Chemistry mastery with comprehensive curriculum
- **Learn-Cricket** (`learn-cricket/`) - Cricket knowledge and strategies (FREE)
- **Learn-Geography** (`learn-geography/`) - Geography and world exploration
- **Learn-Government-Jobs** (`learn-govt-jobs/`) - Government job exam preparation
- **Learn-Leadership** (`learn-leadership/`) - Leadership development
- **Learn-Management** (`learn-management/`) - Management and business skills
- **Learn-Math** (`learn-math/`) - Mathematics learning module
- **Learn-Physics** (`learn-physics/`) - Physics mastery with structured curriculum
- **Learn-PR** (`learn-pr/`) - Public Relations and communication
- **Learn-Winning** (`learn-winning/`) - Success strategies and winning mindset

### Archived Applications
Legacy and inactive apps have been moved to `apps-backup/` and are not deployed:
- `admin/` - Legacy standalone admin interface (now integrated into main app)
- `coming-soon/` - Legacy placeholder page
- `iiskills-admin/` - Legacy admin dashboard
- `learn-data-science/`, `learn-ias/`, `learn-jee/`, `learn-neet/` - Archived learning modules

Each active app can be deployed independently on different subdomains while sharing authentication.

## 🚀 Multi-App Subdomain Deployment

**NEW: Automated deployment to VPS with subdomain routing!**

Deploy all learning apps to their respective subdomains on Hostinger VPS with one command:

```bash
# Verify DNS configuration
./verify-subdomain-dns.sh

# Deploy everything (build, PM2, Nginx, SSL)
sudo ./deploy-subdomains.sh

# Monitor app health
./monitor-apps.sh
```

**Features:**
- ✅ Automated DNS verification for all subdomains
- ✅ Builds and deploys all apps with PM2
- ✅ Auto-configures Nginx reverse proxies
- ✅ Sets up SSL certificates with Let's Encrypt
- ✅ Health monitoring dashboard
- ✅ Idempotent and safe to re-run

**Documentation:**
- 📚 **Full Guide:** [MULTI_APP_DEPLOYMENT_GUIDE.md](MULTI_APP_DEPLOYMENT_GUIDE.md)
- 📋 **Quick Reference:** [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)

## Local Port Map

All active production applications have been assigned unique ports. See [PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md) for full details.

| Port | Application | Status | Description |
|------|-------------|--------|-------------|
| 3000 | **iiskills-main** | ✅ Active | Main website with universal admin dashboard |
| 3001 | **learn-ai** | ✅ Active | Artificial Intelligence fundamentals |
| 3002 | **learn-apt** | ✅ Active | Aptitude assessment |
| 3005 | **learn-chemistry** | ✅ Active | Chemistry mastery |
| 3009 | **learn-cricket** | ✅ Active | Cricket knowledge (FREE) |
| 3011 | **learn-geography** | ✅ Active | Geography and world exploration |
| 3013 | **learn-govt-jobs** | ✅ Active | Government job exam preparation |
| 3015 | **learn-leadership** | ✅ Active | Leadership development |
| 3016 | **learn-management** | ✅ Active | Management and business skills |
| 3017 | **learn-math** | ✅ Active | Mathematics learning |
| 3020 | **learn-physics** | ✅ Active | Physics mastery |
| 3021 | **learn-pr** | ✅ Active | Public Relations |
| 3022 | **learn-winning** | ✅ Active | Success strategies |

**Archived apps** (in apps-backup/): admin, coming-soon, iiskills-admin, learn-data-science, learn-ias, learn-jee, learn-neet

**Run all active apps concurrently:**
```bash
yarn workspaces foreach -A run dev
```

All apps will start on their assigned ports without conflicts.

## Getting Started

### Quick Environment Setup

**⚠️ CRITICAL:** This repository includes pre-configured `.env.local` files with placeholder values in the root and all learning modules. **You MUST update these with your actual Supabase and reCAPTCHA credentials before running any app**, or you will encounter runtime errors.

**Required Actions:**
1. Get your Supabase credentials from [supabase.com](https://supabase.com) (Project Settings → API)
2. Get your reCAPTCHA keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
3. Update the placeholder values in all `.env.local` files:
   - Replace `your-project-url-here` with your actual `NEXT_PUBLIC_SUPABASE_URL`
   - Replace `your-anon-key-here` with your actual `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Replace `your-recaptcha-site-key-here` with your actual `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - Replace `your-recaptcha-secret-key-here` with your actual `RECAPTCHA_SECRET_KEY`
4. Ensure all variables have non-empty, valid values in every `.env.local` file

**Universal reCAPTCHA Setup:**
- Register a **SINGLE** site key for `iiskills.cloud` (this covers ALL subdomains)
- Choose reCAPTCHA v3 for invisible verification
- Add domain: `iiskills.cloud` in the reCAPTCHA admin console
- Use the **SAME** site key and secret key across **ALL** apps

**Verification:** Run `./ensure-env-files.sh` to check if all environment files are properly configured.

**Option 1: Automated Setup (Recommended)**

```bash
# Run the setup script to configure all apps at once
./setup-env.sh
```

The script will:
- Prompt you for your Supabase credentials
- Configure the main app
- Configure all learning modules automatically
- Ensure all apps use the same credentials

**Option 2: Manual Setup**

See **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** for detailed manual setup instructions.

### Main App

#### 1. Install dependencies

```bash
npm install
```

#### 2. Run locally

```bash
npm run dev
```

Site will be available at `http://localhost:3000`

#### 3. Build for production

```bash
npm run build
npm start
```

### Learning Modules

All learning modules follow the same structure. Each has its assigned port (see Local Port Map above):

- [learn-apt/README.md](learn-apt/README.md) - Port 3001
- [learn-ai/README.md](learn-ai/README.md) - Port 3002
- [learn-chemistry/README.md](learn-chemistry/README.md) - Port 3003
- [learn-data-science/README.md](learn-data-science/README.md) - Port 3004
- [learn-geography/README.md](learn-geography/README.md) - Port 3005
- [learn-govt-jobs/README.md](learn-govt-jobs/README.md) - Port 3006
- [learn-ias/README.md](learn-ias/README.md) - Port 3007
- [learn-jee/README.md](learn-jee/README.md) - Port 3008
- [learn-leadership/README.md](learn-leadership/README.md) - Port 3009
- [learn-management/README.md](learn-management/README.md) - Port 3010
- [learn-math/README.md](learn-math/README.md) - Port 3011
- [learn-neet/README.md](learn-neet/README.md) - Port 3012
- [learn-physics/README.md](learn-physics/README.md) - Port 3013
- [learn-pr/README.md](learn-pr/README.md) - Port 3014
- [learn-winning/README.md](learn-winning/README.md) - Port 3015
- [learn-cricket/README.md](learn-cricket/README.md) - Port 3016

Quick start for any module:
```bash
cd learn-{module-name}
npm install
npm run dev
```

**Learning Modules Overview:** Visit `/learn-modules` on the main app to see all available modules.

## Deployment

### Automated Deployment

Use the deployment script for safe, automated deployments:

```bash
cd ~/iiskills-cloud
./scripts/deploy.sh
```

This script will:
1. Pull latest code
2. Install dependencies
3. Test all app builds
4. Restart PM2
5. Health check all apps

### Manual Deployment

If you need to deploy manually:

```bash
git pull origin main
yarn install
./scripts/pre-deploy-check.sh  # Verify builds
pm2 restart all
pm2 save
```

### CI/CD

All pull requests are automatically tested by GitHub Actions. PRs with build failures cannot be merged.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the complete deployment checklist.

### Production Deployment with PM2

**Recommended:** Use PM2 process manager to run all applications in production. See [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) for comprehensive instructions.

#### Automatic Entry Point Detection

The `ecosystem.config.js` file is **automatically generated** by scanning the repository for Next.js applications and detecting their entry points. This ensures reliable startup on any fresh clone without manual configuration.

To regenerate the PM2 configuration:
```bash
npm run generate-pm2-config
```

To validate the configuration:
```bash
npm run validate-pm2-config
```

See [PM2_AUTO_DETECTION.md](PM2_AUTO_DETECTION.md) for details about the auto-detection system.

#### Quick start:
```bash
# Install dependencies and build all apps
npm install && npm run build
for dir in learn-*/; do (cd "$dir" && npm install && npm run build); done

# Start all apps with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The `ecosystem.config.js` automatically configures all 18 applications with:
- Proper port assignments (auto-detected from package.json)
- Cross-platform compatibility
- Automatic conflict resolution
- Complete logging configuration

### Other Deployment Options

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel deployment
- VPS deployment with Nginx and PM2
- Docker deployment
- Cross-subdomain authentication setup
- SSL configuration

### Quick Deploy to Hostinger VPS

Copy this repo/files to your VPS.  
Set up Node.js, Nginx (reverse proxy to ports 3000/3001), and SSL (using Certbot).

#### Example Nginx config:

```nginx
server {
    listen 80;
    server_name iiskills.cloud www.iiskills.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

It is recommended to run your site as a service using **PM2** for reliability and easy management. See [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) for complete instructions.

## Shared Components

Shared components used across multiple apps are located in `/components/shared/`:

- **SharedNavbar** - Navigation bar with dual branding (iiskills + AI Cloud)

These can be imported by any app in the monorepo.

## Customization

- Logos: Replace `/public/images/iiskills-logo.png` and `/public/images/ai-cloud-logo.png` with your own logo files. These are used universally across all domains and subdomains.
- Colors: Edit `tailwind.config.js` to tune palette.
- Content: Edit pages as needed (Home, Apps, About, Contact, etc).
- Add new apps to `apps.js` or create new Next.js API routes/apps as needed.

## Authentication

### 🌟 Registration-First Universal Authentication System

**Important: Registration Required Before Access**

iiskills.cloud uses a **registration-first workflow** with a **unified authentication system**:

- 📝 **Registration Required:** You must create an account before accessing any learning content
- ✅ **Register ONCE:** Create an account on **any** iiskills.cloud app (main site, Learn-Apt, Learn-JEE, Learn-NEET, etc.)
- ✅ **Universal Access:** Automatically get access to **all** other apps and subdomains
- ✅ **Same Credentials:** Use the **same login** credentials everywhere
- ✅ **Shared Session:** Your session works across **all** `*.iiskills.cloud` domains

**Registration-First Workflow:**
1. Visit any iiskills.cloud app landing page
2. Click "Register Free Account" to create your account
3. Complete the registration form (simplified on subdomains, full on main site)
4. Confirm your email address
5. Sign in and access all learning content across all apps

**Example:**
1. Try to access `learn-apt.iiskills.cloud/learn`
2. Automatically redirected to `/register` (registration required)
3. Complete registration once
4. Now access `iiskills.cloud`, `learn-jee.iiskills.cloud`, or any other app with the same credentials
5. No need to register again!

### Multiple Sign-In Options

All apps support three convenient authentication methods:

1. **Magic Link (Recommended)** - Passwordless email authentication
   - Enter your email address
   - Receive a secure sign-in link via email
   - Click the link to sign in automatically
   - No password required!

2. **Google OAuth** - Sign in with your Google account
   - One-click authentication
   - Uses your existing Google account
   - Fast and secure

3. **Email & Password** - Traditional authentication
   - Available as a fallback option
   - Use if you prefer password-based login

**All authentication methods work across every app in the iiskills.cloud ecosystem!**

### Forgot Your Password?

Don't worry! You have two easy options:

1. **Use Magic Link** - Simply click "Use magic link instead" on the login page and enter your email. You'll receive a sign-in link that works without a password.

2. **Use Google Sign-In** - If you previously signed up with Google, just click "Continue with Google" to sign in.

### For Email-Only Users

If you prefer to sign in without using passwords:

1. Always choose the **Magic Link** option on the login page
2. Enter your email address
3. Check your email inbox for the secure sign-in link
4. Click the link to access your account instantly

The magic link is valid for a limited time and can only be used once for security.

### Admin Access

Admin users can access the admin dashboard at `/admin/login` using any of the three sign-in methods. Admin access requires:

- A valid user account with admin privileges
- Admin role assigned in the Supabase user metadata
- Access is validated on every request for security

**Note:** Admin login pages are not shown in public navigation for security reasons. Only authenticated admin users can see admin dashboard links.

### Key Features

- **Single Sign-On (SSO)** - Login once, access all subdomains
- **Role-Based Access** - Admin access controlled by Supabase user metadata
- **Secure Admin Access** - Admin section accessible only via direct URL (`/admin`), not exposed in navigation
- **Consistent Navigation** - SharedNavbar component used across all apps
- **No Hardcoded Credentials** - All authentication validated against Supabase backend

### Setup Supabase

To enable authentication features:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from project settings
3. Configure Google OAuth provider in Supabase dashboard (Authentication > Providers)
4. Enable email authentication and magic links in Supabase settings
5. Create `.env.local` in each app directory with your credentials
6. Configure cookie domain to `.iiskills.cloud` for cross-subdomain auth

**🔧 If Google sign-in doesn't work**: See [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) for a 5-minute fix guide, or run `./google-oauth-check.sh` to diagnose issues.

See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) for detailed setup instructions.

**Important:** See [SUPABASE_CONFIGURATION.md](SUPABASE_CONFIGURATION.md) for the complete guide on configuring Supabase environment variables across all subdomains.

See [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) for complete navigation and authentication documentation.

## Documentation

### For Users
- [ONBOARDING.md](ONBOARDING.md) - **Getting started guide for new users**

### For Developers
- [CONTRIBUTING.md](CONTRIBUTING.md) - **🤖 Contributing guidelines (includes AI agent handover practices)**
- [DEV_AI_LOG.md](DEV_AI_LOG.md) - **🤖 AI agent session log for continuity and handover**
- [SUPABASE_SCHEMA_V2.md](SUPABASE_SCHEMA_V2.md) - **🆕 Complete Schema v2 documentation (database tables, functions, examples)**
- [SCHEMA_V2_QUICK_REFERENCE.md](SCHEMA_V2_QUICK_REFERENCE.md) - **🆕 Developer quick reference with TypeScript code examples**
- [SCHEMA_V2_MIGRATION_CHECKLIST.md](SCHEMA_V2_MIGRATION_CHECKLIST.md) - **🆕 Step-by-step migration checklist**
- [supabase/migrations/README.md](supabase/migrations/README.md) - **🆕 Migration instructions and troubleshooting**
- [UNIVERSAL_RECAPTCHA_SETUP.md](UNIVERSAL_RECAPTCHA_SETUP.md) - **Universal reCAPTCHA configuration guide**
- [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) - **Complete guide to Newsletter and AI Assistant system**
- [LEARN_APPS_INTEGRATION_GUIDE.md](LEARN_APPS_INTEGRATION_GUIDE.md) - **Guide for integrating features into learn-* apps**
- [SUPABASE_CONFIGURATION.md](SUPABASE_CONFIGURATION.md) - **Complete Supabase configuration guide (MUST READ)**
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - **Complete guide to universal authentication system**
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) - Authentication setup and troubleshooting
- [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) - **⚡ 5-minute guide to fix Google sign-in issues**
- [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md) - **Comprehensive Google sign-in troubleshooting**
- [CALLBACK_URLS_REFERENCE.md](CALLBACK_URLS_REFERENCE.md) - Complete list of callback URLs for all domains/subdomains
- [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) - **Navigation and authentication flow guide**
- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide
- [MODULE_MIGRATION_SUMMARY.md](MODULE_MIGRATION_SUMMARY.md) - Learning modules migration details
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details
- Individual module READMEs in each `learn-*` directory

### 🔧 Troubleshooting Tools

- **Google OAuth Quick Fix**: See [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) (5-minute guide)
- **Google OAuth Verification Script**: Run `./google-oauth-check.sh` to verify Google sign-in configuration
- **Comprehensive Troubleshooting**: See [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md) for detailed debugging

## Questions/Support

Contact: info@iiskills.cloud

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.
