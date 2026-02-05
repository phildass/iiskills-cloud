import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ModerationDashboard() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [stats, setStats] = useState({ total: 0, flagged: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    checkAccess();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, statusFilter, searchQuery, contentTypeFilter]);

  const checkAccess = async () => {
    const adminSetupMode = process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
    
    if (!adminSetupMode) {
      setError('Access Denied: Admin setup mode is not enabled');
      setLoading(false);
      return;
    }

    await loadData();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/moderation/entries');
      
      if (!response.ok) {
        throw new Error('Failed to load moderation data');
      }

      const data = await response.json();
      setEntries(data.entries || []);
      setStats(data.stats || { total: 0, flagged: 0, approved: 0, rejected: 0 });
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    // Search filter
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.contentType.toLowerCase().includes(search) ||
        entry.reason.toLowerCase().includes(search) ||
        (entry.content && entry.content.toLowerCase().includes(search))
      );
    }

    // Content type filter
    if (contentTypeFilter !== 'all') {
      filtered = filtered.filter(entry => entry.contentType === contentTypeFilter);
    }

    setFilteredEntries(filtered);
    setCurrentPage(1);
  };

  const handleAction = async (entryId, action) => {
    try {
      const response = await fetch('/api/moderation/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entryId, status: action })
      });

      if (!response.ok) {
        throw new Error('Failed to update entry');
      }

      await loadData();
    } catch (err) {
      console.error('Error updating entry:', err);
      setError('Failed to update entry: ' + err.message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const getUniqueContentTypes = () => {
    const types = new Set(entries.map(e => e.contentType));
    return Array.from(types);
  };

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = filteredEntries.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading moderation dashboard...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error && error.includes('Access Denied')) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-8">
              <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h1 className="text-2xl font-bold text-red-400 mb-2">Access Denied</h1>
              <p className="text-gray-300 mb-6">
                Admin setup mode is not enabled. Please set NEXT_PUBLIC_ADMIN_SETUP_MODE=true to access this page.
              </p>
              <button 
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
              >
                Return Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Content Moderation Dashboard - Cricket Universe</title>
        <meta name="description" content="Moderation dashboard for Cricket Universe content" />
      </Head>

      <Navbar />

      <main className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Error Message Toast */}
          {error && !error.includes('Access Denied') && (
            <div className="mb-6 bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-400">{error}</span>
              </div>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Content Moderation</h1>
            <p className="text-gray-400">Review and manage flagged content</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <div className="text-gray-400 text-sm mb-1">Total Entries</div>
              <div className="text-3xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6">
              <div className="text-yellow-400 text-sm mb-1">Flagged</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.flagged}</div>
            </div>
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
              <div className="text-green-400 text-sm mb-1">Approved</div>
              <div className="text-3xl font-bold text-green-400">{stats.approved}</div>
            </div>
            <div className="bg-red-900/20 border border-red-700 rounded-lg p-6">
              <div className="text-red-400 text-sm mb-1">Rejected</div>
              <div className="text-3xl font-bold text-red-400">{stats.rejected}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="flagged">Flagged</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {getUniqueContentTypes().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by type or reason..."
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg">No entries found</p>
                <p className="text-sm mt-2">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-700/50">
                      <tr>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Timestamp</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Content Type</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Reason</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Status</th>
                        <th className="text-left py-4 px-6 text-gray-300 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedEntries.map((entry, index) => (
                        <tr 
                          key={entry.id} 
                          className={`border-t border-gray-700 hover:bg-gray-700/30 transition-colors ${
                            index % 2 === 0 ? 'bg-gray-800/50' : ''
                          }`}
                        >
                          <td className="py-4 px-6 text-gray-300 text-sm">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-block px-3 py-1 bg-blue-900/30 border border-blue-700 text-blue-400 text-sm rounded-full">
                              {entry.contentType}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-300 text-sm max-w-md truncate" title={entry.reason}>
                            {entry.reason}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-3 py-1 text-sm rounded-full font-medium ${
                              entry.status === 'flagged' ? 'bg-yellow-900/30 border border-yellow-700 text-yellow-400' :
                              entry.status === 'approved' ? 'bg-green-900/30 border border-green-700 text-green-400' :
                              'bg-red-900/30 border border-red-700 text-red-400'
                            }`}>
                              {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAction(entry.id, 'approved')}
                                disabled={entry.status === 'approved'}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                  entry.status === 'approved'
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAction(entry.id, 'rejected')}
                                disabled={entry.status === 'rejected'}
                                className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                  entry.status === 'rejected'
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="border-t border-gray-700 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEntries.length)} of {filteredEntries.length} entries
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === 1
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        Previous
                      </button>
                      <div className="flex items-center px-4 text-gray-300">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === totalPages
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
