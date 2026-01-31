# AI Content Seed Data Generator

This script generates comprehensive AI/Data Science course content using OpenAI's LLM API.

## Overview

The `seed_data.js` script creates:
- **10 Modules** covering AI & Data Science topics
- **10 Lessons per Module** (100 lessons total)
- **5-Question Quiz per Lesson** with multiple choice answers
- **Final Exam** with 20 comprehensive questions

## Module Topics

1. Introduction to AI & Data Literacy
2. Python Essentials for AI
3. Data Preprocessing & Feature Engineering
4. Supervised Learning: Regression & Classification
5. Unsupervised Learning & Clustering
6. Introduction to Neural Networks
7. Model Evaluation & Deployment
8. Freelance AI Services & Monetization
9. AI Product & Tool Creation (Prompt Engineering)
10. Career Pathways, Portfolio & Interview Prep

## Requirements

- **OpenAI API Key**: Required for content generation
- **Supabase Credentials** (optional): For uploading to database

## Usage

### Basic Usage (Generate JSON only)

```bash
# Set your OpenAI API key
export OPENAI_API_KEY=sk-...

# Run the script
npm run seed:ai-content
```

This will generate `data/learn-ai-seed.json` with all the course content.

### With Supabase Upload

To upload to Supabase, simply set the required environment variables before running:

```bash
# Set all required credentials
export OPENAI_API_KEY=sk-...
export SUPABASE_URL=https://your-project.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Run the script - it will automatically upload when credentials are present
npm run seed:ai-content
```

This will:
1. Generate the JSON file
2. Upload modules, lessons, and quizzes to Supabase

## Output Format

The generated JSON follows this structure:

```json
{
  "generatedAt": "2024-01-31T12:00:00.000Z",
  "modules": [
    {
      "moduleId": 1,
      "moduleTitle": "Introduction to AI & Data Literacy",
      "lessons": [
        {
          "lessonId": 1,
          "title": "What is Artificial Intelligence?",
          "content": "Lesson content (max 400 words)...",
          "quiz": {
            "questions": [
              {
                "q": "What is AI?",
                "options": ["A", "B", "C", "D"],
                "answerIndex": 0
              }
            ]
          }
        }
      ]
    }
  ],
  "finalExam": {
    "totalQuestions": 20,
    "passThreshold": 13,
    "questions": [...]
  }
}
```

## Content Guidelines

The script generates content optimized for:
- **Indian learners** seeking practical AI skills
- **Monetization focus**: Freelancing, job preparation, career building
- **Accessibility**: Simple language, clear examples
- **Engagement**: Varied question types testing both theory and application

Each lesson:
- Maximum 5 paragraphs
- Maximum 400 words
- Includes India-relevant examples where applicable

Each quiz:
- 5 multiple-choice questions
- 4 options per question
- Mix of conceptual and applied questions

## Quiz Behavior

**Important**: This app follows the pattern where objective-type questions automatically move to the next question when an answer is selected. This provides a smooth, modern UX consistent with other apps in the platform.

### Implementation Example

When implementing a quiz component that uses this seed data, the answer selection handler should automatically advance to the next question:

```javascript
const handleAnswerSelect = (questionId, answerIndex) => {
  // Save the answer
  setAnswers({
    ...answers,
    [questionId]: answerIndex,
  });
  
  // Auto-advance to next question after a brief delay
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - submit or show results
      handleSubmitQuiz();
    }
  }, 300); // 300ms delay for visual feedback
};
```

This auto-progression pattern:
- Speeds up quiz completion
- Reduces clicks/taps required
- Provides immediate feedback
- Matches user expectations from modern quiz apps

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `OPENAI_API_KEY` | Yes | OpenAI API access for content generation |
| `SUPABASE_URL` | Optional | Supabase project URL for upload |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service key for upload |

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit API keys to the repository
- Add keys to `.env.local` or export them in your shell
- The `data/` directory is gitignored to prevent accidental commits
- Use service role keys only in secure environments

## Database Schema

If uploading to Supabase, ensure these tables exist:

### modules
- `id` (integer, primary key)
- `title` (text)

### lessons
- `module_id` (integer, foreign key)
- `lesson_id` (integer)
- `title` (text)
- `content` (text)

### quizzes
- `module_id` (integer)
- `lesson_id` (integer)
- `questions` (jsonb)

## Customization

You can modify the script to:
- Change module topics (edit `MODULE_TITLES` array)
- Adjust lesson count (change `LESSONS_PER_MODULE`)
- Modify word limit (change `LESSON_WORD_LIMIT`)
- Use different OpenAI models (change `MODEL` constant)

## Rate Limiting

The script includes built-in delays:
- 800ms between lesson generations
- 1200ms between modules
- Exponential backoff on retries

This respects OpenAI's rate limits. For faster generation with higher tier API access, you can adjust the `sleep()` calls in the code.

## Error Handling

The script includes:
- Automatic retry (3 attempts per lesson)
- Validation of LLM output structure
- Graceful fallback for final exam generation
- Detailed error logging

## Output Location

Generated files are saved to:
```
data/
├── learn-ai-seed.json    # Complete course content
```

This directory is gitignored by default.

## Integration

To integrate the generated content into your app:

1. **Direct JSON Import**: Load `learn-ai-seed.json` in your application
2. **Supabase Upload**: Use the `--upload` flag to populate your database
3. **Manual Review**: Review and edit content before deployment
4. **Staging Environment**: Test content in a staging environment first

## Example Workflow

```bash
# 1. Generate content
export OPENAI_API_KEY=sk-...
npm run seed:ai-content

# 2. Review the generated JSON
cat data/learn-ai-seed.json | jq '.modules[0].lessons[0]'

# 3. If satisfied, upload to Supabase
export SUPABASE_URL=https://...
export SUPABASE_SERVICE_ROLE_KEY=...
npm run seed:ai-content  # Will automatically upload with credentials set
```

## Troubleshooting

### "OPENAI_API_KEY is required"
- Ensure you've exported the API key in your current shell session
- Or add it to `.env.local` and load it with `dotenv`

### LLM returns invalid JSON
- The script retries up to 3 times
- Check your OpenAI API quota and rate limits
- Verify the model name is correct and available

### Supabase upload fails
- Ensure tables exist with correct schema
- Verify service role key has proper permissions
- Check Supabase connection and credentials

## License

This script is part of the IISKILLS Cloud platform. See main repository LICENSE for details.
