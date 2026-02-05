# AI Templates & Content Guidelines

This document defines the LLM prompts, validation rules, and content moderation guidelines for Cricket Universe World Cup features.

## Feature Flags

All AI/LLM features are controlled by environment variables:
- `ENABLE_LLM=true` - Enable LLM enrichment (requires `LLM_API_KEY` or `GEMINI_API_KEY`)
- `ENABLE_WORLD_CUP_MODE=true` - Enable World Cup specific content

## Content Safety Policy

### Non-Controversial Content Policy

All generated content MUST adhere to strict content safety rules:

1. **Prohibited Content Categories:**
   - Political commentary or references
   - Religious commentary or references
   - Allegations, rumors, or unverified claims
   - Controversial, defamatory, or inflammatory content
   - Ethnic, racial, or cultural stereotypes
   - Personal attacks or criticism of players beyond professional performance

2. **Content Filtering Process:**
   - All LLM outputs pass through `isFlagged()` function
   - Checks against banlist in `config/content-banlist.json`
   - Flagged content is rejected and replaced with neutral alternatives
   - All rejections are logged to moderation dashboard

3. **Plausibility Checks:**
   - Numeric stats must match authoritative data sources
   - Dates and records must align with fixtures dataset
   - Any factual claim must be validated against API or local datasets

## LLM Prompt Templates

### 1. Player Biography

**Template:**
```
Generate a concise, factual biography for cricket player {playerName} from team {teamName}.

Requirements:
- 3-5 sentences maximum
- Focus on career highlights and achievements
- Include signature statistics (runs, wickets, matches)
- Use only verifiable facts from the provided player data
- Avoid controversial topics, politics, or personal life details
- Professional tone, suitable for all audiences

Player Data:
{playerStats}

Output format:
{
  "bio": "3-5 sentence biography",
  "careerHighlights": ["highlight1", "highlight2", "highlight3"],
  "signatureStats": {
    "matches": number,
    "runs_or_wickets": number,
    "average": number
  },
  "source": "generated-from-dataset"
}
```

**Validation Rules:**
- Bio length: 100-300 characters
- Career highlights: 3-5 items
- Stats must match provided player data ±5%
- Source field must be present

### 2. Match Preview

**Template:**
```
Generate a match preview for World Cup match: {teamA} vs {teamB}.

Requirements:
- One paragraph preview (150-200 words)
- 3 "Key Things to Watch" bullet points
- 1 trivia question related to this match
- Focus on teams, players, and recent form
- Use only data from provided fixtures and squad information
- Avoid predictions, speculation, or controversial statements

Match Data:
{matchFixture}

Team Data:
{teamSquads}

Output format:
{
  "preview": "One paragraph preview text",
  "keyThingsToWatch": ["point1", "point2", "point3"],
  "triviaQuestion": {
    "question": "Trivia question text",
    "answer": "Correct answer",
    "distractors": ["wrong1", "wrong2", "wrong3"]
  },
  "source": "generated-from-match-{matchId}"
}
```

**Validation Rules:**
- Preview length: 150-200 words
- Key things: exactly 3 items
- Trivia must be answerable from match data
- All team names must match fixture data exactly

### 3. "Did You Know?" Facts

**Template:**
```
Generate an interesting "Did You Know?" cricket fact about {subject}.

Requirements:
- Single sentence, 20-40 words
- Must be verifiable and factual
- Related to World Cup history, player records, or team achievements
- Engaging but not sensational
- No controversy or political references

Context Data:
{contextData}

Output format:
{
  "fact": "Single sentence fact",
  "source": "URL or dataset reference",
  "confidence": "high" | "medium" | "low",
  "category": "record" | "history" | "player" | "team"
}
```

**Validation Rules:**
- Fact length: 20-40 words
- Must include verifiable source
- Confidence must be "high" for display in live matches
- Category must match one of the allowed values

### 4. Trivia Question Generation

**Template:**
```
Generate a cricket trivia question at {difficulty} difficulty level.

Requirements:
- Question should be about: {category}
- One correct answer
- Three plausible but incorrect distractors
- Based on World Cup fixtures, teams, or cricket history
- Appropriate difficulty level (easy/medium/hard)
- Clear, unambiguous wording

Reference Data:
{referenceData}

Output format:
{
  "question": "Clear question text",
  "correctAnswer": "The correct answer",
  "distractors": ["wrong1", "wrong2", "wrong3"],
  "category": "fixtures" | "players" | "records" | "history",
  "difficulty": "easy" | "medium" | "hard",
  "explanation": "Brief explanation of why this is the answer",
  "sourceDataId": "reference to source data"
}
```

**Validation Rules:**
- Question length: 10-100 words
- Exactly 3 distractors
- Distractors must be plausible but clearly wrong
- Explanation optional but recommended
- Must reference source data for verification

### 5. Distractor Generation

**Template:**
```
Generate 3 plausible but incorrect answers (distractors) for this trivia question:

Question: {question}
Correct Answer: {correctAnswer}
Category: {category}

Requirements:
- Distractors should be plausible (same format/type as correct answer)
- Clearly incorrect when checked against facts
- No offensive or controversial options
- Similar length/structure to correct answer

Reference Data:
{referenceData}

Output format:
{
  "distractors": ["distractor1", "distractor2", "distractor3"],
  "methodology": "Brief explanation of how distractors were chosen"
}
```

**Validation Rules:**
- Exactly 3 distractors
- No duplicates with correct answer
- Similar format to correct answer (dates match date format, numbers match number format, etc.)

## Plausibility Checks

### Numeric Validation

For any numeric claim (runs, wickets, averages, strike rates):

1. Compare LLM output to authoritative stats
2. Tolerance: ±5% for career stats, ±0 for match stats
3. If mismatch exceeds tolerance:
   - Drop the claim
   - Mark content for human review
   - Use neutral placeholder

### Date & Record Validation

For historical claims and records:

1. Cross-reference with fixtures dataset
2. Verify against official World Cup records (if available via API)
3. If unverifiable:
   - Add disclaimer: "Subject to verification"
   - Mark for human review
   - Only display if confidence is "high"

### Name & Team Validation

For player and team references:

1. All names must exist in squad data
2. Team names must match exactly (case-sensitive)
3. Player roles must match squad data
4. If mismatch:
   - Reject content
   - Log to moderation queue

## Content Moderation Workflow

### Automated Filtering (Phase 1)

1. **Text Scanning:**
   ```javascript
   const moderationCheck = isFlagged(generatedText);
   if (moderationCheck.flagged) {
     logToModerationQueue({
       content: generatedText,
       reason: moderationCheck.reason,
       timestamp: new Date().toISOString(),
       status: 'auto-rejected'
     });
     return neutralFallback;
   }
   ```

2. **Numeric Validation:**
   ```javascript
   if (!validateNumericClaim(claim, authoritativeData)) {
     markForReview(claim, 'numeric-mismatch');
     return omitClaim;
   }
   ```

3. **Source Verification:**
   ```javascript
   if (!content.source || content.confidence === 'low') {
     flagForReview(content, 'low-confidence');
   }
   ```

### Manual Review Queue

Content flagged for manual review includes:
- Low confidence facts (confidence !== 'high')
- Numeric mismatches > 5%
- Unverifiable historical claims
- First-time generated content types

## Audit Logging

All AI content generation is logged to `logs/ai-content-audit.log`:

```json
{
  "timestamp": "2026-02-03T10:00:00.000Z",
  "route": "/api/daily-strike",
  "contentType": "trivia-question",
  "questionCount": 5,
  "sourceDataId": "wc2026_001",
  "llmEnhanced": false,
  "moderationStatus": "approved",
  "flaggedCount": 0
}
```

**Log Retention:**
- Keep audit logs for 90 days
- Logs are in `.gitignore` and never committed
- Include non-sensitive metadata only

## Fallback Content

When LLM is unavailable or content is rejected:

### Bio Fallback:
```
"{playerName} is a {role} for {team}. Career stats: {matches} matches, {stat} {runs/wickets}."
```

### Match Preview Fallback:
```
"Upcoming World Cup match: {teamA} vs {teamB} at {venue}, {city} on {date}."
```

### Did You Know Fallback:
```
"This match is part of the {stage} stage of the ICC Cricket World Cup 2026."
```

## Testing Checklist

Before deploying AI features:

- [ ] All prompts tested with sample data
- [ ] Content filtering catches test banned keywords
- [ ] Numeric validation rejects out-of-range stats
- [ ] Fallback content displays when LLM disabled
- [ ] Audit logs created correctly
- [ ] Moderation dashboard shows flagged items
- [ ] Source attribution present in all outputs

## References

- Content Banlist: `config/content-banlist.json`
- Fixtures Data: `data/fixtures/worldcup-fixtures.json`
- Squad Data: `data/squads/{team}.json`
- Moderation Dashboard: `/admin/moderation`
