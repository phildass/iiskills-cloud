import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Pre-fill email if coming from registration
  useEffect(() => {
    const prefilledEmail = sessionStorage.getItem('prefilledEmail')
    if (prefilledEmail) {
      setEmail(prefilledEmail)
      setSuccess('Registration successful! Please sign in with your credentials.')
      sessionStorage.removeItem('prefilledEmail')
      
      // Focus on password field
      setTimeout(() => {
        document.getElementById('password')?.focus()
      }, 100)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Get users from localStorage
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.email === email && u.password === password)
      
      if (user) {
        // Store user session
        sessionStorage.setItem('currentUser', JSON.stringify({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        }))
        
        // Redirect to homepage or dashboard
        router.push('/')
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (error) {
      setError('An error occurred during login. Please try again.')
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
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Sign In
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
