/**
 * Jest configuration for Cricket Universe MVP
 * 
 * Note: For a complete production setup, install babel-jest and configure Babel.
 * For MVP, we're using a simple node environment setup.
 */

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'components/**/*.js',
    'pages/api/**/*.js',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  // Transform ES modules for tests
  transform: {
    '^.+\\.js$': ['babel-jest', { configFile: './babel.config.test.js' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(some-esm-package)/)'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000
};
