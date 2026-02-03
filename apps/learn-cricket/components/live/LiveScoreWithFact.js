/**
 * LiveScoreWithFact Component
 * 
 * Displays live match score with a "Did You Know?" cricket fact
 * 
 * Features:
 * - Real-time score updates (when ENABLE_LIVE_STATS=true and CRICKET_API_KEY set)
 * - Fallback to fixture data when live stats unavailable
 * - Cricket trivia facts
 * - Responsive design
 * 
 * Props:
 * @param {string} matchId - Match identifier to display
 * @param {boolean} autoRefresh - Enable auto-refresh (default: false)
 * @param {number} refreshInterval - Refresh interval in ms (default: 30000)
 */

import { useState, useEffect } from 'react';

export default function LiveScoreWithFact({ 
  matchId, 
  autoRefresh = false,
  refreshInterval = 30000 
}) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/live/${matchId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch match data');
      }

      setMatchData(data.match);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  useEffect(() => {
    if (autoRefresh && matchId) {
      const interval = setInterval(fetchMatchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, matchId, refreshInterval]);

  if (loading && !matchData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-2">
          <span className="text-red-600 font-semibold">Error Loading Match</span>
        </div>
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchMatchData}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!matchData) {
    return null;
  }

  const isScheduled = matchData.status === 'scheduled';
  const isLive = matchData.status === 'live';
  const isCompleted = matchData.status === 'completed';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Match Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm opacity-90">
              Match {matchData.matchNumber} • {matchData.stage}
              {matchData.group && ` • Group ${matchData.group}`}
            </div>
            <div className="text-lg font-bold mt-1">
              {matchData.teamA.name} vs {matchData.teamB.name}
            </div>
          </div>
          {isLive && (
            <div className="flex items-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="ml-2 text-sm font-semibold">LIVE</span>
            </div>
          )}
          {isScheduled && (
            <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
              Scheduled
            </div>
          )}
          {isCompleted && (
            <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
              Completed
            </div>
          )}
        </div>
      </div>

      {/* Score Section */}
      <div className="p-6">
        {/* Venue & Date */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {matchData.venue?.name}, {matchData.venue?.city}
          <span className="mx-2">•</span>
          {new Date(matchData.date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          })}
        </div>

        {/* Scores */}
        {(isLive || isCompleted) && (
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-lg font-semibold mb-1">{matchData.teamA.name}</div>
              <div className="text-3xl font-bold text-blue-600">
                {matchData.teamA.score || '0'}/{matchData.teamA.wickets || '0'}
              </div>
              {matchData.teamA.overs && (
                <div className="text-sm text-gray-500">
                  ({matchData.teamA.overs} overs)
                </div>
              )}
            </div>
            <div>
              <div className="text-lg font-semibold mb-1">{matchData.teamB.name}</div>
              <div className="text-3xl font-bold text-blue-600">
                {matchData.teamB.score || '0'}/{matchData.teamB.wickets || '0'}
              </div>
              {matchData.teamB.overs && (
                <div className="text-sm text-gray-500">
                  ({matchData.teamB.overs} overs)
                </div>
              )}
            </div>
          </div>
        )}

        {isScheduled && (
          <div className="text-center py-4">
            <div className="text-gray-600 mb-2">Match starts at</div>
            <div className="text-2xl font-bold text-blue-600">{matchData.time}</div>
          </div>
        )}

        {/* Commentary */}
        {matchData.commentary && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="text-sm text-gray-700">{matchData.commentary}</div>
          </div>
        )}

        {/* Did You Know? Fact */}
        {matchData.didYouKnowFact && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-blue-800 mb-1">Did You Know?</p>
                <p className="text-sm text-blue-700">{matchData.didYouKnowFact}</p>
              </div>
            </div>
          </div>
        )}

        {/* Data Source & Last Updated */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <span>
            Source: {matchData.dataSource === 'local-fixtures' ? 'Local Fixtures' : 'Live API'}
          </span>
          {lastUpdated && (
            <span>
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
