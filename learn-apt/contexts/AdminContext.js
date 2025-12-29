/**
 * Admin Context Provider
 * 
 * Manages admin authentication state across the application.
 * Uses React Context API for state management and Supabase for backend validation.
 * 
 * Security:
 * - Backend role validation through Supabase
 * - No client-side bypass possible
 */

import { createContext, useContext, useState, useEffect } from 'react'
import { isAdminAuthenticated } from '../lib/adminAuth'
import { signOutUser } from '../lib/supabaseClient'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const authenticated = await isAdminAuthenticated()
    setIsAuthenticated(authenticated)
    setIsLoading(false)
  }

  const signIn = async () => {
    // Re-check authentication to ensure user has admin role
    const authenticated = await isAdminAuthenticated()
    setIsAuthenticated(authenticated)
  }

  const signOut = async () => {
    // Sign out from Supabase (clears session across all subdomains)
    await signOutUser()
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
