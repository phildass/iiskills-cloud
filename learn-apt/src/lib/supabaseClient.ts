/**
 * Supabase Client Configuration for learn-apt
 * 
 * This file initializes and exports the Supabase client for authentication and database operations.
 * It mirrors the configuration from the main iiskills-cloud repository.
 * 
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com (use the same project as iiskills-cloud)
 * 2. Get your project URL and anon key from project settings
 * 3. Create a .env.local file in the root directory with:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *    NEXT_PUBLIC_SITE_URL=https://learn-apt.iiskills.cloud (or http://localhost:3000 for dev)
 *    NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
 * 
 * Learn more: https://supabase.com/docs/guides/auth
 */

import { createClient } from '@supabase/supabase-js'

// Supabase project URL and public anonymous key
// These are safe to use in the browser as they are public credentials
// IMPORTANT: These must be set via environment variables
// For build time, we provide placeholder values that will be replaced at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0.placeholder'

// Validate that Supabase credentials are configured (only in browser, not during build)
if (typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
    console.error('The application will not function correctly without valid Supabase credentials.')
  }
}

/**
 * Create a single Supabase client instance for the app
 * This client will be reused across the application for all Supabase operations
 * Configure cookie options for cross-subdomain authentication
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage for web apps
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
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
    return { success: false, error: (error as Error).message }
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
export async function signInWithEmail(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { user: null, session: null, error: error.message }
    }
    
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Error in signInWithEmail:', error)
    return { user: null, session: null, error: (error as Error).message }
  }
}

/**
 * Helper function to sign up a new user with email and password
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} metadata - Additional user metadata (optional)
 * @returns {Promise<Object>} Object with user data or error
 * 
 * Example usage:
 * const { user, error } = await signUpWithEmail(email, password, { name: 'John' })
 * if (user) {
 *   console.log('Signed up successfully')
 * }
 */
export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, unknown>) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    
    if (error) {
      return { user: null, session: null, error: error.message }
    }
    
    return { user: data.user, session: data.session, error: null }
  } catch (error) {
    console.error('Error in signUpWithEmail:', error)
    return { user: null, session: null, error: (error as Error).message }
  }
}

/**
 * Check if a user is an admin
 * This checks for admin role in user metadata or a specific admin email
 * 
 * @param {Object} user - User object from Supabase
 * @returns {boolean} True if user is an admin
 */
export function isAdmin(user: { user_metadata?: { role?: string }; email?: string } | null): boolean {
  if (!user) return false
  
  // Check if user has admin role in metadata
  if (user.user_metadata?.role === 'admin') return true
  
  // Check if user has admin email (fallback)
  // You can configure admin emails in Supabase dashboard or environment variables
  const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || []
  if (user.email && adminEmails.includes(user.email)) return true
  
  return false
}
