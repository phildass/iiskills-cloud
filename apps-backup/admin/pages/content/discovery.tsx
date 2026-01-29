/**
 * Admin Content Discovery Dashboard
 * 
 * This page demonstrates the unified content discovery system
 * across all apps in the iiskills-cloud monorepo.
 */

import { useState, useEffect } from 'react';
import Head from 'next/head';

// Mock data - in production, these would be imported from packages
interface UnifiedContent {
  id: string;
  type: 'job' | 'lesson' | 'test' | 'module' | 'sports' | 'article' | 'other';
  title: string;
  description?: string;
  tags?: string[];
  location?: {
    country?: string;
    state?: string;
    district?: string;
  };
  deadline?: string;
  url?: string;
  app?: string;
  status?: 'draft' | 'published' | 'archived';
}

interface ContentFilters {
  searchQuery?: string;
  type?: string[];
  tags?: string[];
  apps?: string[];
  location?: {
    country?: string;
    state?: string;
    district?: string;
  };
}

export default function ContentDiscovery() {
  const [allContent, setAllContent] = useState<UnifiedContent[]>([]);
  const [filteredContent, setFilteredContent] = useState<UnifiedContent[]>([]);
  const [filters, setFilters] = useState<ContentFilters>({});
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<UnifiedContent | null>(null);

  // Load content from manifests
  useEffect(() => {
    loadContent();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [filters, allContent]);

  const loadContent = async () => {
    try {
      // In production, load from API endpoints or directly from manifests
      const mockContent: UnifiedContent[] = [
        {
          id: 'apt-1',
          type: 'test',
          title: 'Logical Reasoning Test',
          description: 'Test your logical reasoning skills',
          tags: ['aptitude', 'reasoning', 'beginner'],
          app: 'learn-apt',
          url: '/tests/logical-reasoning-1',
          status: 'published',
        },
        {
          id: 'job-1',
          type: 'job',
          title: 'Junior Clerk - Patna District Court',
          description: 'Applications invited for Junior Clerk position',
          tags: ['government', 'clerk', 'patna', 'bihar'],
          app: 'learn-govt-jobs',
          url: '/jobs/bihar/patna/clerk-001',
          location: { country: 'India', state: 'Bihar', district: 'Patna' },
          deadline: '2026-03-15T23:59:59Z',
          status: 'published',
        },
        {
          id: 'cricket-1',
          type: 'lesson',
          title: 'Cricket Rules - The Basics',
          description: 'Learn the fundamental rules of cricket',
          tags: ['cricket', 'sports', 'rules', 'beginner'],
          app: 'learn-cricket',
          url: '/lessons/rules-basics',
          status: 'published',
        },
      ];

      setAllContent(mockContent);
      setFilteredContent(mockContent);
      setLoading(false);
    } catch (error) {
      console.error('Error loading content:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let results = [...allContent];

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      results = results.filter(
        item =>
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by type
    if (filters.type && filters.type.length > 0) {
      results = results.filter(item => filters.type!.includes(item.type));
    }

    // Filter by app
    if (filters.apps && filters.apps.length > 0) {
      results = results.filter(item => item.app && filters.apps!.includes(item.app));
    }

    // Filter by location
    if (filters.location) {
      results = results.filter(item => {
        if (!item.location) return false;
        const loc = item.location;
        const filterLoc = filters.location!;
        
        if (filterLoc.country && loc.country !== filterLoc.country) return false;
        if (filterLoc.state && loc.state !== filterLoc.state) return false;
        if (filterLoc.district && loc.district !== filterLoc.district) return false;
        
        return true;
      });
    }

    setFilteredContent(results);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchQuery: e.target.value });
  };

  const handleTypeFilter = (type: string) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilters({ ...filters, type: newTypes });
  };

  const handleAppFilter = (app: string) => {
    const currentApps = filters.apps || [];
    const newApps = currentApps.includes(app)
      ? currentApps.filter(a => a !== app)
      : [...currentApps, app];
    setFilters({ ...filters, apps: newApps });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getContentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      test: 'bg-blue-100 text-blue-800',
      job: 'bg-green-100 text-green-800',
      lesson: 'bg-purple-100 text-purple-800',
      module: 'bg-yellow-100 text-yellow-800',
      sports: 'bg-red-100 text-red-800',
      article: 'bg-indigo-100 text-indigo-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Content Discovery - Admin Dashboard</title>
        <meta name="description" content="Unified content discovery across all iiskills apps" />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Discovery</h1>
          <p className="mt-2 text-gray-600">
            Search and manage content across all apps in the iiskills-cloud platform
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search content by title, description, or tags..."
            value={filters.searchQuery || ''}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear
                </button>
              </div>

              {/* Content Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Content Type</h3>
                <div className="space-y-2">
                  {['test', 'job', 'lesson', 'module', 'sports', 'article'].map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type?.includes(type) || false}
                        onChange={() => handleTypeFilter(type)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* App Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Source App</h3>
                <div className="space-y-2">
                  {['learn-apt', 'learn-govt-jobs', 'learn-cricket'].map(app => (
                    <label key={app} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.apps?.includes(app) || false}
                        onChange={() => handleAppFilter(app)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{app}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <p className="mb-1">Total: {allContent.length}</p>
                  <p>Showing: {filteredContent.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content List */}
          <div className="lg:col-span-3">
            {filteredContent.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600">No content found matching your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContent.map(content => (
                  <div
                    key={content.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedContent(content)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded ${getContentTypeColor(
                              content.type
                            )}`}
                          >
                            {content.type}
                          </span>
                          <span className="text-xs text-gray-500">{content.app}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {content.title}
                        </h3>
                        {content.description && (
                          <p className="text-gray-600 text-sm mb-3">{content.description}</p>
                        )}
                        {content.tags && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {content.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {content.location && (
                          <p className="text-sm text-gray-500">
                            📍 {content.location.district}, {content.location.state},{' '}
                            {content.location.country}
                          </p>
                        )}
                        {content.deadline && (
                          <p className="text-sm text-red-600 mt-2">
                            ⏰ Deadline: {new Date(content.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${
                            content.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {content.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content Detail Modal */}
        {selectedContent && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedContent(null)}
          >
            <div
              className="bg-white rounded-lg max-w-2xl w-full p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedContent.title}</h2>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getContentTypeColor(
                      selectedContent.type
                    )}`}
                  >
                    {selectedContent.type}
                  </span>
                </div>
                {selectedContent.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <p className="text-gray-600">{selectedContent.description}</p>
                  </div>
                )}
                {selectedContent.tags && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedContent.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {selectedContent.url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                    <a
                      href={selectedContent.url}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {selectedContent.url}
                    </a>
                  </div>
                )}
                <div className="flex gap-4 pt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                    View Full
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
