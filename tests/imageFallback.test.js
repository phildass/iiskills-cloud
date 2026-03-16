/**
 * Image Fallback — CI guard
 *
 * Verifies that:
 *  1. FallbackImage component exists and is exported from the UI content package.
 *  2. LessonContent includes useRef/useEffect-based image error handling.
 *  3. The geography lesson page uses FallbackImage for inline media images.
 *  4. GeographyMedia uses an error handler component for images.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");

describe("Image fallback — lesson rendering", () => {
  it("FallbackImage component file exists in packages/ui/src/content/", () => {
    const filePath = path.join(ROOT, "packages/ui/src/content/FallbackImage.js");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("FallbackImage is exported from packages/ui/src/content/index.js", () => {
    const indexPath = path.join(ROOT, "packages/ui/src/content/index.js");
    const content = fs.readFileSync(indexPath, "utf8");
    expect(content).toMatch(/export.*FallbackImage/);
  });

  it("FallbackImage component uses an onError handler", () => {
    const filePath = path.join(ROOT, "packages/ui/src/content/FallbackImage.js");
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/onError/);
    expect(content).toMatch(/setFailed/);
    expect(content).toMatch(/View Image/);
  });

  it('FallbackImage link opens in a new tab (target="_blank")', () => {
    const filePath = path.join(ROOT, "packages/ui/src/content/FallbackImage.js");
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/_blank/);
    expect(content).toMatch(/noopener noreferrer/);
  });

  it("LessonContent uses useRef and useEffect for HTML image error handling", () => {
    const filePath = path.join(ROOT, "packages/ui/src/content/LessonContent.js");
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/useRef/);
    expect(content).toMatch(/useEffect/);
    expect(content).toMatch(/addEventListener.*error|error.*addEventListener/);
    expect(content).toMatch(/View Image/);
  });

  it("geography lesson page imports and uses FallbackImage", () => {
    const filePath = path.join(
      ROOT,
      "apps/learn-geography/pages/modules/[moduleId]/lesson/[lessonId].js"
    );
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/FallbackImage/);
    expect(content).toMatch(/import.*FallbackImage.*@iiskills\/ui\/content/);
  });

  it("GeographyMedia uses onError handling for images", () => {
    const filePath = path.join(ROOT, "apps/learn-geography/components/GeographyMedia.js");
    const content = fs.readFileSync(filePath, "utf8");
    expect(content).toMatch(/onError/);
    expect(content).toMatch(/View Image/);
  });
});
