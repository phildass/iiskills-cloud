/**
 * Submit Answer API Endpoint
 * 
 * Submits an answer for a Super Over match
 * Updates runs/wickets based on correctness
 * Handles bot responses
 * 
 * POST /api/match/answer
 * Body: { matchId, playerId, isCorrect }
 */

// Access shared match storage
let matchesStore = global.matchesStore || new Map();
global.matchesStore = matchesStore;

/**
 * Calculate runs for correct answer
 * Scoring system: correct = run(s), wrong = wicket
 */
function calculateRuns(isCorrect) {
  if (!isCorrect) return 0;
  
  // Deterministic run distribution (1-6 runs)
  // Simple: alternating pattern for variety
  const runOptions = [1, 2, 3, 4, 6];
  return runOptions[Math.floor(Math.random() * runOptions.length)];
}

/**
 * Simulate bot answer based on accuracy
 */
function simulateBotAnswer(bot) {
  const isCorrect = Math.random() < bot.accuracy;
  const runs = calculateRuns(isCorrect);
  const wickets = isCorrect ? 0 : 1;
  
  return { isCorrect, runs, wickets };
}

/**
 * Check if match is complete
 */
function checkMatchComplete(match) {
  const { playerA, playerB, maxBalls } = match;
  
  // Match ends when both players have played all balls
  if (playerA.balls >= maxBalls && playerB.balls >= maxBalls) {
    return true;
  }
  
  return false;
}

/**
 * Determine winner
 */
function determineWinner(match) {
  const { playerA, playerB } = match;
  
  if (playerA.runs > playerB.runs) {
    return playerA.id;
  } else if (playerB.runs > playerA.runs) {
    return playerB.id;
  } else {
    return 'tie';
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { matchId, playerId, isCorrect } = req.body;

    if (!matchId || !playerId || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ 
        error: 'matchId, playerId, and isCorrect are required' 
      });
    }

    // Get match
    const match = matchesStore.get(matchId);
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    if (match.status === 'completed') {
      return res.status(400).json({ error: 'Match already completed' });
    }

    // Determine which player
    const player = match.playerA.id === playerId ? match.playerA : match.playerB;
    const opponent = match.playerA.id === playerId ? match.playerB : match.playerA;

    if (!player) {
      return res.status(400).json({ error: 'Invalid playerId' });
    }

    // Check if player has balls left
    if (player.balls >= match.maxBalls) {
      return res.status(400).json({ error: 'Player has no balls left' });
    }

    // Update player stats
    player.balls += 1;
    if (isCorrect) {
      player.runs += calculateRuns(true);
    } else {
      player.wickets += 1;
    }

    // If opponent is bot and hasn't finished, simulate their turn
    if (opponent.isBot && opponent.balls < match.maxBalls) {
      const botResult = simulateBotAnswer(opponent);
      opponent.balls += 1;
      opponent.runs += botResult.runs;
      opponent.wickets += botResult.wickets;
    }

    // Check if match is complete
    if (checkMatchComplete(match)) {
      match.status = 'completed';
      match.completedAt = new Date().toISOString();
      match.winner = determineWinner(match);
    }

    // Update match in store
    matchesStore.set(matchId, match);

    res.status(200).json({
      success: true,
      match,
      playerStats: {
        runs: player.runs,
        wickets: player.wickets,
        balls: player.balls
      },
      opponentStats: {
        runs: opponent.runs,
        wickets: opponent.wickets,
        balls: opponent.balls
      }
    });

  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      error: 'Failed to submit answer',
      message: error.message
    });
  }
}
