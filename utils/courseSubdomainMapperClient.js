/**
 * Course to Subdomain Mapper - Browser Version
 * 
 * This utility maps courses to their corresponding subdomain applications.
 * This version is browser-compatible and doesn't use Node.js fs module.
 * 
 * It enables:
 * - Automatic course linking to subdomain apps
 * - Easy addition of new courses/subdomains
 * - Consistent URL generation for dev and production
 */

/**
 * List of all available subdomain apps
 * This should be updated when new subdomain apps are added
 */
const AVAILABLE_SUBDOMAINS = [
  'learn-ai',
  'learn-apt',
  'learn-chemistry',
  'learn-data-science',
  'learn-geography',
  'learn-govt-jobs',
  'learn-jee',
  'learn-leadership',
  'learn-management',
  'learn-math',
  'learn-neet',
  'learn-physics',
  'learn-pr',
  'learn-winning'
]

/**
 * Port assignments for local development
 * Matches the configuration in learn-modules.js
 */
const PORT_MAP = {
  'learn-apt': '3001',
  'learn-math': '3002',
  'learn-winning': '3003',
  'learn-data-science': '3004',
  'learn-management': '3005',
  'learn-leadership': '3006',
  'learn-ai': '3007',
  'learn-pr': '3008',
  'learn-jee': '3009',
  'learn-chemistry': '3010',
  'learn-physics': '3011',
  'learn-geography': '3012',
  'learn-neet': '3013',
  'learn-govt-jobs': '3014'
}

/**
 * Normalize a course name to match subdomain format
 * Examples:
 *   "Learn AI" -> "learn-ai"
 *   "Learn JEE" -> "learn-jee"
 *   "Learn Maths – Free" -> "learn-math"
 *   "Learn Aptitude – Free" -> "learn-apt"
 */
export function normalizeCourseNameToSubdomain(courseName) {
  return courseName
    .toLowerCase()
    .replace(/\s*–\s*.*$/g, '') // Remove " – Free" or " – From the book" suffixes
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[()]/g, '') // Remove parentheses
    .replace(/\//g, '-') // Replace slashes with hyphens
    .replace(/,/g, '') // Remove commas
    .replace(/aptitude/g, 'apt') // Special case: aptitude -> apt
    .replace(/mathematics/g, 'math') // Special case: mathematics -> math  
    .replace(/maths/g, 'math') // Special case: maths -> math
    .replace(/government-jobs/g, 'govt-jobs') // Special case: government jobs -> govt jobs
    .replace(/government/g, 'govt') // Special case: government -> govt
    .trim()
}

/**
 * Get subdomain link information for a course
 * @param {string} courseName - The name of the course (e.g., "Learn AI")
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {object|null} Subdomain info or null if no matching subdomain exists
 */
export function getCourseSubdomainLink(courseName, isDevelopment = false) {
  const normalizedName = normalizeCourseNameToSubdomain(courseName)
  
  // Check if subdomain exists
  const subdomainExists = AVAILABLE_SUBDOMAINS.includes(normalizedName)
  
  if (!subdomainExists) {
    // Try without trailing 's' (e.g., "learn-maths" -> "learn-math")
    const withoutS = normalizedName.replace(/s$/, '')
    if (AVAILABLE_SUBDOMAINS.includes(withoutS)) {
      const port = PORT_MAP[withoutS] || '3000'
      return {
        subdomain: withoutS,
        productionUrl: `https://${withoutS}.iiskills.cloud`,
        localUrl: `http://localhost:${port}`,
        localPort: port,
        url: isDevelopment ? `http://localhost:${port}` : `https://${withoutS}.iiskills.cloud`,
        exists: true
      }
    }
    
    return null // No matching subdomain found
  }
  
  const port = PORT_MAP[normalizedName] || '3000'
  
  return {
    subdomain: normalizedName,
    productionUrl: `https://${normalizedName}.iiskills.cloud`,
    localUrl: `http://localhost:${port}`,
    localPort: port,
    url: isDevelopment ? `http://localhost:${port}` : `https://${normalizedName}.iiskills.cloud`,
    exists: true
  }
}

/**
 * Get all available subdomains with their metadata
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {Array} Array of subdomain objects with metadata
 */
export function getAllSubdomains(isDevelopment = false) {
  return AVAILABLE_SUBDOMAINS.map(subdomain => {
    const port = PORT_MAP[subdomain] || '3000'
    return {
      subdomain: subdomain,
      productionUrl: `https://${subdomain}.iiskills.cloud`,
      localUrl: `http://localhost:${port}`,
      localPort: port,
      url: isDevelopment ? `http://localhost:${port}` : `https://${subdomain}.iiskills.cloud`,
      exists: true
    }
  })
}

/**
 * Check if a course has a corresponding subdomain app
 * @param {string} courseName - The name of the course
 * @returns {boolean} True if subdomain exists
 */
export function courseHasSubdomain(courseName) {
  const link = getCourseSubdomainLink(courseName)
  return link !== null
}
