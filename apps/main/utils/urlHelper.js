/**
 * URL Helper Utilities
 * 
 * Provides utilities for generating correct URLs based on the current hostname
 * and environment, supporting both main domain and subdomain access patterns.
 */

/**
 * Get the main domain based on environment
 * In production, this will be the actual domain
 * In development, it falls back to localhost
 */
export function getMainDomain() {
  if (typeof window === 'undefined') {
    // Server-side: use environment variable or default
    return process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'iiskills.cloud'
  }
  
  // Client-side: detect from hostname
  const hostname = window.location.hostname
  
  // In development (localhost)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return hostname
  }
  
  // For known domain, use configured value
  if (process.env.NEXT_PUBLIC_MAIN_DOMAIN) {
    return process.env.NEXT_PUBLIC_MAIN_DOMAIN
  }
  
  // Extract base domain (e.g., admin.iiskills.cloud -> iiskills.cloud)
  // Note: This is a simple implementation. For complex TLDs (e.g., .co.uk),
  // consider using a public suffix list library
  const parts = hostname.split('.')
  if (parts.length >= 2) {
    return parts.slice(-2).join('.')
  }
  
  return hostname
}

/**
 * Get the current subdomain
 * Returns null if on main domain
 */
export function getCurrentSubdomain() {
  if (typeof window === 'undefined') return null
  
  const hostname = window.location.hostname
  
  // No subdomain on localhost or IP addresses
  if (hostname === 'localhost' || hostname === '127.0.0.1' || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    return null
  }
  
  const parts = hostname.split('.')
  // If we have more than 2 parts (e.g., admin.iiskills.cloud), first part is subdomain
  if (parts.length > 2) {
    return parts[0]
  }
  
  return null
}

/**
 * Check if we're currently on a specific subdomain
 */
export function isOnSubdomain(subdomain) {
  return getCurrentSubdomain() === subdomain
}

/**
 * Get the admin URL based on current environment
 * Prefers subdomain if available, falls back to /admin route
 */
export function getAdminUrl(path = '') {
  if (typeof window === 'undefined') {
    // Server-side: return relative URL
    return `/admin${path}`
  }
  
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  
  // On localhost, always use /admin route
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `/admin${path}`
  }
  
  // In production, use admin subdomain
  const mainDomain = getMainDomain()
  const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : ''
  
  return `${protocol}//admin.${mainDomain}${portSuffix}${path}`
}

/**
 * Get the main site URL
 */
export function getMainSiteUrl(path = '') {
  if (typeof window === 'undefined') {
    // Server-side: return relative URL
    return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  }
  
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  const currentSubdomain = getCurrentSubdomain()
  
  // If already on main domain, return relative path
  if (!currentSubdomain) {
    return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  }
  
  // On localhost, return relative path
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  }
  
  // We're on a subdomain, return absolute URL to main domain
  const mainDomain = getMainDomain()
  const portSuffix = port && port !== '80' && port !== '443' ? `:${port}` : ''
  const cleanPath = `/${path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  
  return `${protocol}//${mainDomain}${portSuffix}${cleanPath}`
}

/**
 * Get cookie domain for authentication
 * Uses subdomain wildcard for cross-subdomain auth
 */
export function getCookieDomain() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.iiskills.cloud'
  }
  
  const hostname = window.location.hostname
  
  // On localhost, don't set domain (allows cookies to work)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined
  }
  
  // Use dot prefix for subdomain wildcard
  const mainDomain = getMainDomain()
  return `.${mainDomain}`
}

/**
 * Check if subdomain routing is enabled
 * (i.e., not on localhost)
 */
export function isSubdomainRoutingEnabled() {
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'production'
  }
  
  const hostname = window.location.hostname
  return hostname !== 'localhost' && hostname !== '127.0.0.1'
}
