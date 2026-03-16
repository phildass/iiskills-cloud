/**
 * Curriculum Generator - Geography
 *
 * Defines the 3-course structure: Basic (modules 1-10), Intermediate (11-20), Advanced (21-30).
 * Each course has 10 modules × 10 lessons = 100 lessons (300 lessons total).
 */

export const moduleTopics = [
  // ── Basic Course (Modules 1–10) ────────────────────────────────────────────
  { id: 1,  title: "Physical Geography",           description: "Landforms, climate, and natural features",                            order: 1,  course: "Basic",        difficulty: "Beginner" },
  { id: 2,  title: "World Continents",             description: "Exploring the seven continents",                                      order: 2,  course: "Basic",        difficulty: "Beginner" },
  { id: 3,  title: "Oceans and Seas",              description: "Marine geography and ocean systems",                                  order: 3,  course: "Basic",        difficulty: "Beginner" },
  { id: 4,  title: "World Rivers & Lakes",         description: "Major rivers, lakes, and water bodies across the globe",              order: 4,  course: "Basic",        difficulty: "Beginner" },
  { id: 5,  title: "Mountains & Plateaus",         description: "Major mountain ranges, plateaus, and their formation",                order: 5,  course: "Basic",        difficulty: "Beginner" },
  { id: 6,  title: "Deserts & Forests",            description: "Major deserts, rainforests, and biome distribution",                  order: 6,  course: "Basic",        difficulty: "Beginner" },
  { id: 7,  title: "Countries & Capitals",         description: "Nations of the world, their capitals, and key facts",                 order: 7,  course: "Basic",        difficulty: "Beginner" },
  { id: 8,  title: "Map Reading Skills",           description: "Scale, symbols, coordinates, latitude, and longitude",                order: 8,  course: "Basic",        difficulty: "Beginner" },
  { id: 9,  title: "Natural Disasters",            description: "Earthquakes, volcanoes, tsunamis, and cyclones",                      order: 9,  course: "Basic",        difficulty: "Beginner" },
  { id: 10, title: "World Cultures",               description: "Diversity of languages, religions, and cultural traditions",          order: 10, course: "Basic",        difficulty: "Beginner" },

  // ── Intermediate Course (Modules 11–20) ────────────────────────────────────
  { id: 11, title: "Climate Zones",                description: "Understanding global climate patterns and classification",             order: 1,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 12, title: "Human Geography",             description: "Population, culture, and urbanisation",                               order: 2,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 13, title: "Economic Geography",          description: "Resources, trade, and economic development",                           order: 3,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 14, title: "Agriculture & Food",          description: "Global farming systems, food security, and land use",                  order: 4,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 15, title: "Urbanisation",                description: "City growth, megacities, and urban planning challenges",               order: 5,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 16, title: "Transport & Trade",           description: "Global transport networks and international trade routes",             order: 6,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 17, title: "Energy Resources",            description: "Fossil fuels, renewables, and global energy consumption",             order: 7,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 18, title: "Water Resources",             description: "Freshwater availability, river management, and water conflicts",      order: 8,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 19, title: "Political Geography",         description: "Nations, borders, boundaries, and sovereignty",                       order: 9,  course: "Intermediate", difficulty: "Intermediate" },
  { id: 20, title: "Tourism Geography",           description: "Global tourism trends, heritage sites, and ecotourism",               order: 10, course: "Intermediate", difficulty: "Intermediate" },

  // ── Advanced Course (Modules 21–30) ────────────────────────────────────────
  { id: 21, title: "Environmental Issues",         description: "Climate change, deforestation, and sustainability",                   order: 1,  course: "Advanced",     difficulty: "Advanced" },
  { id: 22, title: "Geopolitics",                  description: "Political boundaries, alliances, and global power dynamics",         order: 2,  course: "Advanced",     difficulty: "Advanced" },
  { id: 23, title: "Geographic Information Systems",description: "GIS technology, mapping, and spatial data analysis",               order: 3,  course: "Advanced",     difficulty: "Advanced" },
  { id: 24, title: "Glaciology",                   description: "Glaciers, ice sheets, permafrost, and cryosphere dynamics",         order: 4,  course: "Advanced",     difficulty: "Advanced" },
  { id: 25, title: "Oceanography",                 description: "Ocean circulation, currents, marine ecosystems, and tides",         order: 5,  course: "Advanced",     difficulty: "Advanced" },
  { id: 26, title: "Demography",                   description: "Population dynamics, migration, ageing, and fertility trends",      order: 6,  course: "Advanced",     difficulty: "Advanced" },
  { id: 27, title: "Biogeography",                 description: "Species distribution, ecosystems, biomes, and conservation",       order: 7,  course: "Advanced",     difficulty: "Advanced" },
  { id: 28, title: "Remote Sensing",               description: "Satellite imagery, drones, and geographic data collection",        order: 8,  course: "Advanced",     difficulty: "Advanced" },
  { id: 29, title: "Climate Modelling",            description: "Climate simulations, prediction models, and scenario analysis",     order: 9,  course: "Advanced",     difficulty: "Advanced" },
  { id: 30, title: "Urban Sustainability",         description: "Smart cities, green infrastructure, and resilient urban futures",   order: 10, course: "Advanced",     difficulty: "Advanced" },
];

/**
 * The 3-course structure: Basic → Intermediate → Advanced.
 * Each course spans 10 modules and 100 lessons (10 lessons per module).
 */
export const COURSES = [
  {
    id: "basic",
    title: "Basic Geography",
    level: "Basic",
    description: "Explore the physical world: continents, oceans, mountains, countries, and natural wonders.",
    moduleRange: [1, 10],
    moduleCount: 10,
    lessonCount: 100,
    color: "green",
    emoji: "🟢",
    startModuleId: 1,
  },
  {
    id: "intermediate",
    title: "Intermediate Geography",
    level: "Intermediate",
    description: "Understand climate zones, human geography, economic systems, and resource management.",
    moduleRange: [11, 20],
    moduleCount: 10,
    lessonCount: 100,
    color: "blue",
    emoji: "🔵",
    startModuleId: 11,
  },
  {
    id: "advanced",
    title: "Advanced Geography",
    level: "Advanced",
    description: "Analyse environmental issues, geopolitics, GIS technology, and urban sustainability.",
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

