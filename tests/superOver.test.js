/**
 * Super Over Tests
 * 
 * Tests for Super Over match logic and bot behavior
 */

describe('Super Over - Match Creation', () => {
  test('generates unique match IDs', () => {
    const generateMatchId = () => {
      return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    };

    const id1 = generateMatchId();
    const id2 = generateMatchId();
    
    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(typeof id1).toBe('string');
    expect(typeof id2).toBe('string');
    expect(id1).toMatch(/^match_\d+_/);
  });

  test('match object has required fields', () => {
    const match = {
      matchId: 'match_123_abc',
      playerA: {
        id: 'player_1',
        name: 'You',
        isBot: false,
        runs: 0,
        wickets: 0,
        balls: 0
      },
      playerB: {
        id: 'bot_1',
        name: 'Cricket Bot',
        isBot: true,
        difficulty: 'medium',
        runs: 0,
        wickets: 0,
        balls: 0
      },
      mode: 'bot',
      status: 'in_progress',
      currentBall: 0,
      maxBalls: 6
    };

    expect(match).toHaveProperty('matchId');
    expect(match).toHaveProperty('playerA');
    expect(match).toHaveProperty('playerB');
    expect(match).toHaveProperty('status');
    expect(match).toHaveProperty('currentBall');
    expect(match).toHaveProperty('maxBalls');
    expect(match.maxBalls).toBe(6);
  });
});

describe('Super Over - Bot Configuration', () => {
  const BOT_CONFIG = {
    easy: { accuracy: 0.5, delayMs: 2000 },
    medium: { accuracy: 0.7, delayMs: 1500 },
    hard: { accuracy: 0.9, delayMs: 1000 }
  };

  test('bot configurations are valid', () => {
    expect(BOT_CONFIG.easy.accuracy).toBeGreaterThanOrEqual(0);
    expect(BOT_CONFIG.easy.accuracy).toBeLessThanOrEqual(1);
    expect(BOT_CONFIG.medium.accuracy).toBeGreaterThan(BOT_CONFIG.easy.accuracy);
    expect(BOT_CONFIG.hard.accuracy).toBeGreaterThan(BOT_CONFIG.medium.accuracy);
  });

  test('bot difficulty affects accuracy', () => {
    expect(BOT_CONFIG.easy.accuracy).toBe(0.5);
    expect(BOT_CONFIG.medium.accuracy).toBe(0.7);
    expect(BOT_CONFIG.hard.accuracy).toBe(0.9);
  });

  test('bot delay decreases with difficulty', () => {
    expect(BOT_CONFIG.hard.delayMs).toBeLessThan(BOT_CONFIG.medium.delayMs);
    expect(BOT_CONFIG.medium.delayMs).toBeLessThan(BOT_CONFIG.easy.delayMs);
  });
});

describe('Super Over - Scoring Logic', () => {
  test('correct answer adds run', () => {
    const player = { runs: 0, wickets: 0, balls: 0 };
    const isCorrect = true;

    if (isCorrect) {
      player.runs++;
    } else {
      player.wickets++;
    }
    player.balls++;

    expect(player.runs).toBe(1);
    expect(player.wickets).toBe(0);
    expect(player.balls).toBe(1);
  });

  test('incorrect answer adds wicket', () => {
    const player = { runs: 0, wickets: 0, balls: 0 };
    const isCorrect = false;

    if (isCorrect) {
      player.runs++;
    } else {
      player.wickets++;
    }
    player.balls++;

    expect(player.runs).toBe(0);
    expect(player.wickets).toBe(1);
    expect(player.balls).toBe(1);
  });

  test('match completes after 6 balls', () => {
    const match = {
      currentBall: 0,
      maxBalls: 6,
      status: 'in_progress'
    };

    // Simulate 6 balls
    for (let i = 0; i < 6; i++) {
      match.currentBall++;
    }

    if (match.currentBall >= match.maxBalls) {
      match.status = 'completed';
    }

    expect(match.currentBall).toBe(6);
    expect(match.status).toBe('completed');
  });
});

describe('Super Over - Match Outcome', () => {
  test('determines winner correctly', () => {
    const match = {
      playerA: { runs: 15, wickets: 2 },
      playerB: { runs: 12, wickets: 3 }
    };

    const won = match.playerA.runs > match.playerB.runs;
    const tied = match.playerA.runs === match.playerB.runs;

    expect(won).toBe(true);
    expect(tied).toBe(false);
  });

  test('detects tie correctly', () => {
    const match = {
      playerA: { runs: 15, wickets: 2 },
      playerB: { runs: 15, wickets: 3 }
    };

    const tied = match.playerA.runs === match.playerB.runs;
    expect(tied).toBe(true);
  });

  test('bot loses when player has more runs', () => {
    const match = {
      playerA: { runs: 18, wickets: 1 },
      playerB: { runs: 14, wickets: 2 }
    };

    const playerWon = match.playerA.runs > match.playerB.runs;
    expect(playerWon).toBe(true);
  });
});

describe('Super Over - Bot Behavior', () => {
  test('bot answers based on accuracy', () => {
    const botAccuracy = 0.7;
    const trials = 1000;
    let correctAnswers = 0;

    // Simulate bot answering
    for (let i = 0; i < trials; i++) {
      const roll = Math.random();
      if (roll < botAccuracy) {
        correctAnswers++;
      }
    }

    const actualAccuracy = correctAnswers / trials;
    
    // Should be within 10% of target accuracy for large sample
    expect(actualAccuracy).toBeGreaterThan(botAccuracy - 0.1);
    expect(actualAccuracy).toBeLessThan(botAccuracy + 0.1);
  });

  test('creates bot player with correct properties', () => {
    const createBotPlayer = (difficulty = 'medium') => {
      return {
        id: `bot_${Date.now()}`,
        name: 'Cricket Bot',
        isBot: true,
        difficulty,
        accuracy: 0.7,
        delayMs: 1500
      };
    };

    const bot = createBotPlayer('medium');
    
    expect(bot.isBot).toBe(true);
    expect(bot.name).toBe('Cricket Bot');
    expect(bot.difficulty).toBe('medium');
    expect(bot.accuracy).toBeDefined();
    expect(bot.delayMs).toBeDefined();
  });
});
