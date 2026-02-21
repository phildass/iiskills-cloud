#!/usr/bin/env node
/**
 * Route Health Check Script
 *
 * Checks all known public routes for each app and reports any that return
 * 4xx/5xx status codes (including 502 Bad Gateway).
 *
 * Usage:
 *   node scripts/check-routes.js              # check via localhost ports
 *   node scripts/check-routes.js --prod       # check via production domains
 *   node scripts/check-routes.js --timeout 5  # custom timeout in seconds
 *
 * Exit codes:
 *   0 = All routes healthy
 *   1 = One or more routes returned an error status
 */

const http = require("http");
const https = require("https");

// Parse CLI args
const args = process.argv.slice(2);
const useProd = args.includes("--prod");
const timeoutIdx = args.indexOf("--timeout");
const TIMEOUT_MS = timeoutIdx !== -1 ? parseInt(args[timeoutIdx + 1], 10) * 1000 : 8000;

// Port assignments (must match PORT_ASSIGNMENTS.md and ecosystem.config.js)
const APP_PORTS = {
  main: 3000,
  "learn-ai": 3024,
  "learn-apt": 3002,
  "learn-chemistry": 3005,
  "learn-developer": 3007,
  "learn-geography": 3011,
  "learn-management": 3016,
  "learn-math": 3017,
  "learn-physics": 3020,
  "learn-pr": 3021,
};

// Production domains
const APP_DOMAINS = {
  main: "https://app.iiskills.cloud",
  "learn-ai": "https://learn-ai.iiskills.cloud",
  "learn-apt": "https://learn-apt.iiskills.cloud",
  "learn-chemistry": "https://learn-chemistry.iiskills.cloud",
  "learn-developer": "https://learn-developer.iiskills.cloud",
  "learn-geography": "https://learn-geography.iiskills.cloud",
  "learn-management": "https://learn-management.iiskills.cloud",
  "learn-math": "https://learn-math.iiskills.cloud",
  "learn-physics": "https://learn-physics.iiskills.cloud",
  "learn-pr": "https://learn-pr.iiskills.cloud",
};

// Known public routes per app
const APP_ROUTES = {
  main: ["/", "/courses", "/about", "/contact"],
  "learn-ai": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-apt": ["/", "/tests", "/test/diagnostic", "/test/quick-fire"],
  "learn-chemistry": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-developer": ["/", "/curriculum", "/modules/1/lesson"],
  "learn-geography": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-management": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-math": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-physics": ["/", "/curriculum", "/modules/1/lesson/1"],
  "learn-pr": ["/", "/curriculum", "/modules/1/lesson/1"],
};

function checkUrl(url) {
  return new Promise((resolve) => {
    const proto = url.startsWith("https") ? https : http;
    const req = proto.get(url, { timeout: TIMEOUT_MS }, (res) => {
      resolve({ url, status: res.statusCode });
      res.resume(); // consume response to free socket
    });
    req.on("error", (err) => {
      resolve({ url, status: null, error: err.message });
    });
    req.on("timeout", () => {
      req.destroy();
      resolve({ url, status: null, error: "timeout" });
    });
  });
}

async function main() {
  const RED = "\x1b[31m";
  const GREEN = "\x1b[32m";
  const YELLOW = "\x1b[33m";
  const CYAN = "\x1b[36m";
  const RESET = "\x1b[0m";
  const BOLD = "\x1b[1m";

  console.log(`\n${BOLD}${CYAN}=== Route Health Check ===${RESET}`);
  console.log(
    `Mode: ${useProd ? "production domains" : "localhost ports"} | Timeout: ${TIMEOUT_MS / 1000}s\n`
  );

  const results = [];

  for (const [appId, routes] of Object.entries(APP_ROUTES)) {
    const baseUrl = useProd
      ? APP_DOMAINS[appId]
      : `http://localhost:${APP_PORTS[appId]}`;

    console.log(`${BOLD}${appId}${RESET} (${baseUrl})`);

    for (const route of routes) {
      const url = `${baseUrl}${route}`;
      const result = await checkUrl(url);

      const isOk =
        result.status !== null &&
        result.status < 400 &&
        result.status !== 502 &&
        result.status !== 503;

      const statusStr = result.error
        ? `CONN_ERR (${result.error})`
        : `HTTP ${result.status}`;

      const icon = isOk ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      const statusColour = isOk ? GREEN : RED;
      console.log(
        `  ${icon} ${route.padEnd(40)} ${statusColour}${statusStr}${RESET}`
      );

      results.push({ appId, url, route, ...result, ok: isOk });
    }
    console.log();
  }

  const failures = results.filter((r) => !r.ok);
  const total = results.length;
  const passed = total - failures.length;

  console.log(
    `${BOLD}${CYAN}=== Summary ===${RESET}`
  );
  console.log(
    `Checked: ${total} routes | Passed: ${GREEN}${passed}${RESET} | Failed: ${failures.length > 0 ? RED : GREEN}${failures.length}${RESET}`
  );

  if (failures.length > 0) {
    console.log(`\n${RED}${BOLD}Failed routes:${RESET}`);
    for (const f of failures) {
      const statusStr = f.error ? `CONN_ERR (${f.error})` : `HTTP ${f.status}`;
      console.log(`  ${RED}✗${RESET} [${f.appId}] ${f.url} → ${RED}${statusStr}${RESET}`);
    }
    console.log();
    process.exit(1);
  } else {
    console.log(`\n${GREEN}${BOLD}All routes healthy!${RESET}\n`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
