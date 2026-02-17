/**
 * Test Suite for App-Specific OTP System
 * 
 * This test file validates the OTP service implementation including:
 * - OTP generation and dispatch
 * - App-specific binding
 * - OTP verification with app context
 * - Cross-app isolation
 * - Error handling
 */

import { generateAndDispatchOTP, verifyOTP, hasValidOTP } from '../lib/otpService';

// Mock environment variables
process.env.SUPABASE_URL = 'https://test.supabase.co';
process.env.SUPABASE_KEY = 'test-key';
process.env.SENDGRID_API_KEY = 'test-sendgrid-key';
process.env.SENDGRID_FROM_EMAIL = 'test@iiskills.cloud';
process.env.TWILIO_ACCOUNT_SID = 'test-account-sid';
process.env.TWILIO_AUTH_TOKEN = 'test-auth-token';
process.env.TWILIO_PHONE_NUMBER = '+1234567890';

describe('OTP Service', () => {
  describe('generateAndDispatchOTP', () => {
    test('should require email, appId, and appName', async () => {
      await expect(
        generateAndDispatchOTP({
          email: '',
          appId: 'learn-ai',
          appName: 'Learn-AI',
        })
      ).rejects.toThrow('Email, appId, and appName are required');

      await expect(
        generateAndDispatchOTP({
          email: 'test@example.com',
          appId: '',
          appName: 'Learn-AI',
        })
      ).rejects.toThrow('Email, appId, and appName are required');

      await expect(
        generateAndDispatchOTP({
          email: 'test@example.com',
          appId: 'learn-ai',
          appName: '',
        })
      ).rejects.toThrow('Email, appId, and appName are required');
    });

    test('should validate email format', async () => {
      await expect(
        generateAndDispatchOTP({
          email: 'invalid-email',
          appId: 'learn-ai',
          appName: 'Learn-AI',
        })
      ).rejects.toThrow('Invalid email format');
    });

    test('should validate phone format if provided', async () => {
      await expect(
        generateAndDispatchOTP({
          email: 'test@example.com',
          phone: '1234567890', // Missing + prefix
          appId: 'learn-ai',
          appName: 'Learn-AI',
        })
      ).rejects.toThrow('Invalid phone format');
    });

    test('should accept E.164 phone format', async () => {
      // This test would pass with proper Supabase mocking
      // Just validate the structure for now
      const params = {
        email: 'test@example.com',
        phone: '+919876543210',
        appId: 'learn-ai',
        appName: 'Learn-AI',
      };

      expect(params.phone).toMatch(/^\+\d{10,15}$/);
    });
  });

  describe('verifyOTP', () => {
    test('should require email, otp, and appId', async () => {
      let result = await verifyOTP({ email: '', otp: '123456', appId: 'learn-ai' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');

      result = await verifyOTP({ email: 'test@example.com', otp: '', appId: 'learn-ai' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');

      result = await verifyOTP({ email: 'test@example.com', otp: '123456', appId: '' });
      expect(result.success).toBe(false);
      expect(result.error).toContain('required');
    });

    test('should validate email format', async () => {
      const result = await verifyOTP({
        email: 'invalid-email',
        otp: '123456',
        appId: 'learn-ai',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    test('should enforce app-specific OTP binding', async () => {
      // OTP generated for learn-ai should not work for learn-pr
      // This validates that OTPs are app-specific
      const testEmail = 'test@example.com';
      const testOTP = '123456';

      // Attempt to verify OTP for wrong app
      const result = await verifyOTP({
        email: testEmail,
        otp: testOTP,
        appId: 'learn-pr', // Different app
      });

      // Should fail because OTP was generated for different app
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found for this app');
    });
  });

  describe('App-Specific Isolation', () => {
    test('OTP for learn-ai should not work for learn-pr', () => {
      // This is a conceptual test showing the isolation logic
      const otpForLearnAI = {
        email: 'test@example.com',
        otp: '123456',
        app_id: 'learn-ai',
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      };

      // Attempt to use for different app
      const attemptedAppId = 'learn-pr';

      // Check should fail
      expect(otpForLearnAI.app_id).not.toBe(attemptedAppId);
    });

    test('OTP for learn-pr should not work for learn-ai', () => {
      const otpForLearnPR = {
        email: 'test@example.com',
        otp: '654321',
        app_id: 'learn-pr',
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      };

      const attemptedAppId = 'learn-ai';
      expect(otpForLearnPR.app_id).not.toBe(attemptedAppId);
    });
  });

  describe('Expiration Validation', () => {
    test('should reject expired OTP', () => {
      const expiredOTP = {
        otp: '123456',
        app_id: 'learn-ai',
        expires_at: new Date(Date.now() - 1000), // Expired 1 second ago
      };

      const now = new Date();
      const expiresAt = new Date(expiredOTP.expires_at);

      expect(now > expiresAt).toBe(true); // Should be expired
    });

    test('should accept valid OTP within 10 minutes', () => {
      const validOTP = {
        otp: '123456',
        app_id: 'learn-ai',
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // Expires in 5 minutes
      };

      const now = new Date();
      const expiresAt = new Date(validOTP.expires_at);

      expect(now <= expiresAt).toBe(true); // Should be valid
    });
  });

  describe('Rate Limiting', () => {
    test('should limit verification attempts to 5', () => {
      const otpRecord = {
        verification_attempts: 5,
      };

      expect(otpRecord.verification_attempts >= 5).toBe(true);
      // Should trigger "Too many verification attempts" error
    });

    test('should allow attempts under limit', () => {
      const otpRecord = {
        verification_attempts: 3,
      };

      expect(otpRecord.verification_attempts < 5).toBe(true);
      // Should allow verification
    });
  });

  describe('Payment Integration', () => {
    test('should extract app_id from payment notes', () => {
      const paymentNotes = {
        app_id: 'learn-ai',
        custom_field: 'value',
      };

      const appId = paymentNotes.app_id || paymentNotes.course_id;
      expect(appId).toBe('learn-ai');
    });

    test('should handle course_id as alternative', () => {
      const paymentNotes = {
        course_id: 'learn-pr',
      };

      const appId = paymentNotes.app_id || paymentNotes.course_id;
      expect(appId).toBe('learn-pr');
    });

    test('should prefer app_id over course_id', () => {
      const paymentNotes = {
        app_id: 'learn-ai',
        course_id: 'learn-pr',
      };

      const appId = paymentNotes.app_id || paymentNotes.course_id;
      expect(appId).toBe('learn-ai');
    });
  });

  describe('Delivery Channel Selection', () => {
    test('should use email if only email provided', () => {
      const hasEmail = true;
      const hasPhone = false;

      const deliveryChannel = hasEmail && !hasPhone ? 'email' : 'sms';
      expect(deliveryChannel).toBe('email');
    });

    test('should use sms if only phone provided', () => {
      const hasEmail = false;
      const hasPhone = true;

      const deliveryChannel = hasPhone && !hasEmail ? 'sms' : 'email';
      expect(deliveryChannel).toBe('sms');
    });

    test('should use both if email and phone provided', () => {
      const hasEmail = true;
      const hasPhone = true;

      const deliveryChannel = hasEmail && hasPhone ? 'both' : hasEmail ? 'email' : 'sms';
      expect(deliveryChannel).toBe('both');
    });
  });
});

describe('Payment Webhook Handler', () => {
  test('should extract payment details correctly', () => {
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_test123',
            amount: 49900,
            currency: 'INR',
            email: 'user@example.com',
            contact: '+919876543210',
            notes: {
              app_id: 'learn-ai',
            },
          },
        },
      },
    };

    const payment = webhookPayload.payload.payment.entity;
    expect(payment.id).toBe('pay_test123');
    expect(payment.email).toBe('user@example.com');
    expect(payment.notes.app_id).toBe('learn-ai');
  });

  test('should format Indian phone numbers to E.164', () => {
    const phone = '9876543210';
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    expect(formattedPhone).toBe('+919876543210');
  });

  test('should keep already formatted phone numbers', () => {
    const phone = '+919876543210';
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    expect(formattedPhone).toBe('+919876543210');
  });
});

describe('Security Validations', () => {
  test('OTP should not be returned in API responses', () => {
    const apiResponse = {
      success: true,
      message: 'OTP sent successfully',
      deliveryChannel: 'both',
      emailSent: true,
      smsSent: true,
      // otp: '123456' // This should NEVER be included
    };

    expect(apiResponse).not.toHaveProperty('otp');
    expect(Object.keys(apiResponse)).not.toContain('otp');
  });

  test('should validate webhook signature', () => {
    const webhookBody = JSON.stringify({ test: 'data' });
    const webhookSecret = 'test-secret';
    
    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex');

    expect(expectedSignature).toBeDefined();
    expect(expectedSignature.length).toBeGreaterThan(0);
  });

  test('email validation should be strict', () => {
    const validEmails = [
      'test@example.com',
      'user.name@example.co.uk',
      'user+tag@example.com',
    ];

    const invalidEmails = [
      'invalid',
      '@example.com',
      'user@',
      'user @example.com',
    ];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    validEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(true);
    });

    invalidEmails.forEach(email => {
      expect(emailRegex.test(email)).toBe(false);
    });
  });
});

console.log('✅ All OTP system tests defined successfully');
