/**
 * Supabase Client Configuration for Learn-NEET
 * 
 * This file initializes the Supabase client with cross-subdomain session support.
 * The session cookie is configured to work across *.iiskills.cloud subdomains,
 * allowing seamless authentication between the main app and learn-neet app.
 */

import { createClient } from '@supabase/supabase-js'

// Supabase project URL and public anonymous key
// These should match the main iiskills.cloud app for cross-app authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// For build-time, use placeholder values (will be replaced with actual env vars in production)
const effectiveUrl = supabaseUrl || "https://placeholder.supabase.co"
const effectiveKey = supabaseAnonKey || "placeholder_key"

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Warning: Supabase environment variables not set. Using placeholder values for build.')
}

// Create Supabase client with cookie options for cross-subdomain support
export const supabase = createClient(effectiveUrl, effectiveKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'iiskills-auth-token'
  }
})

/**
 * Helper function to get the currently logged-in user
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
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
 * @returns {Promise<Object>} Object with success status and optional error
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
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with user data or error
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
 * Helper function to check if user has admin role
 * @param {Object} user - User object from Supabase
 * @returns {boolean} True if user is admin
 */
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
 * @param {Object} user - User object from Supabase
 * @returns {Object} User profile data from metadata
 */
export function getUserProfile(user) {
  if (!user) return null
  
  return {
    email: user.email,
    firstName: user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.last_name || '',
    fullName: user.user_metadata?.full_name || user.email,
    role: user.user_metadata?.role || user.app_metadata?.role || 'user',
    neetSubscriptionEnd: user.user_metadata?.neet_subscription_end || null,
    hasActiveSubscription: checkActiveSubscription(user),
    ...user.user_metadata
  }
}

/**
 * Check if user has an active NEET subscription (2-year term)
 * @param {Object} user - User object from Supabase
 * @returns {boolean} True if subscription is active
 */
export function checkActiveSubscription(user) {
  if (!user) return false
  
  const subscriptionEnd = user.user_metadata?.neet_subscription_end
  if (!subscriptionEnd) return false
  
  const endDate = new Date(subscriptionEnd)
  const now = new Date()
  
  return endDate > now
}

/**
 * Helper function to get the site URL for OAuth redirects
 * @returns {string} The site URL
 */
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 
         (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3009')
}
