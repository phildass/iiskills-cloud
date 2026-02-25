/**

"use client";
 * App Switcher Component
 * 
 * Provides a dropdown UI for users to switch between accessible apps
 * in the iiskills.cloud ecosystem.
 * 
 * Features:
 * - Shows all apps accessible to the current user
 * - Highlights the current app
 * - Preserves authentication when navigating between apps
 * - Indicates free vs paid apps
 */

import { useState, useEffect } from 'react';
import { getCurrentUser, isAdmin } from "@lib/supabaseClient";
import { getAppNavigationItems, getCurrentApp } from "@lib/appRegistry";
import { navigateToApp } from "@lib/sessionManager";

export default function AppSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [apps, setApps] = useState([]);
  const [currentApp, setCurrentApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    loadApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Handle keyboard events when dropdown is open
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          setIsOpen(false);
          setFocusedIndex(-1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => Math.min(prev + 1, apps.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedIndex >= 0 && apps[focusedIndex]) {
            handleAppSelect(apps[focusedIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, focusedIndex, apps]);

  const loadApps = async () => {
    try {
      const user = await getCurrentUser();
      const hasAdminAccess = user ? await isAdmin(user) : false;
      const navItems = getAppNavigationItems(user, hasAdminAccess);
      const current = getCurrentApp();
      
      setApps(navItems);
      setCurrentApp(current);
      setLoading(false);
    } catch (error) {
      console.error('Error loading apps:', error);
      setLoading(false);
    }
  };

  const handleAppSelect = (appId) => {
    navigateToApp(appId);
    setIsOpen(false);
  };

  if (loading || apps.length <= 1) {
    // Don't show switcher if only one app or still loading
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{currentApp?.name || 'Apps'}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1" role="menu" aria-orientation="vertical">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Switch Apps
              </div>
              
              {apps.map((app, index) => (
                <button
                  key={app.id}
                  onClick={() => handleAppSelect(app.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center justify-between ${
                    app.isCurrent ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } ${focusedIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                  role="menuitem"
                  tabIndex={isOpen ? 0 : -1}
                >
                  <span className="flex items-center">
                    {app.isCurrent && (
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {app.name}
                  </span>
                </button>
              ))}
              
              <div className="border-t border-gray-100 mt-1 pt-1">
                <div className="px-4 py-2 text-xs text-gray-500">
                  Your session works across all apps
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
