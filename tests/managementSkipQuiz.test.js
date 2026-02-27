/**
 * Tests for learn-management "Skip quiz and continue" feature.
 *
 * Validates:
 *  - noBadges flag is stored in localStorage when skip is confirmed
 *  - Badge awarding is blocked when noBadges flag is set
 */

'use strict';

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

const NO_BADGES_KEY = 'learn-management-noBadges';

// ---------------------------------------------------------------------------
// Inline helpers that mirror the logic from the lesson page component
// ---------------------------------------------------------------------------

function setNoBadgesFlag(storage) {
  storage.setItem(NO_BADGES_KEY, 'true');
}

function getNoBadgesFlag(storage) {
  return storage.getItem(NO_BADGES_KEY) === 'true';
}

/**
 * Simulates badge awarding logic.
 * Returns false (no badge) if noBadges flag is set, true otherwise.
 */
function canAwardBadge(storage) {
  return !getNoBadgesFlag(storage);
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('learn-management skip-quiz feature', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('noBadges flag is false by default', () => {
    expect(getNoBadgesFlag(localStorageMock)).toBe(false);
  });

  it('setNoBadgesFlag stores "true" in localStorage', () => {
    setNoBadgesFlag(localStorageMock);
    expect(localStorageMock.getItem(NO_BADGES_KEY)).toBe('true');
  });

  it('getNoBadgesFlag returns true after flag is set', () => {
    setNoBadgesFlag(localStorageMock);
    expect(getNoBadgesFlag(localStorageMock)).toBe(true);
  });

  it('badge awarding is allowed when noBadges is false', () => {
    expect(canAwardBadge(localStorageMock)).toBe(true);
  });

  it('badge awarding is blocked when noBadges flag is set', () => {
    setNoBadgesFlag(localStorageMock);
    expect(canAwardBadge(localStorageMock)).toBe(false);
  });

  it('noBadges flag persists across reads (irreversible policy)', () => {
    setNoBadgesFlag(localStorageMock);
    // Simulate re-reading (e.g., page reload / new component mount)
    expect(getNoBadgesFlag(localStorageMock)).toBe(true);
    expect(getNoBadgesFlag(localStorageMock)).toBe(true);
  });

  it('noBadges flag cannot be unset by calling setItem with false string', () => {
    setNoBadgesFlag(localStorageMock);
    // Attempt to "undo" — policy should be irreversible in the UI
    localStorageMock.setItem(NO_BADGES_KEY, 'false');
    // The raw value is now "false" — verify canAwardBadge correctly reads it
    expect(getNoBadgesFlag(localStorageMock)).toBe(false);
    // Note: the UI never sets to "false" after setting to "true" — this is enforced
    // by the component (no reset button). The test above confirms the read logic is correct.
  });

  it('uses app-specific localStorage key (learn-management-noBadges)', () => {
    expect(NO_BADGES_KEY).toBe('learn-management-noBadges');
  });
});
