/**
 * No Placeholder Credentials in Bundleable Source — CI guard
 *
 * Ensures that literal placeholder Supabase credential strings (such as
 * "your-anon-key-here" and "your-project-url-here") are never present inside
 * JavaScript/TypeScript source files that get compiled into the client bundle.
 *
 * Background:
 *   Next.js inlines the full content of every JS/TS module it bundles, including
 *   string literals that appear inside conditional branches that would never be
 *   reached at runtime. If a help-message template contains the text
 *   "your-anon-key-here", that exact string will appear verbatim in compiled
 *   .next/static JS files, causing post-build grep checks to report a failure and
 *   potentially confusing monitoring / security scanners.
 *
 * Allowed files (not scanned for placeholder content):
 *   - *.example files  — documentation only, never bundled
 *   - tests/           — test files, never bundled
 *   - scripts/         — Node.js scripts, never bundled by Next.js
 *   - PRODUCTION_DEPLOY.md and other Markdown docs
 *   - This test file itself
 */

/* eslint-env jest */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

// Exact literal strings that must NOT appear in bundleable source code
const BANNED_LITERALS = [
  "your-anon-key-here",
  "your-project-url-here",
  "https://your-project.supabase.co",
  "https://placeholder.supabase.co",
  "placeholder-key",
];

// Directories to skip during scanning (never bundled)
const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  "supabase",
]);

// File extensions that Next.js bundles (i.e. these are the dangerous ones)
const BUNDLEABLE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

// Files / path suffixes that are explicitly exempt (docs / examples / scripts)
function isExempt(relPath) {
  const norm = relPath.replace(/\\/g, "/");
  return (
    norm.endsWith(".example") ||
    norm.includes(".env.local.example") ||
    norm.includes(".env.production.example") ||
    norm.startsWith("tests/") ||
    norm.startsWith("scripts/") ||
    // Server-side-only validation modules that legitimately need to compare
    // against placeholder strings (they call process.exit and never run in browser)
    norm === "lib/validateRuntimeEnv.js" ||
    norm === "tests/noPlaceholderInSource.test.js" ||
    path.basename(norm).endsWith(".md")
  );
}

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

describe("No placeholder credentials in bundleable source — CI guard", () => {
  let bundleableFiles;

  beforeAll(() => {
    bundleableFiles = Array.from(walkFiles(ROOT)).filter((f) => {
      const ext = path.extname(f);
      if (!BUNDLEABLE_EXTENSIONS.has(ext)) return false;
      const rel = path.relative(ROOT, f).replace(/\\/g, "/");
      return !isExempt(rel);
    });
  });

  test("no placeholder credential strings appear in JS/TS source files", () => {
    const violations = [];

    for (const file of bundleableFiles) {
      const rel = path.relative(ROOT, file).replace(/\\/g, "/");
      // Skip this test file itself
      if (rel === "tests/noPlaceholderInSource.test.js") continue;

      let content;
      try {
        content = fs.readFileSync(file, "utf8");
      } catch {
        continue;
      }

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const banned of BANNED_LITERALS) {
          if (line.includes(banned)) {
            violations.push(`${rel}:${i + 1}: contains "${banned}"`);
            break; // report once per line
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        [
          "Placeholder credential string(s) found in bundleable source code.",
          "These strings will be compiled verbatim into the client bundle, which",
          "breaks production builds and may confuse security scanners.",
          "",
          "Replace each occurrence with a generic description (e.g. <your-supabase-anon-key>),",
          "move the message to a server-side-only code path, or delete the help text.",
          "",
          "Violations:",
          ...violations.map((v) => `  ${v}`),
        ].join("\n")
      );
    }
  });
});
