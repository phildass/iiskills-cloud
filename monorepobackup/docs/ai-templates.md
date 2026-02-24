# AI Content Templates for Cricket Universe

This document provides LLM prompts and templates for generating cricket-related content including trivia questions, player summaries, and validation guidelines.

## Table of Contents
1. [Trivia Question Generation](#trivia-question-generation)
2. [Distractor Generation](#distractor-generation)
3. [Player Summary Generation](#player-summary-generation)
4. [Content Validation](#content-validation)

---

## Trivia Question Generation

### Template: Match Event to Trivia

**Purpose**: Convert match events into engaging trivia questions.

**Input Data**:
- Match details (teams, date, venue, format)
- Key events (wickets, boundaries, milestones)
- Player statistics
- Match result

**Prompt Template**:

```
You are a cricket trivia expert. Generate an engaging multiple-choice trivia question based on the following match event:

Match: {team_a} vs {team_b}
Date: {match_date}
Venue: {venue}
Event: {event_description}

Requirements:
- Question should be clear and unambiguous
- Focus on the specific event provided
- Difficulty level: {difficulty} (easy/medium/hard)
- Include one correct answer and three plausible distractors
- Avoid questions that require memorization of exact numbers unless they're significant milestones
- Make the question engaging and interesting for cricket fans

Format your response as JSON:
{
  "question": "The question text",
  "correct_answer": "Correct answer",
  "distractors": ["Distractor 1", "Distractor 2", "Distractor 3"],
  "explanation": "Brief explanation of why the answer is correct",
  "difficulty": "easy|medium|hard",
  "category": "batting|bowling|fielding|general"
}
```

**Example Usage**:

Input:
```
Match: India vs Australia
Date: 2023-11-19
Venue: Eden Gardens, Kolkata
Event: Virat Kohli scored his 50th ODI century
```

Expected Output:
```json
{
  "question": "Against which team did Virat Kohli score his historic 50th ODI century in 2023?",
  "correct_answer": "Australia",
  "distractors": ["England", "South Africa", "New Zealand"],
  "explanation": "Virat Kohli achieved his 50th ODI century against Australia at Eden Gardens, Kolkata on November 19, 2023, equaling Sachin Tendulkar's record.",
  "difficulty": "medium",
  "category": "batting"
}
```

---

## Distractor Generation

### Template: Generate Plausible Wrong Answers

**Purpose**: Create 3 plausible but incorrect answer options for trivia questions.

**Prompt Template**:

```
You are an expert at creating plausible but incorrect answers for cricket trivia.

Question: {question_text}
Correct Answer: {correct_answer}
Context: {additional_context}

Generate 3 distractors (wrong answers) that are:
1. Plausible - they could seem correct to someone with partial knowledge
2. Relevant - they relate to cricket and the question context
3. Balanced - mix of easier and harder to eliminate options
4. Not obviously wrong - avoid absurd or impossible answers
5. Pedagogically valuable - wrong answers that teach something when explained

Format as JSON array:
["Distractor 1", "Distractor 2", "Distractor 3"]
```

**Guidelines for Good Distractors**:

1. **Use Similar Categories**:
   - If correct answer is a player, use other players in similar roles
   - If correct answer is a venue, use other famous cricket venues
   - If correct answer is a number, use nearby numbers or common milestones

2. **Common Misconceptions**:
   - Use answers that represent common mistakes or confusions
   - Include answers that might be correct for related but different scenarios

3. **Near Misses**:
   - Include answers that are almost correct (e.g., runner-up instead of winner)
   - Use answers from same match/series but different specific event

**Example**:

Question: "Who holds the record for most runs in a single World Cup tournament?"
Correct Answer: "Sachin Tendulkar (673 runs in 2003)"

Good Distractors:
- "Rohit Sharma (648 runs in 2019)" - Near miss, recent event
- "Kumar Sangakkara (541 runs in 2015)" - High scorer, different tournament
- "Matthew Hayden (659 runs in 2007)" - Close number, different player

---

## Player Summary Generation

### Template: Structured Data to Narrative Summary

**Purpose**: Convert structured player data into engaging, human-readable summaries.

**Input Data Structure**:
```json
{
  "player_name": "string",
  "country": "string",
  "role": "batsman|bowler|all-rounder|wicket-keeper",
  "batting_style": "string",
  "bowling_style": "string",
  "career_stats": {
    "matches": "number",
    "runs": "number",
    "wickets": "number",
    "centuries": "number",
    "fifties": "number",
    "average": "number",
    "strike_rate": "number"
  },
  "achievements": ["string"],
  "notable_performances": ["string"],
  "playing_period": "string"
}
```

**Prompt Template**:

```
You are a cricket journalist writing player profiles. Create an engaging 2-3 paragraph summary of the following player based on their statistics and achievements.

Player Data:
{structured_player_data}

Requirements:
- Write in an engaging, professional tone
- Highlight the player's most significant achievements
- Include context about their playing style and impact
- Mention 1-2 memorable performances if available
- Keep it factual - only use information provided in the data
- Length: 150-250 words
- Target audience: Cricket enthusiasts with moderate knowledge

Format your response as plain text paragraphs.
```

**Example**:

Input:
```json
{
  "player_name": "Virat Kohli",
  "country": "India",
  "role": "batsman",
  "batting_style": "Right-hand bat",
  "bowling_style": "Right-arm medium",
  "career_stats": {
    "matches": 254,
    "runs": 12311,
    "centuries": 43,
    "average": 53.62,
    "strike_rate": 93.17
  },
  "achievements": ["50 ODI centuries", "Fastest to 10,000 ODI runs"],
  "notable_performances": ["183 vs Pakistan in 2012"]
}
```

Output:
```
Virat Kohli stands as one of the most prolific batsmen in modern cricket, with a remarkable ODI career spanning over a decade. Known for his aggressive batting style and exceptional ability to chase down targets, Kohli has amassed 12,311 runs in 254 matches at an impressive average of 53.62. His consistency is reflected in his 43 ODI centuries, including the historic 50th century that equaled Sachin Tendulkar's legendary record.

Kohli's aggressive approach is evident in his strike rate of 93.17, making him equally dangerous in run chases and setting challenging targets. His memorable knock of 183 against Pakistan in 2012 showcased his ability to dominate world-class bowling attacks. As a right-hand batsman who occasionally bowls medium pace, Kohli has revolutionized the art of chasing in limited-overs cricket, becoming synonymous with successful run chases for India.
```

---

## Content Validation

### Plausibility Checks

**Purpose**: Validate LLM-generated content for factual accuracy and quality.

**Validation Checklist**:

#### 1. Factual Accuracy
- [ ] Player names are spelled correctly
- [ ] Team names are accurate
- [ ] Venues exist and are correctly named
- [ ] Dates are plausible (not in the future, within cricket history)
- [ ] Statistics are within reasonable ranges
- [ ] Match formats are correctly identified (Test/ODI/T20)

#### 2. Cricket Logic
- [ ] Rules and terminology are used correctly
- [ ] Game situations are possible within cricket rules
- [ ] Player roles match their actual specializations
- [ ] Statistics make sense (e.g., strike rate ranges, reasonable averages)

#### 3. Question Quality
- [ ] Question is unambiguous
- [ ] Correct answer is verifiable
- [ ] Distractors are plausible but clearly wrong
- [ ] No two answers could be considered correct
- [ ] Question tests knowledge, not guessing ability

#### 4. Language Quality
- [ ] Grammar is correct
- [ ] Spelling is accurate
- [ ] Tone is appropriate (professional, engaging)
- [ ] No offensive or biased language
- [ ] Clear and concise wording

### Automated Validation Rules

**Numeric Ranges** (flag for review if outside these ranges):
- Batting Average: 0-100
- Bowling Average: 10-50
- Strike Rate (batting): 40-200
- Economy Rate: 2-12
- Centuries: 0-100
- Matches: 0-500

**String Validation**:
- Player names: 2-50 characters, alphabetic with spaces and hyphens
- Team names: Must be from recognized cricket-playing nations or franchises
- Venues: Must match known cricket stadiums (maintain a reference list)

### Paraphrasing Guidelines

**Purpose**: Ensure generated content is original and doesn't plagiarize sources.

**Paraphrasing Rules**:
1. **Structure Variation**: Change sentence structure even when facts remain the same
2. **Synonym Usage**: Use different words while maintaining cricket terminology accuracy
3. **Perspective Shift**: Tell the same fact from a different angle
4. **Context Addition**: Add relevant context that wasn't in the source
5. **Length Variation**: Expand or condense while maintaining information

**Example**:

Original: "Sachin Tendulkar scored 100 international centuries."

Acceptable Paraphrases:
- "The Little Master achieved a century of centuries in international cricket."
- "Tendulkar became the first player to reach 100 international hundreds."
- "With 100 centuries across Tests and ODIs, Sachin Tendulkar set an unprecedented record."

Unacceptable (too similar):
- "Sachin Tendulkar has 100 international centuries."
- "Tendulkar scored one hundred centuries in international cricket."

---

## Quality Metrics

Track these metrics to ensure AI-generated content quality:

1. **Acceptance Rate**: % of generated questions accepted without modification
2. **Fact-Check Pass Rate**: % passing automated validation
3. **Human Review Agreement**: Inter-rater reliability between reviewers
4. **Player Feedback**: User ratings on question quality and fairness
5. **Error Categories**: Track most common types of errors for improvement

**Target Benchmarks** (MVP):
- Acceptance Rate: > 70%
- Fact-Check Pass Rate: > 90%
- Human Review Agreement: > 85%
- Average User Rating: > 4.0/5.0

---

## Usage Notes

1. **Always validate** AI-generated content before publishing
2. **Maintain a feedback loop** - log errors and use them to improve prompts
3. **Version your prompts** - track which prompt versions produce best results
4. **Human oversight** - Always have human review before content goes live
5. **Update templates** - Refine based on real-world performance

## Next Steps for Phase 2

- Implement automated fact-checking against cricket databases (Cricinfo API, etc.)
- Build a review dashboard for bulk content validation
- Create difficulty calibration system based on user performance
- Develop specialized templates for different question types (statistics, history, rules)
- Integrate real-time match data for timely trivia generation
