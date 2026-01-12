# Learn JEE Implementation Summary

This document provides a comprehensive overview of the Learn JEE subdomain implementation within the iiskills-cloud monorepo.

## Overview

Learn JEE is a paid educational platform designed specifically for JEE (Joint Entrance Examination) preparation, covering Physics, Chemistry, and Mathematics. It follows the established pattern of other learning modules in the monorepo while implementing unique features for JEE preparation.

## Project Information

- **Subdomain**: learn-jee.iiskills.cloud
- **Local Port**: 3009
- **Framework**: Next.js 16.1.1
- **Authentication**: Supabase (cross-subdomain)
- **Pricing**: ₹499 + GST ₹89.82 = Total ₹588.82

## Key Features

### 1. Mandatory Authentication

- Users must register/login to access course content
- Shared Supabase authentication across all iiskills.cloud subdomains
- Multiple sign-in options:
  - Email & Password
  - Google OAuth
  - Magic Link (passwordless)

### 2. Free Preview System

- **Free Access**: Chapter 1, Lesson 1
- **Paid Access**: Chapters 1-10 (all remaining lessons)
- Clear visual indicators for locked vs. accessible content

### 3. Course Structure

#### 10 Comprehensive Chapters:

**Physics (Chapters 1-3)**

1. JEE Physics Fundamentals
   - Introduction to JEE Physics (FREE)
   - Kinematics and Motion
   - Laws of Motion

2. Mechanics and Dynamics
   - Work, Energy, and Power
   - Circular Motion
   - Center of Mass

3. Thermodynamics Essentials
   - Heat and Temperature
   - First Law of Thermodynamics
   - Heat Engines and Carnot Cycle

**Chemistry (Chapters 4-6)** 4. Physical Chemistry Foundations

- Atomic Structure
- Chemical Bonding
- States of Matter

5. Organic Chemistry Basics
   - Hydrocarbons
   - Functional Groups
   - Reaction Mechanisms

6. Inorganic Chemistry
   - Periodic Table Trends
   - Chemical Reactions
   - Coordination Compounds

**Mathematics (Chapters 7-9)** 7. Calculus for JEE

- Limits and Continuity
- Differentiation
- Integration Basics

8. Algebra Mastery
   - Quadratic Equations
   - Sequences and Series
   - Complex Numbers

9. Coordinate Geometry
   - Straight Lines
   - Circles
   - Parabola and Ellipse

**Problem-Solving (Chapter 10)** 10. Problem-Solving Strategies - Time Management in Exams - Advanced Problem Solving - Mock Test Strategies

### 4. AI-Generated Content

- Structure supports AI-generated lessons and quizzes
- Scaffolded for future content generation
- Interactive learning experience ready for implementation

### 5. Payment Integration

- External payment portal: https://www.aienter.in/payments
- Purchase status tracked in Supabase user metadata
- Field: `purchased_jee_course` (boolean)
- One-time payment, lifetime access model

### 6. Standardized Design

- Consistent UI/UX with other iiskills.cloud modules
- Tailwind CSS for responsive design
- Color-coded by subject:
  - Physics: Blue gradient
  - Chemistry: Purple gradient
  - Mathematics: Green gradient
  - Mixed: Primary blue gradient

## Technical Implementation

### File Structure

```
learn-jee/
├── components/
│   └── Footer.js
├── lib/
│   └── supabaseClient.js
├── pages/
│   ├── _app.js
│   ├── index.js
│   ├── learn.js
│   ├── login.js
│   └── register.js
├── public/
│   └── images/
├── styles/
│   └── globals.css
├── .env.local.example
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

### Key Files

#### 1. pages/index.js

- Landing page with pricing display
- Course preview and feature showcase
- Subject coverage (Physics, Chemistry, Math)
- Call-to-action buttons for registration/login

#### 2. pages/learn.js

- Protected route (requires authentication)
- 10 chapters with 3 lessons each
- Free preview: Chapter 1, Lesson 1
- Paywall for locked content
- Purchase CTA for non-paying users
- Subject-specific color gradients

#### 3. pages/login.js

- Multiple authentication methods
- Password-based login
- Magic link option
- Google OAuth integration

#### 4. pages/register.js

- Comprehensive registration form
- Personal information collection
- Educational background
- Interest assessment
- Google OAuth option

#### 5. lib/supabaseClient.js

- Supabase client initialization
- Cross-subdomain authentication
- Helper functions:
  - `getCurrentUser()`
  - `signOutUser()`
  - `signInWithEmail()`
  - `isAdmin()`
  - `getUserProfile()`
  - `getSiteUrl()`

### Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3009  # Development
NEXT_PUBLIC_COOKIE_DOMAIN=                  # Empty for localhost, .iiskills.cloud for production
```

### Deployment Configuration

#### PM2 (ecosystem.config.js)

```javascript
{
  name: 'iiskills-learn-jee',
  cwd: __dirname + '/learn-jee',
  script: 'npm',
  args: 'start',
  env: {
    PORT: 3009,
    NODE_ENV: 'production'
  }
}
```

#### Nginx Configuration

```nginx
server {
    listen 80;
    server_name learn-jee.iiskills.cloud;

    location / {
        proxy_pass http://localhost:3009;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Access Control Logic

### Free Access

- Landing page (/)
- Login page (/login)
- Register page (/register)
- Chapter 1, Lesson 1 (for authenticated users)

### Paid Access (requires `purchased_jee_course: true`)

- All lessons except Chapter 1, Lesson 1
- Checked via user metadata in Supabase

### Authentication Check Flow

```javascript
1. User accesses /learn
2. System checks for authenticated session
3. If not authenticated → redirect to /login
4. If authenticated → check purchase status
5. If purchased → full access
6. If not purchased → show paywall, allow preview only
```

## Payment Flow

1. User views pricing on landing page or /learn
2. Clicks "Purchase Full Course" button
3. Redirects to external payment portal (aienter.in/payments)
4. After successful payment, admin updates user metadata
5. User gains full access to all content

## Testing

### Build Verification

```bash
cd learn-jee
npm install
npm run build
```

✅ Build successful - all pages compiled without errors

### Development Server

```bash
npm run dev
```

✅ Server runs on http://localhost:3009

### Page Access Tests

✅ Landing page (/) - renders correctly
✅ Login page (/login) - JEE branding applied
✅ Register page (/register) - JEE branding applied
✅ Learn page (/learn) - requires authentication

## Security

### Code Review

✅ No issues found

### CodeQL Security Scan

✅ No vulnerabilities detected

### Security Features

- No hardcoded credentials
- Environment variables for sensitive data
- Cross-subdomain session support
- Secure OAuth integration
- Input validation on forms

## Future Enhancements

1. **AI Content Generation**
   - Implement actual AI-generated lesson content
   - Dynamic quiz generation
   - Personalized learning paths

2. **Progress Tracking**
   - Lesson completion tracking
   - Quiz scores and analytics
   - Performance dashboards

3. **Additional Features**
   - Discussion forums
   - Doubt clearing sessions
   - Mock test series
   - Video lessons
   - Downloadable resources

4. **Payment Integration**
   - Direct payment gateway integration
   - Automatic purchase verification
   - Invoice generation

## Maintenance Notes

### Updating Course Content

Course data is defined in `/learn-jee/pages/learn.js` in the `courseData` array. Modify this array to:

- Add/remove chapters
- Update lesson titles/durations
- Change subject classifications

### Managing Purchase Status

Purchase status is stored in Supabase user metadata:

```javascript
user.user_metadata.purchased_jee_course = true;
```

Update via Supabase dashboard or API after payment verification.

### Pricing Updates

Update pricing in three locations:

1. `/learn-jee/pages/index.js` - Landing page
2. `/learn-jee/pages/learn.js` - Learning page
3. `/learn-jee/README.md` - Documentation

## Support

- **Documentation**: /learn-jee/README.md
- **Main Documentation**: /README.md
- **Contact**: info@iiskills.cloud
- **Issues**: GitHub repository issues

## License

© 2024 AI Cloud Enterprises - Indian Institute of Professional Skills Development. All rights reserved.
