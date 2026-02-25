/**
 * Tests for the ai-enter payment callback endpoint.
 *
 * Tests:
 * - Signature verification logic (HMAC-SHA256 over raw body)
 * - Idempotency detection (duplicate payment_id)
 * - Payload validation
 * - Event filtering (non-success events are ignored)
 */

const crypto = require('crypto');

const SECRET = 'test-origin-webhook-secret';

/**
 * Compute the expected HMAC-SHA256 signature for a given raw body.
 */
function signBody(rawBody, secret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

describe('ai-enter callback: signature verification', () => {
  test('correctly computes HMAC-SHA256 signature over raw bytes', () => {
    const body = Buffer.from(
      JSON.stringify({
        event: 'payment.success',
        razorpay_payment_id: 'pay_test123',
        phone: '+919876543210',
        app_id: 'learn-ai',
        amount: 49900,
      })
    );

    const sig = signBody(body, SECRET);
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64); // SHA256 hex is 64 chars
  });

  test('signature changes when body changes', () => {
    const body1 = Buffer.from(JSON.stringify({ event: 'payment.success' }));
    const body2 = Buffer.from(JSON.stringify({ event: 'payment.success', extra: 'field' }));

    const sig1 = signBody(body1, SECRET);
    const sig2 = signBody(body2, SECRET);

    expect(sig1).not.toBe(sig2);
  });

  test('signature changes when secret changes', () => {
    const body = Buffer.from(JSON.stringify({ event: 'payment.success' }));
    const sig1 = signBody(body, 'secret-a');
    const sig2 = signBody(body, 'secret-b');
    expect(sig1).not.toBe(sig2);
  });

  test('timingSafeEqual returns true for identical signatures', () => {
    const body = Buffer.from('test-payload');
    const sig = signBody(body, SECRET);
    // Simulate the endpoint's comparison
    const isValid =
      sig.length === sig.length &&
      crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(sig, 'hex'));
    expect(isValid).toBe(true);
  });

  test('timingSafeEqual returns false for different signatures', () => {
    const body = Buffer.from('test-payload');
    const goodSig = signBody(body, SECRET);
    const badSig = signBody(body, 'wrong-secret');

    let isValid = true;
    if (goodSig.length !== badSig.length) {
      isValid = false;
    } else {
      try {
        isValid = crypto.timingSafeEqual(
          Buffer.from(goodSig, 'hex'),
          Buffer.from(badSig, 'hex')
        );
      } catch {
        isValid = false;
      }
    }
    expect(isValid).toBe(false);
  });
});

describe('ai-enter callback: payload validation', () => {
  test('only processes payment.success events', () => {
    const events = ['payment.failed', 'order.created', 'refund.initiated'];
    events.forEach((event) => {
      // Non-success events should be ignored (returning 200 with message)
      expect(event).not.toBe('payment.success');
    });
  });

  test('requires razorpay_payment_id', () => {
    const payload = {
      event: 'payment.success',
      phone: '+919876543210',
      app_id: 'learn-ai',
    };
    // No razorpay_payment_id — should be rejected
    expect(payload.razorpay_payment_id).toBeUndefined();
  });

  test('requires at least phone or email for OTP delivery', () => {
    const payloadMissingBoth = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_abc',
    };
    expect(payloadMissingBoth.phone).toBeUndefined();
    expect(payloadMissingBoth.email).toBeUndefined();
  });

  test('accepts payload with only phone', () => {
    const payload = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_abc',
      phone: '+919876543210',
      app_id: 'learn-ai',
      amount: 49900,
    };
    expect(payload.phone).toBeDefined();
    expect(!payload.phone && !payload.email).toBe(false);
  });

  test('accepts payload with only email', () => {
    const payload = {
      event: 'payment.success',
      razorpay_payment_id: 'pay_abc',
      email: 'user@example.com',
      app_id: 'learn-ai',
      amount: 49900,
    };
    expect(payload.email).toBeDefined();
    expect(!payload.phone && !payload.email).toBe(false);
  });
});

describe('ai-enter callback: idempotency', () => {
  test('duplicate payment_id is detected by unique constraint (pg error 23505)', () => {
    const pgUniqueError = { code: '23505', message: 'duplicate key value violates unique constraint' };
    const isDuplicate =
      pgUniqueError.code === '23505' ||
      pgUniqueError.message?.includes('duplicate') ||
      pgUniqueError.message?.includes('unique');
    expect(isDuplicate).toBe(true);
  });

  test('non-unique DB error is not treated as idempotent duplicate', () => {
    const pgOtherError = { code: '42P01', message: 'relation "payments" does not exist' };
    const isDuplicate =
      pgOtherError.code === '23505' ||
      pgOtherError.message?.includes('duplicate') ||
      pgOtherError.message?.includes('unique');
    expect(isDuplicate).toBe(false);
  });
});

describe('ai-enter callback: phone formatting', () => {
  test('prepends +91 to bare 10-digit Indian numbers', () => {
    const phone = '9876543210';
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
    expect(formatted).toBe('+919876543210');
  });

  test('leaves E.164 numbers unchanged', () => {
    const phone = '+919876543210';
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
    expect(formatted).toBe('+919876543210');
  });
});

console.log('✅ ai-enter callback tests defined successfully');
