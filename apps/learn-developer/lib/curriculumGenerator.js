/**
 * Curriculum Generator — Web Developer Bootcamp
 *
 * Exports module and course metadata used by the lesson pages and curriculum page.
 * Structure: 3 courses × 10 modules × 10 lessons = 300 lessons per app.
 */

export const courses = [
  {
    "id": 1,
    "slug": "basic",
    "title": "Basic Course",
    "subtitle": "Web Development Foundations",
    "description": "Master the fundamentals of web development from HTML to JavaScript.",
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
    "subtitle": "Frontend & Backend Development",
    "description": "Build dynamic applications with modern frontend and backend technologies.",
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
    "subtitle": "Full-Stack & DevOps",
    "description": "Deploy production-grade full-stack applications with cloud and DevOps skills.",
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
    "title": "How the Web Works",
    "description": "HTTP, DNS, browsers, and the request-response cycle",
    "difficulty": "Beginner",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 2,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "HTML Foundations",
    "description": "Semantic markup, document structure, and accessibility",
    "difficulty": "Beginner",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 3,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "CSS Essentials",
    "description": "Selectors, box model, layouts, and styling techniques",
    "difficulty": "Beginner",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 4,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "JavaScript Basics",
    "description": "Variables, functions, control flow, and data types",
    "difficulty": "Beginner",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 5,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "DOM Manipulation",
    "description": "Querying elements, events, and dynamic page updates",
    "difficulty": "Beginner",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 6,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Responsive Design",
    "description": "Media queries, flexbox, CSS grid, and mobile-first design",
    "difficulty": "Beginner",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 7,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Version Control with Git",
    "description": "Commits, branches, merging, and collaborative workflows",
    "difficulty": "Beginner",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 8,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Command Line & Dev Tools",
    "description": "Terminal essentials, browser DevTools, and debugging",
    "difficulty": "Beginner",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 9,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Web Accessibility & Standards",
    "description": "WCAG guidelines, ARIA roles, and inclusive design",
    "difficulty": "Beginner",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 10,
    "course_id": 1,
    "course_title": "Basic Course",
    "title": "Web Performance Basics",
    "description": "Page speed, asset optimization, and Core Web Vitals",
    "difficulty": "Beginner",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 11,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "React Fundamentals",
    "description": "Components, props, state, and the virtual DOM",
    "difficulty": "Intermediate",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 12,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "React Hooks & State Management",
    "description": "useState, useEffect, useContext, and Redux",
    "difficulty": "Intermediate",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 13,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Node.js Basics",
    "description": "Event loop, modules, file system, and async programming",
    "difficulty": "Intermediate",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 14,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Express.js & REST APIs",
    "description": "Routing, middleware, RESTful design, and JSON responses",
    "difficulty": "Intermediate",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 15,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Databases & SQL",
    "description": "Relational databases, queries, joins, and PostgreSQL",
    "difficulty": "Intermediate",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 16,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "MongoDB & NoSQL",
    "description": "Documents, collections, CRUD operations, and Mongoose",
    "difficulty": "Intermediate",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 17,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Authentication & Security",
    "description": "JWT, sessions, OAuth, bcrypt, and OWASP fundamentals",
    "difficulty": "Intermediate",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 18,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Testing in JavaScript",
    "description": "Jest, unit tests, integration tests, and TDD workflow",
    "difficulty": "Intermediate",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 19,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "Frontend Build Tools",
    "description": "Webpack, Vite, npm scripts, and module bundling",
    "difficulty": "Intermediate",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 20,
    "course_id": 2,
    "course_title": "Intermediate Course",
    "title": "API Integration",
    "description": "Fetch, Axios, third-party APIs, and error handling",
    "difficulty": "Intermediate",
    "order": 10,
    "lesson_count": 10
  },
  {
    "id": 21,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "TypeScript Deep Dive",
    "description": "Types, interfaces, generics, decorators, and strict mode",
    "difficulty": "Advanced",
    "order": 1,
    "lesson_count": 10
  },
  {
    "id": 22,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Next.js & Server-Side Rendering",
    "description": "SSR, SSG, ISR, API routes, and edge functions",
    "difficulty": "Advanced",
    "order": 2,
    "lesson_count": 10
  },
  {
    "id": 23,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Cloud & AWS Fundamentals",
    "description": "EC2, S3, Lambda, RDS, IAM, and cloud architecture",
    "difficulty": "Advanced",
    "order": 3,
    "lesson_count": 10
  },
  {
    "id": 24,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Docker & Containers",
    "description": "Images, containers, Dockerfile, Docker Compose, and registries",
    "difficulty": "Advanced",
    "order": 4,
    "lesson_count": 10
  },
  {
    "id": 25,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "CI/CD Pipelines",
    "description": "GitHub Actions, automated testing, deployments, and pipelines",
    "difficulty": "Advanced",
    "order": 5,
    "lesson_count": 10
  },
  {
    "id": 26,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Microservices Architecture",
    "description": "Service decomposition, inter-service communication, and patterns",
    "difficulty": "Advanced",
    "order": 6,
    "lesson_count": 10
  },
  {
    "id": 27,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "GraphQL",
    "description": "Schema definition, resolvers, queries, mutations, and subscriptions",
    "difficulty": "Advanced",
    "order": 7,
    "lesson_count": 10
  },
  {
    "id": 28,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "System Design",
    "description": "Scalability, caching, load balancing, and distributed systems",
    "difficulty": "Advanced",
    "order": 8,
    "lesson_count": 10
  },
  {
    "id": 29,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Performance & Optimization",
    "description": "Profiling, lazy loading, code splitting, and SEO",
    "difficulty": "Advanced",
    "order": 9,
    "lesson_count": 10
  },
  {
    "id": 30,
    "course_id": 3,
    "course_title": "Advanced Course",
    "title": "Career & Portfolio Building",
    "description": "Resume, GitHub profile, open source, and interview prep",
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
