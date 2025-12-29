/**
 * Change Admin Password Page
 * 
 * Allows admin to change the password used for admin authentication.
 * Protected route - requires admin authentication.
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import AdminNavbar from '../../components/AdminNavbar'
import { useAdmin } from '../../contexts/AdminContext'
import { verifyAdminPassword, setAdminPassword } from '../../lib/adminAuth'

export default function ChangePassword() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAdmin()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, router])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)

    // Validate current password
    if (!verifyAdminPassword(currentPassword)) {
      setError('Current password is incorrect')
      setIsSubmitting(false)
      return
    }

    // Validate new password
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long')
      setIsSubmitting(false)
      return
    }

    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match')
      setIsSubmitting(false)
      return
    }

    // Don't allow same password
    if (currentPassword === newPassword) {
      setError('New password must be different from current password')
      setIsSubmitting(false)
      return
    }

    // Update password
    setAdminPassword(newPassword)
    setSuccess('Password updated successfully!')
    
    // Clear form
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setIsSubmitting(false)

    // Show success message for 3 seconds then redirect to dashboard
    setTimeout(() => {
      router.push('/admin/dashboard')
    }, 2000)
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
        <title>Change Password - Admin - Learn Your Aptitude</title>
        <meta name="description" content="Change admin password" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <AdminNavbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              🔑 Change Password
            </h1>
            <p className="text-xl text-charcoal">
              Update your admin password to keep your account secure.
            </p>
          </div>

          {/* Change Password Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-semibold text-charcoal mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-semibold text-charcoal mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                  placeholder="Enter new password (min. 6 characters)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-charcoal mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition"
                  placeholder="Re-enter new password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-700">{success}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin/dashboard')}
                  className="flex-1 bg-gray-200 text-charcoal py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Security Tips */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">🔒 Security Tips</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use a strong password with a mix of letters, numbers, and symbols</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Don't use easily guessable passwords like "password" or "123456"</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Change your password regularly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Don't share your admin password with anyone</span>
              </li>
            </ul>
          </div>

          {/* Info Notice */}
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
            <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important</h3>
            <p className="text-yellow-800">
              Your password is stored in your browser's localStorage. If you clear your browser data 
              or use a different browser, you'll need to use the default password again.
            </p>
          </div>
        </div>
      </main>
    </>
  )
}
