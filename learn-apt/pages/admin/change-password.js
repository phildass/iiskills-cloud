/**
 * Admin Account Settings Page
 * 
 * Information page for managing admin account settings.
 * Protected route - requires admin authentication.
 * 
 * Security:
 * - Password changes are handled through Supabase authentication
 * - No client-side password storage or management
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminNavbar from '../../components/AdminNavbar'
import { useAdmin } from '../../contexts/AdminContext'
import { getAdminUser } from '../../lib/adminAuth'

export default function ChangePassword() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()
  const [adminUser, setAdminUser] = useState(null)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    } else if (isAuthenticated) {
      loadAdminUser()
    }
  }, [isAuthenticated, isLoading, router])

  const loadAdminUser = async () => {
    const user = await getAdminUser()
    setAdminUser(user)
  }

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
        <title>Account Settings - Learn-Apt Admin</title>
        <meta name="description" content="Admin account settings" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminNavbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
            
            {/* Account Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-charcoal mb-4">Your Admin Account</h2>
              <div className="bg-blue-50 border-l-4 border-primary p-4 rounded">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> {adminUser?.email || 'Loading...'}
                </p>
                <p className="text-gray-700">
                  <strong>Role:</strong> Administrator
                </p>
              </div>
            </div>

            {/* Password Management */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-charcoal mb-4">Password Management</h2>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                <p className="text-gray-700 mb-3">
                  Your password is securely managed through Supabase authentication. 
                  To change your password, use the Supabase password reset feature.
                </p>
                <p className="text-sm text-gray-600">
                  We'll send a password reset link to your email address: <strong>{adminUser?.email}</strong>
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-gray-700 font-semibold">How to change your password:</p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Click the "Request Password Reset" button below</li>
                  <li>Check your email for a password reset link</li>
                  <li>Click the link and enter your new password</li>
                  <li>Log in again with your new password</li>
                </ol>
              </div>

              <button
                onClick={() => router.push('/login')}
                className="mt-6 w-full bg-gradient-to-r from-primary to-accent text-white py-3 px-6 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Go to Login Page for Password Reset
              </button>
            </div>

            {/* Security Information */}
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-bold text-yellow-900 mb-2">🔒 Security Best Practices</h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Use a strong, unique password with at least 8 characters</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Never share your admin credentials</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Change your password regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Log out when you're done with admin tasks</span>
                </li>
              </ul>
            </div>

            {/* Back to Dashboard */}
            <div className="mt-8 text-center">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-primary hover:text-accent transition font-semibold"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
