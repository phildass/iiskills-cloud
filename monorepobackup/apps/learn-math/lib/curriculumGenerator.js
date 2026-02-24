/**
 * Curriculum Generator - Math
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Number Systems",
    description: "Understanding integers, fractions, and real numbers",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Basic Algebra",
    description: "Variables, expressions, and linear equations",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Geometry Fundamentals",
    description: "Shapes, angles, and geometric properties",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Trigonometry",
    description: "Trigonometric functions and identities",
    order: 4,
    difficulty: "Intermediate"
  },
  {
    id: 5,
    title: "Advanced Algebra",
    description: "Quadratic equations, polynomials, and functions",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Calculus I",
    description: "Limits, derivatives, and differentiation",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Calculus II",
    description: "Integration and applications",
    order: 7,
    difficulty: "Advanced"
  },
  {
    id: 8,
    title: "Statistics",
    description: "Probability, distributions, and statistical inference",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "Linear Algebra",
    description: "Vectors, matrices, and transformations",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Advanced Topics",
    description: "Differential equations and complex analysis",
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
