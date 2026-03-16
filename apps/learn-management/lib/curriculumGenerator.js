/**
 * Curriculum Generator
 *
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  // ── Basic Course (modules 1–10) ──────────────────────────────────────────
  {
    id: 1,
    title: "Foundations of Management",
    description: "Core principles and theories that underpin effective management practice",
    order: 1,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Leadership Principles",
    description: "Developing the mindset and skills of an effective modern leader",
    order: 2,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 3,
    title: "Strategic Planning",
    description: "Setting organizational direction through goal-setting and strategic frameworks",
    order: 3,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Organizational Behavior",
    description: "Understanding how individuals and groups behave within organizations",
    order: 4,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "Communication Skills",
    description:
      "Developing clear, confident communication across written, verbal, and presentation formats",
    order: 5,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 6,
    title: "Problem Solving",
    description: "Structured approaches for diagnosing issues and developing effective solutions",
    order: 6,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 7,
    title: "Decision Making",
    description: "Frameworks and tools for making sound decisions under uncertainty and complexity",
    order: 7,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 8,
    title: "Time Management",
    description: "Prioritizing work, managing energy, and building productive habits as a manager",
    order: 8,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 9,
    title: "Conflict Resolution",
    description: "Navigating workplace conflict constructively and turning tension into growth",
    order: 9,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 10,
    title: "Meeting Management",
    description:
      "Running efficient, purposeful meetings that drive decisions and respect everyone's time",
    order: 10,
    course: "Basic",
    difficulty: "Beginner",
  },

  // ── Intermediate Course (modules 11–20) ──────────────────────────────────
  {
    id: 11,
    title: "Team Building & Motivation",
    description: "Building high-performing teams and fostering a culture of engagement",
    order: 11,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 12,
    title: "Financial Management",
    description: "Budgeting, financial analysis, and resource allocation for managers",
    order: 12,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 13,
    title: "Operations Management",
    description: "Optimizing processes, workflows, and operational efficiency",
    order: 13,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 14,
    title: "Stakeholder Management",
    description:
      "Identifying, aligning, and communicating with stakeholders to ensure project and organizational success",
    order: 14,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 15,
    title: "Risk Management",
    description:
      "Identifying, assessing, and mitigating organizational and project risks proactively",
    order: 15,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 16,
    title: "Business Analysis",
    description:
      "Gathering requirements, modeling processes, and translating business needs into actionable plans",
    order: 16,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 17,
    title: "Process Improvement",
    description:
      "Applying Lean, Six Sigma, and continuous improvement methodologies to streamline operations",
    order: 17,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 18,
    title: "Negotiation Skills",
    description: "Negotiating deals, resources, and outcomes with confidence and mutual benefit",
    order: 18,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 19,
    title: "Performance Management",
    description:
      "Setting goals, providing feedback, and conducting reviews to drive individual and team performance",
    order: 19,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 20,
    title: "Data-Driven Management",
    description: "Using data, dashboards, and KPIs to make informed management decisions",
    order: 20,
    course: "Intermediate",
    difficulty: "Intermediate",
  },

  // ── Advanced Course (modules 21–30) ──────────────────────────────────────
  {
    id: 21,
    title: "Change Management",
    description: "Leading organizational change and managing resistance effectively",
    order: 21,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 22,
    title: "HR & Talent Management",
    description: "Recruiting, developing, and retaining top talent in your organization",
    order: 22,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 23,
    title: "Project Management",
    description: "Delivering projects on time, within scope and budget using proven methodologies",
    order: 23,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 24,
    title: "Corporate Governance",
    description:
      "Understanding board structures, accountability frameworks, and ethical leadership at the executive level",
    order: 24,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 25,
    title: "Executive Leadership",
    description:
      "Developing the vision, influence, and resilience required to lead at the highest organizational levels",
    order: 25,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 26,
    title: "Digital Transformation",
    description:
      "Leading technology-driven transformation initiatives and building a culture of digital innovation",
    order: 26,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 27,
    title: "Organizational Design",
    description:
      "Structuring teams, roles, and reporting lines to maximize organizational effectiveness",
    order: 27,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 28,
    title: "Innovation Management",
    description:
      "Creating systems and cultures that consistently generate, evaluate, and implement new ideas",
    order: 28,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 29,
    title: "Global Management",
    description:
      "Managing across cultures, geographies, and regulatory environments in a globalized economy",
    order: 29,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 30,
    title: "Management Capstone",
    description:
      "Integrating the full management curriculum in a real-world leadership challenge and reflection",
    order: 30,
    course: "Advanced",
    difficulty: "Advanced",
  },
];

export const COURSES = [
  {
    id: "basic",
    title: "Basic Management",
    level: "Basic",
    description:
      "Build your management foundation with leadership, communication, and decision-making essentials",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Management",
    level: "Intermediate",
    description:
      "Develop practical management skills in finance, operations, risk, and performance management",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Management",
    level: "Advanced",
    description:
      "Master executive leadership, digital transformation, and organizational strategy at scale",
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
