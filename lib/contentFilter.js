/**
 * Content Filter Utility
 *
 * Server-side content moderation using the deterministic banlist from
 * config/content-banlist.json. Used for both Course Messages and Tickets.
 *
 * Usage:
 *   const { isFlagged, reason } = checkContent(text);
 *   if (isFlagged) { ... }
 */

const path = require("path");
const fs = require("fs");

/** Number of moderation strikes before a user is automatically banned. */
const MODERATION_STRIKE_LIMIT = 3;

let _banlist = null;

function loadBanlist() {
  if (_banlist) return _banlist;
  try {
    const banlistPath = path.join(process.cwd(), "config", "content-banlist.json");
    const raw = fs.readFileSync(banlistPath, "utf8");
    _banlist = JSON.parse(raw);
  } catch (err) {
    console.warn(
      "[contentFilter] Failed to load banlist — content moderation is disabled:",
      err.message
    );
    // Fallback empty banlist if file is missing
    _banlist = { bannedKeywords: [], bannedPhrases: [], controversialTopics: [] };
  }
  return _banlist;
}

/**
 * Check whether the given text should be flagged by the content filter.
 *
 * @param {string} text - The content to check
 * @returns {{ flagged: boolean, reason?: string }}
 */
function checkContent(text) {
  if (!text || typeof text !== "string") return { flagged: false };

  const banlist = loadBanlist();
  const lowerText = text.toLowerCase();

  for (const keyword of banlist.bannedKeywords || []) {
    if (lowerText.includes(keyword.toLowerCase())) {
      return { flagged: true, reason: `Banned keyword: ${keyword}` };
    }
  }

  for (const phrase of banlist.bannedPhrases || []) {
    if (lowerText.includes(phrase.toLowerCase())) {
      return { flagged: true, reason: `Banned phrase: ${phrase}` };
    }
  }

  for (const topic of banlist.controversialTopics || []) {
    if (lowerText.includes(topic.toLowerCase())) {
      return { flagged: true, reason: `Controversial topic: ${topic}` };
    }
  }

  return { flagged: false };
}

module.exports = { checkContent, MODERATION_STRIKE_LIMIT };
