/**
 * POST /api/match/create
 * 
 * Create a new Super Over match (1v1 vs bot or invite)
 * 
 * Request body:
 * - playerAId: string - ID of player A
 * - playerBId?: string - ID of player B (optional, defaults to 'bot')
 * - mode: 'bot' | 'invite' - Match mode
 * 
 * Response:
 * - match: Object - Created match object
 */

import { createMatch } from '../../../lib/match/matchService';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { playerAId, playerBId, mode = 'bot' } = req.body;

    // Validate required fields
    if (!playerAId) {
      return res.status(400).json({ error: 'playerAId is required' });
    }

    // Validate mode
    if (!['bot', 'invite'].includes(mode)) {
      return res.status(400).json({ error: 'mode must be "bot" or "invite"' });
    }

    // Create match
    const match = createMatch({
      playerAId,
      playerBId: playerBId || 'bot',
      mode
    });

    return res.status(201).json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Error creating match:', error);
    return res.status(500).json({
      error: 'Failed to create match',
      message: error.message
    });
  }
}
