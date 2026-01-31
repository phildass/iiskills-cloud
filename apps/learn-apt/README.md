# Learn Apt - Free Aptitude Testing Platform

A comprehensive aptitude testing application built with Next.js, providing both quick assessments and elaborate testing options.

## Features

### Test Types
- **Short Test**: Quick 7-question assessment (~10 minutes)
- **Elaborate Test**: Comprehensive 120-question assessment (~90 minutes)

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
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-apt
```

## Project Structure

```
apps/learn-apt/
├── pages/
│   ├── test/
│   │   ├── short.js         # Short test (7 questions)
│   │   └── elaborate.js     # Elaborate test (120 questions)
│   ├── index.js             # Landing page
│   ├── login.js             # Login page
│   ├── register.js          # Registration page
│   ├── tests.js             # Test selection dashboard
│   ├── terms.js             # Terms of service
│   └── privacy.js           # Privacy policy
├── lib/
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

### Short Test
- 7 carefully curated questions
- 10-minute time limit
- Covers basic aptitude skills
- Instant results and scoring
- Great for quick practice

### Elaborate Test
- 120 comprehensive questions
- 90-minute time limit
- Multiple categories: Math, Patterns, Logic
- Detailed performance analysis
- In-depth skill assessment

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
