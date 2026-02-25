/**
 * Gatekeeper Questions Utility
 * 
 * Provides gatekeeper questions for each subject and tier.
 * Questions are loaded from the centralized data file.
 */

// Use dynamic import for JSON data
let gatekeeperData;
try {
  gatekeeperData = require('../data/gatekeeperQuestions.json');
} catch (err) {
  console.error('Failed to load gatekeeper questions:', err);
  gatekeeperData = [];
}

/**
 * Map of app IDs to their corresponding subject names in the gatekeeper data
 */
const APP_TO_SUBJECT_MAP = {
  'learn-math': 'Learn Mathematics',
  'learn-pr': 'Public Relations',
  'learn-management': 'Management',
  'learn-developer': 'Developer',
  'learn-ai': 'Artificial Intelligence'
};

/**
 * Get gatekeeper questions for a specific app and tier
 * @param {string} appId - The app ID (e.g., 'learn-math', 'learn-pr')
 * @param {string} tier - The tier ('Intermediate' or 'Advanced')
 * @returns {Array} Array of 3 questions for the specified app and tier
 */
function getGatekeeperQuestions(appId, tier) {
  const subject = APP_TO_SUBJECT_MAP[appId];
  
  if (!subject) {
    console.warn(`No gatekeeper questions found for app: ${appId}`);
    return [];
  }

  const tierCapitalized = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  
  const questionSet = gatekeeperData.find(
    (item) => item.subject === subject && item.tier === tierCapitalized
  );

  if (!questionSet) {
    console.warn(`No gatekeeper questions found for ${subject} - ${tierCapitalized}`);
    return [];
  }

  return questionSet.questions;
}

/**
 * Get all gatekeeper question sets for a specific app
 * @param {string} appId - The app ID (e.g., 'learn-math', 'learn-pr')
 * @returns {Object} Object with 'intermediate' and 'advanced' question arrays
 */
function getAllGatekeeperQuestions(appId) {
  return {
    intermediate: getGatekeeperQuestions(appId, 'Intermediate'),
    advanced: getGatekeeperQuestions(appId, 'Advanced')
  };
}

/**
 * Get the subject name for an app
 * @param {string} appId - The app ID (e.g., 'learn-math')
 * @returns {string} The subject name
 */
function getSubjectName(appId) {
  return APP_TO_SUBJECT_MAP[appId] || appId;
}

/**
 * Check if an app has gatekeeper questions configured
 * @param {string} appId - The app ID
 * @returns {boolean} True if the app has gatekeeper questions
 */
function hasGatekeeperQuestions(appId) {
  return APP_TO_SUBJECT_MAP.hasOwnProperty(appId);
}

// Export for CommonJS (Node.js)
module.exports = {
  getGatekeeperQuestions,
  getAllGatekeeperQuestions,
  getSubjectName,
  hasGatekeeperQuestions
};
