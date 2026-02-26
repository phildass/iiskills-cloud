/**
 * Free Access Mode Utility
 *
 * When NEXT_PUBLIC_FREE_ACCESS=true (client bundles) or FREE_ACCESS=true (server),
 * the platform treats all paid content as accessible — a legitimate product switch
 * for campaigns or open-access periods. No security logic is modified; gating is
 * simply short-circuited by this flag.
 *
 * Usage:
 *   import { isFreeAccessEnabled, hasContentAccess } from '@/lib/freeAccess';
 *
 *   if (isFreeAccessEnabled()) { ... }           // check the flag
 *   if (hasContentAccess(isEntitled)) { ... }    // preferred helper for content gates
 */

/**
 * Returns true when the global free-access mode is active.
 *
 * - On the server  : reads process.env.FREE_ACCESS === 'true'
 * - On client bundles: reads process.env.NEXT_PUBLIC_FREE_ACCESS === 'true'
 *   (Next.js inlines NEXT_PUBLIC_* vars at build time)
 *
 * @returns {boolean}
 */
export function isFreeAccessEnabled() {
  if (typeof process !== 'undefined') {
    if (process.env.FREE_ACCESS === 'true') return true;
    if (process.env.NEXT_PUBLIC_FREE_ACCESS === 'true') return true;
  }
  return false;
}

/**
 * Determines whether a user has access to a piece of paid content.
 *
 * Short-circuits to `true` when free-access mode is enabled; otherwise
 * falls back to the caller-supplied `isEntitled` value (existing logic).
 *
 * @param {boolean} isEntitled - result of the existing entitlement/subscription check
 * @returns {boolean}
 */
export function hasContentAccess(isEntitled) {
  if (isFreeAccessEnabled()) return true;
  return !!isEntitled;
}
