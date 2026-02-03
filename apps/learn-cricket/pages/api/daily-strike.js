/**
 * Daily Strike API Endpoint
 * 
 * Generates 5-10 World Cup focused trivia questions from local fixtures.
 * Optionally enriches with LLM if ENABLE_LLM=true and GEMINI_API_KEY is set.
 * 
 * Environment Variables:
 * - ENABLE_DAILY_STRIKE: Enable this feature (default: true)
 * - ENABLE_LLM: Enable LLM enrichment (default: false)
 * - GEMINI_API_KEY: API key for Gemini (read from process.env)
 */

import fs from 'fs';
import path from 'path';

// Load fixtures - adjust path for Next.js API routes
const fixturesPath = path.join(process.cwd(), 'data/fixtures/worldcup-fixtures.json');
let worldCupFixtures = { fixtures: [], venues: [] };

try {
  const fixturesData = fs.readFileSync(fixturesPath, 'utf8');
  worldCupFixtures = JSON.parse(fixturesData);
} catch (error) {
  console.error('Failed to load World Cup fixtures:', error);
}

// Load content banlist for moderation - adjust path for Next.js API routes
const banlistPath = path.join(process.cwd(), 'config/content-banlist.json');
let contentBanlist = { bannedKeywords: [], bannedPhrases: [], controversialTopics: [] };

try {
  const banlistData = fs.readFileSync(banlistPath, 'utf8');
  contentBanlist = JSON.parse(banlistData);
} catch (error) {
  console.warn('Content banlist not found, using empty banlist');
}

/**
 * Check if content contains banned keywords or controversial topics
 */
function isFlagged(text) {
  const lowerText = text.toLowerCase();
  
  // Check banned keywords
  for (const keyword of contentBanlist.bannedKeywords || []) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return { flagged: true, reason: `Banned keyword: ${keyword}` };
    }
  }
  
  // Check banned phrases
  for (const phrase of contentBanlist.bannedPhrases || []) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return { flagged: true, reason: `Banned phrase: ${phrase}` };
    }
  }
  
  // Check controversial topics
  for (const topic of contentBanlist.controversialTopics || []) {
    if (lowerText.includes(topic.toLowerCase())) {
      return { flagged: true, reason: `Controversial topic: ${topic}` };
    }
  }
  
  return { flagged: false };
}

/**
 * Generate trivia questions from fixtures (deterministic, no LLM needed)
 */
function generateQuestionsFromFixtures(count = 5) {
  const questions = [];
  const fixtures = worldCupFixtures.fixtures || [];
  const venues = worldCupFixtures.venues || [];
  
  if (fixtures.length === 0) {
    return [];
  }
  
  // Question templates based on fixture data
  const templates = [
    {
      type: 'fixture',
      generate: (fixture) => {
        const venue = venues.find(v => v.id === fixture.venue);
        return {
          question: `Which teams are playing in Match ${fixture.matchNumber} of the World Cup?`,
          correctAnswer: `${fixture.teamA} vs ${fixture.teamB}`,
          distractors: [
            'India vs Australia',
            'England vs Pakistan',
            'New Zealand vs South Africa'
          ].filter(d => d !== `${fixture.teamA} vs ${fixture.teamB}`).slice(0, 3),
          category: 'fixtures',
          difficulty: 'easy'
        };
      }
    },
    {
      type: 'venue',
      generate: (fixture) => {
        const venue = venues.find(v => v.id === fixture.venue);
        if (!venue) return null;
        return {
          question: `In which city is the ${fixture.teamA} vs ${fixture.teamB} match being held?`,
          correctAnswer: venue.city,
          distractors: venues
            .filter(v => v.city !== venue.city)
            .map(v => v.city)
            .slice(0, 3),
          category: 'venue',
          difficulty: 'medium'
        };
      }
    },
    {
      type: 'date',
      generate: (fixture) => {
        return {
          question: `On which date is Match ${fixture.matchNumber} scheduled?`,
          correctAnswer: fixture.date,
          distractors: fixtures
            .filter(f => f.date !== fixture.date)
            .map(f => f.date)
            .slice(0, 3),
          category: 'schedule',
          difficulty: 'medium'
        };
      }
    }
  ];
  
  // Generate questions
  for (let i = 0; i < Math.min(count, fixtures.length); i++) {
    const fixture = fixtures[i % fixtures.length];
    const template = templates[i % templates.length];
    const question = template.generate(fixture);
    
    if (question && question.distractors.length >= 3) {
      // Check for content flags
      const fullText = `${question.question} ${question.correctAnswer} ${question.distractors.join(' ')}`;
      const moderationCheck = isFlagged(fullText);
      
      if (!moderationCheck.flagged) {
        questions.push({
          id: `daily_strike_${i + 1}`,
          ...question,
          sourceDataId: fixture.matchId,
          moderationStatus: 'approved'
        });
      } else {
        console.warn(`Question flagged by moderation: ${moderationCheck.reason}`);
        // Skip flagged content
      }
    }
  }
  
  return questions;
}

/**
 * Log AI generation event (for audit trail)
 */
function logAIEvent(eventData) {
  const logsDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logsDir, 'ai-content-audit.log');
  
  try {
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...eventData
    }) + '\n';
    
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}

export default async function handler(req, res) {
  // Check if Daily Strike is enabled
  const enableDailyStrike = process.env.ENABLE_DAILY_STRIKE !== 'false';
  
  if (!enableDailyStrike) {
    return res.status(403).json({
      error: 'Daily Strike feature is disabled',
      message: 'Set ENABLE_DAILY_STRIKE=true to enable this feature'
    });
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const count = parseInt(req.query.count || '5', 10);
    const maxCount = 10;
    const actualCount = Math.min(Math.max(count, 5), maxCount);
    
    // Generate questions from fixtures
    const questions = generateQuestionsFromFixtures(actualCount);
    
    if (questions.length === 0) {
      return res.status(500).json({
        error: 'No questions available',
        message: 'World Cup fixtures not loaded'
      });
    }
    
    // Log generation event
    logAIEvent({
      route: '/api/daily-strike',
      questionCount: questions.length,
      sourceDataId: worldCupFixtures.tournament || 'ICC Cricket World Cup 2026',
      contentType: 'daily-strike-trivia',
      llmEnhanced: false,
      moderationStatus: 'approved'
    });
    
    // Optionally enrich with LLM if enabled
    const enableLLM = process.env.ENABLE_LLM === 'true';
    const hasGeminiKey = !!process.env.GEMINI_API_KEY;
    
    if (enableLLM && hasGeminiKey) {
      // TODO: Implement LLM enrichment in Phase 2
      // For now, just use the generated questions
      console.log('LLM enrichment is enabled but not yet implemented');
    }
    
    res.status(200).json({
      success: true,
      count: questions.length,
      questions: questions,
      tournament: worldCupFixtures.tournament || 'ICC Cricket World Cup 2026',
      generatedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Daily Strike error:', error);
    res.status(500).json({
      error: 'Failed to generate questions',
      message: error.message
    });
  }
}
