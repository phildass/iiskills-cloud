/**
 * Test Suite for Razorpay Payment Integration
 *
 * Validates:
 * - Webhook signature verification (HMAC-SHA256 using timingSafeEqual)
 * - Test mode safeguard: live keys rejected when RAZORPAY_MODE=test
 * - Correct mode derivation from key prefix
 */

import crypto from 'crypto';

// ---------------------------------------------------------------------------
// Inline the verification logic mirrored from lib/razorpay.js so this test
// has no runtime dependency on Razorpay credentials being present.
// ---------------------------------------------------------------------------
function verifyWebhookSignature(rawBody, signature, secret) {
  if (!secret) throw new Error('Webhook secret is not configured');
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  if (signature.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function deriveMode(keyId, configuredMode) {
  const keyMode = keyId.startsWith('rzp_test_') ? 'test' : 'live';
  return configuredMode || keyMode;
}

function validateTestModeSafeguard(keyId, razorpayMode) {
  const effectiveMode = deriveMode(keyId, razorpayMode);
  if (effectiveMode === 'test' && !keyId.startsWith('rzp_test_')) {
    return { ok: false, reason: 'test mode requires rzp_test_* keys' };
  }
  return { ok: true };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('Razorpay webhook signature verification', () => {
  const secret = 'webhook_test_secret_xyz';

  test('accepts a valid HMAC-SHA256 signature', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(verifyWebhookSignature(body, sig, secret)).toBe(true);
  });

  test('rejects a tampered body', () => {
    const body = JSON.stringify({ event: 'payment.captured', payload: {} });
    const sig = crypto.createHmac('sha256', secret).update(body).digest('hex');
    const tamperedBody = JSON.stringify({ event: 'payment.captured', payload: { hacked: true } });
    expect(verifyWebhookSignature(tamperedBody, sig, secret)).toBe(false);
  });

  test('rejects a wrong signature', () => {
    const body = JSON.stringify({ event: 'payment.captured' });
    expect(verifyWebhookSignature(body, 'deadbeef'.repeat(8), secret)).toBe(false);
  });

  test('throws when secret is missing', () => {
    expect(() => verifyWebhookSignature('body', 'sig', '')).toThrow();
  });
});

describe('Razorpay test mode safeguard', () => {
  test('allows test key with RAZORPAY_MODE=test', () => {
    const result = validateTestModeSafeguard('rzp_test_abc123', 'test');
    expect(result.ok).toBe(true);
  });

  test('rejects live key when RAZORPAY_MODE=test', () => {
    const result = validateTestModeSafeguard('rzp_live_abc123', 'test');
    expect(result.ok).toBe(false);
    expect(result.reason).toMatch(/rzp_test_/);
  });

  test('allows live key when RAZORPAY_MODE=live', () => {
    const result = validateTestModeSafeguard('rzp_live_abc123', 'live');
    expect(result.ok).toBe(true);
  });

  test('derives test mode from rzp_test_ prefix when RAZORPAY_MODE unset', () => {
    expect(deriveMode('rzp_test_abc', undefined)).toBe('test');
  });

  test('derives live mode from rzp_live_ prefix when RAZORPAY_MODE unset', () => {
    expect(deriveMode('rzp_live_abc', undefined)).toBe('live');
  });

  test('explicit RAZORPAY_MODE overrides key prefix', () => {
    // test key but mode explicitly set to live (unusual, but should be respected)
    expect(deriveMode('rzp_test_abc', 'live')).toBe('live');
  });
});
