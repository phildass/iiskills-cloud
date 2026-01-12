import { useState, useEffect } from 'react'
import Head from 'next/head'
import UserProtectedRoute from '../components/UserProtectedRoute'
import { getCurrentUser } from '../lib/supabaseClient'

/**
 * Dashboard Page - Example of a Protected Page
 * 
 * This page demonstrates how to use UserProtectedRoute to protect content
 * that should only be accessible to authenticated users.
 * 
 * Key features:
 * - Wrapped in UserProtectedRoute component
 * - Automatically redirects non-authenticated users to login
 * - Displays user information from Supabase session
 * - Shows personalized content
 */
export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  /**
   * Load current user data from Supabase
   * This runs after UserProtectedRoute confirms user is authenticated
   */
  const loadUserData = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }

  return (
    // Wrap entire page in UserProtectedRoute
    // Only authenticated users will see this content
    <UserProtectedRoute>
      <Head>
        <title>Dashboard - iiskills.cloud</title>
        <meta name="description" content="Your personal dashboard" />
      </Head>
      
      <div className="min-h-screen bg-neutral py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-primary mb-6">
            My Dashboard
          </h1>
          
          {isLoading ? (
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {/* Welcome Section */}
              <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold text-charcoal mb-4">
                  Welcome back! 👋
                </h2>
                <div className="space-y-2 text-charcoal">
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>User ID:</strong> {user?.id}</p>
                  <p className="text-sm text-gray-600 mt-4">
                    Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Info Section */}
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-2">
                  🔒 This is a Protected Page
                </h3>
                <p className="text-blue-800">
                  This page uses the <code className="bg-blue-100 px-2 py-1 rounded">UserProtectedRoute</code> component
                  to ensure only authenticated users can access it. If you weren't logged in, you would have been
                  automatically redirected to the login page.
                </p>
              </div>

              {/* Quick Links */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-charcoal mb-4">
                  Quick Links
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <a
                    href="/courses"
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-primary mb-2">📚 My Courses</h3>
                    <p className="text-sm text-gray-600">View and manage your enrolled courses</p>
                  </a>
                  <a
                    href="/certification"
                    className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <h3 className="font-bold text-primary mb-2">✅ Get Certified</h3>
                    <p className="text-sm text-gray-600">Browse available certifications</p>
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
    </UserProtectedRoute>
  )
}
