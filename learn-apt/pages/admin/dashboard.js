/**
 * Admin Dashboard
 * 
 * Main admin page with overview and links to all admin features.
 * Protected route - requires admin authentication.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminNavbar from '../../components/AdminNavbar'
import { useAdmin } from '../../contexts/AdminContext'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard - Learn Your Aptitude</title>
        <meta name="description" content="Admin dashboard for Learn Your Aptitude" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminNavbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to Admin Dashboard 👋
            </h1>
            <p className="text-xl text-charcoal">
              Manage your Learn Your Aptitude application from this central panel.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-primary">-</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Coming soon with database</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Learning Modules</p>
                  <p className="text-3xl font-bold text-accent">6</p>
                </div>
                <div className="text-4xl">📚</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Currently available</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Sessions</p>
                  <p className="text-3xl font-bold text-green-600">-</p>
                </div>
                <div className="text-4xl">🔄</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Coming soon with analytics</p>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-primary mb-6">Admin Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/admin/change-password')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">🔑</div>
                <h3 className="font-bold text-lg mb-2 text-primary">Change Password</h3>
                <p className="text-gray-600 text-sm">Update your admin password</p>
              </button>

              <button
                onClick={() => router.push('/')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="font-bold text-lg mb-2 text-primary">View Site</h3>
                <p className="text-gray-600 text-sm">Go to the public site</p>
              </button>

              <button
                onClick={() => router.push('/learn')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">📖</div>
                <h3 className="font-bold text-lg mb-2 text-primary">Learning Page</h3>
                <p className="text-gray-600 text-sm">View learning modules</p>
              </button>

              <button
                onClick={() => router.push('/login')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">🔐</div>
                <h3 className="font-bold text-lg mb-2 text-primary">User Login</h3>
                <p className="text-gray-600 text-sm">User authentication page</p>
              </button>

              <button
                onClick={() => router.push('/register')}
                className="p-6 border-2 border-gray-200 rounded-lg hover:border-primary hover:shadow-lg transition-all text-left"
              >
                <div className="text-3xl mb-2">✍️</div>
                <h3 className="font-bold text-lg mb-2 text-primary">User Registration</h3>
                <p className="text-gray-600 text-sm">New user sign up page</p>
              </button>

              <div className="p-6 border-2 border-gray-200 rounded-lg bg-gray-50 text-left opacity-60">
                <div className="text-3xl mb-2">🔧</div>
                <h3 className="font-bold text-lg mb-2 text-gray-500">More Features</h3>
                <p className="text-gray-500 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-6">System Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Application Name</span>
                <span className="font-semibold text-charcoal">Learn Your Aptitude</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Version</span>
                <span className="font-semibold text-charcoal">1.0.0</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Environment</span>
                <span className="font-semibold text-charcoal">{process.env.NODE_ENV || 'development'}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600">Framework</span>
                <span className="font-semibold text-charcoal">Next.js</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Authentication Method</span>
                <span className="font-semibold text-charcoal">Password-based (localStorage)</span>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Note</h3>
            <p className="text-blue-800">
              This admin panel uses simple password-based authentication stored in localStorage. 
              For production use, consider implementing backend authentication with a database 
              (e.g., Supabase integration as planned).
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
