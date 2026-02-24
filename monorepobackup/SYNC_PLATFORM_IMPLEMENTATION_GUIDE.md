# Sync Learning Platform - Implementation Guide

This guide provides step-by-step instructions for implementing the Sync Learning Platform content and features into the existing Learn AI and Learn Developer apps.

## Quick Start

1. **Review the Specification:** Read [SYNC_LEARNING_PLATFORM_SPEC.md](./SYNC_LEARNING_PLATFORM_SPEC.md)
2. **Examine Sample Content:** Check [data/sync-platform/](./data/sync-platform/)
3. **Follow Implementation Phases:** Execute phases 2-6 in order

## Current Status

✅ **Phase 1 Complete:** Documentation, schemas, and sample content created

## Phase 2: Content Generation (Next Step)

### Option A: Manual Content Creation

Create content following the sample pattern in `data/sync-platform/learn-ai/basics/`:

1. **For each module:**
   - Copy `module-2-prompt-engineering.json` as template
   - Update `moduleId`, `title`, `description`, etc.
   - Define `unlocks` for cross-app integration

2. **For each lesson:**
   - Copy `lesson-prompt-engineering-1.json` as template
   - Write 500-800 words of content
   - Include 1-3 pro tips
   - Add 2-3 cross-app references
   - Create 1-3 practical exercises

3. **For each quiz:**
   - Copy `quiz-prompt-engineering.json` as template
   - Write 10 questions with:
     - 4 answers + "I don't know"
     - Rationale (1-2 sentences)
     - Deep dive (2-3 sentences)
     - Cross-app reference

### Option B: AI-Assisted Content Generation

Use this prompt template with AI tools:

```
Context: You are a senior educational content creator for a dual-app learning platform.

Task: Create a complete module for [Learn AI/Learn Developer] on the topic of [TOPIC].

Format: Provide content in JSON format matching these schemas:
- Module: [paste module.schema.json]
- Lesson: [paste lesson.schema.json]
- Quiz: [paste quiz.schema.json]

Constraints:
- Follow the C.T.F.C. framework for all AI content
- Include cross-app references to [partner app]
- Each lesson must be 500-800 words
- Quiz must have 10 questions with deep-dive explanations
- Use clear, professional English
- Include real-world examples from industry

Sample Quality: Match the quality of [paste lesson-prompt-engineering-1.json]
```

### Validation

After creating content, validate against schemas:

```bash
# Install ajv-cli if not already installed
npm install -g ajv-cli

# Validate module
ajv validate -s data/sync-platform/schemas/module.schema.json \
  -d data/sync-platform/learn-ai/basics/module-1-*.json

# Validate lesson
ajv validate -s data/sync-platform/schemas/lesson.schema.json \
  -d data/sync-platform/learn-ai/basics/lesson-*.json

# Validate quiz
ajv validate -s data/sync-platform/schemas/quiz.schema.json \
  -d data/sync-platform/learn-ai/basics/quiz-*.json
```

## Phase 3: Technical Integration

### 3.1 Content Loading System

Create a content loader utility:

```javascript
// lib/syncContentLoader.js
import fs from 'fs';
import path from 'path';

const CONTENT_DIR = path.join(process.cwd(), '../../data/sync-platform');

export function loadModule(appId, tier, moduleId) {
  const modulePath = path.join(CONTENT_DIR, appId, tier, `module-${moduleId}.json`);
  return JSON.parse(fs.readFileSync(modulePath, 'utf-8'));
}

export function loadLesson(appId, tier, lessonId) {
  const lessonPath = path.join(CONTENT_DIR, appId, tier, `lesson-${lessonId}.json`);
  return JSON.parse(fs.readFileSync(lessonPath, 'utf-8'));
}

export function loadQuiz(appId, tier, quizId) {
  const quizPath = path.join(CONTENT_DIR, appId, tier, `quiz-${quizId}.json`);
  return JSON.parse(fs.readFileSync(quizPath, 'utf-8'));
}

export function getAllModules(appId, tier) {
  const tierDir = path.join(CONTENT_DIR, appId, tier);
  const files = fs.readdirSync(tierDir);
  
  return files
    .filter(f => f.startsWith('module-'))
    .map(f => JSON.parse(fs.readFileSync(path.join(tierDir, f), 'utf-8')))
    .sort((a, b) => a.order - b.order);
}
```

### 3.2 Progress Tracking

Create a progress tracking system:

```javascript
// lib/syncProgressTracker.js
export class SyncProgressTracker {
  constructor(userId, supabase) {
    this.userId = userId;
    this.supabase = supabase;
  }

  async getProgress() {
    const { data, error } = await this.supabase
      .from('sync_progress')
      .select('*')
      .eq('user_id', this.userId)
      .single();
    
    return data || this.initializeProgress();
  }

  async completeModule(appId, tier, moduleId, score) {
    const progress = await this.getProgress();
    
    // Update completion
    progress[appId][tier].completed.push(moduleId);
    
    // Check pass gate (30%)
    if (score >= 30) {
      await this.unlockNextModules(appId, tier, moduleId);
    } else {
      await this.triggerAICounselor(appId, moduleId, score);
    }
    
    await this.saveProgress(progress);
  }

  async unlockNextModules(appId, tier, moduleId) {
    const module = loadModule(appId, tier, moduleId);
    
    // Unlock in current app
    if (module.unlocks?.currentApp) {
      for (const nextModule of module.unlocks.currentApp) {
        await this.unlockModule(appId, tier, nextModule);
      }
    }
    
    // Unlock in partner app (cross-app sync)
    if (module.unlocks?.partnerApp) {
      const partnerApp = appId === 'learn-ai' ? 'learn-developer' : 'learn-ai';
      for (const partnerModule of module.unlocks.partnerApp) {
        await this.unlockModule(partnerApp, tier, partnerModule);
        await this.showCrossAppNotification(partnerApp, partnerModule);
      }
    }
  }

  async triggerAICounselor(appId, moduleId, score) {
    // Trigger AI Counselor feedback flow
    return {
      mode: 'ai-counselor-reprepare',
      message: 'You missed key concepts. Let\'s review before continuing.',
      suggestedActions: [
        { type: 'review', lessonId: `${moduleId}-1` },
        { type: 'sandbox', tool: 'interactive-practice' }
      ]
    };
  }
}
```

### 3.3 30% Pass-Gate Logic

Implement in quiz component:

```javascript
// components/SyncQuiz.js
import { useState } from 'react';
import { SyncProgressTracker } from '@/lib/syncProgressTracker';

export default function SyncQuiz({ quiz, moduleId, appId, tier }) {
  const [responses, setResponses] = useState({});
  const [result, setResult] = useState(null);

  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      if (responses[q.questionId] === q.correctAnswerIndex) {
        correct++;
      }
    });
    return (correct / quiz.questionCount) * 100;
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const tracker = new SyncProgressTracker(userId, supabase);
    
    if (score >= quiz.passPercentage) {
      // Pass!
      await tracker.completeModule(appId, tier, moduleId, score);
      
      setResult({
        passed: true,
        score,
        message: 'Congratulations! Module unlocked.',
        crossAppUnlocks: await tracker.getCrossAppUnlocks(moduleId)
      });
    } else {
      // Fail - trigger AI Counselor
      const counselorFeedback = await tracker.triggerAICounselor(appId, moduleId, score);
      
      setResult({
        passed: false,
        score,
        message: `You scored ${score}%. You need ${quiz.passPercentage}% to pass.`,
        counselorFeedback
      });
    }
  };

  return (
    <div className="quiz-container">
      {/* Quiz UI */}
      {quiz.questions.map((q, idx) => (
        <div key={q.questionId} className="question">
          <p>{idx + 1}. {q.questionText}</p>
          {q.options.map((option, optIdx) => (
            <label key={optIdx}>
              <input
                type="radio"
                name={q.questionId}
                value={optIdx}
                onChange={() => setResponses({...responses, [q.questionId]: optIdx})}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      
      <button onClick={handleSubmit}>Submit Quiz</button>
      
      {result && <QuizResult result={result} />}
    </div>
  );
}
```

## Phase 4: UI/UX Implementation

### 4.1 Cyber-Neon Theme

Add to `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // AI App - Neon Purple
        'ai-primary': '#9945FF',
        'ai-secondary': '#B388FF',
        
        // Developer App - Electric Cyan
        'dev-primary': '#00D9FF',
        'dev-secondary': '#00BCD4',
        
        // Shared gradient stops
        'cyber-purple': '#9945FF',
        'cyber-cyan': '#00D9FF',
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #9945FF 0%, #00D9FF 100%)',
      }
    }
  }
}
```

### 4.2 Matrix Code Rain Background

For Learn Developer app:

```jsx
// components/MatrixRain.js
import { useEffect, useRef } from 'react';

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00D9FF';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters[Math.floor(Math.random() * characters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-20" />;
}
```

### 4.3 Cross-App Notification

```jsx
// components/CrossAppUnlockNotification.js
export default function CrossAppUnlockNotification({ partnerApp, moduleName }) {
  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-cyber-purple to-cyber-cyan p-6 rounded-lg shadow-lg animate-slide-in">
      <div className="flex items-center space-x-3">
        <span className="text-4xl">🎉</span>
        <div>
          <p className="font-bold text-white">Cross-App Unlock!</p>
          <p className="text-white text-sm">
            Great work! You've unlocked <strong>{moduleName}</strong> in {partnerApp}
          </p>
          <a 
            href={`https://${getAppUrl(partnerApp)}/modules/${moduleName}`}
            className="text-white underline text-sm mt-2 inline-block"
          >
            Check it out →
          </a>
        </div>
      </div>
    </div>
  );
}
```

## Phase 5: Database Schema

Add to Supabase:

```sql
-- Sync Progress Table
CREATE TABLE sync_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  progress JSONB NOT NULL DEFAULT '{}',
  sync_unlocks JSONB[] DEFAULT ARRAY[]::JSONB[],
  universal_certificate_eligible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Module Completions
CREATE TABLE module_completions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  tier TEXT NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  attempts INTEGER DEFAULT 1,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, app_id, module_id)
);

-- Quiz Attempts
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id TEXT NOT NULL,
  quiz_id TEXT NOT NULL,
  responses JSONB NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE sync_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own progress" ON sync_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON sync_progress
  FOR UPDATE USING (auth.uid() = user_id);
```

## Testing Checklist

- [ ] Content validates against schemas
- [ ] Modules load correctly in both apps
- [ ] Progress tracking works
- [ ] 30% pass-gate triggers correctly
- [ ] Cross-app unlocks function
- [ ] AI Counselor feedback displays
- [ ] UI theme matches specification
- [ ] Responsive design works on mobile
- [ ] Database operations are secure (RLS enabled)

## Deployment

1. **Content:** Upload JSON files to production server
2. **Database:** Run migration scripts in Supabase
3. **Apps:** Deploy updated Learn AI and Learn Developer apps
4. **Testing:** Verify end-to-end flow in production

## Monitoring

Track these metrics:
- Module completion rates
- Quiz pass rates (first attempt)
- Cross-app engagement rate
- "I don't know" usage percentage
- Time spent per module

## Support

For questions or issues:
1. Review [SYNC_LEARNING_PLATFORM_SPEC.md](./SYNC_LEARNING_PLATFORM_SPEC.md)
2. Check [data/sync-platform/README.md](./data/sync-platform/README.md)
3. Examine sample content in `data/sync-platform/learn-ai/basics/`

## Next Steps

1. ✅ Phase 1: Complete
2. ➡️ **Phase 2:** Start content generation (60-96 lessons for Basics tier)
3. Phase 3: Implement sync logic
4. Phase 4: Build UI/UX enhancements
5. Phase 5: Populate remaining tiers
6. Phase 6: Testing and launch
