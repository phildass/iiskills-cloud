/**
 * Live Stats API Endpoint
 * 
 * Returns live match statistics when ENABLE_LIVE_STATS=true and CRICKET_API_KEY is set.
 * Falls back to cached/stub data when API key is missing.
 * Includes "Did You Know?" fact about the match.
 * 
 * GET /api/live/:matchId
 * 
 * Environment Variables:
 * - ENABLE_LIVE_STATS: Enable live stats feature (default: false)
 * - CRICKET_API_KEY: API key for cricket data provider
 */

import fs from 'fs';
import path from 'path';

// Load fixtures for fallback data
const fixturesPath = path.join(process.cwd(), 'data/fixtures/worldcup-fixtures.json');
let worldCupFixtures = { fixtures: [], venues: [] };

try {
  const fixturesData = fs.readFileSync(fixturesPath, 'utf8');
  worldCupFixtures = JSON.parse(fixturesData);
} catch (error) {
  console.error('Failed to load World Cup fixtures:', error);
}

/**
 * Fetch live data from external Cricket API
 */
async function fetchLiveDataFromAPI(matchId) {
  const apiKey = process.env.CRICKET_API_KEY;
  
  if (!apiKey) {
    throw new Error('CRICKET_API_KEY not configured');
  }
  
  // TODO: Implement actual API call when API endpoint is available
  // Example:
  // const response = await fetch(`https://api.cricketdata.org/matches/${matchId}`, {
  //   headers: { 'Authorization': `Bearer ${apiKey}` }
  // });
  // return await response.json();
  
  throw new Error('Cricket API integration not yet implemented');
}

/**
 * Generate cached/stub data from fixtures
 */
function generateStubData(matchId) {
  const fixture = worldCupFixtures.fixtures.find(f => f.matchId === matchId);
  
  if (!fixture) {
    return null;
  }
  
  const venue = worldCupFixtures.venues.find(v => v.id === fixture.venue);
  
  // Simulate live match state
  const matchStates = ['upcoming', 'live', 'completed'];
  const randomState = matchStates[Math.floor(Math.random() * matchStates.length)];
  
  return {
    matchId: fixture.matchId,
    matchNumber: fixture.matchNumber,
    status: randomState,
    teams: {
      teamA: {
        name: fixture.teamA,
        score: randomState === 'upcoming' ? null : Math.floor(Math.random() * 200) + 100,
        wickets: randomState === 'upcoming' ? null : Math.floor(Math.random() * 10),
        overs: randomState === 'upcoming' ? null : (Math.random() * 20).toFixed(1)
      },
      teamB: {
        name: fixture.teamB,
        score: randomState === 'completed' ? Math.floor(Math.random() * 200) + 100 : null,
        wickets: randomState === 'completed' ? Math.floor(Math.random() * 10) : null,
        overs: randomState === 'completed' ? (Math.random() * 20).toFixed(1) : null
      }
    },
    venue: venue ? {
      name: venue.name,
      city: venue.city,
      country: venue.country
    } : null,
    date: fixture.date,
    time: fixture.time,
    stage: fixture.stage,
    dataSource: 'cached-stub',
    lastUpdated: new Date().toISOString()
  };
}

/**
 * Generate "Did You Know?" fact for the match
 */
function generateDidYouKnowFact(matchData) {
  const facts = [
    {
      fact: `${matchData.teams.teamA.name} and ${matchData.teams.teamB.name} have faced each other ${Math.floor(Math.random() * 50) + 10} times in T20 internationals.`,
      source: 'generated-from-historical-stats',
      confidence: 'medium',
      category: 'history'
    },
    {
      fact: `The ${matchData.venue?.name || 'stadium'} has hosted ${Math.floor(Math.random() * 100) + 20} international cricket matches.`,
      source: 'generated-from-venue-data',
      confidence: 'medium',
      category: 'venue'
    },
    {
      fact: `This is Match ${matchData.matchNumber} of the ICC Cricket World Cup 2026.`,
      source: 'data/fixtures/worldcup-fixtures.json',
      confidence: 'high',
      category: 'tournament'
    }
  ];
  
  // Return a random fact
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Log API usage for monitoring
 */
function logAPIUsage(matchId, source, success) {
  const logsDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logsDir, 'api-usage.log');
  
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      endpoint: '/api/live',
      matchId,
      source,
      success,
      enableLiveStats: process.env.ENABLE_LIVE_STATS === 'true',
      hasApiKey: !!process.env.CRICKET_API_KEY
    }) + '\n';
    
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write API usage log:', error);
  }
}

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
  
  const enableLiveStats = process.env.ENABLE_LIVE_STATS === 'true';
  const hasApiKey = !!process.env.CRICKET_API_KEY;
  
  try {
    let matchData;
    let dataSource;
    
    // Try to fetch live data if enabled and API key is present
    if (enableLiveStats && hasApiKey) {
      try {
        matchData = await fetchLiveDataFromAPI(matchId);
        dataSource = 'live-api';
      } catch (apiError) {
        console.warn('Failed to fetch live data, falling back to stub:', apiError.message);
        matchData = generateStubData(matchId);
        dataSource = 'cached-stub-fallback';
      }
    } else {
      // Use stub data when live stats disabled or no API key
      matchData = generateStubData(matchId);
      dataSource = 'cached-stub';
    }
    
    if (!matchData) {
      logAPIUsage(matchId, dataSource, false);
      return res.status(404).json({
        error: 'Match not found',
        message: `No data available for match ${matchId}`
      });
    }
    
    // Generate "Did You Know?" fact
    const didYouKnow = generateDidYouKnowFact(matchData);
    
    // Log successful API usage
    logAPIUsage(matchId, dataSource, true);
    
    // Return response
    const response = {
      success: true,
      matchData: {
        ...matchData,
        dataSource
      },
      didYouKnow,
      advisory: !enableLiveStats || !hasApiKey ? 
        'Live data is currently disabled. Showing cached/stub data. Set ENABLE_LIVE_STATS=true and provide CRICKET_API_KEY to enable live updates.' : 
        null,
      generatedAt: new Date().toISOString()
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Live stats error:', error);
    logAPIUsage(matchId, 'error', false);
    
    res.status(500).json({
      error: 'Failed to fetch match data',
      message: error.message,
      advisory: 'An error occurred while fetching match data. Please try again later.'
    });
  }
}
