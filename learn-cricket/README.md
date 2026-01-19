# Cricket Know-All

Master cricket knowledge, history, strategies, and become a cricket expert.

## About

Cricket Know-All is part of the iiskills.cloud learning platform, providing comprehensive cricket education including:

- Cricket fundamentals and rules
- Batting and bowling techniques
- Match strategies and tactics
- Cricket history and legends
- Statistics and analysis

## Features

- ✅ Universal authentication (works with all iiskills.cloud apps)
- ✅ Comprehensive cricket learning modules
- ✅ Interactive content and assessments
- ✅ Progress tracking
- ✅ AI-powered assistance

## Development

This is a Next.js application that runs on port 3016.

### Prerequisites

- Node.js 18+
- Yarn or npm

### Setup

1. Copy environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update `.env.local` with Supabase credentials (use same credentials as main app)

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Run development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3016](http://localhost:3016)

### Build for Production

```bash
npm run build
npm run start
```

## Authentication

This app uses the universal authentication system shared across all iiskills.cloud apps:

- Users can register once and access all apps
- Sessions work across all subdomains
- Uses Supabase for authentication backend

See `/components/shared/UniversalLogin.js` and `/components/shared/UniversalRegister.js` for implementation details.

## Integration

Part of the iiskills.cloud monorepo. Shares:
- Universal authentication components
- Shared navbar and footer
- Common utilities and styling

## License

Copyright © 2026 Indian Institute of Professional Skills Development
