/**
 * Multi-App Navigation Demo Page
 * 
 * This page demonstrates the new multi-app authentication features:
 * - App switching with preserved authentication
 * - Current app detection
 * - Accessible apps based on user permissions
 * - Session management utilities
 */

import { useState, useEffect } from 'react';
import { getCurrentUser, isAdmin } from '../lib/supabaseClient';
import { getCurrentApp, getAccessibleApps, APPS } from '../lib/appRegistry';
import { 
  getLastVisitedApp, 
  getAppHistory, 
  navigateToApp,
  recordAppVisit 
} from '../lib/sessionManager';
import AppSwitcher from '../components/shared/AppSwitcher';

export default function MultiAppDemo() {
  const [user, setUser] = useState(null);
  const [hasAdminAccess, setHasAdminAccess] = useState(false);
  const [currentApp, setCurrentApp] = useState(null);
  const [accessibleApps, setAccessibleApps] = useState([]);
  const [lastVisited, setLastVisited] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      // Record visit
      recordAppVisit();

      // Get user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Check admin access
      if (currentUser) {
        const adminAccess = await isAdmin(currentUser);
        setHasAdminAccess(adminAccess);
        
        // Get accessible apps
        const apps = getAccessibleApps(currentUser, adminAccess);
        setAccessibleApps(apps);
      } else {
        // Not logged in - only free apps
        const apps = getAccessibleApps(null, false);
        setAccessibleApps(apps);
      }

      // Get current app
      const app = getCurrentApp();
      setCurrentApp(app);

      // Get visit history
      const lastApp = getLastVisitedApp();
      setLastVisited(lastApp);

      const visitHistory = getAppHistory();
      setHistory(visitHistory);

      setLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Multi-App Navigation Demo
          </h1>
          <p className="text-gray-600">
            Demonstration of the enhanced multi-app authentication system
          </p>
        </div>

        {/* Current App Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Current App</h2>
          {currentApp ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{currentApp.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-sm">{currentApp.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Domain:</span>
                <span className="font-mono text-sm">{currentApp.primaryDomain}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Post-Login Redirect:</span>
                <span className="font-mono text-sm">{currentApp.postLoginRedirect}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Free Access:</span>
                <span className={`px-2 py-1 rounded text-sm ${currentApp.isFree ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {currentApp.isFree ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Unable to detect current app</p>
          )}
        </div>

        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Status</h2>
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Admin Access:</span>
                <span className={`px-2 py-1 rounded text-sm ${hasAdminAccess ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                  {hasAdminAccess ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Accessible Apps:</span>
                <span className="font-medium">{accessibleApps.length} apps</span>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-gray-500 mb-4">Not logged in</p>
              <a
                href="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign In
              </a>
            </div>
          )}
        </div>

        {/* App Switcher Demo */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">App Switcher</h2>
          <p className="text-gray-600 mb-4">
            The AppSwitcher component allows users to navigate between apps:
          </p>
          <div className="flex items-center space-x-4">
            <AppSwitcher />
            <span className="text-gray-500 text-sm">← Click to see accessible apps</span>
          </div>
        </div>

        {/* Accessible Apps */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Accessible Apps ({accessibleApps.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleApps.map((app) => (
              <div
                key={app.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                  currentApp?.id === app.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => navigateToApp(app.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{app.name}</h3>
                  {app.isFree && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Free
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mb-2">{app.primaryDomain}</p>
                {currentApp?.id === app.id && (
                  <span className="text-xs text-blue-600 font-medium">Current App</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visit History */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Visit History</h2>
          {lastVisited && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Last visited: </span>
              <span className="font-medium text-blue-900">{lastVisited.name}</span>
            </div>
          )}
          {history.length > 0 ? (
            <ol className="space-y-2">
              {history.map((appId, index) => {
                const app = APPS[appId];
                return app ? (
                  <li key={index} className="flex items-center text-sm">
                    <span className="w-6 text-gray-400">{index + 1}.</span>
                    <span className="text-gray-900">{app.name}</span>
                  </li>
                ) : null;
              })}
            </ol>
          ) : (
            <p className="text-gray-500">No visit history yet</p>
          )}
        </div>

        {/* All Apps Registry */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Apps in Registry ({Object.keys(APPS).length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">App</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Port</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Free</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(APPS).map((app) => (
                  <tr key={app.id} className={currentApp?.id === app.id ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{app.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 font-mono">{app.primaryDomain}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{app.localPort}</td>
                    <td className="px-4 py-3 text-sm">
                      {app.isFree ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {app.features.slice(0, 2).join(', ')}
                      {app.features.length > 2 && '...'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Documentation</h3>
          <ul className="space-y-2">
            <li>
              <a href="/MULTI_APP_AUTH_GUIDE.md" className="text-blue-600 hover:underline">
                📘 Multi-App Authentication Guide
              </a>
              <p className="text-sm text-gray-600 ml-6">Complete guide to the multi-app system</p>
            </li>
            <li>
              <a href="/SUPABASE_MULTI_APP_CONFIG.md" className="text-blue-600 hover:underline">
                ⚙️ Supabase Configuration Guide
              </a>
              <p className="text-sm text-gray-600 ml-6">Setup instructions for Supabase</p>
            </li>
            <li>
              <a href="/AUTHENTICATION_ARCHITECTURE.md" className="text-blue-600 hover:underline">
                🏗️ Authentication Architecture
              </a>
              <p className="text-sm text-gray-600 ml-6">Technical architecture overview</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
