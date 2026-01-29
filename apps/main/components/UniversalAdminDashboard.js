import { useState, useEffect } from 'react';
import AppSwitcher from './admin/AppSwitcher';
import ContentList from './admin/ContentList';
import ContentEditor from './admin/ContentEditor';
import GlobalSearch from './admin/GlobalSearch';

export default function UniversalAdminDashboard() {
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    try {
      const response = await fetch('/api/admin/apps');
      const data = await response.json();
      setApps(data.apps || []);
      if (data.apps && data.apps.length > 0) {
        setSelectedApp(data.apps[0]);
      }
    } catch (error) {
      console.error('Failed to load apps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppChange = (app) => {
    setSelectedApp(app);
    setSelectedContent(null);
  };

  const handleContentSelect = (content) => {
    setSelectedContent(content);
  };

  const handleContentSaved = () => {
    setSelectedContent(null);
    // Trigger refresh of content list
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with App Switcher */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Universal Admin</h1>
          <p className="text-xs text-gray-500 mt-1">iiskills.cloud</p>
        </div>
        
        <AppSwitcher
          apps={apps}
          selectedApp={selectedApp}
          onAppChange={handleAppChange}
        />

        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar with Global Search */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4">
          <GlobalSearch
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {selectedContent ? (
            <ContentEditor
              app={selectedApp}
              content={selectedContent}
              onSave={handleContentSaved}
              onCancel={() => setSelectedContent(null)}
            />
          ) : (
            <ContentList
              app={selectedApp}
              searchQuery={searchQuery}
              onContentSelect={handleContentSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}
