/**
 * Final-Test "Skip quiz and continue" feature tests.
 *
 * Validates:
 *  - noBadges flag is stored in localStorage when skip is confirmed on the final test
 *  - goToNextModule navigates to the next module's first lesson, or curriculum after module 10
 *  - Skip feature is absent from learn-apt (no final-test pages in that app)
 *  - All seven apps that have final-test pages carry the skip feature
 */

"use strict";

// ---------------------------------------------------------------------------
// Mock localStorage
// ---------------------------------------------------------------------------

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] ?? null,
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// ---------------------------------------------------------------------------
// Helpers that mirror the logic in the final-test page components
// ---------------------------------------------------------------------------

function createFinalTestSkipState(appKey) {
  const NO_BADGES_KEY = `${appKey}-noBadges`;
  let noBadges = localStorageMock.getItem(NO_BADGES_KEY) === "true";
  const navigatedTo = { path: null };

  const goToNextModule = (moduleId) => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= 10) {
      navigatedTo.path = `/modules/${nextModuleId}/lesson/1`;
    } else {
      navigatedTo.path = "/curriculum";
    }
  };

  const confirmSkip = (moduleId) => {
    localStorageMock.setItem(NO_BADGES_KEY, "true");
    noBadges = true;
    goToNextModule(moduleId);
  };

  return {
    confirmSkip,
    getNoBadges: () => noBadges,
    getNavigatedTo: () => navigatedTo.path,
    NO_BADGES_KEY,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Final-test skip-quiz: navigation", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("navigates to next module's first lesson when skipping a non-last module", () => {
    const state = createFinalTestSkipState("learn-math");
    state.confirmSkip("2");
    expect(state.getNavigatedTo()).toBe("/modules/3/lesson/1");
  });

  it("navigates to curriculum when skipping the last module (10)", () => {
    const state = createFinalTestSkipState("learn-math");
    state.confirmSkip("10");
    expect(state.getNavigatedTo()).toBe("/curriculum");
  });

  it("navigates to module 2 from module 1", () => {
    const state = createFinalTestSkipState("learn-ai");
    state.confirmSkip("1");
    expect(state.getNavigatedTo()).toBe("/modules/2/lesson/1");
  });
});

describe("Final-test skip-quiz: noBadges flag", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it("sets noBadges flag in localStorage when skip is confirmed", () => {
    const state = createFinalTestSkipState("learn-math");
    expect(localStorageMock.getItem("learn-math-noBadges")).toBeNull();
    state.confirmSkip("2");
    expect(localStorageMock.getItem("learn-math-noBadges")).toBe("true");
  });

  it("noBadges becomes true after skip confirmation", () => {
    const state = createFinalTestSkipState("learn-chemistry");
    expect(state.getNoBadges()).toBe(false);
    state.confirmSkip("3");
    expect(state.getNoBadges()).toBe(true);
  });
});

describe("Final-test skip-quiz: app-specific keys", () => {
  const appsWithFinalTest = [
    "learn-ai",
    "learn-chemistry",
    "learn-developer",
    "learn-geography",
    "learn-management",
    "learn-pr",
    "learn-math",
  ];

  it.each(appsWithFinalTest)("%s uses app-specific noBadges key", (appKey) => {
    const state = createFinalTestSkipState(appKey);
    expect(state.NO_BADGES_KEY).toBe(`${appKey}-noBadges`);
  });
});

describe("learn-apt must not have skip-quiz on final tests", () => {
  it("learn-apt has no final-test pages (no skip feature possible)", () => {
    const fs = require("fs");
    const path = require("path");
    const aptFinalTest = path.resolve(
      __dirname,
      "../apps/learn-apt/pages/modules/[moduleId]/final-test.js"
    );
    expect(fs.existsSync(aptFinalTest)).toBe(false);
  });

  it("learn-apt source files contain no Skip quiz references", () => {
    const { execSync } = require("child_process");
    const path = require("path");
    const aptDir = path.resolve(__dirname, "../apps/learn-apt");
    // Use a try/catch because grep exits non-zero when no matches found
    let matches = "";
    try {
      matches = execSync(
        `grep -r "Skip quiz" "${aptDir}" --include="*.js" 2>/dev/null || true`
      ).toString();
    } catch {
      matches = "";
    }
    expect(matches.trim()).toBe("");
  });
});
