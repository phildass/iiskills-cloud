import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    
    // TODO: Implement actual registration
    // For now, this is a placeholder
    setError('Registration not yet implemented. Please check back soon.')
  }

  return (
    <>
      <Head>
        <title>Register - iiskills.cloud</title>
        <meta name="description" content="Create your iiskills.cloud account" />
      </Head>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-neutral py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-primary mb-6 text-center">Register</h1>
          <p className="text-center text-charcoal mb-6">Create your iiskills.cloud account</p>
          
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
              <label className="block text-charcoal font-semibold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-charcoal font-semibold mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-charcoal font-semibold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Create a password"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-charcoal font-semibold mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm your password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-blue-700 transition"
            >
              Create Account
            </button>
          </form>
          
          <p className="text-center text-sm text-charcoal mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Sign in here
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
