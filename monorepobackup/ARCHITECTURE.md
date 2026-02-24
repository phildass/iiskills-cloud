# IISKILLS Cloud - System Architecture

**Version**: 1.0  
**Last Updated**: February 19, 2026  
**Status**: Production

## Table of Contents

- [Overview](#overview)
- [High-Level Architecture](#high-level-architecture)
- [Application Layer](#application-layer)
- [Data Layer](#data-layer)
- [Access Control System](#access-control-system)
- [Payment System](#payment-system)
- [Authentication System](#authentication-system)
- [Build & Deployment](#build--deployment)
- [Monitoring & Observability](#monitoring--observability)
- [Security Architecture](#security-architecture)
- [Scalability Considerations](#scalability-considerations)

## Overview

IISKILLS Cloud is a multi-tenant learning platform built as a monorepo containing 10 independent Next.js applications, shared component libraries, and centralized business logic. The platform serves both free and paid educational content across various subjects.

### Design Principles

1. **Monorepo First**: All applications and packages in a single repository for easier code sharing and atomic changes
2. **Component Reusability**: Shared UI components via @iiskills/ui package
3. **Centralized Logic**: Access control, payment logic, and business rules in dedicated packages
4. **Security by Default**: Row-level security, encrypted connections, secure payment handling
5. **Developer Experience**: Fast builds, comprehensive testing, automated PR checks
6. **Production Ready**: PM2 process management, NGINX routing, SSL certificates, monitoring

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  (Browsers, Mobile Devices, Progressive Web Apps)               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ HTTPS (SSL/TLS)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX Reverse Proxy                           │
│  - SSL Termination                                              │
│  - Load Balancing                                               │
│  - Subdomain Routing                                            │
│  - Static Asset Serving                                         │
│  - Rate Limiting                                                │
└────────────┬───────────┬───────────┬──────────┬─────────────────┘
             │           │           │          │
             │           │           │          │
┌────────────▼──┐  ┌────▼────┐  ┌──▼─────┐  ┌▼──────────┐
│ Main Portal   │  │ Learn-AI│  │ Learn  │  │ ...       │
│ (Port 3000)   │  │(Port 3024)│ │ -APT   │  │ (8 more)  │
│               │  │         │  │(3002)  │  │           │
└───────┬───────┘  └────┬────┘  └──┬─────┘  └─┬─────────┘
        │               │           │          │
        │               │           │          │
        └───────────────┴───────────┴──────────┘
                        │
                        │ Supabase Client SDK
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase Platform                           │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐         │
│  │ PostgreSQL  │  │ Auth Service │  │ Storage (S3)  │         │
│  │ (Database)  │  │ (GoTrue)     │  │               │         │
│  └─────────────┘  └──────────────┘  └───────────────┘         │
└─────────────────────────────────────────────────────────────────┘
                        │
                        │ Webhooks & APIs
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Razorpay     │  │ SendGrid     │  │ Vonage       │         │
│  │ (Payments)   │  │ (Email)      │  │ (SMS/OTP)    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

## Application Layer

### Monorepo Structure

```
iiskills-cloud/
├── apps/                          # Application workspaces (11 apps)
│   ├── main/                      # Main portal & course catalog
│   ├── learn-ai/                  # AI learning app (PAID)
│   ├── learn-apt/                 # Aptitude learning app (FREE)
│   ├── learn-chemistry/           # Chemistry learning app (FREE)
│   ├── learn-developer/           # Developer learning app (PAID)
│   ├── learn-geography/           # Geography learning app (FREE)
│   ├── learn-management/          # Management learning app (PAID)
│   ├── learn-math/                # Math learning app (FREE)
│   ├── learn-physics/             # Physics learning app (FREE)
│   ├── learn-pr/                  # PR learning app (PAID)
│   └── learn-new/                 # Template for new apps
│
├── packages/                      # Shared packages
│   ├── access-control/           # @iiskills/access-control
│   │   ├── accessControl.js      # Core access control logic
│   │   ├── appConfig.js          # App configuration & pricing
│   │   ├── dbAccessManager.js    # Database access operations
│   │   └── paymentGuard.js       # Payment endpoint guards
│   │
│   ├── ui/                       # @iiskills/ui
│   │   ├── src/
│   │   │   ├── authentication/   # Login, Register components
│   │   │   ├── navigation/       # Navbar, Footer components
│   │   │   ├── landing/          # Landing page components
│   │   │   ├── payment/          # Payment form components
│   │   │   ├── content/          # Content display components
│   │   │   ├── common/           # Buttons, Cards, Layouts
│   │   │   ├── newsletter/       # Newsletter components
│   │   │   ├── translation/      # i18n components
│   │   │   ├── ai/               # AI assistant components
│   │   │   └── pwa/              # PWA install components
│   │
│   ├── core/                     # @iiskills/core (TypeScript)
│   │   ├── types/                # Shared TypeScript types
│   │   ├── utils/                # Utility functions
│   │   ├── hooks/                # React hooks
│   │   └── components/           # Core components
│   │
│   ├── content-sdk/              # @iiskills/content-sdk (TypeScript)
│   │   └── src/                  # Content management SDK
│   │
│   └── schema/                   # @iiskills/schema (TypeScript)
│       └── index.ts              # Database schema types
│
├── supabase/                     # Database & migrations
│   └── migrations/               # SQL migration files
│
├── .github/                      # CI/CD & automation
│   ├── workflows/                # GitHub Actions
│   └── dangerfile.js            # Automated PR analysis
│
└── scripts/                      # Build & deployment scripts
```

### Application Architecture (Per App)

Each learning app is a Next.js application with the following structure:

```
app/learn-{subject}/
├── pages/
│   ├── index.js                  # Landing page
│   ├── curriculum.js             # Course syllabus
│   ├── login.js                  # Authentication
│   ├── register.js               # Registration
│   ├── payment.js                # Payment flow (paid apps)
│   │
│   └── api/                      # API routes
│       ├── payment/              # Payment endpoints
│       │   ├── create.js         # Create Razorpay order
│       │   └── confirm.js        # Confirm payment & grant access
│       │
│       └── content/              # Content APIs
│           ├── get.js            # Fetch content
│           └── update.js         # Update progress
│
├── components/                   # App-specific components
├── styles/                       # App-specific styles
├── public/                       # Static assets
├── lib/                          # App-specific utilities
├── .env.local.example            # Environment template
├── package.json                  # Dependencies & scripts
└── next.config.js               # Next.js configuration
```

## Data Layer

### Database Schema (PostgreSQL via Supabase)

```sql
-- Core Tables
profiles               -- User profiles
user_app_access        -- Access control records
payments               -- Payment transactions
courses                -- Course metadata
lessons                -- Lesson content
user_progress          -- Learning progress
certificates           -- Certificates earned

-- Authentication (Supabase Auth)
auth.users            -- Supabase auth users
auth.identities       -- OAuth identities
```

### Key Tables Detail

#### `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `user_app_access`
```sql
CREATE TABLE user_app_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL, -- e.g., 'learn-ai', 'learn-developer'
  granted_via TEXT NOT NULL, -- 'payment', 'bundle', 'admin', 'free'
  payment_id UUID REFERENCES payments(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- NULL for lifetime access
  UNIQUE(user_id, app_id)
);

-- Index for fast lookups
CREATE INDEX idx_user_app_access_user_app ON user_app_access(user_id, app_id);
```

#### `payments`
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount DECIMAL(10,2) NOT NULL, -- In INR rupees
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'created', -- created, completed, failed
  bundle_apps TEXT[], -- For bundle purchases
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ
);
```

### Row-Level Security (RLS)

All tables have RLS policies enforcing:
- Users can only read their own data
- Admins have elevated privileges
- Payment records are immutable after confirmation
- Access records can only be created by authorized endpoints

## Access Control System

### Centralized Configuration

The `@iiskills/access-control` package provides the single source of truth for all access control logic:

```javascript
// appConfig.js
const APPS = {
  // Free apps (no payment required)
  FREE: [
    'learn-apt',
    'learn-chemistry',
    'learn-geography',
    'learn-math',
    'learn-physics'
  ],
  
  // Paid apps (require payment)
  PAID: [
    'main',          // Portal app
    'learn-ai',      // ₹99 + GST (or bundle)
    'learn-developer', // ₹99 + GST (or bundle)
    'learn-management', // ₹149 + GST
    'learn-pr'       // ₹149 + GST
  ]
};

// AI-Developer Bundle Configuration
const AI_DEVELOPER_BUNDLE = {
  apps: ['learn-ai', 'learn-developer'],
  price: 99, // ₹99 + GST for both
  description: 'Get both AI and Developer courses'
};
```

### Access Check Flow

```
User Request → App
     │
     ▼
Check if FREE app?
     │
     ├─ YES → Grant Access
     │
     └─ NO → Check user_app_access table
              │
              ├─ Record exists? → Grant Access
              │
              └─ No record → Redirect to /payment
```

### Bundle Logic

When a user purchases either Learn AI or Learn Developer:

1. **Payment Confirmation**: `grantBundleAccess()` is called
2. **Create Access Records**:
   - Purchased app: `granted_via = 'payment'`
   - Bundled app: `granted_via = 'bundle'`
3. **Update Payment**: Add `bundle_apps` array to payment record
4. **Automatic Access**: User now has access to both apps

```javascript
// Payment confirmation endpoint
const result = await grantBundleAccess({
  userId: user.id,
  purchasedAppId: 'learn-ai',
  paymentId: payment.id
});
// result.bundledApps = ['learn-developer']
// User now has access to both learn-ai and learn-developer
```

## Payment System

### Razorpay Integration

```
User clicks "Buy Course"
     │
     ▼
POST /api/payment/create
     │ (Creates Razorpay order)
     ▼
Razorpay Checkout Modal
     │ (User completes payment)
     ▼
POST /api/payment/confirm
     │
     ├─ Verify signature
     ├─ Create user_app_access record
     ├─ Grant bundle access (if applicable)
     └─ Redirect to app
```

### Payment Security

- **Server-side verification**: All payment confirmations verified server-side
- **Signature validation**: Razorpay signature verified using secret key
- **Idempotency**: Duplicate payments prevented via unique constraints
- **Audit trail**: All payment attempts logged in database

### Payment Guard Middleware

```javascript
// packages/access-control/paymentGuard.js
export function guardPaymentEndpoint(appId, req, res) {
  // 1. Check HTTP method (POST only)
  // 2. Check if app is free (no payments on free apps)
  // 3. Validate required fields
  // Returns true if guard triggered, false to proceed
}

// Usage in payment endpoints
export default async function handler(req, res) {
  if (guardPaymentEndpoint('learn-ai', req, res)) {
    return; // Guard handled the response
  }
  
  // Proceed with payment logic
}
```

## Authentication System

### Supabase Auth

```
┌────────────────┐
│  Login Page    │
│  /login        │
└────┬───────────┘
     │
     ├─ Google OAuth → Supabase Auth → JWT Token
     │
     └─ OTP Login → Vonage SMS → Supabase Auth → JWT Token
          │
          ▼
     Client receives JWT
          │
          ├─ Stored in localStorage
          ├─ Included in API requests
          └─ Validated by Supabase
```

### Auth Flow

1. **Login**: User chooses Google OAuth or OTP
2. **Supabase Auth**: Handles authentication and JWT generation
3. **Profile Creation**: Trigger creates profile record on first login
4. **Session Management**: JWT stored in client, expires after 1 hour
5. **Refresh**: Silent refresh when JWT expires

### Multi-Domain Auth

Each subdomain shares auth via:
- Centralized Supabase project
- Shared JWT secret
- Cookie domain set to `.iiskills.in`

## Build & Deployment

### Build Pipeline

```
┌──────────────┐
│  Developer   │
│  Commits     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  GitHub Actions  │
│  (11 checks)     │
└──────┬───────────┘
       │
       ├─ ESLint + Prettier
       ├─ Import Validation
       ├─ Unit Tests (Jest)
       ├─ E2E Tests (Playwright)
       ├─ Security Audit
       ├─ Build All Apps
       └─ Danger.js Analysis
       │
       ▼
┌──────────────────┐
│  Merge to Main   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Production      │
│  Deployment      │
└──────┬───────────┘
       │
       ├─ Build all apps: yarn build
       ├─ Generate PM2 config
       ├─ Deploy with PM2
       └─ Update NGINX
```

### Turborepo Build System

```javascript
// turbo.json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"], // Build dependencies first
      "outputs": [".next/**"]
    },
    "dev": {
      "cache": false
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Benefits:**
- Parallel builds for independent apps
- Intelligent caching of build artifacts
- Only rebuild what changed
- Faster CI/CD pipelines

### PM2 Process Management

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'iiskills-main',
      script: 'npx',
      args: 'next start',
      cwd: './apps/main',
      env: { PORT: 3000 },
      instances: 1,
      exec_mode: 'cluster'
    },
    {
      name: 'iiskills-learn-ai',
      script: 'npx',
      args: 'next start',
      cwd: './apps/learn-ai',
      env: { PORT: 3024 },
      instances: 1,
      exec_mode: 'cluster'
    }
    // ... 8 more apps
  ]
};
```

### NGINX Configuration

```nginx
# Main portal
server {
    listen 443 ssl http2;
    server_name iiskills.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Learn AI subdomain
server {
    listen 443 ssl http2;
    server_name learn-ai.iiskills.in;
    
    location / {
        proxy_pass http://localhost:3024;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Observability

### Application Monitoring

- **PM2 Monitoring**: Process status, CPU, memory, restart count
- **Application Logs**: Structured logging to files and stdout
- **Error Tracking**: Server-side error logging
- **Performance**: Next.js Analytics for page performance

### Database Monitoring

- **Supabase Dashboard**: Query performance, connection pool, storage
- **RLS Audit**: Track policy enforcement and violations
- **Slow Query Log**: Identify and optimize slow queries

### Infrastructure Monitoring

- **NGINX Access Logs**: Request patterns, status codes, response times
- **SSL Certificate Expiry**: Automated renewal with Let's Encrypt
- **Disk Usage**: Monitor storage for logs and builds

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────┐
│  Level 1: Network                   │
│  - HTTPS/TLS 1.3                    │
│  - NGINX rate limiting              │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Level 2: Application               │
│  - JWT authentication               │
│  - API route authorization          │
│  - CSRF protection                  │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Level 3: Database                  │
│  - Row-Level Security (RLS)         │
│  - Encrypted connections            │
│  - Prepared statements              │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│  Level 4: Code                      │
│  - npm audit (CI/CD)                │
│  - CodeQL scanning                  │
│  - Dependency updates               │
└─────────────────────────────────────┘
```

### Security Best Practices

1. **No secrets in code**: All credentials in environment variables
2. **RLS always on**: Database security at row level
3. **Payment security**: Server-side verification only
4. **Input validation**: All user inputs validated and sanitized
5. **Dependency scanning**: Automated security audits
6. **SSL everywhere**: All production traffic encrypted
7. **Audit logging**: All access control decisions logged

## Scalability Considerations

### Current Capacity

- **10 Next.js apps**: Each on dedicated port
- **PM2 cluster mode**: Can scale to multiple instances per app
- **Supabase**: Scales automatically with usage
- **NGINX**: High-performance reverse proxy

### Scaling Strategy

**Horizontal Scaling (Future)**:
```
Load Balancer
     │
     ├── Server 1 (PM2 cluster)
     ├── Server 2 (PM2 cluster)
     └── Server 3 (PM2 cluster)
          │
          └── Shared Supabase instance
```

**Caching Strategy**:
- Static assets: NGINX caching + CDN
- API responses: Redis caching (future)
- Database queries: Supabase connection pooling

**Database Optimization**:
- Indexes on frequently queried columns
- Materialized views for complex queries
- Read replicas for analytics (future)

### Performance Targets

- **Page Load**: < 2 seconds (FCP)
- **API Response**: < 200ms (p95)
- **Build Time**: < 5 minutes (full monorepo)
- **Deployment**: < 10 minutes (zero downtime)

## Conclusion

IISKILLS Cloud is designed as a production-ready, scalable learning platform with:
- Modular monorepo architecture
- Centralized access control and payment logic
- Comprehensive security at every layer
- Automated testing and deployment
- Clear separation of concerns
- Developer-friendly tooling

For more details, see:
- [MONOREPO_ARCHITECTURE.md](MONOREPO_ARCHITECTURE.md)
- [UNIVERSAL_ACCESS_CONTROL.md](UNIVERSAL_ACCESS_CONTROL.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
