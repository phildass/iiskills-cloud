/**
 * Admin Sign-In Page
 * 
 * Secure role-based authentication for admin access.
 * Uses Supabase backend to validate admin privileges.
 * 
 * Security:
 * - No hardcoded passwords
 * - Backend role validation
 * - Requires valid Supabase account with admin role
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { useAdmin } from '../../contexts/AdminContext'
import { getCurrentUser, isAdmin } from '../../lib/supabaseClient'

export default function AdminSignIn() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { isAuthenticated, signIn } = useAdmin()

  // Check authentication and redirect accordingly
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        // Not logged in - redirect to login page
        setError('Please log in to access the admin panel.')
        setIsLoading(false)
        // Redirect to login after a brief delay
        setTimeout(() => {
          router.push('/login?redirect=/admin')
        }, 2000)
        return
      }

      // Check if user has admin role
      if (isAdmin(user)) {
        // User is authenticated and has admin role
        await signIn()
        router.push('/admin/dashboard')
      } else {
        // User is logged in but doesn't have admin privileges
        setError('Access denied. You do not have admin privileges.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  // Redirect to dashboard if already authenticated as admin
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  return (
    <>
      <Head>
        <title>Admin Access - Learn-Apt</title>
        <meta name="description" content="Admin access for Learn-Apt" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">🔐 Admin Access</h1>
            <p className="text-gray-600">Learn-Apt - Admin Panel</p>
          </div>

          {/* Status Card */}
          <div className="bg-white p-8 rounded-2xl shadow-2xl">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔄</div>
                <p className="text-lg text-charcoal">Checking credentials...</p>
              </div>
            ) : error ? (
              <>
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                  <p className="text-red-700">{error}</p>
                </div>
                
                <div className="space-y-4">
                  <button
                    onClick={() => router.push('/login?redirect=/admin')}
                    className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    Go to Login
                  </button>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-200 text-charcoal py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                  >
                    Back to Home
                  </button>
                </div>
              </>
            ) : null}

            {/* Security Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Secure Access:</strong> Admin access requires a valid account with admin privileges. 
                All authentication is validated against the backend database.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
