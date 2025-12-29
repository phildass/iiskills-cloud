/**
 * Admin Context Provider
 * 
 * Manages admin authentication state across the application.
 * Uses React Context API for state management and localStorage for persistence.
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { isAdminAuthenticated, clearAdminSession } from '../lib/adminAuth'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount and when storage changes
  useEffect(() => {
    checkAuth()
    
    // Listen for storage changes (e.g., when another tab signs in/out)
    const handleStorageChange = (e) => {
      if (e.key === 'learn-apt-admin-session') {
        checkAuth()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const checkAuth = () => {
    const authenticated = isAdminAuthenticated()
    setIsAuthenticated(authenticated)
    setIsLoading(false)
  }

  const signIn = () => {
    setIsAuthenticated(true)
  }

  const signOut = () => {
    clearAdminSession()
    setIsAuthenticated(false)
  }

  const value = {
    isAuthenticated,
    isLoading,
    signIn,
    signOut
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
