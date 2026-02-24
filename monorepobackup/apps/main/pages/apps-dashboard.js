import { useState, useEffect } from "react";
import Head from "next/head";
import { getCurrentUser } from "../lib/supabaseClient";
import { userHasAccess } from "../../../packages/access-control/accessControl";
import { APPS } from "../../../packages/access-control/appConfig";
import AppLauncher from "../components/shared/AppLauncher";

/**
 * Apps Dashboard Page
 * 
 * Central hub showing all iiskills apps with:
 * - App launcher with install capabilities
 * - User's access status for each app
 * - Quick navigation to all apps
 * - Install promotion for PWA apps
 */
export default function AppsDashboard() {
  const [user, setUser] = useState(null);
  const [userAccess, setUserAccess] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Load access status for all apps
        const accessStatus = {};
        for (const appId of Object.keys(APPS)) {
          try {
            const hasAccess = await userHasAccess(currentUser.id, appId);
            accessStatus[appId] = { hasAccess };
          } catch (error) {
            console.error(`Error checking access for ${appId}:`, error);
            accessStatus[appId] = { hasAccess: false };
          }
        }
        setUserAccess(accessStatus);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>My Apps - iiskills.cloud</title>
        <meta 
          name="description" 
          content="Access all your iiskills learning apps in one place. Install apps for offline access and a native experience." 
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your apps...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              {user && (
                <div className="mb-8 text-center">
                  <p className="text-gray-600">
                    Welcome back, <strong>{user.email}</strong>
                  </p>
                </div>
              )}

              {/* App Launcher */}
              <AppLauncher 
                userAccess={userAccess}
                showInstallButtons={true}
                view="grid"
              />

              {/* Sign In Prompt for Non-Authenticated Users */}
              {!user && (
                <div className="mt-12 max-w-2xl mx-auto bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 text-center">
                  <h3 className="text-xl font-bold text-yellow-900 mb-3">
                    🔐 Sign In for Full Access
                  </h3>
                  <p className="text-yellow-800 mb-4">
                    Create a free account to unlock all features, track your progress, and sync across devices.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <a
                      href="/register"
                      className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Create Account
                    </a>
                    <a
                      href="/login"
                      className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                    >
                      Sign In
                    </a>
                  </div>
                </div>
              )}

              {/* Benefits Section */}
              <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🌐</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">One Sign-In</h3>
                  <p className="text-sm text-gray-600">
                    Register once and access all iiskills apps seamlessly. No repeated sign-ins needed.
                  </p>
                </div>
                
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Install Anywhere</h3>
                  <p className="text-sm text-gray-600">
                    Download apps on any device - phone, tablet, or desktop. Works offline too!
                  </p>
                </div>
                
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🔄</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Synced Progress</h3>
                  <p className="text-sm text-gray-600">
                    Your learning progress syncs automatically across all installed apps and devices.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
