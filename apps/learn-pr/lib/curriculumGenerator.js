/**
 * Curriculum Generator
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Introduction to Public Relations",
    description: "Understanding the fundamentals of PR and its role in modern organizations",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Media Relations",
    description: "Building and maintaining effective relationships with journalists and media",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Writing Press Releases",
    description: "Crafting compelling press releases that capture media attention",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Brand Management",
    description: "Building and protecting a strong organizational brand identity",
    order: 4,
    difficulty: "Beginner"
  },
  {
    id: 5,
    title: "Crisis Communication",
    description: "Managing communications during organizational crises and emergencies",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Social Media PR",
    description: "Leveraging social media platforms for effective public relations",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Stakeholder Management",
    description: "Identifying and engaging key stakeholders to build lasting relationships",
    order: 7,
    difficulty: "Intermediate"
  },
  {
    id: 8,
    title: "PR Campaign Strategy",
    description: "Planning and executing strategic PR campaigns from concept to completion",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "Digital PR & SEO",
    description: "Integrating digital strategies and SEO into modern PR practice",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "PR Measurement & Analytics",
    description: "Measuring PR impact and demonstrating value through data and analytics",
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
