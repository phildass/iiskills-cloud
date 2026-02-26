/**
 * Free Access Mode Tests
 *
 * Validates isFreeAccessEnabled() and hasContentAccess() helpers.
 */

// We exercise the module under different env variable combinations by
// re-requiring it after manipulating process.env.  Jest module caching means
// we need jest.resetModules() before each re-require.

describe('freeAccess utility', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  // ---------------------------------------------------------------------------
  // isFreeAccessEnabled()
  // ---------------------------------------------------------------------------

  describe('isFreeAccessEnabled()', () => {
    test('returns false when neither flag is set', () => {
      delete process.env.FREE_ACCESS;
      delete process.env.NEXT_PUBLIC_FREE_ACCESS;
      const { isFreeAccessEnabled } = require('../lib/freeAccess');
      expect(isFreeAccessEnabled()).toBe(false);
    });

    test('returns true when FREE_ACCESS=true (server flag)', () => {
      process.env.FREE_ACCESS = 'true';
      delete process.env.NEXT_PUBLIC_FREE_ACCESS;
      const { isFreeAccessEnabled } = require('../lib/freeAccess');
      expect(isFreeAccessEnabled()).toBe(true);
    });

    test('returns true when NEXT_PUBLIC_FREE_ACCESS=true (client flag)', () => {
      delete process.env.FREE_ACCESS;
      process.env.NEXT_PUBLIC_FREE_ACCESS = 'true';
      const { isFreeAccessEnabled } = require('../lib/freeAccess');
      expect(isFreeAccessEnabled()).toBe(true);
    });

    test('returns false when flags are "false" strings', () => {
      process.env.FREE_ACCESS = 'false';
      process.env.NEXT_PUBLIC_FREE_ACCESS = 'false';
      const { isFreeAccessEnabled } = require('../lib/freeAccess');
      expect(isFreeAccessEnabled()).toBe(false);
    });

    test('returns false when flags are set to other truthy strings', () => {
      process.env.FREE_ACCESS = '1';
      process.env.NEXT_PUBLIC_FREE_ACCESS = 'yes';
      const { isFreeAccessEnabled } = require('../lib/freeAccess');
      expect(isFreeAccessEnabled()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // hasContentAccess()
  // ---------------------------------------------------------------------------

  describe('hasContentAccess()', () => {
    describe('with free access ENABLED', () => {
      beforeEach(() => {
        process.env.FREE_ACCESS = 'true';
      });

      test('returns true when isEntitled is false', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(false)).toBe(true);
      });

      test('returns true when isEntitled is true', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(true)).toBe(true);
      });

      test('returns true when isEntitled is undefined', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(undefined)).toBe(true);
      });

      test('returns true when isEntitled is null', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(null)).toBe(true);
      });
    });

    describe('with free access DISABLED (default)', () => {
      beforeEach(() => {
        delete process.env.FREE_ACCESS;
        delete process.env.NEXT_PUBLIC_FREE_ACCESS;
      });

      test('returns false when isEntitled is false', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(false)).toBe(false);
      });

      test('returns true when isEntitled is true', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(true)).toBe(true);
      });

      test('returns false when isEntitled is null (unauthenticated)', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(null)).toBe(false);
      });

      test('returns false when isEntitled is undefined', () => {
        const { hasContentAccess } = require('../lib/freeAccess');
        expect(hasContentAccess(undefined)).toBe(false);
      });
    });
  });
});
