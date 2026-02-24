# Unified Content Format Documentation

## Overview

The unified content format provides a standardized structure for all learning content across the iiskills-cloud platform. This ensures consistency in lesson delivery, easier content creation, and better learning outcomes.

## Core Principles

### Three-Level Structure

All subjects follow a consistent progression path:

1. **Basic Level** - Literacy
   - Build foundational understanding
   - Introduce core concepts
   - Focus on "what" and "why"

2. **Intermediate Level** - Application
   - Apply concepts to solve problems
   - Develop practical skills
   - Connect theory to practice

3. **Advanced Level** - Specialization
   - Master advanced topics
   - Explore cutting-edge concepts
   - Prepare for professional application

### Module Counts by Subject

| Subject    | Basic | Intermediate | Advanced | Total |
|------------|-------|--------------|----------|-------|
| Physics    | 6     | 8            | 6        | 20    |
| Math       | 7     | 9            | 5        | 21    |
| Geography  | 5     | 7            | 5        | 17    |
| Chemistry  | 6     | 8            | 6        | 20    |

## Content Structure

### Module Format

```javascript
{
  id: number,              // Unique module ID
  level: string,           // "Basic", "Intermediate", or "Advanced"
  title: string,           // Module name
  description: string,     // Brief description
  lessons: [...]           // Array of lesson objects
}
```

### Lesson Format

Every lesson follows the same 5-part structure:

#### 1. Hook 🎣
**Purpose**: Capture attention and create curiosity

- Short, engaging scenario (2-3 sentences)
- Relatable real-world example
- Poses a question or presents a puzzle

**Example**: 
> "Think of a cheetah chasing a gazelle across the savanna at 70 mph. Is the cheetah just fast, or is there more to its motion?"

#### 2. Core Concept 💡
**Purpose**: Teach the main idea

- Clear, comprehensive explanation
- Break down complex ideas
- Use formatting for emphasis:
  - **Bold** for key terms
  - Bullet points for lists
  - Examples and analogies

**Structure**:
```
**Main Concept:**
Clear definition or explanation

**Key Points:**
• Point 1
• Point 2
• Point 3

**Examples:**
Real-world applications
```

#### 3. Formula 📐
**Purpose**: Provide mathematical/logical framework (if applicable)

- Mathematical equations
- Logical relationships
- Key principles

**Examples**:
- `v = Δx / t` (Physics)
- `Percentage = (part/whole) × 100%` (Math)
- `Atomic Number = Number of Protons` (Chemistry)

#### 4. Interactive Exercise 🎮
**Purpose**: Active learning and application

**Format**:
```javascript
{
  type: "tap-to-reveal",     // Type of interaction
  prompt: string,            // Question or scenario
  answer: string             // Solution with explanation
}
```

**Example**:
```
Prompt: "A car goes from 0 to 60 mph in 6 seconds. What's its average acceleration?"
Answer: "10 mph per second (or about 4.5 m/s²)"
```

#### 5. Test ✅
**Purpose**: Assess understanding and reinforce learning

**Format**:
```javascript
{
  questions: [
    {
      question: string,
      options: [string, string, string, string],
      correctAnswer: number,     // Index of correct option (0-3)
      explanation: string        // Why this answer is correct
    }
  ]
}
```

**Best Practices**:
- 2-5 questions per lesson
- Mix difficulty levels
- Always provide explanations
- Test understanding, not memorization

## Creating New Content

### Step 1: Plan Your Module

1. Choose appropriate level (Basic/Intermediate/Advanced)
2. Define clear learning objectives
3. Break down into logical lessons
4. Ensure progression from simple to complex

### Step 2: Write Each Lesson

Use this template:

```javascript
{
  id: 1,
  title: "Descriptive Title",
  hook: "Engaging scenario that relates to learners...",
  coreConcept: `
**Main Idea:**
Clear explanation

**Key Points:**
• Important detail 1
• Important detail 2
• Important detail 3

**Why It Matters:**
Real-world relevance
  `,
  formula: "key = formula or principle",
  interactive: {
    type: "tap-to-reveal",
    prompt: "Thought-provoking question?",
    answer: "Clear answer with explanation"
  },
  test: {
    questions: [
      {
        question: "Assessment question?",
        options: [
          "Option A",
          "Option B",
          "Option C (correct)",
          "Option D"
        ],
        correctAnswer: 2,
        explanation: "Because [clear reasoning]"
      }
    ]
  }
}
```

### Step 3: Add to Subject Content File

Add your module to the appropriate file in `/data/`:
- `physics-content.js`
- `math-content.js`
- `chemistry-content.js`
- `geography-content.js`

### Step 4: Test Your Content

1. Verify the module appears in curriculum
2. Check lesson rendering
3. Test interactive elements
4. Ensure quizzes work correctly

## Using the Components

### StandardizedLesson Component

Renders lessons in the unified format:

```javascript
import StandardizedLesson from '../../../components/shared/StandardizedLesson';

<StandardizedLesson 
  lesson={lessonData}
  onComplete={(result) => handleLessonComplete(result)}
/>
```

### CurriculumTable Component

Displays structured curriculum by level:

```javascript
import CurriculumTable from '../../../components/shared/CurriculumTable';

<CurriculumTable
  subject="Physics"
  basicModules={physicsContent.basic}
  intermediateModules={physicsContent.intermediate}
  advancedModules={physicsContent.advanced}
/>
```

### SubjectComparisonTable Component

Shows module counts across all subjects:

```javascript
import { SubjectComparisonTable } from '../../../components/shared/CurriculumTable';

<SubjectComparisonTable />
```

## File Structure

```
iiskills-cloud/
├── data/
│   ├── unified-content-structure.js    # Schema and helpers
│   ├── physics-content.js              # Physics curriculum
│   ├── math-content.js                 # Math curriculum
│   ├── chemistry-content.js            # Chemistry curriculum
│   └── geography-content.js            # Geography curriculum
├── components/shared/
│   ├── StandardizedLesson.js           # Lesson renderer
│   ├── CurriculumTable.js              # Curriculum display
│   └── ...
└── apps/
    ├── learn-physics/
    │   ├── lib/curriculumGenerator.js  # Imports from /data
    │   └── pages/curriculum.js         # Uses CurriculumTable
    ├── learn-math/
    ├── learn-chemistry/
    └── learn-geography/
```

## Content Quality Guidelines

### Hooks (🎣)
- ✅ Use relatable scenarios
- ✅ Pose intriguing questions
- ✅ Keep it brief (2-3 sentences)
- ❌ Avoid complex jargon
- ❌ Don't give away the answer

### Core Concepts (💡)
- ✅ Start with simplest explanation
- ✅ Build complexity gradually
- ✅ Use examples and analogies
- ✅ Highlight key terms
- ❌ Avoid walls of text
- ❌ Don't assume prior knowledge

### Formulas (📐)
- ✅ Explain what each variable means
- ✅ Show units where applicable
- ✅ Provide context for when to use
- ❌ Don't just state formula without explanation

### Interactive (🎮)
- ✅ Make prompts specific and clear
- ✅ Provide step-by-step solutions
- ✅ Show working, not just answer
- ❌ Don't make it too easy or too hard

### Tests (✅)
- ✅ Test understanding, not tricks
- ✅ Provide helpful explanations
- ✅ Include common misconceptions as wrong answers
- ❌ Avoid ambiguous questions
- ❌ Don't use "all of the above" or "none of the above"

## Migration from Legacy Content

If you have existing content in a different format:

1. **Analyze Structure**: Identify what maps to each section
2. **Extract Hook**: Find opening scenarios or attention-grabbers
3. **Identify Core Content**: Main explanatory text
4. **Extract Formulas**: Mathematical or logical relationships
5. **Convert Exercises**: Transform existing practice problems
6. **Create Tests**: Write new questions if needed

Example migration:

```javascript
// Legacy format
const oldLesson = {
  title: "Velocity",
  content: "Velocity is speed with direction. Formula: v = d/t"
};

// New format
const newLesson = {
  id: 1,
  title: "What is Velocity?",
  hook: "Think of a cheetah chasing prey...",
  coreConcept: `**Speed vs. Velocity:**
  
  • Speed: scalar (magnitude only)
  • Velocity: vector (magnitude + direction)`,
  formula: "v = Δx / t",
  interactive: {
    type: "tap-to-reveal",
    prompt: "You run in a circle at 5 m/s. Constant speed or velocity?",
    answer: "Speed constant, velocity changes (direction changes!)"
  },
  test: {
    questions: [/* ... */]
  }
};
```

## Validation

Use the validation function to check content structure:

```javascript
import { validateContentStructure } from '../data/unified-content-structure';

const validation = validateContentStructure(myContent);
if (!validation.valid) {
  console.error('Content errors:', validation.errors);
}
```

## Best Practices

1. **Consistency**: Always follow the 5-part lesson structure
2. **Progression**: Order lessons from simple to complex
3. **Engagement**: Make hooks relevant and interesting
4. **Clarity**: Use simple language, explain jargon
5. **Practice**: Include hands-on exercises
6. **Assessment**: Test true understanding
7. **Feedback**: Provide helpful explanations in quizzes

## Future Enhancements

Planned additions to the unified format:

- [ ] Video integration
- [ ] Interactive simulations
- [ ] Code editors for programming topics
- [ ] Peer discussion threads
- [ ] Adaptive difficulty
- [ ] Gamification elements
- [ ] Cross-subject connections
- [ ] AI-powered personalization

## Support

For questions or suggestions about the unified content format:
1. Review this documentation
2. Check existing content examples
3. Open an issue on GitHub
4. Contact the content team

## Version History

- **v1.0.0** (Current): Initial unified format implementation
  - Three-level structure (Basic/Intermediate/Advanced)
  - Five-part lesson format
  - Shared components
  - Physics, Math, Chemistry, Geography content

---

*Last updated: February 2026*
