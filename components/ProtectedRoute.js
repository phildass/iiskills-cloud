import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem('adminAuth')
      const loginTime = localStorage.getItem('adminLoginTime')
      
      // Check if logged in and session is less than 24 hours old
      if (adminAuth === 'true' && loginTime) {
        const now = new Date().getTime()
        const timeDiff = now - parseInt(loginTime)
        const hoursDiff = timeDiff / (1000 * 60 * 60)
        
        if (hoursDiff < 24) {
          setIsAuthenticated(true)
        } else {
          // Session expired
          localStorage.removeItem('adminAuth')
          localStorage.removeItem('adminLoginTime')
          router.push('/admin/login')
        }
      } else {
        router.push('/admin/login')
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
