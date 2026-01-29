import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AdminNav from "../components/AdminNav";
import Footer from "../components/Footer";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    sources: {
      supabase: { courses: 0, users: 0, modules: 0, lessons: 0 },
      local: { courses: 0, users: 0, modules: 0, lessons: 0 },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch from API endpoint
      const response = await fetch('/api/stats');
      const result = await response.json();
      
      if (result.error) throw new Error(result.error);
      setStats(result.data || {
        totalCourses: 0,
        totalUsers: 0,
        totalModules: 0,
        totalLessons: 0,
        sources: {
          supabase: { courses: 0, users: 0, modules: 0, lessons: 0 },
          local: { courses: 0, users: 0, modules: 0, lessons: 0 },
        },
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - iiskills.cloud (UNIFIED MODE)</title>
        <meta name="description" content="Admin dashboard with unified content from all sources" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome to the iiskills.cloud admin panel. Data is aggregated from all available sources (Supabase + Local).
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Courses */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Courses</dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                          {loading ? '...' : stats.totalCourses}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href="/courses" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all courses →
                  </Link>
                </div>
              </div>

              {/* Total Users */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                          {loading ? '...' : stats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href="/users" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all users →
                  </Link>
                </div>
              </div>

              {/* Total Modules */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Modules</dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                          {loading ? '...' : stats.totalModules}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href="/modules" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all modules →
                  </Link>
                </div>
              </div>

              {/* Total Lessons */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Lessons</dt>
                        <dd className="text-3xl font-semibold text-gray-900">
                          {loading ? '...' : stats.totalLessons}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-5 py-3">
                  <Link href="/lessons" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all lessons →
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Link
                    href="/courses"
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">Manage Courses</p>
                      <p className="text-sm text-gray-500 truncate">View and edit all courses</p>
                    </div>
                  </Link>

                  <Link
                    href="/users"
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-500 truncate">View and manage user profiles</p>
                    </div>
                  </Link>

                  <Link
                    href="/settings"
                    className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <p className="text-sm font-medium text-gray-900">Settings</p>
                      <p className="text-sm text-gray-500 truncate">Configure admin settings</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Data Source Breakdown */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Data Sources</h2>
                <p className="text-sm text-gray-600 mb-4">
                  This dashboard aggregates content from multiple sources to ensure you always see all available data.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Supabase Source */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">Supabase Database</h3>
                        <p className="text-xs text-gray-500">Production data source</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Courses</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.supabase?.courses || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Users</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.supabase?.users || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Modules</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.supabase?.modules || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Lessons</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.supabase?.lessons || 0}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Local/Mock Source */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">Local Content</h3>
                        <p className="text-xs text-gray-500">Mock/test data source</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Courses</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.local?.courses || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Users</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.local?.users || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Modules</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.local?.modules || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Lessons</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.local?.lessons || 0}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Auto-Discovered Sources */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-base font-medium text-gray-900">Auto-Discovered</h3>
                        <p className="text-xs text-gray-500">From learn-* apps</p>
                      </div>
                    </div>
                    <dl className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Courses</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.discovered?.courses || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Users</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.discovered?.users || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Modules</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.discovered?.modules || 0}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Lessons</dt>
                        <dd className="font-medium text-gray-900">{stats.sources?.discovered?.lessons || 0}</dd>
                      </div>
                    </dl>
                    {stats.sources?.discovered?.sources?.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-600 font-medium mb-1">
                          Discovered from {stats.sources.discovered.sources.length} app(s):
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {stats.sources.discovered.sources.slice(0, 5).map((source, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {source.app}
                            </span>
                          ))}
                          {stats.sources.discovered.sources.length > 5 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{stats.sources.discovered.sources.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Per-App Breakdown */}
            {stats.perApp && Object.keys(stats.perApp).length > 0 && (
              <div className="mt-8 bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Content by App ({stats.totalApps || 0} total)</h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Content is properly isolated per app. Each app's content is kept separate.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            App ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Courses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Modules
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lessons
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(stats.perApp).map(([appId, counts]) => (
                          <tr key={appId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{appId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {counts.courses}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {counts.modules}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {counts.lessons}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Link 
                                href={`/courses?appId=${appId}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View Courses →
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
