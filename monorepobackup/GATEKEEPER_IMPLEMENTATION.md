# Gatekeeper Question & Answer System

## Overview

The Gatekeeper system provides a rigorous tier qualification mechanism for learning apps. It requires users to answer all 3 questions correctly (100% accuracy) before proceeding to Intermediate or Advanced tiers.

## Features

- **100% Pass Requirement**: Users must answer all 3 questions correctly to unlock a tier
- **Subject-Specific Questions**: Each subject has unique questions for Intermediate and Advanced tiers
- **Retry Mechanism**: Users can retry the test after reviewing their answers
- **Backend-Only Answers**: Correct answers are tracked in the backend configuration but not displayed to users during the quiz
- **Automatic Integration**: Works automatically for apps using UniversalLandingPage or PaidAppLandingPage

## Supported Apps

The gatekeeper system is currently configured for the following apps:

1. **Learn Mathematics** (`learn-math`)
   - Intermediate: Geometry, logarithms, linear equations
   - Advanced: Calculus, linear algebra, theorems

2. **Public Relations** (`learn-pr`)
   - Intermediate: Press releases, media relations, pitching
   - Advanced: Crisis management, PR theory, objectives

3. **Management** (`learn-management`)
   - Intermediate: Maslow's hierarchy, span of control, TQM
   - Advanced: Financial metrics, BCG matrix, change management

4. **Developer** (`learn-developer`)
   - Intermediate: Data structures, SQL, REST APIs
   - Advanced: Design principles, processes vs threads, Docker

5. **Artificial Intelligence** (`learn-ai`)
   - Intermediate: Features, activation functions, NLP
   - Advanced: Transformers, reinforcement learning, GANs

## Architecture

### Components

1. **GatekeeperQuiz** (`components/shared/GatekeeperQuiz.js`)
   - Quiz component with 100% pass requirement
   - Displays 3 questions with multiple-choice answers
   - Provides feedback and retry mechanism

2. **DiagnosticQuiz** (`components/shared/DiagnosticQuiz.js`)
   - Legacy quiz component with 30% pass requirement (2/5 correct)
   - Used as fallback for apps without gatekeeper questions

3. **LevelSelector** (`components/shared/LevelSelector.js`)
   - Universal tier selection component
   - Automatically uses GatekeeperQuiz when appId is provided
   - Falls back to DiagnosticQuiz for other apps

4. **GatekeeperUtils** (`lib/gatekeeperUtils.js`)
   - Utility functions to load and access questions
   - Maps app IDs to subject names
   - Provides question filtering by tier

### Data Structure

Questions are stored in `data/gatekeeperQuestions.json`:

```json
[
  {
    "tier": "Intermediate",
    "subject": "Learn Mathematics",
    "questions": [
      {
        "question": "Question text...",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Option C"
      }
    ]
  }
]
```

## Usage

### For App Developers

Apps using `UniversalLandingPage` or `PaidAppLandingPage` automatically get gatekeeper functionality if:

1. The `appId` prop matches a configured subject (e.g., `learn-math`, `learn-pr`)
2. Questions are defined in `data/gatekeeperQuestions.json`

Example:
```javascript
<UniversalLandingPage
  appId="learn-math"
  appName="Master Mathematics"
  // ... other props
/>
```

### Adding New Subjects

To add gatekeeper questions for a new app:

1. Add questions to `data/gatekeeperQuestions.json`:
   ```json
   {
     "tier": "Intermediate",
     "subject": "Your Subject Name",
     "questions": [ /* 3 questions */ ]
   }
   ```

2. Update `APP_TO_SUBJECT_MAP` in `lib/gatekeeperUtils.js`:
   ```javascript
   const APP_TO_SUBJECT_MAP = {
     'learn-yourapp': 'Your Subject Name',
     // ... existing mappings
   };
   ```

3. Ensure your app's landing page passes the `appId` prop:
   ```javascript
   <UniversalLandingPage appId="learn-yourapp" />
   ```

## User Flow

### Basic Tier
1. User clicks "Basic" tier
2. Direct routing to sample module (no gatekeeper)

### Intermediate/Advanced Tier
1. User clicks "Intermediate" or "Advanced" tier
2. Gatekeeper quiz is displayed with 3 questions
3. User answers all 3 questions
4. Results are calculated:
   - **Pass (3/3 correct)**: User proceeds to selected tier
   - **Fail (<3 correct)**: User sees retry option or can return to Basic tier

## Testing

Run utility tests:
```bash
node -e "
const { getGatekeeperQuestions } = require('./lib/gatekeeperUtils.js');
const questions = getGatekeeperQuestions('learn-math', 'Intermediate');
console.log('Questions loaded:', questions.length);
"
```

## Implementation Notes

- **Backward Compatibility**: Apps without gatekeeper questions continue to use DiagnosticQuiz (30% pass requirement)
- **Subject Names**: Must match exactly between JSON data and APP_TO_SUBJECT_MAP
- **Tier Names**: Case-insensitive (automatically capitalized in code)
- **Question Format**: Supports LaTeX math notation (e.g., `$\\log_{10}(1000)$`)

## Future Enhancements

Possible improvements:
- [ ] Question randomization per attempt
- [ ] Option order randomization
- [ ] Time limits per question
- [ ] Detailed explanations after completion
- [ ] Progress tracking across attempts
- [ ] Analytics on pass/fail rates
