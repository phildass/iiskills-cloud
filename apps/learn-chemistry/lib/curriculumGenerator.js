/**
 * Curriculum Generator - Chemistry
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Introduction to Chemistry",
    description: "Matter, elements, and the periodic table",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Atomic Structure",
    description: "Atoms, electrons, and atomic models",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Chemical Bonding",
    description: "Ionic, covalent, and metallic bonds",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "States of Matter",
    description: "Solids, liquids, gases, and phase changes",
    order: 4,
    difficulty: "Intermediate"
  },
  {
    id: 5,
    title: "Chemical Reactions",
    description: "Types of reactions and balancing equations",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Stoichiometry",
    description: "Quantitative relationships in chemical reactions",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Organic Chemistry",
    description: "Carbon compounds and functional groups",
    order: 7,
    difficulty: "Advanced"
  },
  {
    id: 8,
    title: "Chemical Kinetics",
    description: "Reaction rates and mechanisms",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "Thermochemistry",
    description: "Energy changes in chemical reactions",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Advanced Topics",
    description: "Electrochemistry and quantum chemistry",
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
