# Learn Apt - Free Aptitude Testing Platform

A comprehensive aptitude testing application built with Next.js, providing 8 selectable tests across 5 cognitive domains plus general-purpose and mixed tests.

## Features

### Test Types (8 modules, 8 tests)

#### Domain Tests

- **Numerical Ability** (`/tests/numerical`): Arithmetic, percentages, ratios (~15 min, 8 questions)
- **Logical Reasoning** (`/tests/logical`): Pattern recognition, syllogisms (~15 min, 8 questions)
- **Verbal Ability** (`/tests/verbal`): Grammar, reading comprehension (~15 min, 8 questions)
- **Spatial / Abstract** (`/tests/spatial`): 3D figures, rotations, spatial patterns (~15 min, 8 questions)
- **Data Interpretation** (`/tests/data-interpretation`): Charts, tables, data insights (~15 min, 8 questions)

#### Mixed / Rapid Test

- **Quick-Fire** (`/tests/quick-fire`): 5-minute timed dash across all domains (15 questions)

#### General Purpose Tests

- **General Purpose – Short** (`/tests/general-short`): Quick 7-question mixed assessment (~10 min)
- **General Purpose – Elaborate** (`/tests/general-elaborate`): Comprehensive 120-question assessment (~90 min)

### Key Features

- 💯 100% Free - No subscriptions or hidden fees
- 📊 Detailed Analytics - Comprehensive performance reports
- 🚀 Progress Tracking - Monitor improvement over time
- 🔐 Secure Authentication - Supabase-powered user accounts
- 📱 Responsive Design - Works on all devices

## Tech Stack

- **Framework**: Next.js 16.1.1
- **React**: 19.2.3
- **Styling**: Tailwind CSS 3.4.18
- **Authentication**: Supabase
- **Deployment Port**: 3002

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 4+

### Installation

1. Install dependencies:

```bash
cd apps/learn-apt
yarn install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3002](http://localhost:3002) in your browser

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-apt
```

## Project Structure

```
apps/learn-apt/
├── pages/
│   ├── test/
│   │   ├── short.js         # General Purpose – Short (7 questions, backwards-compat route)
│   │   ├── elaborate.js     # General Purpose – Elaborate (120 questions, backwards-compat route)
│   │   ├── diagnostic.js    # 15-question diagnostic across 3 dimensions
│   │   └── quick-fire.js    # Quick-Fire mixed test (15 questions)
│   ├── tests/
│   │   ├── [domain].js      # Dynamic domain test (numerical/logical/verbal/spatial/data-interpretation)
│   │   ├── quick-fire.js    # Redirect → /test/quick-fire
│   │   ├── general-short.js # Redirect → /test/short
│   │   └── general-elaborate.js # Redirect → /test/elaborate
│   ├── index.js             # Landing page (All 8 tests shown as cards)
│   ├── login.js             # Login page
│   ├── register.js          # Registration page
│   ├── tests.js             # Test selection dashboard
│   ├── terms.js             # Terms of service
│   └── privacy.js           # Privacy policy
├── lib/
│   ├── questionBank.js      # QUESTION_BANK with 5 cognitive domains (8 questions each)
│   └── supabaseClient.js    # Supabase configuration
├── styles/
│   └── globals.css          # Global styles
└── public/                  # Static assets
```

## Available Scripts

- `yarn dev` - Start development server on port 3002
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint

## Features in Detail

### General Purpose – Short

- 7 carefully curated questions
- 10-minute time limit
- Covers basic aptitude skills
- Instant results and scoring
- Great for quick practice

### General Purpose – Elaborate

- 120 comprehensive questions
- 90-minute time limit
- Multiple categories: Math, Patterns, Logic
- Detailed performance analysis
- In-depth skill assessment

### Domain Tests (Numerical / Logical / Verbal / Spatial / Data Interpretation)

- 8 targeted questions per domain
- 15-minute time limit
- Domain-specific skill assessment
- Instant scoring with career connections

### Quick-Fire

- 15 mixed questions across all domains
- 5-minute rapid-fire format
- Get your complete Aptitude Signature

### User Experience

- Clean, modern interface
- Progress tracking during tests
- Question navigation
- Time management tools
- Responsive design for all devices

## Authentication

The app uses Supabase for authentication, providing:

- Email/password registration and login
- Secure session management
- Cross-subdomain authentication support
- User profile management

## Deployment

### Development

```bash
yarn dev
```

### Production

```bash
yarn build
yarn start
```

The app runs on port 3002 as defined in `package.json`.

## Contributing

1. Follow the existing code style
2. Test your changes thoroughly
3. Update documentation as needed
4. Submit pull requests to the main branch

## License

Part of the iiskills-cloud monorepo.

## Support

For issues or questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ for free aptitude testing
