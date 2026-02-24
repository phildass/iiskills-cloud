# Adding a New Learning App to iiskills-cloud

This guide walks you through the process of adding a new learning application to the iiskills-cloud monorepo.

## Prerequisites

- Node.js 18+ and Yarn 4+
- Access to Supabase dashboard
- Basic understanding of Next.js
- DNS configuration access (for production)

## Step 1: Create the App Structure

### 1.1 Choose a Port

First, select an available port from `PORT_ASSIGNMENTS.md`. Ports should be unique and not conflict with existing apps.

Example: If adding `learn-coding`, choose an available port like `3024`.

### 1.2 Create the App Directory

```bash
# From the repository root
mkdir -p apps/learn-{topic}
cd apps/learn-{topic}
```

### 1.3 Initialize the App

```bash
# Initialize package.json
npm init -y

# Install dependencies
yarn add next@latest react@latest react-dom@latest @supabase/supabase-js
yarn add -D tailwindcss postcss autoprefixer eslint
```

### 1.4 Update package.json

Edit `apps/learn-{topic}/package.json`:

```json
{
  "name": "learn-{topic}",
  "version": "1.0.0",
  "private": true,
  "description": "Learn {Topic} - {Brief description}",
  "scripts": {
    "dev": "next dev -p {YOUR_PORT}",
    "build": "next build",
    "start": "next start -p {YOUR_PORT}",
    "lint": "eslint ."
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.89.0",
    "next": "^16.1.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "eslint": "^9.39.2",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.4.18"
  }
}
```

## Step 2: Create Content Structure

### 2.1 Create Content Directories

```bash
mkdir -p content/courses
mkdir -p content/modules
mkdir -p content/lessons
```

### 2.2 Add Sample Content

Create `content/courses/{topic}-basics.json`:

```json
{
  "id": "{topic}-basics",
  "title": "{Topic} Fundamentals",
  "description": "Learn the fundamentals of {topic}...",
  "sourceApp": "learn-{topic}",
  "instructor": "Your Name",
  "duration": "4 weeks",
  "level": "beginner",
  "tags": ["{topic}", "fundamentals", "beginner"]
}
```

Create `content/modules/{topic}-basics-module-1.json`:

```json
{
  "id": "{topic}-basics-module-1",
  "title": "Introduction to {Topic}",
  "description": "Start your journey with {topic}...",
  "sourceApp": "learn-{topic}",
  "course_id": "{topic}-basics",
  "order": 1,
  "duration": "1 week"
}
```

Create `content/lessons/{topic}-basics-lesson-1.json`:

```json
{
  "id": "{topic}-basics-lesson-1",
  "title": "What is {Topic}?",
  "description": "Understanding the basics of {topic}...",
  "sourceApp": "learn-{topic}",
  "module_id": "{topic}-basics-module-1",
  "course_id": "{topic}-basics",
  "order": 1,
  "duration": "30 minutes",
  "content": "Full lesson content here..."
}
```

### 2.3 Validate Content

```bash
# Validate your content structure
npm run validate-content -- --app=learn-{topic} --verbose

# Check for orphans
npm run check-orphans -- --app=learn-{topic}
```

## Step 3: Setup Next.js Configuration

### 3.1 Create next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Ensure standalone output for deployment
  output: 'standalone',
};

module.exports = nextConfig;
```

### 3.2 Create tailwind.config.js

```javascript
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    '../../components/shared/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        accent: '#0EA5E9',
      },
    },
  },
  plugins: [],
};
```

### 3.3 Create postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Step 4: Create Essential Pages

### 4.1 Create _app.js

```javascript
import '../../styles/globals.css';

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

### 4.2 Create Landing Page (index.js)

Use the UniversalLandingPage component:

```javascript
"use client";

import UniversalLandingPage from '../../../components/shared/UniversalLandingPage';

const features = [
  {
    emoji: '📚',
    title: 'Comprehensive Courses',
    description: 'Learn {topic} from basics to advanced concepts'
  },
  {
    emoji: '🎯',
    title: 'Hands-on Practice',
    description: 'Apply what you learn with practical exercises'
  },
  {
    emoji: '🏆',
    title: 'Get Certified',
    description: 'Earn certificates upon course completion'
  },
];

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-{topic}"
      appName="Learn {Topic}"
      title="Learn {Topic} - Master {Topic} Skills Online"
      description="Master {topic} with comprehensive courses, interactive lessons, and expert guidance."
      features={features}
      isFree={false}
      heroGradient="from-primary to-accent"
    />
  );
}
```

### 4.3 Create Other Essential Pages

```bash
# Copy templates from another learning app
cp ../learn-ai/pages/learn.js pages/
cp ../learn-ai/pages/login.js pages/
cp ../learn-ai/pages/register.js pages/
cp ../learn-ai/pages/admin.js pages/
cp ../learn-ai/pages/terms.js pages/
cp ../learn-ai/pages/privacy.js pages/
```

Update these pages with your app-specific content.

## Step 5: Configure Supabase

### 5.1 Create .env.local

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_APP_ID=learn-{topic}
```

### 5.2 Create Supabase Client

```bash
mkdir -p lib
cp ../learn-ai/lib/supabaseClient.js lib/
```

### 5.3 Update Supabase Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration, add:

- Development: `http://localhost:{YOUR_PORT}/**`
- Production: `https://app1.learn-{topic}.iiskills.cloud/**`

## Step 6: Update Registry and Documentation

### 6.1 Update PORT_ASSIGNMENTS.md

Add your app to the port table:

```markdown
| {YOUR_PORT} | learn-{topic} | {Topic} learning platform |
```

### 6.2 Generate App Registry

```bash
npm run generate:registry
```

This automatically adds your app to `lib/appRegistry.js`.

### 6.3 Update Routing Configuration

Add your app to Nginx/Traefik configuration in `ROUTING_CONFIGURATION.md`.

## Step 7: Test Your App

### 7.1 Local Development

```bash
# From app directory
yarn dev

# Or from root
yarn dev
```

Visit `http://localhost:{YOUR_PORT}` to test.

### 7.2 Validate Content

```bash
npm run validate-content -- --app=learn-{topic} --verbose
npm run check-orphans -- --app=learn-{topic}
```

### 7.3 Test Authentication

1. Register a new user
2. Log in
3. Access protected pages (/learn, /admin)
4. Test logout

## Step 8: Production Deployment

### 8.1 Configure DNS

Add DNS records:
```
app1.learn-{topic}.iiskills.cloud    A    <your-server-ip>
```

### 8.2 Update PM2 Configuration

The PM2 configuration is auto-generated. Update and validate:

```bash
npm run generate-pm2-config
npm run validate-pm2-config
```

### 8.3 Deploy

```bash
# Build the app
yarn build

# Deploy with PM2
pm2 start ecosystem.config.js --only iiskills-learn-{topic}

# Save PM2 configuration
pm2 save
```

### 8.4 Configure Reverse Proxy

Add Nginx configuration (see `ROUTING_CONFIGURATION.md` for template).

## Step 9: Verify Deployment

### 9.1 Run Validation Scripts

```bash
# Validate environment
npm run validate-env

# Pre-deployment checks
npm run pre-deploy-check

# Post-deployment verification
npm run post-deploy-check
```

### 9.2 Manual Testing

- [ ] Landing page loads correctly
- [ ] Registration works
- [ ] Login works
- [ ] Content displays properly
- [ ] Navigation works
- [ ] Admin panel accessible (for admins)
- [ ] SSL certificate valid
- [ ] No console errors

## Checklist

Before submitting your new app:

- [ ] Port assigned and documented in PORT_ASSIGNMENTS.md
- [ ] Content structure created (courses/, modules/, lessons/)
- [ ] Sample content added and validated
- [ ] Landing page uses UniversalLandingPage component
- [ ] All essential pages created (login, register, learn, admin, terms, privacy)
- [ ] Supabase integration configured
- [ ] App registry generated
- [ ] Local testing completed
- [ ] Content validation passed
- [ ] Orphan checker passed
- [ ] Documentation updated
- [ ] DNS configured (for production)
- [ ] PM2 configuration updated
- [ ] Reverse proxy configured
- [ ] Production deployment tested

## Common Issues and Solutions

### Port Conflict

**Error**: `Port {PORT} is already in use`

**Solution**: Choose a different port and update package.json

### Content Validation Fails

**Error**: `Missing required field: sourceApp`

**Solution**: Ensure all content files have `sourceApp: "learn-{topic}"`

### Supabase Auth Fails

**Error**: `Invalid redirect URL`

**Solution**: Add your app URL to Supabase redirect URLs whitelist

### App Not in Registry

**Error**: App not showing in navigation

**Solution**: Run `npm run generate:registry` to regenerate app registry

## Getting Help

- Check existing learning apps for reference (e.g., `apps/learn-ai`)
- Review documentation in the repository root
- Run validation scripts to catch common issues
- Check logs: `pm2 logs iiskills-learn-{topic}`

## Next Steps

After your app is live:

1. Add more courses, modules, and lessons
2. Monitor performance with PM2
3. Collect user feedback
4. Iterate on content and features
5. Consider adding app-specific features

---

For more information:
- [README.md](README.md) - Project overview
- [CONTRIBUTING.md](CONTRIBUTING.md) - Development guidelines
- [PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md) - Port reference
- [ROUTING_CONFIGURATION.md](ROUTING_CONFIGURATION.md) - Routing setup
- [CONTENT_SCHEMA.md](lib/contentSchema.js) - Content schema reference
