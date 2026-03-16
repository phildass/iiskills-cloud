/**
 * Curriculum Generator
 *
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  // ── Basic Course (modules 1–10) ──────────────────────────────────────────
  {
    id: 1,
    title: "Introduction to AI",
    description: "Understanding the fundamentals of Artificial Intelligence",
    order: 1,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Types of AI",
    description: "Exploring different categories and applications of AI",
    order: 2,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Building the foundation for AI with data science",
    order: 3,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Python for AI",
    description: "Learning Python programming for AI applications",
    order: 4,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "Prompt Engineering",
    description: "Crafting effective prompts to get the best results from AI systems",
    order: 5,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 6,
    title: "AI Ethics",
    description: "Understanding the ethical implications and responsibilities in AI development",
    order: 6,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 7,
    title: "NLP Basics",
    description: "Introduction to natural language processing concepts and applications",
    order: 7,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 8,
    title: "Computer Vision Intro",
    description: "Fundamentals of how machines interpret and understand visual information",
    order: 8,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 9,
    title: "AI in Business",
    description: "Applying AI solutions to real-world business problems and opportunities",
    order: 9,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 10,
    title: "AI Tools Basics",
    description: "Getting started with popular AI tools and platforms for everyday use",
    order: 10,
    course: "Basic",
    difficulty: "Beginner",
  },

  // ── Intermediate Course (modules 11–20) ──────────────────────────────────
  {
    id: 11,
    title: "Supervised Learning",
    description: "Understanding supervised machine learning algorithms",
    order: 11,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 12,
    title: "Unsupervised Learning",
    description: "Exploring clustering and dimensionality reduction",
    order: 12,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 13,
    title: "Neural Networks",
    description: "Deep dive into neural network architectures",
    order: 13,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 14,
    title: "Deep Learning",
    description: "Building and training deep neural networks for complex tasks",
    order: 14,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 15,
    title: "Reinforcement Learning",
    description: "Training agents to make decisions through reward-based feedback loops",
    order: 15,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 16,
    title: "NLP Advanced",
    description: "Advanced natural language processing techniques including transformers and BERT",
    order: 16,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 17,
    title: "Computer Vision Advanced",
    description: "Advanced techniques for object detection, segmentation, and image generation",
    order: 17,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 18,
    title: "Feature Engineering",
    description: "Transforming raw data into meaningful features to improve model performance",
    order: 18,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 19,
    title: "Model Evaluation",
    description: "Assessing model performance with metrics, validation strategies, and tuning",
    order: 19,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 20,
    title: "AI APIs",
    description: "Integrating third-party AI services and APIs into applications",
    order: 20,
    course: "Intermediate",
    difficulty: "Intermediate",
  },

  // ── Advanced Course (modules 21–30) ──────────────────────────────────────
  {
    id: 21,
    title: "AI Monetization",
    description: "Turning AI skills into income streams",
    order: 21,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 22,
    title: "AI Tools & Frameworks",
    description: "Mastering popular AI tools and platforms",
    order: 22,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 23,
    title: "Career Pathways in AI",
    description: "Building a successful career in artificial intelligence",
    order: 23,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 24,
    title: "Large Language Models",
    description: "Understanding, fine-tuning, and deploying large language models at scale",
    order: 24,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 25,
    title: "Generative AI",
    description: "Building generative models including GANs, VAEs, and diffusion models",
    order: 25,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 26,
    title: "AI Product Management",
    description: "Designing, scoping, and shipping AI-powered products from idea to launch",
    order: 26,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 27,
    title: "MLOps",
    description: "Operationalizing machine learning models with CI/CD, monitoring, and automation",
    order: 27,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 28,
    title: "AI Safety",
    description: "Principles and practices for building safe, aligned, and trustworthy AI systems",
    order: 28,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 29,
    title: "Emerging AI Trends",
    description: "Exploring frontier research and upcoming developments shaping the future of AI",
    order: 29,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 30,
    title: "Capstone Projects",
    description: "End-to-end AI projects that demonstrate mastery across the full curriculum",
    order: 30,
    course: "Advanced",
    difficulty: "Advanced",
  },
];

export const COURSES = [
  {
    id: "basic",
    title: "Basic AI",
    level: "Basic",
    description: "Build your AI foundation with core concepts, Python, and practical AI tools",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate AI",
    level: "Intermediate",
    description: "Master machine learning algorithms, neural networks, and advanced AI techniques",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced AI",
    level: "Advanced",
    description: "Deploy production AI systems, explore LLMs, generative AI, and MLOps",
    moduleRange: [21, 30],
    moduleCount: 10,
    lessonCount: 100,
    color: "purple",
    emoji: "🟣",
    startModuleId: 21,
  },
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
    is_free: lessonNumber === 1,
  };
}

/**
 * Generate quiz questions template
 */
export function generateQuizTemplate() {
  return Array(5)
    .fill(null)
    .map((_, i) => ({
      question: `Question ${i + 1}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct_answer: 0,
      explanation: "Explanation here",
    }));
}

/**
 * Get module by ID
 */
export function getModuleById(id) {
  return moduleTopics.find((m) => m.id === id);
}

/**
 * Get all modules
 */
export function getAllModules() {
  return moduleTopics;
}

/**
 * Get modules filtered by course level (Basic / Intermediate / Advanced)
 */
export function getModulesByCourse(courseLevel) {
  return moduleTopics.filter((m) => m.course === courseLevel);
}

/**
 * Get all modules grouped by course level
 */
export function getContentByLevel() {
  return {
    Basic: getModulesByCourse("Basic"),
    Intermediate: getModulesByCourse("Intermediate"),
    Advanced: getModulesByCourse("Advanced"),
  };
}
