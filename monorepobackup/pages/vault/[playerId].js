/**
 * The Vault - Player Detail Page
 * 
 * Individual player profile with statistics and summary.
 * For MVP: Skeleton with placeholder data
 * For Phase 2: Real player data from database + AI-generated summaries
 */

import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Placeholder player data
const PLAYERS_DATA = {
  player_1: {
    id: 'player_1',
    name: 'Virat Kohli',
    country: 'India',
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    summary: 'One of the greatest batsmen of all time, known for his aggressive batting style and exceptional chase record.',
    stats: {
      matches: 254,
      runs: 12311,
      wickets: 4,
      average: 53.62,
      strikeRate: 93.17
    }
  },
  player_2: {
    id: 'player_2',
    name: 'Rohit Sharma',
    country: 'India',
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
    summary: 'Elegant opener known for his ability to play long innings and hit massive sixes.',
    stats: {
      matches: 227,
      runs: 9115,
      wickets: 8,
      average: 48.73,
      strikeRate: 88.90
    }
  },
  player_3: {
    id: 'player_3',
    name: 'Jasprit Bumrah',
    country: 'India',
    role: 'Bowler',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm fast',
    summary: 'Premier fast bowler with unique action and exceptional death bowling skills.',
    stats: {
      matches: 70,
      runs: 25,
      wickets: 121,
      average: 24.43,
      strikeRate: 28.9
    }
  },
  player_4: {
    id: 'player_4',
    name: 'MS Dhoni',
    country: 'India',
    role: 'Wicket-keeper',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm medium',
    summary: 'Legendary captain and finisher, known for his calm demeanor and match-winning abilities.',
    stats: {
      matches: 350,
      runs: 10773,
      wickets: 1,
      average: 50.57,
      strikeRate: 87.56
    }
  },
  player_5: {
    id: 'player_5',
    name: 'Sachin Tendulkar',
    country: 'India',
    role: 'Batsman',
    battingStyle: 'Right-hand bat',
    bowlingStyle: 'Right-arm off break',
    summary: 'The "God of Cricket", holder of most international cricket records and beloved icon.',
    stats: {
      matches: 463,
      runs: 18426,
      wickets: 154,
      average: 44.83,
      strikeRate: 86.23
    }
  }
};

export default function PlayerDetail() {
  const router = useRouter();
  const { playerId } = router.query;

  // Get player data (placeholder for MVP)
  const player = PLAYERS_DATA[playerId];

  if (!player) {
    return (
      <>
        <Head>
          <title>Player Not Found | The Vault</title>
        </Head>
        <main className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Player Not Found</h1>
            <p className="text-gray-600 mb-8">
              The player you're looking for doesn't exist in our database.
            </p>
            <Link
              href="/vault"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              ← Back to The Vault
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{player.name} - Player Profile | The Vault</title>
        <meta name="description" content={`${player.name} - ${player.summary}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link
            href="/vault"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
          >
            ← Back to The Vault
          </Link>

          {/* Player Header */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {player.name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-2">
                    🌍 {player.country}
                  </span>
                  <span className="flex items-center gap-2">
                    🏏 {player.role}
                  </span>
                </div>
              </div>
              <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full font-medium">
                {player.role}
              </span>
            </div>

            {/* Player Summary (AI-generated in Phase 2) */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-700 leading-relaxed">
                {player.summary}
              </p>
              <p className="text-xs text-gray-500 mt-3 italic">
                Note: In Phase 2, this summary will be AI-generated from structured player data.
              </p>
            </div>

            {/* Playing Style */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Batting Style</h3>
                <p className="text-gray-700">{player.battingStyle}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Bowling Style</h3>
                <p className="text-gray-700">{player.bowlingStyle}</p>
              </div>
            </div>
          </div>

          {/* Career Statistics */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Career Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {player.stats.matches}
                </div>
                <div className="text-sm text-gray-600">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {player.stats.runs.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Runs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {player.stats.wickets}
                </div>
                <div className="text-sm text-gray-600">Wickets</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {player.stats.average}
                </div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {player.stats.strikeRate}
                </div>
                <div className="text-sm text-gray-600">Strike Rate</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-6 italic">
              Note: Placeholder data for MVP. Phase 2 will integrate real player statistics.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
