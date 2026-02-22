/**
 * Tests for @iiskills/content-loader
 *
 * Verifies the content loader reads JSON files correctly, validates required
 * fields, and returns null (not an error) for missing files.
 */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const { createLoader } = require('../packages/content-loader/src/index');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'content-loader-test-'));
}

function writeJson(dir, relPath, data) {
  const fullPath = path.join(dir, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, JSON.stringify(data), 'utf-8');
}

const VALID_LESSON = {
  moduleId: 1,
  lessonId: 1,
  title: 'Test Lesson',
  isFree: true,
  content: '<p>Hello world</p>',
  quiz: [
    {
      question: 'What is 1+1?',
      options: ['1', '2', '3', '4'],
      correct_answer: 1,
    },
  ],
};

const VALID_COURSE = {
  appSlug: 'test-app',
  title: 'Test Course',
  modules: [{ id: 1, title: 'Module 1', level: 'basic', order: 1, lessonCount: 1 }],
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('@iiskills/content-loader', () => {
  let tmpDir;
  let loader;

  beforeEach(() => {
    tmpDir = makeTempDir();
    loader = createLoader(tmpDir);
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe('getLesson', () => {
    it('returns null when lesson file does not exist', () => {
      expect(loader.getLesson('test-app', 1, 1)).toBeNull();
    });

    it('returns parsed lesson data when file exists', () => {
      writeJson(tmpDir, 'test-app/lessons/module-1/lesson-1.json', VALID_LESSON);
      const lesson = loader.getLesson('test-app', 1, 1);
      expect(lesson).not.toBeNull();
      expect(lesson.title).toBe('Test Lesson');
      expect(lesson.isFree).toBe(true);
      expect(Array.isArray(lesson.quiz)).toBe(true);
    });

    it('throws on malformed JSON', () => {
      const fullPath = path.join(tmpDir, 'test-app/lessons/module-1/lesson-1.json');
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, 'not valid json', 'utf-8');
      expect(() => loader.getLesson('test-app', 1, 1)).toThrow(/Failed to parse JSON/);
    });

    it('throws when required field is missing', () => {
      const badLesson = { ...VALID_LESSON };
      delete badLesson.content;
      writeJson(tmpDir, 'test-app/lessons/module-1/lesson-1.json', badLesson);
      expect(() => loader.getLesson('test-app', 1, 1)).toThrow(/Missing required field "content"/);
    });

    it('throws when quiz is empty', () => {
      const badLesson = { ...VALID_LESSON, quiz: [] };
      writeJson(tmpDir, 'test-app/lessons/module-1/lesson-1.json', badLesson);
      expect(() => loader.getLesson('test-app', 1, 1)).toThrow(/"quiz" must be a non-empty array/);
    });
  });

  describe('getCourse', () => {
    it('returns null when course.json does not exist', () => {
      expect(loader.getCourse('test-app')).toBeNull();
    });

    it('returns parsed course data when file exists', () => {
      writeJson(tmpDir, 'test-app/course.json', VALID_COURSE);
      const course = loader.getCourse('test-app');
      expect(course).not.toBeNull();
      expect(course.title).toBe('Test Course');
      expect(Array.isArray(course.modules)).toBe(true);
    });

    it('throws when required course field is missing', () => {
      const badCourse = { title: 'No slug', modules: [] };
      writeJson(tmpDir, 'test-app/course.json', badCourse);
      expect(() => loader.getCourse('test-app')).toThrow(/Missing required field "appSlug"/);
    });
  });

  describe('listModules', () => {
    it('returns empty array when no course.json', () => {
      expect(loader.listModules('test-app')).toEqual([]);
    });

    it('returns modules from course.json', () => {
      writeJson(tmpDir, 'test-app/course.json', VALID_COURSE);
      const modules = loader.listModules('test-app');
      expect(modules).toHaveLength(1);
      expect(modules[0].title).toBe('Module 1');
    });
  });

  describe('listLessons', () => {
    it('returns empty array when module directory does not exist', () => {
      expect(loader.listLessons('test-app', 1)).toEqual([]);
    });

    it('returns sorted lessons from module directory', () => {
      const lesson2 = { ...VALID_LESSON, lessonId: 2, title: 'Lesson 2' };
      writeJson(tmpDir, 'test-app/lessons/module-1/lesson-1.json', VALID_LESSON);
      writeJson(tmpDir, 'test-app/lessons/module-1/lesson-2.json', lesson2);
      const lessons = loader.listLessons('test-app', 1);
      expect(lessons).toHaveLength(2);
      expect(lessons[0].lessonId).toBe(1);
      expect(lessons[1].lessonId).toBe(2);
    });
  });
});
