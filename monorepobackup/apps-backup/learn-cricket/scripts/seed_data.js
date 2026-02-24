#!/usr/bin/env node

/**
 * Seed Data Generator for Learn AI
 * 
 * This script generates 100 lessons (10 modules × 10 lessons each) with AI-generated content.
 * 
 * Usage: node scripts/seed_data.js
 * 
 * Note: This script generates placeholder content. In production with OPENAI_API_KEY,
 * it would use OpenAI's API to generate high-quality, contextual lesson content.
 */

const fs = require('fs');
const path = require('path');

// Module topics and metadata
const modules = [
  {
    id: 1,
    title: "Introduction to AI",
    description: "Understanding the fundamentals of Artificial Intelligence",
    difficulty: "Beginner",
    topics: ["What is AI", "History of AI", "Types of AI Systems", "AI Applications", "AI Ethics", "AI vs ML", "Current State", "Future Trends", "Getting Started", "Career Paths"]
  },
  {
    id: 2,
    title: "Types of AI",
    description: "Exploring different categories and applications of AI",
    difficulty: "Beginner",
    topics: ["Narrow AI", "General AI", "Superintelligence", "Reactive Machines", "Limited Memory", "Theory of Mind", "Self-Aware AI", "Weak vs Strong", "Symbolic AI", "Sub-symbolic AI"]
  },
  {
    id: 3,
    title: "Data Science Fundamentals",
    description: "Building the foundation for AI with data science",
    difficulty: "Beginner",
    topics: ["Data Types", "Data Collection", "Data Cleaning", "Exploratory Analysis", "Statistical Methods", "Data Visualization", "Databases", "Big Data", "Data Ethics", "Best Practices"]
  },
  {
    id: 4,
    title: "Python for AI",
    description: "Learning Python programming for AI applications",
    difficulty: "Beginner",
    topics: ["Python Basics", "Data Structures", "NumPy", "Pandas", "Matplotlib", "SciPy", "File Handling", "Functions", "OOP Concepts", "Libraries Overview"]
  },
  {
    id: 5,
    title: "Supervised Learning",
    description: "Understanding supervised machine learning algorithms",
    difficulty: "Intermediate",
    topics: ["Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "SVM", "KNN", "Naive Bayes", "Model Evaluation", "Cross-Validation", "Hyperparameter Tuning"]
  },
  {
    id: 6,
    title: "Unsupervised Learning",
    description: "Exploring clustering and dimensionality reduction",
    difficulty: "Intermediate",
    topics: ["K-Means", "Hierarchical Clustering", "DBSCAN", "PCA", "t-SNE", "Autoencoders", "Anomaly Detection", "Association Rules", "Pattern Mining", "Feature Selection"]
  },
  {
    id: 7,
    title: "Neural Networks",
    description: "Deep dive into neural network architectures",
    difficulty: "Intermediate",
    topics: ["Perceptrons", "Activation Functions", "Backpropagation", "Deep Learning", "CNNs", "RNNs", "LSTMs", "Transformers", "GANs", "Transfer Learning"]
  },
  {
    id: 8,
    title: "AI Monetization",
    description: "Turning AI skills into income streams",
    difficulty: "Advanced",
    topics: ["Freelancing", "Consulting", "Product Development", "SaaS Models", "API Services", "Training & Courses", "Research Roles", "Startup Ideas", "Portfolio Building", "Marketing"]
  },
  {
    id: 9,
    title: "AI Tools & Frameworks",
    description: "Mastering popular AI tools and platforms",
    difficulty: "Advanced",
    topics: ["TensorFlow", "PyTorch", "Keras", "Scikit-learn", "Hugging Face", "OpenAI API", "Cloud Platforms", "MLOps", "Version Control", "Deployment"]
  },
  {
    id: 10,
    title: "Career Pathways in AI",
    description: "Building a successful career in artificial intelligence",
    difficulty: "Advanced",
    topics: ["Job Roles", "Skills Required", "Resume Building", "Interview Prep", "Networking", "Continuous Learning", "Certifications", "Soft Skills", "Industry Trends", "Success Stories"]
  }
];

/**
 * Generate lesson content using template
 * In production, this would call OpenAI API with the following prompt template:
 * 
 * PROMPT TEMPLATE:
 * "Write a comprehensive 400-word lesson about {topic} in the context of {module_title}.
 * The lesson should include:
 * 1. An engaging introduction explaining why this topic matters
 * 2. 3-4 key concepts with clear explanations and examples
 * 3. Practical applications in real-world scenarios
 * 4. A summary reinforcing the main takeaways
 * 
 * Format: Use clear paragraphs with subheadings. Target audience: learners with {difficulty} level knowledge.
 * Writing style: Educational, engaging, and practical."
 */
function generateLessonContent(moduleId, lessonId, topic, moduleTitle, difficulty) {
  // Placeholder content generation
  return {
    id: `${moduleId}-${lessonId}`,
    module_id: moduleId,
    lesson_number: lessonId,
    title: topic,
    content: `
      <h2>${topic}</h2>
      
      <h3>Introduction</h3>
      <p>Welcome to this lesson on ${topic}. This is a crucial concept in ${moduleTitle} that will help you understand the broader landscape of artificial intelligence. Whether you're building your foundation or advancing your skills, mastering ${topic} is essential for your AI journey.</p>
      
      <h3>Core Concepts</h3>
      <p>${topic} represents a fundamental aspect of AI that professionals use daily. Understanding how it works, when to apply it, and what results to expect will give you a significant advantage in the field. The key principles involve analyzing problems, selecting appropriate approaches, and implementing solutions effectively.</p>
      
      <p>In practical applications, ${topic} helps solve real-world challenges across industries. From healthcare diagnostics to financial forecasting, this concept enables AI systems to deliver value. Modern implementations combine theoretical understanding with computational efficiency to achieve remarkable results.</p>
      
      <h3>Practical Applications</h3>
      <p>Let's explore how ${topic} applies in real scenarios. Companies use this approach to optimize operations, improve decision-making, and create intelligent systems. For example, leading tech firms implement these techniques to enhance user experiences, process massive datasets, and automate complex workflows.</p>
      
      <h3>Key Takeaways</h3>
      <p>By understanding ${topic}, you've gained valuable knowledge that connects to broader AI concepts. This foundation prepares you for more advanced topics and practical implementations. Remember that mastery comes from both theoretical understanding and hands-on practice. Continue exploring, experimenting, and building projects to solidify your skills.</p>
    `,
    duration_minutes: 15,
    is_free: lessonId === 1,
    order: lessonId
  };
}

/**
 * Generate quiz questions for a lesson
 * In production with OPENAI_API_KEY:
 * 
 * PROMPT TEMPLATE:
 * "Generate 5 multiple-choice questions to test understanding of {topic} in {module_title}.
 * For each question:
 * 1. Write a clear question that tests conceptual understanding, not just memorization
 * 2. Provide 4 answer options where only one is correct
 * 3. Include a brief explanation of why the correct answer is right
 * 
 * Difficulty level: {difficulty}
 * Format as JSON array with fields: question, options (array of 4), correct_answer (index 0-3), explanation"
 */
function generateQuizQuestions(topic, moduleTitle, difficulty) {
  return [
    {
      question: `What is the primary purpose of ${topic} in AI systems?`,
      options: [
        "To process and analyze data effectively",
        "To store information permanently",
        "To display results to users",
        "To connect different systems"
      ],
      correct_answer: 0,
      explanation: `The primary purpose is to process and analyze data, which is fundamental to ${topic}.`
    },
    {
      question: `Which scenario best demonstrates the application of ${topic}?`,
      options: [
        "Creating user interfaces",
        "Solving complex analytical problems",
        "Managing file storage",
        "Sending email notifications"
      ],
      correct_answer: 1,
      explanation: `${topic} is most effectively used for solving complex analytical problems.`
    },
    {
      question: `What is a key advantage of using ${topic}?`,
      options: [
        "It requires no training data",
        "It provides accurate insights from patterns",
        "It works without algorithms",
        "It needs no computational resources"
      ],
      correct_answer: 1,
      explanation: `The key advantage is providing accurate insights by identifying patterns in data.`
    },
    {
      question: `When implementing ${topic}, what is most important?`,
      options: [
        "Having the fastest computer",
        "Understanding the underlying principles",
        "Using the most expensive tools",
        "Memorizing all formulas"
      ],
      correct_answer: 1,
      explanation: `Understanding the underlying principles is crucial for effective implementation.`
    },
    {
      question: `How does ${topic} contribute to AI advancement?`,
      options: [
        "By replacing human decision-making entirely",
        "By enabling systems to learn and improve",
        "By eliminating the need for data",
        "By making AI free for everyone"
      ],
      correct_answer: 1,
      explanation: `${topic} contributes by enabling systems to learn from data and continuously improve.`
    }
  ];
}

/**
 * Generate all course data
 */
function generateCourseData() {
  const courseData = {
    modules: [],
    lessons: [],
    quizzes: [],
    metadata: {
      generated_at: new Date().toISOString(),
      total_modules: 10,
      total_lessons: 100,
      generator: 'seed_data.js',
      note: 'In production, content would be generated using OpenAI API for higher quality and context-awareness'
    }
  };

  modules.forEach(module => {
    courseData.modules.push({
      id: module.id,
      title: module.title,
      description: module.description,
      difficulty: module.difficulty,
      order: module.id,
      lesson_count: 10
    });

    module.topics.forEach((topic, index) => {
      const lessonId = index + 1;
      const lesson = generateLessonContent(
        module.id,
        lessonId,
        topic,
        module.title,
        module.difficulty
      );
      
      courseData.lessons.push(lesson);

      const quiz = {
        lesson_id: lesson.id,
        questions: generateQuizQuestions(topic, module.title, module.difficulty)
      };
      
      courseData.quizzes.push(quiz);
    });
  });

  return courseData;
}

/**
 * Save data to JSON file
 */
function saveData() {
  const dataDir = path.join(__dirname, '..', 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const data = generateCourseData();
  const filePath = path.join(dataDir, 'seed.json');

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log('✅ Seed data generated successfully!');
  console.log(`📁 Location: ${filePath}`);
  console.log(`📚 Modules: ${data.modules.length}`);
  console.log(`📖 Lessons: ${data.lessons.length}`);
  console.log(`❓ Quizzes: ${data.quizzes.length}`);
  console.log('\n💡 Note: In production with OPENAI_API_KEY, content would be AI-generated for higher quality.');
}

// Run the generator
saveData();
