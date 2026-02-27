/**
 * Content Readiness — All Apps aggregator test.
 *
 * Iterates every scoped course app and enforces:
 *  1. 100 lessons (10 modules × 10 lessons) with correct schema
 *  2. Access policy:
 *     - Paid apps: ONLY module-1/lesson-1 isFree true, rest isFree false
 *     - Free apps: ALL lessons isFree true
 *  3. final-exam.json — 20 questions, passThreshold 13
 *  4. 5 case studies + 5 simulators exist and are valid JSON
 *  5. image-allocation.json — canonical schema, no duplicates, all usedBy paths resolve
 *
 * learn-apt is excluded from this test.
 */

'use strict';

const path = require('path');
const fs = require('fs');

const CONTENT_ROOT = path.resolve(__dirname, '../content');

const PAID_APPS = ['learn-ai', 'learn-management', 'learn-pr', 'learn-developer'];
const FREE_APPS = ['learn-math', 'learn-physics', 'learn-chemistry', 'learn-geography'];
const ALL_APPS = [...PAID_APPS, ...FREE_APPS];

const REQUIRED_LESSON_FIELDS = ['moduleId', 'lessonId', 'title', 'content', 'quiz'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getLessonPath(appSlug, mod, les) {
  return path.join(CONTENT_ROOT, appSlug, 'lessons', `module-${mod}`, `lesson-${les}.json`);
}

function getAllLessonFiles(appSlug) {
  const files = [];
  for (let mod = 1; mod <= 10; mod++) {
    for (let les = 1; les <= 10; les++) {
      files.push(getLessonPath(appSlug, mod, les));
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('content readiness — all scoped apps', () => {
  describe.each(ALL_APPS)('%s — lessons', (appSlug) => {
    it('has exactly 100 lesson files (10 modules × 10 lessons)', () => {
      const files = getAllLessonFiles(appSlug);
      const missing = files.filter((f) => !fs.existsSync(f));
      expect(missing).toHaveLength(0);
    });

    it('every lesson has required fields and a 5-question quiz', () => {
      const files = getAllLessonFiles(appSlug);
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        for (const field of REQUIRED_LESSON_FIELDS) {
          if (lesson[field] === undefined || lesson[field] === null) {
            errors.push(`${appSlug}/${path.relative(path.join(CONTENT_ROOT, appSlug), file)}: missing field "${field}"`);
          }
        }
        if (!Array.isArray(lesson.quiz) || lesson.quiz.length !== 5) {
          errors.push(`${appSlug}/${path.relative(path.join(CONTENT_ROOT, appSlug), file)}: expected 5 quiz questions`);
        }
        if (Array.isArray(lesson.quiz)) {
          lesson.quiz.forEach((q, i) => {
            if (typeof q.correct_answer !== 'number') {
              errors.push(`${appSlug}: question ${i + 1} missing numeric correct_answer`);
            }
            if (!Array.isArray(q.options) || q.options.length !== 4) {
              errors.push(`${appSlug}: question ${i + 1} must have exactly 4 options`);
            }
          });
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe.each(PAID_APPS)('%s — paid access policy', (appSlug) => {
    it('only module-1/lesson-1 has isFree: true; all others isFree: false', () => {
      const files = getAllLessonFiles(appSlug);
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        const isM1L1 = lesson.moduleId === 1 && lesson.lessonId === 1;
        if (isM1L1 && lesson.isFree !== true) {
          errors.push(`${appSlug}/module-1/lesson-1: must have isFree: true`);
        }
        if (!isM1L1 && lesson.isFree !== false) {
          errors.push(`${appSlug}/${path.relative(path.join(CONTENT_ROOT, appSlug), file)}: must have isFree: false`);
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe.each(FREE_APPS)('%s — free access policy', (appSlug) => {
    it('all lessons have isFree: true', () => {
      const files = getAllLessonFiles(appSlug);
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        if (lesson.isFree !== true) {
          errors.push(`${appSlug}/${path.relative(path.join(CONTENT_ROOT, appSlug), file)}: must have isFree: true`);
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe.each(ALL_APPS)('%s — final-exam.json', (appSlug) => {
    it('final-exam.json exists with 20 questions and passThreshold 13', () => {
      const examPath = path.join(CONTENT_ROOT, appSlug, 'final-exam.json');
      expect(fs.existsSync(examPath)).toBe(true);
      const exam = readJson(examPath);
      expect(Array.isArray(exam.questions)).toBe(true);
      expect(exam.questions).toHaveLength(20);
      expect(exam.passThreshold).toBe(13);
    });

    it('every exam question has 4 options and numeric correct_answer', () => {
      const examPath = path.join(CONTENT_ROOT, appSlug, 'final-exam.json');
      const exam = readJson(examPath);
      const errors = [];
      exam.questions.forEach((q, i) => {
        if (typeof q.correct_answer !== 'number') {
          errors.push(`${appSlug} exam q${i + 1}: missing numeric correct_answer`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          errors.push(`${appSlug} exam q${i + 1}: must have exactly 4 options`);
        }
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe.each(ALL_APPS)('%s — case studies and simulators', (appSlug) => {
    it('has exactly 5 case study files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, appSlug, 'case-studies', `case-${i}.json`);
        if (!fs.existsSync(p)) missing.push(`case-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('has exactly 5 simulator files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, appSlug, 'simulators', `sim-${i}.json`);
        if (!fs.existsSync(p)) missing.push(`sim-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('all case study and simulator files parse as valid JSON', () => {
      for (let i = 1; i <= 5; i++) {
        expect(() => readJson(path.join(CONTENT_ROOT, appSlug, 'case-studies', `case-${i}.json`))).not.toThrow();
        expect(() => readJson(path.join(CONTENT_ROOT, appSlug, 'simulators', `sim-${i}.json`))).not.toThrow();
      }
    });
  });

  describe.each(ALL_APPS)('%s — image-allocation.json', (appSlug) => {
    it('image-allocation.json exists with canonical schema', () => {
      const allocPath = path.join(CONTENT_ROOT, appSlug, 'image-allocation.json');
      expect(fs.existsSync(allocPath)).toBe(true);
      const alloc = readJson(allocPath);
      expect(typeof alloc.notes).toBe('string');
      expect(Array.isArray(alloc.images)).toBe(true);
      alloc.images.forEach((entry) => {
        expect(typeof entry.image).toBe('string');
        expect(typeof entry.usedBy).toBe('string');
        expect(typeof entry.description).toBe('string');
      });
    });

    it('no duplicate image filenames or usedBy references', () => {
      const allocPath = path.join(CONTENT_ROOT, appSlug, 'image-allocation.json');
      const alloc = readJson(allocPath);
      const names = alloc.images.map((e) => e.image);
      const refs = alloc.images.map((e) => e.usedBy);
      const dupNames = names.filter((n, i) => names.indexOf(n) !== i);
      const dupRefs = refs.filter((r, i) => refs.indexOf(r) !== i);
      expect(dupNames).toHaveLength(0);
      expect(dupRefs).toHaveLength(0);
    });

    it('every usedBy path points to an existing file', () => {
      const allocPath = path.join(CONTENT_ROOT, appSlug, 'image-allocation.json');
      const alloc = readJson(allocPath);
      const missing = alloc.images.filter(
        (e) => !fs.existsSync(path.join(CONTENT_ROOT, appSlug, e.usedBy))
      );
      expect(missing.map((e) => e.usedBy)).toHaveLength(0);
    });
  });
});
