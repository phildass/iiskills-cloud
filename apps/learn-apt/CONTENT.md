# Learn-Apt Content Structure

## Overview
The learn-apt app provides aptitude tests for various competitive exams including IAS, IIT-JEE, NEET, and general aptitude assessments.

## Content Types
- **Tests**: Aptitude tests covering logical reasoning, numerical ability, verbal reasoning, and data interpretation

## Directory Structure
```
apps/learn-apt/
├── manifest.json              # Content manifest for indexing
├── src/
│   ├── data/                  # Test data and questions
│   ├── components/            # React components
│   └── pages/                 # Next.js pages
├── public/
│   └── assets/               # Static assets
└── CONTENT.md                # This file
```

## Content Organization

### Test Categories
1. **Logical Reasoning**
   - Pattern Recognition
   - Sequences and Series
   - Puzzles
   - Critical Reasoning

2. **Numerical Ability**
   - Basic Arithmetic
   - Percentages and Ratios
   - Time and Work
   - Profit and Loss
   - Data Interpretation

3. **Verbal Reasoning**
   - Analogies
   - Antonyms and Synonyms
   - Reading Comprehension
   - Sentence Completion

4. **Data Interpretation**
   - Tables
   - Charts and Graphs
   - Pie Charts
   - Line Graphs

### Exam-Specific Tests
- **IAS/Civil Services**: Comprehensive aptitude tests for UPSC exams
- **JEE**: Aptitude sections for engineering entrance
- **NEET**: Reasoning and general aptitude for medical entrance
- **General Aptitude**: For placement tests and general assessment

## Metadata Schema
Each test in manifest.json includes:
- `id`: Unique test identifier
- `type`: Always "test" for this app
- `title`: Test name
- `description`: Brief description
- `tags`: Keywords for search (e.g., "aptitude", "logical-reasoning", "ias")
- `app`: "learn-apt"
- `url`: Test access URL
- `customFields`:
  - `duration`: Test duration in minutes
  - `totalQuestions`: Number of questions
  - `difficulty`: "beginner", "intermediate", or "advanced"
  - `examType`: Optional exam type (e.g., "ias", "jee")

## Content Discovery
This app's content is indexed in:
- `/packages/content-sdk/meta-index.json` - Central index
- `manifest.json` - App-specific content manifest

## Integration with Content SDK
Use `@iiskills/content-sdk` to:
- Search for aptitude tests across all apps
- Filter by exam type, difficulty, or topic
- Aggregate with content from other educational apps

## Example Queries
- "Aptitude tests for IAS" → Returns IAS-specific tests from this app + exam-prep modules
- "Logical reasoning beginner" → Returns beginner-level logical reasoning tests
- "Data interpretation practice" → Returns all data interpretation tests
