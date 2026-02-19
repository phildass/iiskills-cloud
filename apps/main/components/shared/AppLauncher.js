"use client";

import { useState, useEffect } from "react";
import { APPS, APP_TYPE } from "../../../../packages/access-control/appConfig";
import UniversalInstallPrompt from "./UniversalInstallPrompt";

/**
 * AppLauncher Component
 * 
 * Central dashboard showing all iiskills apps with:
 * - Visual cards for each app
 * - Install status indicators
 * - Direct links to apps
 * - Install buttons for each app
 * - Grouping by free/paid
 * - Access status indicators
 * 
 * @param {Object} userAccess - User's app access information from @iiskills/access-control
 * @param {boolean} showInstallButtons - Whether to show install buttons
 * @param {string} view - Display view: 'grid' | 'list'
 */
export default function AppLauncher({ 
  userAccess = null,
  showInstallButtons = true,
  view = "grid"
}) {
  const [installedApps, setInstalledApps] = useState(new Set());

  useEffect(() => {
    // Check which apps are installed (running in standalone mode from their domain)
    // This is a simplified check - in production, you might track this via localStorage
    const checkInstalledApps = () => {
      const installed = new Set();
      
      // Check if current app is installed
      if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
        // Get current app ID from hostname
        const hostname = window.location.hostname;
        if (hostname.includes('learn-')) {
          const appId = hostname.split('.')[0];
          installed.add(appId);
        } else if (hostname === 'iiskills.cloud' || hostname === 'localhost') {
          installed.add('main');
        }
      }
      
      // Check localStorage for installation tracking (apps should set this on first launch)
      Object.keys(APPS).forEach(appId => {
        const isInstalled = localStorage.getItem(`app_installed_${appId}`);
        if (isInstalled === 'true') {
          installed.add(appId);
        }
      });
      
      setInstalledApps(installed);
    };
    
    checkInstalledApps();
  }, []);

  // Group apps by type
  const freeApps = Object.values(APPS).filter(app => app.type === APP_TYPE.FREE);
  const paidApps = Object.values(APPS).filter(app => app.type === APP_TYPE.PAID);

  // Get app URL based on environment
  const getAppUrl = (appId) => {
    if (appId === 'main') {
      return process.env.NODE_ENV === 'production' 
        ? 'https://iiskills.cloud'
        : 'http://localhost:3000';
    }
    
    return process.env.NODE_ENV === 'production'
      ? `https://${appId}.iiskills.cloud`
      : `http://localhost:${getLocalPort(appId)}`;
  };

  // Get local development port for each app
  const getLocalPort = (appId) => {
    const portMap = {
      'main': 3000,
      'learn-ai': 3001,
      'learn-apt': 3002,
      'learn-chemistry': 3003,
      'learn-developer': 3004,
      'learn-geography': 3005,
      'learn-management': 3006,
      'learn-math': 3007,
      'learn-physics': 3008,
      'learn-pr': 3009,
    };
    return portMap[appId] || 3000;
  };

  // Check if user has access to an app
  const hasAccess = (appId) => {
    // Free apps - everyone has access
    if (APPS[appId].type === APP_TYPE.FREE) {
      return true;
    }
    
    // No userAccess provided - assume no access
    if (!userAccess) {
      return false;
    }
    
    // Check if user has access via payment or bundle
    return userAccess[appId]?.hasAccess || false;
  };

  // Get app icon/emoji
  const getAppIcon = (appId) => {
    const icons = {
      'main': '🏠',
      'learn-ai': '🤖',
      'learn-apt': '🧮',
      'learn-chemistry': '⚗️',
      'learn-developer': '💻',
      'learn-geography': '🌍',
      'learn-management': '📊',
      'learn-math': '📐',
      'learn-physics': '⚛️',
      'learn-pr': '📣',
    };
    return icons[appId] || '📚';
  };

  // Get app color
  const getAppColor = (appId, isFree) => {
    if (isFree) {
      return {
        bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
        border: 'border-green-200',
        badge: 'bg-green-600',
        button: 'bg-green-600 hover:bg-green-700',
        text: 'text-green-700',
      };
    }
    return {
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      badge: 'bg-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700',
      text: 'text-blue-700',
    };
  };

  const AppCard = ({ app }) => {
    const isInstalled = installedApps.has(app.id);
    const hasUserAccess = hasAccess(app.id);
    const isFree = app.type === APP_TYPE.FREE;
    const colors = getAppColor(app.id, isFree);
    const appUrl = getAppUrl(app.id);

    return (
      <div className={`${colors.bg} border-2 ${colors.border} rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 relative`}>
        {/* App Status Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className={`${colors.badge} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
            {isFree ? '🎉 FREE' : '💎 PAID'}
          </span>
          {isInstalled && (
            <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded-full font-semibold">
              ✓ Installed
            </span>
          )}
          {!isFree && !hasUserAccess && (
            <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              🔒 Locked
            </span>
          )}
        </div>

        {/* App Icon & Name */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-3">{getAppIcon(app.id)}</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{app.name}</h3>
        </div>

        {/* App Description */}
        <p className="text-sm text-gray-600 text-center mb-4 min-h-[40px]">
          {getAppDescription(app.id)}
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Launch App Button */}
          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full ${colors.button} text-white text-center px-4 py-3 rounded-lg font-semibold transition shadow-md`}
          >
            {isInstalled ? '🚀 Launch' : '🌐 Open'}
          </a>

          {/* Install Button */}
          {showInstallButtons && !isInstalled && (
            <button
              onClick={() => window.open(appUrl, '_blank')}
              className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center px-4 py-2 rounded-lg font-semibold transition text-sm"
            >
              📥 Visit to Install
            </button>
          )}
        </div>

        {/* Access Info for Paid Apps */}
        {!isFree && !hasUserAccess && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              Purchase required to unlock full access
            </p>
          </div>
        )}
      </div>
    );
  };

  const getAppDescription = (appId) => {
    const descriptions = {
      'main': 'Central hub for all your learning needs',
      'learn-ai': 'Master Artificial Intelligence fundamentals',
      'learn-apt': 'Develop aptitude & logical reasoning skills',
      'learn-chemistry': 'Explore the world of chemistry',
      'learn-developer': 'Learn software development skills',
      'learn-geography': 'Discover the world through geography',
      'learn-management': 'Build essential management skills',
      'learn-math': 'Master mathematical concepts',
      'learn-physics': 'Understand the laws of physics',
      'learn-pr': 'Master public relations & communication',
    };
    return descriptions[appId] || 'Expand your skills and knowledge';
  };

  const AppSection = ({ title, apps, description }) => (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {apps.map(app => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map(app => (
            <div key={app.id} className="max-w-3xl">
              <AppCard app={app} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Your App Suite
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Access all iiskills learning apps from one place. Install them on your device for offline access and a native app experience.
        </p>
      </div>

      {/* Install Mother App Prompt - Only show if not installed */}
      {!installedApps.has('main') && (
        <div className="mb-8 max-w-2xl mx-auto">
          <UniversalInstallPrompt 
            currentAppId="main"
            variant="banner"
            size="lg"
            showMotherAppPromo={false}
          />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-4xl mx-auto">
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{Object.keys(APPS).length}</div>
          <div className="text-sm text-gray-600">Total Apps</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{freeApps.length}</div>
          <div className="text-sm text-gray-600">Free Apps</div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{installedApps.size}</div>
          <div className="text-sm text-gray-600">Installed</div>
        </div>
      </div>

      {/* Free Apps Section */}
      <AppSection 
        title="🎉 Free Apps"
        apps={freeApps}
        description="Start learning immediately with our completely free courses"
      />

      {/* Paid Apps Section */}
      <AppSection 
        title="💎 Premium Apps"
        apps={paidApps}
        description="Unlock advanced courses with premium access"
      />

      {/* Info Section */}
      <div className="mt-12 max-w-3xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-900 mb-3">
          💡 How to Install Apps
        </h3>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>On Desktop:</strong> Visit any app and look for the "Install" button in your browser's address bar or click the install button on the page.
          </p>
          <p>
            <strong>On Mobile:</strong> Open any app in your mobile browser and select "Add to Home Screen" from your browser menu.
          </p>
          <p>
            <strong>On iOS:</strong> Tap the Share button in Safari and select "Add to Home Screen".
          </p>
        </div>
      </div>
    </div>
  );
}
