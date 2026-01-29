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
    dataPath: 'apps/learn-apt/manifest.json',
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
    contentType: 'markdown',
    dataPath: 'apps/learn-cricket/CONTENT.md',
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
    dataPath: 'apps/learn-jee/manifest.json',
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
    dataPath: 'apps/learn-neet/manifest.json',
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
    dataPath: 'apps/learn-ias/manifest.json',
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
    dataPath: 'apps/learn-govt-jobs/data',
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
