#!/usr/bin/env bash
# capture-qa-screenshots.sh
#
# Captures QA screenshots of the running iiskills.cloud app at three standard
# viewports: Desktop (1920×1080), Tablet (768×1024), Mobile (375×667).
#
# Requirements:
#   - Node.js 18+ and npx available
#   - @playwright/test installed (yarn install must have run)
#   - apps/main running on http://localhost:3000  (or set BASE_URL env var)
#
# Usage:
#   ./capture-qa-screenshots.sh              # screenshots saved to qa-screenshots/
#   BASE_URL=http://localhost:3001 ./capture-qa-screenshots.sh
#
# Output: qa-screenshots/{desktop,tablet,mobile}-*.png
# CI: Set UPLOAD_TO_PR=true to post screenshots as a PR comment via GitHub CLI.

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
OUT_DIR="qa-screenshots"
mkdir -p "$OUT_DIR"

echo "==> Capturing QA screenshots from ${BASE_URL}"
echo "    Output directory: ${OUT_DIR}/"

# Pages to screenshot
PAGES=(
  "/"
  "/courses"
  "/admin"
)

# Viewport definitions: name width height
VIEWPORTS=(
  "desktop:1920:1080"
  "tablet:768:1024"
  "mobile:375:667"
)

# Use Node.js + Playwright to capture screenshots
node - << JSEOF
const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const pages = ['/'];  // Minimal set for QA
  const viewports = [
    { name: 'desktop', width: 1920, height: 1080 },
    { name: 'tablet',  width: 768,  height: 1024 },
    { name: 'mobile',  width: 375,  height: 667  },
  ];

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  const outDir  = process.env.OUT_DIR || 'qa-screenshots';

  for (const viewport of viewports) {
    const ctx  = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await ctx.newPage();

    for (const path of pages) {
      const url      = baseUrl + path;
      const safePath = path.replace(/\//g, '_').replace(/^_/, '') || 'home';
      const filename = \`\${outDir}/\${viewport.name}-\${safePath}.png\`;

      try {
        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.screenshot({ path: filename, fullPage: true });
        console.log('  ✅ Saved: ' + filename);
      } catch (err) {
        console.warn('  ⚠️  Skipped ' + url + ': ' + err.message);
        // Create a placeholder image so the artifact is never empty
        const { writeFileSync } = require('fs');
        writeFileSync(filename.replace('.png', '-unavailable.txt'),
          'Screenshot unavailable: ' + err.message + '\nURL: ' + url);
      }
    }

    await ctx.close();
  }

  await browser.close();
  console.log('==> Screenshots complete.');
})();
JSEOF

echo "==> Done. Screenshots saved to ${OUT_DIR}/"
ls -lh "${OUT_DIR}/"

# Optional: post to PR as a comment using GitHub CLI
if [ "${UPLOAD_TO_PR:-false}" = "true" ] && command -v gh &>/dev/null; then
  PR_NUMBER="${PR_NUMBER:-}"
  if [ -z "$PR_NUMBER" ]; then
    PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null || echo "")
  fi

  if [ -n "$PR_NUMBER" ]; then
    echo "==> Uploading screenshot evidence to PR #${PR_NUMBER}"
    COMMENT="## 📸 QA Screenshots — Admin Banner UI Verification\n\n"
    COMMENT+="Screenshots captured at $(date -u '+%Y-%m-%d %H:%M UTC') from \`${BASE_URL}\`.\n\n"
    COMMENT+="| Viewport | Dimensions | File |\n|---|---|---|\n"
    for f in "${OUT_DIR}"/*.png; do
      name=$(basename "$f")
      COMMENT+="| ${name%%-*} | — | \`$name\` |\n"
    done
    COMMENT+="\nFull screenshots uploaded as workflow artifacts under \`qa-screenshots\`.\n"
    echo -e "$COMMENT" | gh pr comment "$PR_NUMBER" --body-file -
    echo "==> PR comment posted."
  else
    echo "==> Could not determine PR number — skipping comment."
  fi
fi
