/**
 * @iiskills/content-loader
 *
 * Static-first filesystem content loader for iiskills learning apps.
 *
 * This module is **server-only** (Node.js / Next.js getStaticProps).
 * It reads JSON lesson and course files from the `content/` directory at the
 * monorepo root and returns normalised data suitable for static generation.
 *
 * Usage (inside getStaticProps):
 *   const path = require('path');
 *   const { createLoader } = require('@iiskills/content-loader');
 *   const loader = createLoader(path.resolve(process.cwd(), '../../content'));
 *   const lesson = loader.getLesson('learn-physics', '1', '1');
 */

'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Creates a content loader bound to a specific content root directory.
 *
 * @param {string} contentRoot - Absolute path to the `content/` directory.
 * @returns {ContentLoader}
 */
function createLoader(contentRoot) {
  /**
   * Read and parse a JSON file relative to contentRoot.
   * Returns null if the file does not exist.
   * Throws a descriptive error on parse failure (so builds fail loudly).
   *
   * @param {string} relPath - Path relative to contentRoot.
   * @returns {object|null}
   */
  function readJson(relPath) {
    const fullPath = path.join(contentRoot, relPath);
    if (!fs.existsSync(fullPath)) return null;
    const raw = fs.readFileSync(fullPath, 'utf-8');
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(
        `[content-loader] Failed to parse JSON at ${fullPath}: ${err.message}`
      );
    }
  }

  /**
   * Validate that required fields are present in a lesson object.
   * Throws during build if a lesson file is malformed.
   *
   * @param {object} lesson
   * @param {string} filePath - Used in the error message.
   */
  function validateLesson(lesson, filePath) {
    const required = ['moduleId', 'lessonId', 'title', 'content', 'quiz'];
    for (const field of required) {
      if (lesson[field] === undefined || lesson[field] === null) {
        throw new Error(
          `[content-loader] Missing required field "${field}" in lesson file: ${filePath}`
        );
      }
    }
    if (!Array.isArray(lesson.quiz) || lesson.quiz.length === 0) {
      throw new Error(
        `[content-loader] "quiz" must be a non-empty array in: ${filePath}`
      );
    }
  }

  /**
   * Validate that required fields are present in a course object.
   *
   * @param {object} course
   * @param {string} filePath
   */
  function validateCourse(course, filePath) {
    const required = ['appSlug', 'title', 'modules'];
    for (const field of required) {
      if (course[field] === undefined || course[field] === null) {
        throw new Error(
          `[content-loader] Missing required field "${field}" in course file: ${filePath}`
        );
      }
    }
  }

  return {
    /**
     * Returns course metadata for the given app slug.
     * Returns null if no course.json exists for the app.
     *
     * @param {string} appSlug - e.g. 'learn-physics'
     * @returns {object|null}
     */
    getCourse(appSlug) {
      const relPath = `${appSlug}/course.json`;
      const course = readJson(relPath);
      if (course) {
        validateCourse(course, path.join(contentRoot, relPath));
      }
      return course;
    },

    /**
     * Returns all modules defined in the course.json for the given app.
     * Returns an empty array if no course.json exists.
     *
     * @param {string} appSlug
     * @returns {object[]}
     */
    listModules(appSlug) {
      const course = this.getCourse(appSlug);
      return course ? course.modules : [];
    },

    /**
     * Returns all lesson files found in `content/<appSlug>/lessons/module-<moduleId>/`.
     * Returns an empty array if the directory does not exist.
     *
     * @param {string} appSlug
     * @param {string|number} moduleId
     * @returns {object[]}
     */
    listLessons(appSlug, moduleId) {
      const dir = path.join(
        contentRoot,
        `${appSlug}/lessons/module-${moduleId}`
      );
      if (!fs.existsSync(dir)) return [];

      return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith('.json'))
        .map((f) => {
          const relPath = `${appSlug}/lessons/module-${moduleId}/${f}`;
          const lesson = readJson(relPath);
          if (lesson) {
            validateLesson(lesson, path.join(contentRoot, relPath));
          }
          return lesson;
        })
        .filter(Boolean)
        .sort((a, b) => Number(a.lessonId) - Number(b.lessonId));
    },

    /**
     * Returns a single lesson, or null if the file does not exist.
     *
     * @param {string} appSlug
     * @param {string|number} moduleId
     * @param {string|number} lessonId
     * @returns {object|null}
     */
    getLesson(appSlug, moduleId, lessonId) {
      const relPath = `${appSlug}/lessons/module-${moduleId}/lesson-${lessonId}.json`;
      const lesson = readJson(relPath);
      if (lesson) {
        validateLesson(lesson, path.join(contentRoot, relPath));
      }
      return lesson;
    },
  };
}

module.exports = { createLoader };
