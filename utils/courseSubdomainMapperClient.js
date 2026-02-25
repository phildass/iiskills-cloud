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
 * Deprecated apps removed: learn-govt-jobs
 */
const AVAILABLE_SUBDOMAINS = [
  "learn-ai",
  "learn-apt",
  "learn-chemistry",
  "learn-developer",
  "learn-geography",
  "learn-management",
  "learn-math",
  "learn-physics",
  "learn-pr",
];

/**
 * Port assignments for local development
 * Matches the configuration in package.json
 * Deprecated apps removed: learn-govt-jobs (3013)
 */
const PORT_MAP = {
  "learn-ai": "3024",
  "learn-apt": "3002",
  "learn-chemistry": "3005",
  "learn-developer": "3007",
  "learn-geography": "3011",
  "learn-management": "3016",
  "learn-math": "3017",
  "learn-physics": "3020",
  "learn-pr": "3021",
};

/**
 * Normalize a course name to match subdomain format
 * Examples:
 *   "Learn AI" -> "learn-ai"
 *   "Learn JEE" -> "learn-jee"
 *   "Learn Maths (FREE)" -> "learn-math"
 *   "Learn Aptitude (FREE)" -> "learn-apt"
 *   "Learn AI (Artificial Intelligence)" -> "learn-ai"
 */
export function normalizeCourseNameToSubdomain(courseName) {
  return courseName
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, " ") // Remove all content in parentheses (handles both (FREE) and descriptions)
    .replace(/\s*–\s*.*$/g, "") // Remove " – Free" or " – From the book" suffixes
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens with single hyphen
    .replace(/,/g, "") // Remove commas
    .replace(/\//g, "-") // Replace slashes with hyphens
    .replace(/aptitude/g, "apt") // Special case: aptitude -> apt
    .replace(/mathematics/g, "math") // Special case: mathematics -> math
    .replace(/maths/g, "math") // Special case: maths -> math
    .replace(/government-jobs/g, "govt-jobs") // Special case: government jobs -> govt jobs
    .replace(/government/g, "govt") // Special case: government -> govt
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .trim();
}

/**
 * Get subdomain link information for a course
 * @param {string} courseName - The name of the course (e.g., "Learn AI")
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {object|null} Subdomain info or null if no matching subdomain exists
 */
export function getCourseSubdomainLink(courseName, isDevelopment = false) {
  const normalizedName = normalizeCourseNameToSubdomain(courseName);

  // Check if subdomain exists
  const subdomainExists = AVAILABLE_SUBDOMAINS.includes(normalizedName);

  if (!subdomainExists) {
    // Try without trailing 's' (e.g., "learn-maths" -> "learn-math")
    const withoutS = normalizedName.replace(/s$/, "");
    if (AVAILABLE_SUBDOMAINS.includes(withoutS)) {
      const port = PORT_MAP[withoutS] || "3000";
      return {
        subdomain: withoutS,
        productionUrl: `https://app1.${withoutS}.iiskills.cloud`,
        localUrl: `http://localhost:${port}`,
        localPort: port,
        url: isDevelopment ? `http://localhost:${port}` : `https://app1.${withoutS}.iiskills.cloud`,
        exists: true,
      };
    }

    return null; // No matching subdomain found
  }

  const port = PORT_MAP[normalizedName] || "3000";

  return {
    subdomain: normalizedName,
    productionUrl: `https://app1.${normalizedName}.iiskills.cloud`,
    localUrl: `http://localhost:${port}`,
    localPort: port,
    url: isDevelopment ? `http://localhost:${port}` : `https://app1.${normalizedName}.iiskills.cloud`,
    exists: true,
  };
}

/**
 * Get all available subdomains with their metadata
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {Array} Array of subdomain objects with metadata
 */
export function getAllSubdomains(isDevelopment = false) {
  return AVAILABLE_SUBDOMAINS.map((subdomain) => {
    const port = PORT_MAP[subdomain] || "3000";
    return {
      subdomain: subdomain,
      productionUrl: `https://app1.${subdomain}.iiskills.cloud`,
      localUrl: `http://localhost:${port}`,
      localPort: port,
      url: isDevelopment ? `http://localhost:${port}` : `https://app1.${subdomain}.iiskills.cloud`,
      exists: true,
    };
  });
}

/**
 * Check if a course has a corresponding subdomain app
 * @param {string} courseName - The name of the course
 * @returns {boolean} True if subdomain exists
 */
export function courseHasSubdomain(courseName) {
  const link = getCourseSubdomainLink(courseName);
  return link !== null;
}
