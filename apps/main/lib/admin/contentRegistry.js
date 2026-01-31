/**
 * Content Registry - Maps all apps and their content schemas
 * This is the central registry for the Universal Admin Dashboard
 */

const APP_REGISTRY = {
  'learn-apt': {
    id: 'learn-apt',
    name: 'learn-apt',
    displayName: 'Aptitude Tests',
    description: 'JSON-based aptitude tests with multiple question types',
    contentType: 'json',
    dataPath: 'learn-apt/manifest.json',
    icon: '🧠',
    fields: [
      { name: 'id', label: 'Test ID', type: 'text', required: true, placeholder: 'logical-reasoning-001' },
      { name: 'title', label: 'Test Title', type: 'text', required: true, placeholder: 'Logical Reasoning Test' },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
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
      { name: 'duration', label: 'Duration (minutes)', type: 'number', required: true, validation: { min: 5, max: 180 } },
      { name: 'totalQuestions', label: 'Total Questions', type: 'number', required: true, validation: { min: 1, max: 100 } },
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
  
  'learn-cricket': {
    id: 'learn-cricket',
    name: 'learn-cricket',
    displayName: 'Cricket Content',
    description: 'Markdown-based cricket lessons and articles',
    contentType: 'json',
    dataPath: 'apps/learn-cricket/manifest.json',
    icon: '🏏',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true, placeholder: 'batting-basics-001' },
      { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Batting Basics' },
      {
        name: 'type',
        label: 'Content Type',
        type: 'select',
        required: true,
        options: [
          { label: 'Lesson', value: 'lesson' },
          { label: 'Article', value: 'article' },
          { label: 'Sports Guide', value: 'sports' },
        ],
      },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'objectives', label: 'Learning Objectives', type: 'array', placeholder: 'Add learning objective' },
      { name: 'content', label: 'Content (Markdown)', type: 'textarea', required: true },
    ],
  },
  
  'learn-jee': {
    id: 'learn-jee',
    name: 'learn-jee',
    displayName: 'JEE Exam Prep',
    description: 'JEE exam preparation content (Physics, Chemistry, Mathematics)',
    contentType: 'json',
    dataPath: 'learn-jee/manifest.json',
    icon: '📚',
    fields: [
      { name: 'id', label: 'Lesson ID', type: 'text', required: true, placeholder: 'physics-mechanics-001' },
      { name: 'title', label: 'Lesson Title', type: 'text', required: true, placeholder: 'Introduction to Mechanics' },
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
      { name: 'description', label: 'Description', type: 'textarea', required: true },
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
      { name: 'objectives', label: 'Learning Objectives', type: 'array' },
    ],
  },
  
  'learn-neet': {
    id: 'learn-neet',
    name: 'learn-neet',
    displayName: 'NEET Exam Prep',
    description: 'NEET exam preparation content (Biology, Physics, Chemistry)',
    contentType: 'json',
    dataPath: 'learn-neet/manifest.json',
    icon: '🔬',
    fields: [
      { name: 'id', label: 'Lesson ID', type: 'text', required: true, placeholder: 'biology-cell-001' },
      { name: 'title', label: 'Lesson Title', type: 'text', required: true },
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
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-ias': {
    id: 'learn-ias',
    name: 'learn-ias',
    displayName: 'IAS Exam Prep',
    description: 'IAS/UPSC exam preparation content',
    contentType: 'json',
    dataPath: 'learn-ias/manifest.json',
    icon: '🏛️',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
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
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-govt-jobs': {
    id: 'learn-govt-jobs',
    name: 'learn-govt-jobs',
    displayName: 'Government Jobs',
    description: 'Government job listings with geographic and deadline data',
    contentType: 'json',
    dataPath: 'apps/learn-govt-jobs/manifest.json',
    icon: '🏢',
    fields: [
      { name: 'id', label: 'Job ID', type: 'text', required: true, placeholder: 'job-bihar-patna-clerk-001' },
      { name: 'title', label: 'Job Title', type: 'text', required: true, placeholder: 'Junior Clerk' },
      {
        name: 'state',
        label: 'State',
        type: 'select',
        required: true,
        options: [
          { label: 'Bihar', value: 'bihar' },
          { label: 'Maharashtra', value: 'maharashtra' },
          { label: 'Delhi', value: 'delhi' },
          { label: 'Karnataka', value: 'karnataka' },
          { label: 'Tamil Nadu', value: 'tamil-nadu' },
          { label: 'All India', value: 'all-india' },
        ],
      },
      { name: 'district', label: 'District', type: 'select', options: [] },
      { name: 'deadline', label: 'Application Deadline', type: 'date', required: true },
      { name: 'examDate', label: 'Exam Date', type: 'date' },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
          { label: 'Upcoming', value: 'upcoming' },
        ],
      },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
      { name: 'eligibility', label: 'Eligibility', type: 'nested' },
    ],
  },
  
  'learn-ai': {
    id: 'learn-ai',
    name: 'learn-ai',
    displayName: 'AI & Machine Learning',
    description: 'AI and Machine Learning courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-ai/manifest.json',
    icon: '🤖',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-chemistry': {
    id: 'learn-chemistry',
    name: 'learn-chemistry',
    displayName: 'Chemistry',
    description: 'Chemistry courses and lessons',
    contentType: 'json',
    dataPath: 'apps/learn-chemistry/manifest.json',
    icon: '🧪',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-geography': {
    id: 'learn-geography',
    name: 'learn-geography',
    displayName: 'Geography',
    description: 'Geography courses and content',
    contentType: 'json',
    dataPath: 'apps/learn-geography/manifest.json',
    icon: '🌍',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-leadership': {
    id: 'learn-leadership',
    name: 'learn-leadership',
    displayName: 'Leadership',
    description: 'Leadership development content',
    contentType: 'json',
    dataPath: 'apps/learn-leadership/manifest.json',
    icon: '👔',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-management': {
    id: 'learn-management',
    name: 'learn-management',
    displayName: 'Management',
    description: 'Management and business content',
    contentType: 'json',
    dataPath: 'apps/learn-management/manifest.json',
    icon: '📊',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-math': {
    id: 'learn-math',
    name: 'learn-math',
    displayName: 'Mathematics',
    description: 'Mathematics courses and problems',
    contentType: 'json',
    dataPath: 'apps/learn-math/manifest.json',
    icon: '📐',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-physics': {
    id: 'learn-physics',
    name: 'learn-physics',
    displayName: 'Physics',
    description: 'Physics courses and experiments',
    contentType: 'json',
    dataPath: 'apps/learn-physics/manifest.json',
    icon: '⚛️',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-pr': {
    id: 'learn-pr',
    name: 'learn-pr',
    displayName: 'Public Relations',
    description: 'Public Relations and communication content',
    contentType: 'json',
    dataPath: 'apps/learn-pr/manifest.json',
    icon: '📢',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
  
  'learn-winning': {
    id: 'learn-winning',
    name: 'learn-winning',
    displayName: 'Winning Strategies',
    description: 'Competitive strategies and success content',
    contentType: 'json',
    dataPath: 'apps/learn-winning/manifest.json',
    icon: '🏆',
    fields: [
      { name: 'id', label: 'Content ID', type: 'text', required: true },
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea', required: true },
    ],
  },
};

function getAppSchema(appId) {
  return APP_REGISTRY[appId];
}

function getAllApps() {
  return Object.values(APP_REGISTRY);
}

function getAppsByContentType(contentType) {
  return Object.values(APP_REGISTRY).filter(app => app.contentType === contentType);
}

module.exports = { APP_REGISTRY, getAppSchema, getAllApps, getAppsByContentType };
