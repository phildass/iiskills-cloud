// tests/e2e/fixtures/test-users.js

/**
 * Test user fixtures for E2E tests
 * 
 * These users should be pre-created in the test database
 * or created as part of test setup.
 */

module.exports = {
  // Regular user with no special permissions
  regularUser: {
    email: 'test-user@iiskills.test',
    password: 'TestPassword123!',
    name: 'Test User',
  },
  
  // User with paid course access
  premiumUser: {
    email: 'premium-user@iiskills.test',
    password: 'TestPassword123!',
    name: 'Premium User',
    hasAccess: ['learn-ai', 'learn-developer'],
  },
  
  // Admin user
  adminUser: {
    email: 'admin@iiskills.test',
    password: 'AdminPassword123!',
    name: 'Admin User',
    role: 'admin',
  },
  
  // User for testing registration flow
  newUser: {
    email: `test-${Date.now()}@iiskills.test`,
    password: 'NewUserPassword123!',
    name: 'New Test User',
  },
};
