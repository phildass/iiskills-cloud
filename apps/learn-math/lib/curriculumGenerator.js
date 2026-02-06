/**
 * Curriculum Generator - Math
 * 
 * Utilities for generating course structure metadata.
 * Now using unified content format from /data/math-content.js
 */

import { 
  getAllMathModules, 
  getMathModuleById,
  getMathModulesByLevel,
  mathContent 
} from '../../../data/math-content';

// Export modules in the format expected by existing code
export const moduleTopics = getAllMathModules().map(module => ({
  id: module.id,
  title: module.title,
  description: module.description,
  order: module.id,
  difficulty: module.level
}));

/**
 * Generate lesson metadata for a module
 */
export function generateLessonMetadata(moduleId, lessonNumber) {
  return {
    id: (moduleId - 1) * 10 + lessonNumber,
    module_id: moduleId,
    title: `Lesson ${lessonNumber}`,
    order: lessonNumber,
    duration_minutes: 15,
    is_free: lessonNumber === 1
  };
}

/**
 * Generate quiz questions template
 */
export function generateQuizTemplate() {
  return Array(5).fill(null).map((_, i) => ({
    question: `Question ${i + 1}`,
    options: ['Option A', 'Option B', 'Option C', 'Option D'],
    correct_answer: 0,
    explanation: 'Explanation here'
  }));
}

/**
 * Get module by ID
 */
export function getModuleById(id) {
  return getMathModuleById(id);
}

/**
 * Get all modules
 */
export function getAllModules() {
  return moduleTopics;
}

/**
 * Get modules by level
 */
export function getModulesByLevel(level) {
  return getMathModulesByLevel(level);
}

/**
 * Get content organized by level
 */
export function getContentByLevel() {
  return mathContent;
}
