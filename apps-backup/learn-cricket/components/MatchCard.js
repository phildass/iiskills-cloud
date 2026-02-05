/**
 * MatchCard Component
 * 
 * Displays match information in a card format
 * Features:
 * - Team names with flags
 * - Match time and venue
 * - Hover effects
 * - Set reminder action
 */

import { useState } from 'react';

export default function MatchCard({ match }) {
  const [reminderSet, setReminderSet] = useState(false);

  if (!match) return null;

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 2000);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr) => {
    return timeStr;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      {/* Match Number/Stage */}
      <div className="text-gray-400 text-sm mb-4">
        {match.stage} • Match {match.matchNumber}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-6">
        {/* Team A */}
        <div className="flex-1 text-center">
          <div className="text-3xl mb-2">{match.teamA?.flag || '🏏'}</div>
          <div className="font-semibold text-white text-lg">{match.teamA?.name}</div>
        </div>

        {/* VS */}
        <div className="px-4 text-gray-500 font-bold">VS</div>

        {/* Team B */}
        <div className="flex-1 text-center">
          <div className="text-3xl mb-2">{match.teamB?.flag || '🏏'}</div>
          <div className="font-semibold text-white text-lg">{match.teamB?.name}</div>
        </div>
      </div>

      {/* Match Details */}
      <div className="border-t border-gray-700 pt-4 space-y-2">
        <div className="flex items-center justify-center text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">{formatDate(match.date)} at {formatTime(match.time)} {match.timezone}</span>
        </div>

        <div className="flex items-center justify-center text-gray-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm">{match.venueName}</span>
        </div>
      </div>

      {/* Set Reminder Button */}
      <div className="mt-6">
        <button
          onClick={handleSetReminder}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors duration-200 ${
            reminderSet
              ? 'bg-green-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={reminderSet}
        >
          {reminderSet ? '✓ Reminder Set' : '🔔 Set Reminder'}
        </button>
      </div>
    </div>
  );
}
