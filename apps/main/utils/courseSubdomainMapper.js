/**
 * Course to Subdomain Mapper Utility
 *
 * This utility automatically discovers and maps courses to their corresponding
 * subdomain applications based on directory structure.
 *
 * It enables:
 * - Automatic course linking to subdomain apps
 * - Easy addition of new courses/subdomains
 * - Consistent URL generation for dev and production
 */

const fs = require("fs");
const path = require("path");

/**
 * Normalize a course name to match subdomain format
 * Examples:
 *   "Learn AI" -> "learn-ai"
 *   "Learn JEE" -> "learn-jee"
 *   "Learn Maths (FREE)" -> "learn-math"
 *   "Learn Aptitude (FREE)" -> "learn-apt"
 *   "Learn AI (Artificial Intelligence)" -> "learn-ai"
 */
function normalizeCourseNameToSubdomain(courseName) {
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
 * Discover all subdomain directories in the repository
 * Returns an array of subdomain names (e.g., ['learn-ai', 'learn-jee', ...])
 */
function discoverSubdomainDirectories() {
  const rootDir = path.join(process.cwd());

  try {
    const items = fs.readdirSync(rootDir);

    // Filter for directories that start with 'learn-'
    const subdomains = items.filter((item) => {
      const itemPath = path.join(rootDir, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();
      return isDirectory && item.startsWith("learn-");
    });

    return subdomains;
  } catch (error) {
    console.warn("Could not discover subdomain directories:", error.message);
    return [];
  }
}

/**
 * Map course names to subdomain information
 * Returns an object mapping normalized course names to subdomain data
 */
function createCourseToSubdomainMap() {
  const subdomains = discoverSubdomainDirectories();
  const map = {};

  // Port assignments for local development (consistent with learn-modules.js)
  const portMap = {
    "learn-apt": "3001",
    "learn-math": "3002",
    "learn-winning": "3003",
    "learn-data-science": "3004",
    "learn-management": "3005",
    "learn-leadership": "3006",
    "learn-ai": "3007",
    "learn-pr": "3008",
    "learn-jee": "3009",
    "learn-chemistry": "3010",
    "learn-physics": "3011",
    "learn-geography": "3012",
    "learn-neet": "3013",
    "learn-govt-jobs": "3014",
    "learn-ias": "3015",
  };

  subdomains.forEach((subdomain) => {
    map[subdomain] = {
      subdomain: subdomain,
      productionUrl: `https://${subdomain}.iiskills.cloud`,
      localUrl: `http://localhost:${portMap[subdomain] || "3000"}`,
      localPort: portMap[subdomain] || "3000",
      exists: true,
    };
  });

  return map;
}

/**
 * Get subdomain link information for a course
 * @param {string} courseName - The name of the course (e.g., "Learn AI")
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {object|null} Subdomain info or null if no matching subdomain exists
 */
function getCourseSubdomainLink(courseName, isDevelopment = false) {
  const normalizedName = normalizeCourseNameToSubdomain(courseName);
  const map = createCourseToSubdomainMap();

  // Try exact match first
  if (map[normalizedName]) {
    return {
      ...map[normalizedName],
      url: isDevelopment ? map[normalizedName].localUrl : map[normalizedName].productionUrl,
    };
  }

  // Try without trailing 's' (e.g., "learn-maths" -> "learn-math")
  const withoutS = normalizedName.replace(/s$/, "");
  if (map[withoutS]) {
    return {
      ...map[withoutS],
      url: isDevelopment ? map[withoutS].localUrl : map[withoutS].productionUrl,
    };
  }

  // No matching subdomain found
  return null;
}

/**
 * Get all available subdomains with their metadata
 * @param {boolean} isDevelopment - Whether to use development URLs
 * @returns {Array} Array of subdomain objects with metadata
 */
function getAllSubdomains(isDevelopment = false) {
  const map = createCourseToSubdomainMap();

  return Object.values(map).map((subdomain) => ({
    ...subdomain,
    url: isDevelopment ? subdomain.localUrl : subdomain.productionUrl,
  }));
}

// Browser-compatible exports
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    normalizeCourseNameToSubdomain,
    discoverSubdomainDirectories,
    createCourseToSubdomainMap,
    getCourseSubdomainLink,
    getAllSubdomains,
  };
}

// ES6 export for Next.js compatibility
export {
  normalizeCourseNameToSubdomain,
  getCourseSubdomainLink,
  getAllSubdomains,
  createCourseToSubdomainMap,
};
