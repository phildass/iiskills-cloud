# Sync Learning Platform Content

This directory contains the comprehensive content for the dual-app sync learning platform, as specified in the [SYNC_LEARNING_PLATFORM_SPEC.md](../../SYNC_LEARNING_PLATFORM_SPEC.md) document.

## Directory Structure

```
data/sync-platform/
├── schemas/                          # JSON schemas for validation
│   ├── module.schema.json           # Module metadata schema
│   ├── lesson.schema.json           # Lesson content schema
│   └── quiz.schema.json             # Quiz and assessment schema
│
├── learn-ai/                        # Learn AI app content
│   ├── basics/                      # Beginner tier (6 modules)
│   │   ├── module-1-ai-foundations.json
│   │   ├── module-2-prompt-engineering.json
│   │   ├── lesson-*.json
│   │   └── quiz-*.json
│   ├── intermediate/                # Intermediate tier (6 modules)
│   └── advanced/                    # Advanced tier (6 modules)
│
└── learn-developer/                 # Learn Developer app content
    ├── basics/                      # Beginner tier (6 modules)
    ├── intermediate/                # Intermediate tier (6 modules)
    └── advanced/                    # Advanced tier (6 modules)
```

## Content Types

### 1. Modules
Modules are high-level containers that group related lessons. Each tier (basics, intermediate, advanced) contains 6 modules.

**File naming:** `module-{order}-{module-id}.json`

**Example:** `module-2-prompt-engineering.json`

### 2. Lessons
Lessons are the core learning content. Each module contains 5-8 lessons with 500-800 words of content.

**File naming:** `lesson-{module-id}-{lesson-number}.json`

**Example:** `lesson-prompt-engineering-1.json`

### 3. Quizzes
Quizzes test comprehension of module content. Each module has one quiz with 10 questions. Questions include:
- 4 answer options
- 1 "I don't know" option (always option 5)
- Rationale for correct answer
- Deep dive explanation with cross-app reference

**File naming:** `quiz-{module-id}.json`

**Example:** `quiz-prompt-engineering.json`

## Synced Modules

Three modules are "synced" across both apps, meaning completion in one app unlocks the equivalent module in the other:

| Module | Learn Developer | Learn AI |
|--------|----------------|----------|
| **Logic & Algorithms** | Control flow, loops, if/else | Chain-of-Thought, reasoning |
| **Data Structures** | Arrays, objects, trees | Vectors, embeddings, tensors |
| **API Management** | REST, GraphQL | LLM APIs, OpenAI, Anthropic |

Synced modules have `isSyncedModule: true` and specify their `syncPartnerApp` and `syncPartnerModuleId`.

## Pass-Gate Logic

The 30% pass-gate is central to the platform:

- Students must score ≥30% on module quizzes to progress
- Passing a module unlocks:
  - Next module in current app
  - Related module in partner app (for synced modules)
  - Cross-app recommendations

Failing triggers the **AI Counselor** feedback system with targeted review suggestions.

## Cross-App References

Every lesson and quiz question includes cross-app references to reinforce the dual-app learning experience.

**In Lessons:**
```json
{
  "crossAppReferences": [
    {
      "appId": "learn-developer",
      "moduleId": "logic-algorithms",
      "lessonId": "algorithm-thinking",
      "context": "Just as algorithms require clear instructions..."
    }
  ]
}
```

**In Quizzes:**
```json
{
  "deepDive": {
    "explanation": "...",
    "crossAppReference": {
      "appId": "learn-developer",
      "moduleId": "js-fundamentals",
      "topic": "Function parameters"
    }
  }
}
```

## Content Standards

### Lesson Content (textBody)
- **Length:** 500-800 words
- **Format:** HTML with semantic tags (h2, h3, p, ul, ol, blockquote)
- **Style:** Clear, professional English
- **Avoid:** Excessive metaphors, jargon without explanation
- **Include:**
  - Introduction (context and relevance)
  - Core concepts (main teaching points)
  - Practical examples
  - Key takeaways

### Pro Tips
Each lesson includes 1-3 "Pro Tips" callout boxes:
- **dev-sync:** Cross-reference to Developer app
- **ai-shortcut:** Cross-reference to AI app
- **best-practice:** General advice
- **warning:** Common pitfalls

### Interactive Code Snippets
Lessons may include editable code examples:
```json
{
  "interactiveCodeSnippet": {
    "language": "python",
    "code": "# Example code here",
    "editable": true,
    "hasTests": false
  }
}
```

### Quiz Questions
- **Question Text:** Clear, specific, testable
- **Options:** 4 meaningful answers + "I don't know"
- **Rationale:** 1-2 sentences explaining the correct answer
- **Deep Dive:** 2-3 sentences with real-world context and cross-app reference
- **Difficulty:** Tag as easy, medium, or hard for analytics

## Sample Content

This directory includes sample content for:
- **Module 2: Prompt Engineering (Learn AI)**
  - Module metadata
  - Lesson 1: The Anatomy of a Perfect Prompt
  - Complete 10-question quiz

This demonstrates the quality and structure expected for all content.

## Content Generation Workflow

### Phase 1: Structure (Current)
1. ✅ Create JSON schemas
2. ✅ Define directory structure
3. ✅ Build sample module/lesson/quiz
4. ⏳ Validate structure with development team

### Phase 2: Content Creation
1. Generate remaining modules for Basics tier
2. Populate all lessons (5-8 per module)
3. Create quizzes (10 questions per module)
4. Add cross-app references throughout

### Phase 3: Review & Refinement
1. Technical accuracy review
2. Cross-app consistency check
3. User testing with sample audience
4. Iterative improvements

## Validation

All content should validate against the schemas:

```bash
# Example validation (requires ajv-cli)
ajv validate -s schemas/module.schema.json -d learn-ai/basics/module-2-prompt-engineering.json
ajv validate -s schemas/lesson.schema.json -d learn-ai/basics/lesson-prompt-engineering-1.json
ajv validate -s schemas/quiz.schema.json -d learn-ai/basics/quiz-prompt-engineering.json
```

## Integration

Content from this directory will be:
1. Imported into the app-specific data stores
2. Served via API endpoints
3. Rendered in the UI with appropriate styling
4. Tracked for user progress and unlocks

See [SYNC_LEARNING_PLATFORM_SPEC.md](../../SYNC_LEARNING_PLATFORM_SPEC.md) for implementation details.

## Next Steps

1. **Content Population:**
   - Create remaining 17 modules for Learn AI
   - Create all 18 modules for Learn Developer
   - Populate all lessons (approximately 200+ lessons total)
   - Write all quizzes (approximately 36 quizzes)

2. **Quality Assurance:**
   - Peer review for accuracy
   - Check cross-app reference validity
   - Verify difficulty progression
   - Test quiz question quality

3. **Technical Integration:**
   - Build content import scripts
   - Create API endpoints
   - Implement progress tracking
   - Build unlock/sync logic

## Contributing

When creating new content:
1. Follow the established schemas strictly
2. Maintain consistent voice and quality
3. Include cross-app references in every lesson/quiz
4. Validate JSON before committing
5. Follow naming conventions for files
6. Keep word counts within specified ranges

For questions or clarifications, refer to the main specification document.
