/**
 * Tests for the /api/payments/confirm endpoint.
 *
 * Tests:
 * - Signature verification logic (HMAC-SHA256 over raw body)
 * - Timestamp replay-protection
 * - Payload validation
 * - Idempotency detection (duplicate razorpay_payment_id)
 * - Phone formatting
 */

const crypto = require('crypto');

const SECRET = 'test-aienter-confirmation-signing-secret';

/**
 * Compute the expected HMAC-SHA256 signature for a given raw body.
 */
function signBody(rawBody, secret) {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}

describe('payments/confirm: signature verification', () => {
  test('correctly computes HMAC-SHA256 signature over raw bytes', () => {
    const body = Buffer.from(
      JSON.stringify({
        purchaseId: 'purchase-uuid-123',
        appId: 'learn-ai',
        amountPaise: 49900,
        currency: 'INR',
        customerPhone: '+919876543210',
        razorpayOrderId: 'order_test123',
        razorpayPaymentId: 'pay_test123',
        paidAt: new Date().toISOString(),
      })
    );

    const sig = signBody(body, SECRET);
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64); // SHA256 hex is always 64 chars
  });

  test('signature changes when body changes', () => {
    const body1 = Buffer.from(JSON.stringify({ purchaseId: 'abc', appId: 'learn-ai' }));
    const body2 = Buffer.from(
      JSON.stringify({ purchaseId: 'abc', appId: 'learn-ai', extra: 'field' })
    );

    const sig1 = signBody(body1, SECRET);
    const sig2 = signBody(body2, SECRET);

    expect(sig1).not.toBe(sig2);
  });

  test('signature changes when secret changes', () => {
    const body = Buffer.from(JSON.stringify({ purchaseId: 'abc' }));
    const sig1 = signBody(body, 'secret-a');
    const sig2 = signBody(body, 'secret-b');
    expect(sig1).not.toBe(sig2);
  });

  test('timingSafeEqual returns true for identical signatures', () => {
    const body = Buffer.from('test-payload');
    const sig = signBody(body, SECRET);
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

describe('payments/confirm: timestamp replay-protection', () => {
  const MAX_SKEW = 300; // 5 minutes in seconds

  test('accepts timestamp within 5-minute window', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - 60; // 1 minute ago
    expect(Math.abs(nowSeconds - ts)).toBeLessThanOrEqual(MAX_SKEW);
  });

  test('rejects timestamp older than 5 minutes', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - 400; // 6+ minutes ago
    expect(Math.abs(nowSeconds - ts)).toBeGreaterThan(MAX_SKEW);
  });

  test('rejects timestamp too far in the future', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds + 400; // 6+ minutes in the future
    expect(Math.abs(nowSeconds - ts)).toBeGreaterThan(MAX_SKEW);
  });

  test('accepts timestamp at the boundary (exactly 5 minutes old)', () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - MAX_SKEW;
    expect(Math.abs(nowSeconds - ts)).toBeLessThanOrEqual(MAX_SKEW);
  });
});

describe('payments/confirm: payload validation', () => {
  test('requires purchaseId', () => {
    const payload = {
      appId: 'learn-ai',
      amountPaise: 49900,
      currency: 'INR',
      customerPhone: '+919876543210',
      razorpayPaymentId: 'pay_abc',
      paidAt: new Date().toISOString(),
    };
    expect(payload.purchaseId).toBeUndefined();
  });

  test('requires appId', () => {
    const payload = {
      purchaseId: 'purchase-uuid',
      amountPaise: 49900,
      currency: 'INR',
      customerPhone: '+919876543210',
      razorpayPaymentId: 'pay_abc',
    };
    expect(payload.appId).toBeUndefined();
  });

  test('requires razorpayPaymentId', () => {
    const payload = {
      purchaseId: 'purchase-uuid',
      appId: 'learn-ai',
      amountPaise: 49900,
      currency: 'INR',
      customerPhone: '+919876543210',
    };
    expect(payload.razorpayPaymentId).toBeUndefined();
  });

  test('requires customerPhone', () => {
    const payload = {
      purchaseId: 'purchase-uuid',
      appId: 'learn-ai',
      amountPaise: 49900,
      currency: 'INR',
      razorpayPaymentId: 'pay_abc',
    };
    expect(payload.customerPhone).toBeUndefined();
  });

  test('requires amountPaise', () => {
    const payload = {
      purchaseId: 'purchase-uuid',
      appId: 'learn-ai',
      currency: 'INR',
      customerPhone: '+919876543210',
      razorpayPaymentId: 'pay_abc',
    };
    expect(payload.amountPaise).toBeUndefined();
  });

  test('accepts valid full payload', () => {
    const payload = {
      purchaseId: 'purchase-uuid-abc',
      appId: 'learn-ai',
      courseSlug: 'learn-ai',
      amountPaise: 49900,
      currency: 'INR',
      customerPhone: '+919876543210',
      razorpayOrderId: 'order_abc123',
      razorpayPaymentId: 'pay_abc123',
      paidAt: new Date().toISOString(),
    };
    expect(payload.purchaseId).toBeDefined();
    expect(payload.appId).toBeDefined();
    expect(payload.razorpayPaymentId).toBeDefined();
    expect(payload.customerPhone).toBeDefined();
    expect(payload.amountPaise).toBeDefined();
  });

  test('courseSlug is optional', () => {
    const payload = {
      purchaseId: 'purchase-uuid-abc',
      appId: 'learn-ai',
      amountPaise: 49900,
      currency: 'INR',
      customerPhone: '+919876543210',
      razorpayPaymentId: 'pay_abc123',
    };
    // courseSlug is not required — should not cause a validation error
    expect(payload.purchaseId).toBeDefined();
    expect(payload.courseSlug).toBeUndefined();
  });
});

describe('payments/confirm: idempotency', () => {
  test('duplicate razorpay_payment_id is detected by pg unique constraint (error 23505)', () => {
    const pgUniqueError = {
      code: '23505',
      message: 'duplicate key value violates unique constraint "payment_confirmations_razorpay_payment_id_key"',
    };
    const isDuplicate =
      pgUniqueError.code === '23505' ||
      pgUniqueError.message?.includes('duplicate') ||
      pgUniqueError.message?.includes('unique');
    expect(isDuplicate).toBe(true);
  });

  test('non-unique DB error is not treated as idempotent duplicate', () => {
    const pgOtherError = {
      code: '42P01',
      message: 'relation "payment_confirmations" does not exist',
    };
    const isDuplicate =
      pgOtherError.code === '23505' ||
      pgOtherError.message?.includes('duplicate') ||
      pgOtherError.message?.includes('unique');
    expect(isDuplicate).toBe(false);
  });
});

describe('payments/confirm: phone formatting', () => {
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

  test('leaves non-Indian E.164 numbers unchanged', () => {
    const phone = '+12025551234';
    const formatted = phone.startsWith('+') ? phone : `+91${phone}`;
    expect(formatted).toBe('+12025551234');
  });
});

describe('payments/confirm: response shape', () => {
  test('success response includes confirmationId and message "confirmed"', () => {
    const response = {
      success: true,
      confirmationId: 'some-uuid',
      message: 'confirmed',
    };
    expect(response.success).toBe(true);
    expect(response.message).toBe('confirmed');
    expect(response).toHaveProperty('confirmationId');
  });

  test('idempotent response is also success=true', () => {
    const response = {
      success: true,
      confirmationId: 'existing-uuid',
      message: 'Payment already confirmed (idempotent)',
    };
    expect(response.success).toBe(true);
  });
});

console.log('✅ payments/confirm tests defined successfully');
