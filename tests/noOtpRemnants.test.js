/**
 * No-OTP Remnants Test
 *
 * This test ensures that no OTP-related code exists in the repository.
 * OTP functionality has been permanently removed from the codebase.
 * This test acts as a CI guard to prevent OTP code from being re-introduced.
 *
 * ALLOWED references (NOT flagged by this guard):
 *   - jaibharat.cloud  — separate sister product; cross-references are legitimate
 *   - jaikisan.cloud   — separate sister product; cross-references are legitimate
 *   - aienter.in       — shared payment gateway used by all iiskills products
 *   - signInWithOtp    — Supabase magic-link auth; unrelated to the old Vonage OTP
 *   - grantedVia:"otp" — access-control enum value retained for historical DB rows
 *
 * Any line in a source file that references a known-external domain (jaibharat.cloud,
 * jaikisan.cloud) is exempt from content-pattern checks so that webhook helpers,
 * shared-gateway adapters, and similar integration code can coexist safely.
 */

/* eslint-env jest */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Patterns that must NOT appear in any tracked source file path
const BANNED_PATTERNS = [
  /pages\/api\/.*otp.*\.js$/i, // OTP API route files (e.g. pages/api/send-otp.js)
  /pages\/otp-gateway\.js$/i, // OTP gateway page
  /lib\/otpService\.js$/, // OTP service module
  /lib\/membershipEmail\.js$/, // OTP membership email module
];

// Strings that must NOT appear in source file content
const BANNED_CONTENT_PATTERNS = [
  { pattern: /generateAndDispatchOTP/, description: "generateAndDispatchOTP call" },
  { pattern: /verifyOTP\s*\(/, description: "verifyOTP call" },
  { pattern: /from ['"]@lib\/otpService['"]/, description: "import from @lib/otpService" },
  { pattern: /from ['"]\.\.\/.*otpService['"]/, description: "relative import of otpService" },
  { pattern: /require\(['"]@lib\/otpService['"]\)/, description: "require of otpService" },
  { pattern: /@vonage\/server-sdk/, description: "@vonage/server-sdk usage" },
  { pattern: /new Vonage\s*\(/, description: "Vonage client instantiation" },
  { pattern: /vonageClient\.sms\.send/, description: "Vonage SMS send call" },
  { pattern: /\.from\(['"]otps['"]\)/, description: "Supabase otps table access" },
  { pattern: /OTP_DISABLED/, description: "OTP_DISABLED env var reference" },
  { pattern: /OTP_SECRET/, description: "OTP_SECRET env var reference" },
  {
    pattern: /generateSecureOTP/,
    description: "generateSecureOTP call (removed from razorpay.js)",
  },
  { pattern: /VONAGE_API_KEY/, description: "VONAGE_API_KEY env var reference" },
  { pattern: /VONAGE_API_SECRET/, description: "VONAGE_API_SECRET env var reference" },
  { pattern: /VONAGE_BRAND_NAME/, description: "VONAGE_BRAND_NAME env var reference" },
  // Kebab-case OTP strings that may appear as literals in code.
  // Broad match: catches backticks, .js, querystrings, end-of-string, etc.
  { pattern: /send-otp/, description: "send-otp route or string literal" },
  { pattern: /verify-otp/, description: "verify-otp route or string literal" },
];

// Lines matching any of these patterns are exempt from BANNED_CONTENT_PATTERNS.
// They represent legitimate references to external/sister products and are NOT
// remnants of the old iiskills Vonage OTP system.
const EXEMPT_LINE_PATTERNS = [
  /jaibharat\.cloud/, // sister product — cross-references allowed
  /jaikisan\.cloud/, // sister product — cross-references allowed
  // aienter.in is the shared payment gateway; its references never trigger banned
  // patterns, but listing it here documents the intent and future-proofs the guard.
  // /aienter\.in/,
];

// Directories to skip during scanning
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "supabase/migrations", // DB migrations are historical records; skip
]);

// File extensions to scan for content patterns
const SCAN_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

function* walkFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
    } else if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function getRelPath(abs) {
  return path.relative(ROOT, abs);
}

describe("OTP Removal — CI guard", () => {
  let allSourceFiles;

  beforeAll(() => {
    allSourceFiles = Array.from(walkFiles(ROOT)).filter((f) =>
      SCAN_EXTENSIONS.has(path.extname(f))
    );
  });

  test("no OTP API route files exist", () => {
    const violations = [];
    for (const file of allSourceFiles) {
      const rel = getRelPath(file);
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(rel)) {
          violations.push(`${rel} matches banned pattern ${pattern}`);
        }
      }
    }
    if (violations.length > 0) {
      throw new Error(`OTP file(s) found that must be deleted:\n  ${violations.join("\n  ")}`);
    }
  });

  test("no OTP content patterns exist in source files", () => {
    const violations = [];
    for (const file of allSourceFiles) {
      // Skip this test file itself
      const rel = getRelPath(file);
      if (rel === "tests/noOtpRemnants.test.js") continue;

      let content;
      try {
        content = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }

      // Scan line-by-line so that lines referencing known external domains
      // (jaibharat.cloud, jaikisan.cloud) can be exempted from the OTP guard.
      // These sister products legitimately share the aienter.in gateway and may
      // have their own OTP-related paths in URLs/comments — that is NOT a
      // reintroduction of iiskills's old Vonage OTP system.
      const lines = content.split("\n");
      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];

        // Exempt lines that reference known-external/sister-product domains
        if (EXEMPT_LINE_PATTERNS.some((p) => p.test(line))) continue;

        for (const { pattern, description } of BANNED_CONTENT_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`${rel}:${lineIdx + 1}: contains "${description}"`);
            break; // only report the first matching pattern per line
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `OTP content pattern(s) found that must be removed:\n  ${violations.join("\n  ")}`
      );
    }
  });

  test("@vonage/server-sdk is not in any package.json", () => {
    const pkgFiles = Array.from(walkFiles(ROOT)).filter((f) => path.basename(f) === "package.json");
    const violations = [];
    for (const file of pkgFiles) {
      const rel = getRelPath(file);
      try {
        const content = fs.readFileSync(file, "utf8");
        if (content.includes("@vonage/server-sdk")) {
          violations.push(rel);
        }
      } catch {
        // skip unreadable
      }
    }
    if (violations.length > 0) {
      throw new Error(
        `@vonage/server-sdk found in package.json files (must be removed):\n  ${violations.join("\n  ")}`
      );
    }
  });
});
