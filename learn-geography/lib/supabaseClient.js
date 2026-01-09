/**
 * Supabase Client Configuration for Learn-Geography
 * 
 * This file initializes the Supabase client with cross-subdomain session support.
 * The session cookie is configured to work across *.iiskills.cloud subdomains,
 * allowing seamless authentication between the main app and learn-geography app.
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
 * - Users logged in on iiskills.cloud will automatically be logged in on learn-geography.iiskills.cloud
 * - Sessions are shared across all *.iiskills.cloud subdomains
 * - Role and permission data is synced via Supabase user metadata
 */

import { createClient } from '@supabase/supabase-js'

// Supabase project URL and public anonymous key
// These should match the main iiskills.cloud app for cross-app authentication
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check for missing or placeholder values
// Placeholders are exact matches or obviously invalid values
const hasPlaceholderUrl = !supabaseUrl || 
  supabaseUrl === 'your-project-url-here' || 
  supabaseUrl === 'https://your-project.supabase.co' ||
  supabaseUrl.match(/^https?:\/\/(your-project|xyz|xyzcompany|abc123).*\.supabase\.co$/i)

const hasPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey === 'your-anon-key-here' ||
  supabaseAnonKey.startsWith('eyJhbGciOi...') ||
  supabaseAnonKey.length < 20

if (!supabaseUrl || !supabaseAnonKey || hasPlaceholderUrl || hasPlaceholderKey) {
  const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  SUPABASE CONFIGURATION ERROR - learn-geography module
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing or invalid Supabase environment variables!

Required variables:
  ${!supabaseUrl || hasPlaceholderUrl ? '❌' : '✅'} NEXT_PUBLIC_SUPABASE_URL${hasPlaceholderUrl ? ' (contains placeholder value)' : ''}
  ${!supabaseAnonKey || hasPlaceholderKey ? '❌' : '✅'} NEXT_PUBLIC_SUPABASE_ANON_KEY${hasPlaceholderKey ? ' (contains placeholder value)' : ''}

To fix this:

1. Verify .env.local exists in this module:
   ${process.cwd()}/.env.local

2. Update with your actual Supabase credentials (same as main app):
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

3. Get credentials from: https://supabase.com
   - Use the SAME Supabase project as main app
   - Go to Settings → API
   - Copy Project URL and anon/public key

4. Quick setup: Run the automated script from repo root:
   cd .. && ./setup-env.sh

5. Restart the development server:
   npm run dev

⚠️  IMPORTANT: All modules must use the same Supabase credentials
   for cross-subdomain authentication to work!

For more information, see ENV_SETUP_GUIDE.md in the repo root.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
  console.error(errorMessage)
  
  // Throw error to prevent app from starting with invalid configuration
  throw new Error('Missing or invalid Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local with actual values (not placeholders)')
}

// Create Supabase client with cookie options for cross-subdomain support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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

/**
 * Helper function to get the currently logged-in user
 * 
 * This checks for an active session that may have been created on any
 * *.iiskills.cloud subdomain (main app, learn-geography, etc.)
 * 
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
 * 
 * This will clear the session across all *.iiskills.cloud subdomains
 * 
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
 * 
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
    email: user.email,
    firstName: user.user_metadata?.first_name || '',
    lastName: user.user_metadata?.last_name || '',
    fullName: user.user_metadata?.full_name || user.email,
    role: user.user_metadata?.role || user.app_metadata?.role || 'user',
    ...user.user_metadata
  }
}
