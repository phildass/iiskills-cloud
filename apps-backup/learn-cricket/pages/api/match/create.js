/**
 * Create Match API Endpoint
 * 
 * Creates a new Super Over match (60-second rapid-fire trivia)
 * Supports solo bot mode
 * 
 * POST /api/match/create
 * Body: { playerAId, mode: "bot" | "friend", difficulty: "easy" | "medium" | "hard" }
 */

// In-memory match storage (Phase 1 - Redis in Phase 2)
// This would ideally be in a shared module or database
let matchesStore = global.matchesStore || new Map();
global.matchesStore = matchesStore;

// Bot configuration from environment or defaults
const BOT_CONFIG = {
  easy: { 
    accuracy: parseFloat(process.env.BOT_ACCURACY_EASY || '0.5'), 
    delayMs: parseInt(process.env.BOT_DELAY_MS_EASY || '2000', 10) 
  },
  medium: { 
    accuracy: parseFloat(process.env.BOT_ACCURACY_MEDIUM || '0.7'), 
    delayMs: parseInt(process.env.BOT_DELAY_MS_MEDIUM || '1500', 10) 
  },
  hard: { 
    accuracy: parseFloat(process.env.BOT_ACCURACY_HARD || '0.9'), 
    delayMs: parseInt(process.env.BOT_DELAY_MS_HARD || '1000', 10) 
  }
};

function generateMatchId() {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function createBotPlayer(difficulty = 'medium') {
  return {
    id: `bot_${Date.now()}`,
    name: 'Cricket Bot',
    isBot: true,
    difficulty,
    accuracy: BOT_CONFIG[difficulty].accuracy,
    delayMs: BOT_CONFIG[difficulty].delayMs
  };
}

export default async function handler(req, res) {
  // Check if Super Over is enabled
  const enableSuperOver = process.env.ENABLE_SUPER_OVER !== 'false';
  
  if (!enableSuperOver) {
    return res.status(403).json({
      error: 'Super Over feature is disabled',
      message: 'Set ENABLE_SUPER_OVER=true to enable this feature'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { playerAId, mode = 'bot', difficulty = 'medium' } = req.body;

    if (!playerAId) {
      return res.status(400).json({ error: 'playerAId is required' });
    }

    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ error: 'difficulty must be easy, medium, or hard' });
    }

    const matchId = generateMatchId();
    const playerA = {
      id: playerAId,
      name: 'You',
      isBot: false,
      runs: 0,
      wickets: 0,
      balls: 0
    };

    let playerB;
    if (mode === 'bot') {
      const botPlayer = createBotPlayer(difficulty);
      playerB = {
        ...botPlayer,
        runs: 0,
        wickets: 0,
        balls: 0
      };
    } else {
      // Friend mode not implemented in MVP
      return res.status(400).json({
        error: 'Friend mode not yet implemented',
        message: 'Use mode: "bot" for MVP'
      });
    }

    const match = {
      matchId,
      playerA,
      playerB,
      mode,
      status: 'in_progress',
      currentBall: 0,
      maxBalls: 6,
      startedAt: new Date().toISOString(),
      completedAt: null,
      winner: null
    };

    matchesStore.set(matchId, match);

    res.status(200).json({
      success: true,
      matchId,
      match
    });

  } catch (error) {
    console.error('Create match error:', error);
    res.status(500).json({
      error: 'Failed to create match',
      message: error.message
    });
  }
}
