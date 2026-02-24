/**
 * Super Over Match Service
 * 
 * Implements a minimal 1v1 cricket duel (Super Over format).
 * Features:
 * - In-memory match state storage (Redis-backed in production)
 * - Match creation (vs bot or invite)
 * - Answer submission and scoring
 * - Match status retrieval
 * 
 * For MVP: in-memory storage
 * For Phase 2: migrate to Redis/Postgres
 */

// In-memory storage for matches (replace with Redis in production)
const matches = new Map();
let matchIdCounter = 1;

/**
 * Match states
 */
export const MatchState = {
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned'
};

/**
 * Create a new match
 * @param {Object} params - Match creation parameters
 * @param {string} params.playerAId - ID of player A
 * @param {string} params.playerBId - ID of player B (or 'bot')
 * @param {string} params.mode - 'bot' or 'invite'
 * @returns {Object} Created match object
 */
export function createMatch({ playerAId, playerBId = 'bot', mode = 'bot' }) {
  const matchId = `match_${matchIdCounter++}`;
  
  const match = {
    id: matchId,
    playerA: {
      id: playerAId,
      name: 'Player A',
      runs: 0,
      wickets: 0,
      ballsPlayed: 0
    },
    playerB: {
      id: playerBId,
      name: mode === 'bot' ? 'Bot Opponent' : 'Player B',
      runs: 0,
      wickets: 0,
      ballsPlayed: 0
    },
    rounds: [],
    state: MatchState.WAITING,
    winner: null,
    mode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  matches.set(matchId, match);
  return match;
}

/**
 * Get match by ID
 * @param {string} matchId - Match ID
 * @returns {Object|null} Match object or null if not found
 */
export function getMatch(matchId) {
  return matches.get(matchId) || null;
}

/**
 * Submit an answer for a match
 * @param {Object} params - Answer submission parameters
 * @param {string} params.matchId - Match ID
 * @param {string} params.playerId - Player ID
 * @param {string} params.answer - Answer submitted
 * @param {boolean} params.isCorrect - Whether answer is correct
 * @returns {Object} Updated match object
 */
export function submitAnswer({ matchId, playerId, answer, isCorrect }) {
  const match = matches.get(matchId);
  if (!match) {
    throw new Error('Match not found');
  }

  // Determine which player
  const player = match.playerA.id === playerId ? match.playerA : match.playerB;
  
  // Update player stats based on answer
  if (isCorrect) {
    // Correct answer = runs scored (random 1-6 for MVP)
    const runsScored = Math.floor(Math.random() * 6) + 1;
    player.runs += runsScored;
  } else {
    // Incorrect answer = wicket
    player.wickets += 1;
  }
  
  player.ballsPlayed += 1;

  // Add round to match
  match.rounds.push({
    playerId,
    answer,
    isCorrect,
    timestamp: new Date().toISOString()
  });

  // Update match state
  if (match.state === MatchState.WAITING) {
    match.state = MatchState.IN_PROGRESS;
  }

  // Check if match is over (6 balls or all wickets)
  const maxBalls = 6;
  const maxWickets = 10;
  
  if (player.ballsPlayed >= maxBalls || player.wickets >= maxWickets) {
    // This player's innings is over
    // For MVP, determine winner immediately
    if (match.playerA.ballsPlayed >= maxBalls && match.playerB.ballsPlayed >= maxBalls) {
      // Both innings complete, determine winner
      if (match.playerA.runs > match.playerB.runs) {
        match.winner = match.playerA.id;
      } else if (match.playerB.runs > match.playerA.runs) {
        match.winner = match.playerB.id;
      } else {
        match.winner = 'tie';
      }
      match.state = MatchState.COMPLETED;
    }
  }

  match.updatedAt = new Date().toISOString();
  matches.set(matchId, match);

  return match;
}

/**
 * Get all matches (for admin/debugging)
 * @returns {Array} Array of all matches
 */
export function getAllMatches() {
  return Array.from(matches.values());
}

/**
 * Delete match (for cleanup/testing)
 * @param {string} matchId - Match ID
 * @returns {boolean} True if deleted, false if not found
 */
export function deleteMatch(matchId) {
  return matches.delete(matchId);
}
