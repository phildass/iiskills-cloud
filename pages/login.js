import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
// Import Supabase client and authentication helper
import { signInWithEmail } from '../lib/supabaseClient'

/**
 * Login Page Component
 * 
 * This page provides email/password authentication using Supabase Auth.
 * Features:
 * - Email and password sign-in via Supabase
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
   * 3. Calls Supabase signInWithPassword API
   * 4. Handles success by redirecting to homepage
   * 5. Handles errors by displaying user-friendly messages
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
      // Call Supabase authentication with email and password
      // This will create a session that persists in localStorage automatically
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
        
        // Check if there's a redirect URL from protected route
        const redirectUrl = router.query.redirect || '/'
        
        // Redirect after a brief delay to show success message
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1000)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign In - iiskills.cloud</title>
        <meta name="description" content="Sign in to your iiskills.cloud account" />
      </Head>
      <Navbar />
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
            
            <div className="mb-6">
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
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
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
      <Footer />
    </>
  )
}
