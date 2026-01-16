# IISKILLS Cloud

Professional, scalable business site built with Next.js + Tailwind CSS  
Inspired by iiskills.in and customized for the Indian Institute of Professional Skills Development.

## 🆕 New Features

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

### Newsletter Subscription System
📧 **Subscribe to stay updated!** All apps now include a unified newsletter subscription system:
- Newsletter signup available on every domain and subdomain
- Modal popup on initial visit (configurable intervals)
- Dedicated `/newsletter` page on all apps
- Google reCAPTCHA v3 integration for security
- Supabase backend for email storage

### AI Assistant
🤖 **Get instant help!** A floating AI chatbot assistant is available everywhere:
- Site-aware responses based on current subdomain
- Accessible from any page
- Helpful guidance for courses, registration, and navigation
- Unobtrusive design with expandable chat window

📚 **Learn more:** See [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) for complete documentation.

## 🌟 New to iiskills.cloud?

**See our [ONBOARDING.md](ONBOARDING.md) guide to get started!**

Learn how to:
- Create your account once and access all apps
- Use universal login across the entire platform
- Choose from multiple sign-in methods
- Navigate between different learning modules seamlessly

## Project Structure

This repository contains multiple Next.js applications:

- **Main App** (`/`) - The primary iiskills.cloud website
- **Learn-Apt** (`/learn-apt/`) - Aptitude assessment with AI-powered career guidance
- **Learn-Math** (`/learn-math/`) - Mathematics learning module
- **Learn-Chemistry** (`/learn-chemistry/`) - Chemistry mastery with AI-driven curriculum
- **Learn-Winning** (`/learn-winning/`) - Success strategies and winning mindset
- **Learn-Data-Science** (`/learn-data-science/`) - Data science fundamentals
- **Learn-Management** (`/learn-management/`) - Management and business skills
- **Learn-Leadership** (`/learn-leadership/`) - Leadership development
- **Learn-AI** (`/learn-ai/`) - Artificial Intelligence fundamentals
- **Learn-PR** (`/learn-pr/`) - Public Relations and communication

- **Learn-JEE** (`/learn-jee/`) - JEE preparation with Physics, Chemistry, and Mathematics

- **Learn-Geography** (`/learn-geography/`) - Geography and world exploration (FREE)

- **Learn-JEE** (`/learn-jee/`) - JEE preparation (Physics, Chemistry, Mathematics)

- **Learn-NEET** (`/learn-neet/`) - Comprehensive NEET preparation (2-year paid subscription)
- **Learn-Physics** (`/learn-physics/`) - Physics mastery with AI-driven lessons
- **Learn-IAS** (`/learn-ias/`) - UPSC Civil Services preparation with AI-powered content (₹116.82/year)

- **Learn-Government-Jobs** (`/learn-govt-jobs/`) - Government job exam preparation

Each app can be deployed independently on different subdomains while sharing authentication.

## Local Port Map

All applications in this monorepo have been assigned unique, sequential ports to prevent EADDRINUSE errors when running concurrently. See [PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md) for full details.

| Port | Application | Description |
|------|-------------|-------------|
| 3000 | **iiskills-main** | Main website |
| 3001 | **learn-apt** | Aptitude assessment |
| 3002 | **learn-ai** | Artificial Intelligence fundamentals |
| 3003 | **learn-chemistry** | Chemistry mastery |
| 3004 | **learn-data-science** | Data science fundamentals |
| 3005 | **learn-geography** | Geography and world exploration |
| 3006 | **learn-govt-jobs** | Government job exam preparation |
| 3007 | **learn-ias** | UPSC Civil Services preparation |
| 3008 | **learn-jee** | JEE preparation |
| 3009 | **learn-leadership** | Leadership development |
| 3010 | **learn-management** | Management and business skills |
| 3011 | **learn-math** | Mathematics learning |
| 3012 | **learn-neet** | NEET preparation |
| 3013 | **learn-physics** | Physics mastery |
| 3014 | **learn-pr** | Public Relations |
| 3015 | **learn-winning** | Success strategies |

**Run all apps concurrently:**
```bash
yarn dev --concurrency=17
# or
npm run dev
```

All apps will start on their assigned ports without conflicts.

## Getting Started

### Quick Environment Setup

**⚠️ CRITICAL:** This repository includes pre-configured `.env.local` files with placeholder values in the root and all learning modules. **You MUST update these with your actual Supabase credentials before running any app**, or you will encounter runtime errors.

**Required Actions:**
1. Get your Supabase credentials from [supabase.com](https://supabase.com) (Project Settings → API)
2. Update the placeholder values in all `.env.local` files:
   - Replace `your-project-url-here` with your actual `NEXT_PUBLIC_SUPABASE_URL`
   - Replace `your-anon-key-here` with your actual `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Ensure both variables have non-empty, valid values in every `.env.local` file

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

Quick start for any module:
```bash
cd learn-{module-name}
npm install
npm run dev
```

**Learning Modules Overview:** Visit `/learn-modules` on the main app to see all available modules.

## Deployment

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

The `ecosystem.config.js` automatically configures all 16 applications with:
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
