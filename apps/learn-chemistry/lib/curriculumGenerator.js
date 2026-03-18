/**
 * Curriculum Generator — Chemistry Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    id: 1,
    slug: "basic",
    title: "Basic Course",
    subtitle: "Chemistry Foundations",
    description: "Build a solid grounding in fundamental chemistry concepts and lab skills.",
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
    subtitle: "Core Chemistry",
    description: "Explore chemical kinetics, thermodynamics, and organic chemistry foundations.",
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
    subtitle: "Advanced Chemistry",
    description:
      "Tackle advanced topics in organic synthesis, biochemistry, and quantum chemistry.",
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
    title: "Basic Chemistry",
    level: "Basic",
    description: "Build a solid grounding in fundamental chemistry concepts and lab skills.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Chemistry",
    level: "Intermediate",
    description: "Explore chemical kinetics, thermodynamics, and organic chemistry foundations.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Chemistry",
    level: "Advanced",
    description:
      "Tackle advanced topics in organic synthesis, biochemistry, and quantum chemistry.",
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
    title: "Introduction to Chemistry",
    description: "Matter, properties, changes, and the scientific method",
    difficulty: "Beginner",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 2,
    course_id: 1,
    course_title: "Basic Course",
    title: "Atomic Structure",
    description: "Protons, neutrons, electrons, orbitals, and quantum numbers",
    difficulty: "Beginner",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 3,
    course_id: 1,
    course_title: "Basic Course",
    title: "The Periodic Table",
    description: "Trends, groups, periods, and element properties",
    difficulty: "Beginner",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 4,
    course_id: 1,
    course_title: "Basic Course",
    title: "Chemical Bonding",
    description: "Ionic, covalent, metallic bonds, and molecular geometry",
    difficulty: "Beginner",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 5,
    course_id: 1,
    course_title: "Basic Course",
    title: "States of Matter",
    description: "Solids, liquids, gases, plasma, and phase transitions",
    difficulty: "Beginner",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 6,
    course_id: 1,
    course_title: "Basic Course",
    title: "Solutions & Mixtures",
    description: "Solubility, concentration, molarity, and colligative properties",
    difficulty: "Beginner",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 7,
    course_id: 1,
    course_title: "Basic Course",
    title: "Acids & Bases",
    description: "pH, pOH, acid-base theories, buffers, and titrations",
    difficulty: "Beginner",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 8,
    course_id: 1,
    course_title: "Basic Course",
    title: "Basic Chemical Reactions",
    description: "Reaction types, balancing equations, and net ionic equations",
    difficulty: "Beginner",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 9,
    course_id: 1,
    course_title: "Basic Course",
    title: "The Mole Concept",
    description: "Avogadros number, molar mass, and stoichiometric relationships",
    difficulty: "Beginner",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 10,
    course_id: 1,
    course_title: "Basic Course",
    title: "Laboratory Safety & Techniques",
    description: "Safety rules, glassware, measurements, and lab procedures",
    difficulty: "Beginner",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 11,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Stoichiometry",
    description: "Mole ratios, limiting reagents, percent yield, and combustion analysis",
    difficulty: "Intermediate",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 12,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Chemical Equilibrium",
    description: "Le Chateliers principle, Kc, Kp, and equilibrium calculations",
    difficulty: "Intermediate",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 13,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Chemical Kinetics",
    description: "Reaction rates, rate laws, activation energy, and mechanisms",
    difficulty: "Intermediate",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 14,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Thermochemistry",
    description: "Enthalpy, Hesss law, calorimetry, and standard enthalpies",
    difficulty: "Intermediate",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 15,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Electrochemistry",
    description: "Redox reactions, galvanic cells, electrolysis, and Nernst equation",
    difficulty: "Intermediate",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 16,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Nuclear Chemistry",
    description: "Radioactivity, half-life, nuclear reactions, and applications",
    difficulty: "Intermediate",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 17,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Organic Chemistry Basics",
    description: "Hydrocarbons, IUPAC nomenclature, and structural formulas",
    difficulty: "Intermediate",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 18,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Functional Groups",
    description: "Alcohols, ethers, aldehydes, ketones, acids, and amines",
    difficulty: "Intermediate",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 19,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Spectroscopy",
    description: "IR, NMR, mass spectrometry, and UV-Vis analysis",
    difficulty: "Intermediate",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 20,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Environmental Chemistry",
    description: "Pollution, green chemistry, and atmospheric chemistry",
    difficulty: "Intermediate",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 21,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Advanced Organic Chemistry",
    description: "Stereochemistry, reaction mechanisms, and synthesis planning",
    difficulty: "Advanced",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 22,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Biochemistry",
    description: "Proteins, enzymes, carbohydrates, lipids, and nucleic acids",
    difficulty: "Advanced",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 23,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Physical Chemistry",
    description: "Thermodynamics, quantum mechanics, and statistical mechanics",
    difficulty: "Advanced",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 24,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Quantum Chemistry",
    description: "Schrodinger equation, molecular orbital theory, and DFT",
    difficulty: "Advanced",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 25,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Coordination Chemistry",
    description: "Ligands, crystal field theory, and transition metal complexes",
    difficulty: "Advanced",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 26,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Polymer Chemistry",
    description: "Polymerization mechanisms, macromolecules, and materials",
    difficulty: "Advanced",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 27,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Green Chemistry",
    description: "12 principles, sustainable synthesis, and waste minimization",
    difficulty: "Advanced",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 28,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Industrial Chemistry",
    description: "Chemical engineering, industrial processes, and scale-up",
    difficulty: "Advanced",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 29,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Computational Chemistry",
    description: "Molecular modeling, simulation, and cheminformatics",
    difficulty: "Advanced",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 30,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Research Methods in Chemistry",
    description: "Literature review, experimental design, and scientific reporting",
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
