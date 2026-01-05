import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Import Supabase helpers for authentication state and logout
import { getCurrentUser, signOutUser, isAdmin as checkIsAdmin } from '../lib/supabaseClient'
import { getAdminUrl } from '../utils/urlHelper'
import SharedNavbar from './shared/SharedNavbar'
import { getCurrentUser, signOutUser } from '../lib/supabaseClient'

/**
 * Navigation Bar Component for Main Domain
 * 
 * This component wraps the SharedNavbar with main domain-specific configuration.
 * It manages authentication state and provides the main domain navigation links.
 * 
 * Features:
 * - Uses shared navbar component for consistent branding across all iiskills apps
 * - Manages user authentication state
 * - Provides logout functionality
 * - NO admin links in navigation (admin access via direct URL only)
 */
export default function Navbar() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  // Check authentication status when component mounts
  useEffect(() => {
    checkUser()
  }, [])

  /**
   * Check if a user is currently logged in and their admin status
   * This runs on component mount to determine what to show in the navbar
   * Check if a user is currently logged in
   */
  const checkUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    
    // Check if user has admin role via Supabase metadata
    if (currentUser) {
      setIsAdmin(checkIsAdmin(currentUser))
    }
    
    setIsLoading(false)
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
    <SharedNavbar 
      user={user}
      onLogout={handleLogout}
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={true}
      customLinks={[
        { href: '/', label: 'Home', className: 'hover:text-primary transition' },
        { href: '/courses', label: 'Courses', className: 'hover:text-primary transition' },
        { href: '/certification', label: 'Certification', className: 'hover:text-primary transition' },
        { href: 'https://www.aienter.in/payments', label: 'Payments', className: 'bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', mobileClassName: 'block bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold', target: '_blank', rel: 'noopener noreferrer' },
        { href: '/about', label: 'About', className: 'hover:text-primary transition' },
        { href: '/terms', label: 'Terms & Conditions', className: 'hover:text-primary transition' }
      ]}
    />
  )
}
