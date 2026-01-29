/**
 * Utility functions for managing landing page images
 */

// List of all available images in /public/images/
const AVAILABLE_IMAGES = [
  'iiskills-image1.jpg',
  'iiskills-image2.jpg',
  'iiskills-image3.jpg',
  'iiskills-image4.jpg',
  'cricket1.svg',
  'cricket2.svg',
];

/**
 * Get two images for a landing page based on app name
 * @param {string} appName - The app name (e.g., 'cricket', 'ai', 'apt')
 * @returns {Array<string>} Array of two image paths
 */
export function getLandingPageImages(appName) {
  // Special case: cricket app always uses cricket images
  if (appName === 'cricket') {
    return ['/images/cricket1.svg', '/images/cricket2.svg'];
  }

  // For all other apps, randomly select 2 images (excluding cricket-specific images)
  const generalImages = AVAILABLE_IMAGES.filter(
    (img) => !img.startsWith('cricket')
  );

  // Use app name as seed for consistent randomization per app
  const seed = hashString(appName);
  const shuffled = shuffleArray([...generalImages], seed);

  // Return first two images
  return [
    `/images/${shuffled[0]}`,
    `/images/${shuffled[1] || shuffled[0]}`, // Fallback to first if only one available
  ];
}

/**
 * Simple hash function to generate a seed from string
 * @param {string} str - String to hash
 * @returns {number} Hash value
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Shuffle array using a seed for consistent results
 * @param {Array} array - Array to shuffle
 * @param {number} seed - Seed for random generation
 * @returns {Array} Shuffled array
 */
function shuffleArray(array, seed) {
  // Simple seeded random number generator
  const random = (function (s) {
    let state = s;
    return function () {
      state = (state * 1664525 + 1013904223) % 4294967296;
      return state / 4294967296;
    };
  })(seed);

  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get placeholder image path
 * @returns {string} Placeholder image path
 */
export function getPlaceholderImage() {
  return '/images/iiskills-logo.png';
}
