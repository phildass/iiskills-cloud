// Dangerfile.js
// PR analysis rules for iiskills.cloud
// Runs via `yarn danger ci` in the Danger.js PR Analysis workflow.

const { danger, warn, fail, message } = require("danger");

// ─── PR Size ──────────────────────────────────────────────────────────────────

const bigPRThreshold = 600;
const totalChanges =
  danger.github.pr.additions + danger.github.pr.deletions;

if (totalChanges > bigPRThreshold) {
  warn(
    `This PR changes ${totalChanges} lines. Consider splitting large PRs to make review easier.`
  );
}

// ─── PR Description ───────────────────────────────────────────────────────────

if (!danger.github.pr.body || danger.github.pr.body.length < 50) {
  fail(
    "PR description is too short. Please describe what changed and why using the PR template."
  );
}

// ─── Issue Linkage ────────────────────────────────────────────────────────────

const hasIssueLink = /(closes|fixes|resolves|related to)\s+#\d+/i.test(
  danger.github.pr.body || ""
);
if (!hasIssueLink) {
  warn(
    'No issue linkage found. Consider adding "Closes #NNN" or "Related to #NNN" to the PR description.'
  );
}

// ─── Modified Files ───────────────────────────────────────────────────────────

const modifiedFiles = [
  ...danger.git.modified_files,
  ...danger.git.created_files,
];

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

// ─── Changelog ────────────────────────────────────────────────────────────────

const changelogChanged = modifiedFiles.some(
  (f) => f.toUpperCase().includes("CHANGELOG")
);
if (!changelogChanged && totalChanges > 100) {
  warn(
    "No CHANGELOG update found for a large PR. Consider documenting changes in CHANGELOG.md."
  );
}

message("✅ Danger.js analysis complete.");
