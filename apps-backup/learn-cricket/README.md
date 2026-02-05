# Cricket Universe - World Cup Cricket Learning Platform

A comprehensive cricket learning platform featuring World Cup content, daily challenges, and AI-powered features.

## 🏏 World Cup Launch (Feb 7, 2026)

Cricket Universe includes a special World Cup mode with exclusive features for the ICC Cricket World Cup 2026.

### World Cup Features

- **World Cup Landing Page** (`/world-cup`) - Tournament hub with fixtures, standings, and live match info
- **Daily Strike** - 5-10 World Cup trivia questions daily
- **Super Over** - 60-second rapid-fire trivia matches vs bot
- **Live Match Stats** - Real-time scores and "Did You Know?" facts (when enabled)
- **AI-Generated Content** - Player bios, match previews, trivia (with content filtering)
- **Content Moderation** - Automated filtering of controversial content

## 🎯 Overview

Learn Cricket is a self-paced online course platform designed to take students from AI fundamentals to monetization strategies. The platform includes:

- **10 Comprehensive Modules** - Beginner to Advanced levels
- **100 Detailed Lessons** - Each with quiz assessments
- **Progressive Learning** - Pass quizzes to unlock next lessons
- **Final Certification Exam** - 20 questions, pass with 13+ correct
- **5 Case Studies** - Real-world AI applications
- **5 Skill Simulators** - Hands-on practice tools
- **AI News Monitor** - Stay updated with latest AI developments
- **Jobs Board** - AI career opportunities in India

## 🚀 Quick Start

### World Cup Quick Setup

```bash
# Navigate to the app directory
cd apps/learn-cricket

# Install dependencies
yarn install

# Create environment file with World Cup features enabled
cp .env.local.example .env.local

# Edit .env.local and set:
# ENABLE_WORLD_CUP_MODE=true
# ENABLE_DAILY_STRIKE=true
# ENABLE_SUPER_OVER=true

# Run development server
yarn dev
```

The app will be available at:
- Main: `http://localhost:3009`
- World Cup: `http://localhost:3009/world-cup`
- Daily Strike: `http://localhost:3009/daily-strike`
- Super Over: `http://localhost:3009/super-over`

### Environment Variables

#### Core Configuration
```bash
# Supabase (Optional)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
NEXT_PUBLIC_DISABLE_AUTH=false

# App Settings
NEXT_PUBLIC_SITE_URL=http://localhost:3009
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-cricket
```

#### World Cup Feature Flags
```bash
# Enable World Cup features (default: true for Feb 7 launch)
ENABLE_WORLD_CUP_MODE=true

# Enable live stats (requires CRICKET_API_KEY)
ENABLE_LIVE_STATS=false

# Enable AI/LLM enrichment (requires LLM_API_KEY)
ENABLE_LLM=false

# Admin features (disable in production)
ADMIN_SETUP_MODE=false
TEMP_SUSPEND_AUTH=false

# Daily Strike & Super Over
ENABLE_DAILY_STRIKE=true
ENABLE_SUPER_OVER=true
```

#### Bot Configuration (Super Over)
```bash
# Bot difficulty settings
BOT_ACCURACY_EASY=0.5        # 50% correct answers
BOT_DELAY_MS_EASY=2000       # 2 second delay

BOT_ACCURACY_MEDIUM=0.7      # 70% correct answers
BOT_DELAY_MS_MEDIUM=1500     # 1.5 second delay

BOT_ACCURACY_HARD=0.9        # 90% correct answers
BOT_DELAY_MS_HARD=1000       # 1 second delay
```

#### Optional API Keys
```bash
# Cricket data provider (for live stats)
CRICKET_API_KEY=your-cricket-api-key-here

# LLM provider (for AI content generation)
LLM_API_KEY=your-llm-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

# Other services
NEWS_API_KEY=your-newsapi-key-here
RESEND_API_KEY=your-resend-key-here
```

### Prerequisites

- Node.js 18+ and Yarn
- Supabase account (optional - works in SUSPENDED mode)
- Environment variables configured

### Installation

```bash
# Navigate to the app directory
cd apps/learn-cricket

# Install dependencies
yarn install

# Create environment file
cp .env.local.example .env.local

# Generate seed data
yarn seed

# Run development server
yarn dev
```

The app will be available at `http://localhost:3009`

### Build for Production

```bash
yarn build
yarn start
```

## 📁 Project Structure

```
apps/learn-cricket/
├── components/           # React components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── WorldCupHero.js   # WC hero section
│   ├── MatchCard.js      # Match display card
│   ├── CTAButton.js
│   ├── ModuleCard.js
│   ├── LessonCard.js
│   ├── NewsList.js
│   ├── QuizComponent.js
│   ├── PaymentPrompt.js
│   └── CertificateViewer.js
├── lib/                  # Utility libraries
│   ├── supabaseClient.js
│   ├── accessCode.js
│   ├── curriculumGenerator.js
│   └── moderationUtils.js # Content moderation
├── pages/               # Next.js pages
│   ├── index.js         # Landing page
│   ├── world-cup.js     # 🏆 World Cup landing
│   ├── daily-strike.js  # ⚡ Daily challenge
│   ├── super-over.js    # 🎯 60s rapid-fire
│   ├── curriculum.js    # Full curriculum view
│   ├── register.js      # Registration/payment
│   ├── onboarding.js    # First-login setup
│   ├── jobs.js          # Jobs board
│   ├── news.js          # News page
│   ├── admin/
│   │   ├── index.js     # Admin dashboard
│   │   └── moderation.js # Content moderation
│   ├── modules/[moduleId]/lesson/[lessonId].js
│   └── api/             # API routes
│       ├── daily-strike.js      # WC trivia generation
│       ├── live/[matchId].js    # Live match stats
│       ├── match/               # Super Over endpoints
│       │   ├── create.js
│       │   ├── answer.js
│       │   └── [matchId].js
│       ├── moderation/          # Content moderation
│       │   ├── entries.js
│       │   └── update.js
│       ├── payment/confirm.js
│       ├── news/fetch.js
│       ├── assessments/submit.js
│       ├── assessments/final.js
│       ├── users/access.js
│       └── cert/generate.js
├── data/                # World Cup data
│   ├── fixtures/
│   │   └── worldcup-fixtures.json  # Tournament fixtures
│   └── squads/
│       ├── india.json              # Team squads
│       └── australia.json
├── config/
│   └── content-banlist.json   # Moderation banlist
├── docs/
│   └── ai-templates.md        # AI prompt templates
├── scripts/
│   ├── seed_data.js           # Generate course content
│   └── create-backup.sh       # File backup utility
├── logs/                      # Audit logs (.gitignore)
│   ├── ai-content-audit.log
│   └── api-usage.log
├── styles/
│   └── globals.css            # Global styles
└── public/                    # Static assets
```

## 🏆 World Cup Features Guide

### 1. World Cup Landing Page

Access at `/world-cup` (requires `ENABLE_WORLD_CUP_MODE=true`)

Features:
- Live UTC tournament clock
- Next match countdown and details
- Group standings (Groups A & B)
- Upcoming fixtures list
- Quick actions: Daily Strike, Super Over
- Team navigation

### 2. Daily Strike (Daily Challenge)

Access at `/daily-strike` (requires `ENABLE_DAILY_STRIKE=true`)

Features:
- 5-10 World Cup-specific trivia questions
- Questions generated from tournament fixtures
- Score tracking and streak management
- XP and coins rewards (when auth enabled)
- Categories: fixtures, venues, teams, players

API Endpoints:
- `GET /api/daily-strike?count=5` - Get daily questions
- `POST /api/daily-strike/submit` - Submit answers

### 3. Super Over (60s Rapid-Fire)

Access at `/super-over` (requires `ENABLE_SUPER_OVER=true`)

Features:
- 6-ball rapid-fire trivia match
- Bot opponent with configurable difficulty
- Run scoring based on correct answers
- Real-time match state
- Difficulty levels: Easy, Medium, Hard

API Endpoints:
- `POST /api/match/create` - Create new match
- `POST /api/match/answer` - Submit answer
- `GET /api/match/:matchId` - Get match state

Bot Configuration:
```bash
BOT_ACCURACY_EASY=0.5      # 50% accuracy
BOT_ACCURACY_MEDIUM=0.7    # 70% accuracy
BOT_ACCURACY_HARD=0.9      # 90% accuracy
```

### 4. Live Match Stats

Access via API: `/api/live/:matchId` (requires `ENABLE_LIVE_STATS=true`)

Features:
- Live scores and match state
- "Did You Know?" cricket facts
- Automatic fallback to cached data when API unavailable
- Advisory messages when live data disabled

Response includes:
```json
{
  "matchData": {
    "matchId": "wc2026_001",
    "status": "live",
    "teams": { ... },
    "venue": { ... },
    "dataSource": "cached-stub"
  },
  "didYouKnow": {
    "fact": "...",
    "source": "...",
    "confidence": "high",
    "category": "history"
  },
  "advisory": "Live data disabled..."
}
```

### 5. Content Moderation

Access at `/admin/moderation` (requires `NEXT_PUBLIC_ADMIN_SETUP_MODE=true`)

Features:
- View all AI-generated content
- Filter by status (flagged, approved, rejected)
- Search by content type or reason
- Approve/reject flagged items
- Statistics dashboard

Content Safety:
- Automated keyword filtering
- Controversy classifier
- Numeric plausibility checks
- Audit logging to `logs/ai-content-audit.log`

Banlist Configuration:
See `config/content-banlist.json` for:
- Banned keywords (politics, religion, slurs)
- Banned phrases
- Controversial topics
- Safe cricket terms (allowed)

### 6. AI Content Generation

Controlled by `ENABLE_LLM=true` + `LLM_API_KEY`

Features (when enabled):
- Player biographies (3-5 sentences)
- Match previews with key insights
- "Did You Know?" facts
- Trivia question generation
- Distractor generation

All AI content:
- Passes through content filter
- Includes source attribution
- Undergoes plausibility checks
- Logged to audit trail

See `docs/ai-templates.md` for:
- LLM prompt templates
- Validation rules
- Plausibility checks
- Fallback content

## 🔒 Security & Safety

### Content Filtering

All generated content is filtered for:
- Political commentary
- Religious references
- Controversial topics
- Personal attacks
- Unverified claims

Implemented via:
1. Keyword matching (`config/content-banlist.json`)
2. Controversy classifier
3. Numeric validation against authoritative data
4. Manual review queue for flagged items

### Feature Flag Security

**Production Settings:**
```bash
# Safe defaults for production
ENABLE_WORLD_CUP_MODE=true      # ✓ Safe
ENABLE_DAILY_STRIKE=true        # ✓ Safe
ENABLE_SUPER_OVER=true          # ✓ Safe
ENABLE_LIVE_STATS=false         # Only with valid API key
ENABLE_LLM=false                # Only with valid API key
ADMIN_SETUP_MODE=false          # ⚠️ Must be false in production
TEMP_SUSPEND_AUTH=false         # ⚠️ Must be false in production
```

### Backup Strategy

Before modifying any file:
```bash
# Create timestamped backup
./scripts/create-backup.sh pages/world-cup.js

# Creates: pages/world-cup.js.bak.1706956800
```

All `.bak.*` files are in `.gitignore`.

### Audit Logging

Logs stored in `logs/` (excluded from git):
- `ai-content-audit.log` - AI generation events
- `api-usage.log` - API endpoint usage

Log entries include:
- Timestamp
- Route/endpoint
- Content type
- Moderation status
- Non-sensitive metadata only

## 📁 Project Structure

```
apps/learn-cricket/
├── components/           # React components
│   ├── Navbar.js
│   ├── Footer.js
│   ├── CTAButton.js
│   ├── ModuleCard.js
│   ├── LessonCard.js
│   ├── NewsList.js
│   ├── QuizComponent.js
│   ├── PaymentPrompt.js
│   └── CertificateViewer.js
├── lib/                  # Utility libraries
│   ├── supabaseClient.js
│   ├── accessCode.js
│   └── curriculumGenerator.js
├── pages/               # Next.js pages
│   ├── index.js         # Landing page
│   ├── curriculum.js    # Full curriculum view
│   ├── register.js      # Registration/payment
│   ├── onboarding.js    # First-login setup
│   ├── jobs.js          # Jobs board
│   ├── news.js          # News page
│   ├── admin/
│   │   └── index.js     # Admin dashboard
│   ├── modules/[moduleId]/lesson/[lessonId].js
│   └── api/             # API routes
│       ├── payment/confirm.js
│       ├── news/fetch.js
│       ├── assessments/submit.js
│       ├── assessments/final.js
│       ├── users/access.js
│       └── cert/generate.js
├── scripts/
│   └── seed_data.js     # Generate course content
├── styles/
│   └── globals.css      # Global styles
├── data/                # Generated seed data
└── public/              # Static assets
```

## 🎓 Course Structure

### Modules Overview

1. **Introduction to AI** (Beginner) - Fundamentals and history
2. **Types of AI** (Beginner) - Categories and classifications
3. **Data Science Fundamentals** (Beginner) - Data foundation
4. **Python for AI** (Beginner) - Programming basics
5. **Supervised Learning** (Intermediate) - ML algorithms
6. **Unsupervised Learning** (Intermediate) - Clustering & dimensionality
7. **Neural Networks** (Intermediate) - Deep learning architectures
8. **AI Monetization** (Advanced) - Earning strategies
9. **AI Tools & Frameworks** (Advanced) - Popular platforms
10. **Career Pathways in AI** (Advanced) - Professional development

### Learning Flow

1. **Registration** - Pay Rs 99 for course access
2. **Onboarding** - Choose learning path (3 options)
3. **Lessons** - Study content (max 400 words each)
4. **Quizzes** - Pass with 3/5 to unlock next lesson
5. **Final Exam** - 20 questions, pass with 13+ correct
6. **Certificate** - Automatically generated and emailed

## 🔧 Configuration

### Environment Variables

Create `.env.local` from `.env.local.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_SUSPENDED=false

# App Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3009
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-cricket
NEXT_PUBLIC_DISABLE_AUTH=false

# External APIs
NEWS_API_KEY=your-newsapi-key
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key

# External Services
JOBS_FEED_URL=https://example.com/api/jobs
PAYMENT_RETURN_URL=https://aienter.in/payments
```

### SUSPENDED Mode

When `NEXT_PUBLIC_SUPABASE_SUSPENDED=true`, the app uses in-memory storage as a fallback, allowing it to function without a database connection. This is useful for:

- Development without Supabase setup
- Demonstrations and testing
- Environments where database is temporarily unavailable

## 📊 Seed Data Generation

The seed script generates 100 lessons with content and quizzes:

```bash
yarn seed
```

### AI Content Generation (Production)

In production with `OPENAI_API_KEY`, the seed script would use these prompts:

#### Lesson Content Prompt

```
Write a comprehensive 400-word lesson about {topic} in the context of {module_title}.
The lesson should include:
1. An engaging introduction explaining why this topic matters
2. 3-4 key concepts with clear explanations and examples
3. Practical applications in real-world scenarios
4. A summary reinforcing the main takeaways

Format: Use clear paragraphs with subheadings. 
Target audience: learners with {difficulty} level knowledge.
Writing style: Educational, engaging, and practical.
```

#### Quiz Generation Prompt

```
Generate 5 multiple-choice questions to test understanding of {topic} in {module_title}.
For each question:
1. Write a clear question that tests conceptual understanding
2. Provide 4 answer options where only one is correct
3. Include a brief explanation of why the correct answer is right

Difficulty level: {difficulty}
Format as JSON array with fields: question, options, correct_answer, explanation
```

### Generated Data Structure

```json
{
  "modules": [...],
  "lessons": [
    {
      "id": "1-1",
      "module_id": 1,
      "lesson_number": 1,
      "title": "What is AI",
      "content": "<html content>",
      "duration_minutes": 15,
      "is_free": true
    }
  ],
  "quizzes": [
    {
      "lesson_id": "1-1",
      "questions": [...]
    }
  ]
}
```

## 🔐 Authentication & Access

### Access Code System

1. User pays Rs 99 via external payment gateway
2. Payment confirmed via `/api/payment/confirm`
3. System generates unique access code (format: `XXXX-XXXX-XXXX`)
4. Access code emailed to user via Resend
5. User enters code to activate account

### Admin Panel

Access at `/admin` with authentication (or `NEXT_PUBLIC_DISABLE_AUTH=true` for dev):

- **Modules & Lessons** - CRUD operations
- **Registrations** - View all users
- **Certificates** - Track issued certificates

## 📱 Features

### Landing Page

- Hero section with value proposition
- 3 market-driven reasons to learn AI
- Skill outcomes list
- Module preview (first 3 modules)
- AI News Monitor (9 stories, search, pagination)
- Registration CTA

### Curriculum Page

- All 10 modules displayed
- Learning pace guidelines
- Course structure overview

### Lesson Pages

- Dynamic routing: `/modules/[moduleId]/lesson/[lessonId]`
- 400-word content maximum
- 5-question quiz (3/5 to pass)
- Progress tracking
- Next lesson navigation

### Jobs Board

- Live jobs feed (configurable via `JOBS_FEED_URL`)
- India-focused opportunities
- Search and filter capabilities
- Direct application links

### News Monitor

- AI news aggregation
- Search functionality
- Pagination (9 articles per page)
- Fallback to mock data when NEWS_API_KEY unavailable

## 🎨 Design & Accessibility

- **Responsive Design** - Mobile-first approach
- **Semantic HTML** - Proper heading hierarchy
- **Keyboard Navigation** - Full keyboard support
- **Color Contrast** - WCAG AA compliant
- **Loading States** - User feedback during async operations
- **Error Handling** - Graceful degradation

## 🧪 Testing

```bash
# Lint code
yarn lint

# Test build
yarn build

# Run in production mode
yarn start
```

## 🚢 Deployment

### PM2 Integration

The app is configured for PM2 deployment via the root `ecosystem.config.js`:

```javascript
{
  name: 'learn-cricket',
  script: 'node_modules/next/dist/bin/next',
  args: 'start -p 3009',
  cwd: './apps/learn-cricket',
  env: {
    NODE_ENV: 'production',
    PORT: 3009
  }
}
```

### Production Deployment

```bash
# From repository root
cd /home/runner/work/iiskills-cloud/iiskills-cloud

# Build the app
cd apps/learn-cricket && yarn build && cd ../..

# Update ecosystem config
node generate-ecosystem.js

# Validate config
node validate-ecosystem.js

# Deploy with PM2
pm2 start ecosystem.config.js --only learn-cricket
```

## 📈 Metrics & Analytics

Track user progress:
- Lesson completion rates
- Quiz scores
- Time spent per lesson
- Final exam pass rates
- Certificate generation

## 🔒 Security

- No secrets in repository
- Environment variables for all sensitive data
- Access code validation
- Payment verification
- Admin authentication
- CORS policies
- Input sanitization

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
yarn install

# Rebuild
yarn build
```

### Database Connection

If Supabase is unavailable:
1. Set `NEXT_PUBLIC_SUPABASE_SUSPENDED=true`
2. App will use in-memory storage
3. Data persists only for session duration

### Payment Issues

- Verify `PAYMENT_RETURN_URL` is correct
- Check payment gateway integration
- Review `/api/payment/confirm` logs

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React 19 Docs](https://react.dev)

## 🤝 Contributing

1. Follow existing code patterns
2. Write descriptive commit messages
3. Test all changes locally
4. Update documentation as needed

## 📄 License

Proprietary - Part of iiskills-cloud monorepo

## 🆘 Support

For issues or questions:
- Check documentation
- Review error logs
- Contact development team

---

**Built with ❤️ for the iiskills-cloud platform**
