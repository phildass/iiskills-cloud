/**
 * Curriculum Generator
 * 
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  {
    id: 1,
    title: "Foundations of Management",
    description: "Core principles and theories that underpin effective management practice",
    order: 1,
    difficulty: "Beginner"
  },
  {
    id: 2,
    title: "Leadership Principles",
    description: "Developing the mindset and skills of an effective modern leader",
    order: 2,
    difficulty: "Beginner"
  },
  {
    id: 3,
    title: "Strategic Planning",
    description: "Setting organizational direction through goal-setting and strategic frameworks",
    order: 3,
    difficulty: "Beginner"
  },
  {
    id: 4,
    title: "Organizational Behavior",
    description: "Understanding how individuals and groups behave within organizations",
    order: 4,
    difficulty: "Beginner"
  },
  {
    id: 5,
    title: "Team Building & Motivation",
    description: "Building high-performing teams and fostering a culture of engagement",
    order: 5,
    difficulty: "Intermediate"
  },
  {
    id: 6,
    title: "Financial Management",
    description: "Budgeting, financial analysis, and resource allocation for managers",
    order: 6,
    difficulty: "Intermediate"
  },
  {
    id: 7,
    title: "Operations Management",
    description: "Optimizing processes, workflows, and operational efficiency",
    order: 7,
    difficulty: "Intermediate"
  },
  {
    id: 8,
    title: "Change Management",
    description: "Leading organizational change and managing resistance effectively",
    order: 8,
    difficulty: "Advanced"
  },
  {
    id: 9,
    title: "HR & Talent Management",
    description: "Recruiting, developing, and retaining top talent in your organization",
    order: 9,
    difficulty: "Advanced"
  },
  {
    id: 10,
    title: "Project Management",
    description: "Delivering projects on time, within scope and budget using proven methodologies",
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
