import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getCurrentUser } from '../lib/supabaseClient'

/**
 * Protected Route Component for Admin Pages
 * 
 * This component ensures only authenticated users with admin role can access admin pages.
 * Uses Supabase backend authentication instead of localStorage.
 * 
 * Security:
 * - Backend validation via Supabase
 * - Role-based access control
 * - Automatic redirect to login if not authenticated
 */
export default function ProtectedRoute({ children, requireAdmin = true }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [router])

  const checkAuth = async () => {
    try {
      const user = await getCurrentUser()
      
      if (!user) {
        // Not logged in - redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
        setIsLoading(false)
        return
      }

      if (requireAdmin) {
        // Check if user has admin role in metadata
        const isAdmin = user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
        
        if (!isAdmin) {
          // User is logged in but not an admin
          router.push('/?error=access_denied')
          setIsLoading(false)
          return
        }
      }

      // User is authenticated (and admin if required)
      setIsAuthenticated(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Error checking auth:', error)
      router.push('/login')
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Verifying credentials...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
