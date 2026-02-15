/**
 * Content Registry - Maps all apps and their content schemas
 * This is the central registry for the Universal Admin Dashboard
 */

export const APP_REGISTRY = {
  'learn-apt': {
    id: 'learn-apt',
    name: 'learn-apt',
    displayName: 'Aptitude Tests',
    description: 'JSON-based aptitude tests with multiple question types',
    contentType: 'json',
    dataPath: 'apps/learn-apt/manifest.json',
    icon: '🧠',
    fields: [
      {
        name: 'id',
        label: 'Test ID',
        type: 'text',
        required: true,
        placeholder: 'logical-reasoning-001',
      },
      {
        name: 'title',
        label: 'Test Title',
        type: 'text',
        required: true,
        placeholder: 'Logical Reasoning Test',
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty Level',
        type: 'select',
        required: true,
        options: [
          { label: 'Beginner', value: 'beginner' },
          { label: 'Intermediate', value: 'intermediate' },
          { label: 'Advanced', value: 'advanced' },
        ],
      },
      {
        name: 'duration',
        label: 'Duration (minutes)',
        type: 'number',
        required: true,
        validation: { min: 5, max: 180 },
      },
      {
        name: 'totalQuestions',
        label: 'Total Questions',
        type: 'number',
        required: true,
        validation: { min: 1, max: 100 },
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        required: true,
        options: [
          { label: 'Logical Reasoning', value: 'logical-reasoning' },
          { label: 'Numerical Ability', value: 'numerical-ability' },
          { label: 'Verbal Reasoning', value: 'verbal-reasoning' },
          { label: 'Data Interpretation', value: 'data-interpretation' },
        ],
      },
    ],
  },
  
  'learn-jee': {
    id: 'learn-jee',
    name: 'learn-jee',
    displayName: 'JEE Exam Prep',
    description: 'JEE exam preparation content (Physics, Chemistry, Mathematics)',
    contentType: 'json',
    dataPath: 'apps/learn-jee/manifest.json',
    icon: '📚',
    fields: [
      {
        name: 'id',
        label: 'Lesson ID',
        type: 'text',
        required: true,
        placeholder: 'physics-mechanics-001',
      },
      {
        name: 'title',
        label: 'Lesson Title',
        type: 'text',
        required: true,
        placeholder: 'Introduction to Mechanics',
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'select',
        required: true,
        options: [
          { label: 'Physics', value: 'physics' },
          { label: 'Chemistry', value: 'chemistry' },
          { label: 'Mathematics', value: 'mathematics' },
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Easy', value: 'easy' },
          { label: 'Medium', value: 'medium' },
          { label: 'Hard', value: 'hard' },
        ],
      },
      {
        name: 'objectives',
        label: 'Learning Objectives',
        type: 'array',
      },
    ],
  },
  
  'learn-neet': {
    id: 'learn-neet',
    name: 'learn-neet',
    displayName: 'NEET Exam Prep',
    description: 'NEET exam preparation content (Biology, Physics, Chemistry)',
    contentType: 'json',
    dataPath: 'apps/learn-neet/manifest.json',
    icon: '🔬',
    fields: [
      {
        name: 'id',
        label: 'Lesson ID',
        type: 'text',
        required: true,
        placeholder: 'biology-cell-001',
      },
      {
        name: 'title',
        label: 'Lesson Title',
        type: 'text',
        required: true,
      },
      {
        name: 'subject',
        label: 'Subject',
        type: 'select',
        required: true,
        options: [
          { label: 'Biology', value: 'biology' },
          { label: 'Physics', value: 'physics' },
          { label: 'Chemistry', value: 'chemistry' },
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
    ],
  },
  
  'learn-ias': {
    id: 'learn-ias',
    name: 'learn-ias',
    displayName: 'IAS Exam Prep',
    description: 'IAS/UPSC exam preparation content',
    contentType: 'json',
    dataPath: 'apps/learn-ias/manifest.json',
    icon: '🏛️',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'category',
        label: 'Category',
        type: 'select',
        options: [
          { label: 'General Studies', value: 'general-studies' },
          { label: 'Current Affairs', value: 'current-affairs' },
          { label: 'Essay', value: 'essay' },
          { label: 'Optional Subject', value: 'optional' },
        ],
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
    ],
  },
  
  // MOVED TO apps-backup/apps-backup.A as per requirement 7
  // 'learn-govt-jobs': {
  //   id: 'learn-govt-jobs',
  //   name: 'learn-govt-jobs',
  //   displayName: 'Government Jobs',
  //   description: 'Government job listings with geographic and deadline data',
  //   contentType: 'json',
  //   dataPath: 'apps-backup/apps-backup.A/learn-govt-jobs/data',
  //   icon: '🏢',
  // },

  'learn-ai': {
    id: 'learn-ai',
    name: 'learn-ai',
    displayName: 'Artificial Intelligence',
    description: 'AI and machine learning courses',
    contentType: 'json',
    dataPath: 'apps/learn-ai/data',
    icon: '🤖',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-biology': {
    id: 'learn-biology',
    name: 'learn-biology',
    displayName: 'Biology',
    description: 'Biology courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-biology/data',
    icon: '🧬',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-chemistry': {
    id: 'learn-chemistry',
    name: 'learn-chemistry',
    displayName: 'Chemistry',
    description: 'Chemistry courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-chemistry/data',
    icon: '⚗️',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-developer': {
    id: 'learn-developer',
    name: 'learn-developer',
    displayName: 'Software Development',
    description: 'Software development and programming courses',
    contentType: 'json',
    dataPath: 'apps/learn-developer/data',
    icon: '💻',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  // MOVED TO apps-backup/apps-backup.A as per requirement 7
  // 'learn-finesse': {
  //   id: 'learn-finesse',
  //   name: 'learn-finesse',
  //   displayName: 'Professional Skills',
  //   description: 'Professional development and soft skills',
  //   contentType: 'json',
  //   dataPath: 'apps-backup/apps-backup.A/learn-finesse/data',
  //   icon: '🎯',
  // },

  'learn-geography': {
    id: 'learn-geography',
    name: 'learn-geography',
    displayName: 'Geography',
    description: 'Geography courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-geography/data',
    icon: '🌍',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-management': {
    id: 'learn-management',
    name: 'learn-management',
    displayName: 'Management',
    description: 'Management and business courses',
    contentType: 'json',
    dataPath: 'apps/learn-management/data',
    icon: '📊',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-math': {
    id: 'learn-math',
    name: 'learn-math',
    displayName: 'Mathematics',
    description: 'Mathematics courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-math/data',
    icon: '📐',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-physics': {
    id: 'learn-physics',
    name: 'learn-physics',
    displayName: 'Physics',
    description: 'Physics courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-physics/data',
    icon: '⚛️',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },

  'learn-pr': {
    id: 'learn-pr',
    name: 'learn-pr',
    displayName: 'Public Relations',
    description: 'Public relations and communication courses',
    contentType: 'json',
    dataPath: 'apps/learn-pr/data',
    icon: '📢',
    fields: [
      {
        name: 'id',
        label: 'Content ID',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        label: 'Title',
        type: 'text',
        required: true,
      },
      {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        required: true,
      },
      {
        name: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
          { label: 'Beginner', value: 'Beginner' },
          { label: 'Intermediate', value: 'Intermediate' },
          { label: 'Advanced', value: 'Advanced' },
        ],
      },
    ],
  },
};

export function getAppSchema(appId) {
  return APP_REGISTRY[appId];
}

export function getAllApps() {
  return Object.values(APP_REGISTRY);
}

export function getAppsByContentType(contentType) {
  return Object.values(APP_REGISTRY).filter(app => app.contentType === contentType);
}
