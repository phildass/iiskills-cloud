import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import AdminNav from "../../components/AdminNav";
import Footer from "../../components/Footer";
import { ALL_SITES } from "../../lib/siteConfig";
import { getSiteUrl } from "../../lib/navigation";
import { useAdminProtectedPage, AccessDenied } from "../../components/AdminProtectedPage";

export default function AdminDashboard() {
  const { ready, denied } = useAdminProtectedPage();
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
  });
  const [siteCounts, setSiteCounts] = useState({});

  useEffect(() => {
    if (ready) {
      fetchStats();
      fetchSiteCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const fetchStats = async () => {
    try {
      // Fetch aggregated content from all sources
      const [coursesRes, modulesRes, lessonsRes] = await Promise.all([
        fetch('/api/admin/content?type=courses').catch(() => ({ ok: false })),
        fetch('/api/admin/content?type=modules').catch(() => ({ ok: false })),
        fetch('/api/admin/content?type=lessons').catch(() => ({ ok: false })),
      ]);

      let courseCount = 0;
      let moduleCount = 0;
      let lessonCount = 0;

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        courseCount = data.contents?.length || 0;
      }

      if (modulesRes.ok) {
        const data = await modulesRes.json();
        moduleCount = data.contents?.length || 0;
      }

      if (lessonsRes.ok) {
        const data = await lessonsRes.json();
        lessonCount = data.contents?.length || 0;
      }

      setStats({
        totalCourses: courseCount,
        totalUsers: 0, // Users count not fetched here (requires service role endpoint)
        totalModules: moduleCount,
        totalLessons: lessonCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSiteCounts = async () => {
    try {
      // Fetch aggregated courses to get counts per site
      const response = await fetch('/api/admin/content?type=courses');
      const data = await response.json();
      
      if (response.ok && data.contents) {
        const counts = {};
        data.contents.forEach(course => {
          const subdomain = course.sourceApp || course.subdomain || 'main';
          counts[subdomain] = (counts[subdomain] || 0) + 1;
        });
        setSiteCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching site counts:', error);
    }
  };

  if (denied) return <AccessDenied />;

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Universal Admin Dashboard - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminNav />
      <main className="max-w-7xl mx-auto px-4 py-12">
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
          <p className="text-gray-600 mb-6">
            Manage content across all iiskills learning platforms. Click on a site to visit it, or use the buttons to manage content.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ALL_SITES.map((site) => {
              const courseCount = siteCounts[site.subdomain] || 0;
              const isOnline = true; // Could be implemented with a health check
              
              return (
                <div
                  key={site.subdomain}
                  className="border-2 border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-lg transition bg-white"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-gray-800">{site.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-4">{site.subdomain}</p>
                  
                  <div className="mb-4 space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="mr-2">📚</span>
                      <span>{courseCount} {courseCount === 1 ? 'Course' : 'Courses'}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <a
                      href={getSiteUrl(site.slug)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Visit Site
                    </a>
                    <Link
                      href={`/admin/courses?site=${site.subdomain}`}
                      className="flex-1 bg-gray-600 text-white text-center px-3 py-2 rounded text-sm font-semibold hover:bg-gray-700 transition"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Localhost Development Navigation */}
        <h2 className="text-2xl font-bold text-primary mb-6">🔧 Localhost Development Navigation</h2>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg shadow-lg p-6 mb-12">
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Local Development:</strong> Quick navigation to all apps running on localhost.
                  Make sure the apps are running on their assigned ports before clicking.
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Main Site */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Main Domain</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">:3000</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Primary Hub</p>
              <div className="text-2xl">🏠</div>
            </a>

            {/* Learn AI */}
            <a
              href="http://localhost:3024"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-purple-300 rounded-lg p-4 hover:border-purple-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn AI</h4>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-mono">:3024</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">AI & Machine Learning</p>
              <div className="text-2xl">🤖</div>
            </a>

            {/* Learn Management */}
            <a
              href="http://localhost:3016"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-green-300 rounded-lg p-4 hover:border-green-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Management</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-mono">:3016</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Business Management</p>
              <div className="text-2xl">📊</div>
            </a>

            {/* Learn PR */}
            <a
              href="http://localhost:3021"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-pink-300 rounded-lg p-4 hover:border-pink-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn PR</h4>
                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded font-mono">:3021</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Public Relations</p>
              <div className="text-2xl">📢</div>
            </a>

            {/* Learn Math */}
            <a
              href="http://localhost:3017"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-red-300 rounded-lg p-4 hover:border-red-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Math</h4>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-mono">:3017</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Mathematics</p>
              <div className="text-2xl">🔢</div>
            </a>

            {/* Learn Physics */}
            <a
              href="http://localhost:3020"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-blue-300 rounded-lg p-4 hover:border-blue-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Physics</h4>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-mono">:3020</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Physics Mastery</p>
              <div className="text-2xl">⚛️</div>
            </a>

            {/* Learn Chemistry */}
            <a
              href="http://localhost:3005"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-purple-300 rounded-lg p-4 hover:border-purple-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Chemistry</h4>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded font-mono">:3005</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Chemistry</p>
              <div className="text-2xl">🧪</div>
            </a>

            {/* Learn Geography */}
            <a
              href="http://localhost:3011"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-green-300 rounded-lg p-4 hover:border-green-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Geography</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-mono">:3011</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">World Geography</p>
              <div className="text-2xl">🌍</div>
            </a>

            {/* Learn Govt Jobs */}
            <a
              href="http://localhost:3013"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-yellow-300 rounded-lg p-4 hover:border-yellow-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Govt Jobs</h4>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-mono">:3013</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Government Exams</p>
              <div className="text-2xl">🏛️</div>
            </a>

            {/* Learn APT */}
            <a
              href="http://localhost:3002"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-indigo-300 rounded-lg p-4 hover:border-indigo-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn APT</h4>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded font-mono">:3002</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Aptitude Tests</p>
              <div className="text-2xl">🎯</div>
            </a>

            {/* Learn Developer */}
            <a
              href="http://localhost:3007"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-orange-300 rounded-lg p-4 hover:border-orange-500 hover:shadow-xl transition transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Learn Developer</h4>
                <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono">:3007</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Web Development</p>
              <div className="text-2xl">💻</div>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <h2 className="text-2xl font-bold text-primary mb-6">Quick Links</h2>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a
              href="https://app.iiskills.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
            >
              <span className="text-2xl mr-3">🏠</span>
              <span className="font-semibold text-gray-800">View Main Site</span>
            </a>
            <Link
              href="/admin/courses"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
            >
              <span className="text-2xl mr-3">📚</span>
              <span className="font-semibold text-gray-800">Browse All Courses</span>
            </Link>
            <Link
              href="/admin/users"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
            >
              <span className="text-2xl mr-3">👥</span>
              <span className="font-semibold text-gray-800">Manage Users</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <span className="font-semibold text-gray-800">Site Settings</span>
            </Link>
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
