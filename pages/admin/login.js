import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (password === 'phil123') {
      // Set admin session
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminLoginTime', new Date().getTime())
      router.push('/admin')
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login - iiskills.cloud</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Admin Login</h1>
          <p className="text-center text-charcoal mb-6">iiskills.cloud Administration</p>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
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
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
          
          <p className="text-center text-sm text-charcoal mt-6">
            <a href="/" className="text-primary hover:underline">← Back to Homepage</a>
          </p>
        </div>
      </div>
    </>
  )
}
