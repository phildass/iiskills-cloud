# Learn Chemistry - iiskills.cloud

This is a standalone Next.js application for the **Learn Chemistry** module of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-chemistry.iiskills.cloud`.

## Overview

Master chemistry concepts, chemical reactions, and advance your scientific knowledge through AI-driven learning

This module provides comprehensive learning content, interactive exercises, and certification opportunities to help learners master essential skills.

### Key Features

- **Structured Learning Modules:** Progressive content from beginner to advanced
- **Interactive Exercises:** Hands-on practice and real-world applications
- **Progress Tracking:** Monitor your learning journey
- **Certification:** Earn recognized certificates upon completion
- **Shared Authentication:** Seamless login across all iiskills.cloud apps
- **Responsive Design:** Learn on any device, anywhere

## Project Structure

```
learn-chemistry/
├── components/          # React components
│   ├── Footer.js       # Footer component
│   └── shared/         # Shared components (in parent directory)
├── lib/                # Utility libraries
│   └── supabaseClient.js  # Supabase auth client with cross-subdomain support
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── index.js        # Landing page
│   ├── login.js        # Login page
│   ├── register.js     # Registration page
│   └── learn.js        # Protected learning page
├── public/             # Static assets
│   └── images/         # Images and logos
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── .env.local.example  # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (shared with main iiskills.cloud app)

### Installation

1. Install dependencies:

```bash
cd learn-chemistry
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your Supabase credentials (use the same credentials as the main app):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3009
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3009](http://localhost:3009) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed alongside other iiskills.cloud apps on separate subdomains.

### Deployment Options

1. **Vercel** (Recommended)
   - Deploy directly from the `learn-chemistry` directory
   - Set domain to `learn-chemistry.iiskills.cloud`
   - Add environment variables in Vercel dashboard

2. **VPS with Nginx + PM2**
   - Build the app and run with PM2 on port 3009
   - Configure Nginx reverse proxy for `learn-chemistry.iiskills.cloud`
   - See main [DEPLOYMENT.md](../DEPLOYMENT.md) for details

3. **Docker**
   - Build Docker image with production build
   - Run container on port 3009
   - Use Docker Compose for multi-app deployment

### Cross-Subdomain Authentication

This app uses shared Supabase authentication with all other iiskills.cloud apps:

1. Use the **same Supabase project** as the main app
2. Set cookie domain to `.iiskills.cloud` in Supabase dashboard
3. Configure `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` in production

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |
| `NEXT_PUBLIC_SITE_URL` | App URL | `https://learn-chemistry.iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Cookie domain for auth | `.iiskills.cloud` |

## Features

### Landing Page
- Module overview and benefits
- Call-to-action for registration/login
- Feature showcase

### Authentication
- Login and registration pages
- Shared sessions across all iiskills.cloud subdomains
- Protected routes for authenticated users

### Learning Page
- AI-driven chemistry curriculum with 3 levels
- 7-10 modules per level, 5 lessons per module
- Test per module for assessment
- Visual tiered progress tracking
- AI-generated lessons, quizzes, and tests
- Admin panel for content management

## Technology Stack

- **Framework:** Next.js 16.1.1
- **React:** 19.2.3
- **Styling:** Tailwind CSS 3.4.18
- **Authentication:** Supabase Auth
- **State Management:** React Hooks

## Documentation

- [Main README](../README.md) - Project overview
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [SUPABASE_AUTH_SETUP.md](../SUPABASE_AUTH_SETUP.md) - Authentication setup

## Support

- **Contact:** info@iiskills.cloud
- **Main Site:** https://iiskills.cloud
- **Issues:** Report via GitHub issues

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.
