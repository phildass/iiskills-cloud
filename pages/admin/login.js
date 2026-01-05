
import { useState, useEffect } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { getCurrentUser, sendMagicLink, signInWithGoogle, signInWithEmail, isAdmin } from '../../lib/supabaseClient'

/**
 * Admin Login Redirect Page
 * 
 * This page redirects to the main login page with admin access request.
 * Admin access is granted based on Supabase user role, not a separate login.
 * 
 * Security:
 * - No separate admin credentials
 * - Uses main Supabase authentication
 * - Role-based access control via user metadata
 */
export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(true) // Default to magic link
  const router = useRouter()

  // Check if user is already authenticated as admin
  useEffect(() => {
    checkExistingAuth()
  }, [])

  const checkExistingAuth = async () => {
    const user = await getCurrentUser()
    if (user && isAdmin(user)) {
      // User is already authenticated as admin, redirect to dashboard
      router.push('/admin')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
      if (useMagicLink) {
        // Send magic link to user's email
        const { success: magicLinkSuccess, error: magicLinkError } = await sendMagicLink(email)
        
        if (magicLinkError) {
          setError(magicLinkError)
          setIsLoading(false)
          return
        }
        
        if (magicLinkSuccess) {
          setSuccess('Check your email for a secure admin sign-in link! The link will sign you in automatically.')
          setIsLoading(false)
          return
        }
      } else {
        // Use password authentication
        const { user, error: signInError } = await signInWithEmail(email, password)
        
        if (signInError) {
          if (signInError.includes('Invalid login credentials')) {
            setError('Invalid email or password. Please try again.')
          } else if (signInError.includes('Email not confirmed')) {
            setError('Please confirm your email address before signing in.')
          } else {
            setError(signInError)
          }
          setIsLoading(false)
          return
        }
        
        if (user) {
          // Check if user has admin role
          if (isAdmin(user)) {
            setSuccess('Login successful! Redirecting to admin dashboard...')
            
            setTimeout(() => {
              router.push('/admin')
            }, 1000)
          } else {
            setError('Access denied. You do not have admin privileges.')
            setIsLoading(false)
          }
        }
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
      const { success: googleSuccess, error: googleError } = await signInWithGoogle()
      
      if (googleError) {
        setError(googleError)
        setIsLoading(false)
        return
      }
      
      // OAuth will redirect automatically, no need to handle success here
      // Role check will happen after redirect
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError('An unexpected error occurred with Google sign-in. Please try again.')
      setIsLoading(false)
    }
  }
  const router = useRouter()

  useEffect(() => {
    // Redirect to main login with admin redirect parameter
    router.push('/login?redirect=/admin')
  }, [router])

  return (
    <>
      <Head>

        <title>Admin Login - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Admin Login</h1>
          <p className="text-center text-charcoal mb-6">iiskills.cloud Administration</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded font-bold hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isLoading ? 'Signing In...' : 'Continue with Google'}
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-charcoal font-semibold mb-2" htmlFor="email">
                Admin Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your admin email"
                required
              />
            </div>

            {!useMagicLink && (
              <div className="mb-4">
                <label className="block text-charcoal font-semibold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your password"
                  required={!useMagicLink}
                />
              </div>
            )}

            {useMagicLink && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  ✉️ <strong>Magic Link:</strong> Enter your admin email and we'll send you a secure sign-in link. No password needed!
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? 'Processing...' : (useMagicLink ? 'Send Me a Sign-In Link' : 'Sign In with Password')}
            </button>

            <button
              type="button"
              onClick={() => setUseMagicLink(!useMagicLink)}
              className="w-full text-primary text-sm hover:underline"
            >
              {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              <strong>🔒 Secure Admin Access:</strong> Only users with admin privileges can access the admin dashboard. 
              Your role is verified on the backend.
            </p>
          </div>
          
          <p className="text-center text-sm text-charcoal mt-6">
            <a href="/" className="text-primary hover:underline">← Back to Homepage</a>
        <title>Admin Access - iiskills.cloud</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-primary mb-6">Admin Access</h1>
          <p className="text-charcoal mb-4">Redirecting to login...</p>
          <p className="text-sm text-gray-600">
            Admin access requires a valid user account with admin role.
          </p>
        </div>
      </div>
    </>
  )
}
