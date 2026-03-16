/**
 * Curriculum Generator - Chemistry
 *
 * Defines the 3-course structure: Basic (modules 1-10), Intermediate (11-20), Advanced (21-30).
 * Each course has 10 modules × 10 lessons = 100 lessons (300 lessons total).
 */

export const moduleTopics = [
  // ── Basic Course (Modules 1–10) ────────────────────────────────────────────
  { id: 1,  title: "Introduction to Chemistry",   description: "Matter, elements, and the periodic table",                           order: 1,  course: "Basic",        difficulty: "Beginner" },
  { id: 2,  title: "Atomic Structure",            description: "Atoms, electrons, and atomic models",                                order: 2,  course: "Basic",        difficulty: "Beginner" },
  { id: 3,  title: "Chemical Bonding",            description: "Ionic, covalent, and metallic bonds",                               order: 3,  course: "Basic",        difficulty: "Beginner" },
  { id: 4,  title: "States of Matter",            description: "Solids, liquids, gases, and phase changes",                         order: 4,  course: "Basic",        difficulty: "Beginner" },
  { id: 5,  title: "The Periodic Table",          description: "Periodic trends, groups, and element properties",                   order: 5,  course: "Basic",        difficulty: "Beginner" },
  { id: 6,  title: "Chemical Formulas",           description: "Writing and balancing chemical formulas",                           order: 6,  course: "Basic",        difficulty: "Beginner" },
  { id: 7,  title: "Mixtures & Solutions",        description: "Types of mixtures, solubility, and concentration",                  order: 7,  course: "Basic",        difficulty: "Beginner" },
  { id: 8,  title: "Acids, Bases & Salts",        description: "pH scale, neutralisation, and salt formation",                      order: 8,  course: "Basic",        difficulty: "Beginner" },
  { id: 9,  title: "Metals & Non-Metals",         description: "Properties, reactions, and uses of metals and non-metals",          order: 9,  course: "Basic",        difficulty: "Beginner" },
  { id: 10, title: "Chemistry in Daily Life",     description: "Soaps, polymers, medicines, and environmental chemistry",           order: 10, course: "Basic",        difficulty: "Beginner" },

  // ── Intermediate Course (Modules 11–20) ────────────────────────────────────
  { id: 11, title: "Chemical Reactions",          description: "Types of reactions and balancing equations",                        order: 1,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 12, title: "Stoichiometry",               description: "Mole concept and quantitative relationships in reactions",          order: 2,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 13, title: "Thermochemistry",             description: "Energy changes, enthalpy, and Hess's law",                         order: 3,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 14, title: "Chemical Equilibrium",        description: "Reversible reactions, Le Chatelier's principle",                    order: 4,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 15, title: "Redox Reactions",             description: "Oxidation, reduction, and electrochemical cells",                   order: 5,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 16, title: "Chemical Kinetics",           description: "Reaction rates, activation energy, and catalysts",                  order: 6,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 17, title: "Gaseous State",               description: "Gas laws, ideal gas equation, and kinetic theory",                  order: 7,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 18, title: "Atomic Spectra",              description: "Quantum numbers, orbitals, and electron configurations",            order: 8,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 19, title: "Coordination Compounds",      description: "Ligands, complexes, and naming conventions",                        order: 9,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 20, title: "Environmental Chemistry",     description: "Pollutants, green chemistry, and sustainability",                   order: 10, course: "Intermediate", difficulty: "Intermediate" },

  // ── Advanced Course (Modules 21–30) ────────────────────────────────────────
  { id: 21, title: "Organic Chemistry I",         description: "Carbon chemistry, functional groups, and nomenclature",             order: 1,  course: "Advanced",     difficulty: "Advanced" },
  { id: 22, title: "Organic Chemistry II",        description: "Reaction mechanisms, stereochemistry, and synthesis",               order: 2,  course: "Advanced",     difficulty: "Advanced" },
  { id: 23, title: "Electrochemistry",            description: "Galvanic cells, electrolysis, and the Nernst equation",            order: 3,  course: "Advanced",     difficulty: "Advanced" },
  { id: 24, title: "Nuclear Chemistry",           description: "Radioactivity, nuclear reactions, and half-life",                   order: 4,  course: "Advanced",     difficulty: "Advanced" },
  { id: 25, title: "Quantum Chemistry",           description: "Wave functions, Schrödinger equation, and molecular orbitals",     order: 5,  course: "Advanced",     difficulty: "Advanced" },
  { id: 26, title: "Solid State Chemistry",       description: "Crystal structures, defects, and semiconductor materials",          order: 6,  course: "Advanced",     difficulty: "Advanced" },
  { id: 27, title: "Surface Chemistry",           description: "Adsorption, colloids, emulsions, and catalysis",                   order: 7,  course: "Advanced",     difficulty: "Advanced" },
  { id: 28, title: "Polymer Chemistry",           description: "Monomers, polymerisation, and properties of polymers",             order: 8,  course: "Advanced",     difficulty: "Advanced" },
  { id: 29, title: "Spectroscopy",                description: "IR, NMR, and mass spectrometry for structure elucidation",         order: 9,  course: "Advanced",     difficulty: "Advanced" },
  { id: 30, title: "Computational Chemistry",     description: "Molecular modelling, simulations, and cheminformatics",            order: 10, course: "Advanced",     difficulty: "Advanced" },
];

/**
 * The 3-course structure: Basic → Intermediate → Advanced.
 * Each course spans 10 modules and 100 lessons (10 lessons per module).
 */
export const COURSES = [
  {
    id: "basic",
    title: "Basic Chemistry",
    level: "Basic",
    description: "Build a solid foundation in chemistry covering atomic structure, bonding, states of matter, and everyday applications.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Chemistry",
    level: "Intermediate",
    description: "Advance into chemical reactions, stoichiometry, thermochemistry, kinetics, and equilibrium.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Chemistry",
    level: "Advanced",
    description: "Master organic chemistry, electrochemistry, quantum chemistry, and modern analytical techniques.",
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

