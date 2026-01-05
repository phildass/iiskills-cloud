# IISKILLS Cloud

Professional, scalable business site built with Next.js + Tailwind CSS  
Inspired by iiskills.in and customized for the Indian Institute of Professional Skills Development.

## Project Structure

This repository contains multiple Next.js applications:

- **Main App** (`/`) - The primary iiskills.cloud website
- **Learn-Apt** (`/learn-apt/`) - Aptitude assessment with AI-powered career guidance
- **Learn-Math** (`/learn-math/`) - Mathematics learning module
- **Learn-Winning** (`/learn-winning/`) - Success strategies and winning mindset
- **Learn-Data-Science** (`/learn-data-science/`) - Data science fundamentals
- **Learn-Management** (`/learn-management/`) - Management and business skills
- **Learn-Leadership** (`/learn-leadership/`) - Leadership development
- **Learn-AI** (`/learn-ai/`) - Artificial Intelligence fundamentals
- **Learn-PR** (`/learn-pr/`) - Public Relations and communication

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
- [learn-winning/README.md](learn-winning/README.md) - Port 3003
- [learn-data-science/README.md](learn-data-science/README.md) - Port 3004
- [learn-management/README.md](learn-management/README.md) - Port 3005
- [learn-leadership/README.md](learn-leadership/README.md) - Port 3006
- [learn-ai/README.md](learn-ai/README.md) - Port 3007
- [learn-pr/README.md](learn-pr/README.md) - Port 3008

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

### Setup Supabase

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from project settings
3. Create `.env.local` in each app directory
4. Configure cookie domain to `.iiskills.cloud` for cross-subdomain auth

See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) for detailed instructions.

## Documentation

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
