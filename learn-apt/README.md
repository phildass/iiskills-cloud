# Learn Your Aptitude - iiskills.cloud

This is a standalone Next.js application for the **Learn Your Aptitude** module of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-apt.iiskills.cloud`.

## Overview

Comprehensive aptitude assessment platform with AI-powered career guidance. Discover your strengths through our short or elaborate testing options.

### Key Features

- **Two Assessment Options**:
  - **Short Assessment**: 12 questions, ~7 minutes - Quick insights into core competencies
  - **Elaborate Assessment**: 200 questions, 40-50 minutes - Detailed skill analysis with AI career guidance (Recommended)
- **Six Skill Areas**: Quantitative Aptitude, Logical Reasoning, Verbal Reasoning, Data Interpretation, Pattern Recognition, Speed Mathematics
- **AI-Powered Career Guidance**: Personalized recommendations based on assessment results
- **Progress Tracking**: Monitor your assessment history and improvements
- **Supabase Authentication**: Shared login across all iiskills.cloud services
- **Mobile & Web**: Responsive design works on all devices

## Project Structure

```
learn-apt/
├── components/          # React components
│   ├── Footer.js       # Footer component
│   └── shared/         # Shared components (InstallApp, Newsletter, etc.)
├── lib/                # Utility libraries
│   └── supabaseClient.js  # Supabase auth client
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper with authentication
│   ├── _document.js    # Document wrapper
│   ├── index.js        # Landing page with assessment options
│   ├── login.js        # Login page
│   ├── register.js     # Registration page
│   ├── learn.js        # Assessment dashboard (protected)
│   └── api/            # API routes
├── public/             # Static assets
│   └── images/         # Images and logos
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── utils/              # Utility functions
├── .env.local.example  # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── README.md           # This file
```

## Assessment Structure

### Short Assessment (12 Questions, ~7 minutes)
- Core competency overview
- Quick skill snapshot
- Instant results
- Best for: Time-constrained users, initial screening

### Elaborate Assessment (200 Questions, 40-50 minutes) ⭐ Recommended
- Comprehensive skill analysis
- Detailed breakdown by category
- AI-powered career guidance
- Personalized recommendations
- Best for: Career planning, detailed assessment

## Skills Assessed

1. **Quantitative Aptitude** - Numerical reasoning and problem-solving
2. **Logical Reasoning** - Analytical and critical thinking
3. **Verbal Reasoning** - Language comprehension and communication
4. **Data Interpretation** - Charts, graphs, and data analysis
5. **Pattern Recognition** - Sequences and pattern-based problems
6. **Speed Mathematics** - Quick calculation techniques

## Getting Started

### Prerequisites
- Node.js 18+ installed
- Supabase account (for authentication)
- Environment variables configured

### Installation

1. **Install dependencies**:
```bash
cd learn-apt
npm install
```

2. **Configure environment variables**:
Create a `.env.local` file based on `.env.local.example`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_MAIN_SITE_URL=http://localhost:3000
```

3. **Run development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:3002`

### Production Build

```bash
npm run build
npm start
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Option 2: VPS with PM2

See the main repository's DEPLOYMENT.md for detailed PM2 setup instructions.

### Option 3: Docker

```bash
docker build -t learn-apt .
docker run -p 3002:3002 learn-apt
```

## Environment Variables

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `NEXT_PUBLIC_APP_URL` - URL where this app is hosted
- `NEXT_PUBLIC_MAIN_SITE_URL` - URL of the main iiskills.cloud site

## Authentication

This app uses Supabase for authentication with cross-subdomain support:
- Users can sign in once and access all iiskills.cloud apps
- Sessions are shared across `*.iiskills.cloud` subdomains
- User profiles stored in Supabase user metadata

## Future Enhancements

- [ ] Implement actual 12-question short assessment
- [ ] Implement 200-question elaborate assessment
- [ ] Add AI-powered career guidance integration
- [ ] Store assessment results in database
- [ ] Generate detailed PDF reports
- [ ] Add assessment history tracking
- [ ] Implement score comparison and analytics
- [ ] Add email notifications for results

## Technology Stack

- **Framework**: Next.js 16.1.1
- **React**: 19.2.3
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Development Port**: 3002
- **Production Port**: 3002

## Support

For questions or issues:
- Main Documentation: See README.md in repository root
- Email: info@iiskills.cloud

## License

See LICENSE file in repository root
