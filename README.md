# IISKILLS Cloud

[![Production Ready](https://img.shields.io/badge/production-ready-brightgreen.svg)](https://iiskills.in)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Monorepo](https://img.shields.io/badge/monorepo-turborepo-blueviolet.svg)](https://turbo.build)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

> Professional, scalable learning platform built with Next.js, Tailwind CSS, and modern web technologies.  
> Designed for the Indian Institute of Professional Skills Development.

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)

## 🎯 Overview

IISKILLS Cloud is a production-grade monorepo containing multiple learning applications, shared component libraries, and centralized access control. The platform serves thousands of students with both free and paid courses across various subjects.

### Key Features

- **10 Active Learning Applications**: 5 free courses + 4 paid courses + main portal
- **Universal Access Control**: Centralized @iiskills/access-control package managing all app permissions
- **AI-Developer Bundle**: Automatic 2-for-1 bundle when purchasing either Learn AI or Learn Developer
- **Monorepo Architecture**: Turborepo + Yarn workspaces for efficient builds and deployments
- **Shared Component Library**: @iiskills/ui package with 38+ reusable components
- **Automated PR Checks**: Comprehensive CI/CD with ESLint, Prettier, unit tests, E2E tests, and security scans
- **Multi-domain Support**: Each app runs on its own subdomain with SSL certificates

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     IISKILLS Cloud Platform                  │
│                    (iiskills.in - Main Portal)               │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
   │  FREE   │          │  PAID   │          │ BUNDLES │
   │  APPS   │          │  APPS   │          │         │
   └────┬────┘          └────┬────┘          └────┬────┘
        │                     │                     │
   ┌────┴────────┐      ┌────┴─────────┐     ┌────┴─────┐
   │ Aptitude    │      │ AI           │     │ AI+Dev   │
   │ Chemistry   │      │ Developer    │◄────┤ Bundle   │
   │ Geography   │      │ Management   │     │ ₹99+GST  │
   │ Math        │      │ PR           │     └──────────┘
   │ Physics     │      └──────────────┘
   └─────────────┘
```

### Monorepo Structure

```
iiskills-cloud/
├── apps/                    # Application workspaces
│   ├── main/               # Portal (3000) - Course catalog & auth
│   ├── learn-ai/           # AI Course (3024) - PAID
│   ├── learn-apt/          # Aptitude (3002) - FREE
│   ├── learn-chemistry/    # Chemistry (3005) - FREE
│   ├── learn-developer/    # Developer (3007) - PAID (bundles with AI)
│   ├── learn-geography/    # Geography (3011) - FREE
│   ├── learn-management/   # Management (3016) - PAID
│   ├── learn-math/         # Math (3017) - FREE
│   ├── learn-physics/      # Physics (3020) - FREE
│   └── learn-pr/           # PR (3021) - PAID
│
├── packages/               # Shared packages
│   ├── access-control/    # Universal access control & payment logic
│   ├── ui/                # 38+ shared React components
│   ├── core/              # Core utilities and types (TypeScript)
│   ├── content-sdk/       # Content management SDK (TypeScript)
│   └── schema/            # Database schemas (TypeScript)
│
├── .github/               # CI/CD workflows & PR automation
│   ├── workflows/         # GitHub Actions (PR checks, security, builds)
│   └── dangerfile.js      # Automated PR analysis
│
├── supabase/             # Database migrations & schemas
├── scripts/              # Build, deployment, and utility scripts
└── docs/                 # Comprehensive documentation
```

### Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React, Tailwind CSS, Framer Motion |
| **Backend** | Next.js API Routes, Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Google OAuth, OTP) |
| **Payments** | Razorpay integration |
| **Build** | Turborepo, Yarn 4 workspaces |
| **Testing** | Jest (unit), Playwright (E2E), Danger.js (PR analysis) |
| **CI/CD** | GitHub Actions (11 automated checks) |
| **Deployment** | PM2 process manager, NGINX reverse proxy |
| **Security** | SSL/TLS certificates, CodeQL scanning, npm audit |

### Access Control Architecture

The platform uses a centralized access control system in `@iiskills/access-control`:

```javascript
// Centralized app configuration
const APPS = {
  FREE: ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'],
  PAID: ['main', 'learn-ai', 'learn-developer', 'learn-management', 'learn-pr']
};

// AI-Developer Bundle
const AI_DEVELOPER_BUNDLE = {
  apps: ['learn-ai', 'learn-developer'],
  price: 99, // ₹99 + GST
  autoGrant: true // Purchasing one unlocks both
};
```

**Key APIs:**
- `userHasAccess(userId, appId)` - Check if user can access an app
- `grantBundleAccess({ userId, purchasedAppId, paymentId })` - Grant bundle apps automatically
- `isFreeApp(appId)` - Check if app is free
- `requiresPayment(appId)` - Check if app requires payment

## 🔐 Admin Access — Testing Mode

For local development or CI testing **without** a Supabase database, enable
`TEST_ADMIN_MODE` in your `.env.local`:

```bash
# apps/main/.env.local  (or root .env.local)

# Enable env-only admin auth — no Supabase writes/reads required
TEST_ADMIN_MODE=true

# Optional: override the default passphrase (default: iiskills123)
ADMIN_PANEL_SECRET=my-test-secret

# Required for signing the session cookie
ADMIN_SESSION_SIGNING_KEY=some-32-char-random-string-here
```

When `TEST_ADMIN_MODE=true`:
- Admin login at `/admin/login` checks the passphrase against `ADMIN_PANEL_SECRET`
  (falls back to `iiskills123` when the env var is absent).
- No Supabase reads or writes are attempted.
- The "Set Passphrase" setup page is replaced with an env-var instruction banner.

Set `TEST_ADMIN_MODE=false` (or remove it) to restore the production Supabase
authentication path.

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.0.0
- Yarn 4.x (included via packageManager)
- PostgreSQL (via Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud

# Install dependencies (uses Yarn 4 automatically)
yarn install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase and Razorpay credentials

# Run database migrations
# (See supabase/README.md for setup instructions)

# Start development server
yarn dev
```

### Development Workflow

```bash
# Start all apps in dev mode
yarn dev

# Start specific app
yarn workspace main dev
yarn workspace learn-ai dev

# Run tests
yarn test                  # Unit tests
yarn test:e2e             # E2E tests (Playwright)
yarn test:coverage        # Coverage report

# Linting & Formatting
yarn lint                 # Check all files
yarn lint:fix            # Auto-fix issues
yarn format              # Format with Prettier
yarn format:check        # Check formatting

# Build all apps
yarn build

# Type checking (TypeScript packages)
yarn workspace @iiskills/core tsc --noEmit
```

## 📁 Project Structure

### Standard App Structure

Each learning app follows a consistent structure:

```
apps/learn-{subject}/
├── pages/
│   ├── index.js              # Landing page (uses PaidAppLandingPage or FreeAppLandingPage)
│   ├── curriculum.js         # Syllabus/course structure
│   ├── login.js              # Authentication page
│   ├── register.js           # Registration page
│   ├── payment.js            # Payment page (paid apps only)
│   └── api/
│       ├── payment/
│       │   └── confirm.js    # Payment confirmation (paid apps)
│       └── content/          # Content APIs
│
├── public/                   # Static assets
├── styles/                   # App-specific styles
├── components/               # App-specific components
├── .env.local.example        # Environment template
├── package.json              # App dependencies
└── next.config.js           # Next.js configuration
```

## 🧪 Testing

### Testing Strategy

The platform has comprehensive testing at multiple levels:

**Unit Tests (Jest)**
- Business logic validation
- Utility function testing
- Component testing
- API endpoint testing

```bash
yarn test                    # Run all unit tests
yarn test:watch             # Watch mode
yarn test:coverage          # Generate coverage report
```

**E2E Tests (Playwright)**
- User flow testing (3 browsers: Chrome, Firefox, Safari)
- Access control scenarios
- Payment flows
- Bundle logic validation
- Admin overrides

```bash
yarn test:e2e               # Run all E2E tests
yarn test:e2e:chrome        # Chrome only
yarn test:e2e:ui            # Interactive UI mode
yarn test:e2e:debug         # Debug mode
```

**Automated PR Checks (11 checks)**
1. PR template validation
2. Code quality (ESLint + Prettier)
3. Import validation (@iiskills/ui usage)
4. Unit tests
5. E2E tests (3 browsers)
6. Config validation
7. Security audit (npm audit)
8. Build verification (10 apps)
9. Danger.js analysis
10. Report generation
11. Final status check

### Test Coverage

Current coverage (target: >80%):
- Access control: 95%
- Payment logic: 90%
- API endpoints: 85%
- Components: 75%

## 🚢 Deployment

### Deployment Architecture

```
Production Server (Ubuntu 22.04)
├── NGINX (Reverse Proxy)
│   ├── SSL/TLS Termination
│   └── Subdomain Routing
├── PM2 (Process Manager)
│   ├── apps/main → Port 3000
│   ├── apps/learn-ai → Port 3024
│   ├── apps/learn-apt → Port 3002
│   └── ... (8 more apps)
└── Supabase (PostgreSQL + Auth)
```

### Deployment Process

```bash
# Build all apps
yarn build

# Generate PM2 configuration
yarn generate-pm2-config

# Deploy with PM2
pm2 start ecosystem.config.js
pm2 save

# Setup NGINX with SSL
sudo bash setup-nginx.sh
sudo bash renew-ssl-certificates.sh
```

### Subdomain Configuration

Each app runs on its own subdomain:
- `iiskills.in` → main portal
- `learn-ai.iiskills.in` → Learn AI
- `learn-apt.iiskills.in` → Learn Aptitude
- ... (and so on)

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

### 🎯 Production Readiness Documentation (NEW!)

**Start Here**: [PRODUCTION_READINESS_MASTER_INDEX.md](PRODUCTION_READINESS_MASTER_INDEX.md) - Complete documentation index and executive summary

#### Core Production Guides

| Document | Description | Priority |
|----------|-------------|----------|
| **[PRODUCTION_READINESS_COMPLETE.md](PRODUCTION_READINESS_COMPLETE.md)** | **Complete production readiness assessment (95.6% ready)** | 🔥 Critical |
| **[UNIVERSAL_INTEGRATION_DEPLOYMENT_PLAYBOOK.md](UNIVERSAL_INTEGRATION_DEPLOYMENT_PLAYBOOK.md)** | **Step-by-step integration & deployment guide** | 🔥 Critical |
| [APP_CLUSTERING_MODULARIZATION_GUIDE.md](APP_CLUSTERING_MODULARIZATION_GUIDE.md) | App clustering strategy with 70-85% code sharing | High |
| [COMPREHENSIVE_E2E_TESTING_STRATEGY.md](COMPREHENSIVE_E2E_TESTING_STRATEGY.md) | Complete E2E testing guide with 305 test files | High |
| [DATABASE_MIGRATION_SECURITY_STANDARDS.md](DATABASE_MIGRATION_SECURITY_STANDARDS.md) | Database standards v2.0 with RLS and security | High |

**Production Readiness Score**: 95.6% ✅  
**Security Status**: 0 vulnerabilities ✅  
**Test Coverage**: 103 passing tests, full E2E suite ✅

### Essential Documentation

| Document | Description |
|----------|-------------|
| [MONOREPO_ARCHITECTURE.md](MONOREPO_ARCHITECTURE.md) | Detailed monorepo structure and patterns |
| [UNIVERSAL_ACCESS_CONTROL.md](UNIVERSAL_ACCESS_CONTROL.md) | Access control system documentation |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Complete deployment guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines and standards |
| [E2E_TESTING_FRAMEWORK.md](E2E_TESTING_FRAMEWORK.md) | E2E testing guide |
| [SECURITY_SETUP.md](SECURITY_SETUP.md) | Security policies and procedures |
| [docs/PR_REQUIREMENTS_GUIDE.md](docs/PR_REQUIREMENTS_GUIDE.md) | PR standards and automated checks |

### Additional Resources

- [ADDING_NEW_APP.md](ADDING_NEW_APP.md) - Guide for adding new learning apps
- [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) - Environment configuration
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - Auth system overview
- [RAZORPAY_INTEGRATION_GUIDE.md](RAZORPAY_INTEGRATION_GUIDE.md) - Payment integration

## 🛠️ Development

### NPM Scripts Reference

```bash
# Development
yarn dev                      # Start all apps in dev mode
yarn dev:main                 # Start main portal only

# Building
yarn build                    # Build all apps (production)
yarn build:all-serial         # Build apps one at a time (CI)

# Testing
yarn test                     # Unit tests (Jest)
yarn test:watch              # Unit tests in watch mode
yarn test:coverage           # Generate coverage report
yarn test:e2e                # E2E tests (Playwright)
yarn test:e2e:ui             # E2E tests with UI

# Code Quality
yarn lint                     # ESLint check
yarn lint:fix                # ESLint auto-fix
yarn format                   # Prettier format
yarn format:check            # Prettier check

# Validation
yarn validate-env            # Validate environment variables
yarn validate-config         # Validate configuration consistency
yarn verify-production       # Production readiness check

# PM2 & Deployment
yarn generate-pm2-config     # Generate ecosystem.config.js
yarn validate-pm2-config     # Validate PM2 configuration
yarn pre-deploy-check        # Pre-deployment validation
yarn post-deploy-check       # Post-deployment validation

# Content Management
yarn validate-content        # Validate content structure
yarn check-orphans           # Find orphaned content files
yarn generate:registry       # Generate app registry

# CI/CD
yarn ci:build:workspace      # Build single workspace (CI)
yarn danger                  # Run Danger.js PR analysis
```

### Environment Variables

Key environment variables (see `.env.local.example` for full list):

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay (Payments)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# App Configuration
NEXT_PUBLIC_APP_ID=learn-ai
NEXT_PUBLIC_APP_NAME="Learn AI"
NEXT_PUBLIC_SITE_URL=https://learn-ai.iiskills.in

# Feature Flags
ENABLE_OPEN_ACCESS_MODE=false
ENABLE_TESTING_MODE=false
```

## 👥 Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### PR Requirements

All PRs must pass automated checks:
- ✅ Use PR template
- ✅ Pass ESLint + Prettier
- ✅ Use @iiskills/ui imports (no local component imports)
- ✅ Include unit tests for new features
- ✅ Include E2E tests for user flows
- ✅ Include screenshots for UI changes
- ✅ Pass security audit (npm audit)
- ✅ Build all 10 apps successfully
- ✅ No .env files committed

See [docs/PR_REQUIREMENTS_GUIDE.md](docs/PR_REQUIREMENTS_GUIDE.md) for complete requirements.

### Code Standards

- Use TypeScript for new packages and critical logic
- Follow existing component patterns in @iiskills/ui
- Write tests for all new features
- Document public APIs
- Use conventional commit messages

## 🔒 Security

- All credentials stored in environment variables (never committed)
- SSL/TLS encryption for all production traffic
- Supabase Row Level Security (RLS) policies
- Regular security audits (npm audit, CodeQL)
- Payment data handled by Razorpay (PCI compliant)

Report security vulnerabilities to: security@iiskills.in

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆕 New Features

### 🏏 World Cup Launch — Cricket Universe (LATEST!)

#### 🎯 Daily Strike
**5-10 World Cup focused trivia questions daily challenge**
- Questions generated from local World Cup fixtures
- Multiple difficulty levels (easy/medium/hard)
- Score tracking and results summary
- Optional LLM enrichment for question phrasing
- Content moderation with banlist filtering

Visit: `/daily-strike` when `ENABLE_DAILY_STRIKE=true`

#### ⚡ Super Over
**60-second rapid-fire cricket trivia match**
- 6-ball Super Over format
- Bot opponent with configurable difficulty
- Real-time scoring (correct = runs, wrong = wicket)
- Solo play mode for MVP
- In-memory match state (Redis-ready for Phase 2)

Visit: `/super-over` when `ENABLE_SUPER_OVER=true`

#### 📊 Local Fixtures (Source of Truth)
World Cup fixtures and squads stored locally:
- `/data/fixtures/worldcup-fixtures.json` - Match schedule, venues, dates
- `/data/squads/*.json` - Team rosters and player info
- No external API calls by default (use `CRICKET_API_KEY` for live stats)

#### 🎨 Image Management System
**License-free images with optional AI generation**
- Image manifest template: `components/shared/imageManifest.template.json`
- Generation script: `scripts/generate-or-download-images.sh`
- Prefers license-free URLs (Unsplash/Pexels)
- Falls back to Gemini Image API for generation (when needed)
- Generated images stored in `/public/generated-images/` (git-ignored)
- SharedHero component updated to use manifest

Run image script:
```bash
# Download license-free images only (no API key needed)
./scripts/generate-or-download-images.sh --download-only

# Generate with Gemini (requires API key)
export GEMINI_API_KEY=your-key-here
./scripts/generate-or-download-images.sh
```

⚠️ **IMPORTANT**: Generated images are NOT committed to git. They exist only locally.

#### 🔐 Content Safety & Moderation
**AI-powered content filtering with safety rules**
- Banlist: `config/content-banlist.json` (political/religious/offensive keywords)
- Auto-rejection of flagged content
- AI audit logging to `logs/ai-content-audit.log`
- Numeric validation against local fixtures
- Source attribution requirements

All LLM outputs are:
1. Checked against banlist
2. Validated for factual accuracy
3. Logged for audit trail
4. Rejected if controversial

See: [docs/ai-templates.md](docs/ai-templates.md) for complete guidelines

#### 🎮 Feature Flags

**World Cup Mode**
```bash
ENABLE_WORLD_CUP_MODE=true  # Enable World Cup landing and features
```

**Daily Strike**
```bash
ENABLE_DAILY_STRIKE=true    # Enable Daily Strike trivia (default: true)
```

**Super Over**
```bash
ENABLE_SUPER_OVER=true      # Enable Super Over matches (default: true)
```

**LLM Enrichment (Optional)**
```bash
ENABLE_LLM=true             # Enable LLM question enrichment
GEMINI_API_KEY=xxx          # Read from process.env (NEVER commit!)
# OR
LLM_API_KEY=xxx             # Alternative API key
```

**Live Stats (Optional)**
```bash
ENABLE_LIVE_STATS=true      # Enable live match stats
CRICKET_API_KEY=xxx         # External cricket API (if available)
```

**Bot Configuration**
```bash
BOT_ACCURACY_EASY=0.5       # Bot accuracy for easy mode
BOT_ACCURACY_MEDIUM=0.7     # Bot accuracy for medium mode (default)
BOT_ACCURACY_HARD=0.9       # Bot accuracy for hard mode
BOT_DELAY_MS_EASY=2000      # Bot answer delay (ms)
BOT_DELAY_MS_MEDIUM=1500
BOT_DELAY_MS_HARD=1000
```

#### 🚀 Quick Start (World Cup Features)

1. **Clone and install**
```bash
git checkout feature/world-cup-launch
npm install
```

2. **Set up images (optional)**
```bash
# For license-free images only (no API key)
./scripts/generate-or-download-images.sh --download-only

# For AI generation (requires Gemini API key)
export GEMINI_API_KEY=your-key-here
./scripts/generate-or-download-images.sh
```

3. **Enable features**
```bash
# Create .env.local or set environment variables
ENABLE_WORLD_CUP_MODE=true
ENABLE_DAILY_STRIKE=true
ENABLE_SUPER_OVER=true

# Optional: Enable LLM enrichment
ENABLE_LLM=true
GEMINI_API_KEY=your-key-here
```

4. **Run locally**
```bash
npm run dev
# Visit http://localhost:3000/daily-strike
# Visit http://localhost:3000/super-over
```

#### 📁 Files Added/Modified

**New Files:**
- `data/fixtures/worldcup-fixtures.json` - World Cup match schedule
- `data/squads/india.json` - India squad
- `data/squads/australia.json` - Australia squad
- `config/content-banlist.json` - Content moderation banlist
- `components/shared/imageManifest.template.json` - Image manifest template
- `components/shared/imageManifest.js` - Generated image manifest (auto-generated)
- `scripts/generate-or-download-images.sh` - Image download/generation script
- `apps/learn-cricket/pages/daily-strike.js` - Daily Strike page
- `apps/learn-cricket/pages/super-over.js` - Super Over page
- `apps/learn-cricket/pages/api/daily-strike.js` - Daily Strike API
- `apps/learn-cricket/pages/api/match/create.js` - Create match API
- `apps/learn-cricket/pages/api/match/answer.js` - Submit answer API
- `apps/learn-cricket/pages/api/match/[matchId].js` - Get match status API
- `tests/contentFilter.test.js` - Content filtering tests

**Modified Files:**
- `.gitignore` - Added generated images and logs exclusions
- `components/shared/SharedHero.js` - Updated to use image manifest
- `tests/sharedHero.test.js` - Updated tests for manifest system

**Backup Files Created:**
- `.gitignore.bak.1738573891`
- `docs/ai-templates.md.bak.1738574115`
- `components/shared/SharedHero.js.bak.1738574211`
- `tests/sharedHero.test.js.bak.1738575295`
- `apps/learn-cricket/pages/daily-strike.js.bak.1738575733`
- `apps/learn-cricket/pages/super-over.js.bak.1738575733`

#### ✅ Testing

```bash
# Run all tests
npm test

# Test results: 55 tests passing
# - contentFilter.test.js: 24 tests (content moderation)
# - match.test.js: 19 tests (Super Over logic)
# - sharedHero.test.js: 12 tests (image manifest)
```

#### 🔒 Security Checklist

✅ No API keys committed to git
✅ Generated images excluded from git (.gitignore)
✅ Logs excluded from git (.gitignore)
✅ Content moderation with banlist
✅ AI audit logging for transparency
✅ Numeric validation against fixtures
✅ ADMIN_SETUP_MODE and TEMP_SUSPEND_AUTH disabled by default

#### 📚 Documentation

- [AI Templates & Safety Rules](docs/ai-templates.md)
- [Image Manifest Template](components/shared/imageManifest.template.json)
- [Content Banlist](config/content-banlist.json)
- [World Cup Fixtures](data/fixtures/worldcup-fixtures.json)

---

### 🏏 Cricket Universe MVP (Previous Release)
**Interactive cricket learning and engagement platform!**

The Cricket Universe (learn-cricket) MVP brings an exciting new dimension to cricket education:

#### Core Features
- **🏆 Super Over Duels** - 1v1 trivia matches vs bot opponents or friends
- **📚 The Vault** - Comprehensive database of players, matches, and venues
- **🎯 Deterministic Hero Images** - Each app gets a consistent, beautifully selected hero image
- **🔐 First-Time Admin Setup** - Secure, feature-flagged admin account creation
- **🤖 AI Content Templates** - LLM-powered trivia and player summary generation

#### Feature Flags (Development/Setup Only)

⚠️ **CRITICAL**: These flags are for development and initial setup only. NEVER enable in production!

**ADMIN_SETUP_MODE** - First-time admin account creation
```bash
# Enable ONLY for first-time setup
ADMIN_SETUP_MODE=true

# After creating admin account, immediately disable:
ADMIN_SETUP_MODE=false
```
- Only active when NO admin accounts exist
- Creates bcrypt-hashed admin credentials
- Logs all setup attempts to `logs/admin-setup.log`
- Visit `/admin/setup` when enabled
- [Full Documentation](docs/ADMIN_SETUP_README.md)

**TEMP_SUSPEND_AUTH** - Temporary authentication bypass (DANGEROUS!)
```bash
# Requires BOTH flags to activate (dual confirmation)
TEMP_SUSPEND_AUTH=true
ADMIN_SUSPEND_CONFIRM=true
```
- Only bypasses auth on `/admin/*` routes
- Logs all bypassed requests
- Must be disabled before production
- [Full Documentation](docs/TEMP_SUSPEND_AUTH.md)

#### Super Over Match System
Real-time trivia-based cricket matches:
```javascript
// Create a match
POST /api/match/create
{ playerAId: "user_123", mode: "bot" }

// Submit answer
POST /api/match/answer
{ matchId: "match_1", playerId: "user_123", answer: "correct", isCorrect: true }

// Get match status
GET /api/match/match_1
```

Features:
- In-memory match state (Redis-ready for Phase 2)
- Configurable bot difficulty (easy/medium/hard)
- Deterministic bot behavior (70% accuracy by default)
- 6-ball Super Over format
- Run scoring based on correct answers

#### The Vault
Browse cricket history and statistics:
- `/vault` - Searchable player index (stub search for MVP)
- `/vault/[playerId]` - Individual player profiles
- Placeholder data for MVP, real data in Phase 2
- OpenSearch/Elasticsearch integration planned

#### AI Content Generation
Professional templates for generating:
- Trivia questions from match events
- 3 plausible distractors per question
- Player summaries from structured data
- Content validation and paraphrase guidelines

See [docs/ai-templates.md](docs/ai-templates.md) for complete LLM prompt templates.

#### SharedHero Component (Updated)
Deterministic hero image mapping:
- `main` → main-hero.jpg
- `learn-apt` → little-girl.jpg
- `learn-management` → girl-hero.jpg
- `learn-cricket` → cricket1.jpg (deterministic)
- `learn-companion` → no hero (returns null)
- All others → deterministic selection from hero1.jpg, hero2.jpg, hero3.jpg

```javascript
import SharedHero from '@/components/shared/SharedHero';

<SharedHero appName="learn-cricket">
  <h1>Your hero content</h1>
</SharedHero>
```

#### Backup Files Created
All modified files have `.bak.<timestamp>` backups (excluded from git):
- `SharedHero.js.bak.1770104823`
- `canonicalNavLinks.js.bak.1770104823`
- `README.md.bak.1770105415`

#### Testing
```bash
# Install dependencies (if not already installed)
npm install --save-dev jest

# Run tests
npm test

# Test specific suites
npm test sharedHero
npm test match
```

Test coverage includes:
- SharedHero deterministic mapping (all app mappings)
- Super Over match creation and lifecycle
- Answer submission and scoring logic
- Match state management

#### Documentation
- [AI Content Templates](docs/ai-templates.md) - LLM prompts and validation
- [TEMP_SUSPEND_AUTH Guide](docs/TEMP_SUSPEND_AUTH.md) - Auth bypass documentation
- [Test Files](tests/) - SharedHero and Match service tests

### 🎨 Universal Header & Hero Sync
**Consistent branding and hero experience across all apps!**
- **Shared Site Header** - Universal navigation header (SiteHeader) on all apps
- **Hero Manager** - Synchronized hero image selection and rendering
- **Random Image Selection** - Two random images per app from `/public/images` pool
- **Cricket Exception** - learn-cricket uses dedicated cricket1.jpg and cricket2.jpg
- **Bottom-Aligned Overlay** - Hero text positioned at bottom to avoid covering faces
- **Full-Size Hero Backgrounds** - Cover images with optimal positioning
- **Preserved Unique Content** - Each app keeps its unique landing content and features

📚 **Hero Configuration:**
```javascript
// Default image pool (used for all apps except learn-cricket)
['iiskills-image1.jpg', 'iiskills-image2.jpg', 
 'iiskills-image3.jpg', 'iiskills-image4.jpg']

// Cricket-specific images
['cricket1.jpg', 'cricket2.jpg']
```

🔧 **Usage in Your App:**
```javascript
// In _app.js - adds global header
import SiteHeader from '../../../components/shared/SiteHeader'

// In landing page - use HeroManager for hero
import Hero from '../../../components/shared/HeroManager'
<Hero appId="your-app-id">
  {/* Your overlay content */}
</Hero>
```

### 📚 Centralized Content in Supabase
**All educational content is now centralized in Supabase!**
- **Single Source of Truth** - All courses, modules, lessons, and questions in one database
- **Unified Schema** - Consistent structure across all 13+ learning apps
- **Government Jobs Content** - Complete geography, deadlines, and eligibility data
- **Trivia & Bios** - Support for cricket trivia and biographical content
- **RESTful APIs** - 6 unified endpoints for all content types
- **Easy Migration** - Automated scripts to import content from any source
- **Admin Management** - Content CRUD via Supabase dashboard and APIs
- **Future-Ready** - Extensible schema for new content types

📚 **Complete Documentation:**
- [CONTENT_CENTRALIZATION_GUIDE.md](CONTENT_CENTRALIZATION_GUIDE.md) - Complete schema and implementation guide
- [CONTENT_API_DOCUMENTATION.md](CONTENT_API_DOCUMENTATION.md) - All API endpoint documentation
- [CONTENT_MIGRATION_PLAYBOOK.md](CONTENT_MIGRATION_PLAYBOOK.md) - Step-by-step migration guide
- [CONTENT_CENTRALIZATION_SUMMARY.md](CONTENT_CENTRALIZATION_SUMMARY.md) - Implementation summary

🎯 **API Endpoints:**
- `/api/content/courses` - All courses with filtering and pagination
- `/api/content/modules` - Modules for any course
- `/api/content/lessons` - Lessons with quiz questions
- `/api/content/government-jobs` - Government job postings
- `/api/content/geography` - Hierarchical geography data
- `/api/content/trivia` - Trivia questions for all categories

### 🌍 Universal Public Content Access (CURRENT MODE)
**All content from all learn-* apps is now publicly accessible!**
- **No authentication required** - Full access to all courses, modules, and lessons
- **12+ active apps aggregated** - Content from learn-apt, learn-cricket, learn-govt-jobs, and more
- **Source attribution** - Every content item tagged with its source app and backend
- **Admin dashboard public** - Full admin interface accessible without login
- **Health monitoring** - `/api/healthz` endpoint shows complete content inventory
- **Future-proof** - Easy to add new apps and content sources

📚 **Complete Guides:**
- [PUBLIC_CONTENT_ACCESS_GUIDE.md](PUBLIC_CONTENT_ACCESS_GUIDE.md) - Complete implementation guide
- [PUBLIC_ACCESS_QUICK_REFERENCE.md](PUBLIC_ACCESS_QUICK_REFERENCE.md) - Quick reference for developers

🔧 **Configuration:**
```bash
NEXT_PUBLIC_DISABLE_AUTH=false  # Public access enabled
DEBUG_ADMIN=true                # Admin access without login
NEXT_PUBLIC_PAYWALL_ENABLED=false  # No paywall
```

**To re-enable authentication:** See [PUBLIC_CONTENT_ACCESS_GUIDE.md](PUBLIC_CONTENT_ACCESS_GUIDE.md#re-enabling-authentication)

### 🔑 Secret Password Admin Access
**Quick admin access for testing and demos without authentication!**

This feature provides an alternative way to access admin and protected content when authentication is disabled or for quick demo access.

#### How It Works

**Three Access Modes:**
1. **Local Development (`NEXT_PUBLIC_DISABLE_AUTH=true`):** 
   - Full unrestricted access to all admin and content pages
   - No authentication required at all
   - Perfect for local development and testing

2. **Online with Secret Password:**
   - When not logged in as admin, users see a password prompt
   - Enter the secret password: `iiskills123`
   - Instantly grants admin access for the session
   - Access persists until browser close or logout

3. **Online with Standard Auth:**
   - Normal authentication flow with Supabase
   - Role-based access control for admins
   - Production-ready security

#### Setup for Local Development

1. **Create or edit `.env.local` in your app directory:**
```bash
# Enable full open access for local development
NEXT_PUBLIC_DISABLE_AUTH=true
```

2. **Restart your dev server:**
```bash
npm run dev
```

3. **Access admin pages directly:**
   - All admin routes (`/admin/*`) are fully accessible
   - All content routes (`/courses`, `/modules`, etc.) are accessible
   - No password or login required

#### Setup for Online/Staging with Secret Password

1. **Set environment variables:**
```bash
# Disable open access, enable authentication
NEXT_PUBLIC_DISABLE_AUTH=false
```

2. **Access admin pages:**
   - Navigate to any admin route (e.g., `/admin`)
   - If not logged in, you'll see the secret password prompt
   - Enter the configured secret password (contact your admin for the password)
   - Admin access granted for the session

3. **The password works on all protected routes:**
   - Admin dashboard (`/admin/*`)
   - Content management pages
   - User management
   - Any page using ProtectedRoute, UserProtectedRoute, or PaidUserProtectedRoute

#### Environment Variable Configuration

The secret password can be configured via environment variable:

```bash
# Optional: Set custom secret password (defaults to 'iiskills123' for dev only)
NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=your_custom_password_here
```

**Default Password (Development Only):**
- For local development, the default password is `iiskills123`
- For staging/production, MUST set `NEXT_PUBLIC_ADMIN_SECRET_PASSWORD` to a secure value
- Never commit passwords to source control or public documentation

#### ⚠️ SECURITY WARNINGS

**CRITICAL: For Testing/Demo Only!**
- The secret password feature provides a backdoor for development and testing
- Client-side storage (localStorage/sessionStorage) can be manipulated
- **MUST be disabled or properly secured for production deployments**

**Best Practices:**
- ✅ Use `NEXT_PUBLIC_DISABLE_AUTH=true` for local development only
- ✅ Use the secret password for staging/QA environments
- ✅ Use proper authentication (Supabase) for production
- ❌ Never deploy to production with the secret password enabled
- ❌ Never use this for real user data or sensitive content

**To Disable Secret Password Access:**
- The secret password feature is always available as a fallback
- To completely disable it, you would need to modify the ProtectedRoute components
- For production, ensure `NEXT_PUBLIC_DISABLE_AUTH=false` and require proper Supabase authentication

#### Implementation Details

The secret password feature is integrated into all protected route components:
- `/components/SecretPasswordPrompt.js` - The password input UI
- `/components/ProtectedRoute.js` - Admin route protection
- `/components/UserProtectedRoute.js` - User route protection  
- `/components/PaidUserProtectedRoute.js` - Paid content protection
- `/apps/main/components/*ProtectedRoute.js` - App-specific versions

**Session Storage:**
- Password verification sets flags in `localStorage` and `sessionStorage`
- Access persists until browser close or explicit logout
- Can be cleared by calling `clearSecretAdminAccess()` utility function

#### Quick Reference

| Mode | NEXT_PUBLIC_DISABLE_AUTH | Access Method | Use Case |
|------|-------------------------|---------------|----------|
| Local Dev | `true` | Automatic | Development |
| Online Demo | `false` | Secret password: `iiskills123` | Staging/QA/Demos |
| Production | `false` | Supabase authentication | Production |


### 🔐 Multi-App Authentication System
**Seamless authentication across all 18+ apps in the ecosystem!**
- **Register once, access everywhere** - Single account works on all apps and subdomains
- **Intelligent redirects** - Users stay on the app they logged into
- **App-to-app navigation** - Navigate between apps without re-authentication
- **Session persistence** - Automatic cross-domain session management
- **App registry** - Centralized configuration for all apps
- **Easy expansion** - Add new apps to the ecosystem with minimal configuration

📚 **Complete Guides:**
- [MULTI_APP_AUTH_GUIDE.md](MULTI_APP_AUTH_GUIDE.md) - Complete multi-app authentication guide
- [SUPABASE_MULTI_APP_CONFIG.md](SUPABASE_MULTI_APP_CONFIG.md) - Supabase configuration for multi-app setup
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - Technical architecture overview

🎯 **Demo:** Visit `/multi-app-demo` to see the system in action

### 🚀 Skilling Newsletter - AI-Powered Course Announcements
**Automatically generated, engaging newsletters for every new course!**
- AI-powered content generation using GPT-4o-mini
- Millennial/Gen Z-focused tone with emojis and fun copy
- Automatically triggered when courses are published
- Sends to all newsletter subscribers via **SendGrid** (with domain authentication)
- Public archive at `/newsletter/archive`
- Admin management at `/admin/newsletters` and `/admin/courses-manage`

📚 **Complete guide:** See [SKILLING_NEWSLETTER_README.md](SKILLING_NEWSLETTER_README.md)

📧 **Email Setup:** Configure SendGrid API key and sender identity in `.env.local`

### Universal reCAPTCHA Protection
🔒 **Security across all subdomains!** A single reCAPTCHA configuration protects the entire platform:
- **One site key for all apps** - Register once at iiskills.cloud, covers all subdomains
- **Universal bot protection** - Currently used for newsletter signups; ready for auth/registration
- **Consistent security** - Same validation rules across all apps
- **Easy setup** - Configure once in Google reCAPTCHA admin, deploy everywhere

📚 **Setup Guide:** See [UNIVERSAL_RECAPTCHA_SETUP.md](UNIVERSAL_RECAPTCHA_SETUP.md) for complete configuration instructions.

### Newsletter Subscription System
📧 **Subscribe to stay updated!** All apps now include a unified newsletter subscription system:
- Newsletter signup available on every domain and subdomain
- Modal popup on initial visit (configurable intervals)
- Dedicated `/newsletter` page on all apps
- Google reCAPTCHA v3 protection against bots
- Supabase backend for email storage

### AI Assistant
🤖 **Get instant help!** A floating AI chatbot assistant is available everywhere:
- Site-aware responses based on current subdomain
- Accessible from any page
- Helpful guidance for courses, registration, and navigation
- Unobtrusive design with expandable chat window

📚 **Learn more:** See [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) for complete documentation.

### 🗄️ Standardized Multi-App Database Schema v2
**Unified data architecture for all 16+ learning apps!** Our new schema provides seamless data sharing:
- **Progress Tracking** - Track user progress across all apps uniformly
- **Certificates** - Standardized certificate issuance with verification codes
- **Subscriptions** - Centralized payment tracking (app-specific or platform-wide)
- **Analytics** - Unified event tracking and user behavior analysis
- **Content Library** - Shared resources across multiple apps
- **Apps Registry** - Centralized configuration for all learning apps

**🎯 Quick Start:**
1. After PR merge, go to [Supabase Dashboard](https://supabase.com) → SQL Editor
2. Run 3 migration files (takes ~5-10 minutes)
3. Verify with included validation script
4. Start using new features in your apps!

**📚 Complete Documentation:**
- [SUPABASE_SCHEMA_V2.md](SUPABASE_SCHEMA_V2.md) - Full schema documentation with examples
- [SCHEMA_V2_QUICK_REFERENCE.md](SCHEMA_V2_QUICK_REFERENCE.md) - Developer quick reference with TypeScript examples
- [SCHEMA_V2_MIGRATION_CHECKLIST.md](SCHEMA_V2_MIGRATION_CHECKLIST.md) - Step-by-step migration checklist
- [supabase/migrations/README.md](supabase/migrations/README.md) - Migration instructions and troubleshooting

**✨ What You Get:**
- ✅ 6 new tables with RLS security and performance indexes
- ✅ 8 helper functions for common operations
- ✅ 16 apps pre-seeded in registry
- ✅ All migrations are idempotent (safe to re-run)
- ✅ No manual data entry required!

### 🔍 Content Quality & Validation Tools (NEW!)
**Automated content validation and quality assurance for all learning apps!**
- **Universal Content Schema** - Standardized JSON schema for courses, modules, and lessons
- **Content Validator** - Validates all content files for required fields and schema compliance
- **Orphan Checker** - Detects orphaned content and broken parent-child links
- **Duplicate ID Detection** - Finds duplicate IDs across all apps
- **Auto App Registry** - Automatically discovers and registers new apps
- **CI Integration** - Run validators in CI/CD pipelines

📚 **Quick Commands:**
```bash
# Validate all content files
npm run validate-content

# Check for orphans and broken links
npm run check-orphans

# Generate app registry from apps/
npm run generate:registry

# Validate specific app
npm run validate-content -- --app=learn-ai --verbose
npm run check-orphans -- --app=learn-cricket
```

📋 **Content Structure:**
Each learning app maintains content in standardized directories:
```
apps/learn-*/
├── content/
│   ├── courses/    # Course definitions (JSON)
│   ├── modules/    # Module definitions (JSON)
│   └── lessons/    # Lesson content (JSON)
```

📖 **Complete Guides:**
- [ADDING_NEW_APP.md](ADDING_NEW_APP.md) - Complete guide to adding new learning apps
- [ROUTING_CONFIGURATION.md](ROUTING_CONFIGURATION.md) - Domain routing and Nginx/Traefik setup
- [lib/contentSchema.js](lib/contentSchema.js) - Content schema reference

🔧 **Admin API:**
- `/api/admin/check-orphans` - REST API for orphan detection (supports `?app=learn-ai` filter)

## 🌟 New to iiskills.cloud?

**See our [ONBOARDING.md](ONBOARDING.md) guide to get started!**

Learn how to:
- Create your account once and access all apps
- Use universal login across the entire platform
- Choose from multiple sign-in methods
- Navigate between different learning modules seamlessly

## Project Structure

This is a **Yarn v4 (Berry) monorepo** with all applications organized in the `apps/` directory.

### Monorepo Structure

```
iiskills-cloud/
├── apps/                          # All active workspace applications
│   ├── main/                      # Main iiskills.cloud website (app.iiskills.cloud)
│   │                              # Contains universal admin dashboard
│   ├── learn-ai/                  # AI learning module
│   ├── learn-apt/                 # Aptitude assessment
│   ├── learn-chemistry/           # Chemistry learning
│   ├── learn-cricket/             # Cricket knowledge (FREE)
│   ├── learn-geography/           # Geography learning
│   ├── learn-govt-jobs/           # Government jobs prep
│   ├── learn-leadership/          # Leadership development
│   ├── learn-management/          # Management skills
│   ├── learn-math/                # Mathematics
│   ├── learn-physics/             # Physics mastery
│   ├── learn-pr/                  # Public Relations
│   └── learn-winning/             # Success strategies
├── apps-backup/                   # Archived legacy apps (not deployed)
│   ├── admin/                     # Legacy admin app
│   ├── coming-soon/               # Legacy coming soon page
│   ├── iiskills-admin/            # Legacy admin dashboard
│   ├── learn-data-science/        # Archived app
│   ├── learn-ias/                 # Archived app
│   ├── learn-jee/                 # Archived app
│   └── learn-neet/                # Archived app
├── packages/                       # Shared packages
│   └── core/                      # Core utilities
├── components/                     # Shared components
├── lib/                           # Shared libraries
├── utils/                         # Shared utilities
└── package.json                   # Root package.json

```

### Building and Running Apps

The monorepo uses Yarn workspaces for dependency management. All apps are configured as workspaces and can be managed from the root.

**Install dependencies:**
```bash
yarn install
```

**Build all apps:**
```bash
yarn build
```

**Run a specific app in development mode:**
```bash
cd apps/main && yarn dev             # Main app (with universal admin)
cd apps/learn-ai && yarn dev         # Learn AI app
cd apps/learn-chemistry && yarn dev  # Learn Chemistry app
# ... etc
```

**List all workspaces:**
```bash
yarn workspaces list
```

## 🎓 Production Applications

This repository contains **13 production-ready Next.js applications** (main + 12 learning apps):

### Main Platform
- **Main App** (`apps/main/`) - The primary iiskills.cloud website with universal admin dashboard

### Active Learning Apps (Production)
- **Learn-AI** (`apps/learn-ai/`) - Artificial Intelligence fundamentals
- **Learn-Apt** (`apps/learn-apt/`) - Aptitude assessment with AI-powered career guidance
- **Learn-Chemistry** (`apps/learn-chemistry/`) - Chemistry mastery with comprehensive curriculum
- **Learn-Cricket** (`apps/learn-cricket/`) - Cricket knowledge and strategies (FREE)
- **Learn-Geography** (`apps/learn-geography/`) - Geography and world exploration
- **Learn-Government-Jobs** (`apps/learn-govt-jobs/`) - Government job exam preparation
- **Learn-Leadership** (`apps/learn-leadership/`) - Leadership development
- **Learn-Management** (`apps/learn-management/`) - Management and business skills
- **Learn-Math** (`apps/learn-math/`) - Mathematics learning module
- **Learn-Physics** (`apps/learn-physics/`) - Physics mastery with structured curriculum
- **Learn-PR** (`apps/learn-pr/`) - Public Relations and communication
- **Learn-Winning** (`apps/learn-winning/`) - Success strategies and winning mindset

### Archived Applications
Legacy and inactive apps have been moved to `apps-backup/` and are not deployed:
- `admin/` - Legacy standalone admin interface (now integrated into main app)
- `coming-soon/` - Legacy placeholder page
- `iiskills-admin/` - Legacy admin dashboard
- `learn-data-science/`, `learn-ias/`, `learn-jee/`, `learn-neet/` - Archived learning modules

Each active app can be deployed independently on different subdomains while sharing authentication.

## 🚀 Multi-App Subdomain Deployment

**NEW: Automated deployment to VPS with subdomain routing!**

Deploy all learning apps to their respective subdomains on Hostinger VPS with one command:

```bash
# Verify DNS configuration
./verify-subdomain-dns.sh

# Deploy everything (build, PM2, Nginx, SSL)
sudo ./deploy-subdomains.sh

# Monitor app health
./monitor-apps.sh
```

**Features:**
- ✅ Automated DNS verification for all subdomains
- ✅ Builds and deploys all apps with PM2
- ✅ Auto-configures Nginx reverse proxies
- ✅ Sets up SSL certificates with Let's Encrypt
- ✅ Health monitoring dashboard
- ✅ Idempotent and safe to re-run

**Documentation:**
- 📚 **Full Guide:** [MULTI_APP_DEPLOYMENT_GUIDE.md](MULTI_APP_DEPLOYMENT_GUIDE.md)
- 📋 **Quick Reference:** [DEPLOYMENT_QUICK_REFERENCE.md](DEPLOYMENT_QUICK_REFERENCE.md)

## Local Port Map

All active production applications have been assigned unique ports. See [PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md) for full details.

| Port | Application | Status | Description |
|------|-------------|--------|-------------|
| 3000 | **iiskills-main** | ✅ Active | Main website with universal admin dashboard |
| 3001 | **learn-ai** | ✅ Active | Artificial Intelligence fundamentals |
| 3002 | **learn-apt** | ✅ Active | Aptitude assessment |
| 3005 | **learn-chemistry** | ✅ Active | Chemistry mastery |
| 3009 | **learn-cricket** | ✅ Active | Cricket knowledge (FREE) |
| 3011 | **learn-geography** | ✅ Active | Geography and world exploration |
| 3013 | **learn-govt-jobs** | ✅ Active | Government job exam preparation |
| 3015 | **learn-leadership** | ✅ Active | Leadership development |
| 3016 | **learn-management** | ✅ Active | Management and business skills |
| 3017 | **learn-math** | ✅ Active | Mathematics learning |
| 3020 | **learn-physics** | ✅ Active | Physics mastery |
| 3021 | **learn-pr** | ✅ Active | Public Relations |
| 3022 | **learn-winning** | ✅ Active | Success strategies |

**Archived apps** (in apps-backup/): admin, coming-soon, iiskills-admin, learn-data-science, learn-ias, learn-jee, learn-neet

**Run all active apps concurrently:**
```bash
yarn workspaces foreach -A run dev
```

All apps will start on their assigned ports without conflicts.

## Getting Started

### Quick Environment Setup

**⚠️ CRITICAL:** This repository includes pre-configured `.env.local` files with placeholder values in the root and all learning modules. **You MUST update these with your actual Supabase and reCAPTCHA credentials before running any app**, or you will encounter runtime errors.

**Required Actions:**
1. Get your Supabase credentials from [supabase.com](https://supabase.com) (Project Settings → API)
2. Get your reCAPTCHA keys from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
3. Update the placeholder values in all `.env.local` files:
   - Replace `your-project-url-here` with your actual `NEXT_PUBLIC_SUPABASE_URL`
   - Replace `your-anon-key-here` with your actual `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Replace `your-recaptcha-site-key-here` with your actual `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
   - Replace `your-recaptcha-secret-key-here` with your actual `RECAPTCHA_SECRET_KEY`
4. Ensure all variables have non-empty, valid values in every `.env.local` file

**Universal reCAPTCHA Setup:**
- Register a **SINGLE** site key for `iiskills.cloud` (this covers ALL subdomains)
- Choose reCAPTCHA v3 for invisible verification
- Add domain: `iiskills.cloud` in the reCAPTCHA admin console
- Use the **SAME** site key and secret key across **ALL** apps

**Verification:** Run `./ensure-env-files.sh` to check if all environment files are properly configured.

**Option 1: Automated Setup (Recommended)**

```bash
# Run the setup script to configure all apps at once
./setup-env.sh
```

The script will:
- Prompt you for your Supabase credentials
- Configure the main app
- Configure all learning modules automatically
- Ensure all apps use the same credentials

**Option 2: Manual Setup**

See **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** for detailed manual setup instructions.

### Main App

#### 1. Install dependencies

```bash
npm install
```

#### 2. Run locally

```bash
npm run dev
```

Site will be available at `http://localhost:3000`

#### 3. Build for production

```bash
npm run build
npm start
```

### Learning Modules

All learning modules follow the same structure. Each has its assigned port (see Local Port Map above):

- [learn-apt/README.md](learn-apt/README.md) - Port 3001
- [learn-ai/README.md](learn-ai/README.md) - Port 3002
- [learn-chemistry/README.md](learn-chemistry/README.md) - Port 3003
- [learn-data-science/README.md](learn-data-science/README.md) - Port 3004
- [learn-geography/README.md](learn-geography/README.md) - Port 3005
- [learn-govt-jobs/README.md](learn-govt-jobs/README.md) - Port 3006
- [learn-ias/README.md](learn-ias/README.md) - Port 3007
- [learn-jee/README.md](learn-jee/README.md) - Port 3008
- [learn-leadership/README.md](learn-leadership/README.md) - Port 3009
- [learn-management/README.md](learn-management/README.md) - Port 3010
- [learn-math/README.md](learn-math/README.md) - Port 3011
- [learn-neet/README.md](learn-neet/README.md) - Port 3012
- [learn-physics/README.md](learn-physics/README.md) - Port 3013
- [learn-pr/README.md](learn-pr/README.md) - Port 3014
- [learn-winning/README.md](learn-winning/README.md) - Port 3015
- [learn-cricket/README.md](learn-cricket/README.md) - Port 3016

Quick start for any module:
```bash
cd learn-{module-name}
npm install
npm run dev
```

**Learning Modules Overview:** Visit `/learn-modules` on the main app to see all available modules.

## Deployment

### Automated Deployment

Use the deployment script for safe, automated deployments:

```bash
cd ~/iiskills-cloud
./scripts/deploy.sh
```

This script will:
1. Pull latest code
2. Install dependencies
3. Test all app builds
4. Restart PM2
5. Health check all apps

### Detached Tmux Deployment (Recommended for Remote Servers)

For long-running deployments on remote servers, use the detached tmux workflow:

```bash
cd ~/iiskills-cloud
./scripts/deploy-all.sh
```

**Benefits:**
- ✅ Runs deployment in a detached tmux session
- ✅ Safe from SSH disconnections
- ✅ Can monitor progress anytime
- ✅ Full deployment logs saved to `/tmp/deploy-all-{timestamp}.log`

**Monitor the deployment:**
```bash
# Attach to the running deployment session
tmux attach-session -t deploy_all

# Detach without stopping (press these keys)
# Ctrl+b, then d
```

**View logs:**
```bash
# List available log files
ls -lt /tmp/deploy-all-*.log | head -5

# Tail the latest log
tail -f /tmp/deploy-all-*.log
```

**Troubleshooting:**
```bash
# List all tmux sessions
tmux list-sessions

# Kill a stuck session
tmux kill-session -t deploy_all

# Re-run deployment
./scripts/deploy-all.sh
```

### Manual Deployment

If you need to deploy manually:

```bash
git pull origin main
yarn install
./scripts/pre-deploy-check.sh  # Verify builds
pm2 restart all
pm2 save
```

### CI/CD

All pull requests are automatically tested by GitHub Actions. PRs with build failures cannot be merged.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines and [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for the complete deployment checklist.

### Production Deployment with PM2

**Recommended:** Use PM2 process manager to run all applications in production. See [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) for comprehensive instructions.

#### Automatic Entry Point Detection

The `ecosystem.config.js` file is **automatically generated** by scanning the repository for Next.js applications and detecting their entry points. This ensures reliable startup on any fresh clone without manual configuration.

To regenerate the PM2 configuration:
```bash
npm run generate-pm2-config
```

To validate the configuration:
```bash
npm run validate-pm2-config
```

See [PM2_AUTO_DETECTION.md](PM2_AUTO_DETECTION.md) for details about the auto-detection system.

#### Quick start:
```bash
# Install dependencies and build all apps
npm install && npm run build
for dir in learn-*/; do (cd "$dir" && npm install && npm run build); done

# Start all apps with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

The `ecosystem.config.js` automatically configures all 18 applications with:
- Proper port assignments (auto-detected from package.json)
- Cross-platform compatibility
- Automatic conflict resolution
- Complete logging configuration

### Other Deployment Options

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Vercel deployment
- VPS deployment with Nginx and PM2
- Docker deployment
- Cross-subdomain authentication setup
- SSL configuration

### Quick Deploy to Hostinger VPS

Copy this repo/files to your VPS.  
Set up Node.js, Nginx (reverse proxy to ports 3000/3001), and SSL (using Certbot).

#### Example Nginx config:

```nginx
server {
    listen 80;
    server_name iiskills.cloud www.iiskills.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

It is recommended to run your site as a service using **PM2** for reliability and easy management. See [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) for complete instructions.

## Shared Components

Shared components used across multiple apps are located in `/components/shared/`:

- **SharedNavbar** - Navigation bar with dual branding (iiskills + AI Cloud)

These can be imported by any app in the monorepo.

## Customization

- Logos: Replace `/public/images/iiskills-logo.png` and `/public/images/ai-cloud-logo.png` with your own logo files. These are used universally across all domains and subdomains.
- Colors: Edit `tailwind.config.js` to tune palette.
- Content: Edit pages as needed (Home, Apps, About, Contact, etc).
- Add new apps to `apps.js` or create new Next.js API routes/apps as needed.

## Authentication

### 🌟 Registration-First Universal Authentication System

**Important: Registration Required Before Access**

iiskills.cloud uses a **registration-first workflow** with a **unified authentication system**:

- 📝 **Registration Required:** You must create an account before accessing any learning content
- ✅ **Register ONCE:** Create an account on **any** iiskills.cloud app (main site, Learn-Apt, Learn-JEE, Learn-NEET, etc.)
- ✅ **Universal Access:** Automatically get access to **all** other apps and subdomains
- ✅ **Same Credentials:** Use the **same login** credentials everywhere
- ✅ **Shared Session:** Your session works across **all** `*.iiskills.cloud` domains

**Registration-First Workflow:**
1. Visit any iiskills.cloud app landing page
2. Click "Register Free Account" to create your account
3. Complete the registration form (simplified on subdomains, full on main site)
4. Confirm your email address
5. Sign in and access all learning content across all apps

**Example:**
1. Try to access `learn-apt.iiskills.cloud/learn`
2. Automatically redirected to `/register` (registration required)
3. Complete registration once
4. Now access `iiskills.cloud`, `learn-jee.iiskills.cloud`, or any other app with the same credentials
5. No need to register again!

### Multiple Sign-In Options

All apps support three convenient authentication methods:

1. **Magic Link (Recommended)** - Passwordless email authentication
   - Enter your email address
   - Receive a secure sign-in link via email
   - Click the link to sign in automatically
   - No password required!

2. **Google OAuth** - Sign in with your Google account
   - One-click authentication
   - Uses your existing Google account
   - Fast and secure

3. **Email & Password** - Traditional authentication
   - Available as a fallback option
   - Use if you prefer password-based login

**All authentication methods work across every app in the iiskills.cloud ecosystem!**

### Forgot Your Password?

Don't worry! You have two easy options:

1. **Use Magic Link** - Simply click "Use magic link instead" on the login page and enter your email. You'll receive a sign-in link that works without a password.

2. **Use Google Sign-In** - If you previously signed up with Google, just click "Continue with Google" to sign in.

### For Email-Only Users

If you prefer to sign in without using passwords:

1. Always choose the **Magic Link** option on the login page
2. Enter your email address
3. Check your email inbox for the secure sign-in link
4. Click the link to access your account instantly

The magic link is valid for a limited time and can only be used once for security.

### Admin Access

Admin users can access the admin dashboard at `/admin/login` using any of the three sign-in methods. Admin access requires:

- A valid user account with admin privileges
- Admin role assigned in the Supabase user metadata
- Access is validated on every request for security

**Note:** Admin login pages are not shown in public navigation for security reasons. Only authenticated admin users can see admin dashboard links.

### Key Features

- **Single Sign-On (SSO)** - Login once, access all subdomains
- **Role-Based Access** - Admin access controlled by Supabase user metadata
- **Secure Admin Access** - Admin section accessible only via direct URL (`/admin`), not exposed in navigation
- **Consistent Navigation** - SharedNavbar component used across all apps
- **No Hardcoded Credentials** - All authentication validated against Supabase backend

### Setup Supabase

To enable authentication features:

1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key from project settings
3. Configure Google OAuth provider in Supabase dashboard (Authentication > Providers)
4. Enable email authentication and magic links in Supabase settings
5. Create `.env.local` in each app directory with your credentials
6. Configure cookie domain to `.iiskills.cloud` for cross-subdomain auth

**🔧 If Google sign-in doesn't work**: See [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) for a 5-minute fix guide, or run `./google-oauth-check.sh` to diagnose issues.

See [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) for detailed setup instructions.

**Important:** See [SUPABASE_CONFIGURATION.md](SUPABASE_CONFIGURATION.md) for the complete guide on configuring Supabase environment variables across all subdomains.

See [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) for complete navigation and authentication documentation.

## Documentation

### For Users
- [ONBOARDING.md](ONBOARDING.md) - **Getting started guide for new users**

### For Developers
- [CONTRIBUTING.md](CONTRIBUTING.md) - **🤖 Contributing guidelines (includes AI agent handover practices)**
- [DEV_AI_LOG.md](DEV_AI_LOG.md) - **🤖 AI agent session log for continuity and handover**
- [SUPABASE_SCHEMA_V2.md](SUPABASE_SCHEMA_V2.md) - **🆕 Complete Schema v2 documentation (database tables, functions, examples)**
- [SCHEMA_V2_QUICK_REFERENCE.md](SCHEMA_V2_QUICK_REFERENCE.md) - **🆕 Developer quick reference with TypeScript code examples**
- [SCHEMA_V2_MIGRATION_CHECKLIST.md](SCHEMA_V2_MIGRATION_CHECKLIST.md) - **🆕 Step-by-step migration checklist**
- [supabase/migrations/README.md](supabase/migrations/README.md) - **🆕 Migration instructions and troubleshooting**
- [UNIVERSAL_RECAPTCHA_SETUP.md](UNIVERSAL_RECAPTCHA_SETUP.md) - **Universal reCAPTCHA configuration guide**
- [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) - **Complete guide to Newsletter and AI Assistant system**
- [LEARN_APPS_INTEGRATION_GUIDE.md](LEARN_APPS_INTEGRATION_GUIDE.md) - **Guide for integrating features into learn-* apps**
- [SUPABASE_CONFIGURATION.md](SUPABASE_CONFIGURATION.md) - **Complete Supabase configuration guide (MUST READ)**
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - **Complete guide to universal authentication system**
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md) - Authentication setup and troubleshooting
- [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) - **⚡ 5-minute guide to fix Google sign-in issues**
- [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md) - **Comprehensive Google sign-in troubleshooting**
- [CALLBACK_URLS_REFERENCE.md](CALLBACK_URLS_REFERENCE.md) - Complete list of callback URLs for all domains/subdomains
- [NAVIGATION_AUTH_GUIDE.md](NAVIGATION_AUTH_GUIDE.md) - **Navigation and authentication flow guide**
- [DEPLOYMENT.md](DEPLOYMENT.md) - Comprehensive deployment guide
- [MODULE_MIGRATION_SUMMARY.md](MODULE_MIGRATION_SUMMARY.md) - Learning modules migration details
- [TESTING_GUIDE.md](TESTING_GUIDE.md) - Testing documentation
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Implementation details
- Individual module READMEs in each `learn-*` directory

### 🔧 Troubleshooting Tools

- **Google OAuth Quick Fix**: See [GOOGLE_OAUTH_QUICK_FIX.md](GOOGLE_OAUTH_QUICK_FIX.md) (5-minute guide)
- **Google OAuth Verification Script**: Run `./google-oauth-check.sh` to verify Google sign-in configuration
- **Comprehensive Troubleshooting**: See [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md) for detailed debugging

## 📚 Developer Docs
- [Common Integration Plan for Monorepo Apps](./common-integration-plan.md)

## Questions/Support

Contact: info@iiskills.cloud

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

© 2026 AI Cloud Enterprises
