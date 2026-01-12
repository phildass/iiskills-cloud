# Learn Government Jobs

Comprehensive preparation platform for various government examinations including UPSC, Banking, Railways, SSC, and more.

## Overview

Learn Government Jobs is a subdomain application of iiskills.cloud, providing structured learning materials, practice tests, and exam strategies for government job aspirants.

## Features

- **Comprehensive Content**: Study materials for multiple government exams
- **Practice Tests**: Mock tests and subject-wise assessments
- **Current Affairs**: Regular updates on important news and events
- **Exam Strategies**: Time management and revision techniques
- **Universal Authentication**: Shared login across all iiskills.cloud apps

## Exam Coverage

- UPSC Civil Services (IAS, IPS, IFS)
- Banking Exams (IBPS PO/Clerk, SBI, RBI)
- Railway Exams (RRB NTPC, Group D)
- SSC Exams (CGL, CHSL, MTS)
- State PSC
- Defense Services (NDA, CDS, AFCAT)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Supabase credentials to .env.local
# Use the SAME credentials as the main iiskills.cloud app
```

### Development

```bash
# Start development server on port 3014
npm run dev
```

Visit [http://localhost:3014](http://localhost:3014)

### Build for Production

```bash
npm run build
npm start
```

## Authentication

This app uses **Universal Authentication** from iiskills.cloud:

- Users can sign in with credentials from ANY iiskills.cloud app
- Sessions are shared across all `*.iiskills.cloud` subdomains
- No separate registration needed if user already exists

### Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_SITE_URL=http://localhost:3014
NEXT_PUBLIC_COOKIE_DOMAIN=
```

**Important**: Use the same Supabase project as the main app for cross-subdomain authentication.

## Project Structure

```
learn-govt-jobs/
├── pages/
│   ├── index.js       # Homepage
│   ├── learn.js       # Main learning dashboard
│   ├── login.js       # Universal login page
│   ├── register.js    # Universal registration page
│   └── _app.js        # App wrapper with auth
├── components/
│   └── SubdomainNavbar.js
├── lib/
│   └── supabaseClient.js  # Shared auth client
├── styles/
│   └── globals.css
└── public/
```

## Deployment

### Production URL

`https://learn-govt-jobs.iiskills.cloud`

### DNS Configuration

Point `learn-govt-jobs.iiskills.cloud` to your hosting service.

### Environment

Set production environment variables:

- `NEXT_PUBLIC_SITE_URL=https://learn-govt-jobs.iiskills.cloud`
- `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud`

## Integration with iiskills.cloud

This subdomain is part of the iiskills.cloud monorepo and integrates with:

- **Shared User Pool**: Same Supabase project as main app
- **SSO**: Cross-subdomain authentication
- **Universal Registration**: User can register from any app
- **Shared Components**: Uses UniversalLogin and UniversalRegister

## Development Team

Part of the iiskills.cloud ecosystem.

## License

Private - All rights reserved.
