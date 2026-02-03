/**
 * World Cup Landing Page
 * 
 * Main landing page for ICC Cricket World Cup 2026
 * Features:
 * - Hero section with tournament title
 * - Live match clock (UTC)
 * - Next match card
 * - Quick action CTAs
 * - Group standings
 * - Upcoming fixtures
 * - Navigation to Teams & Stars
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WorldCupHero from '../components/WorldCupHero';
import MatchCard from '../components/MatchCard';

export default function WorldCup() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fixturesData, setFixturesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if World Cup mode is enabled
  useEffect(() => {
    const worldCupEnabled = process.env.NEXT_PUBLIC_ENABLE_WORLD_CUP_MODE === 'true' || 
                           process.env.ENABLE_WORLD_CUP_MODE === 'true';
    
    if (!worldCupEnabled) {
      router.push('/');
    }
  }, [router]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load fixtures data
  useEffect(() => {
    const loadFixtures = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/fixtures/worldcup-fixtures.json');
        
        if (!response.ok) {
          throw new Error('Failed to load fixtures data');
        }

        const data = await response.json();
        
        // Enrich fixtures with venue names
        const enrichedFixtures = data.fixtures.map(fixture => ({
          ...fixture,
          venueName: data.venues.find(v => v.id === fixture.venue)?.name || 'TBD',
          venueCity: data.venues.find(v => v.id === fixture.venue)?.city || '',
          teamA: {
            ...fixture.teamA,
            flag: data.teams.find(t => t.code === fixture.teamA.code)?.flag || '🏏'
          },
          teamB: {
            ...fixture.teamB,
            flag: data.teams.find(t => t.code === fixture.teamB.code)?.flag || '🏏'
          }
        }));

        setFixturesData({
          ...data,
          fixtures: enrichedFixtures
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading fixtures:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadFixtures();
  }, []);

  // Get next match
  const getNextMatch = () => {
    if (!fixturesData || !fixturesData.fixtures) return null;

    const now = new Date();
    const upcomingMatches = fixturesData.fixtures
      .filter(match => {
        const matchDate = new Date(`${match.date}T${match.time}:00Z`);
        return matchDate > now && match.status === 'scheduled';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}:00Z`);
        const dateB = new Date(`${b.date}T${b.time}:00Z`);
        return dateA - dateB;
      });

    return upcomingMatches[0] || null;
  };

  // Get upcoming fixtures (next 5)
  const getUpcomingFixtures = () => {
    if (!fixturesData || !fixturesData.fixtures) return [];

    const now = new Date();
    return fixturesData.fixtures
      .filter(match => {
        const matchDate = new Date(`${match.date}T${match.time}:00Z`);
        return matchDate > now && match.status === 'scheduled';
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}:00Z`);
        const dateB = new Date(`${b.date}T${b.time}:00Z`);
        return dateA - dateB;
      })
      .slice(0, 5);
  };

  // Get group standings (mock data - would be dynamic in production)
  const getGroupStandings = (groupName) => {
    if (!fixturesData || !fixturesData.groups) return [];

    const groupKey = groupName === 'Group A' ? 'groupA' : 'groupB';
    const teams = fixturesData.groups[groupKey]?.teams || [];

    // Mock standings with team flags
    return teams.map((teamName, index) => {
      const teamData = fixturesData.teams.find(t => t.name === teamName);
      return {
        position: index + 1,
        team: teamName,
        flag: teamData?.flag || '🏏',
        matches: 0,
        won: 0,
        lost: 0,
        points: 0,
        nrr: '+0.00'
      };
    });
  };

  const formatTime = (date) => {
    return date.toUTCString().split(' ')[4];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading World Cup data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-red-400 text-xl mb-4">Error loading World Cup data</div>
          <p className="text-gray-300">{error}</p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Return Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const nextMatch = getNextMatch();
  const upcomingFixtures = getUpcomingFixtures();
  const groupAStandings = getGroupStandings('Group A');
  const groupBStandings = getGroupStandings('Group B');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />

      {/* Hero Section */}
      <WorldCupHero
        title="ICC Cricket World Cup 2026"
        subtitle="The Ultimate Cricket Championship"
      />

      {/* Live Clock Section */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="text-sm text-gray-400 mb-1">Live Clock (UTC)</div>
              <div className="text-3xl font-bold text-blue-400 font-mono">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-400 mt-1">{formatDate(currentTime)}</div>
            </div>

            {fixturesData && (
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">Tournament Info</div>
                <div className="text-lg font-semibold">{fixturesData.tournament.name}</div>
                <div className="text-sm text-gray-400">
                  {new Date(fixturesData.tournament.startDate).toLocaleDateString()} - {new Date(fixturesData.tournament.endDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Next Match Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Next Match</h2>
          <div className="max-w-2xl mx-auto">
            {nextMatch ? (
              <MatchCard match={nextMatch} />
            ) : (
              <div className="bg-gray-800 rounded-lg p-8 text-center text-gray-400">
                No upcoming matches scheduled
              </div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link href="/daily-strike" className="group">
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-8 text-center hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-2">Daily Strike</h3>
                <p className="text-gray-100">Test your World Cup knowledge with daily trivia</p>
              </div>
            </Link>

            <Link href="/super-over" className="group">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg p-8 text-center hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-2">Play Super Over</h3>
                <p className="text-gray-100">Quick-fire cricket challenges and games</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Group Standings */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Group Standings</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Group A */}
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="bg-blue-900/50 px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold">Group A</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr className="text-sm">
                      <th className="text-left px-4 py-3">Pos</th>
                      <th className="text-left px-4 py-3">Team</th>
                      <th className="text-center px-4 py-3">M</th>
                      <th className="text-center px-4 py-3">W</th>
                      <th className="text-center px-4 py-3">L</th>
                      <th className="text-center px-4 py-3">Pts</th>
                      <th className="text-center px-4 py-3">NRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupAStandings.map((team) => (
                      <tr key={team.team} className="border-t border-gray-700 hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-semibold">{team.position}</td>
                        <td className="px-4 py-3">
                          <span className="mr-2">{team.flag}</span>
                          {team.team}
                        </td>
                        <td className="text-center px-4 py-3">{team.matches}</td>
                        <td className="text-center px-4 py-3">{team.won}</td>
                        <td className="text-center px-4 py-3">{team.lost}</td>
                        <td className="text-center px-4 py-3 font-bold">{team.points}</td>
                        <td className="text-center px-4 py-3">{team.nrr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Group B */}
            <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              <div className="bg-cyan-900/50 px-6 py-4 border-b border-gray-700">
                <h3 className="text-xl font-bold">Group B</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700/50">
                    <tr className="text-sm">
                      <th className="text-left px-4 py-3">Pos</th>
                      <th className="text-left px-4 py-3">Team</th>
                      <th className="text-center px-4 py-3">M</th>
                      <th className="text-center px-4 py-3">W</th>
                      <th className="text-center px-4 py-3">L</th>
                      <th className="text-center px-4 py-3">Pts</th>
                      <th className="text-center px-4 py-3">NRR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupBStandings.map((team) => (
                      <tr key={team.team} className="border-t border-gray-700 hover:bg-gray-700/30">
                        <td className="px-4 py-3 font-semibold">{team.position}</td>
                        <td className="px-4 py-3">
                          <span className="mr-2">{team.flag}</span>
                          {team.team}
                        </td>
                        <td className="text-center px-4 py-3">{team.matches}</td>
                        <td className="text-center px-4 py-3">{team.won}</td>
                        <td className="text-center px-4 py-3">{team.lost}</td>
                        <td className="text-center px-4 py-3 font-bold">{team.points}</td>
                        <td className="text-center px-4 py-3">{team.nrr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Fixtures */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Upcoming Fixtures</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="divide-y divide-gray-700">
              {upcomingFixtures.length > 0 ? (
                upcomingFixtures.map((match) => (
                  <div key={match.matchId} className="p-4 hover:bg-gray-700/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-2 md:mb-0">
                        <div className="text-gray-400 text-sm font-medium w-20">
                          Match {match.matchNumber}
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{match.teamA.flag}</span>
                          <span className="font-semibold">{match.teamA.name}</span>
                          <span className="text-gray-500">vs</span>
                          <span className="font-semibold">{match.teamB.name}</span>
                          <span className="text-xl">{match.teamB.flag}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400 md:ml-4">
                        <div>
                          {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div>{match.time} UTC</div>
                        <div className="hidden md:block">{match.venueName}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-400">
                  No upcoming fixtures available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Navigation to Teams & Stars */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-8 border border-purple-700">
            <h2 className="text-2xl font-bold mb-4">Explore More</h2>
            <p className="text-gray-300 mb-6">
              Discover participating teams, star players, and tournament statistics
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/teams" className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors">
                View Teams
              </Link>
              <Link href="/stars" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
                Top Stars
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
