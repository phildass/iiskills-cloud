/**
 * Admin Authentication Utilities
 * 
 * Simple password-based admin authentication using localStorage for persistence.
 * No backend integration required at this stage.
 * 
 * Password can be changed from the admin panel.
 */

const ADMIN_PASSWORD_KEY = 'learn-apt-admin-password'
const ADMIN_SESSION_KEY = 'learn-apt-admin-session'
const DEFAULT_PASSWORD = 'phil123'

/**
 * Get the current admin password from localStorage
 * Falls back to default password if not set
 */
export function getAdminPassword() {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD
  return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_PASSWORD
}

/**
 * Set a new admin password
 */
export function setAdminPassword(newPassword) {
  if (typeof window === 'undefined') return
  localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword)
}

/**
 * Verify if the provided password matches the admin password
 */
export function verifyAdminPassword(password) {
  const currentPassword = getAdminPassword()
  return password === currentPassword
}

/**
 * Create an admin session
 * Stores session data in localStorage to persist across page reloads
 */
export function createAdminSession() {
  if (typeof window === 'undefined') return
  const session = {
    authenticated: true,
    timestamp: new Date().toISOString()
  }
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
}

/**
 * Check if admin is currently authenticated
 */
export function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false
  const sessionData = localStorage.getItem(ADMIN_SESSION_KEY)
  if (!sessionData) return false
  
  try {
    const session = JSON.parse(sessionData)
    return session.authenticated === true
  } catch (error) {
    return false
  }
}

/**
 * Clear admin session (sign out)
 */
export function clearAdminSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_SESSION_KEY)
}

/**
 * Reset admin password to default
 * Useful for recovery
 */
export function resetAdminPassword() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ADMIN_PASSWORD_KEY)
}
