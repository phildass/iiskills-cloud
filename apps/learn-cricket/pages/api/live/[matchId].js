/**
 * Live Match API Endpoint
 * 
 * GET /api/live/[matchId]
 * 
 * Returns live match data with "Did You Know?" facts
 * 
 * Environment Variables:
 * - ENABLE_LIVE_STATS: Enable live stats (default: false)
 * - CRICKET_API_KEY: API key for live cricket data (optional)
 */

import cricketApi from '../../../services/cricketApi';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { matchId } = req.query;

  if (!matchId) {
    return res.status(400).json({
      error: 'Missing matchId',
      message: 'Please provide a matchId parameter'
    });
  }

  try {
    // Get live score or fixture data
    const matchData = await cricketApi.getLiveScore(matchId);

    res.status(200).json({
      success: true,
      match: matchData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Live match API error:', error);
    
    // Return appropriate error
    if (error.message.includes('not found')) {
      return res.status(404).json({
        error: 'Match not found',
        message: `Match ${matchId} not found in fixtures`,
        matchId
      });
    }

    res.status(500).json({
      error: 'Failed to fetch match data',
      message: error.message
    });
  }
}
