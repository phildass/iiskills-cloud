import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser, isAdmin } from "../../lib/supabaseClient";
import { supabase } from "../../lib/supabaseClient";
import AdminNav from "../../components/AdminNav";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
  });
  const router = useRouter();

  useEffect(() => {
    checkAdminAuth();
    fetchStats();
  }, []);

  const checkAdminAuth = async () => {
    // TEMPORARY: Bypass authentication for immediate admin access
    // TODO: Re-enable authentication after initial setup
    // To disable bypass, set NEXT_PUBLIC_DISABLE_AUTH=false in .env.local
    const BYPASS_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
    
    if (BYPASS_AUTH) {
      console.log('⚠️ ADMIN MODE: Authentication bypassed - full access granted');
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const user = await getCurrentUser();

    if (!user) {
      // Not logged in at all, redirect to admin login
      router.push("/admin/login");
      return;
    }

    const hasAdminAccess = await isAdmin(user);
    if (!hasAdminAccess) {
      // Logged in but not admin, redirect to regular login with error
      router.push("/login?error=admin_access_denied");
      return;
    }

    // User is authenticated and has admin role
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Fetch course count
      const { count: courseCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      // Fetch user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalCourses: courseCount || 0,
        totalUsers: userCount || 0,
        totalModules: 0, // Will be implemented when modules table exists
        totalLessons: 0, // Will be implemented when lessons table exists
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
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

  const allSites = [
    { name: 'Main Site', url: 'https://iiskills.cloud', subdomain: 'main' },
    { name: 'Learn AI', url: 'https://learn-ai.iiskills.cloud', subdomain: 'learn-ai' },
    { name: 'Learn APT', url: 'https://learn-apt.iiskills.cloud', subdomain: 'learn-apt' },
    { name: 'Learn Chemistry', url: 'https://learn-chemistry.iiskills.cloud', subdomain: 'learn-chemistry' },
    { name: 'Learn Cricket', url: 'https://learn-cricket.iiskills.cloud', subdomain: 'learn-cricket' },
    { name: 'Learn Geography', url: 'https://learn-geography.iiskills.cloud', subdomain: 'learn-geography' },
    { name: 'Learn Leadership', url: 'https://learn-leadership.iiskills.cloud', subdomain: 'learn-leadership' },
    { name: 'Learn Management', url: 'https://learn-management.iiskills.cloud', subdomain: 'learn-management' },
    { name: 'Learn Math', url: 'https://learn-math.iiskills.cloud', subdomain: 'learn-math' },
    { name: 'Learn Physics', url: 'https://learn-physics.iiskills.cloud', subdomain: 'learn-physics' },
    { name: 'Learn PR', url: 'https://learn-pr.iiskills.cloud', subdomain: 'learn-pr' },
    { name: 'Learn Winning', url: 'https://learn-winning.iiskills.cloud', subdomain: 'learn-winning' },
  ];

  return (
    <>
      <Head>
        <title>Universal Admin Dashboard - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Warning Banner */}
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>⚠️ ADMIN MODE ACTIVE:</strong> Authentication is temporarily bypassed for immediate access. All administrative functions are available without restrictions.
              </p>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-primary mb-2">Universal Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Manage all iiskills.cloud sites and content from one central location</p>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold opacity-90 mb-1">Total Courses</h3>
                <p className="text-4xl font-bold">{stats.totalCourses}</p>
              </div>
              <div className="text-4xl opacity-80">📚</div>
            </div>
            <p className="text-xs opacity-75 mt-3">Across all sites</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold opacity-90 mb-1">Total Users</h3>
                <p className="text-4xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
            <p className="text-xs opacity-75 mt-3">Registered accounts</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold opacity-90 mb-1">Modules</h3>
                <p className="text-4xl font-bold">{stats.totalModules}</p>
              </div>
              <div className="text-4xl opacity-80">📋</div>
            </div>
            <p className="text-xs opacity-75 mt-3">Course modules</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-semibold opacity-90 mb-1">Lessons</h3>
                <p className="text-4xl font-bold">{stats.totalLessons}</p>
              </div>
              <div className="text-4xl opacity-80">📖</div>
            </div>
            <p className="text-xs opacity-75 mt-3">Total lessons</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Link
            href="/admin/courses"
            className="bg-white border-2 border-blue-200 rounded-lg shadow-md p-6 hover:border-blue-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Manage Courses</h3>
            <p className="text-sm text-gray-600">Create, edit, and organize courses</p>
          </Link>

          <Link
            href="/admin/modules"
            className="bg-white border-2 border-purple-200 rounded-lg shadow-md p-6 hover:border-purple-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📋</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Manage Modules</h3>
            <p className="text-sm text-gray-600">Organize course modules</p>
          </Link>

          <Link
            href="/admin/lessons"
            className="bg-white border-2 border-green-200 rounded-lg shadow-md p-6 hover:border-green-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📖</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Manage Lessons</h3>
            <p className="text-sm text-gray-600">Create and edit lesson content</p>
          </Link>

          <Link
            href="/admin/content"
            className="bg-white border-2 border-orange-200 rounded-lg shadow-md p-6 hover:border-orange-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">✏️</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Edit Content</h3>
            <p className="text-sm text-gray-600">Update page content</p>
          </Link>

          <Link
            href="/admin/users"
            className="bg-white border-2 border-blue-200 rounded-lg shadow-md p-6 hover:border-blue-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">User Management</h3>
            <p className="text-sm text-gray-600">View and manage users</p>
          </Link>

          <Link
            href="/admin/settings"
            className="bg-white border-2 border-purple-200 rounded-lg shadow-md p-6 hover:border-purple-400 hover:shadow-lg transition text-center group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Settings</h3>
            <p className="text-sm text-gray-600">Configure site settings</p>
          </Link>
        </div>

        {/* Multi-Site Management */}
        <h2 className="text-2xl font-bold text-primary mb-6">Multi-Site Management</h2>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <p className="text-gray-600 mb-4">
            Manage content across all iiskills learning platforms. Select a site to filter content or manage site-specific settings.
          </p>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allSites.map((site) => (
              <div
                key={site.subdomain}
                className="border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
              >
                <h4 className="font-semibold text-sm text-gray-800">{site.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{site.subdomain}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Navigation Chart */}
        <h2 className="text-2xl font-bold text-primary mb-6">Admin Navigation</h2>
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center">
                <span className="text-2xl mr-2">📚</span>
                Content Management
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/courses" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Courses - Create, edit, delete courses
                  </Link>
                </li>
                <li>
                  <Link href="/admin/modules" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Modules - Organize course modules
                  </Link>
                </li>
                <li>
                  <Link href="/admin/lessons" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Lessons - Manage lesson content
                  </Link>
                </li>
                <li>
                  <Link href="/admin/content" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Page Content - Edit static pages
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-accent mb-4 flex items-center">
                <span className="text-2xl mr-2">👥</span>
                User & System Management
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/admin/users" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Users - View and manage users
                  </Link>
                </li>
                <li>
                  <Link href="/admin/settings" className="text-blue-600 hover:text-blue-800 hover:underline">
                    → Settings - Configure site settings
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
