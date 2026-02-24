/**
 * GET /api/match/[id]
 * 
 * Get match status by ID
 * 
 * Response:
 * - match: Object - Match object with current status
 */

import { getMatch } from '../../../lib/match/matchService';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Match ID is required' });
    }

    const match = getMatch(id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    return res.status(200).json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Error fetching match:', error);
    return res.status(500).json({
      error: 'Failed to fetch match',
      message: error.message
    });
  }
}
