#!/usr/bin/env node

/**
 * Post-Build Placeholder Verification Script
 *
 * Scans the compiled Next.js output in .next/static for placeholder Supabase
 * credential strings. If any are found it means a placeholder value was inlined
 * into the client bundle at build time, which will break production.
 *
 * Usage:
 *   node scripts/verify-build-env.js [--app=apps/main]
 *
 * Exit codes:
 *   0 = No placeholder strings found — build is clean
 *   1 = Placeholder strings found — DO NOT deploy this build
 *
 * Typically invoked via:
 *   yarn verify:build-env
 */

const fs = require("fs");
const path = require("path");

// Strings that must never appear inside a production bundle
const BANNED_STRINGS = [
  "your-anon-key-here",
  "your-project-url-here",
  "https://placeholder.supabase.co",
  "placeholder-key",
];

// Resolve the .next directory relative to an optional --app argument
const args = process.argv.slice(2);
const appArg = args.find((a) => a.startsWith("--app="));
const appDir = appArg ? path.resolve(process.cwd(), appArg.split("=")[1]) : process.cwd();
const nextStaticDir = path.join(appDir, ".next", "static");

const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BOLD = "\x1b[1m";
const RESET = "\x1b[0m";

console.log(`${BOLD}Post-Build Placeholder Check${RESET}`);
console.log(`Scanning: ${nextStaticDir}\n`);

if (!fs.existsSync(nextStaticDir)) {
  console.error(`${RED}✗ .next/static not found at: ${nextStaticDir}${RESET}`);
  console.error("  Run the build first (yarn build or yarn build:main)\n");
  process.exit(1);
}

/**
 * Recursively collect all files under a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function collectFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Check a single file for banned strings.
 * Returns the list of banned strings found in the file.
 * @param {string} filePath
 * @returns {string[]}
 */
function checkFile(filePath) {
  let content;
  try {
    content = fs.readFileSync(filePath, "utf8");
  } catch {
    return [];
  }
  return BANNED_STRINGS.filter((banned) => content.includes(banned));
}

const allFiles = collectFiles(nextStaticDir);

// Map: bannedString -> list of files containing it
/** @type {Map<string, string[]>} */
const violations = new Map(BANNED_STRINGS.map((b) => [b, []]));

for (const file of allFiles) {
  const found = checkFile(file);
  for (const banned of found) {
    violations.get(banned).push(path.relative(nextStaticDir, file));
  }
}

let foundAny = false;

for (const banned of BANNED_STRINGS) {
  const files = violations.get(banned);
  if (files.length > 0) {
    foundAny = true;
    console.error(
      `${RED}${BOLD}✗ FAIL: Placeholder string "${banned}" found in compiled bundle!${RESET}`
    );
    files.forEach((file) => console.error(`  ${YELLOW}  → ${file}${RESET}`));
    console.error("");
  } else {
    console.log(`${GREEN}✓ OK: "${banned}" not found in bundle${RESET}`);
  }
}

console.log("");

if (foundAny) {
  console.error(`${RED}${BOLD}VERIFICATION FAILED${RESET}`);
  console.error("A placeholder credential string was embedded in the compiled client bundle.");
  console.error("This means the real NEXT_PUBLIC_SUPABASE_* env vars were NOT set at build time.");
  console.error("");
  console.error("To fix:");
  console.error(
    "  1. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY with real values"
  );
  console.error("     in apps/main/.env.production (or export them before running build).");
  console.error("  2. Delete .next:  rm -rf apps/main/.next");
  console.error("  3. Rebuild:       yarn build (or yarn build:main)");
  console.error("  4. Re-run:        yarn verify:build-env");
  console.error("");
  process.exit(1);
} else {
  console.log(`${GREEN}${BOLD}✓ Verification passed — no placeholder strings in bundle${RESET}\n`);
  process.exit(0);
}
