/**
 * Curriculum Generator - Math
 *
 * Defines the 3-course structure: Basic (modules 1-10), Intermediate (11-20), Advanced (21-30).
 * Each course has 10 modules × 10 lessons = 100 lessons (300 lessons total).
 */

export const moduleTopics = [
  // ── Basic Course (Modules 1–10) ────────────────────────────────────────────
  { id: 1,  title: "Number Systems",           description: "Understanding integers, fractions, and real numbers",          order: 1,  course: "Basic",        difficulty: "Beginner" },
  { id: 2,  title: "Basic Algebra",            description: "Variables, expressions, and linear equations",                  order: 2,  course: "Basic",        difficulty: "Beginner" },
  { id: 3,  title: "Geometry Fundamentals",    description: "Shapes, angles, and geometric properties",                     order: 3,  course: "Basic",        difficulty: "Beginner" },
  { id: 4,  title: "Arithmetic & Fractions",   description: "Operations on fractions, decimals, and percentages",           order: 4,  course: "Basic",        difficulty: "Beginner" },
  { id: 5,  title: "Ratio & Proportion",       description: "Ratios, rates, and proportional relationships",                 order: 5,  course: "Basic",        difficulty: "Beginner" },
  { id: 6,  title: "Basic Statistics",         description: "Mean, median, mode, range, and data representation",           order: 6,  course: "Basic",        difficulty: "Beginner" },
  { id: 7,  title: "Probability Basics",       description: "Introduction to probability and simple experiments",            order: 7,  course: "Basic",        difficulty: "Beginner" },
  { id: 8,  title: "Mensuration",              description: "Perimeter, area, and volume of common shapes",                 order: 8,  course: "Basic",        difficulty: "Beginner" },
  { id: 9,  title: "Coordinate Geometry I",   description: "Points, lines, and the Cartesian plane",                       order: 9,  course: "Basic",        difficulty: "Beginner" },
  { id: 10, title: "Mathematical Reasoning",   description: "Logic, patterns, and problem-solving strategies",              order: 10, course: "Basic",        difficulty: "Beginner" },

  // ── Intermediate Course (Modules 11–20) ────────────────────────────────────
  { id: 11, title: "Trigonometry",             description: "Trigonometric functions, identities, and equations",           order: 1,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 12, title: "Advanced Algebra",         description: "Quadratic equations, polynomials, and functions",              order: 2,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 13, title: "Calculus I",               description: "Limits, derivatives, and differentiation",                     order: 3,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 14, title: "Calculus II",              description: "Integration and its applications",                             order: 4,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 15, title: "Matrices & Determinants",  description: "Matrix operations, determinants, and systems of equations",   order: 5,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 16, title: "Sequences & Series",       description: "Arithmetic and geometric progressions, convergence",           order: 6,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 17, title: "Complex Numbers",          description: "Imaginary unit, complex arithmetic, and Argand diagram",      order: 7,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 18, title: "Vectors",                  description: "Vector algebra, dot product, cross product, and applications", order: 8,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 19, title: "Coordinate Geometry II",  description: "Conic sections: circles, parabolas, ellipses, hyperbolas",    order: 9,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 20, title: "Mathematical Induction",   description: "Proof by induction and combinatorial identities",             order: 10, course: "Intermediate", difficulty: "Intermediate" },

  // ── Advanced Course (Modules 21–30) ────────────────────────────────────────
  { id: 21, title: "Linear Algebra",           description: "Vector spaces, linear transformations, and eigenvalues",      order: 1,  course: "Advanced",     difficulty: "Advanced" },
  { id: 22, title: "Real Analysis",            description: "Rigorous treatment of limits, continuity, and integration",   order: 2,  course: "Advanced",     difficulty: "Advanced" },
  { id: 23, title: "Differential Equations",   description: "Ordinary and partial differential equations with applications",order: 3,  course: "Advanced",     difficulty: "Advanced" },
  { id: 24, title: "Statistics & Probability", description: "Distributions, hypothesis testing, and statistical inference",order: 4,  course: "Advanced",     difficulty: "Advanced" },
  { id: 25, title: "Numerical Methods",        description: "Root-finding, interpolation, and numerical integration",      order: 5,  course: "Advanced",     difficulty: "Advanced" },
  { id: 26, title: "Abstract Algebra",         description: "Groups, rings, fields, and algebraic structures",             order: 6,  course: "Advanced",     difficulty: "Advanced" },
  { id: 27, title: "Complex Analysis",         description: "Analytic functions, Cauchy's theorem, and residue calculus",  order: 7,  course: "Advanced",     difficulty: "Advanced" },
  { id: 28, title: "Topology Basics",          description: "Metric spaces, open sets, compactness, and connectedness",    order: 8,  course: "Advanced",     difficulty: "Advanced" },
  { id: 29, title: "Fourier Analysis",         description: "Fourier series, transforms, and signal representation",       order: 9,  course: "Advanced",     difficulty: "Advanced" },
  { id: 30, title: "Optimization",             description: "Linear programming, gradient methods, and convex analysis",   order: 10, course: "Advanced",     difficulty: "Advanced" },
];

/**
 * The 3-course structure: Basic → Intermediate → Advanced.
 * Each course spans 10 modules and 100 lessons (10 lessons per module).
 */
export const COURSES = [
  {
    id: "basic",
    title: "Basic Mathematics",
    level: "Basic",
    description: "Build a solid mathematical foundation covering number systems, algebra, geometry, and core reasoning skills.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Mathematics",
    level: "Intermediate",
    description: "Advance into trigonometry, calculus, vectors, and algebraic structures essential for higher mathematics.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Mathematics",
    level: "Advanced",
    description: "Master advanced topics including real analysis, differential equations, abstract algebra, and optimization.",
    moduleRange: [21, 30],
    moduleCount: 10,
    lessonCount: 100,
    color: "purple",
    emoji: "🟣",
    startModuleId: 21,
  },
];

/** Generate lesson metadata for a module */
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

/** Generate quiz questions template */
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

/** Get module by ID */
export function getModuleById(id) {
  return moduleTopics.find((m) => m.id === id);
}

/** Get all 30 modules */
export function getAllModules() {
  return moduleTopics;
}

/** Get modules for a specific course level ("Basic" | "Intermediate" | "Advanced") */
export function getModulesByCourse(courseLevel) {
  return moduleTopics.filter((m) => m.course === courseLevel);
}

/** Get modules by difficulty (backward-compatible) */
export function getModulesByLevel(level) {
  return moduleTopics.filter((m) => m.difficulty === level);
}

/** Get content organized by course level */
export function getContentByLevel() {
  return {
    Basic: getModulesByCourse("Basic"),
    Intermediate: getModulesByCourse("Intermediate"),
    Advanced: getModulesByCourse("Advanced"),
  };
}

