#!/usr/bin/env node
/**
 * Generate content structure for all learn-* apps
 * Creates data/seed.json files following the learn-ai pattern
 * This ensures the admin dashboard can discover all content
 */

const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '..', 'apps');

// Content templates for each app
const APP_CONTENT = {
  'learn-apt': {
    appName: 'Aptitude Tests',
    modules: [
      { id: 1, title: 'Logical Reasoning', description: 'Master logical puzzles and pattern recognition', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Numerical Ability', description: 'Develop strong mathematical problem-solving skills', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Verbal Reasoning', description: 'Enhance vocabulary and comprehension abilities', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Data Interpretation', description: 'Analyze charts, graphs, and tables effectively', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Quantitative Aptitude', description: 'Advanced mathematical problem solving', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Critical Reasoning', description: 'Develop analytical and critical thinking skills', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Abstract Reasoning', description: 'Master pattern recognition and spatial reasoning', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Problem Solving Techniques', description: 'Advanced strategies for complex problems', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Speed & Accuracy', description: 'Time management and accuracy under pressure', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Mock Tests & Practice', description: 'Full-length aptitude test simulations', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-biology': {
    appName: 'Biology',
    modules: [
      { id: 1, title: 'Cell Biology', description: 'Understanding the basic unit of life', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Genetics & Heredity', description: 'DNA, genes, and inheritance patterns', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Human Anatomy', description: 'Structure and organization of the human body', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Human Physiology', description: 'How body systems function and interact', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Plant Biology', description: 'Plant structure, function, and life cycles', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Ecology & Environment', description: 'Ecosystems and environmental interactions', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Evolution & Biodiversity', description: 'Natural selection and species diversity', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Molecular Biology', description: 'Biological processes at molecular level', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Biotechnology', description: 'Applications of biology in technology', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Medical Biology', description: 'Biology concepts for medical aspirants', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-chemistry': {
    appName: 'Chemistry',
    modules: [
      { id: 1, title: 'Basic Concepts', description: 'Atoms, molecules, and chemical bonding', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Periodic Table', description: 'Elements and periodic properties', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Chemical Reactions', description: 'Types of reactions and stoichiometry', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Organic Chemistry Basics', description: 'Hydrocarbons and functional groups', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Inorganic Chemistry', description: 'Coordination compounds and metallurgy', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Physical Chemistry', description: 'Thermodynamics and chemical kinetics', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Advanced Organic Chemistry', description: 'Reaction mechanisms and synthesis', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Electrochemistry', description: 'Redox reactions and electrochemical cells', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Industrial Chemistry', description: 'Chemical processes and applications', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Environmental Chemistry', description: 'Chemistry of pollution and solutions', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-developer': {
    appName: 'Software Development',
    modules: [
      { id: 1, title: 'Programming Fundamentals', description: 'Core programming concepts and logic', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Web Development Basics', description: 'HTML, CSS, and JavaScript fundamentals', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Version Control with Git', description: 'Managing code with Git and GitHub', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Frontend Frameworks', description: 'React, Vue, and modern frontend development', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Backend Development', description: 'Server-side programming with Node.js', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Databases & SQL', description: 'Working with relational databases', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'API Development', description: 'Building RESTful and GraphQL APIs', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'DevOps & Deployment', description: 'CI/CD, Docker, and cloud deployment', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Full Stack Projects', description: 'Building complete web applications', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Freelancing & Career', description: 'Getting hired and freelance success', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-finesse': {
    appName: 'Professional Skills',
    modules: [
      { id: 1, title: 'Communication Skills', description: 'Effective written and verbal communication', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Professional Etiquette', description: 'Workplace behavior and professionalism', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Time Management', description: 'Productivity and prioritization techniques', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Leadership Fundamentals', description: 'Leading teams and influencing others', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Emotional Intelligence', description: 'Self-awareness and empathy in workplace', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Presentation Skills', description: 'Creating and delivering impactful presentations', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Negotiation Skills', description: 'Win-win negotiation strategies', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Conflict Resolution', description: 'Managing and resolving workplace conflicts', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Personal Branding', description: 'Building your professional identity', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Career Advancement', description: 'Strategic career planning and growth', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-geography': {
    appName: 'Geography',
    modules: [
      { id: 1, title: 'Physical Geography', description: 'Landforms, climate, and natural features', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Indian Geography', description: 'Physical and cultural geography of India', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'World Geography', description: 'Continents, countries, and major features', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Economic Geography', description: 'Resources, industries, and trade patterns', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Population Geography', description: 'Demographics and migration patterns', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Environmental Geography', description: 'Ecosystems and environmental issues', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Geopolitics', description: 'Political geography and international relations', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Urban Geography', description: 'Cities, urbanization, and planning', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'GIS & Mapping', description: 'Geographic Information Systems and cartography', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Exam Preparation', description: 'Geography for competitive exams', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-management': {
    appName: 'Management',
    modules: [
      { id: 1, title: 'Management Principles', description: 'Core concepts of management theory', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Organizational Behavior', description: 'Understanding people in organizations', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Human Resource Management', description: 'Recruiting, training, and managing talent', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Operations Management', description: 'Optimizing business processes', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Financial Management', description: 'Business finance and budgeting', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Marketing Management', description: 'Marketing strategy and execution', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Strategic Management', description: 'Long-term planning and competitive strategy', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Project Management', description: 'Planning and executing projects successfully', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Change Management', description: 'Leading organizational transformation', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Entrepreneurship', description: 'Starting and growing a business', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-math': {
    appName: 'Mathematics',
    modules: [
      { id: 1, title: 'Algebra Basics', description: 'Equations, expressions, and polynomials', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Geometry Fundamentals', description: 'Shapes, angles, and geometric properties', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Trigonometry', description: 'Ratios, identities, and applications', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Calculus I', description: 'Limits, derivatives, and differentiation', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Calculus II', description: 'Integration and applications', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Statistics', description: 'Data analysis and probability', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Linear Algebra', description: 'Matrices, vectors, and transformations', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Differential Equations', description: 'Solving and applying differential equations', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Number Theory', description: 'Properties of integers and primes', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Applied Mathematics', description: 'Real-world mathematical applications', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-physics': {
    appName: 'Physics',
    modules: [
      { id: 1, title: 'Mechanics', description: 'Motion, force, and energy fundamentals', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Thermodynamics', description: 'Heat, temperature, and energy transfer', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Waves & Sound', description: 'Wave properties and sound phenomena', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Electricity', description: 'Current, voltage, and circuits', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Magnetism', description: 'Magnetic fields and electromagnetic induction', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Optics', description: 'Light, reflection, and refraction', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Modern Physics', description: 'Quantum mechanics and relativity', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Nuclear Physics', description: 'Atomic structure and nuclear reactions', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Astrophysics', description: 'Celestial mechanics and cosmology', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Applied Physics', description: 'Physics in engineering and technology', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-pr': {
    appName: 'Public Relations',
    modules: [
      { id: 1, title: 'PR Fundamentals', description: 'Core principles of public relations', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Media Relations', description: 'Working with journalists and media outlets', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Writing for PR', description: 'Press releases and PR content creation', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'Social Media PR', description: 'Managing brand reputation online', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Crisis Communication', description: 'Managing communication during crises', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Event Management', description: 'Planning and executing PR events', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'Brand Building', description: 'Creating and maintaining brand image', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Influencer Relations', description: 'Working with influencers and advocates', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Measurement & Analytics', description: 'Tracking and measuring PR success', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'PR Strategy', description: 'Developing comprehensive PR campaigns', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  },
  'learn-govt-jobs': {
    appName: 'Government Jobs',
    modules: [
      { id: 1, title: 'SSC Exam Preparation', description: 'Staff Selection Commission exam guide', difficulty: 'Beginner', order: 1, lesson_count: 10 },
      { id: 2, title: 'Banking Exams', description: 'IBPS, SBI, and RBI exam preparation', difficulty: 'Beginner', order: 2, lesson_count: 10 },
      { id: 3, title: 'Railway Exams', description: 'RRB and Railway recruitment preparation', difficulty: 'Beginner', order: 3, lesson_count: 10 },
      { id: 4, title: 'State PSC Exams', description: 'State Public Service Commission preparation', difficulty: 'Intermediate', order: 4, lesson_count: 10 },
      { id: 5, title: 'Teaching Jobs', description: 'CTET, TET, and teaching exam preparation', difficulty: 'Intermediate', order: 5, lesson_count: 10 },
      { id: 6, title: 'Police & Defense', description: 'Police and defense service exam prep', difficulty: 'Intermediate', order: 6, lesson_count: 10 },
      { id: 7, title: 'General Awareness', description: 'Current affairs and general knowledge', difficulty: 'Advanced', order: 7, lesson_count: 10 },
      { id: 8, title: 'Interview Skills', description: 'Preparing for government job interviews', difficulty: 'Advanced', order: 8, lesson_count: 10 },
      { id: 9, title: 'Application Process', description: 'How to apply for government jobs', difficulty: 'Advanced', order: 9, lesson_count: 10 },
      { id: 10, title: 'Job Alerts & Updates', description: 'Stay updated on latest vacancies', difficulty: 'Advanced', order: 10, lesson_count: 10 }
    ]
  }
};

// Generate lessons for a module
function generateLessons(moduleId, moduleTitle, lessonCount) {
  const lessons = [];
  const lessonTitles = generateLessonTitles(moduleTitle, lessonCount);
  
  for (let i = 0; i < lessonCount; i++) {
    const lessonNum = i + 1;
    lessons.push({
      id: `${moduleId}-${lessonNum}`,
      module_id: moduleId,
      lesson_number: lessonNum,
      title: lessonTitles[i],
      content: generateLessonContent(lessonTitles[i], moduleTitle),
      duration_minutes: 15,
      is_free: lessonNum === 1, // First lesson is free
      order: lessonNum
    });
  }
  
  return lessons;
}

// Generate lesson titles based on module
function generateLessonTitles(moduleTitle, count) {
  const titles = [];
  for (let i = 1; i <= count; i++) {
    titles.push(`${moduleTitle} - Part ${i}`);
  }
  return titles;
}

// Generate lesson content
function generateLessonContent(lessonTitle, moduleTitle) {
  return `
      <h2>${lessonTitle}</h2>
      
      <h3>Introduction</h3>
      <p>Welcome to this lesson on ${lessonTitle}. This is a crucial concept in ${moduleTitle} that will help you understand the broader landscape. Whether you're building your foundation or advancing your skills, mastering ${lessonTitle} is essential for your learning journey.</p>
      
      <h3>Core Concepts</h3>
      <p>${lessonTitle} represents a fundamental aspect that professionals use daily. Understanding how it works, when to apply it, and what results to expect will give you a significant advantage in the field. The key principles involve analyzing problems, selecting appropriate approaches, and implementing solutions effectively.</p>
      
      <p>In practical applications, ${lessonTitle} helps solve real-world challenges across industries. From entry-level positions to expert roles, this concept enables you to deliver value. Modern implementations combine theoretical understanding with practical efficiency to achieve remarkable results.</p>
      
      <h3>Practical Applications</h3>
      <p>Let's explore how ${lessonTitle} applies in real scenarios. Organizations use this approach to optimize operations, improve decision-making, and create effective solutions. For example, professionals implement these techniques to enhance outcomes, process information efficiently, and automate complex workflows.</p>
      
      <h3>Key Takeaways</h3>
      <p>By understanding ${lessonTitle}, you've gained valuable knowledge that connects to broader concepts. This foundation prepares you for more advanced topics and practical implementations. Remember that mastery comes from both theoretical understanding and hands-on practice. Continue exploring, experimenting, and building on your skills.</p>
    `;
}

// Generate content for an app
function generateAppContent(appId, appConfig) {
  const modules = appConfig.modules;
  const lessons = [];
  
  // Generate lessons for each module
  modules.forEach(module => {
    const moduleLessons = generateLessons(module.id, module.title, module.lesson_count);
    lessons.push(...moduleLessons);
  });
  
  return {
    modules,
    lessons
  };
}

// Main function
async function main() {
  console.log('🚀 Generating content for all learn-* apps...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const [appId, appConfig] of Object.entries(APP_CONTENT)) {
    try {
      const appDir = path.join(APPS_DIR, appId);
      
      // Check if app exists
      if (!fs.existsSync(appDir)) {
        console.log(`⚠️  Skipping ${appId} - directory not found`);
        continue;
      }
      
      // Create data directory if it doesn't exist
      const dataDir = path.join(appDir, 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      
      // Generate content
      const content = generateAppContent(appId, appConfig);
      
      // Write to seed.json
      const seedFile = path.join(dataDir, 'seed.json');
      fs.writeFileSync(seedFile, JSON.stringify(content, null, 2));
      
      console.log(`✅ Generated content for ${appId}`);
      console.log(`   - ${content.modules.length} modules`);
      console.log(`   - ${content.lessons.length} lessons`);
      console.log(`   - File: ${seedFile}\n`);
      
      successCount++;
    } catch (error) {
      console.error(`❌ Error generating content for ${appId}:`, error.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   ✅ Success: ${successCount} apps`);
  console.log(`   ❌ Errors: ${errorCount} apps`);
  console.log('\n✨ Content generation complete!');
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
