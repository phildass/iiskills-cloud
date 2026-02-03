import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "../../lib/supabaseClient";
import AdminNav from "../../components/AdminNav";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const user = await getCurrentUser();

    if (!user) {
      // Not logged in at all, redirect to login
      router.push("/login?redirect=/dashboard/admin");
      return;
    }

    const hasAdminAccess = await isAdmin(user);
    if (!hasAdminAccess) {
      // Logged in but not admin, redirect to regular dashboard with error
      router.push("/dashboard?error=admin_access_denied");
      return;
    }

    // User is authenticated and has admin role
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-primary mb-8">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Statistics Cards */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Total Courses</h3>
            <p className="text-4xl font-bold text-primary">20</p>
            <p className="text-sm text-gray-600 mt-2">Active courses available</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Enrolled Students</h3>
            <p className="text-4xl font-bold text-accent">0</p>
            <p className="text-sm text-gray-600 mt-2">Total enrollments</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-charcoal mb-2">Certifications Issued</h3>
            <p className="text-4xl font-bold text-primary">0</p>
            <p className="text-sm text-gray-600 mt-2">Students certified</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-accent mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/courses"
            className="bg-primary text-white rounded-lg shadow p-6 hover:bg-blue-700 transition text-center"
          >
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-lg">Manage Courses</h3>
            <p className="text-sm mt-2">Add, edit, or remove courses</p>
          </Link>

          <Link
            href="/admin/content"
            className="bg-accent text-white rounded-lg shadow p-6 hover:bg-purple-600 transition text-center"
          >
            <div className="text-3xl mb-2">✏️</div>
            <h3 className="font-bold text-lg">Edit Content</h3>
            <p className="text-sm mt-2">Update page content</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-primary text-white rounded-lg shadow p-6 hover:bg-blue-700 transition text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="font-bold text-lg">User Management</h3>
            <p className="text-sm mt-2">View enrolled users</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-accent text-white rounded-lg shadow p-6 hover:bg-purple-600 transition text-center"
          >
            <div className="text-3xl mb-2">⚙️</div>
            <h3 className="font-bold text-lg">Settings</h3>
            <p className="text-sm mt-2">Configure site settings</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-accent mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">No recent activity to display.</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
