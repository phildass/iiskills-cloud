import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "../lib/supabaseClient";
import UniversalLogin from "@shared/UniversalLogin";

/**
 * Admin Page for Learn-Cricket
 *
 * Displays admin login form and verifies admin permissions.
 * Only users with admin role can access the dashboard after authentication.
 */
export default function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const adminStatus = await isAdmin(currentUser);
        setIsUserAdmin(adminStatus);
      }

      setLoading(false);
    };

    checkAdmin();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in, show login form
  if (!user) {
    return (
      <>
        <Head>
          <title>Admin Login - Cricket Know-All</title>
          <meta name="description" content="Admin access for Cricket Know-All" />
        </Head>

        <UniversalLogin
          redirectAfterLogin="/learn"
          appName="Cricket Know-All Admin"
          showMagicLink={true}
          showGoogleAuth={true}
        />
      </>
    );
  }

  // If logged in but not admin, show access denied
  if (!isUserAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-600 text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin area.
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If admin, show admin dashboard
  return (
    <>
      <Head>
        <title>Admin Dashboard - Cricket Know-All</title>
        <meta name="description" content="Admin dashboard for Cricket Know-All" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Welcome to the Cricket Know-All admin area, {user.email}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
                <p className="text-sm text-gray-600">Manage users and permissions</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Content Management</h3>
                <p className="text-sm text-gray-600">Manage cricket content and lessons</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600">View usage statistics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
