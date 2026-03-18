/**
 * Curriculum Generator — Aptitude & Reasoning Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    id: 1,
    slug: "basic",
    title: "Basic Course",
    subtitle: "Quantitative Aptitude Basics",
    description: "Build a strong numerical foundation for aptitude examinations.",
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
    subtitle: "Reasoning & Data Analysis",
    description: "Sharpen logical reasoning, verbal skills, and data interpretation.",
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
    subtitle: "Advanced Problem Solving & Mock Tests",
    description: "Master advanced aptitude strategies and build exam-day confidence.",
    difficulty: "Advanced",
    order: 3,
    module_ids: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    module_count: 10,
    lesson_count: 100,
  },
];

export const moduleTopics = [
  {
    id: 1,
    course_id: 1,
    course_title: "Basic Course",
    title: "Number Systems & Properties",
    description: "Natural numbers, integers, HCF, LCM, and divisibility rules",
    difficulty: "Beginner",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 2,
    course_id: 1,
    course_title: "Basic Course",
    title: "Basic Arithmetic Operations",
    description: "BODMAS, fractions, decimals, and mental calculation tricks",
    difficulty: "Beginner",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 3,
    course_id: 1,
    course_title: "Basic Course",
    title: "Percentage Calculations",
    description: "Percent increase/decrease, percentage point difference, and applications",
    difficulty: "Beginner",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 4,
    course_id: 1,
    course_title: "Basic Course",
    title: "Ratio & Proportion",
    description: "Ratios, direct and inverse proportion, and mixture problems",
    difficulty: "Beginner",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 5,
    course_id: 1,
    course_title: "Basic Course",
    title: "Simple & Compound Interest",
    description: "SI and CI formulas, comparisons, installments, and growth",
    difficulty: "Beginner",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 6,
    course_id: 1,
    course_title: "Basic Course",
    title: "Profit, Loss & Discount",
    description: "Cost price, selling price, markup, markdown, and successive discounts",
    difficulty: "Beginner",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 7,
    course_id: 1,
    course_title: "Basic Course",
    title: "Time, Speed & Distance",
    description: "Relative speed, trains, boats, streams, and average speed",
    difficulty: "Beginner",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 8,
    course_id: 1,
    course_title: "Basic Course",
    title: "Time & Work",
    description: "Work efficiency, pipes and cisterns, and combined work problems",
    difficulty: "Beginner",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 9,
    course_id: 1,
    course_title: "Basic Course",
    title: "Basic Algebra for Aptitude",
    description: "Linear equations, age problems, and substitution techniques",
    difficulty: "Beginner",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 10,
    course_id: 1,
    course_title: "Basic Course",
    title: "Mensuration Basics",
    description: "Perimeter, area of 2D figures, surface area, and volume basics",
    difficulty: "Beginner",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 11,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Logical Reasoning Fundamentals",
    description: "Series, analogies, odd one out, and coding-decoding",
    difficulty: "Intermediate",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 12,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Verbal Reasoning",
    description: "Synonyms, antonyms, fill-in-the-blanks, and reading comprehension",
    difficulty: "Intermediate",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 13,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Blood Relations",
    description: "Family tree problems, relationships, and kinship puzzles",
    difficulty: "Intermediate",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 14,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Seating Arrangements & Puzzles",
    description: "Linear, circular, and complex seating arrangement problems",
    difficulty: "Intermediate",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 15,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Data Interpretation: Tables & Graphs",
    description: "Reading, interpreting, and calculating from DI sets",
    difficulty: "Intermediate",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 16,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Critical Reasoning",
    description: "Arguments, assumptions, inferences, and strengthening/weakening",
    difficulty: "Intermediate",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 17,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Syllogisms",
    description: "Venn diagrams, categorical logic, and conclusion-based problems",
    difficulty: "Intermediate",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 18,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Statement & Conclusions",
    description: "Deriving valid conclusions from given statements",
    difficulty: "Intermediate",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 19,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Quantitative Aptitude: Advanced Arithmetic",
    description: "Permutations, combinations, probability, and set theory",
    difficulty: "Intermediate",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 20,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Input-Output & Decision Making",
    description: "Machine input-output patterns and decision-making tables",
    difficulty: "Intermediate",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 21,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Abstract & Non-Verbal Reasoning",
    description: "Figure series, matrices, spatial visualization, and odd figure out",
    difficulty: "Advanced",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 22,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Advanced Data Sufficiency",
    description: "Sufficiency conditions, two-statement problems, and elimination",
    difficulty: "Advanced",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 23,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Speed Maths & Vedic Techniques",
    description: "Fast calculation, squares, cubes, and approximation tricks",
    difficulty: "Advanced",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 24,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Complex Aptitude Problem Sets",
    description: "Multi-step problems, combined topics, and challenge questions",
    difficulty: "Advanced",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 25,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Analytical Puzzles",
    description: "Analytical grid puzzles, deductive reasoning, and scheduling problems",
    difficulty: "Advanced",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 26,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Verbal Ability Advanced",
    description: "Para jumbles, sentence correction, idioms, and error detection",
    difficulty: "Advanced",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 27,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Direction & Map-Based Problems",
    description: "Direction sense, distance, and map interpretation",
    difficulty: "Advanced",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 28,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Number Series & Patterns",
    description: "Complex number series, alphanumeric patterns, and letter puzzles",
    difficulty: "Advanced",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 29,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Mock Test Strategy & Time Management",
    description: "Sectional strategies, time allocation, and question selection",
    difficulty: "Advanced",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 30,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Full-Length Aptitude Mock Tests",
    description: "Simulated full-length tests with detailed solution analysis",
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
