/**
 * Tests for learn-chemistry content integrity.
 *
 * Validates:
 *  - Exactly 100 lessons (10 modules × 10 lessons)
 *  - Every lesson has exactly 5 quiz questions with correct_answer field
 *  - Every lesson has all required fields
 *  - ALL lessons have isFree: true (free app — no paywall)
 *  - final-exam.json has 20 questions and passThreshold of 13
 *  - 5 case studies and 5 simulators exist and parse
 *  - image-allocation.json has no duplicates and follows canonical schema
 */

'use strict';

const path = require('path');
const fs = require('fs');

const CONTENT_ROOT = path.resolve(__dirname, '../content/learn-chemistry');
const LESSONS_ROOT = path.join(CONTENT_ROOT, 'lessons');
const REQUIRED_LESSON_FIELDS = ['moduleId', 'lessonId', 'title', 'content', 'quiz'];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getAllLessonFiles() {
  const files = [];
  for (let mod = 1; mod <= 10; mod++) {
    for (let les = 1; les <= 10; les++) {
      files.push(path.join(LESSONS_ROOT, `module-${mod}`, `lesson-${les}.json`));
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('learn-chemistry content integrity', () => {
  describe('lesson files', () => {
    it('has exactly 100 lesson files (10 modules × 10 lessons)', () => {
      const files = getAllLessonFiles();
      const missing = files.filter((f) => !fs.existsSync(f));
      expect(missing).toHaveLength(0);
    });

    it('every lesson has all required fields', () => {
      const files = getAllLessonFiles();
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        for (const field of REQUIRED_LESSON_FIELDS) {
          if (lesson[field] === undefined || lesson[field] === null) {
            errors.push(`${path.relative(CONTENT_ROOT, file)}: missing field "${field}"`);
          }
        }
      }
      expect(errors).toHaveLength(0);
    });

    it('every lesson has exactly 5 quiz questions', () => {
      const files = getAllLessonFiles();
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        if (!Array.isArray(lesson.quiz) || lesson.quiz.length !== 5) {
          errors.push(
            `${path.relative(CONTENT_ROOT, file)}: expected 5 quiz questions, got ${Array.isArray(lesson.quiz) ? lesson.quiz.length : 'none'}`
          );
        }
      }
      expect(errors).toHaveLength(0);
    });

    it('every quiz question uses correct_answer (not correctAnswerIndex)', () => {
      const files = getAllLessonFiles();
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        if (!Array.isArray(lesson.quiz)) continue;
        lesson.quiz.forEach((q, i) => {
          if (typeof q.correct_answer !== 'number') {
            errors.push(
              `${path.relative(CONTENT_ROOT, file)}: question ${i + 1} missing numeric correct_answer`
            );
          }
          if (!Array.isArray(q.options) || q.options.length !== 4) {
            errors.push(
              `${path.relative(CONTENT_ROOT, file)}: question ${i + 1} must have exactly 4 options`
            );
          }
        });
      }
      expect(errors).toHaveLength(0);
    });

    it('all lessons have isFree: true (free app — no paywall)', () => {
      const files = getAllLessonFiles();
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        if (lesson.isFree !== true) {
          errors.push(`${path.relative(CONTENT_ROOT, file)}: expected isFree: true, got ${lesson.isFree}`);
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe('final-exam.json', () => {
    const examPath = path.join(CONTENT_ROOT, 'final-exam.json');

    it('final-exam.json exists', () => {
      expect(fs.existsSync(examPath)).toBe(true);
    });

    it('has exactly 20 questions', () => {
      const exam = readJson(examPath);
      expect(Array.isArray(exam.questions)).toBe(true);
      expect(exam.questions).toHaveLength(20);
    });

    it('has passThreshold of 13', () => {
      const exam = readJson(examPath);
      expect(exam.passThreshold).toBe(13);
    });

    it('every exam question has correct_answer and 4 options', () => {
      const exam = readJson(examPath);
      const errors = [];
      exam.questions.forEach((q, i) => {
        if (typeof q.correct_answer !== 'number') {
          errors.push(`question ${i + 1}: missing numeric correct_answer`);
        }
        if (!Array.isArray(q.options) || q.options.length !== 4) {
          errors.push(`question ${i + 1}: must have exactly 4 options`);
        }
      });
      expect(errors).toHaveLength(0);
    });
  });

  describe('case studies', () => {
    it('has exactly 5 case study files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, 'case-studies', `case-${i}.json`);
        if (!fs.existsSync(p)) missing.push(`case-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('all case study files parse as valid JSON', () => {
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, 'case-studies', `case-${i}.json`);
        expect(() => readJson(p)).not.toThrow();
      }
    });
  });

  describe('simulators', () => {
    it('has exactly 5 simulator files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, 'simulators', `sim-${i}.json`);
        if (!fs.existsSync(p)) missing.push(`sim-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('all simulator files parse as valid JSON', () => {
      for (let i = 1; i <= 5; i++) {
        const p = path.join(CONTENT_ROOT, 'simulators', `sim-${i}.json`);
        expect(() => readJson(p)).not.toThrow();
      }
    });
  });

  describe('image-allocation.json — canonical schema, no duplicates', () => {
    const allocPath = path.join(CONTENT_ROOT, 'image-allocation.json');

    it('image-allocation.json exists', () => {
      expect(fs.existsSync(allocPath)).toBe(true);
    });

    it('follows canonical schema (has notes field and images array with usedBy/description)', () => {
      const alloc = readJson(allocPath);
      expect(typeof alloc.notes).toBe('string');
      expect(Array.isArray(alloc.images)).toBe(true);
      alloc.images.forEach((entry, i) => {
        expect(typeof entry.image).toBe('string');
        expect(typeof entry.usedBy).toBe('string');
        expect(typeof entry.description).toBe('string');
      });
    });

    it('no duplicate image filenames in image-allocation', () => {
      const alloc = readJson(allocPath);
      const names = alloc.images.map((e) => e.image);
      const duplicates = names.filter((name, idx) => names.indexOf(name) !== idx);
      expect(duplicates).toHaveLength(0);
    });

    it('no duplicate usedBy references in image-allocation', () => {
      const alloc = readJson(allocPath);
      const refs = alloc.images.map((e) => e.usedBy);
      const duplicates = refs.filter((ref, idx) => refs.indexOf(ref) !== idx);
      expect(duplicates).toHaveLength(0);
    });

    it('every usedBy path points to an existing file', () => {
      const alloc = readJson(allocPath);
      const missing = alloc.images.filter((e) => !fs.existsSync(path.join(CONTENT_ROOT, e.usedBy)));
      expect(missing.map((e) => e.usedBy)).toHaveLength(0);
    });
  });
});
