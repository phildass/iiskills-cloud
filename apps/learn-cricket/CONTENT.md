# Learn-Cricket Content Structure

## Overview
The learn-cricket app provides educational content about cricket, including rules, techniques, history, and insights into professional cricket.

## Content Types
- **Lessons**: Educational content teaching cricket fundamentals and techniques
- **Articles**: In-depth articles about cricket history, leagues, and culture
- **Sports**: General sports-related content focused on cricket

## Directory Structure
```
apps/learn-cricket/
├── manifest.json              # Content manifest for indexing
├── content/
│   ├── lessons/              # Markdown lessons
│   ├── articles/             # Cricket articles
│   └── media/                # Images and videos
├── pages/
│   ├── lessons/              # Lesson pages
│   ├── articles/             # Article pages
│   └── index.js
└── CONTENT.md                # This file
```

## Content Organization

### Lesson Categories
1. **Basics & Rules**
   - Cricket Rules and Regulations
   - Field Setup and Positions
   - Scoring System
   - Match Formats (Test, ODI, T20)

2. **Batting Techniques**
   - Batting Stance and Grip
   - Defensive Shots
   - Attacking Shots (Drive, Cut, Pull, Hook)
   - Running Between Wickets

3. **Bowling Techniques**
   - Fast Bowling Action
   - Spin Bowling Variations
   - Line and Length
   - Bowling Strategies

4. **Fielding Skills**
   - Catching Techniques
   - Ground Fielding
   - Wicket Keeping
   - Throwing and Accuracy

### Article Categories
1. **Cricket History**
   - Origins of Cricket
   - World Cup History
   - Legendary Matches
   - Evolution of the Game

2. **Professional Cricket**
   - Indian Premier League (IPL)
   - International Cricket Council (ICC)
   - Test Championship
   - Major Cricket Nations

3. **Players & Records**
   - Greatest Batsmen
   - Legendary Bowlers
   - Cricket Records
   - Hall of Fame

## Metadata Schema
Each content item in manifest.json includes:
- `id`: Unique content identifier
- `type`: "lesson", "article", or "sports"
- `title`: Content title
- `description`: Brief description
- `tags`: Keywords (e.g., "cricket", "batting", "ipl")
- `app`: "learn-cricket"
- `url`: Content URL
- `customFields`:
  - For lessons:
    - `difficulty`: "beginner", "intermediate", "advanced"
    - `duration`: Estimated reading/learning time in minutes
    - `objectives`: Learning objectives array
  - For articles:
    - `readTime`: Estimated reading time in minutes
    - `topics`: Array of topics covered

## Content Format
Content is stored in Markdown format with frontmatter:

```markdown
---
id: cricket-rules-basics
type: lesson
title: Cricket Rules - The Basics
difficulty: beginner
duration: 20
tags: [cricket, sports, rules, basics]
---

# Cricket Rules - The Basics

## Introduction
Cricket is a bat-and-ball game played between two teams...

## Field Setup
[Content here]

## Scoring
[Content here]
```

## Content Discovery
This app's content is indexed in:
- `/packages/content-sdk/meta-index.json` - Central index
- `manifest.json` - App-specific content manifest

## Integration with Content SDK
Use `@iiskills/content-sdk` to:
- Search cricket lessons and articles
- Filter by difficulty level or topic
- Aggregate with other sports content
- Cross-reference with general education (sports science)

## Example Queries
- "Cricket basics for beginners" → Returns beginner-level lessons
- "IPL history" → Returns IPL-related articles
- "Batting techniques" → Returns all batting lessons
- "Cricket World Cup" → Returns World Cup history and articles

## Media Assets
- **Images**: Field diagrams, batting/bowling positions, historical photos
- **Videos**: Technique demonstrations, match highlights (when available)
- **Infographics**: Statistics, records, team comparisons

## Learning Paths

### Beginner Path
1. Cricket Rules - The Basics
2. Cricket Formats: Test, ODI, and T20
3. Batting Techniques for Beginners
4. Introduction to Bowling

### Intermediate Path
1. Advanced Batting Shots
2. Bowling Guide - Fast and Spin
3. Fielding Strategies
4. Match Tactics and Strategies

### Cricket Enthusiast Path
1. History of Cricket World Cup
2. Indian Premier League - Complete Guide
3. Greatest Players and Records
4. Modern Cricket Analytics

## Future Enhancements
- Video tutorials for techniques
- Interactive quizzes on cricket rules
- Virtual coaching sessions
- Match analysis tools
- Player statistics database
