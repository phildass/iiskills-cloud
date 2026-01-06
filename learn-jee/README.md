# Learn JEE

Comprehensive JEE preparation module with AI-generated lessons covering Physics, Chemistry, and Mathematics.

## Features

- **Complete JEE Coverage**: Physics, Chemistry, and Mathematics
- **AI-Generated Content**: Intelligent lessons and quizzes
- **Structured Learning**: Chapter-wise organization with clear progression
- **Free Preview**: First Physics lesson available for free
- **Paid Access**: Full course requires payment (₹99 + GST ₹17.82 = ₹116.82)
- **Supabase Authentication**: Shared login across all iiskills.cloud services

## Course Structure

### Physics
- Mechanics and Motion
- Thermodynamics
- Electromagnetism
- Modern Physics

### Chemistry
- Physical Chemistry
- Organic Chemistry
- Inorganic Chemistry

### Mathematics
- Algebra
- Calculus
- Coordinate Geometry
- Trigonometry

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at `http://localhost:3009`

### Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file based on `.env.local.example`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=https://learn-jee.iiskills.cloud
NEXT_PUBLIC_MAIN_SITE_URL=https://iiskills.cloud
```

## Pricing

- **Introductory Price**: ₹99 + GST ₹17.82 = ₹116.82 (until January 31, 2026)
- **Regular Price**: ₹299 + GST ₹53.82 = ₹352.82 (from February 1, 2026)

## Payment

Users are directed to `https://www.aienter.in/payments` for course purchase.

## Deployment

This app is designed to run on port 3009 and be served from the `learn-jee.iiskills.cloud` subdomain.

See the main [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions.

# Learn JEE - iiskills.cloud

This is a standalone Next.js application for the **Learn JEE** module of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-jee.iiskills.cloud`.

## Overview

Master Physics, Chemistry, and Mathematics for JEE (Joint Entrance Examination) preparation. This comprehensive course is designed specifically for engineering entrance exam success with AI-generated lessons and quizzes.

### Key Features

- **Mandatory Paid Registration:** Access requires authentication and course purchase
- **Free Preview:** Chapter 1, Lesson 1 is completely free to preview
- **10 Comprehensive Chapters:** Covering Physics, Chemistry, and Mathematics
- **AI-Generated Content:** Interactive lessons and quizzes powered by AI
- **Structured Learning:** Progressive content from fundamentals to advanced topics
- **JEE-Focused:** Content specifically designed for JEE Main and Advanced
- **Shared Authentication:** Seamless login across all iiskills.cloud apps
- **Responsive Design:** Learn on any device, anywhere

## Pricing

- **Full Course Access:** ₹499 + GST ₹89.82
- **Total:** ₹588.82
- **Access:** One-time payment, lifetime access
- **Free Preview:** Chapter 1, Lesson 1 available without purchase

## Project Structure

```
learn-jee/
├── components/          # React components
│   ├── Footer.js       # Footer component
│   └── shared/         # Shared components (in parent directory)
├── lib/                # Utility libraries
│   └── supabaseClient.js  # Supabase auth client with cross-subdomain support
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── index.js        # Landing page with pricing display
│   ├── login.js        # Login page
│   ├── register.js     # Registration page
│   └── learn.js        # Protected learning page with paywall
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

## Course Content

### Physics (Chapters 1-3)
- JEE Physics Fundamentals
- Mechanics and Dynamics
- Thermodynamics Essentials

### Chemistry (Chapters 4-6)
- Physical Chemistry Foundations
- Organic Chemistry Basics
- Inorganic Chemistry

### Mathematics (Chapters 7-9)
- Calculus for JEE
- Algebra Mastery
- Coordinate Geometry

### Problem-Solving (Chapter 10)
- JEE-specific strategies and techniques

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (shared with main iiskills.cloud app)

### Installation

1. Install dependencies:

```bash
cd learn-jee
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
   - Deploy directly from the `learn-jee` directory
   - Set domain to `learn-jee.iiskills.cloud`
   - Add environment variables in Vercel dashboard

2. **VPS with Nginx + PM2**
   - Build the app and run with PM2 on port 3009
   - Configure Nginx reverse proxy for `learn-jee.iiskills.cloud`
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
| `NEXT_PUBLIC_SITE_URL` | App URL | `https://learn-jee.iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Cookie domain for auth | `.iiskills.cloud` |

## Access Control

### Free Access
- Chapter 1, Lesson 1 is freely accessible to all authenticated users
- Landing page and course overview are public

### Paid Access
- Full course requires purchase
- Payment handled through external payment portal (aienter.in/payments)
- Purchase status stored in Supabase user metadata (`purchased_jee_course`)

## Technology Stack

- **Framework:** Next.js 16.1.1
- **React:** 19.2.3
- **Styling:** Tailwind CSS 3.4.18
- **Authentication:** Supabase Auth
- **Payment Integration:** External payment portal

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
