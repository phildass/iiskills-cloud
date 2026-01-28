import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser, isAdmin, signOutUser } from "../../lib/supabaseClient";

export default function AdminIndex() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminAccess, setAdminAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      router.push("/login?redirect=/admin");
      return;
    }

    setUser(currentUser);
    const hasAdminAccess = await isAdmin(currentUser);
    setAdminAccess(hasAdminAccess);

    if (!hasAdminAccess) {
      alert("Admin access required");
      router.push("/learn");
      return;
    }

    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Panel - Learn NEET</title>
        <meta name="description" content="Admin panel for Learn NEET" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Admin Panel</h1>
                <p className="text-sm text-gray-600">Learn NEET Management</p>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/learn"
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                >
                  User View
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-primary mb-4">Welcome, Admin! 👋</h2>
            <p className="text-gray-700">
              Manage Learn NEET subscriptions, users, and view analytics from this central
              dashboard.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-primary">-</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Requires database integration</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                  <p className="text-3xl font-bold text-green-600">-</p>
                </div>
                <div className="text-4xl">✓</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">2-year memberships</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Payments</p>
                  <p className="text-3xl font-bold text-orange-600">-</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Awaiting activation</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue (₹)</p>
                  <p className="text-3xl font-bold text-purple-600">-</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total subscription revenue</p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold text-primary mb-6">Admin Actions</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/memberships"
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">👥</div>
                <h4 className="font-bold text-lg mb-2 text-primary">Membership Management</h4>
                <p className="text-gray-600 text-sm">
                  View and manage user subscriptions and access
                </p>
              </Link>

              <Link
                href="/admin/analytics"
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-bold text-lg mb-2 text-primary">Analytics Dashboard</h4>
                <p className="text-gray-600 text-sm">
                  View usage statistics and performance metrics
                </p>
              </Link>

              <Link
                href="/learn"
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">🏠</div>
                <h4 className="font-bold text-lg mb-2 text-primary">View Site</h4>
                <p className="text-gray-600 text-sm">Go to the public learning dashboard</p>
              </Link>

              <Link
                href="/"
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">🌐</div>
                <h4 className="font-bold text-lg mb-2 text-primary">Landing Page</h4>
                <p className="text-gray-600 text-sm">View the public landing page</p>
              </Link>

              <div className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-left opacity-60">
                <div className="text-3xl mb-2">📧</div>
                <h4 className="font-bold text-lg mb-2 text-gray-500">Email Users</h4>
                <p className="text-gray-500 text-sm">Coming soon...</p>
              </div>

              <div className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-left opacity-60">
                <div className="text-3xl mb-2">⚙️</div>
                <h4 className="font-bold text-lg mb-2 text-gray-500">Settings</h4>
                <p className="text-gray-500 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-6">System Information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Application</span>
                <span className="font-semibold text-charcoal">Learn NEET</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Version</span>
                <span className="font-semibold text-charcoal">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Subscription Model</span>
                <span className="font-semibold text-charcoal">2-Year Premium (₹4,999)</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Framework</span>
                <span className="font-semibold text-charcoal">Next.js</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Authentication</span>
                <span className="font-semibold text-charcoal">Supabase (Role-based)</span>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
            <h4 className="font-bold text-green-900 mb-2">✅ Secure Authentication</h4>
            <p className="text-green-800">
              This admin panel uses secure role-based authentication through Supabase backend. All
              admin access is validated against the database with proper role checking.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
