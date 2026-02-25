"use client";

import { useState, useEffect } from 'react';

export default function ContentList({ app, searchQuery, onContentSelect }) {
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (app) {
      loadContent();
    }
  }, [app, searchQuery]);

  const loadContent = async () => {
    if (!app) return;

    setIsLoading(true);
    setError(null);

    try {
      const url = searchQuery
        ? `/api/admin/content?search=${encodeURIComponent(searchQuery)}`
        : `/api/admin/content?source_app=${app.id}`;

      const response = await fetch(url);
      const data = await response.json();

      if (response.ok) {
        setContents(searchQuery ? data.results || [] : data.contents || []);
      } else {
        setError(data.error || 'Failed to load content');
      }
    } catch (err) {
      setError('An error occurred while loading content');
      console.error('Content loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    onContentSelect({
      id: '',
      appId: app.id,
      title: '',
      type: app.displayName,
      data: {},
      source: 'filesystem',
      isNew: true,
    });
  };

  if (!app) {
    return (
      <div className="p-8 text-center text-gray-500">
        Select an app from the sidebar to view content
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading content...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery ? 'Search Results' : app.displayName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {contents.length} {contents.length === 1 ? 'item' : 'items'}
          </p>
        </div>
        {!searchQuery && (
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            + Create New
          </button>
        )}
      </div>

      {/* Content Grid */}
      {contents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500 text-lg">No content found</p>
          {!searchQuery && (
            <button
              onClick={handleCreate}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first item
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contents.map((content) => (
            <button
              key={content.id}
              onClick={() => onContentSelect(content)}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {content.title}
                </h3>
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {content.appId}
                </span>
              </div>
              
              {content.data?.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {content.data.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span>{content.type}</span>
                <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">
                  {content.source}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
