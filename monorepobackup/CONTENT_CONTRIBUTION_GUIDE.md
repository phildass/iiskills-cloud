# Content Contribution Guide

## Quick Start for Content Contributors

This guide helps you quickly add new lessons and modules to the iiskills-cloud learning platform.

## Prerequisites

- Basic JavaScript knowledge
- Understanding of the subject you're creating content for
- Familiarity with the unified content format (see UNIFIED_CONTENT_FORMAT.md)

## Adding a New Lesson (5-Minute Guide)

### 1. Choose Your Subject and Level

Navigate to the appropriate file in `/data/`:
- Physics → `physics-content.js`
- Math → `math-content.js`
- Chemistry → `chemistry-content.js`
- Geography → `geography-content.js`

### 2. Find the Right Module

Look for the module where your lesson belongs. Modules are organized by level:
- `basicModules` - Foundation concepts
- `intermediateModules` - Application and practice
- `advancedModules` - Specialization

### 3. Copy This Template

```javascript
{
  id: NEXT_ID,  // Increment from last lesson ID
  title: "Your Lesson Title",
  
  // 🎣 HOOK: Grab attention (2-3 sentences)
  hook: "Start with a relatable scenario or intriguing question...",
  
  // 💡 CORE CONCEPT: Teach the main idea
  coreConcept: `**Main Topic:**

Clear explanation of the concept.

**Key Points:**
• Important point 1
• Important point 2
• Important point 3

**Why It Matters:**
Real-world relevance and applications.`,
  
  // 📐 FORMULA: Mathematical/logical relationship
  formula: "key = formula (if applicable)",
  
  // 🎮 INTERACTIVE: Practice problem
  interactive: {
    type: "tap-to-reveal",
    prompt: "Here's a practice question or scenario...",
    answer: "Step-by-step solution with clear explanation."
  },
  
  // ✅ TEST: Quiz questions (2-5 questions)
  test: {
    questions: [
      {
        question: "What does [concept] mean?",
        options: [
          "Wrong answer",
          "Correct answer",
          "Another wrong answer",
          "Yet another wrong answer"
        ],
        correctAnswer: 1,  // Index (0-3) of correct option
        explanation: "This is correct because [clear reasoning]"
      }
      // Add 1-4 more questions
    ]
  }
}
```

### 4. Fill In Your Content

Work through each section:

**Hook Example:**
```javascript
hook: "Ever wonder why ice floats in water? It seems backwards - shouldn't the solid sink? This property of water is actually essential for life on Earth!"
```

**Core Concept Example:**
```javascript
coreConcept: `**Water's Unique Density:**

Most substances are denser in solid form than liquid. Water is the opposite!

**Why Ice Floats:**
• Water molecules form a hexagonal crystal structure when frozen
• This structure has more space between molecules
• Ice is about 9% less dense than liquid water
• Density = mass / volume

**Life-Saving Importance:**
When lakes freeze, ice forms on top, insulating water below. This allows aquatic life to survive winter!`
```

**Formula Example:**
```javascript
formula: "Density = Mass / Volume | ρ = m/V"
```

**Interactive Example:**
```javascript
interactive: {
  type: "tap-to-reveal",
  prompt: "An ice cube has mass 10g and volume 11cm³. What's its density? Is this more or less than water (1 g/cm³)?",
  answer: "Density = 10g / 11cm³ ≈ 0.91 g/cm³. This is LESS than water, which is why ice floats!"
}
```

**Test Example:**
```javascript
test: {
  questions: [
    {
      question: "Why does ice float in water?",
      options: [
        "It's lighter in color",
        "It's less dense than liquid water",
        "It's colder",
        "Air bubbles make it float"
      ],
      correctAnswer: 1,
      explanation: "Ice has a lower density (0.92 g/cm³) than liquid water (1.0 g/cm³) due to its crystalline structure"
    },
    {
      question: "What would happen if ice were denser than water?",
      options: [
        "Nothing would change",
        "Lakes would freeze from bottom up, killing aquatic life",
        "Water would be colder",
        "Ice would be heavier"
      ],
      correctAnswer: 1,
      explanation: "If ice sank, lakes would freeze solid from bottom up, destroying aquatic ecosystems"
    }
  ]
}
```

### 5. Add Your Lesson to the Module

Insert your lesson into the `lessons` array of the appropriate module:

```javascript
{
  id: 3,
  level: "Basic",
  title: "States of Matter",
  description: "Solid, liquid, gas, and plasma",
  lessons: [
    // ... existing lessons ...
    {
      id: YOUR_LESSON_ID,
      title: "Your New Lesson",
      // ... your lesson content ...
    }
  ]
}
```

### 6. Test Your Lesson

1. Save the file
2. Build the app: `yarn workspace learn-[subject] build`
3. Run dev server: `yarn workspace learn-[subject] dev`
4. Navigate to your module and check the lesson displays correctly
5. Test all interactive elements and quiz questions

## Adding a New Module

### 1. Determine Module Placement

Decide which level (Basic/Intermediate/Advanced) your module belongs to.

### 2. Create Module Structure

```javascript
{
  id: NEXT_MODULE_ID,  // Increment from last module
  level: "Basic",      // or "Intermediate" or "Advanced"
  title: "Module Title",
  description: "Brief description of what students will learn",
  lessons: [
    // Add lessons here (at least 1-2 to start)
  ]
}
```

### 3. Add to Appropriate Array

Add your module to `basicModules`, `intermediateModules`, or `advancedModules`:

```javascript
export const mathBasicModules = [
  // ... existing modules ...
  {
    id: 8,
    level: "Basic",
    title: "Your New Module",
    description: "What students will learn",
    lessons: [
      // Your lessons
    ]
  }
];
```

## Content Quality Checklist

Before submitting your content, verify:

### Hook ✅
- [ ] 2-3 sentences long
- [ ] Relates to real-world experience
- [ ] Creates curiosity
- [ ] No complex jargon

### Core Concept ✅
- [ ] Starts simple, builds complexity
- [ ] Uses **bold** for key terms
- [ ] Includes bullet points for lists
- [ ] Has real-world examples
- [ ] Clear and concise

### Formula ✅
- [ ] Relevant to the concept
- [ ] Variables explained
- [ ] Units shown (if applicable)

### Interactive ✅
- [ ] Clear, specific prompt
- [ ] Shows step-by-step solution
- [ ] Reinforces core concept
- [ ] Not too easy or too hard

### Test ✅
- [ ] 2-5 questions
- [ ] Tests understanding (not tricks)
- [ ] Clear, unambiguous wording
- [ ] Helpful explanations
- [ ] Mix of difficulty levels
- [ ] Wrong answers are plausible

## Common Mistakes to Avoid

❌ **Don't:**
- Use overly complex language
- Skip the hook section
- Make formulas without context
- Create trick questions
- Forget explanations in quiz
- Copy content without attribution
- Assume prior knowledge

✅ **Do:**
- Write for your audience level
- Make learning engaging
- Explain every step
- Test true understanding
- Provide helpful feedback
- Create original content
- Build on previous lessons

## Example: Complete Lesson

Here's a complete, real example from Math:

```javascript
{
  id: 1,
  title: "Understanding Place Value",
  hook: "The digit '5' can mean 5, 50, 500, or even 5,000,000! How does the same digit represent different values?",
  coreConcept: `**Place Value System:**

In our decimal (base-10) system, the position of a digit determines its value:

**Example: 452.8**
• 4 is in the hundreds place = 400
• 5 is in the tens place = 50
• 2 is in the ones place = 2
• 8 is in the tenths place = 0.8

Each place is 10 times the value of the place to its right!`,
  formula: "Place value = digit × 10^position",
  interactive: {
    type: "tap-to-reveal",
    prompt: "In the number 452.8, which digit is in the tenths place?",
    answer: "8 - It's the first position after the decimal point!"
  },
  test: {
    questions: [
      {
        question: "What is the value of the digit 7 in 3,745?",
        options: ["7", "70", "700", "7000"],
        correctAnswer: 2,
        explanation: "The 7 is in the hundreds place, so it represents 700"
      },
      {
        question: "In the number 82.64, what digit is in the tenths place?",
        options: ["8", "2", "6", "4"],
        correctAnswer: 2,
        explanation: "The tenths place is the first position after the decimal point, which is 6"
      }
    ]
  }
}
```

## Getting Help

- **Documentation**: Read UNIFIED_CONTENT_FORMAT.md
- **Examples**: Browse existing content in `/data/` files
- **Questions**: Open an issue on GitHub
- **Review**: Ask for content review before merging

## Submission Process

1. Create a feature branch: `git checkout -b add-[subject]-[module-name]`
2. Add your content to the appropriate file
3. Test thoroughly
4. Commit: `git commit -m "Add [module/lesson name] to [subject]"`
5. Push: `git push origin add-[subject]-[module-name]`
6. Create pull request for review

## Content Review Criteria

Your content will be reviewed for:
- ✅ Accuracy (factually correct)
- ✅ Clarity (easy to understand)
- ✅ Engagement (interesting and relevant)
- ✅ Structure (follows 5-part format)
- ✅ Quality (well-written, no typos)
- ✅ Testing (quiz questions work)

## Tips for Success

1. **Start Small**: Begin with one lesson, not a whole module
2. **Use Templates**: Copy and modify the template above
3. **Test Early**: Check your work frequently
4. **Get Feedback**: Share drafts with colleagues
5. **Iterate**: Improve based on feedback
6. **Stay Consistent**: Follow the established format

## Quick Reference

### File Locations
- Content: `/data/[subject]-content.js`
- Components: `/components/shared/`
- Documentation: `/UNIFIED_CONTENT_FORMAT.md`

### Lesson IDs
- Use sequential IDs
- Check last lesson ID in your module
- Increment by 1

### Level Guidelines
- **Basic**: Introductory concepts, simple examples
- **Intermediate**: Applications, problem-solving
- **Advanced**: Complex topics, specialization

Happy content creating! 🚀
