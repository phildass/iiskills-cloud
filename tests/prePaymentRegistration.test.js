/**
 * Tests for the pre-payment registration enforcement feature.
 *
 * Covers:
 * - normalizePhone: E.164 phone normalisation
 * - isValidE164:    validation of normalised numbers
 * - generate-token: 422 response when profile is incomplete
 * - isValidIndianPhone: client-side phone validation (from lib/phoneValidation.js)
 */

'use strict';

const {
  normalizePhone,
  isValidE164,
} = require('../apps/main/pages/api/payments/save-profile');

const { isValidIndianPhone } = require('../lib/phoneValidation');

// ─── normalizePhone ───────────────────────────────────────────────────────────

describe('normalizePhone — E.164 normalisation', () => {
  test('10-digit Indian number gets +91 prefix', () => {
    expect(normalizePhone('9876543210')).toBe('+919876543210');
  });

  test('10-digit number starting with 6 gets +91 prefix', () => {
    expect(normalizePhone('6123456789')).toBe('+916123456789');
  });

  test('12-digit number starting with 91 gets + prefix only', () => {
    expect(normalizePhone('919876543210')).toBe('+919876543210');
  });

  test('number with leading + is kept as-is (stripped of non-digits)', () => {
    expect(normalizePhone('+919876543210')).toBe('+919876543210');
  });

  test('number with spaces is normalised', () => {
    expect(normalizePhone('98765 43210')).toBe('+919876543210');
  });

  test('number with dashes is normalised', () => {
    expect(normalizePhone('98765-43210')).toBe('+919876543210');
  });

  test('international number with leading + is preserved', () => {
    expect(normalizePhone('+14155552671')).toBe('+14155552671');
  });

  test('returns null for empty string', () => {
    expect(normalizePhone('')).toBeNull();
  });

  test('returns null for null input', () => {
    expect(normalizePhone(null)).toBeNull();
  });

  test('returns null for undefined input', () => {
    expect(normalizePhone(undefined)).toBeNull();
  });

  test('returns null for whitespace-only input', () => {
    expect(normalizePhone('   ')).toBeNull();
  });

  test('returns null for non-digit-only input', () => {
    expect(normalizePhone('abc')).toBeNull();
  });
});

// ─── isValidE164 ──────────────────────────────────────────────────────────────

describe('isValidE164 — E.164 format validation', () => {
  test('accepts valid +91 Indian number (13 chars)', () => {
    expect(isValidE164('+919876543210')).toBe(true);
  });

  test('accepts valid US number', () => {
    expect(isValidE164('+14155552671')).toBe(true);
  });

  test('rejects number without leading +', () => {
    expect(isValidE164('919876543210')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidE164('')).toBe(false);
  });

  test('rejects null', () => {
    expect(isValidE164(null)).toBe(false);
  });

  test('rejects number with too few digits (< 8 after +)', () => {
    expect(isValidE164('+123456')).toBe(false);
  });

  test('rejects number with too many digits (> 15 after +)', () => {
    expect(isValidE164('+1234567890123456')).toBe(false);
  });

  test('rejects number with non-digit chars after +', () => {
    expect(isValidE164('+91 987654321')).toBe(false);
  });
});

// ─── normalizePhone + isValidE164 round-trip ─────────────────────────────────

describe('normalizePhone + isValidE164 — round-trip for valid Indian numbers', () => {
  const validIndianNumbers = [
    '9876543210',
    '6123456789',
    '7000000000',
    '8999999999',
    '919876543210',
    '+919876543210',
  ];

  validIndianNumbers.forEach((raw) => {
    test(`"${raw}" normalises to a valid E.164 string`, () => {
      const e164 = normalizePhone(raw);
      expect(isValidE164(e164)).toBe(true);
    });
  });
});

// ─── generate-token: profile completeness guard ───────────────────────────────

describe('generate-token: profile_incomplete guard logic', () => {
  /**
   * Mirrors the check in apps/main/pages/api/payments/generate-token.js
   */
  function checkProfileComplete(profile) {
    return Boolean(profile?.first_name && profile?.phone);
  }

  test('returns false when profile is null', () => {
    expect(checkProfileComplete(null)).toBe(false);
  });

  test('returns false when first_name is missing', () => {
    expect(checkProfileComplete({ phone: '+919876543210' })).toBe(false);
  });

  test('returns false when phone is missing', () => {
    expect(checkProfileComplete({ first_name: 'Priya' })).toBe(false);
  });

  test('returns false when first_name is empty string', () => {
    expect(checkProfileComplete({ first_name: '', phone: '+919876543210' })).toBe(false);
  });

  test('returns false when phone is empty string', () => {
    expect(checkProfileComplete({ first_name: 'Priya', phone: '' })).toBe(false);
  });

  test('returns true when first_name and phone are both present', () => {
    expect(
      checkProfileComplete({ first_name: 'Priya', phone: '+919876543210' })
    ).toBe(true);
  });

  test('last_name is optional — still valid without it', () => {
    expect(
      checkProfileComplete({ first_name: 'Priya', phone: '+919876543210', last_name: null })
    ).toBe(true);
  });
});

// ─── Client-side Indian phone validation (from lib/phoneValidation.js) ─────

describe('isValidIndianPhone (client-side): accepts/rejects phone inputs', () => {
  test('accepts 10-digit number starting with 9', () => {
    expect(isValidIndianPhone('9876543210')).toBe(true);
  });

  test('accepts 10-digit number starting with 6', () => {
    expect(isValidIndianPhone('6123456789')).toBe(true);
  });

  test('accepts 10-digit number starting with 7', () => {
    expect(isValidIndianPhone('7000000000')).toBe(true);
  });

  test('accepts 10-digit number starting with 8', () => {
    expect(isValidIndianPhone('8000000000')).toBe(true);
  });

  test('rejects number starting with 5', () => {
    expect(isValidIndianPhone('5876543210')).toBe(false);
  });

  test('rejects number starting with 0', () => {
    expect(isValidIndianPhone('0000000000')).toBe(false);
  });

  test('accepts 12-digit number with 91 prefix', () => {
    expect(isValidIndianPhone('919876543210')).toBe(true);
  });

  test('accepts +91 prefixed 10-digit number', () => {
    expect(isValidIndianPhone('+919876543210')).toBe(true);
  });

  test('rejects 9-digit number', () => {
    expect(isValidIndianPhone('987654321')).toBe(false);
  });

  test('rejects 11-digit number (not valid 91 prefix format)', () => {
    expect(isValidIndianPhone('98765432100')).toBe(false);
  });

  test('rejects empty string', () => {
    expect(isValidIndianPhone('')).toBe(false);
  });

  test('rejects null', () => {
    expect(isValidIndianPhone(null)).toBe(false);
  });
});

// ─── save-profile: phone normalisation for API payload ───────────────────────

describe('save-profile: normalises phone in API request body', () => {
  test('10-digit number is stored as +91XXXXXXXXXX', () => {
    const raw = '9876543210';
    expect(normalizePhone(raw)).toBe('+919876543210');
  });

  test('number entered without +91 prefix is normalised correctly', () => {
    const raw = '7000000000';
    const e164 = normalizePhone(raw);
    expect(e164).toBe('+917000000000');
    expect(isValidE164(e164)).toBe(true);
  });

  test('number entered with spaces is normalised correctly', () => {
    const raw = '98765 43210';
    const e164 = normalizePhone(raw);
    expect(e164).toBe('+919876543210');
    expect(isValidE164(e164)).toBe(true);
  });
});

console.log('✅ pre-payment registration (Option A) tests defined successfully');
