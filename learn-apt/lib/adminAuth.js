/**
 * Admin Authentication Utilities
 * 
 * Secure admin authentication using Supabase backend with role-based access control.
 * Admin privileges are determined by checking user roles in the database.
 * 
 * Security:
 * - No hardcoded passwords
 * - Backend validation through Supabase
 * - Role-based access control
 */

import { getCurrentUser, isAdmin } from './supabaseClient'

/**
 * Check if the current user has admin privileges
 * Validates against Supabase backend by checking user role in database
 * 
 * @returns {Promise<boolean>} True if user is authenticated and has admin role
 */
export async function isAdminAuthenticated() {
  try {
    const user = await getCurrentUser()
    if (!user) return false
    
    // Check if user has admin role in database
    return isAdmin(user)
  } catch (error) {
    console.error('Error checking admin authentication:', error)
    return false
  }
}

/**
 * Get current admin user
 * Returns user object if authenticated and has admin role
 * 
 * @returns {Promise<Object|null>} Admin user object or null
 */
export async function getAdminUser() {
  try {
    const user = await getCurrentUser()
    if (!user) return null
    
    // Only return user if they have admin role
    if (isAdmin(user)) {
      return user
    }
    
    return null
  } catch (error) {
    console.error('Error getting admin user:', error)
    return null
  }
}
