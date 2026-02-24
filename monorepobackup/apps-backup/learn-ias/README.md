# Learn IAS - iiskills.cloud

This is a standalone Next.js application for the **Learn IAS** module of iiskills.cloud. It is designed to be deployed as a separate service on the subdomain `learn-ias.iiskills.cloud`.

## Overview

Comprehensive UPSC Civil Services (IAS) preparation platform with AI-powered content, mock interviews, daily practice tests, and personalized study plans. This platform follows the complete UPSC syllabus and provides structured learning from Foundation to Final Revision.

### Key Features

- **Complete UPSC Coverage**: Foundation, Deep Dive, Mains & Ethics, Prelims & Revision
- **AI-Generated Content**: Daily lessons, personalized study plans, and adaptive test generation
- **Mock Interviews**: AI-powered personality test simulation with detailed feedback
- **Answer Evaluation**: AI evaluation of mains answers with constructive feedback
- **Optional Subjects**: 13 optional subjects (excluding Indian Literature except English Literature)
- **Progress Tracking**: Monitor learning journey across all phases and modules
- **Mobile & Web**: Seamless accessibility across platforms
- **Offline Support**: Download content for offline study (planned)
- **Notification System**: Reminders for daily practice and current affairs (planned)
- **Shared Authentication**: Seamless login across all iiskills.cloud apps

## Project Structure

```
learn-ias/
├── components/          # React components
│   └── Footer.js       # Footer component
├── lib/                # Utility libraries
│   ├── supabaseClient.js  # Supabase auth client with cross-subdomain support
│   └── iasSyllabus.js     # UPSC IAS course structure and syllabus
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper with authentication
│   ├── index.js        # Landing page with course overview
│   ├── login.js        # Universal login redirect
│   ├── register.js     # Universal registration redirect
│   └── learn.js        # Main learning dashboard (protected)
├── public/             # Static assets
│   └── images/         # Images and logos
├── styles/             # CSS styles
│   └── globals.css     # Global styles with Tailwind
├── utils/              # Utility functions
├── .env.local.example  # Environment variables template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind CSS configuration (India-themed colors)
└── README.md           # This file
```

## Course Structure

The Learn IAS platform is organized into four main preparation phases:

### 1. Foundation Phase (2 months)
**Objective**: Understanding UPSC CSE structure, exam pattern, and building fundamental knowledge

**Modules**: 
- Understanding UPSC CSE
- History - Foundation
- Geography - Foundation
- Polity - Foundation
- Economics - Foundation

**Status**: PLACEHOLDER - Module structure defined, content to be implemented

### 2. Deep Dive Phase (6-8 months)
**Objective**: Comprehensive subject-wise preparation including optional subjects

**Modules**:
- History - Detailed Study
- Geography - Detailed Study
- Polity - Detailed Study
- Economics - Detailed Study
- Science & Technology
- Current Affairs

**Status**: PLACEHOLDER - Module structure defined, content to be implemented

### 3. Optional Subjects
**Objective**: Choose one optional subject for comprehensive Mains preparation

**Available Optionals** (13 subjects):
1. Geography (Optional)
2. History (Optional)
3. Political Science & International Relations
4. Public Administration
5. Sociology
6. Anthropology
7. Psychology
8. **English Literature** (ONLY included from Indian Literature group)
9. Philosophy
10. Economics (Optional)
11. Law
12. Management
13. Mathematics

**Important Note**: Indian Literature optionals (Hindi, Tamil, etc.) are **NOT included** except English Literature as per business requirements.

**Status**: PLACEHOLDER - Subject framework defined, content to be implemented

### 4. Mains & Ethics Phase (3-4 months)
**Objective**: Answer writing practice, ethics, and essay preparation

**Modules**:
- Essay Writing
- Ethics, Integrity and Aptitude (GS Paper IV)
- Answer Writing Practice
- General Studies Papers (I, II, III, IV)

**Status**: PLACEHOLDER - Module structure defined, content to be implemented

### 5. Prelims & Revision Phase (2-3 months)
**Objective**: Intensive revision, test series, and current affairs

**Modules**:
- Prelims Strategy
- Mock Test Series
- Current Affairs - Intensive
- Final Revision

**Status**: PLACEHOLDER - Module structure defined, content to be implemented

## AI-Powered Features

All AI features are **PLANNED** and will be implemented in future phases:

### 1. Daily AI-Generated Content
- Personalized daily lessons based on your progress
- Current affairs updates tailored to UPSC syllabus
- Topic recommendations based on weak areas
- **Status**: Planned Feature

### 2. Adaptive Test Generation
- AI creates tests based on your performance
- Identifies and focuses on weak areas
- Progressive difficulty adjustment
- **Status**: Planned Feature

### 3. AI Mock Interviews
- Simulated personality test interviews
- AI analyzes your responses
- Detailed feedback on communication, knowledge, and DAF
- **Status**: Planned Feature

### 4. Answer Evaluation
- AI-powered evaluation of mains answers
- Detailed feedback on structure, content, and presentation
- Comparison with model answers
- **Status**: Planned Feature

### 5. Personalized Study Plan
- AI creates study plans based on your available time
- Adjusts plans based on your progress
- Deadline-aware recommendations
- **Status**: Planned Feature

## User Management Features

### Progress Tracking (Planned)
- Track completion across all phases and modules
- Visualize learning progress with charts
- Identify completed and pending topics
- **Status**: PLACEHOLDER configuration exists

### Notification System (Planned)
- Daily practice reminders
- Current affairs notifications
- Deadline alerts for exam preparation
- **Status**: PLACEHOLDER configuration exists

### Mobile & Web Accessibility (Planned)
- Responsive design for all devices
- Progressive Web App (PWA) support
- Seamless sync across devices
- **Status**: Basic responsive design implemented, full PWA planned

### Offline Content Handling (Planned)
- Download lessons and notes for offline study
- Offline quiz attempts
- Auto-sync when online
- **Status**: PLACEHOLDER configuration exists

## Pricing & Payment

### Subscription Details
- **Fee**: ₹99 + GST ₹17.82 = **₹116.82/year**
- **Duration**: 1 year from subscription date
- **Access**: Complete course content, all phases, AI features (when implemented)

### Payment Configuration (Placeholder)
```javascript
payment: {
  fee: '₹116.82',
  feeBreakdown: {
    base: '₹99',
    gst: '₹17.82',
    total: '₹116.82'
  },
  duration: '1 year',
  expiryManagement: {
    enabled: true,
    autoRenewal: false,
    gracePeriod: '7 days',
    status: 'planned'
  }
}
```

### Payment Integration
Users are directed to `https://www.aienter.in/payments` for course purchase.

**Status**: PLACEHOLDER - Full payment integration and expiry management to be implemented

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Supabase account (shared with main iiskills.cloud app)

### Installation

1. Install dependencies:

```bash
cd learn-ias
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
NEXT_PUBLIC_SITE_URL=http://localhost:3015
NEXT_PUBLIC_COOKIE_DOMAIN=
NEXT_PUBLIC_MAIN_SITE_URL=https://iiskills.cloud
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3015](http://localhost:3015) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed alongside other iiskills.cloud apps on separate subdomains.

### Deployment Options

1. **Vercel** (Recommended)
   - Deploy directly from the `learn-ias` directory
   - Set domain to `learn-ias.iiskills.cloud`
   - Add environment variables in Vercel dashboard

2. **VPS with Nginx + PM2**
   - Build the app and run with PM2 on port 3015
   - Configure Nginx reverse proxy for `learn-ias.iiskills.cloud`
   - See main [DEPLOYMENT.md](../DEPLOYMENT.md) for details

3. **Docker**
   - Build Docker image with production build
   - Run container on port 3015
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
| `NEXT_PUBLIC_SITE_URL` | App URL | `https://learn-ias.iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Cookie domain for auth | `.iiskills.cloud` |
| `NEXT_PUBLIC_MAIN_SITE_URL` | Main site URL | `https://iiskills.cloud` |

## Authentication

The app uses Supabase authentication with the following features:

- **Email/Password**: Traditional authentication
- **Magic Link**: Passwordless email authentication
- **Google OAuth**: One-click Google sign-in
- **Cross-Subdomain Sessions**: Shared authentication across *.iiskills.cloud
- **Universal Login**: Register once on ANY iiskills app, access ALL apps

## Technology Stack

- **Framework:** Next.js 16.1.1
- **React:** 19.2.3
- **Styling:** Tailwind CSS 3.4.18 (India-themed colors: Saffron, Green, Navy)
- **Authentication:** Supabase Auth
- **State Management:** React Hooks

## Implementation Status

### ✅ Implemented
- [x] Basic project structure following monorepo conventions
- [x] Package configuration and dependencies
- [x] Environment setup (.env.local.example)
- [x] Supabase authentication client
- [x] Landing page with course overview
- [x] Learning dashboard (protected route)
- [x] Login/Register pages (redirect to universal auth)
- [x] Footer component
- [x] Tailwind CSS with India-themed colors
- [x] Complete course structure definition (iasSyllabus.js)
- [x] Payment configuration placeholder
- [x] All 13 optional subjects defined (excluding Indian Literature except English)

### 🚧 Placeholder/Stub (To Be Implemented)
- [ ] Actual lesson content for all modules
- [ ] AI features (daily content, test generation, mock interviews, answer evaluation)
- [ ] Progress tracking implementation
- [ ] Notification system
- [ ] Offline content handling
- [ ] Payment integration with expiry management
- [ ] Quiz and test implementation
- [ ] Current affairs database and updates
- [ ] Answer writing practice tools
- [ ] Essay evaluation system
- [ ] Study plan generator
- [ ] Performance analytics

## Design Rationale

### Mirroring Other Subdomains
This subdomain follows the exact structure and conventions of other learn-* subdomains in the monorepo:

1. **Directory Structure**: Matches learn-jee, learn-neet, etc.
2. **Configuration Files**: Same setup for Next.js, Tailwind, PostCSS
3. **Authentication**: Uses shared Supabase client pattern
4. **Port Convention**: Uses port 3015 (next available port)
5. **Styling**: Tailwind CSS with custom color scheme
6. **Navigation**: Universal login/register flow
7. **Footer**: Consistent footer design

### India-Themed Colors
- **Primary (Saffron)**: #FF6B35 - Represents energy and sacrifice
- **Secondary (Green)**: #138808 - Represents growth and auspiciousness
- **Accent (Navy Blue)**: #000080 - Represents depth and stability
- Colors inspired by the Indian national flag

## Documentation

- [Main README](../README.md) - Project overview
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [SUPABASE_AUTH_SETUP.md](../SUPABASE_AUTH_SETUP.md) - Authentication setup
- [ONBOARDING.md](../ONBOARDING.md) - User onboarding guide

## Support

- **Contact:** info@iiskills.cloud
- **Main Site:** https://iiskills.cloud
- **Issues:** Report via GitHub issues

## Business Requirements Summary

### Course Mandate
Complete UPSC Civil Services preparation covering:
- Foundation building
- Subject-wise deep dive
- Optional subjects (13 available)
- Mains & Ethics preparation
- Prelims & Revision strategies

### AI Features (Planned)
- Daily AI-generated content
- Adaptive test generation
- Mock interview simulation
- Answer evaluation
- Personalized study plans

### User Management (Planned)
- Progress tracking across all modules
- Notification system for reminders
- Mobile and web accessibility
- Offline content support

### Payment Model
- Annual subscription: ₹116.82/year
- Payment via aienter.in
- Expiry management with grace period (planned)

### Optional Subjects Policy
**IMPORTANT**: Only English Literature is included from Indian Literature group. 
Other Indian language literature subjects (Hindi, Tamil, Sanskrit, etc.) are NOT included as per business requirements.

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.
