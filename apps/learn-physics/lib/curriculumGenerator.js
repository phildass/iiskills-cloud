/**
 * Curriculum Generator - Physics
 *
 * Defines the 3-course structure: Basic (modules 1-10), Intermediate (11-20), Advanced (21-30).
 * Each course has 10 modules × 10 lessons = 100 lessons (300 lessons total).
 */

export const moduleTopics = [
  // ── Basic Course (Modules 1–10) ────────────────────────────────────────────
  { id: 1,  title: "Classical Mechanics",       description: "Forces, motion, and energy in classical systems",                  order: 1,  course: "Basic",        difficulty: "Beginner" },
  { id: 2,  title: "Newton's Laws",             description: "The three laws governing all motion",                              order: 2,  course: "Basic",        difficulty: "Beginner" },
  { id: 3,  title: "Work and Energy",           description: "Work, power, and conservation of energy",                         order: 3,  course: "Basic",        difficulty: "Beginner" },
  { id: 4,  title: "Kinematics",                description: "Displacement, velocity, acceleration, and projectile motion",     order: 4,  course: "Basic",        difficulty: "Beginner" },
  { id: 5,  title: "Gravitation",               description: "Newton's law of gravitation, orbital motion, and satellites",     order: 5,  course: "Basic",        difficulty: "Beginner" },
  { id: 6,  title: "Fluid Mechanics",           description: "Pressure, buoyancy, Archimedes' principle, and fluid flow",       order: 6,  course: "Basic",        difficulty: "Beginner" },
  { id: 7,  title: "Sound & Acoustics",         description: "Wave properties, sound speed, frequency, and resonance",          order: 7,  course: "Basic",        difficulty: "Beginner" },
  { id: 8,  title: "Heat & Temperature",        description: "Thermal expansion, heat transfer, and specific heat",              order: 8,  course: "Basic",        difficulty: "Beginner" },
  { id: 9,  title: "Light & Optics I",          description: "Reflection, refraction, lenses, and mirrors",                     order: 9,  course: "Basic",        difficulty: "Beginner" },
  { id: 10, title: "Electricity Basics",        description: "Electric charge, current, voltage, and simple circuits",          order: 10, course: "Basic",        difficulty: "Beginner" },

  // ── Intermediate Course (Modules 11–20) ────────────────────────────────────
  { id: 11, title: "Thermodynamics",            description: "Heat, temperature, entropy, and the laws of thermodynamics",      order: 1,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 12, title: "Electricity & Magnetism",   description: "Electric fields, magnetic fields, and their unification",         order: 2,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 13, title: "Waves and Optics",          description: "Wave behaviour, superposition, interference, and diffraction",    order: 3,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 14, title: "Rotational Motion",         description: "Torque, angular momentum, and moment of inertia",                 order: 4,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 15, title: "Oscillations & SHM",       description: "Simple harmonic motion, pendulums, and resonance",                order: 5,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 16, title: "Electrostatics",            description: "Coulomb's law, electric potential, and capacitors",               order: 6,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 17, title: "Electromagnetism",          description: "Faraday's law, inductance, and electromagnetic induction",        order: 7,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 18, title: "Optics II",                description: "Wave optics, polarisation, and optical instruments",               order: 8,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 19, title: "AC Circuits",              description: "Alternating current, impedance, resonance, and transformers",      order: 9,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 20, title: "Electromagnetic Waves",     description: "Maxwell's equations and the electromagnetic spectrum",            order: 10, course: "Intermediate", difficulty: "Intermediate" },

  // ── Advanced Course (Modules 21–30) ────────────────────────────────────────
  { id: 21, title: "Modern Physics",            description: "Special relativity, photoelectric effect, and quantum beginnings", order: 1,  course: "Advanced",     difficulty: "Advanced" },
  { id: 22, title: "Nuclear Physics",           description: "Atomic nuclei, radioactivity, fission, and fusion",               order: 2,  course: "Advanced",     difficulty: "Advanced" },
  { id: 23, title: "Quantum Mechanics I",       description: "Wave-particle duality, uncertainty principle, and Schrödinger",  order: 3,  course: "Advanced",     difficulty: "Advanced" },
  { id: 24, title: "Quantum Mechanics II",      description: "Hydrogen atom, spin, and multi-electron systems",                 order: 4,  course: "Advanced",     difficulty: "Advanced" },
  { id: 25, title: "Statistical Mechanics",     description: "Kinetic theory, Boltzmann distribution, and entropy",             order: 5,  course: "Advanced",     difficulty: "Advanced" },
  { id: 26, title: "Astrophysics",              description: "Stellar evolution, cosmology, and the large-scale universe",      order: 6,  course: "Advanced",     difficulty: "Advanced" },
  { id: 27, title: "Particle Physics",          description: "Elementary particles, Standard Model, and fundamental forces",   order: 7,  course: "Advanced",     difficulty: "Advanced" },
  { id: 28, title: "Solid State Physics",       description: "Crystal structure, band theory, semiconductors, and conductors",  order: 8,  course: "Advanced",     difficulty: "Advanced" },
  { id: 29, title: "Plasma Physics",            description: "Plasma state, magnetic confinement, and fusion energy",           order: 9,  course: "Advanced",     difficulty: "Advanced" },
  { id: 30, title: "Quantum Field Theory",      description: "Quantum field theory, particle physics, and beyond Standard Model",order: 10, course: "Advanced",     difficulty: "Advanced" },
];

/**
 * The 3-course structure: Basic → Intermediate → Advanced.
 * Each course spans 10 modules and 100 lessons (10 lessons per module).
 */
export const COURSES = [
  {
    id: "basic",
    title: "Basic Physics",
    level: "Basic",
    description: "Build a strong physical intuition covering mechanics, heat, light, sound, and basic electricity.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Physics",
    level: "Intermediate",
    description: "Deepen your understanding with thermodynamics, electromagnetism, waves, and rotating systems.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Physics",
    level: "Advanced",
    description: "Master quantum mechanics, nuclear physics, astrophysics, and the frontiers of modern physics.",
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
    is_free: true,
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

