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
// These must be set via environment variables in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local')
}

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
 * @param {string} redirectTo - Optional custom redirect URL (defaults to homepage)
 * @returns {Promise<Object>} Object with success status or error
 * 
 * Example usage:
 * const { success, error } = await sendMagicLink(email)
 * if (success) {
 *   console.log('Magic link sent! Check your email.')
 * }
 */
export async function sendMagicLink(email, redirectTo = null) {
  try {
    const redirectUrl = redirectTo || (typeof window !== 'undefined' 
      ? `${window.location.origin}/` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
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
 * @param {string} redirectTo - Optional custom redirect URL (defaults to homepage)
 * @returns {Promise<Object>} Object with success status or error
 * 
 * Example usage:
 * const { success, error } = await signInWithGoogle()
 */
export async function signInWithGoogle(redirectTo = null) {
  try {
    const redirectUrl = redirectTo || (typeof window !== 'undefined' 
      ? `${window.location.origin}/` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
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

/**
 * Helper function to check if user has paid/registered status
 * 
 * ⚠️ IMPORTANT: This is for CLIENT-SIDE UI DISPLAY ONLY
 * Server-side verification is required for actual access control.
 * 
 * In production, implement proper payment verification:
 * - Check against payment database/table in Supabase
 * - Verify payment status with payment provider
 * - Use Row Level Security (RLS) policies
 * 
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user has paid/registered
 * 
 * Example usage:
 * const hasPaid = await checkUserPaymentStatus(user)
 * if (hasPaid) {
 *   // Grant access to paid content
 * }
 */
export async function checkUserPaymentStatus(user) {
  if (!user) return false
  
  try {
    // Check user metadata for payment status
    // This can be set when payment is processed
    if (user.user_metadata?.payment_status === 'paid' || 
        user.app_metadata?.payment_status === 'paid') {
      return true
    }
    
    // Admins automatically have access
    if (isAdmin(user)) {
      return true
    }
    
    // TODO: In production, query Supabase database for payment records
    // Example:
    // const { data, error } = await supabase
    //   .from('payments')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .eq('status', 'completed')
    //   .single()
    // 
    // if (data) return true
    
    // For now, return false - user must have paid status in metadata
    return false
  } catch (error) {
    console.error('Error checking payment status:', error)
    return false
  }
}

/**
 * Helper function to get user profile information
 * 
 * @param {Object} user - User object from Supabase
 * @returns {Object} User profile with name, email, etc.
 */
export function getUserProfile(user) {
  if (!user) return null
  
  return {
    email: user.email,
    firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || '',
    fullName: `${user.user_metadata?.firstName || user.user_metadata?.first_name || ''} ${user.user_metadata?.lastName || user.user_metadata?.last_name || ''}`.trim() || user.email,
    role: user.user_metadata?.role || user.app_metadata?.role || 'user',
    paymentStatus: user.user_metadata?.payment_status || user.app_metadata?.payment_status || 'unpaid'
  }
}
