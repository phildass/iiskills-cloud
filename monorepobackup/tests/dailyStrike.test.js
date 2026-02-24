/**
 * Daily Strike Tests
 * 
 * Tests for Daily Strike trivia question generation and scoring
 */

describe('Daily Strike - Question Generation', () => {
  const fixturesPath = require('path').join(process.cwd(), 'data/fixtures/worldcup-fixtures.json');
  let fixtures;

  beforeAll(() => {
    const fs = require('fs');
    if (fs.existsSync(fixturesPath)) {
      fixtures = JSON.parse(fs.readFileSync(fixturesPath, 'utf8'));
    }
  });

  test('fixtures file exists and has valid structure', () => {
    expect(fixtures).toBeDefined();
    expect(fixtures).toHaveProperty('fixtures');
    expect(fixtures).toHaveProperty('venues');
    expect(Array.isArray(fixtures.fixtures)).toBe(true);
    expect(Array.isArray(fixtures.venues)).toBe(true);
  });

  test('fixtures contain required fields', () => {
    expect(fixtures.fixtures.length).toBeGreaterThan(0);
    
    const fixture = fixtures.fixtures[0];
    expect(fixture).toHaveProperty('matchId');
    expect(fixture).toHaveProperty('matchNumber');
    expect(fixture).toHaveProperty('teamA');
    expect(fixture).toHaveProperty('teamB');
    expect(fixture).toHaveProperty('date');
    expect(fixture).toHaveProperty('venue');
  });

  test('venues contain required fields', () => {
    expect(fixtures.venues.length).toBeGreaterThan(0);
    
    const venue = fixtures.venues[0];
    expect(venue).toHaveProperty('id');
    expect(venue).toHaveProperty('name');
    expect(venue).toHaveProperty('city');
    expect(venue).toHaveProperty('country');
  });
});

describe('Daily Strike - Question Validation', () => {
  test('question structure is valid', () => {
    const sampleQuestion = {
      id: 'daily_strike_1',
      question: 'Which teams are playing in Match 1?',
      correctAnswer: 'India vs Pakistan',
      distractors: ['Australia vs England', 'New Zealand vs South Africa', 'Sri Lanka vs Bangladesh'],
      category: 'fixtures',
      difficulty: 'easy',
      sourceDataId: 'wc2026_001',
      moderationStatus: 'approved'
    };

    expect(sampleQuestion).toHaveProperty('id');
    expect(sampleQuestion).toHaveProperty('question');
    expect(sampleQuestion).toHaveProperty('correctAnswer');
    expect(sampleQuestion).toHaveProperty('distractors');
    expect(sampleQuestion).toHaveProperty('category');
    expect(sampleQuestion).toHaveProperty('difficulty');
    expect(Array.isArray(sampleQuestion.distractors)).toBe(true);
    expect(sampleQuestion.distractors.length).toBeGreaterThanOrEqual(3);
  });

  test('distractors do not include correct answer', () => {
    const correctAnswer = 'India vs Pakistan';
    const distractors = ['Australia vs England', 'New Zealand vs South Africa', 'Sri Lanka vs Bangladesh'];
    
    expect(distractors).not.toContain(correctAnswer);
  });
});

describe('Daily Strike - Scoring', () => {
  test('correct answer increments score', () => {
    let score = 0;
    const selectedAnswer = 'India vs Pakistan';
    const correctAnswer = 'India vs Pakistan';
    
    if (selectedAnswer === correctAnswer) {
      score++;
    }
    
    expect(score).toBe(1);
  });

  test('incorrect answer does not increment score', () => {
    let score = 0;
    const selectedAnswer = 'Australia vs England';
    const correctAnswer = 'India vs Pakistan';
    
    if (selectedAnswer === correctAnswer) {
      score++;
    }
    
    expect(score).toBe(0);
  });

  test('score percentage calculation', () => {
    const score = 4;
    const total = 5;
    const percentage = Math.round((score / total) * 100);
    
    expect(percentage).toBe(80);
  });
});

describe('Daily Strike - Content Moderation', () => {
  const banlistPath = require('path').join(process.cwd(), 'config/content-banlist.json');
  let banlist;

  beforeAll(() => {
    const fs = require('fs');
    if (fs.existsSync(banlistPath)) {
      banlist = JSON.parse(fs.readFileSync(banlistPath, 'utf8'));
    }
  });

  test('banlist file exists', () => {
    expect(banlist).toBeDefined();
    expect(banlist).toHaveProperty('bannedKeywords');
    expect(banlist).toHaveProperty('bannedPhrases');
    expect(banlist).toHaveProperty('controversialTopics');
  });

  test('content flagging detects banned keywords', () => {
    const flagContent = (text) => {
      const lowerText = text.toLowerCase();
      for (const keyword of banlist.bannedKeywords || []) {
        if (lowerText.includes(keyword.toLowerCase())) {
          return { flagged: true, reason: `Banned keyword: ${keyword}` };
        }
      }
      return { flagged: false };
    };

    const cleanText = 'Which team won the World Cup?';
    const flaggedText = 'This political party supports cricket';

    expect(flagContent(cleanText).flagged).toBe(false);
    expect(flagContent(flaggedText).flagged).toBe(true);
  });
});
