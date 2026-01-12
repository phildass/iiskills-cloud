# Learn Physics

Master physics concepts with AI-driven lessons, structured curriculum, and comprehensive testing.

## Overview

Learn Physics is a free, AI-driven physics mastery course designed as a subdomain of iiskills.cloud. The platform provides a structured learning experience with three difficulty levels, comprehensive modules, and progress tracking.

## Features

### Curriculum Structure

- **3 Learning Levels**: Beginner, Intermediate, and Advanced
- **7-10 Modules per Level**: Each level contains between 7-10 focused modules
- **5 Lessons per Module**: Every module includes exactly 5 comprehensive lessons
- **Module Tests**: Each module has an associated test to verify understanding

### AI-Driven Learning

- AI-generated lesson content
- AI-generated quizzes and tests
- Adaptive learning paths

### Progress Tracking

- Visual tiered progress indicators
- Track completion at lesson, module, and level stages
- Overall progress percentage

### Authentication & Access

- **Mandatory Supabase Registration**: All users must create an account
- **Cross-subdomain Authentication**: Account works across all iiskills.cloud services
- **Admin Panel**: Role-based access control via Supabase metadata

### User Interface

- Modern, responsive design matching learn-math interface
- Gradient color schemes for different levels
- Interactive lesson and test interfaces
- Mobile-friendly layout

## Curriculum Overview

### Beginner Level (Green)

1. Introduction to Physics
2. Kinematics
3. Forces and Newton's Laws
4. Work and Energy
5. Momentum and Collisions
6. Rotational Motion
7. Gravity and Orbits

### Intermediate Level (Blue)

1. Oscillations and Waves
2. Fluid Mechanics
3. Thermodynamics I
4. Thermodynamics II
5. Electric Fields and Forces
6. Electric Circuits
7. Magnetism
8. Electromagnetic Induction

### Advanced Level (Purple)

1. Electromagnetic Waves
2. Geometric Optics
3. Wave Optics
4. Special Relativity
5. Quantum Physics I
6. Quantum Physics II
7. Nuclear Physics
8. Particle Physics
9. Astrophysics

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Access to shared Supabase project credentials

### Installation

1. Navigate to the learn-physics directory:

```bash
cd learn-physics
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` with your Supabase credentials (same as main app):

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

The app will be available at `http://localhost:3009`

### Production Build

Build for production:

```bash
npm run build
npm start
```

## Project Structure

```
learn-physics/
├── components/
│   ├── shared/           # Shared navigation components
│   └── Footer.js         # Footer component
├── data/
│   └── curriculum.js     # Physics curriculum structure
├── lib/
│   └── supabaseClient.js # Supabase client configuration
├── pages/
│   ├── _app.js          # App wrapper with navigation
│   ├── index.js         # Landing page
│   ├── register.js      # Registration page
│   ├── login.js         # Login page
│   ├── learn.js         # Main learning platform
│   ├── lesson.js        # Individual lesson view
│   ├── test.js          # Module test interface
│   └── admin.js         # Admin panel (role-restricted)
├── styles/
│   └── globals.css      # Global styles
└── public/              # Static assets
```

## Key Pages

### Landing Page (`/`)

- Hero section with physics branding
- Feature highlights
- Curriculum overview
- Call-to-action for registration

### Learning Platform (`/learn`)

- Three-level hierarchical view
- Module cards with progress indicators
- Lesson list with completion status
- Module test access

### Lesson View (`/lesson?module=X&lesson=Y`)

- Lesson content display
- Mark as complete functionality
- Navigation to next lesson

### Module Test (`/test?module=X`)

- Multiple-choice questions
- Submit and score calculation
- Performance feedback

### Admin Panel (`/admin`)

- Platform statistics
- Curriculum overview
- Access restricted to admin role

## Authentication

### User Registration

- First name, last name, age, qualification required
- Email and password authentication
- Account stored in shared Supabase project

### Login

- Email/password authentication
- Cross-subdomain session support
- Automatic redirect to learning platform

### Admin Access

To grant admin access to a user, set their role in Supabase:

```javascript
// In Supabase Dashboard or via API
user.user_metadata.role = "admin";
// or
user.app_metadata.role = "admin";
```

## Progress Tracking

Progress is currently tracked in localStorage (development mode):

```javascript
{
  completedLessons: ['m1-1-l1', 'm1-1-l2', ...],
  completedTests: ['t1-1', 't1-2', ...]
}
```

In production, this would be stored in Supabase database tables.

## Deployment

### Port Configuration

- Development: `http://localhost:3009`
- Production: `https://learn-physics.iiskills.cloud`

### PM2 Configuration

The ecosystem.config.js in the root includes:

```javascript
{
  name: 'iiskills-learn-physics',
  cwd: __dirname + '/learn-physics',
  script: 'npm',
  args: 'start',
  env: {
    PORT: 3009,
    NODE_ENV: 'production'
  }
}
```

### Deployment Steps

1. Build the application: `npm run build`
2. Start with PM2: `pm2 start ecosystem.config.js --only iiskills-learn-physics`
3. Configure Nginx reverse proxy for the subdomain
4. Set up SSL with Certbot

## Technology Stack

- **Framework**: Next.js 16.1.1
- **React**: 19.2.3
- **Authentication**: Supabase 2.89.0
- **Styling**: Tailwind CSS 3.4.18
- **Deployment**: PM2 + Nginx

## Notes

- No "PhysiMaster" or external branding - pure iiskills.cloud branding
- UI/UX matches learn-math subdomain for consistency
- Free access with mandatory registration
- AI content generation is placeholder - ready for integration
- Progress tracking uses localStorage in development, designed for Supabase in production

## License

Part of the iiskills.cloud platform. All rights reserved.
