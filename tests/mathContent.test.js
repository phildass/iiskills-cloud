/**
 * Tests for learn-math content integrity.
 *
 * Validates:
 *  - Exactly 100 lessons (10 modules × 10 lessons)
 *  - Every lesson has isFree: true (free access app)
 *  - Every lesson has exactly 5 quiz questions with correct_answer field
 *  - Every lesson has all required fields
 *  - final-exam.json has 20 questions and passThreshold of 13
 *  - 5 case studies and 5 simulators exist and match expected schema
 *  - No duplicate images across math content
 */

'use strict';

const path = require('path');
const fs = require('fs');

const CONTENT_ROOT = path.resolve(__dirname, '../content/learn-math');
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

describe('learn-math content integrity', () => {
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

    it('every lesson has isFree: true (free access app)', () => {
      const files = getAllLessonFiles();
      const errors = [];
      for (const file of files) {
        const lesson = readJson(file);
        if (lesson.isFree !== true) {
          errors.push(
            `${path.relative(CONTENT_ROOT, file)}: isFree is ${JSON.stringify(lesson.isFree)}, expected true`
          );
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
    const CASE_STUDIES_ROOT = path.join(CONTENT_ROOT, 'case-studies');
    const REQUIRED_CASE_FIELDS = ['id', 'title', 'module', 'summary', 'content', 'image', 'tags'];

    it('has exactly 5 case study files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const fp = path.join(CASE_STUDIES_ROOT, `case-${i}.json`);
        if (!fs.existsSync(fp)) missing.push(`case-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('every case study has all required fields', () => {
      const errors = [];
      for (let i = 1; i <= 5; i++) {
        const fp = path.join(CASE_STUDIES_ROOT, `case-${i}.json`);
        const cs = readJson(fp);
        for (const field of REQUIRED_CASE_FIELDS) {
          if (cs[field] === undefined || cs[field] === null) {
            errors.push(`case-${i}.json: missing field "${field}"`);
          }
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe('simulators', () => {
    const SIMULATORS_ROOT = path.join(CONTENT_ROOT, 'simulators');
    const REQUIRED_SIM_FIELDS = ['id', 'title', 'module', 'description', 'type', 'parameters', 'outputs', 'image', 'tags'];

    it('has exactly 5 simulator files', () => {
      const missing = [];
      for (let i = 1; i <= 5; i++) {
        const fp = path.join(SIMULATORS_ROOT, `sim-${i}.json`);
        if (!fs.existsSync(fp)) missing.push(`sim-${i}.json`);
      }
      expect(missing).toHaveLength(0);
    });

    it('every simulator has all required fields', () => {
      const errors = [];
      for (let i = 1; i <= 5; i++) {
        const fp = path.join(SIMULATORS_ROOT, `sim-${i}.json`);
        const sim = readJson(fp);
        for (const field of REQUIRED_SIM_FIELDS) {
          if (sim[field] === undefined || sim[field] === null) {
            errors.push(`sim-${i}.json: missing field "${field}"`);
          }
        }
      }
      expect(errors).toHaveLength(0);
    });
  });

  describe('image-allocation.json — no duplicate images', () => {
    const allocPath = path.join(CONTENT_ROOT, 'image-allocation.json');

    it('image-allocation.json exists', () => {
      expect(fs.existsSync(allocPath)).toBe(true);
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

    it('every usedBy path references an existing file', () => {
      const alloc = readJson(allocPath);
      const errors = [];
      for (const entry of alloc.images) {
        const fp = path.join(CONTENT_ROOT, entry.usedBy);
        if (!fs.existsSync(fp)) {
          errors.push(`image "${entry.image}" usedBy "${entry.usedBy}" — file not found`);
        }
      }
      expect(errors).toHaveLength(0);
    });
  });
});
