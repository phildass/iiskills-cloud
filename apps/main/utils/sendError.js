/**
 * Sends a standardized error response.
 * @param {object} res - Express or Next.js response object.
 * @param {number} status - HTTP status code.
 * @param {string} code - Short error code.
 * @param {string} message - Detailed error message.
 */
function sendError(res, status, code, message) {
  res.status(status).json({ error: code, message });
}
module.exports = sendError;