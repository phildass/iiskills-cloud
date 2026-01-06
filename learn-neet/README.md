# Learn NEET - iiskills.cloud

This is a standalone Next.js application for the **Learn NEET** module of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-neet.iiskills.cloud`.

## Overview

Comprehensive NEET preparation platform with AI-powered content strictly following the official NEET syllabus. This is a **paid subscription service** requiring a mandatory 2-year membership.

### Key Features

- **2-Year Premium Subscription**: Mandatory paid registration (₹4,999) for 2-year access
- **Complete NEET Syllabus**: Full coverage of Physics (12 modules), Chemistry (12 modules), and Biology (10 modules)
- **AI-Generated Content**: Lessons, quizzes, explanations, and diagrams powered by AI
- **Module Tests**: Comprehensive tests for each module with instant feedback
- **Premium Resources**: Exclusive study materials unlocked after module completion
- **Admin Panel**: Membership management and analytics dashboard
- **Supabase Authentication**: Secure authentication with cross-subdomain support
- **Progress Tracking**: Monitor learning journey across all subjects

## Project Structure

```
learn-neet/
├── components/          # React components
│   └── Footer.js       # Footer component
├── lib/                # Utility libraries
│   ├── supabaseClient.js   # Supabase auth client
│   └── neetSyllabus.js     # NEET syllabus content structure
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   ├── index.js        # Landing page
│   ├── login.js        # Login page
│   ├── register.js     # Registration with 2-year subscription
│   ├── learn.js        # Main learning dashboard
│   ├── module-test.js  # Module test page
│   ├── premium-resources.js  # Premium resources page
│   └── admin/          # Admin pages
│       ├── index.js        # Admin dashboard
│       ├── memberships.js  # Membership management
│       └── analytics.js    # Analytics dashboard
├── public/             # Static assets
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── .env.local.example  # Environment variables template
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## NEET Syllabus Coverage

### Physics (12 Modules)
1. Physical World and Measurement
2. Kinematics
3. Laws of Motion
4. Gravitation
5. Properties of Matter
6. Thermodynamics
7. Oscillations and Waves
8. Electrostatics
9. Current Electricity
10. Magnetic Effects of Current
11. Optics
12. Modern Physics

### Chemistry (12 Modules)
1. Basic Concepts of Chemistry
2. Structure of Atom
3. Chemical Bonding
4. States of Matter
5. Thermodynamics
6. Equilibrium
7. Redox Reactions
8. Organic Chemistry Basics
9. Organic Compounds
10. Biomolecules
11. Polymers
12. Chemistry in Everyday Life

### Biology (10 Modules)
1. Diversity in Living World
2. Structural Organization
3. Plant Physiology
4. Human Physiology
5. Reproduction
6. Genetics and Evolution
7. Biology and Human Welfare
8. Biotechnology
9. Ecology
10. Neural Control

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (shared with main iiskills.cloud app)

### Installation

1. Install dependencies:

```bash
cd learn-neet
npm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

3. Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3009
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
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

## Subscription Model

### 2-Year Premium Subscription - ₹4,999

- **Duration**: 2 years from subscription date
- **Access**: Complete Physics, Chemistry, and Biology syllabus
- **Features**:
  - AI-powered lessons and explanations
  - Interactive quizzes and module tests
  - Premium study materials and resources
  - Progress tracking and analytics
  - Unlimited access for 2 years

### Registration Process

1. User creates account with email/password or Google OAuth
2. User metadata includes subscription end date (2 years from registration)
3. Subscription status initially set to `pending_payment`
4. Admin can activate subscription after payment verification
5. User gains full access to all content

## Admin Panel Features

### Membership Management
- View all registered users
- Filter by subscription status (active, pending, expired)
- Activate pending subscriptions
- Extend subscription periods
- Revoke access when needed

### Analytics Dashboard
- Total users and active subscriptions
- Subject-wise engagement metrics
- Module completion rates
- Test performance statistics
- Revenue tracking
- Recent activity feed

## Authentication

The app uses Supabase authentication with the following features:

- **Email/Password**: Traditional authentication
- **Magic Link**: Passwordless email authentication
- **Google OAuth**: One-click Google sign-in
- **Cross-Subdomain Sessions**: Shared authentication across *.iiskills.cloud
- **Role-Based Access**: Admin role for management features

## Deployment

This app can be deployed alongside other iiskills.cloud apps on separate subdomains.

### Deployment Options

1. **Vercel** (Recommended)
   - Deploy directly from the `learn-neet` directory
   - Set domain to `learn-neet.iiskills.cloud`
   - Add environment variables in Vercel dashboard

2. **VPS with Nginx + PM2**
   - Build the app and run with PM2 on port 3009
   - Configure Nginx reverse proxy for `learn-neet.iiskills.cloud`
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
| `NEXT_PUBLIC_SITE_URL` | App URL | `https://learn-neet.iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Cookie domain for auth | `.iiskills.cloud` |

## Technology Stack

- **Framework:** Next.js 16.1.1
- **React:** 19.2.3
- **Styling:** Tailwind CSS 3.4.18
- **Authentication:** Supabase Auth
- **State Management:** React Hooks

## Important Notes

- **NO NEETEdge branding** - This is Learn NEET, not NEETEdge
- **Mandatory paid subscription** - 2-year term is required
- **Official NEET syllabus** - Strictly follows the official curriculum
- **AI-generated content** - Lessons, quizzes, and explanations are AI-powered
- **Admin-controlled access** - Subscription activation requires admin approval

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
