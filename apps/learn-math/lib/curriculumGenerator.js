/**
 * Curriculum Generator — Mathematics Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    "id": 1,
    "slug": "basic",
    "title": "Basic Course",
    "subtitle": "Mathematical Foundations",
    "description": "Master core mathematical concepts from arithmetic to introductory algebra.",
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
    "subtitle": "Core Mathematics",
    "description": "Develop deeper mathematical fluency with calculus, probability, and linear algebra.",
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
    "subtitle": "Advanced Mathematics",
    "description": "Explore the frontiers of pure and applied mathematics.",
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
    title: "Basic Mathematics",
    level: "Basic",
    description: "Master core mathematical concepts from arithmetic to introductory algebra.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Mathematics",
    level: "Intermediate",
    description: "Develop deeper mathematical fluency with calculus, probability, and linear algebra.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Mathematics",
    level: "Advanced",
    description: "Explore the frontiers of pure and applied mathematics.",
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
    "title": "Number Systems",
    "description": "Integers, fractions, decimals, real numbers, and number lines",
    "difficulty": "Beginner",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 2,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Basic Arithmetic",
    "description": "Addition, subtraction, multiplication, division, and order of operations",
    "difficulty": "Beginner",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 3,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Fractions & Decimals",
    "description": "Fractions, mixed numbers, decimal operations, and conversions",
    "difficulty": "Beginner",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 4,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Percentages & Ratios",
    "description": "Percentage calculations, ratio, proportion, and scaling",
    "difficulty": "Beginner",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 5,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Algebra Basics",
    "description": "Variables, expressions, equations, and inequalities",
    "difficulty": "Beginner",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 6,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Geometry Fundamentals",
    "description": "Points, lines, angles, triangles, and polygons",
    "difficulty": "Beginner",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 7,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Area, Volume & Perimeter",
    "description": "Measuring 2D shapes and 3D solids",
    "difficulty": "Beginner",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 8,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Introduction to Statistics",
    "description": "Mean, median, mode, range, and frequency tables",
    "difficulty": "Beginner",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 9,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Data & Graphs",
    "description": "Bar charts, line graphs, pie charts, and scatter plots",
    "difficulty": "Beginner",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 10,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Mathematical Reasoning & Problem Solving",
    "description": "Logic, proof basics, patterns, and mathematical thinking",
    "difficulty": "Beginner",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 11,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Advanced Algebra",
    "description": "Quadratic equations, polynomials, factoring, and complex numbers",
    "difficulty": "Intermediate",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 12,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Functions & Graphs",
    "description": "Domain, range, transformations, and function notation",
    "difficulty": "Intermediate",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 13,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Trigonometry",
    "description": "Sine, cosine, tangent, unit circle, and trigonometric identities",
    "difficulty": "Intermediate",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 14,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Calculus I: Limits & Derivatives",
    "description": "Limits, continuity, differentiation rules, and applications",
    "difficulty": "Intermediate",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 15,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Calculus II: Integration",
    "description": "Antiderivatives, definite integrals, and the Fundamental Theorem",
    "difficulty": "Intermediate",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 16,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Probability",
    "description": "Sample spaces, events, conditional probability, and Bayes theorem",
    "difficulty": "Intermediate",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 17,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Statistics & Distributions",
    "description": "Normal distribution, hypothesis testing, and confidence intervals",
    "difficulty": "Intermediate",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 18,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Linear Algebra Basics",
    "description": "Vectors, matrices, determinants, and systems of equations",
    "difficulty": "Intermediate",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 19,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Discrete Mathematics",
    "description": "Sets, logic, combinatorics, and graph theory",
    "difficulty": "Intermediate",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 20,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Mathematical Proofs",
    "description": "Direct proof, contradiction, induction, and proof techniques",
    "difficulty": "Intermediate",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 21,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Multivariable Calculus",
    "description": "Partial derivatives, multiple integrals, and vector calculus",
    "difficulty": "Advanced",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 22,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Differential Equations",
    "description": "ODEs, PDEs, initial value problems, and applications",
    "difficulty": "Advanced",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 23,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Complex Analysis",
    "description": "Complex numbers, analytic functions, contour integration",
    "difficulty": "Advanced",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 24,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Abstract Algebra",
    "description": "Groups, rings, fields, and algebraic structures",
    "difficulty": "Advanced",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 25,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Real Analysis",
    "description": "Sequences, series, continuity, and measure theory",
    "difficulty": "Advanced",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 26,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Numerical Methods",
    "description": "Approximation algorithms, root finding, and numerical integration",
    "difficulty": "Advanced",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 27,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Topology",
    "description": "Open sets, continuity, compactness, and connectedness",
    "difficulty": "Advanced",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 28,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Mathematical Modeling",
    "description": "Formulating, solving, and interpreting mathematical models",
    "difficulty": "Advanced",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 29,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Applied Mathematics",
    "description": "Physics, engineering, biology, and economics applications",
    "difficulty": "Advanced",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 30,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Research Methods in Mathematics",
    "description": "Mathematical writing, research strategy, and open problems",
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
