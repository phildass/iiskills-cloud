/**
 * Moderation strike helpers.
 *
 * Centralises the strike/ban threshold logic so that both API handlers and
 * tests can import from the same source of truth.
 */

"use strict";

const { MODERATION_STRIKE_LIMIT } = require("../contentFilter");

/**
 * Calculate the new strike count and whether the user should be banned.
 *
 * @param {number} currentStrikes - The user's current strike count.
 * @returns {{ newStrikes: number, shouldBan: boolean }}
 */
function processModerationStrike(currentStrikes) {
  const newStrikes = currentStrikes + 1;
  const shouldBan = newStrikes >= MODERATION_STRIKE_LIMIT;
  return { newStrikes, shouldBan };
}

module.exports = { processModerationStrike, MODERATION_STRIKE_LIMIT };
