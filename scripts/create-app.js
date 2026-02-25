#!/usr/bin/env node

/**
 * iiskills.cloud App Scaffold Generator
 * 
 * Creates a new learning app with standard structure, all required pages,
 * and proper component usage.
 * 
 * Usage:
 *   node scripts/create-app.js <app-name> --type=<free|paid>
 *   
 * Example:
 *   node scripts/create-app.js learn-history --type=free
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const appName = args[0];
const typeArg = args.find(arg => arg.startsWith('--type='));
const appType = typeArg ? typeArg.split('=')[1] : null;

// Validation
if (!appName) {
  console.error('❌ Error: App name is required');
  console.log('Usage: node scripts/create-app.js <app-name> --type=<free|paid>');
  console.log('Example: node scripts/create-app.js learn-history --type=free');
  process.exit(1);
}

if (!appType || !['free', 'paid'].includes(appType.toLowerCase())) {
  console.error('❌ Error: Valid --type flag is required (free or paid)');
  console.log('Usage: node scripts/create-app.js <app-name> --type=<free|paid>');
  process.exit(1);
}

const isFree = appType.toLowerCase() === 'free';
const appPath = path.join(__dirname, '..', 'apps', appName);

// Check if app already exists
if (fs.existsSync(appPath)) {
  console.error(`❌ Error: App '${appName}' already exists at ${appPath}`);
  process.exit(1);
}

console.log(`\n🚀 Creating new ${appType.toUpperCase()} app: ${appName}\n`);

// Create directory structure
const directories = [
  'pages',
  'pages/api',
  'pages/api/payment',
  'pages/api/users',
  'pages/admin',
  'components',
  'lib',
  'data',
  'public',
  'styles',
];

console.log('📁 Creating directory structure...');
directories.forEach(dir => {
  const fullPath = path.join(appPath, dir);
  fs.mkdirSync(fullPath, { recursive: true });
  console.log(`   ✓ ${dir}/`);
});

// Generate next PORT number
function getNextPort() {
  const appsDir = path.join(__dirname, '..', 'apps');
  const apps = fs.readdirSync(appsDir).filter(f => {
    const stat = fs.statSync(path.join(appsDir, f));
    return stat.isDirectory();
  });
  
  let maxPort = 3000;
  apps.forEach(app => {
    const envExample = path.join(appsDir, app, '.env.local.example');
    if (fs.existsSync(envExample)) {
      const content = fs.readFileSync(envExample, 'utf-8');
      const portMatch = content.match(/PORT=(\d+)/);
      if (portMatch) {
        const port = parseInt(portMatch[1]);
        if (port > maxPort) maxPort = port;
      }
    }
  });
  
  return maxPort + 1;
}

const appPort = getNextPort();
const appTitle = appName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
const appId = appName;

console.log(`\n📝 Generating files (PORT: ${appPort}, ID: ${appId})...\n`);

// NOTE: Component imports use @/components/shared/ paths for now
// These will work immediately as components haven't been migrated yet
// Once component migration to @iiskills/ui is complete (Phases 2-3),
// update generated apps to use new import paths:
//   From: import UniversalLogin from '@/components/shared/UniversalLogin';
//   To: import { UniversalLogin } from '@iiskills/ui/authentication';
// See COMPONENT_MIGRATION_PLAN.md for migration schedule

// File templates
const files = {
  // package.json
  'package.json': JSON.stringify({
    name: appName,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      '@supabase/supabase-js': '^2.38.4',
      next: '^13.5.0',
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      razorpay: '^2.9.2'
    },
    devDependencies: {
      autoprefixer: '^10.4.16',
      eslint: '^8.54.0',
      'eslint-config-next': '^13.5.0',
      postcss: '^8.4.31',
      tailwindcss: '^3.3.5'
    }
  }, null, 2),

  // .env.local.example
  '.env.local.example': `# ===================================================================
# ${appTitle} - Environment Configuration Template
# ===================================================================
# 
# This is the environment template for the ${appName} app.
# Copy this file to .env.local and fill in your actual values.
# NEVER commit .env.local to version control!
#
# ===================================================================

# -------------------------------------------------------------------
# App Configuration
# -------------------------------------------------------------------
NEXT_PUBLIC_APP_ID=${appId}
NEXT_PUBLIC_APP_NAME="${appTitle}"
NEXT_PUBLIC_APP_TYPE=${isFree ? 'free' : 'paid'}

# Server Configuration
PORT=${appPort}
NODE_ENV=development

# Site URL (update for production)
NEXT_PUBLIC_SITE_URL=http://localhost:${appPort}

# -------------------------------------------------------------------
# Supabase Configuration
# -------------------------------------------------------------------
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# -------------------------------------------------------------------
# Authentication
# -------------------------------------------------------------------
# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# -------------------------------------------------------------------
# Payment Configuration (for PAID apps)
# -------------------------------------------------------------------
${!isFree ? `RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# Pricing (in paise, e.g., 9900 = ₹99)
NEXT_PUBLIC_PRICE=9900
NEXT_PUBLIC_GST_PERCENTAGE=18` : '# Not applicable for FREE apps'}

# -------------------------------------------------------------------
# Feature Flags
# -------------------------------------------------------------------
ENABLE_GATEKEEPER=false
ENABLE_NEWSLETTER=true

# -------------------------------------------------------------------
# Email Configuration
# -------------------------------------------------------------------
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM=noreply@iiskills.cloud

# -------------------------------------------------------------------
# SMS Configuration (optional)
# -------------------------------------------------------------------
# SMS_API_KEY=your_sms_api_key
# SMS_SENDER_ID=IISKILL

# -------------------------------------------------------------------
# End of Configuration
# -------------------------------------------------------------------
`,

  // README.md
  'README.md': `# ${appTitle}

${isFree ? 'FREE' : 'PAID'} learning application for iiskills.cloud platform.

## Overview

- **App ID**: \`${appId}\`
- **Type**: ${isFree ? 'FREE' : 'PAID'}
- **Port**: ${appPort}
- **Status**: In Development

## Setup

1. Install dependencies:
   \`\`\`bash
   yarn install
   \`\`\`

2. Copy environment template:
   \`\`\`bash
   cp .env.local.example .env.local
   \`\`\`

3. Update \`.env.local\` with your actual values (Supabase, ${isFree ? '' : 'Razorpay, '}etc.)

4. Run development server:
   \`\`\`bash
   yarn dev
   \`\`\`

5. Open [http://localhost:${appPort}](http://localhost:${appPort})

## Project Structure

\`\`\`
${appName}/
├── pages/              # Next.js pages
│   ├── index.js        # Landing page
│   ├── curriculum.js   # Course syllabus
│   ├── login.js        # Login page
│   ├── register.js     # Registration
${!isFree ? '│   ├── payment.js     # Payment page\n' : ''}│   ├── dashboard.js    # User dashboard
│   ├── admin/          # Admin interface
│   └── api/            # API routes
├── components/         # App-specific components ONLY
├── lib/                # App-specific utilities
├── data/               # Course content (JSON)
├── public/             # Static assets
└── styles/             # CSS files
\`\`\`

## Shared Components

This app uses shared components from \`/components/shared/\`. Do NOT create local copies.

**Required components**:
- \`${isFree ? 'UniversalLandingPage' : 'PaidAppLandingPage'}\` - Landing page
- \`UniversalLogin\` - Login page
- \`EnhancedUniversalRegister\` - Registration page
${!isFree ? '- `PremiumAccessPrompt` - Payment prompt\n' : ''}- \`SharedNavbar\` or \`SubdomainNavbar\` - Navigation

## Badge Colors

- ${isFree ? '**FREE** apps use **GREEN** badge (\`bg-green-500\`)' : '**PAID** apps use **BLUE** badge (\`bg-blue-600\`)'}

## Development Guidelines

1. Follow the standard app structure
2. Use shared components (no local copies)
3. Use "Login" terminology (not "Sign in")
4. Test before committing
5. Update documentation

## Testing

\`\`\`bash
# Run E2E tests
yarn test:e2e

# Run unit tests
yarn test
\`\`\`

## Deployment

See [DEPLOYMENT_POLICY.md](/DEPLOYMENT_POLICY.md) for deployment requirements.

## Documentation

- [Monorepo Architecture](/MONOREPO_ARCHITECTURE.md)
- [Shared Components Library](/SHARED_COMPONENTS_LIBRARY.md)
- [E2E Testing Framework](/E2E_TESTING_FRAMEWORK.md)
`,

  // pages/index.js (Landing Page)
  'pages/index.js': `import Head from 'next/head';
${isFree 
  ? `import UniversalLandingPage from '@/components/shared/UniversalLandingPage';`
  : `import PaidAppLandingPage from '@/components/shared/PaidAppLandingPage';`}

export default function Home() {
  return (
    <>
      <Head>
        <title>${appTitle} - iiskills.cloud</title>
        <meta name="description" content="${appTitle} - Learn and master skills" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <${isFree ? 'UniversalLandingPage' : 'PaidAppLandingPage'}
        appId="${appId}"
        courseData={{
          title: '${appTitle}',
          description: 'Master essential skills with comprehensive lessons and practice.',
          isFree: ${isFree},
          features: [
            'Comprehensive curriculum',
            'Interactive lessons',
            'Practice exercises',
            'Progress tracking',
${!isFree ? "            'Certification upon completion',\n" : ''}          ],
        }}
        heroImage="/hero.jpg"
${!isFree ? `        showAIDevBundle={false}
        pricing={{
          amount: 99,
          gst: 18,
        }}` : ''}
      />
    </>
  );
}
`,

  // pages/curriculum.js
  'pages/curriculum.js': `import Head from 'next/head';
import SharedNavbar from '@/components/shared/SharedNavbar';
import CurriculumTable from '@/components/shared/CurriculumTable';

// TODO: Replace with actual course data from /data/modules.json
const mockCurriculum = {
  modules: [
    {
      id: 1,
      title: 'Module 1: Introduction',
      lessons: [
        { id: 1, title: 'Getting Started', duration: '15 min', type: 'lesson' },
        { id: 2, title: 'Basic Concepts', duration: '20 min', type: 'lesson' },
        { id: 3, title: 'Module 1 Quiz', duration: '10 min', type: 'quiz' },
      ],
    },
    {
      id: 2,
      title: 'Module 2: Fundamentals',
      lessons: [
        { id: 4, title: 'Core Principles', duration: '25 min', type: 'lesson' },
        { id: 5, title: 'Practice Exercises', duration: '30 min', type: 'practice' },
        { id: 6, title: 'Module 2 Quiz', duration: '10 min', type: 'quiz' },
      ],
    },
  ],
};

export default function Curriculum() {
  return (
    <>
      <Head>
        <title>Curriculum - ${appTitle}</title>
        <meta name="description" content="Complete course syllabus for ${appTitle}" />
      </Head>

      <SharedNavbar appId="${appId}" />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Course Curriculum
            </h1>
            <p className="text-lg text-gray-600">
              Complete syllabus for ${appTitle}
            </p>
          </div>

          <CurriculumTable curriculum={mockCurriculum} appId="${appId}" />
        </div>
      </main>
    </>
  );
}
`,

  // pages/login.js
  'pages/login.js': `import Head from 'next/head';
import UniversalLogin from '@/components/shared/UniversalLogin';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Login - ${appTitle}</title>
        <meta name="description" content="Login to ${appTitle}" />
      </Head>

      <UniversalLogin
        appId="${appId}"
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}
`,

  // pages/register.js
  'pages/register.js': `import Head from 'next/head';
import EnhancedUniversalRegister from '@/components/shared/EnhancedUniversalRegister';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();

  const handleRegistrationSuccess = () => {
    // Redirect to dashboard after successful registration
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Register - ${appTitle}</title>
        <meta name="description" content="Register for ${appTitle}" />
      </Head>

      <EnhancedUniversalRegister
        appId="${appId}"
        onSuccess={handleRegistrationSuccess}
      />
    </>
  );
}
`,

  // pages/dashboard.js
  'pages/dashboard.js': `import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SharedNavbar from '@/components/shared/SharedNavbar';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setUser(session.user);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - ${appTitle}</title>
        <meta name="description" content="Your learning dashboard" />
      </Head>

      <SharedNavbar appId="${appId}" />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome, {user?.user_metadata?.first_name || user?.email}!
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* TODO: Add dashboard content - modules, progress, etc. */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Your Progress</h3>
              <p className="text-gray-600">0% Complete</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Modules</h3>
              <p className="text-gray-600">0/10 Completed</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Certificates</h3>
              <p className="text-gray-600">None yet</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
`,

  // pages/admin/index.js
  'pages/admin/index.js': `import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    // TODO: Implement proper admin check
    // For now, check if email contains 'admin'
    const userIsAdmin = session.user.email?.includes('admin');
    
    if (!userIsAdmin) {
      router.push('/');
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - ${appTitle}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard - ${appTitle}</h1>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODO: Add admin features */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Users</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage registered users</p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">OTP Codes</h3>
                  <p className="mt-1 text-sm text-gray-500">Generate and manage access codes</p>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Content</h3>
                  <p className="mt-1 text-sm text-gray-500">Manage course content</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
`,

  // next.config.js
  'next.config.js': `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TODO: Add '@iiskills/core' when package is implemented
  transpilePackages: ['@iiskills/ui'],
  
  // Enable standalone output for production
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID || '${appId}',
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '${appTitle}',
  },
};

module.exports = nextConfig;
`,

  // tailwind.config.js
  'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../components/shared/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};
`,

  // postcss.config.js
  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`,

  // styles/globals.css
  'styles/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
`,

  // jsconfig.json
  'jsconfig.json': JSON.stringify({
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@/*': ['./*'],
        '@/components/*': ['../../components/*'],
        '@/lib/*': ['../../lib/*'],
        '@iiskills/ui': ['../../packages/ui/src/index.js'],
        '@iiskills/core': ['../../packages/core/index.ts'],
      }
    }
  }, null, 2),

  // .eslintrc.json
  '.eslintrc.json': JSON.stringify({
    extends: 'next/core-web-vitals'
  }, null, 2),

  // .gitignore
  '.gitignore': `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`,

  // data/modules.json
  'data/modules.json': JSON.stringify({
    modules: [
      {
        id: 1,
        title: 'Module 1: Introduction',
        description: 'Get started with the basics',
        order: 1,
        lessons: [
          {
            id: 1,
            title: 'Getting Started',
            duration: '15 min',
            type: 'lesson',
            content: 'TODO: Add lesson content'
          }
        ]
      }
    ]
  }, null, 2),
};

// Add payment page for PAID apps
if (!isFree) {
  files['pages/payment.js'] = `import Head from 'next/head';
import { useState } from 'react';
import SharedNavbar from '@/components/shared/SharedNavbar';
import { useRouter } from 'next/router';
import { getEffectivePricingBreakdown, formatINR } from '@iiskills/ui/pricing';

export default function Payment() {
  const router = useRouter();
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pricing = getEffectivePricingBreakdown();

  const handleRazorpayPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement Razorpay payment flow
      console.log('Initiating Razorpay payment...');
      
      // For now, just redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Implement OTP validation
      console.log('Validating OTP:', otpCode);
      
      // For now, just redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Payment - ${appTitle}</title>
        <meta name="description" content="Enroll in ${appTitle}" />
      </Head>

      <SharedNavbar appId="${appId}" />

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Enroll in ${appTitle}
            </h1>
            <p className="text-lg text-gray-600">
              Choose your payment method
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Payment Options</h2>
            
            {/* Option 1: Razorpay */}
            <div className="mb-8 p-6 border-2 border-blue-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Pay with Card/UPI</h3>
              <p className="text-3xl font-bold text-blue-600 mb-4">{formatINR(pricing.base)} + GST</p>
              <button
                onClick={handleRazorpayPayment}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>

            {/* OR Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Option 2: OTP Code */}
            <div className="p-6 border-2 border-green-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Have an Access Code?</h3>
              <p className="text-gray-600 mb-4">
                Enter your OTP code provided by the administrator
              </p>
              <form onSubmit={handleOTPSubmit}>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.toUpperCase())}
                  placeholder="Enter OTP Code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={loading || !otpCode}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Validating...' : 'Activate Access'}
                </button>
              </form>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Need help? Contact support@iiskills.cloud</p>
          </div>
        </div>
      </main>
    </>
  );
}
`;

  // Add payment API route
  files['pages/api/payment/confirm.js'] = `// Payment confirmation handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { orderId, paymentId, signature, userId } = req.body;

    // TODO: Implement Razorpay signature verification
    // TODO: Grant access to user
    // TODO: Send confirmation email
    
    res.status(200).json({ success: true, message: 'Access granted' });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ error: 'Payment confirmation failed' });
  }
}
`;
}

// Add API routes
files['pages/api/send-otp.js'] = `// OTP sending handler
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone } = req.body;

    // TODO: Implement OTP sending via email/SMS
    
    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (error) {
    console.error('OTP sending error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}
`;

files['pages/api/users/access.js'] = `// User access check handler
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.query;

    // TODO: Implement access check logic
    
    res.status(200).json({ 
      hasAccess: false, 
      method: null 
    });
  } catch (error) {
    console.error('Access check error:', error);
    res.status(500).json({ error: 'Access check failed' });
  }
}
`;

// Write all files
console.log('📄 Creating files...\n');
Object.entries(files).forEach(([filename, content]) => {
  const filePath = path.join(appPath, filename);
  const dir = path.dirname(filePath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`   ✓ ${filename}`);
});

// Create placeholder hero image
const heroPlaceholder = path.join(appPath, 'public', 'hero.jpg');
console.log('\n📸 Creating placeholder hero image...');
// We'll just create an empty file as placeholder
fs.writeFileSync(heroPlaceholder, '');
console.log('   ✓ public/hero.jpg (placeholder)');

// Create lib/supabaseClient.js
const supabaseClient = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
`;

fs.writeFileSync(path.join(appPath, 'lib', 'supabaseClient.js'), supabaseClient);
console.log('   ✓ lib/supabaseClient.js');

console.log(`\n✅ App created successfully: ${appName}\n`);
console.log('📋 Next steps:\n');
console.log(`   1. cd apps/${appName}`);
console.log('   2. Copy .env.local.example to .env.local');
console.log('   3. Update .env.local with your configuration');
console.log('   4. yarn install (from root)');
console.log(`   5. cd apps/${appName} && yarn dev`);
console.log(`   6. Open http://localhost:${appPort}\n`);
console.log('📚 Documentation:');
console.log('   - MONOREPO_ARCHITECTURE.md');
console.log('   - SHARED_COMPONENTS_LIBRARY.md');
console.log('   - DEPLOYMENT_POLICY.md\n');
console.log(`🎨 Remember: ${isFree ? 'FREE apps use GREEN badges' : 'PAID apps use BLUE badges'}\n`);

// Update ecosystem.config.js
console.log('🔧 Updating ecosystem.config.js...');
const ecosystemPath = path.join(__dirname, '..', 'ecosystem.config.js');
if (fs.existsSync(ecosystemPath)) {
  let ecosystem = fs.readFileSync(ecosystemPath, 'utf-8');
  
  const newApp = `    {
      name: '${appName}',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: './apps/${appName}',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: ${appPort},
      },
    },`;
  
  // Add before the closing bracket
  ecosystem = ecosystem.replace(/(\s*\]\s*\};?\s*)$/, `,\n${newApp}\n$1`);
  fs.writeFileSync(ecosystemPath, ecosystem);
  console.log('   ✓ Added to ecosystem.config.js');
} else {
  console.log('   ⚠ ecosystem.config.js not found - add manually');
}

console.log('\n🎉 Setup complete! Happy coding!\n');
