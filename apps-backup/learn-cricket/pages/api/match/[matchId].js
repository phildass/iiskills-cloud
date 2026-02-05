/**
 * Get Match Status API Endpoint
 * 
 * Retrieves current match status
 * 
 * GET /api/match/[matchId]
 */

// Access shared match storage
let matchesStore = global.matchesStore || new Map();
global.matchesStore = matchesStore;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { matchId } = req.query;

    if (!matchId) {
      return res.status(400).json({ error: 'matchId is required' });
    }

    const match = matchesStore.get(matchId);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.status(200).json({
      success: true,
      match
    });

  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({
      error: 'Failed to get match',
      message: error.message
    });
  }
}
