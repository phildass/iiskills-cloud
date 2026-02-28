/**
 * Jest setup file
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.ADMIN_SETUP_MODE = 'false'; // Default to false for tests
process.env.TEMP_SUSPEND_AUTH = 'false'; // Default to false for tests

// Mock Supabase to avoid connection issues in tests
jest.mock('@supabase/supabase-js', () => {
  return {
    createClient: jest.fn().mockImplementation(() => ({
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        is: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(),
        lt: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        update: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    }))
  };
});

// Mock SendGrid to avoid API calls in tests
jest.mock('@sendgrid/mail', () => {
  return {
    setApiKey: jest.fn(),
    send: jest.fn().mockResolvedValue([{ statusCode: 202 }])
  };
});

// Mock Vonage SDK to avoid ES module issues
jest.mock('@vonage/server-sdk', () => {
  return {
    Vonage: jest.fn().mockImplementation(() => ({
      sms: {
        send: jest.fn().mockResolvedValue({ success: true })
      }
    }))
  };
});
