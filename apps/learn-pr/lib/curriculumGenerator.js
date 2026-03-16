/**
 * Curriculum Generator
 *
 * Utilities for generating course structure metadata.
 */

export const moduleTopics = [
  // ── Basic Course (modules 1–10) ──────────────────────────────────────────
  {
    id: 1,
    title: "Introduction to Public Relations",
    description: "Understanding the fundamentals of PR and its role in modern organizations",
    order: 1,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 2,
    title: "Media Relations",
    description: "Building and maintaining effective relationships with journalists and media",
    order: 2,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 3,
    title: "Writing Press Releases",
    description: "Crafting compelling press releases that capture media attention",
    order: 3,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 4,
    title: "Brand Management",
    description: "Building and protecting a strong organizational brand identity",
    order: 4,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 5,
    title: "PR Writing & Storytelling",
    description:
      "Developing compelling narratives and writing across PR formats including pitches, bios, and feature stories",
    order: 5,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 6,
    title: "Event PR & Publicity",
    description: "Planning and promoting events to maximize media coverage and audience engagement",
    order: 6,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 7,
    title: "Internal Communications",
    description:
      "Keeping employees informed, engaged, and aligned through effective internal messaging",
    order: 7,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 8,
    title: "Corporate Social Responsibility",
    description:
      "Communicating CSR initiatives and building trust through purpose-driven organizational messaging",
    order: 8,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 9,
    title: "PR Ethics & Professionalism",
    description:
      "Navigating ethical dilemmas, industry standards, and professional responsibilities in PR",
    order: 9,
    course: "Basic",
    difficulty: "Beginner",
  },
  {
    id: 10,
    title: "PR Basics for Small Business",
    description:
      "Cost-effective PR strategies for startups and small businesses building visibility from scratch",
    order: 10,
    course: "Basic",
    difficulty: "Beginner",
  },

  // ── Intermediate Course (modules 11–20) ──────────────────────────────────
  {
    id: 11,
    title: "Crisis Communication",
    description: "Managing communications during organizational crises and emergencies",
    order: 11,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 12,
    title: "Social Media PR",
    description: "Leveraging social media platforms for effective public relations",
    order: 12,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 13,
    title: "Stakeholder Management",
    description: "Identifying and engaging key stakeholders to build lasting relationships",
    order: 13,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 14,
    title: "Content Marketing for PR",
    description:
      "Integrating content strategy with PR to attract coverage and build organic brand authority",
    order: 14,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 15,
    title: "Influencer Relations",
    description:
      "Identifying, engaging, and managing influencer partnerships to amplify brand stories",
    order: 15,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 16,
    title: "PR Research & Insights",
    description:
      "Using audience research, media monitoring, and competitive analysis to inform PR strategy",
    order: 16,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 17,
    title: "Community Relations",
    description:
      "Building goodwill and lasting partnerships with local communities and interest groups",
    order: 17,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 18,
    title: "Government & Public Affairs",
    description:
      "Engaging with policy-makers, regulators, and government bodies to shape favorable conditions",
    order: 18,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 19,
    title: "Integrated Communications",
    description:
      "Aligning PR with marketing, advertising, and social media for a unified brand voice",
    order: 19,
    course: "Intermediate",
    difficulty: "Intermediate",
  },
  {
    id: 20,
    title: "Reputation Management",
    description:
      "Proactively building and protecting organizational reputation across all channels",
    order: 20,
    course: "Intermediate",
    difficulty: "Intermediate",
  },

  // ── Advanced Course (modules 21–30) ──────────────────────────────────────
  {
    id: 21,
    title: "PR Campaign Strategy",
    description: "Planning and executing strategic PR campaigns from concept to completion",
    order: 21,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 22,
    title: "Digital PR & SEO",
    description: "Integrating digital strategies and SEO into modern PR practice",
    order: 22,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 23,
    title: "PR Measurement & Analytics",
    description: "Measuring PR impact and demonstrating value through data and analytics",
    order: 23,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 24,
    title: "Global PR & Cross-Cultural Communication",
    description:
      "Running international PR campaigns that resonate across languages, cultures, and markets",
    order: 24,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 25,
    title: "PR Technology & AI Tools",
    description:
      "Leveraging AI-powered tools, media databases, and automation to scale PR operations",
    order: 25,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 26,
    title: "Executive Communication Coaching",
    description:
      "Preparing executives for media interviews, keynotes, and high-stakes public appearances",
    order: 26,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 27,
    title: "Corporate Communications Leadership",
    description:
      "Leading a corporate communications function — team structure, budgeting, and board reporting",
    order: 27,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 28,
    title: "PR Agency Management",
    description:
      "Running a PR agency or consultancy — client management, pitching, and business development",
    order: 28,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 29,
    title: "Thought Leadership & Personal Branding",
    description: "Establishing executives and organizations as credible voices in their industry",
    order: 29,
    course: "Advanced",
    difficulty: "Advanced",
  },
  {
    id: 30,
    title: "PR Capstone Project",
    description:
      "Designing and presenting a comprehensive PR campaign strategy for a real-world brief",
    order: 30,
    course: "Advanced",
    difficulty: "Advanced",
  },
];

export const COURSES = [
  {
    id: "basic",
    title: "Basic PR",
    level: "Basic",
    description:
      "Learn PR fundamentals — media relations, press releases, brand management, and ethical practice",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate PR",
    level: "Intermediate",
    description:
      "Master crisis communication, stakeholder management, influencer relations, and integrated campaigns",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced PR",
    level: "Advanced",
    description:
      "Lead strategic PR campaigns, global communications, and agency or corporate PR functions",
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
