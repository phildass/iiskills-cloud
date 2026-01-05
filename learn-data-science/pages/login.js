import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { signInWithEmail, getCurrentUser } from '../lib/supabaseClient'

/**
 * Login Page for Learn-Apt
 * 
 * Provides email/password authentication using shared Supabase Auth.
 * Session is shared across all *.iiskills.cloud subdomains.
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    checkExistingSession()
  }, [])

  const checkExistingSession = async () => {
    const user = await getCurrentUser()
    if (user) {
      // Already logged in, redirect to learn page
      router.push('/learn')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    try {
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
        setSuccess('Login successful! Redirecting...')
        
        // Redirect to learn page or specified redirect URL
        const redirectUrl = router.query.redirect || '/learn'
        
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
        <title>Log In - Learn Data Science</title>
        <meta name="description" content="Log in to Learn Data Science" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Log In</h1>
          <p className="text-center text-charcoal mb-6">Welcome back to Learn Data Science</p>
          
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
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          
          <p className="text-center text-sm text-charcoal mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Sign in here
            </Link>
          </p>
          
          <p className="text-center text-sm text-charcoal mt-4">
            <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> You can use the same account across all iiskills.cloud services.
              If you have an account on the main site, you can log in here with the same credentials.
            </p>
          </div>
        </div>
      </div>
      
    </>
  )
}
