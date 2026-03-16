/**
 * Curriculum Generator — Physics Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    "id": 1,
    "slug": "basic",
    "title": "Basic Course",
    "subtitle": "Classical Physics",
    "description": "Master the foundational laws of motion, energy, and waves.",
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
    "subtitle": "Electromagnetism & Modern Physics",
    "description": "Explore thermal physics, electricity, magnetism, and the foundations of modern physics.",
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
    "subtitle": "Advanced & Theoretical Physics",
    "description": "Explore quantum mechanics, nuclear physics, astrophysics, and cutting-edge theory.",
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

export const moduleTopics = [
  {
    "id": 1,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Introduction to Physics",
    "description": "What physics is, units, measurement, and scientific notation",
    "difficulty": "Beginner",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 2,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Kinematics",
    "description": "Displacement, velocity, acceleration, and equations of motion",
    "difficulty": "Beginner",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 3,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Newtons Laws of Motion",
    "description": "Inertia, F=ma, action-reaction pairs, and free-body diagrams",
    "difficulty": "Beginner",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 4,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Work, Energy & Power",
    "description": "Work-energy theorem, kinetic and potential energy, and power",
    "difficulty": "Beginner",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 5,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Momentum & Collisions",
    "description": "Linear momentum, impulse, elastic and inelastic collisions",
    "difficulty": "Beginner",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 6,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Rotational Motion",
    "description": "Torque, angular velocity, moment of inertia, and rotational energy",
    "difficulty": "Beginner",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 7,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Gravity & Orbital Mechanics",
    "description": "Newtons law of gravitation, orbits, and escape velocity",
    "difficulty": "Beginner",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 8,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Fluid Mechanics",
    "description": "Pressure, buoyancy, Bernoullis equation, and fluid dynamics",
    "difficulty": "Beginner",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 9,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Vibrations & Waves",
    "description": "Simple harmonic motion, wave properties, and superposition",
    "difficulty": "Beginner",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 10,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Sound & Acoustics",
    "description": "Sound waves, speed of sound, intensity, and the Doppler effect",
    "difficulty": "Beginner",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 11,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Thermodynamics I",
    "description": "Temperature, heat, thermal expansion, and ideal gases",
    "difficulty": "Intermediate",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 12,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Thermodynamics II",
    "description": "Laws of thermodynamics, entropy, heat engines, and refrigeration",
    "difficulty": "Intermediate",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 13,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Electric Charges & Fields",
    "description": "Coulombs law, electric fields, Gausss law, and potential",
    "difficulty": "Intermediate",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 14,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Electric Circuits",
    "description": "Current, resistance, Ohms law, series/parallel circuits, and Kirchhoffs laws",
    "difficulty": "Intermediate",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 15,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Magnetism",
    "description": "Magnetic fields, forces on charges, and Earths magnetism",
    "difficulty": "Intermediate",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 16,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Electromagnetic Induction",
    "description": "Faradays law, Lenzs law, transformers, and AC generation",
    "difficulty": "Intermediate",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 17,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Light & Optics",
    "description": "Reflection, refraction, lenses, mirrors, and optical instruments",
    "difficulty": "Intermediate",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 18,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Wave Optics",
    "description": "Interference, diffraction, polarization, and Huygens principle",
    "difficulty": "Intermediate",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 19,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Special Relativity",
    "description": "Postulates, time dilation, length contraction, and mass-energy equivalence",
    "difficulty": "Intermediate",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 20,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Introduction to Quantum Physics",
    "description": "Blackbody radiation, photoelectric effect, and de Broglie waves",
    "difficulty": "Intermediate",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 21,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Quantum Mechanics",
    "description": "Schrodinger equation, wave functions, uncertainty, and operators",
    "difficulty": "Advanced",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 22,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Atomic Physics",
    "description": "Atomic spectra, Bohr model, electron configuration, and X-rays",
    "difficulty": "Advanced",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 23,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Nuclear Physics",
    "description": "Nuclear structure, radioactive decay, fission, and fusion",
    "difficulty": "Advanced",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 24,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Particle Physics",
    "description": "The Standard Model, quarks, leptons, bosons, and the Higgs boson",
    "difficulty": "Advanced",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 25,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Solid State Physics",
    "description": "Crystal structures, energy bands, semiconductors, and superconductivity",
    "difficulty": "Advanced",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 26,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Plasma Physics",
    "description": "Plasma properties, magnetic confinement, and fusion applications",
    "difficulty": "Advanced",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 27,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Astrophysics",
    "description": "Stars, stellar evolution, white dwarfs, neutron stars, and black holes",
    "difficulty": "Advanced",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 28,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Cosmology",
    "description": "Big Bang theory, cosmic microwave background, dark matter, and dark energy",
    "difficulty": "Advanced",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 29,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Statistical Mechanics",
    "description": "Partition functions, ensembles, and quantum statistics",
    "difficulty": "Advanced",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 30,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Theoretical Physics",
    "description": "General relativity, quantum field theory, and string theory overview",
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
