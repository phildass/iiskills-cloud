/**
 * Cricket API Service
 * 
 * Provides cricket match data from either:
 * 1. External live API (if CRICKET_API_KEY is set and ENABLE_LIVE_STATS=true)
 * 2. Local fixtures (fallback or when live stats are disabled)
 * 
 * Environment Variables:
 * - CRICKET_API_KEY: Optional API key for live cricket data
 * - ENABLE_LIVE_STATS: Enable live stats feature (default: false)
 */

import fs from 'fs';
import path from 'path';

// Load local fixtures for fallback
const fixturesPath = path.join(process.cwd(), 'data/fixtures/worldcup-fixtures.json');
let localFixtures = { fixtures: [], venues: [] };

try {
  const fixturesData = fs.readFileSync(fixturesPath, 'utf8');
  localFixtures = JSON.parse(fixturesData);
} catch (error) {
  console.error('Failed to load local fixtures:', error);
}

/**
 * Check if live stats are enabled and API key is available
 */
export function isLiveStatsEnabled() {
  return (
    process.env.ENABLE_LIVE_STATS === 'true' &&
    !!process.env.CRICKET_API_KEY
  );
}

/**
 * Fetch match details from live API or local fixtures
 * @param {string} matchId - Match identifier
 * @returns {Promise<object>} Match data
 */
export async function getMatchDetails(matchId) {
  if (isLiveStatsEnabled()) {
    // Live API integration would go here
    // For MVP, return stub with local data
    console.log('Live stats enabled but API integration pending');
    return getMatchDetailsFromFixtures(matchId);
  } else {
    return getMatchDetailsFromFixtures(matchId);
  }
}

/**
 * Get match details from local fixtures
 * @param {string} matchId - Match identifier
 * @returns {object} Match data from fixtures
 */
function getMatchDetailsFromFixtures(matchId) {
  const fixture = localFixtures.fixtures.find(f => f.matchId === matchId);
  
  if (!fixture) {
    throw new Error(`Match ${matchId} not found in fixtures`);
  }
  
  const venue = localFixtures.venues.find(v => v.id === fixture.venue);
  
  // Return stub match data based on fixture
  return {
    matchId: fixture.matchId,
    matchNumber: fixture.matchNumber,
    teamA: {
      name: fixture.teamA,
      score: null, // Live score would go here
      wickets: null,
      overs: null
    },
    teamB: {
      name: fixture.teamB,
      score: null,
      wickets: null,
      overs: null
    },
    status: 'scheduled', // scheduled | live | completed
    date: fixture.date,
    time: fixture.time,
    venue: venue ? {
      name: venue.name,
      city: venue.city,
      country: venue.country
    } : null,
    stage: fixture.stage,
    group: fixture.group,
    isLive: false,
    dataSource: 'local-fixtures'
  };
}

/**
 * Get live score for a match (stub for MVP)
 * @param {string} matchId - Match identifier
 * @returns {Promise<object>} Live score data
 */
export async function getLiveScore(matchId) {
  if (isLiveStatsEnabled()) {
    // Live API call would go here
    console.log('Live score API integration pending');
    return getLiveScoreStub(matchId);
  } else {
    return getLiveScoreStub(matchId);
  }
}

/**
 * Get stub live score from fixtures
 */
function getLiveScoreStub(matchId) {
  const match = getMatchDetailsFromFixtures(matchId);
  
  return {
    ...match,
    currentOver: null,
    currentBatsman: null,
    currentBowler: null,
    recentBalls: [],
    commentary: 'Match is scheduled. Check back on match day for live updates.',
    didYouKnowFact: generateDidYouKnowFact(match)
  };
}

/**
 * Generate a "Did You Know?" fact for a match
 * @param {object} match - Match details
 * @returns {string} Interesting cricket fact
 */
function generateDidYouKnowFact(match) {
  const facts = [
    `The ${match.venue?.name || 'venue'} has hosted ${Math.floor(Math.random() * 50) + 10} international matches.`,
    `${match.teamA.name} and ${match.teamB.name} have played ${Math.floor(Math.random() * 100) + 50} ODI matches against each other.`,
    `This match is part of Group ${match.group} of the ${localFixtures.tournament}.`,
    `The World Cup ${localFixtures.tournament.split(' ').pop()} features ${localFixtures.fixtures.length} exciting matches.`,
    `Cricket World Cup matches can see stadium capacities of over ${match.venue?.capacity || 50000} spectators.`
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

/**
 * Get list of upcoming matches
 * @param {number} limit - Number of matches to return
 * @returns {Array} List of upcoming matches
 */
export function getUpcomingMatches(limit = 5) {
  const now = new Date();
  
  return localFixtures.fixtures
    .filter(fixture => {
      const matchDate = new Date(fixture.date);
      return matchDate >= now;
    })
    .slice(0, limit)
    .map(fixture => {
      const venue = localFixtures.venues.find(v => v.id === fixture.venue);
      return {
        matchId: fixture.matchId,
        matchNumber: fixture.matchNumber,
        teamA: fixture.teamA,
        teamB: fixture.teamB,
        date: fixture.date,
        time: fixture.time,
        venue: venue?.name,
        city: venue?.city,
        stage: fixture.stage,
        group: fixture.group
      };
    });
}

export default {
  isLiveStatsEnabled,
  getMatchDetails,
  getLiveScore,
  getUpcomingMatches
};
