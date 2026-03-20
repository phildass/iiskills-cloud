/**
 * No TypeScript-specific syntax in JavaScript middleware files — CI guard
 *
 * Prevents the build error "Expected ',', got '{'" that occurs when
 * `import type { … }` (a TypeScript-only construct) appears inside a `.js`
 * file.  Next.js compiles middleware with the SWC JS parser, which rejects
 * TypeScript syntax in plain `.js` files, causing the build to fail and
 * resulting in 502 errors on the deployed app.
 *
 * What is checked:
 *   - Every `middleware.js` file under `apps/`
 *   - The `import type` construct (TypeScript type-only import)
 *   - The `export type` construct (TypeScript type-only export)
 *
 * Fix: either rename the file to `.ts` / `.tsx` so TypeScript is expected,
 * or replace `import type { X }` with a plain `import { X }` (runtime value).
 *
 * See: apps/learn-ai/middleware.js (regression — was broken by
 *       `import type { NextRequest } from "next/server"`).
 */

"use strict";

const fs = require("fs");
const path = require("path");

const REPO_ROOT = path.resolve(__dirname, "..");
const APPS_DIR = path.join(REPO_ROOT, "apps");

// Patterns that are TypeScript-only and invalid in plain `.js` files
const TS_ONLY_PATTERNS = [
  // import type { … } from "…"
  /^\s*import\s+type\s+\{/,
  // export type { … }
  /^\s*export\s+type\s+\{/,
];

/**
 * Collect all `middleware.js` files that are direct children of each app
 * directory under `appsDir` (single-level scan — checks `apps/<name>/middleware.js`).
 */
function findJsMiddlewareFiles(appsDir) {
  const results = [];
  if (!fs.existsSync(appsDir)) return results;

  for (const entry of fs.readdirSync(appsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(appsDir, entry.name, "middleware.js");
    if (fs.existsSync(candidate)) {
      results.push(candidate);
    }
  }
  return results;
}

describe("No TypeScript-specific syntax in JS middleware files — CI guard", () => {
  const middlewareFiles = findJsMiddlewareFiles(APPS_DIR);

  // Renaming middleware.js → middleware.ts is a valid fix (TypeScript is then expected).
  // Only run the per-file assertion when .js middleware files actually exist.
  if (middlewareFiles.length === 0) {
    test("no middleware.js files found (all may have been converted to .ts — skipping)", () => {
      // Nothing to check.
    });
    return;
  }

  test.each(middlewareFiles.map((f) => [path.relative(REPO_ROOT, f), f]))(
    "%s contains no TypeScript-only syntax",
    (_relPath, absPath) => {
      const content = fs.readFileSync(absPath, "utf8");
      const lines = content.split("\n");
      const violations = [];

      lines.forEach((line, idx) => {
        for (const pattern of TS_ONLY_PATTERNS) {
          if (pattern.test(line)) {
            violations.push(`  line ${idx + 1}: ${line.trim()}`);
          }
        }
      });

      if (violations.length > 0) {
        throw new Error(
          [
            `TypeScript-only syntax found in plain JavaScript file: ${_relPath}`,
            "",
            "SWC (the Next.js compiler) rejects TypeScript syntax in .js files.",
            "This causes the build to fail with: Expected ',', got '{'",
            "and results in 502 errors on the deployed app.",
            "",
            "Fix: rename the file to .ts OR replace `import type { X }` with `import { X }`.",
            "",
            "Violations:",
            ...violations,
          ].join("\n")
        );
      }
    }
  );
});
