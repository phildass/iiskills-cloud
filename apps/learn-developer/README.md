# Learn Developer - Web Developer Bootcamp

A comprehensive web development course platform built with Next.js as part of the iiskills-cloud monorepo.

## Overview

The **Web Developer Bootcamp** is designed to transform beginners into proficient web developers. The course covers full-stack development from HTTP fundamentals to deployment and DevOps.

## Course Structure

### 10 Comprehensive Modules

1. **The Web's DNA**: HTTP, DNS, and Request/Response
2. **Structural Integrity**: Semantic HTML5 & SEO
3. **Visual Artistry**: Modern CSS (Grid/Flexbox/Variables)
4. **The Scripting Engine**: JavaScript Fundamentals (Logic/Loops)
5. **Asynchronous Flows**: DOM, Promises, and Fetch API
6. **Component Architecture**: React.js Fundamentals & State
7. **Advanced UI Logic**: React Hooks (useEffect, useContext)
8. **Server-Side Command**: Node.js & Express API Design
9. **Persistent Data**: SQL vs. NoSQL (PostgreSQL/MongoDB)
10. **The DevOps Finish**: Deployment, JWT Security, and CI/CD

## Features

### Educational Content
- **300-word Deep Dive Lessons**: Each module includes comprehensive lessons with high-impact analogies
- **Clean Code Labs**: Practical, industry-standard code examples using ES6+ and functional React
- **Rapid-Fire Tests**: 5 questions per module with instant transitions

### UX Flow
- **Automated Testing**: Every module ends with a rapid-fire test
- **Instant Progression**: Clicking an answer automatically advances to the next question
- **Smart Certification**:
  - < 30%: Fail - Review lessons required
  - 30% - 70%: Pass - Certificate of Completion
  - \> 90%: Honors - Certificate of Excellence

### Technical Features
- Built with Next.js 16+ and React 19
- Tailwind CSS for styling
- Supabase for authentication (optional)
- Responsive design
- Server-side rendering support

## Development

### Prerequisites
- Node.js 18+
- Yarn 4+

### Installation

```bash
# From repository root
cd apps/learn-developer

# Install dependencies
yarn install
```

### Running Locally

```bash
# Development mode (port 3024)
yarn dev

# Production build
yarn build

# Start production server
yarn start
```

Visit `http://localhost:3024` to see the app.

### Environment Variables

Copy `.env.local.example` to `.env.local` and configure:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App Configuration
NEXT_PUBLIC_APP_ID=learn-developer
NEXT_PUBLIC_SITE_URL=http://localhost:3024
NEXT_PUBLIC_DISABLE_AUTH=false  # Set to true for development without auth
```

## Project Structure

```
learn-developer/
├── components/          # React components
│   ├── Footer.js       # Footer component
│   └── RapidFireQuiz.js # Quiz component with auto-advance
├── lib/                # Utilities and data
│   ├── curriculumData.js    # All 10 modules with lessons, code, tests
│   └── supabaseClient.js    # Authentication client
├── pages/              # Next.js pages
│   ├── _app.js        # App wrapper
│   ├── index.js       # Landing page
│   ├── curriculum.js  # Module listing
│   ├── register.js    # Registration page
│   └── modules/       # Dynamic module pages
│       └── [moduleId]/
│           └── lesson.js
├── public/            # Static assets
├── styles/            # Global styles
│   └── globals.css
└── package.json       # Dependencies and scripts
```

## Curriculum Data

All course content is stored in `lib/curriculumData.js`, including:
- Module metadata (title, description, difficulty, duration)
- 300-word lessons with analogies
- Code examples with syntax highlighting
- 5-question rapid-fire tests
- Skills metadata for certificates
- Certification messages

## Testing System

The rapid-fire quiz system:
1. Displays one question at a time
2. Automatically advances on answer selection (500ms delay for visual feedback)
3. Calculates scores and determines certification level
4. Provides encouraging feedback based on performance

## Certification Logic

```javascript
Score < 30%   → Fail - Review lessons
Score 30-70%  → Pass - Certificate of Completion
Score > 90%   → Honors - Certificate of Excellence
```

## Deployment

### Port Assignment
- Development: `3024`
- Production: Configured via PM2

### Production Checklist
- [ ] Environment variables configured
- [ ] Supabase auth URLs updated
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] PM2 configuration updated

## Contributing

Follow the monorepo guidelines in the root `CONTRIBUTING.md`.

## License

Part of the iiskills-cloud monorepo. See root LICENSE file.

## Support

For questions or issues:
- Check the main repository documentation
- Review the ADDING_NEW_APP.md guide
- Contact the development team

---

**Built with ❤️ by the iiskills team**
