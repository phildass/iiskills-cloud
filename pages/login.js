import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
// Import Supabase client and authentication helper
import { signInWithEmail, sendMagicLink, signInWithGoogle, isAdmin } from '../lib/supabaseClient'

/**
 * Login Page Component
 * 
 * This page provides multiple authentication options using Supabase Auth:
 * - Magic link (passwordless email sign-in) - Primary option
 * - Google OAuth - Social login option
 * - Email and password - Fallback option
 * 
 * Features:
 * - Loading state during authentication
 * - Error handling with user-friendly messages
 * - Success message after registration
 * - Automatic redirect to homepage after successful login
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  // Track loading state during Supabase authentication
  const [isLoading, setIsLoading] = useState(false)
  const [useMagicLink, setUseMagicLink] = useState(true) // Default to magic link
  const router = useRouter()

  // Show success message if coming from registration, but don't pre-fill email for security
  useEffect(() => {
    const registrationSuccess = sessionStorage.getItem('registrationSuccess')
    if (registrationSuccess) {
      setSuccess('Registration successful! Please sign in with your credentials.')
      sessionStorage.removeItem('registrationSuccess')
    }
  }, [])

  /**
   * Handle login form submission
   * 
   * This function:
   * 1. Prevents default form submission
   * 2. Clears previous errors/success messages
   * 3. Either sends magic link or calls Supabase signInWithPassword API
   * 4. Handles success by redirecting or showing confirmation
   * 5. Handles errors by displaying user-friendly messages
   */
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
          setSuccess('Check your email for a secure sign-in link! The link will sign you in automatically.')
          setIsLoading(false)
          return
        }
      } else {
        // Use password authentication
        const { user, error: signInError } = await signInWithEmail(email, password)
        
        if (signInError) {
          // Handle authentication errors with user-friendly messages
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
          // Authentication successful!
          // Supabase automatically stores the session, so we just need to redirect
          setSuccess('Login successful! Redirecting...')
          
          // Check if user is admin and redirect to admin dashboard
          // Otherwise use redirect URL from protected route or default to homepage
          const redirectUrl = router.query.redirect || (isAdmin(user) ? '/admin' : '/')
          
          // Redirect after a brief delay to show success message
          setTimeout(() => {
            router.push(redirectUrl)
          }, 1000)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
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
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError('An unexpected error occurred with Google sign-in. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - iiskills.cloud</title>
        <meta name="description" content="Sign in to your iiskills.cloud account" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Sign In</h1>
          <p className="text-center text-charcoal mb-6">Welcome back to iiskills.cloud</p>
          
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
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
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
                  ✉️ <strong>Magic Link:</strong> Enter your email and we'll send you a secure sign-in link. No password needed!
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
          
          <p className="text-center text-sm text-charcoal mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register here
            </Link>
          </p>
          
          <p className="text-center text-sm text-charcoal mt-4">
            <Link href="/" className="text-primary hover:underline">← Back to Homepage</Link>
          </p>
        </div>
      </div>
    </>
  )
}
