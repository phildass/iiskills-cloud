/**
 * The Vault - Players Index
 * 
 * Searchable page for browsing cricket players, matches, and venues.
 * For MVP: Stub implementation with placeholder data
 * For Phase 2: Real Elasticsearch/OpenSearch integration
 */

import Head from 'next/head';
import { useState } from 'react';
import Link from 'next/link';

// Placeholder player data for MVP
const PLACEHOLDER_PLAYERS = [
  { id: 'player_1', name: 'Virat Kohli', country: 'India', role: 'Batsman' },
  { id: 'player_2', name: 'Rohit Sharma', country: 'India', role: 'Batsman' },
  { id: 'player_3', name: 'Jasprit Bumrah', country: 'India', role: 'Bowler' },
  { id: 'player_4', name: 'MS Dhoni', country: 'India', role: 'Wicket-keeper' },
  { id: 'player_5', name: 'Sachin Tendulkar', country: 'India', role: 'Batsman' }
];

export default function VaultIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState(PLACEHOLDER_PLAYERS);

  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredPlayers(PLACEHOLDER_PLAYERS);
      return;
    }

    // Simple search filter (stub for MVP)
    const filtered = PLACEHOLDER_PLAYERS.filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase()) ||
      player.country.toLowerCase().includes(query.toLowerCase()) ||
      player.role.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredPlayers(filtered);
  };

  return (
    <>
      <Head>
        <title>The Vault - Cricket Players Database | Cricket Universe</title>
        <meta name="description" content="Browse cricket players, matches, and venues in The Vault" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🏆 The Vault
            </h1>
            <p className="text-xl text-gray-600">
              Discover cricket players, legendary matches, and iconic venues
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search players, matches, or venues..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-2">
              MVP: Stub search with placeholder data. Phase 2 will integrate Elasticsearch.
            </p>
          </div>

          {/* Players Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Link
                  key={player.id}
                  href={`/vault/${player.id}`}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {player.name}
                      </h3>
                      <p className="text-gray-600">{player.country}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {player.role}
                    </span>
                  </div>
                  <p className="text-blue-600 hover:text-blue-800 font-medium">
                    View Profile →
                  </p>
                </Link>
              ))}
            </div>

            {filteredPlayers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No players found matching your search.</p>
              </div>
            )}
          </div>

          {/* Placeholder sections for Matches and Venues */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏏 Matches</h2>
              <p className="text-gray-600 mb-4">
                Explore legendary cricket matches, Super Overs, and tournament finals.
              </p>
              <p className="text-sm text-gray-500 italic">
                Coming in Phase 2: Full match database with statistics and highlights.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🏟️ Venues</h2>
              <p className="text-gray-600 mb-4">
                Discover iconic cricket stadiums and their histories around the world.
              </p>
              <p className="text-sm text-gray-500 italic">
                Coming in Phase 2: Venue database with capacity, records, and notable matches.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
