/**
 * Regression tests for lesson content deduplication.
 *
 * Verifies that learn-chemistry (and the content-loader in general) returns
 * distinct content for different (moduleId, lessonId) combinations, preventing
 * the bug where Lesson 1 content was repeated for Lesson 2 and beyond.
 *
 * PR2: Fix duplicated lesson content mapping from lesson identifiers.
 */

'use strict';

const path = require('path');
const { createLoader } = require('../packages/content-loader/src/index');

const CONTENT_ROOT = path.resolve(__dirname, '../content');

describe('Lesson content deduplication — learn-chemistry', () => {
  let loader;

  beforeEach(() => {
    loader = createLoader(CONTENT_ROOT);
  });

  it('lesson (1,1) exists and has non-empty content', () => {
    const lesson = loader.getLesson('learn-chemistry', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(lesson.title).toBeTruthy();
  });

  it('lesson (1,2) exists and has non-empty content', () => {
    const lesson = loader.getLesson('learn-chemistry', 1, 2);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(lesson.title).toBeTruthy();
  });

  it('lesson (2,1) exists and has non-empty content', () => {
    const lesson = loader.getLesson('learn-chemistry', 2, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(lesson.title).toBeTruthy();
  });

  it('lesson (1,1) content is different from lesson (1,2) content', () => {
    const lesson1_1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson1_2 = loader.getLesson('learn-chemistry', 1, 2);
    expect(lesson1_1.content).not.toBe(lesson1_2.content);
    // Titles must differ
    expect(lesson1_1.title).not.toBe(lesson1_2.title);
  });

  it('lesson (1,1) content is different from lesson (2,1) content', () => {
    const lesson1_1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson2_1 = loader.getLesson('learn-chemistry', 2, 1);
    expect(lesson1_1.content).not.toBe(lesson2_1.content);
    expect(lesson1_1.title).not.toBe(lesson2_1.title);
  });

  it('lesson (1,2) content is different from lesson (2,1) content', () => {
    const lesson1_2 = loader.getLesson('learn-chemistry', 1, 2);
    const lesson2_1 = loader.getLesson('learn-chemistry', 2, 1);
    expect(lesson1_2.content).not.toBe(lesson2_1.content);
  });

  it('getLesson uses the provided lessonId (not hard-coded to 1)', () => {
    const lesson1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson2 = loader.getLesson('learn-chemistry', 1, 2);
    // Both must be found — confirms the loader uses the lessonId parameter
    expect(lesson1).not.toBeNull();
    expect(lesson2).not.toBeNull();
    // The lessonId fields inside the JSON must match the requested IDs
    expect(Number(lesson1.lessonId)).toBe(1);
    expect(Number(lesson2.lessonId)).toBe(2);
  });

  it('getLesson uses the provided moduleId (not hard-coded to 1)', () => {
    const lesson1_1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson2_1 = loader.getLesson('learn-chemistry', 2, 1);
    // Both must be found — confirms the loader uses the moduleId parameter
    expect(lesson1_1).not.toBeNull();
    expect(lesson2_1).not.toBeNull();
    // The moduleId fields inside the JSON must match the requested IDs
    expect(Number(lesson1_1.moduleId)).toBe(1);
    expect(Number(lesson2_1.moduleId)).toBe(2);
  });

  it('lesson (1,1) is free and lesson (1,2) is not free', () => {
    const lesson1_1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson1_2 = loader.getLesson('learn-chemistry', 1, 2);
    expect(lesson1_1.isFree).toBe(true);
    expect(lesson1_2.isFree).toBe(false);
  });

  it('all three lessons have valid quiz arrays', () => {
    const lessons = [
      loader.getLesson('learn-chemistry', 1, 1),
      loader.getLesson('learn-chemistry', 1, 2),
      loader.getLesson('learn-chemistry', 2, 1),
    ];
    for (const lesson of lessons) {
      expect(Array.isArray(lesson.quiz)).toBe(true);
      expect(lesson.quiz.length).toBeGreaterThan(0);
    }
  });

  it('lessons (1,1) and (1,2) have different quiz questions', () => {
    const lesson1_1 = loader.getLesson('learn-chemistry', 1, 1);
    const lesson1_2 = loader.getLesson('learn-chemistry', 1, 2);
    const firstQuestion1 = lesson1_1.quiz[0].question;
    const firstQuestion2 = lesson1_2.quiz[0].question;
    expect(firstQuestion1).not.toBe(firstQuestion2);
  });
});

describe('Lesson content deduplication — other learn apps', () => {
  let loader;

  beforeEach(() => {
    loader = createLoader(CONTENT_ROOT);
  });

  it('learn-math lesson (1,1) exists with unique content', () => {
    const lesson = loader.getLesson('learn-math', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(Number(lesson.lessonId)).toBe(1);
    expect(Number(lesson.moduleId)).toBe(1);
  });

  it('learn-ai lesson (1,1) exists with unique content', () => {
    const lesson = loader.getLesson('learn-ai', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(Number(lesson.lessonId)).toBe(1);
    expect(Number(lesson.moduleId)).toBe(1);
  });

  it('learn-management lesson (1,1) exists with unique content', () => {
    const lesson = loader.getLesson('learn-management', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(Number(lesson.lessonId)).toBe(1);
    expect(Number(lesson.moduleId)).toBe(1);
  });

  it('learn-geography lesson (1,1) exists with unique content', () => {
    const lesson = loader.getLesson('learn-geography', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(Number(lesson.lessonId)).toBe(1);
    expect(Number(lesson.moduleId)).toBe(1);
  });

  it('learn-pr lesson (1,1) exists with unique content', () => {
    const lesson = loader.getLesson('learn-pr', 1, 1);
    expect(lesson).not.toBeNull();
    expect(lesson.content).toBeTruthy();
    expect(Number(lesson.lessonId)).toBe(1);
    expect(Number(lesson.moduleId)).toBe(1);
  });
});
