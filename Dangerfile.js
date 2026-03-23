// Dangerfile.js
// PR analysis rules for iiskills.cloud
// Runs via `yarn danger ci` in the Danger.js PR Analysis workflow.

const { danger, warn, fail, message } = require("danger");

// ─── PR Size ──────────────────────────────────────────────────────────────────

const bigPRThreshold = 600;
const totalChanges = danger.github.pr.additions + danger.github.pr.deletions;

if (totalChanges > bigPRThreshold) {
  warn(
    `This PR changes ${totalChanges} lines. Consider splitting large PRs to make review easier.`
  );
}

// ─── PR Description ───────────────────────────────────────────────────────────

if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
  fail("PR description is too short. Please describe what changed and why using the PR template.");
}

// ─── Issue Linkage ────────────────────────────────────────────────────────────

const hasIssueLink = /(closes|fixes|resolves|related to)\s+#\d+/i.test(danger.github.pr.body || "");
if (!hasIssueLink) {
  warn(
    'No issue linkage found. Consider adding "Closes #NNN" or "Related to #NNN" to the PR description.'
  );
}

// ─── Modified Files ───────────────────────────────────────────────────────────

const modifiedFiles = [...danger.git.modified_files, ...danger.git.created_files];

// Warn if package.json changed without yarn.lock
const packageJsonChanged = modifiedFiles.some((f) => f.endsWith("package.json"));
const yarnLockChanged = modifiedFiles.some((f) => f === "yarn.lock");

if (packageJsonChanged && !yarnLockChanged) {
  warn(
    "A `package.json` changed but `yarn.lock` was not updated. Run `yarn install` to sync the lockfile."
  );
}

// ─── UI Changes ───────────────────────────────────────────────────────────────

const uiFiles = modifiedFiles.filter(
  (f) =>
    f.includes("components/") ||
    f.includes("packages/ui/") ||
    f.endsWith(".css") ||
    f.endsWith(".module.css")
);

if (uiFiles.length > 0) {
  message(
    `📸 **UI files changed** (${uiFiles.length} file(s)). ` +
      "Screenshots are captured automatically and uploaded as the `qa-screenshots` workflow artifact. " +
      "Please verify the Admin Banner and ModuleInProduction placeholder look correct."
  );
}

// ─── Security-sensitive files ─────────────────────────────────────────────────

const securityFiles = modifiedFiles.filter(
  (f) =>
    f.includes("pages/api/") ||
    f.includes("dbAccessManager") ||
    f.includes("adminAuth") ||
    f.includes("entitlement")
);

if (securityFiles.length > 0) {
  message(
    `🔒 **Security-sensitive files changed** (${securityFiles.length} file(s)). ` +
      "Ensure server-side routes use `SUPABASE_SERVICE_ROLE_KEY` only and access control is preserved."
  );
}

// ─── Admin / Paywall Predicate Enforcement ────────────────────────────────────
//
// All admin status checks MUST go through isUnrestrictedAdmin() or
// isAdminFromJwtUser() from @iiskills/access-control.  Direct checks on
// is_admin, role, or hardcoded email lists outside the shared package are a
// sign of logic drift and will be caught here.

const SHARED_ACCESS_CONTROL_PATHS = [
  "packages/access-control/",
  "packages/shared-utils/lib/hooks/useUserAccess.js",
];

const isSharedPackage = (f) => SHARED_ACCESS_CONTROL_PATHS.some((p) => f.startsWith(p));

// Patterns that indicate a direct admin check outside the shared package
const FORBIDDEN_ADMIN_PATTERNS = [
  /\bis_admin\s*===?\s*(true|false)/,
  /role\s*===?\s*['"]admin['"]/,
  /\.is_admin\b/,
  /app_metadata\??\.\s*is_admin/,
  /user_metadata\??\.\s*is_admin/,
];

const FORBIDDEN_EMAIL_PATTERN = /['"](?:philipda@gmail\.com|pda\.kenya@gmail\.com)['"]/;

const violatingFiles = [];

for (const filePath of modifiedFiles) {
  // Skip the shared packages — that's where these patterns are ALLOWED to live.
  if (isSharedPackage(filePath)) continue;
  // Skip non-JS/TS files and test files
  if (!/\.(js|ts|tsx|jsx)$/.test(filePath)) continue;
  if (filePath.includes(".test.") || filePath.includes(".spec.")) continue;

  const fileContent = danger.github.utils.fileContents(filePath);
  if (!fileContent) continue;

  const hasDirectAdminCheck = FORBIDDEN_ADMIN_PATTERNS.some((re) => re.test(fileContent));
  const hasHardcodedEmail = FORBIDDEN_EMAIL_PATTERN.test(fileContent);

  if (hasDirectAdminCheck || hasHardcodedEmail) {
    violatingFiles.push(filePath);
  }
}

if (violatingFiles.length > 0) {
  const fileList = violatingFiles.map((f) => `  - \`${f}\``).join("\n");
  fail(
    "🚨 **Direct admin/paywall check detected outside the shared access-control package.**\n\n" +
      'The following file(s) contain direct `is_admin`, `role === "admin"`, or ' +
      `hardcoded product-owner email checks:\n\n${fileList}\n\n` +
      "All admin status checks MUST delegate to:\n" +
      "  • `isUnrestrictedAdmin(user)` — for normalised profile/DB users\n" +
      "  • `isAdminFromJwtUser(jwtUser)` — for raw Supabase JWT session users\n\n" +
      "Import from `@iiskills/access-control`. See CONTRIBUTING.md for the full policy."
  );
}

// ─── Changelog ────────────────────────────────────────────────────────────────

const changelogChanged = modifiedFiles.some((f) => f.toUpperCase().includes("CHANGELOG"));
if (!changelogChanged && totalChanges > 100) {
  warn("No CHANGELOG update found for a large PR. Consider documenting changes in CHANGELOG.md.");
}

message("✅ Danger.js analysis complete.");
