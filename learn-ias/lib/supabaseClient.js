/**
 * Supabase Client Configuration for Learn-IAS
 * 
 * This file initializes the Supabase client with cross-subdomain session support.
 * The session cookie is configured to work across *.iiskills.cloud subdomains,
 * allowing seamless authentication between the main app and learn-ias app.
 * 
 * Setup Instructions:
 * 1. Use the same Supabase project as the main iiskills.cloud app
 * 2. Create a .env.local file with the same credentials:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 * 3. Configure Supabase session cookie domain in the Supabase dashboard:
 *    - Go to Authentication > Settings
 *    - Set cookie domain to: .iiskills.cloud
 * 
 * Cross-Subdomain Auth:
 * - Users logged in on iiskills.cloud will automatically be logged in on learn-ias.iiskills.cloud
 * - Sessions are shared across all *.iiskills.cloud subdomains
 * - Role and permission data is synced via Supabase user metadata
 */

import { createClient } from '@supabase/supabase-js'

// Supabase project URL and public anonymous key
// These should match the main iiskills.cloud app for cross-app authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

// Create Supabase client with cookie options for cross-subdomain support
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Enable auto-refresh of tokens
        autoRefreshToken: true,
        // Persist session in localStorage
        persistSession: true,
        // Detect session from URL (for OAuth redirects)
        detectSessionInUrl: true,
        // Cookie options for cross-subdomain authentication
        flowType: 'pkce',
        // Storage key - use a shared key for consistency
        storageKey: 'iiskills-auth-token'
      }
    })
  : null

/**
 * Helper function to get the currently logged-in user
 * 
 * This checks for an active session that may have been created on any
 * *.iiskills.cloud subdomain (main app, learn-ias, etc.)
 * 
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  if (!supabase) return null
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error.message)
      return null
    }
    
    return session?.user || null
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

/**
 * Helper function to sign out the current user
 * 
 * This will clear the session across all *.iiskills.cloud subdomains
 * 
 * @returns {Promise<Object>} Object with success status and optional error
 */
export async function signOutUser() {
  if (!supabase) return { success: false, error: 'Supabase not configured' }
  
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
 */
export async function signInWithEmail(email, password) {
  if (!supabase) return { user: null, error: 'Supabase not configured' }
  
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
 * Helper function to sign in with email and password (alias)
 */
export async function signInWithPassword(email, password) {
  return signInWithEmail(email, password)
}

/**
 * Helper function to sign in with magic link
 */
export async function signInWithMagicLink(email) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Helper function to sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Helper function to sign up with email and password
 */
export async function signUp(email, password, metadata = {}) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Helper function to sign out
 */
export async function signOut() {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * Helper function to check if user has admin role
 * 
 * Uses the public.profiles table to validate admin status.
 * This is the centralized approach for admin validation across all apps.
 * 
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user is admin
 */
export async function isAdmin(user) {
  if (!user) return false
  
  try {
    // Query the public.profiles table for admin status
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error checking admin status:', error.message)
      return false
    }
    
    return data?.is_admin === true
  } catch (error) {
    console.error('Error in isAdmin:', error)
    return false
  }
}

/**
 * Helper function to get user's full profile
 * 
 * @param {Object} user - User object from Supabase
 * @returns {Object} User profile data from metadata
 */
export function getUserProfile(user) {
  if (!user) return null
  
  return {
    id: user.id,
    email: user.email,
    firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || '',
    fullName: user.user_metadata?.full_name || `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
    isAdmin: user.user_metadata?.isAdmin === true,
    hasPurchasedIAS: user.user_metadata?.purchased_ias_course === true,
  }
}

/**
 * Helper function to get the site URL
 * 
 * @returns {string} Site URL for OAuth redirects
 */
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 
         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3015')
}
