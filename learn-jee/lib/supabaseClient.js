import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if we have valid credentials
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get user profile from user metadata
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
    hasPurchasedJEE: user.user_metadata?.purchased_jee_course === true,
  }
}

/**
 * Get the site URL for redirects
 */
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3009'
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email, password) {
  if (!supabase) return { user: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { user: null, error: error.message }
  }
  
  return { user: data.user, error: null }
}

/**
 * Sign in with email and password (alias)
 */
export async function signInWithPassword(email, password) {
  return signInWithEmail(email, password)
}

/**
 * Sign in with magic link
 */
export async function signInWithMagicLink(email) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Sign in with Google OAuth
 */
export async function signInWithGoogle() {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Sign up with email and password
 */
export async function signUp(email, password, metadata = {}) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/learn`,
    },
  })
  
  return { data, error }
}

/**
 * Sign out
 */
export async function signOut() {
  if (!supabase) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}
