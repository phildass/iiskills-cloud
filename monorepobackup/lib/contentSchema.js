/**
 * Universal Content Schema
 * 
 * Defines the standard schema for all content types across all learning apps.
 * This ensures consistency and enables automated validation.
 */

/**
 * Course Schema
 * @typedef {Object} Course
 * @property {string} id - Unique course identifier within the app (e.g., "ai-101")
 * @property {string} title - Course title
 * @property {string} description - Detailed course description
 * @property {string} sourceApp - The app this course belongs to (e.g., "learn-ai")
 * @property {string} [instructor] - Instructor name (optional)
 * @property {string} [duration] - Estimated duration (optional)
 * @property {string} [level] - Difficulty level: beginner, intermediate, advanced (optional)
 * @property {string[]} [tags] - Array of relevant tags (optional)
 */
export const courseSchema = {
  type: 'course',
  required: ['id', 'title', 'description', 'sourceApp'],
  optional: ['instructor', 'duration', 'level', 'tags'],
  fields: {
    id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    title: { type: 'string', minLength: 3, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    sourceApp: { type: 'string', pattern: /^learn-[a-z-]+$/ },
    instructor: { type: 'string', maxLength: 100 },
    duration: { type: 'string', maxLength: 50 },
    level: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
    tags: { type: 'array', items: { type: 'string' } }
  }
};

/**
 * Module Schema
 * @typedef {Object} Module
 * @property {string} id - Unique module identifier within the app (e.g., "ai-101-module-1")
 * @property {string} title - Module title
 * @property {string} description - Module description
 * @property {string} sourceApp - The app this module belongs to
 * @property {string} course_id - Parent course ID (must exist in courses/)
 * @property {number} [order] - Display order within the course (optional)
 * @property {string} [duration] - Estimated duration (optional)
 */
export const moduleSchema = {
  type: 'module',
  required: ['id', 'title', 'description', 'sourceApp', 'course_id'],
  optional: ['order', 'duration'],
  fields: {
    id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    title: { type: 'string', minLength: 3, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    sourceApp: { type: 'string', pattern: /^learn-[a-z-]+$/ },
    course_id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    order: { type: 'number', min: 1 },
    duration: { type: 'string', maxLength: 50 }
  }
};

/**
 * Lesson Schema
 * @typedef {Object} Lesson
 * @property {string} id - Unique lesson identifier within the app (e.g., "ai-101-lesson-1")
 * @property {string} title - Lesson title
 * @property {string} description - Lesson description
 * @property {string} sourceApp - The app this lesson belongs to
 * @property {string} module_id - Parent module ID (must exist in modules/)
 * @property {string} [course_id] - Parent course ID for convenience (optional but recommended)
 * @property {number} [order] - Display order within the module (optional)
 * @property {string} [content] - Full lesson content (optional, can be stored separately)
 * @property {string} [duration] - Estimated duration (optional)
 * @property {string} [video_url] - Video URL if applicable (optional)
 */
export const lessonSchema = {
  type: 'lesson',
  required: ['id', 'title', 'description', 'sourceApp', 'module_id'],
  optional: ['course_id', 'order', 'content', 'duration', 'video_url'],
  fields: {
    id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    title: { type: 'string', minLength: 3, maxLength: 200 },
    description: { type: 'string', minLength: 10, maxLength: 2000 },
    sourceApp: { type: 'string', pattern: /^learn-[a-z-]+$/ },
    module_id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    course_id: { type: 'string', pattern: /^[a-z0-9-]+$/ },
    order: { type: 'number', min: 1 },
    content: { type: 'string' },
    duration: { type: 'string', maxLength: 50 },
    video_url: { type: 'string', pattern: /^https?:\/\/.+/ }
  }
};

/**
 * Validate a content object against its schema
 * @param {Object} data - The content object to validate
 * @param {Object} schema - The schema to validate against
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateContent(data, schema) {
  const errors = [];

  // Check required fields
  for (const field of schema.required) {
    if (!(field in data) || data[field] === null || data[field] === undefined || data[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate field types and constraints
  for (const [fieldName, fieldDef] of Object.entries(schema.fields)) {
    const value = data[fieldName];
    
    // Skip optional fields that are not present
    if (value === undefined || value === null) {
      if (schema.required.includes(fieldName)) {
        // Already reported above
      }
      continue;
    }

    // Type validation
    if (fieldDef.type === 'string') {
      if (typeof value !== 'string') {
        errors.push(`Field ${fieldName} must be a string`);
        continue;
      }
      if (fieldDef.minLength && value.length < fieldDef.minLength) {
        errors.push(`Field ${fieldName} must be at least ${fieldDef.minLength} characters`);
      }
      if (fieldDef.maxLength && value.length > fieldDef.maxLength) {
        errors.push(`Field ${fieldName} must be at most ${fieldDef.maxLength} characters`);
      }
      if (fieldDef.pattern && !fieldDef.pattern.test(value)) {
        errors.push(`Field ${fieldName} does not match required pattern`);
      }
      if (fieldDef.enum && !fieldDef.enum.includes(value)) {
        errors.push(`Field ${fieldName} must be one of: ${fieldDef.enum.join(', ')}`);
      }
    } else if (fieldDef.type === 'number') {
      if (typeof value !== 'number') {
        errors.push(`Field ${fieldName} must be a number`);
        continue;
      }
      if (fieldDef.min !== undefined && value < fieldDef.min) {
        errors.push(`Field ${fieldName} must be at least ${fieldDef.min}`);
      }
      if (fieldDef.max !== undefined && value > fieldDef.max) {
        errors.push(`Field ${fieldName} must be at most ${fieldDef.max}`);
      }
    } else if (fieldDef.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`Field ${fieldName} must be an array`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get the appropriate schema for a content type
 * @param {string} type - Content type: 'course', 'module', or 'lesson'
 * @returns {Object} The schema object
 */
export function getSchema(type) {
  switch (type) {
    case 'course':
      return courseSchema;
    case 'module':
      return moduleSchema;
    case 'lesson':
      return lessonSchema;
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}
