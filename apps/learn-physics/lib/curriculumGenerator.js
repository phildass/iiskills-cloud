/**
 * Curriculum Generator - Physics
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Classical Mechanics",
    description: "Understanding motion, forces, and energy",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Newton's Laws",
    description: "Exploring the fundamental laws of motion",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Work and Energy",
    description: "Understanding energy transformations and conservation",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Thermodynamics",
    description: "Heat, temperature, and the laws of thermodynamics",
    order: 4,
    difficulty: "Intermediate"
  },
  {
    id: 5,
    title: "Electricity and Magnetism",
    description: "Electric fields, circuits, and magnetic phenomena",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Waves and Optics",
    description: "Wave properties, sound, and light",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Modern Physics",
    description: "Quantum mechanics and special relativity",
    order: 7,
    difficulty: "Advanced"
  },
  {
    id: 8,
    title: "Nuclear Physics",
    description: "Atomic nuclei, radioactivity, and nuclear reactions",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "Astrophysics",
    description: "Understanding celestial objects and cosmology",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Advanced Topics",
    description: "Particle physics and quantum field theory",
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
