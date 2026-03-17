/**
 * Curriculum Generator — Management Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    "id": 1,
    "slug": "basic",
    "title": "Basic Course",
    "subtitle": "Management Foundations",
    "description": "Build the essential skills every effective manager needs.",
    "difficulty": "Beginner",
    "order": 1,
    "module_ids": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ],
    "module_count": 10,
    "lesson_count": 100
  },
  {
    "id": 2,
    "slug": "intermediate",
    "title": "Intermediate Course",
    "subtitle": "Organizational Excellence",
    "description": "Drive performance across teams, finances, and strategic operations.",
    "difficulty": "Intermediate",
    "order": 2,
    "module_ids": [
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20
    ],
    "module_count": 10,
    "lesson_count": 100
  },
  {
    "id": 3,
    "slug": "advanced",
    "title": "Advanced Course",
    "subtitle": "Executive Leadership",
    "description": "Lead at the executive level with strategic vision and organizational impact.",
    "difficulty": "Advanced",
    "order": 3,
    "module_ids": [
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30
    ],
    "module_count": 10,
    "lesson_count": 100
  }
];

export const COURSES = [
  {
    id: "basic",
    title: "Basic Management",
    level: "Basic",
    description: "Build the essential skills every effective manager needs.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Management",
    level: "Intermediate",
    description: "Drive performance across teams, finances, and strategic operations.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Management",
    level: "Advanced",
    description: "Lead at the executive level with strategic vision and organizational impact.",
    moduleRange: [21, 30],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟣",
    startModuleId: 21,
  },
];

export const moduleTopics = [
  {
    "id": 1,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Introduction to Management",
    "description": "Roles, responsibilities, and management theories",
    "difficulty": "Beginner",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 2,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Leadership Styles",
    "description": "Transactional, transformational, servant, and situational leadership",
    "difficulty": "Beginner",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 3,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Effective Communication",
    "description": "Active listening, clear messaging, and feedback skills",
    "difficulty": "Beginner",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 4,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Team Dynamics",
    "description": "Group formation, roles, collaboration, and team culture",
    "difficulty": "Beginner",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 5,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Goal Setting & Planning",
    "description": "SMART goals, OKRs, prioritization, and action plans",
    "difficulty": "Beginner",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 6,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Decision Making",
    "description": "Analytical frameworks, bias awareness, and data-driven choices",
    "difficulty": "Beginner",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 7,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Time Management",
    "description": "Prioritization, delegation, and productivity systems",
    "difficulty": "Beginner",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 8,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Delegation Skills",
    "description": "When to delegate, how to hand off, and follow-up strategies",
    "difficulty": "Beginner",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 9,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Conflict Resolution",
    "description": "Mediation, negotiation, and creating constructive dialogue",
    "difficulty": "Beginner",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 10,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Ethics in Management",
    "description": "Integrity, corporate values, and ethical decision frameworks",
    "difficulty": "Beginner",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 11,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Strategic Planning",
    "description": "SWOT, PESTLE, vision alignment, and strategic roadmaps",
    "difficulty": "Intermediate",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 12,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Financial Management for Managers",
    "description": "Budgeting, P&L, cost control, and ROI analysis",
    "difficulty": "Intermediate",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 13,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Project Management",
    "description": "Agile, Scrum, Waterfall, scope, and delivery frameworks",
    "difficulty": "Intermediate",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 14,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Operations Management",
    "description": "Process improvement, Lean, Six Sigma, and efficiency",
    "difficulty": "Intermediate",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 15,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Marketing & Sales for Managers",
    "description": "GTM strategy, customer insights, and revenue growth",
    "difficulty": "Intermediate",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 16,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "HR Management",
    "description": "Hiring, onboarding, performance reviews, and retention",
    "difficulty": "Intermediate",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 17,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Performance Management",
    "description": "KPIs, appraisals, coaching, and managing underperformance",
    "difficulty": "Intermediate",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 18,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Stakeholder Management",
    "description": "Identifying, mapping, engaging, and influencing stakeholders",
    "difficulty": "Intermediate",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 19,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Change Management",
    "description": "Kotter's model, managing resistance, and leading transitions",
    "difficulty": "Intermediate",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 20,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Risk Management",
    "description": "Risk identification, mitigation, business continuity, and audits",
    "difficulty": "Intermediate",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 21,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Executive Presence",
    "description": "Gravitas, communication authority, and influential leadership",
    "difficulty": "Advanced",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 22,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Corporate Strategy",
    "description": "Competitive positioning, M&A strategy, and portfolio decisions",
    "difficulty": "Advanced",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 23,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Innovation & Entrepreneurship",
    "description": "Design thinking, intrapreneurship, and building new ventures",
    "difficulty": "Advanced",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 24,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Global Business Management",
    "description": "Cross-cultural leadership, international markets, and global ops",
    "difficulty": "Advanced",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 25,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Organizational Design",
    "description": "Structures, reporting lines, role clarity, and org efficiency",
    "difficulty": "Advanced",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 26,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Digital Transformation",
    "description": "Leading tech-driven change, AI strategy, and digital culture",
    "difficulty": "Advanced",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 27,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Crisis Management",
    "description": "Rapid response, communications, recovery planning, and resilience",
    "difficulty": "Advanced",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 28,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Mergers & Acquisitions",
    "description": "Due diligence, integration planning, and cultural alignment",
    "difficulty": "Advanced",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 29,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Board Governance",
    "description": "Board structures, fiduciary duties, and executive accountability",
    "difficulty": "Advanced",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 30,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Legacy & Succession Planning",
    "description": "Leadership pipeline, talent succession, and organizational legacy",
    "difficulty": "Advanced",
    "order": 10,
    "lesson_count": 10
  }
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
