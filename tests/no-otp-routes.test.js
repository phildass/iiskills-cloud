/**
 * No OTP Routes Test
 *
 * Verifies that all OTP-related API routes and UI pages have been removed.
 * OTP-based authentication has been discontinued; all auth uses standard
 * Supabase sign-in (magic link / password / Google OAuth).
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

function grepAppCode(pattern) {
  try {
    const result = execSync(
      `grep -r --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" -l "${pattern}" "${path.join(ROOT, "apps")}" "${path.join(ROOT, "lib")}" "${path.join(ROOT, "components")}" 2>/dev/null`,
      { encoding: "utf8" }
    );
    return result.trim();
  } catch {
    return "";
  }
}

describe("No OTP Routes", () => {
  describe("OTP API route files do not exist", () => {
    const otpRoutes = [
      "apps/learn-ai/pages/api/send-otp.js",
      "apps/learn-developer/pages/api/send-otp.js",
      "apps/learn-management/pages/api/send-otp.js",
      "apps/learn-pr/pages/api/send-otp.js",
      "apps/learn-pr/pages/api/otp/verify.js",
      "apps/main/pages/api/verify-otp.js",
      "apps/main/pages/api/admin/generate-otp.js",
    ];

    otpRoutes.forEach((route) => {
      test(`${route} does not exist`, () => {
        expect(fileExists(route)).toBe(false);
      });
    });
  });

  describe("OTP admin pages do not exist", () => {
    const otpAdminPages = ["apps/main/pages/admin/otp.js", "apps/main/pages/admin/free-otp.js"];

    otpAdminPages.forEach((page) => {
      test(`${page} does not exist`, () => {
        expect(fileExists(page)).toBe(false);
      });
    });
  });

  describe("OTP service file does not exist", () => {
    test("lib/otpService.js does not exist", () => {
      expect(fileExists("lib/otpService.js")).toBe(false);
    });
  });

  describe("No imports of otpService in application code", () => {
    test("no app file imports from @lib/otpService", () => {
      const matches = grepAppCode("from.*otpService");
      expect(matches).toBe("");
    });

    test("no app file requires otpService", () => {
      const matches = grepAppCode("require.*otpService");
      expect(matches).toBe("");
    });
  });

  describe("No active OTP dispatch calls in application code", () => {
    test("no generateAndDispatchOTP call in app files", () => {
      const matches = grepAppCode("generateAndDispatchOTP");
      expect(matches).toBe("");
    });

    test("no verifyOTP call in app files", () => {
      const matches = grepAppCode("verifyOTP");
      expect(matches).toBe("");
    });

    test("no writes to the otps DB table in app files", () => {
      const matches = grepAppCode('from.*"otps"');
      expect(matches).toBe("");
    });
  });
});
