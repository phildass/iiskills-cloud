import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
// Import Supabase helpers for authentication state and logout
import { getCurrentUser, signOutUser } from '../lib/supabaseClient'
import { getAdminUrl } from '../utils/urlHelper'

/**
 * Navigation Bar Component
 * 
 * This component:
 * - Displays the main navigation menu
 * - Shows different options based on authentication state
 * - Provides logout functionality
 * - Responsive design with mobile menu
 */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // Track current user authentication state
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check authentication status when component mounts
  useEffect(() => {
    checkUser()
  }, [])

  /**
   * Check if a user is currently logged in
   * This runs on component mount to determine what to show in the navbar
   */
  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }

  /**
   * Check if user is an admin
   * 
   * NOTE: This is a basic client-side check using localStorage.
   * For production use, this should be replaced with proper server-side
   * authentication verification (e.g., checking user role in database).
   * The current implementation is retained for backward compatibility
   * with the existing admin authentication system.
   */
  const isAdmin = () => {
    // Check localStorage for admin auth (existing admin system)
    const adminAuth = typeof window !== 'undefined' ? localStorage.getItem('adminAuth') : null
    return adminAuth === 'true'
  }

  /**
   * Handle user logout
   * Signs out the user from Supabase and redirects to login page
   */
  const handleLogout = async () => {
    const { success } = await signOutUser()
    if (success) {
      setUser(null)
      router.push('/login')
    }
  }

  return (
    <nav className="bg-white text-gray-800 px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center hover:opacity-90 transition gap-2">
          {/* AI Cloud Enterprises Logo */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image 
              src="/images/ai-cloud-logo.png" 
              alt="AI Cloud Enterprises Logo" 
              fill
              className="object-contain"
            />
          </div>
          {/* iiskills Logo */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image 
              src="/images/iiskills-logo.png" 
              alt="IISKILLS Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl text-gray-800">iiskills.cloud</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          <Link href="/certification" className="hover:text-primary transition">Certification</Link>
          <Link href="https://www.aienter.in/payments" target="_blank" rel="noopener noreferrer" className="bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold">
            Payments
          </Link>
          <Link href="/about" className="hover:text-primary transition">About</Link>
          
          {/* Show Admin link if user is admin */}
          {isAdmin() && (
            <a
              href={getAdminUrl()}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition font-bold"
              title="Admin Dashboard"
            >
              Admin
            </a>
          )}
          
          {/* Show Sign In/Register or User Info based on authentication */}
          {!isLoading && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <span className="text-sm text-gray-600">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/login" className="hover:text-primary transition">Sign In</Link>
                  <Link href="/register" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold">
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          <Link href="/" className="block hover:text-primary transition">Home</Link>
          <Link href="/courses" className="block hover:text-primary transition">Courses</Link>
          <Link href="/certification" className="block hover:text-primary transition">Certification</Link>
          <Link href="https://www.aienter.in/payments" target="_blank" rel="noopener noreferrer" className="block bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold">
            Payments
          </Link>
          <Link href="/about" className="block hover:text-primary transition">About</Link>
          
          {/* Show Admin link if user is admin */}
          {isAdmin() && (
            <a
              href={getAdminUrl()}
              className="block bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition font-bold"
            >
              Admin Dashboard
            </a>
          )}
          
          {/* Show Sign In/Register or User Info based on authentication */}
          {!isLoading && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <div className="text-sm text-gray-600 px-4 py-2">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/login" className="block hover:text-primary transition">Sign In</Link>
                  <Link href="/register" className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold">
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  )
}
