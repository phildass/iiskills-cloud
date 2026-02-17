/**
 * Access Code Validation for Learn Biology
 * Foundation Suite - Always Free (No access codes required)
 */

export function validateAccessCode(code) {
  // Foundation apps are free - always return true
  return true;
}

export function checkUserAccess(userId) {
  // Foundation apps are free - always grant access
  return {
    hasAccess: true,
    tier: 'foundation',
    isFree: true
  };
}
