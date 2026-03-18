/**
 * Curriculum Generator — Public Relations Professional
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    id: 1,
    slug: "basic",
    title: "Basic Course",
    subtitle: "PR Fundamentals",
    description: "Learn the core principles and skills of public relations.",
    difficulty: "Beginner",
    order: 1,
    module_ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    module_count: 10,
    lesson_count: 100,
  },
  {
    id: 2,
    slug: "intermediate",
    title: "Intermediate Course",
    subtitle: "Modern PR Practice",
    description: "Deploy advanced PR tools including social media, crisis comms, and campaigns.",
    difficulty: "Intermediate",
    order: 2,
    module_ids: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    module_count: 10,
    lesson_count: 100,
  },
  {
    id: 3,
    slug: "advanced",
    title: "Advanced Course",
    subtitle: "Strategic Communications",
    description: "Lead high-stakes communications at the executive and global level.",
    difficulty: "Advanced",
    order: 3,
    module_ids: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    module_count: 10,
    lesson_count: 100,
  },
];

export const COURSES = [
  {
    id: "basic",
    title: "Basic PR",
    level: "Basic",
    description: "Learn the core principles and skills of public relations.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate PR",
    level: "Intermediate",
    description: "Deploy advanced PR tools including social media, crisis comms, and campaigns.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced PR",
    level: "Advanced",
    description: "Lead high-stakes communications at the executive and global level.",
    moduleRange: [21, 30],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟣",
    startModuleId: 21,
  },
];

export const moduleTopics = [
  {
    id: 1,
    course_id: 1,
    course_title: "Basic Course",
    title: "Introduction to Public Relations",
    description: "What PR is, its history, and its role in organizations",
    difficulty: "Beginner",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 2,
    course_id: 1,
    course_title: "Basic Course",
    title: "Media Relations",
    description: "Building journalist relationships, media lists, and pitching",
    difficulty: "Beginner",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 3,
    course_id: 1,
    course_title: "Basic Course",
    title: "Press Release Writing",
    description: "Structure, tone, newsworthiness, and distribution",
    difficulty: "Beginner",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 4,
    course_id: 1,
    course_title: "Basic Course",
    title: "Brand Building & Identity",
    description: "Brand narrative, voice, visual identity, and positioning",
    difficulty: "Beginner",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 5,
    course_id: 1,
    course_title: "Basic Course",
    title: "Communications Planning",
    description: "Objectives, audience, key messages, and timelines",
    difficulty: "Beginner",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 6,
    course_id: 1,
    course_title: "Basic Course",
    title: "Storytelling for PR",
    description: "Narrative frameworks, emotional appeal, and human interest",
    difficulty: "Beginner",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 7,
    course_id: 1,
    course_title: "Basic Course",
    title: "Pitching to Media",
    description: "Hooks, angles, follow-ups, and building editorial interest",
    difficulty: "Beginner",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 8,
    course_id: 1,
    course_title: "Basic Course",
    title: "Internal Communications",
    description: "Employee engagement, intranet content, and change comms",
    difficulty: "Beginner",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 9,
    course_id: 1,
    course_title: "Basic Course",
    title: "PR Writing Styles",
    description: "Tone of voice, clarity, AP style, and audience adaptation",
    difficulty: "Beginner",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 10,
    course_id: 1,
    course_title: "Basic Course",
    title: "Event PR & Launch Communications",
    description: "Product launches, press events, and media coverage",
    difficulty: "Beginner",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 11,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Crisis Communications",
    description: "Response frameworks, dark sites, spokesperson training",
    difficulty: "Intermediate",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 12,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Social Media PR",
    description: "Platform strategy, community management, and social listening",
    difficulty: "Intermediate",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 13,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Influencer Relations",
    description: "Identifying, vetting, briefing, and measuring influencer partnerships",
    difficulty: "Intermediate",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 14,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Content Marketing for PR",
    description: "Thought leadership, blog strategy, and earned media amplification",
    difficulty: "Intermediate",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 15,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Digital PR Tools & Analytics",
    description: "Monitoring tools, coverage tracking, and PR metrics",
    difficulty: "Intermediate",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 16,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Stakeholder Engagement",
    description: "Mapping stakeholders, engagement strategies, and relationship management",
    difficulty: "Intermediate",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 17,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "PR Campaign Planning",
    description: "Research, objectives, tactics, budget, and evaluation",
    difficulty: "Intermediate",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 18,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Measurement & Evaluation in PR",
    description: "Barcelona Principles, AVE debate, and outcome measurement",
    difficulty: "Intermediate",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 19,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Corporate Social Responsibility",
    description: "CSR strategy, purpose-led PR, and ESG communications",
    difficulty: "Intermediate",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 20,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Multicultural & Inclusive PR",
    description: "Diversity in communications, inclusive messaging, and cultural sensitivity",
    difficulty: "Intermediate",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 21,
    course_id: 3,
    course_title: "Advanced Course",
    title: "C-Suite Communications",
    description: "CEO profile building, executive visibility, and thought leadership",
    difficulty: "Advanced",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 22,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Investor Relations",
    description: "Financial communications, analyst briefings, and IR strategy",
    difficulty: "Advanced",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 23,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Reputation Management",
    description: "Reputation audits, trust building, and long-term brand protection",
    difficulty: "Advanced",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 24,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Government & Public Affairs",
    description: "Lobbying, policy engagement, regulatory communications",
    difficulty: "Advanced",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 25,
    course_id: 3,
    course_title: "Advanced Course",
    title: "International PR",
    description: "Global campaigns, cultural adaptation, and international media",
    difficulty: "Advanced",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 26,
    course_id: 3,
    course_title: "Advanced Course",
    title: "PR in the Digital Age",
    description: "SEO for PR, digital newsrooms, and AI-assisted communications",
    difficulty: "Advanced",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 27,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Data-Driven PR",
    description: "Audience insights, sentiment analysis, and predictive PR",
    difficulty: "Advanced",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 28,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Integrated Communications",
    description: "PR, marketing, and advertising alignment and integration",
    difficulty: "Advanced",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 29,
    course_id: 3,
    course_title: "Advanced Course",
    title: "PR Leadership & Agency Management",
    description: "Client management, team leadership, and growing a PR practice",
    difficulty: "Advanced",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 30,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Future of PR",
    description: "AI, automation, emerging media, and the evolving PR landscape",
    difficulty: "Advanced",
    order: 10,
    lesson_count: 10,
  },
];

/**
 * Get all modules
 */
export function getAllModules() {
  return moduleTopics;
}

/**
 * Get all courses
 */
export function getCourses() {
  return courses;
}

/**
 * Get a course by slug
 */
export function getCourseBySlug(slug) {
  return courses.find((c) => c.slug === slug);
}

/**
 * Get modules belonging to a specific course (by course id)
 */
export function getModulesByCourse(courseId) {
  return moduleTopics.filter((m) => m.course_id === courseId);
}

/**
 * Get module by ID
 */
export function getModuleById(id) {
  return moduleTopics.find((m) => m.id === Number(id));
}

/**
 * Get modules by difficulty level
 */
export function getModulesByLevel(level) {
  return moduleTopics.filter((m) => m.difficulty === level);
}

/**
 * Generate lesson metadata for a module
 */
export function generateLessonMetadata(moduleId, lessonNumber) {
  return {
    id: (Number(moduleId) - 1) * 10 + lessonNumber,
    module_id: Number(moduleId),
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
