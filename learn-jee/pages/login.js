import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { signInWithEmail, getCurrentUser, supabase, getSiteUrl } from '../lib/supabaseClient'



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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false)
  const [showMagicLink, setShowMagicLink] = useState(false)
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

  /**
   * Handle Google OAuth sign-in
   */
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError('')
    setSuccess('')

    try {
      const siteUrl = getSiteUrl()
      
      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${siteUrl}/learn`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (signInError) {
        console.error('Google sign-in error:', signInError)
        setError(`Failed to sign in with Google: ${signInError.message}`)
        setIsGoogleLoading(false)
      }
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err)
      setError('An unexpected error occurred with Google sign-in.')
      setIsGoogleLoading(false)
    }
  }

  /**
   * Handle Magic Link sign-in
   */
  const handleMagicLinkSignIn = async () => {
    if (!email.trim()) {
      setError('Please enter your email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsMagicLinkLoading(true)
    setError('')
    setSuccess('')

    try {
      const siteUrl = getSiteUrl()
      
      const { error: magicLinkError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/learn`,
        }
      })

      if (magicLinkError) {
        setError(magicLinkError.message)
        setIsMagicLinkLoading(false)
        return
      }

      setSuccess('Check your email for the magic link to sign in!')
      setIsMagicLinkLoading(false)
    } catch (err) {
      console.error('Magic link error:', err)
      setError('An unexpected error occurred. Please try again.')
      setIsMagicLinkLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Log In - Learn JEE</title>
        <meta name="description" content="Log in to Learn JEE" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Log In</h1>
          <p className="text-center text-charcoal mb-6">Welcome back to Learn JEE</p>
          
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
          
          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-3 px-6 rounded-lg shadow transition duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
          </button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          
          {/* Toggle between password and magic link */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setShowMagicLink(false)}
              className={`flex-1 py-2 px-4 rounded ${!showMagicLink ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setShowMagicLink(true)}
              className={`flex-1 py-2 px-4 rounded ${showMagicLink ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Magic Link
            </button>
          </div>
          
          {!showMagicLink ? (
            // Password Login Form
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
          ) : (
            // Magic Link Form
            <div>
              <div className="mb-4">
                <label className="block text-charcoal font-semibold mb-2" htmlFor="magic-email">
                  Email Address
                </label>
                <input
                  type="email"
                  id="magic-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter your email"
                />
              </div>
              
              <button
                type="button"
                onClick={handleMagicLinkSignIn}
                disabled={isMagicLinkLoading}
                className="w-full bg-accent text-white py-3 rounded font-bold hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMagicLinkLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
              </button>
              
              <p className="text-sm text-gray-600 mt-2 text-center">
                We'll email you a magic link for a password-free sign in
              </p>
            </div>
          )}
          
          <p className="text-center text-sm text-charcoal mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Register here
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
