# Learn Pr - Comprehensive AI Course Platform

A complete AI learning platform built with Next.js, offering 100 lessons across 10 modules, from beginner to advanced topics.

## 🎯 Overview

Learn Pr is a self-paced online course platform designed to take students from AI fundamentals to monetization strategies. The platform includes:

- **10 Comprehensive Modules** - Beginner to Advanced levels
- **100 Detailed Lessons** - Each with quiz assessments
- **Progressive Learning** - Pass quizzes to unlock next lessons
- **Final Certification Exam** - 20 questions, pass with 13+ correct
- **5 Case Studies** - Real-world AI applications
- **5 Skill Simulators** - Hands-on practice tools
- **AI News Monitor** - Stay updated with latest AI developments
- **Jobs Board** - AI career opportunities in India

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Supabase account (optional - works in SUSPENDED mode)
- Environment variables configured

### Installation

```bash
# Navigate to the app directory
cd apps/learn-pr

# Install dependencies
yarn install

# Create environment file
cp .env.local.example .env.local

# Generate seed data
yarn seed

# Run development server
yarn dev
```

The app will be available at `http://localhost:3021`

### Build for Production

```bash
yarn build
yarn start
```

## 📁 Project Structure

```
apps/learn-pr/
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
NEXT_PUBLIC_SITE_URL=http://localhost:3021
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-pr
NEXT_PUBLIC_DISABLE_AUTH=false

# External APIs
NEWS_API_KEY=your-newsapi-key
OPENAI_API_KEY=your-openai-key
SENDGRID_API_KEY=your-sendgrid-key
GOOGLE_TRANSLATE_API_KEY=your-google-translate-key

# External Services
JOBS_FEED_URL=https://example.com/api/jobs
PAYMENT_RETURN_URL=https://aienter.in/payments
```

## Translation Support

This app uses **Google Cloud Translation API** for multi-language support.

### Setup:
1. Get a Google Cloud Translation API key from [Google Cloud Console](https://console.cloud.google.com)
2. Add to `.env.local`:
   ```bash
   GOOGLE_TRANSLATE_API_KEY=your-key-here
   ```

### Supported Languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Bengali (bn)
- Marathi (mr)
- Gujarati (gu)
- Kannada (kn)
- Malayalam (ml)
- Punjabi (pa)
- Odia (or)
- Urdu (ur)

### Fallback Behavior:
If API key is missing or API fails, original English text is displayed.

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
4. Access code emailed to user via SendGrid
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
  name: 'learn-pr',
  script: 'node_modules/next/dist/bin/next',
  args: 'start -p 3021',
  cwd: './apps/learn-pr',
  env: {
    NODE_ENV: 'production',
    PORT: 3021
  }
}
```

### Production Deployment

```bash
# From repository root
cd /home/runner/work/iiskills-cloud/iiskills-cloud

# Build the app
cd apps/learn-pr && yarn build && cd ../..

# Update ecosystem config
node generate-ecosystem.js

# Validate config
node validate-ecosystem.js

# Deploy with PM2
pm2 start ecosystem.config.js --only learn-pr
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
