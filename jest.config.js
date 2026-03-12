/**
 * Jest configuration for Cricket Universe MVP
 *
 * Note: For a complete production setup, install babel-jest and configure Babel.
 * For MVP, we're using a simple node environment setup.
 */

module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "lib/**/*.js",
    "components/**/*.js",
    "pages/api/**/*.js",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    // Map TypeScript Supabase server-client files to a JS mock so that tests
    // importing JS modules (e.g. save-profile.js) don't fail trying to parse
    // TypeScript syntax.  The mock provides the same public API shape.
    "supabase/pagesServerClient(\\.ts)?$": "<rootDir>/tests/__mocks__/supabasePagesServerClient.js",
    "supabase/serverPagesClient(\\.ts)?$": "<rootDir>/tests/__mocks__/supabasePagesServerClient.js",
  },
  // Transform ES modules for tests
  transform: {
    "^.+\\.js$": ["babel-jest", { configFile: "./babel.config.test.js" }],
  },
  transformIgnorePatterns: ["node_modules/(?!(@vonage|node-fetch)/)"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testTimeout: 10000,
};
