/**
 * Ticket monthly limit helpers.
 *
 * Centralises the Free/Paid ticket-per-month limits so that both the
 * API handler and tests can import from the same source of truth.
 */

"use strict";

/** Maximum tickets per calendar month for free users. */
const TICKET_LIMIT_FREE = 1;

/** Maximum tickets per calendar month for paid users. */
const TICKET_LIMIT_PAID = 5;

/**
 * Determine whether a user has exceeded their monthly ticket limit.
 *
 * @param {number} monthCount - Number of tickets already created this month.
 * @param {boolean} isPaid    - True if the user has an active paid plan.
 * @returns {{ blocked: boolean, limit: number, used: number, resetDate?: string }}
 */
function checkMonthlyTicketLimit(monthCount, isPaid) {
  const limit = isPaid ? TICKET_LIMIT_PAID : TICKET_LIMIT_FREE;
  if (monthCount >= limit) {
    // First moment of next calendar month in UTC — this is when the limit resets.
    const now = new Date();
    const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
    return {
      blocked: true,
      limit,
      used: monthCount,
      resetDate: nextMonth.toISOString(),
    };
  }
  return { blocked: false, limit, used: monthCount };
}

module.exports = { TICKET_LIMIT_FREE, TICKET_LIMIT_PAID, checkMonthlyTicketLimit };
