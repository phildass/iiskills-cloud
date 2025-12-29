/**
 * Admin Sign-In Page
 * 
 * Simple password-based authentication for admin access.
 * Default password: phil123
 * Password can be changed from the admin dashboard.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { verifyAdminPassword, createAdminSession } from '../../lib/adminAuth'
import { useAdmin } from '../../contexts/AdminContext'

export default function AdminSignIn() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { isAuthenticated, signIn } = useAdmin()

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Verify password
    if (verifyAdminPassword(password)) {
      // Create session
      createAdminSession()
      signIn()
      
      // Redirect to dashboard
      router.push('/admin/dashboard')
    } else {
      setError('Invalid password. Please try again.')
      setPassword('')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Admin Sign In - Learn Your Aptitude</title>
        <meta name="description" content="Admin sign in for Learn Your Aptitude" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">🔐 Admin Access</h1>
            <p className="text-gray-600">Learn Your Aptitude - Admin Panel</p>
          </div>

          {/* Sign-In Form */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-charcoal mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                  placeholder="Enter admin password"
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Default Password:</strong> phil123<br />
                <span className="text-xs text-blue-600">You can change this password after signing in.</span>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/')}
              className="text-primary hover:text-accent transition font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
