/**
 * Checks that all required environment variables are set.
 * Throws an error listing missing variables if any are absent.
 * @param {string[]} requiredVars - List of required env var names.
 */
function checkConfig(requiredVars) {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}
module.exports = checkConfig;
