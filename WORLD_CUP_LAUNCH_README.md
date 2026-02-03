# World Cup Launch - Setup Guide

## 🏏 Overview

The World Cup Launch introduces cricket-focused features including:
- **Daily Strike**: 5-10 trivia questions from World Cup fixtures
- **Super Over**: 60-second rapid-fire match vs bot
- **Live Stats**: Match scores with "Did You Know?" facts (optional)
- **Admin Setup**: Secure admin account creation
- **Image Management**: License-free images + Gemini generation

---

## 📋 Feature Flags

All features are controlled via environment variables:

```bash
# World Cup Features
ENABLE_WORLD_CUP_MODE=true          # Enable WC landing & features
ENABLE_DAILY_STRIKE=true            # Enable Daily Strike trivia (default: true)
ENABLE_SUPER_OVER=true              # Enable Super Over matches (default: true)

# Live Stats (Optional - requires CRICKET_API_KEY)
ENABLE_LIVE_STATS=false             # Enable live match data (default: false)
CRICKET_API_KEY=                    # Optional: Live cricket API key

# LLM Enrichment (Optional)
ENABLE_LLM=false                    # Enable LLM content enrichment (default: false)
GEMINI_API_KEY=                     # Required for LLM & image generation

# Bot Configuration (Optional - defaults provided)
BOT_ACCURACY_EASY=0.5               # Bot accuracy for easy mode
BOT_ACCURACY_MEDIUM=0.7             # Bot accuracy for medium mode
BOT_ACCURACY_HARD=0.9               # Bot accuracy for hard mode
BOT_DELAY_MS_EASY=2000              # Bot response delay (ms) - easy
BOT_DELAY_MS_MEDIUM=1500            # Bot response delay (ms) - medium
BOT_DELAY_MS_HARD=1000              # Bot response delay (ms) - hard

# Admin Setup (DISABLE after initial setup!)
ADMIN_SETUP_MODE=false              # Enable admin setup page (default: false)
ADMIN_SETUP_KEY=                    # Optional: Security key for setup
TEMP_SUSPEND_AUTH=false             # Temporary auth suspension (default: false)
```

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd apps/learn-cricket
npm install
```

### 2. Configure Environment

```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

Minimal configuration:
```bash
ENABLE_WORLD_CUP_MODE=true
ENABLE_DAILY_STRIKE=true
ENABLE_SUPER_OVER=true
```

### 3. Generate Hero Images (Optional)

**Option A: Download license-free images only**
```bash
./scripts/generate-or-download-images.sh --download-only
```

**Option B: Download + Generate with Gemini**
```bash
export GEMINI_API_KEY=your_key_here
./scripts/generate-or-download-images.sh
```

⚠️ **IMPORTANT**: Generated images are NOT committed to git (in .gitignore)

### 4. Run Development Server

```bash
npm run dev
```

Visit:
- Home: http://localhost:3009
- Daily Strike: http://localhost:3009/daily-strike
- Super Over: http://localhost:3009/super-over
- Admin Setup: http://localhost:3009/admin/setup (if ADMIN_SETUP_MODE=true)

---

## 📦 Data Sources

### Local Fixtures (Source of Truth)

All World Cup content is derived from local JSON files:

```
data/
  fixtures/
    worldcup-fixtures.json    # Match schedule, venues, dates
  squads/
    india.json               # India squad
    australia.json           # Australia squad
    ... (add more teams)
```

**DO NOT** attempt to fetch from external APIs unless CRICKET_API_KEY is explicitly provided.

---

## 🖼️ Image Management

### Image Manifest System

Images are managed via `components/shared/imageManifest.template.json`:

```json
{
  "learn-cricket": {
    "preferredRemoteUrl": "https://images.unsplash.com/...",
    "credit": {
      "sourceName": "Unsplash",
      "sourceUrl": "https://unsplash.com/..."
    }
  },
  "world-cup-hero": {
    "generationPrompt": "Cricket World Cup 2026 stadium celebration..."
  }
}
```

### Generate/Download Script

```bash
# Download only (no API key needed)
./scripts/generate-or-download-images.sh --download-only

# Download + Generate (requires GEMINI_API_KEY)
export GEMINI_API_KEY=your_key_here
./scripts/generate-or-download-images.sh
```

This produces `components/shared/imageManifest.js` used by SharedHero component.

**⚠️ Do NOT commit**:
- `public/generated-images/*` (gitignored)
- API keys or secrets

---

## 🎮 Features

### Daily Strike

**Route**: `/daily-strike`

**API**: `GET /api/daily-strike?count=5`

**Features**:
- 5-10 WC-focused trivia questions
- Questions generated from local fixtures
- Content moderation via banlist
- Optional LLM enrichment (if ENABLE_LLM=true)
- Score tracking and results

**Testing**:
```bash
npm test -- tests/dailyStrike.test.js
```

---

### Super Over

**Route**: `/super-over`

**API**: 
- `POST /api/match/create` - Start new match
- `POST /api/match/answer` - Submit answer
- `GET /api/match/:matchId` - Get match state

**Features**:
- 6-ball (6 questions) rapid-fire match
- Bot opponent with configurable difficulty
- Run scoring: correct = run, wrong = wicket
- Solo mode for launch (friend mode pending)

**Testing**:
```bash
npm test -- tests/superOver.test.js
```

---

### Live Stats (Optional)

**Route**: Components use `<LiveScoreWithFact matchId="..." />`

**API**: `GET /api/live/:matchId`

**Features**:
- Real-time match updates (if CRICKET_API_KEY set)
- Fallback to fixture data
- "Did You Know?" cricket facts
- Auto-refresh support

**Usage**:
```jsx
import LiveScoreWithFact from '../components/live/LiveScoreWithFact';

<LiveScoreWithFact 
  matchId="wc2026_001" 
  autoRefresh={true} 
  refreshInterval={30000} 
/>
```

---

## 🛡️ Security & Moderation

### Content Filtering

Banned content is filtered via `config/content-banlist.json`:

```json
{
  "bannedKeywords": ["political party", "religion", ...],
  "bannedPhrases": ["vote for", "support party", ...],
  "controversialTopics": ["politics", "religion", ...]
}
```

All AI-generated content is checked before serving.

### Audit Logging

All AI generation events are logged to `logs/ai-content-audit.log`:

```json
{
  "timestamp": "2026-02-03T10:00:00Z",
  "route": "/api/daily-strike",
  "questionCount": 5,
  "sourceDataId": "ICC Cricket World Cup 2026",
  "moderationStatus": "approved"
}
```

**⚠️ logs/ is gitignored** - do not commit logs

---

## 👨‍💼 Admin Setup

### First-Time Setup

1. Enable setup mode:
```bash
ADMIN_SETUP_MODE=true
```

2. (Optional) Set security key:
```bash
ADMIN_SETUP_KEY=your_secure_key_here
```

3. Visit `/admin/setup` and create admin account

4. **IMPORTANT**: Disable setup mode immediately:
```bash
ADMIN_SETUP_MODE=false
```

### Security Notes

- Passwords hashed with SHA-256 (TODO: upgrade to bcrypt in production)
- Setup events logged to `logs/admin-setup.log`
- Single-use endpoint (creates one admin only)
- Disable ADMIN_SETUP_MODE after first admin created
- Rotate credentials periodically

---

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Specific Tests

```bash
npm test -- tests/sharedHero.test.js
npm test -- tests/dailyStrike.test.js
npm test -- tests/superOver.test.js
npm test -- tests/contentFilter.test.js
```

### Test Coverage

```bash
npm test -- --coverage
```

---

## 🏗️ Build & Deploy

### Local Build

```bash
npm run build
npm run start
```

### Production Checklist

- [ ] Set all required environment variables
- [ ] Disable ADMIN_SETUP_MODE
- [ ] Disable TEMP_SUSPEND_AUTH
- [ ] Generate/download hero images
- [ ] Run full test suite
- [ ] Verify content moderation active
- [ ] Check logs/ is gitignored
- [ ] Ensure no secrets in repo

---

## 📚 AI Templates

LLM prompts and validation rules are documented in `docs/ai-templates.md`:

- Trivia question generation
- Distractor creation
- Player bio generation
- Match preview templates
- Plausibility checks
- Fact validation rules

---

## 🔒 Environment Security

### Never Commit

- `GEMINI_API_KEY`
- `CRICKET_API_KEY`
- `ADMIN_SETUP_KEY`
- Generated images in `public/generated-images/`
- Logs in `logs/`
- `data/admin.json`

### Safe to Commit

- `data/fixtures/*.json`
- `data/squads/*.json`
- `config/content-banlist.json`
- `docs/ai-templates.md`
- `components/shared/imageManifest.template.json`

---

## 🆘 Troubleshooting

### Daily Strike returns no questions

**Cause**: Fixtures file missing or empty

**Fix**:
```bash
# Verify fixtures exist
ls -la data/fixtures/worldcup-fixtures.json

# Check file content
cat data/fixtures/worldcup-fixtures.json
```

### Super Over match creation fails

**Cause**: ENABLE_SUPER_OVER is false

**Fix**:
```bash
# In .env.local
ENABLE_SUPER_OVER=true
```

### Images not showing

**Cause**: Manifest not generated or missing images

**Fix**:
```bash
# Regenerate manifest
./scripts/generate-or-download-images.sh --download-only
```

### Admin setup blocked

**Cause**: ADMIN_SETUP_MODE not enabled or admin exists

**Fix**:
```bash
# Enable setup mode
ADMIN_SETUP_MODE=true

# If admin exists and you need to reset
rm data/admin.json
```

---

## 📞 Support

For issues or questions:
- Check logs in `logs/` (if feature is enabled)
- Review `docs/ai-templates.md` for content guidelines
- Verify environment variables are set correctly
- Ensure local fixtures are up-to-date

---

## 📄 License

MIT License - See root LICENSE file

---

**Last Updated**: 2026-02-03  
**Version**: World Cup Launch MVP  
**Branch**: feature/world-cup-launch
