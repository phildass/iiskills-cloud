/**
 * POST /api/match/answer
 * 
 * Submit an answer for a match
 * 
 * Request body:
 * - matchId: string - Match ID
 * - playerId: string - Player ID
 * - answer: string - Answer submitted
 * - isCorrect: boolean - Whether answer is correct
 * 
 * Response:
 * - match: Object - Updated match object
 */

import { submitAnswer, getMatch } from '../../../lib/match/matchService';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { matchId, playerId, answer, isCorrect } = req.body;

    // Validate required fields
    if (!matchId) {
      return res.status(400).json({ error: 'matchId is required' });
    }
    if (!playerId) {
      return res.status(400).json({ error: 'playerId is required' });
    }
    if (answer === undefined || answer === null) {
      return res.status(400).json({ error: 'answer is required' });
    }
    if (typeof isCorrect !== 'boolean') {
      return res.status(400).json({ error: 'isCorrect must be a boolean' });
    }

    // Check if match exists
    const existingMatch = getMatch(matchId);
    if (!existingMatch) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Submit answer
    const match = submitAnswer({
      matchId,
      playerId,
      answer,
      isCorrect
    });

    return res.status(200).json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Error submitting answer:', error);
    return res.status(500).json({
      error: 'Failed to submit answer',
      message: error.message
    });
  }
}
