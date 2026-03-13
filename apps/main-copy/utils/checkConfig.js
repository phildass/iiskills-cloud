/**
 * Checks that all required environment variables are present.
 * Throws an error listing the missing variables if any are not set.
 * @param {string[]} keys - Array of required environment variable names.
 */
function checkConfig(keys) {
  const missing = keys.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    const err = new Error(`Missing required environment variables: ${missing.join(", ")}`);
    err.missingVars = missing;
    throw err;
  }
}

module.exports = checkConfig;
