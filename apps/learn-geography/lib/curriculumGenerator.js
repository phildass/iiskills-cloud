/**
 * Curriculum Generator — Geography Mastery
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    id: 1,
    slug: "basic",
    title: "Basic Course",
    subtitle: "Geographic Foundations",
    description: "Explore the fundamental concepts of physical and world geography.",
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
    subtitle: "World & Human Geography",
    description: "Understand how humans interact with and shape geographic space.",
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
    subtitle: "Applied & Contemporary Geography",
    description:
      "Apply geographic analysis to real-world environmental and geopolitical challenges.",
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
    title: "Basic Geography",
    level: "Basic",
    description: "Explore the fundamental concepts of physical and world geography.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Geography",
    level: "Intermediate",
    description: "Understand how humans interact with and shape geographic space.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Geography",
    level: "Advanced",
    description:
      "Apply geographic analysis to real-world environmental and geopolitical challenges.",
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
    title: "Introduction to Geography",
    description: "What geography is, its branches, and key geographical tools",
    difficulty: "Beginner",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 2,
    course_id: 1,
    course_title: "Basic Course",
    title: "Maps & Cartography",
    description: "Map types, scales, projections, coordinates, and GPS",
    difficulty: "Beginner",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 3,
    course_id: 1,
    course_title: "Basic Course",
    title: "Physical Landforms",
    description: "Mountains, valleys, plains, rivers, and tectonic processes",
    difficulty: "Beginner",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 4,
    course_id: 1,
    course_title: "Basic Course",
    title: "Weather & Atmosphere",
    description: "Atmospheric layers, weather systems, and precipitation",
    difficulty: "Beginner",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 5,
    course_id: 1,
    course_title: "Basic Course",
    title: "World Oceans & Seas",
    description: "Ocean currents, tides, marine geography, and ocean floors",
    difficulty: "Beginner",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 6,
    course_id: 1,
    course_title: "Basic Course",
    title: "Soil & Vegetation",
    description: "Soil types, biomes, ecosystems, and biodiversity",
    difficulty: "Beginner",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 7,
    course_id: 1,
    course_title: "Basic Course",
    title: "World Continents Overview",
    description: "Physical and cultural features of all seven continents",
    difficulty: "Beginner",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 8,
    course_id: 1,
    course_title: "Basic Course",
    title: "Natural Resources",
    description: "Types, distribution, extraction, and sustainable use",
    difficulty: "Beginner",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 9,
    course_id: 1,
    course_title: "Basic Course",
    title: "Population Geography",
    description: "Demographics, population distribution, and migration patterns",
    difficulty: "Beginner",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 10,
    course_id: 1,
    course_title: "Basic Course",
    title: "Geographic Information Tools",
    description: "Satellite imagery, GIS basics, and geographic data sources",
    difficulty: "Beginner",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 11,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Climate Zones & Biomes",
    description: "Koppen classification, tropical, arid, temperate, and polar zones",
    difficulty: "Intermediate",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 12,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Human Geography",
    description: "Population dynamics, settlement patterns, and human activities",
    difficulty: "Intermediate",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 13,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Cultural Geography",
    description: "Languages, religions, cultural landscapes, and spatial identity",
    difficulty: "Intermediate",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 14,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Economic Geography",
    description: "Industrial location, global trade, development indicators",
    difficulty: "Intermediate",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 15,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Urban Geography",
    description: "Cities, urbanization, land use models, and urban issues",
    difficulty: "Intermediate",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 16,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Rural Geography",
    description: "Agricultural systems, land reform, and rural change",
    difficulty: "Intermediate",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 17,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Transport & Connectivity",
    description: "Transport networks, globalization, and logistics geography",
    difficulty: "Intermediate",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 18,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Political Geography",
    description: "Borders, states, sovereignty, and territorial disputes",
    difficulty: "Intermediate",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 19,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Trade & Globalization",
    description: "Global trade flows, economic blocs, and supply chains",
    difficulty: "Intermediate",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 20,
    course_id: 2,
    course_title: "Intermediate Course",
    title: "Water Resources",
    description: "Freshwater, river basins, water scarcity, and management",
    difficulty: "Intermediate",
    order: 10,
    lesson_count: 10,
  },
  {
    id: 21,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Environmental Issues",
    description: "Deforestation, land degradation, biodiversity loss, and solutions",
    difficulty: "Advanced",
    order: 1,
    lesson_count: 10,
  },
  {
    id: 22,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Climate Change Geography",
    description: "Causes, impacts, vulnerability mapping, and adaptation strategies",
    difficulty: "Advanced",
    order: 2,
    lesson_count: 10,
  },
  {
    id: 23,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Geopolitics",
    description: "Power, territory, foreign policy, and global governance",
    difficulty: "Advanced",
    order: 3,
    lesson_count: 10,
  },
  {
    id: 24,
    course_id: 3,
    course_title: "Advanced Course",
    title: "GIS & Remote Sensing",
    description: "Spatial analysis, satellite data, and geographic modelling",
    difficulty: "Advanced",
    order: 4,
    lesson_count: 10,
  },
  {
    id: 25,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Disaster Geography",
    description: "Natural hazards, vulnerability, disaster risk reduction",
    difficulty: "Advanced",
    order: 5,
    lesson_count: 10,
  },
  {
    id: 26,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Sustainable Development",
    description: "SDGs, sustainability frameworks, and geography of development",
    difficulty: "Advanced",
    order: 6,
    lesson_count: 10,
  },
  {
    id: 27,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Coastal Geography",
    description: "Coastal processes, erosion, sea-level rise, and coastal management",
    difficulty: "Advanced",
    order: 7,
    lesson_count: 10,
  },
  {
    id: 28,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Mountain & Arctic Geography",
    description: "Alpine systems, permafrost, glaciers, and cold environments",
    difficulty: "Advanced",
    order: 8,
    lesson_count: 10,
  },
  {
    id: 29,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Geography of Health",
    description: "Disease distribution, health inequalities, and spatial epidemiology",
    difficulty: "Advanced",
    order: 9,
    lesson_count: 10,
  },
  {
    id: 30,
    course_id: 3,
    course_title: "Advanced Course",
    title: "Advanced Geographic Research",
    description: "Research design, fieldwork, GIS analysis, and academic writing",
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
