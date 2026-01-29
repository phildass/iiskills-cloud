/**
 * Session Manager for Multi-App Authentication
 * 
 * Manages user sessions across multiple apps in the iiskills.cloud ecosystem.
 * Provides utilities for:
 * - Tracking the last visited app
 * - Managing app-to-app navigation
 * - Storing user preferences for app access
 * - Session persistence across domains
 */

import { getCurrentApp, getAppById } from './appRegistry';

const STORAGE_KEYS = {
  LAST_APP: 'iiskills_last_app',
  PREFERRED_APP: 'iiskills_preferred_app',
  APP_HISTORY: 'iiskills_app_history',
  LAST_LOGIN_APP: 'iiskills_last_login_app',
};

/**
 * Store the current app as the last visited app
 */
export function recordAppVisit() {
  if (typeof window === 'undefined') return;
  
  const currentApp = getCurrentApp();
  if (!currentApp) return;
  
  try {
    // Store last app
    localStorage.setItem(STORAGE_KEYS.LAST_APP, currentApp.id);
    
    // Update app history
    const history = getAppHistory();
    const updatedHistory = [
      currentApp.id,
      ...history.filter(id => id !== currentApp.id)
    ].slice(0, 10); // Keep last 10 apps
    
    localStorage.setItem(STORAGE_KEYS.APP_HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error recording app visit:', error);
  }
}

/**
 * Get the last visited app
 * @returns {Object|null} App configuration or null
 */
export function getLastVisitedApp() {
  if (typeof window === 'undefined') return null;
  
  try {
    const lastAppId = localStorage.getItem(STORAGE_KEYS.LAST_APP);
    if (!lastAppId) return null;
    
    return getAppById(lastAppId);
  } catch (error) {
    console.error('Error getting last visited app:', error);
    return null;
  }
}

/**
 * Get app visit history
 * @returns {Array} Array of app IDs in order of most recent to oldest
 */
export function getAppHistory() {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem(STORAGE_KEYS.APP_HISTORY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting app history:', error);
    return [];
  }
}

/**
 * Set user's preferred app (where they want to be redirected after login)
 * @param {string} appId - App identifier
 */
export function setPreferredApp(appId) {
  if (typeof window === 'undefined') return;
  
  try {
    const app = getAppById(appId);
    if (app) {
      localStorage.setItem(STORAGE_KEYS.PREFERRED_APP, appId);
    }
  } catch (error) {
    console.error('Error setting preferred app:', error);
  }
}

/**
 * Get user's preferred app
 * @returns {Object|null} App configuration or null
 */
export function getPreferredApp() {
  if (typeof window === 'undefined') return null;
  
  try {
    const appId = localStorage.getItem(STORAGE_KEYS.PREFERRED_APP);
    if (!appId) return null;
    
    return getAppById(appId);
  } catch (error) {
    console.error('Error getting preferred app:', error);
    return null;
  }
}

/**
 * Record the app where user logged in
 * This is used to redirect back to the same app after OAuth callback
 * @param {string} appId - App identifier
 */
export function recordLoginApp(appId) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_LOGIN_APP, appId);
  } catch (error) {
    console.error('Error recording login app:', error);
  }
}

/**
 * Get the app where user initiated login
 * @returns {Object|null} App configuration or null
 */
export function getLoginApp() {
  if (typeof window === 'undefined') return null;
  
  try {
    const appId = localStorage.getItem(STORAGE_KEYS.LAST_LOGIN_APP);
    if (!appId) return null;
    
    return getAppById(appId);
  } catch (error) {
    console.error('Error getting login app:', error);
    return null;
  }
}

/**
 * Clear login app record (should be called after successful login redirect)
 */
export function clearLoginApp() {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.LAST_LOGIN_APP);
  } catch (error) {
    console.error('Error clearing login app:', error);
  }
}

/**
 * Get the best redirect target after authentication
 * Priority:
 * 1. Explicit redirect parameter from URL
 * 2. App where login was initiated
 * 3. User's preferred app
 * 4. Current app
 * 5. Main app (fallback)
 * 
 * @param {string} explicitRedirect - Redirect from URL parameter
 * @returns {Object} Object with appId and path
 */
export function getBestAuthRedirect(explicitRedirect = null) {
  // Validate and sanitize explicit redirect to prevent open redirect attacks
  if (explicitRedirect) {
    // Only allow relative paths or URLs from our domain
    const isRelativePath = explicitRedirect.startsWith('/');
    const isOurDomain = explicitRedirect.includes('iiskills.cloud') || 
                        explicitRedirect.includes('localhost');
    
    if (isRelativePath || isOurDomain) {
      const currentApp = getCurrentApp();
      return {
        appId: currentApp?.id || 'main',
        path: isRelativePath ? explicitRedirect : new URL(explicitRedirect).pathname,
        fullUrl: explicitRedirect.startsWith('http') 
          ? explicitRedirect 
          : `${typeof window !== 'undefined' ? window.location.origin : ''}${explicitRedirect}`
      };
    }
    // If invalid redirect, fall through to other options
    console.warn('Invalid redirect URL rejected:', explicitRedirect);
  }
  
  // Check where login was initiated
  const loginApp = getLoginApp();
  if (loginApp) {
    clearLoginApp(); // Clear it after use
    const fullUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${loginApp.postLoginRedirect}`
      : null;
    return {
      appId: loginApp.id,
      path: loginApp.postLoginRedirect,
      fullUrl
    };
  }
  
  // Check user's preferred app
  const preferredApp = getPreferredApp();
  if (preferredApp) {
    const fullUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${preferredApp.postLoginRedirect}`
      : null;
    return {
      appId: preferredApp.id,
      path: preferredApp.postLoginRedirect,
      fullUrl
    };
  }
  
  // Use current app
  const currentApp = getCurrentApp();
  if (currentApp) {
    const fullUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${currentApp.postLoginRedirect}`
      : null;
    return {
      appId: currentApp.id,
      path: currentApp.postLoginRedirect,
      fullUrl
    };
  }
  
  // Fallback to main app
  const mainApp = getAppById('main');
  if (!mainApp) {
    // Ultimate fallback if even main app is not found
    console.error('Main app not found in registry');
    return {
      appId: 'main',
      path: '/',
      fullUrl: typeof window !== 'undefined'
        ? `${window.location.origin}/`
        : null
    };
  }
  
  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.protocol}//${mainApp.primaryDomain}${mainApp.postLoginRedirect}`
    : null;
  return {
    appId: 'main',
    path: mainApp.postLoginRedirect,
    fullUrl
  };
}

/**
 * Navigate to another app with authentication preserved
 * @param {string} appId - Target app identifier
 * @param {string} path - Path within the target app
 */
export function navigateToApp(appId, path = '/') {
  if (typeof window === 'undefined') return;
  
  const app = getAppById(appId);
  if (!app) {
    console.error(`App ${appId} not found`);
    return;
  }
  
  // Build URL
  let url;
  if (window.location.hostname === 'localhost') {
    url = `http://localhost:${app.localPort}${path}`;
  } else {
    url = `https://${app.primaryDomain}${path}`;
  }
  
  // Record visit before navigating
  recordAppVisit();
  
  // Navigate
  window.location.href = url;
}

/**
 * Check if session is valid across apps
 * This uses Supabase's built-in session management
 * Sessions are automatically shared via cookies with domain .iiskills.cloud
 * 
 * @returns {Promise<boolean>} True if session is valid
 */
export async function isSessionValid() {
  if (typeof window === 'undefined') return false;
  
  try {
    // Import dynamically to avoid circular dependencies
    const { getCurrentUser } = await import('./supabaseClient');
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    console.error('Error checking session validity:', error);
    return false;
  }
}

/**
 * Initialize session manager
 * Should be called on app mount
 */
export function initSessionManager() {
  if (typeof window === 'undefined') return;
  
  // Record current app visit
  recordAppVisit();
  
  // Set up session monitoring if needed
  // (Supabase already handles this, but we can add custom logic here)
}
