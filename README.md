# IISKILLS Cloud

Professional, scalable business site built with Next.js + Tailwind CSS  
Inspired by iiskills.in and customized for the Indian Institute of Professional Skills Development.

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
- **Learn-NEET** (`/learn-neet/`) - Comprehensive NEET preparation (2-year paid subscription)
- **Learn-Physics** (`/learn-physics/`) - Physics mastery with AI-driven lessons

Each app can be deployed independently on different subdomains while sharing authentication.

## Getting Started

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

All learning modules follow the same structure. See individual README files for details:

- [learn-apt/README.md](learn-apt/README.md) - Port 3001
- [learn-math/README.md](learn-math/README.md) - Port 3002
- [learn-chemistry/README.md](learn-chemistry/README.md) - Port 3009
- [learn-winning/README.md](learn-winning/README.md) - Port 3003
- [learn-data-science/README.md](learn-data-science/README.md) - Port 3004
- [learn-management/README.md](learn-management/README.md) - Port 3005
- [learn-leadership/README.md](learn-leadership/README.md) - Port 3006
- [learn-ai/README.md](learn-ai/README.md) - Port 3007
- [learn-pr/README.md](learn-pr/README.md) - Port 3008

- [learn-neet/README.md](learn-neet/README.md) - Port 3009
- [learn-physics/README.md](learn-physics/README.md) - Port 3009

Quick start for any module:
```bash
cd learn-{module-name}
npm install
npm run dev
```

**Learning Modules Overview:** Visit `/learn-modules` on the main app to see all available modules.

## Deployment

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

It is recommended to run your site as a service (pm2, forever, etc) for reliability.

## Shared Components

Shared components used across multiple apps are located in `/components/shared/`:

- **SharedNavbar** - Navigation bar with dual branding (iiskills + AI Cloud)

These can be imported by any app in the monorepo.

## Customization

- Logo: Replace `/public/images/iiskills-logo.png` with your own logo file.
- Colors: Edit `tailwind.config.js` to tune palette.
- Content: Edit pages as needed (Home, Apps, About, Contact, etc).
- Add new apps to `apps.js` or create new Next.js API routes/apps as needed.

## Authentication

All apps use shared Supabase authentication with cross-subdomain session support.

### Multiple Sign-In Options

iiskills.cloud supports three convenient ways to sign in:

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

See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) for detailed setup instructions.

See [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) for complete navigation and authentication documentation.

## Documentation

- [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) - **Navigation and authentication flow guide**
- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) - Authentication setup
- [MODULE_MIGRATION_SUMMARY.md](MODULE_MIGRATION_SUMMARY.md) - Learning modules migration details
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details
- Individual module READMEs in each `learn-*` directory

## Questions/Support

Contact: info@iiskills.cloud

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.
