/**
 * Curriculum Generator
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Understanding the fundamentals of Artificial Intelligence",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Types of AI",
    description: "Exploring different categories and applications of AI",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Building the foundation for AI with data science",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Python for AI",
    description: "Learning Python programming for AI applications",
    order: 4,
    difficulty: "Beginner"
  },
  {
    id: 5,
    title: "Supervised Learning",
    description: "Understanding supervised machine learning algorithms",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Unsupervised Learning",
    description: "Exploring clustering and dimensionality reduction",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Neural Networks",
    description: "Deep dive into neural network architectures",
    order: 7,
    difficulty: "Intermediate"
  },
  {
    id: 8,
    title: "AI Monetization",
    description: "Turning AI skills into income streams",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "AI Tools & Frameworks",
    description: "Mastering popular AI tools and platforms",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Career Pathways in AI",
    description: "Building a successful career in artificial intelligence",
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
