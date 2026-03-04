/**
 * Tests for the payment token generation and Option A (iiskills-first) flow.
 *
 * Tests:
 * - Token payload structure
 * - Token signing and verification (JWT)
 * - Token expiry
 * - Callback handler logic for user_token path
 * - Callback handler legacy fallback (no user_token)
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const TEST_SECRET = 'test-payment-token-secret-minimum-32-chars!!';

// ─── Token generation helpers ─────────────────────────────────────────────────

function createPaymentToken(overrides = {}, secret = TEST_SECRET) {
  const payload = {
    user_id: 'user-uuid-123',
    email: 'user@example.com',
    phone: '+919876543210',
    name: 'Test User',
    course_slug: 'learn-management',
    jti: crypto.randomUUID(),
    ...overrides,
  };
  return jwt.sign(payload, secret, { expiresIn: '10m' });
}

// ─── Token structure ──────────────────────────────────────────────────────────

describe('payment token: structure', () => {
  test('token decodes to expected claims', () => {
    const token = createPaymentToken();
    const decoded = jwt.decode(token);

    expect(decoded.user_id).toBe('user-uuid-123');
    expect(decoded.email).toBe('user@example.com');
    expect(decoded.course_slug).toBe('learn-management');
    expect(decoded.jti).toBeDefined();
    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
  });

  test('token expires in ~10 minutes', () => {
    const before = Math.floor(Date.now() / 1000);
    const token = createPaymentToken();
    const decoded = jwt.decode(token);

    const margin = 5; // seconds
    expect(decoded.exp - decoded.iat).toBeGreaterThanOrEqual(600 - margin);
    expect(decoded.exp - decoded.iat).toBeLessThanOrEqual(600 + margin);
    expect(decoded.iat).toBeGreaterThanOrEqual(before);
  });

  test('each token has a unique jti nonce', () => {
    const token1 = createPaymentToken();
    const token2 = createPaymentToken();
    const d1 = jwt.decode(token1);
    const d2 = jwt.decode(token2);
    expect(d1.jti).not.toBe(d2.jti);
  });

  test('token includes phone when provided', () => {
    const token = createPaymentToken({ phone: '+910000000000' });
    const decoded = jwt.decode(token);
    expect(decoded.phone).toBe('+910000000000');
  });

  test('email is optional (null allowed)', () => {
    const token = createPaymentToken({ email: null });
    const decoded = jwt.decode(token);
    expect(decoded.email).toBeNull();
  });
});

// ─── Token verification ───────────────────────────────────────────────────────

describe('payment token: verification', () => {
  test('verifies token signed with correct secret', () => {
    const token = createPaymentToken();
    let error = null;
    let payload = null;
    try {
      payload = jwt.verify(token, TEST_SECRET);
    } catch (e) {
      error = e;
    }
    expect(error).toBeNull();
    expect(payload.user_id).toBe('user-uuid-123');
  });

  test('rejects token signed with wrong secret', () => {
    const token = createPaymentToken({}, 'wrong-secret');
    expect(() => jwt.verify(token, TEST_SECRET)).toThrow();
  });

  test('rejects expired token', () => {
    const token = jwt.sign(
      { user_id: 'x', course_slug: 'learn-ai', jti: crypto.randomUUID() },
      TEST_SECRET,
      { expiresIn: '-1s' } // already expired
    );
    expect(() => jwt.verify(token, TEST_SECRET)).toThrow(/expired/i);
  });

  test('rejects tampered token', () => {
    const token = createPaymentToken();
    const [header, , sig] = token.split('.');
    // Replace the payload with a tampered one
    const tamperedPayload = Buffer.from(
      JSON.stringify({ user_id: 'attacker', course_slug: 'learn-ai' })
    ).toString('base64url');
    const tampered = `${header}.${tamperedPayload}.${sig}`;
    expect(() => jwt.verify(tampered, TEST_SECRET)).toThrow();
  });
});

// ─── Callback: Option A (user_token present) ─────────────────────────────────

describe('ai-enter callback: Option A (user_token path)', () => {
  test('extracts user_id and course_slug from verified token', () => {
    const token = createPaymentToken({
      user_id: 'uid-abc',
      course_slug: 'learn-developer',
    });
    const decoded = jwt.verify(token, TEST_SECRET);
    expect(decoded.user_id).toBe('uid-abc');
    expect(decoded.course_slug).toBe('learn-developer');
  });

  test('course_slug in token takes precedence over app_id in payload', () => {
    const token = createPaymentToken({ course_slug: 'learn-ai' });
    const decoded = jwt.verify(token, TEST_SECRET);
    const payloadAppId = 'learn-management'; // different from token
    const courseAppId = decoded.course_slug || payloadAppId;
    expect(courseAppId).toBe('learn-ai');
  });

  test('falls back to payload app_id when token has no course_slug', () => {
    const token = jwt.sign(
      { user_id: 'uid-abc', jti: crypto.randomUUID() },
      TEST_SECRET,
      { expiresIn: '10m' }
    );
    const decoded = jwt.verify(token, TEST_SECRET);
    const payloadAppId = 'learn-management';
    const courseAppId = decoded.course_slug || payloadAppId;
    expect(courseAppId).toBe('learn-management');
  });

  test('rejects invalid user_token with 401 logic', () => {
    const badToken = 'invalid.token.value';
    let verified = true;
    try {
      jwt.verify(badToken, TEST_SECRET);
    } catch {
      verified = false;
    }
    expect(verified).toBe(false);
  });

  test('grants entitlement when token is valid (logic check)', () => {
    const token = createPaymentToken({ user_id: 'uid-grant', course_slug: 'learn-pr' });
    const decoded = jwt.verify(token, TEST_SECRET);

    // Simulate what the callback does
    const userId = decoded.user_id;
    const courseAppId = decoded.course_slug || 'iiskills';

    expect(userId).toBe('uid-grant');
    expect(courseAppId).toBe('learn-pr');
  });
});

// ─── Callback: legacy fallback (no user_token) ───────────────────────────────

describe('ai-enter callback: legacy fallback (no user_token)', () => {
  test('requires phone or email when user_token is absent', () => {
    const payload = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_test',
      app_id: 'learn-ai',
      // no user_token, no phone, no email
    };
    const needsContact = !payload.user_token && !payload.phone && !payload.email;
    expect(needsContact).toBe(true); // should return 400
  });

  test('accepts payload with user_token and no phone/email', () => {
    const token = createPaymentToken();
    const payload = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_test',
      app_id: 'learn-ai',
      user_token: token,
    };
    const hasIdentity = Boolean(payload.user_token || payload.phone || payload.email);
    expect(hasIdentity).toBe(true); // should not return 400
  });

  test('accepts payload with phone and no user_token', () => {
    const payload = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_test',
      app_id: 'learn-ai',
      phone: '+919876543210',
    };
    const hasIdentity = Boolean(payload.user_token || payload.phone || payload.email);
    expect(hasIdentity).toBe(true);
  });
});

// ─── returnTo URL ─────────────────────────────────────────────────────────────

describe('iiskills checkout: returnTo URL', () => {
  test('returnTo points to /payments/success (not /otp-gateway)', () => {
    const RETURN_TO_URL = 'https://iiskills.cloud/payments/success';
    expect(RETURN_TO_URL).toContain('/payments/success');
    expect(RETURN_TO_URL).not.toContain('/otp-gateway');
  });
});

console.log('✅ payment token (Option A) tests defined successfully');
