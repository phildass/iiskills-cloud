/**
 * Curriculum Generator - Geography
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Physical Geography",
    description: "Landforms, climate, and natural features",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "World Continents",
    description: "Exploring the seven continents",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Oceans and Seas",
    description: "Marine geography and ocean systems",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Climate Zones",
    description: "Understanding global climate patterns",
    order: 4,
    difficulty: "Intermediate"
  },
  {
    id: 5,
    title: "Human Geography",
    description: "Population, culture, and urbanization",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Economic Geography",
    description: "Resources, trade, and development",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Environmental Issues",
    description: "Climate change and sustainability",
    order: 7,
    difficulty: "Advanced"
  },
  {
    id: 8,
    title: "Geopolitics",
    description: "Political boundaries and global relations",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "Geographic Information Systems",
    description: "GIS technology and mapping",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Advanced Topics",
    description: "Remote sensing and spatial analysis",
    order: 10,
    difficulty: "Advanced"
  }
];

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
  return moduleTopics.find(m => m.id === id);
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
  return moduleTopics.filter(m => m.difficulty === level);
}

/**
 * Get content organized by level
 */
export function getContentByLevel() {
  return {
    Beginner: moduleTopics.filter(m => m.difficulty === 'Beginner'),
    Intermediate: moduleTopics.filter(m => m.difficulty === 'Intermediate'),
    Advanced: moduleTopics.filter(m => m.difficulty === 'Advanced')
  };
}
