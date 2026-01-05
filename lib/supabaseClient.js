/**
 * Supabase Client Configuration
 * 
 * This file initializes and exports the Supabase client for authentication and database operations.
 * 
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from project settings
 * 3. Create a .env.local file in the root directory with:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * 
 * Learn more: https://supabase.com/docs/guides/auth
 */

import { createClient } from '@supabase/supabase-js'
import { getCookieDomain } from '../utils/urlHelper'

// Supabase project URL and public anonymous key
// These are safe to use in the browser as they are public credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://octgncmruhsbrxpxrkzl.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_xWzMTqb9OhPNr1Hbf51qQQ_D8FXzc0x"

// Create a single Supabase client instance for the app
// This client will be reused across the application for all Supabase operations
// Configure cookie options for cross-subdomain authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in cookies for cross-subdomain support
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    // Cookie options for cross-subdomain authentication
    cookieOptions: {
      domain: getCookieDomain(),
      // Secure cookies in production
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
  }
})

/**
 * Helper function to get the currently logged-in user
 * 
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 * 
 * Example usage:
 * const user = await getCurrentUser()
 * if (user) {
 *   console.log('Logged in as:', user.email)
 * }
 */
export async function getCurrentUser() {
  try {
    // Get the current session from Supabase
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error.message)
      return null
    }
    
    // Return the user object from the session (or null if no session)
    return session?.user || null
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Helper function to sign out the current user
 * 
 * @returns {Promise<Object>} Object with success status and optional error
 * 
 * Example usage:
 * const { success, error } = await signOutUser()
 * if (success) {
 *   router.push('/login')
 * }
 */
export async function signOutUser() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Error signing out:', error.message)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in signOutUser:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Helper function to sign in with email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with user data or error
 * 
 * Example usage:
 * const { user, error } = await signInWithEmail(email, password)
 * if (user) {
 *   console.log('Signed in successfully')
 * }
 */
export async function signInWithEmail(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { user: null, error: error.message }
    }
    
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Error in signInWithEmail:', error)
    return { user: null, error: error.message }
  }
}

/**
 * Helper function to send a magic link (passwordless sign-in email)
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Object with success status or error
 * 
 * Example usage:
 * const { success, error } = await sendMagicLink(email)
 * if (success) {
 *   console.log('Magic link sent! Check your email.')
 * }
 */
export async function sendMagicLink(email) {
  try {
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      }
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error in sendMagicLink:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Helper function to sign in with Google OAuth
 * 
 * @returns {Promise<Object>} Object with success status or error
 * 
 * Example usage:
 * const { success, error } = await signInWithGoogle()
 */
export async function signInWithGoogle() {
  try {
    const redirectUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}/` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error in signInWithGoogle:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Helper function to check if user has admin role
 * 
 * ⚠️ IMPORTANT: This is for CLIENT-SIDE UI DISPLAY ONLY
 * Server-side verification is required for actual access control.
 * This function should only be used to show/hide UI elements.
 * 
 * In production, implement server-side admin verification:
 * - API routes should verify admin role from auth token
 * - Protected pages should validate on server before rendering
 * - Database queries should use Row Level Security (RLS)
 * 
 * @param {Object} user - User object from Supabase
 * @returns {boolean} True if user is admin
 */
export function isAdmin(user) {
  if (!user) return false
  // Check user metadata for admin role
  return user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin'
}
