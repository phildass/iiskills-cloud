import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getPricingDisplay, getIntroOfferNotice } from "../utils/pricing";
import { getCourseSubdomainLink, courseHasSubdomain } from "../utils/courseSubdomainMapperClient";
import { getCurrentUser, isAdmin } from "../lib/supabaseClient";

// List of courses hidden from public view (visible only to admins)
const HIDDEN_COURSE_NAMES = [
  "Learn To Be a Beautician",
  "Learn Photography",
  "Phonics",
  "JEE/NEET Physics",
  "JEE/NEET Chemistry",
  "JEE Mathematics / NEET Biology",
  "Mock Exams and Doubt-Clearing Sessions",
  "UPSC Preparation",
  "Python for Data Science",
  "Machine Learning",
  "Deep Learning",
  "Data Visualization (Tableau, Power BI)",
  "Interview Skills",
  "Indian Cuisine Cooking",
  "Music (Instrument or Vocal Training)",
  "Vedic Mathematics",
  "Abacus Training",
  "Ethical Hacking (CEH)",
];

// List of available subdomain courses (10 total for launch)
// To add a new available course, simply add its subdomain name to this array
const AVAILABLE_SUBDOMAINS = [
  "learn-ai",
  "learn-apt",
  "learn-chemistry",
  "learn-geography",
  "learn-leadership",
  "learn-management",
  "learn-math",
  "learn-physics",
  "learn-pr",
  "learn-winning",
];

// Mapping for courses with names that don't directly match subdomain
const COURSE_NAME_TO_SUBDOMAIN = {
  aptitude: "apt", // "Learn Aptitude" -> learn-apt
  maths: "math", // "Learn Maths" -> learn-math
  mathematics: "math", // "Learn Mathematics" -> learn-math
};

// Helper function to check if a course is available based on its name
function isCourseAvailable(courseName) {
  // Convert course name to subdomain format (e.g., "Learn AI" -> "learn-ai")
  // Remove suffixes like "– Free", "– From the book", etc.
  const cleanName = courseName
    .replace(/\s*[–-]\s*(Free|From the book)$/i, "") // Remove suffix
    .trim();

  let subdomain = cleanName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/–/g, "-") // Replace en-dash with hyphen
    .replace(/[^\w-]/g, "") // Remove special characters except hyphens
    .replace(/^learn-/, ""); // Remove 'learn-' prefix if exists

  // Apply special mappings
  if (COURSE_NAME_TO_SUBDOMAIN[subdomain]) {
    subdomain = COURSE_NAME_TO_SUBDOMAIN[subdomain];
  }

  const fullSubdomain = `learn-${subdomain}`;
  return AVAILABLE_SUBDOMAINS.includes(fullSubdomain);
}

// Helper function to check if a course should be hidden from public view
function isCourseHidden(courseName) {
  return HIDDEN_COURSE_NAMES.includes(courseName);
}

const coursesData = [
  {
    id: 1,
    name: "Learn AI",
    category: "Technology",
    description:
      "Discover the fundamentals of Artificial Intelligence, machine learning concepts, and practical AI applications for modern business and innovation.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to AI", isFree: true },
      { id: 2, title: "Machine Learning Basics", isFree: false },
      { id: 3, title: "Neural Networks Overview", isFree: false },
      { id: 4, title: "AI Applications in Business", isFree: false },
      { id: 5, title: "Natural Language Processing", isFree: false },
      { id: 6, title: "Computer Vision Fundamentals", isFree: false },
      { id: 7, title: "AI Ethics and Responsibility", isFree: false },
      { id: 8, title: "AI Tools and Platforms", isFree: false },
      { id: 9, title: "Building AI Solutions", isFree: false },
      { id: 10, title: "Future of AI", isFree: false },
    ],
  },
  {
    id: 2,
    name: "Learn PR",
    category: "Communication",
    description:
      "Master Public Relations strategies, media management, brand building, and effective communication for organizations and individuals.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Public Relations", isFree: true },
      { id: 2, title: "Media Relations", isFree: false },
      { id: 3, title: "Crisis Communication", isFree: false },
      { id: 4, title: "Brand Management", isFree: false },
      { id: 5, title: "Press Release Writing", isFree: false },
      { id: 6, title: "Digital PR Strategies", isFree: false },
      { id: 7, title: "Event Management", isFree: false },
      { id: 8, title: "Stakeholder Engagement", isFree: false },
      { id: 9, title: "PR Measurement and Analytics", isFree: false },
      { id: 10, title: "Building PR Campaigns", isFree: false },
    ],
  },
  {
    id: 3,
    name: "Learn Data Science",
    category: "Data Science & AI/ML",
    description:
      "Master data analysis, statistics, machine learning, and data visualization to extract insights from data and drive informed business decisions.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: false,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Data Science", isFree: true },
      { id: 2, title: "Python for Data Analysis", isFree: false },
      { id: 3, title: "Statistics Fundamentals", isFree: false },
      { id: 4, title: "Data Cleaning and Preparation", isFree: false },
      { id: 5, title: "Exploratory Data Analysis", isFree: false },
      { id: 6, title: "Data Visualization", isFree: false },
      { id: 7, title: "Machine Learning Basics", isFree: false },
      { id: 8, title: "Predictive Modeling", isFree: false },
      { id: 9, title: "Big Data Concepts", isFree: false },
      { id: 10, title: "Data Science Projects", isFree: false },
    ],
  },
  {
    id: 4,
    name: "Learn Leadership",
    category: "Professional Skills",
    description:
      "Develop essential leadership skills including vision setting, team motivation, strategic thinking, and inspiring others to achieve excellence.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: false,
    isFree: false,
    modules: [
      { id: 1, title: "Leadership Fundamentals", isFree: true },
      { id: 2, title: "Vision and Strategy", isFree: false },
      { id: 3, title: "Team Motivation", isFree: false },
      { id: 4, title: "Communication for Leaders", isFree: false },
      { id: 5, title: "Decision Making", isFree: false },
      { id: 6, title: "Conflict Resolution", isFree: false },
      { id: 7, title: "Change Leadership", isFree: false },
      { id: 8, title: "Building High-Performance Teams", isFree: false },
      { id: 9, title: "Emotional Intelligence in Leadership", isFree: false },
      { id: 10, title: "Leading with Impact", isFree: false },
    ],
  },
  {
    id: 5,
    name: "Learn English",
    category: "Language",
    description:
      "Improve your English language skills for professional and personal success. Focus on grammar, vocabulary, communication, and fluency.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "English Fundamentals", isFree: true },
      { id: 2, title: "Grammar Essentials", isFree: false },
      { id: 3, title: "Vocabulary Building", isFree: false },
      { id: 4, title: "Speaking and Pronunciation", isFree: false },
      { id: 5, title: "Writing Skills", isFree: false },
      { id: 6, title: "Business English", isFree: false },
      { id: 7, title: "Reading Comprehension", isFree: false },
      { id: 8, title: "Listening Skills", isFree: false },
      { id: 9, title: "Email and Professional Writing", isFree: false },
      { id: 10, title: "Conversational English", isFree: false },
    ],
  },
  {
    id: 4,
    name: "Learn Etiquette",
    category: "Personal Development",
    description:
      "Develop professional etiquette, social skills, and business manners to make lasting positive impressions in any setting.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Etiquette", isFree: true },
      { id: 2, title: "Business Etiquette", isFree: false },
      { id: 3, title: "Dining Etiquette", isFree: false },
      { id: 4, title: "Communication Etiquette", isFree: false },
      { id: 5, title: "Email and Phone Etiquette", isFree: false },
      { id: 6, title: "Meeting and Interview Etiquette", isFree: false },
      { id: 7, title: "Social Media Etiquette", isFree: false },
      { id: 8, title: "International Business Etiquette", isFree: false },
      { id: 9, title: "Dress Code and Grooming", isFree: false },
      { id: 10, title: "Building Professional Relationships", isFree: false },
    ],
  },
  {
    id: 5,
    name: "Learn Investments",
    category: "Finance",
    description:
      "Understand investment fundamentals, portfolio management, risk assessment, and wealth building strategies for financial growth.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Investing", isFree: true },
      { id: 2, title: "Stock Market Basics", isFree: false },
      { id: 3, title: "Bonds and Fixed Income", isFree: false },
      { id: 4, title: "Mutual Funds and ETFs", isFree: false },
      { id: 5, title: "Risk and Return", isFree: false },
      { id: 6, title: "Portfolio Diversification", isFree: false },
      { id: 7, title: "Real Estate Investment", isFree: false },
      { id: 8, title: "Tax-Efficient Investing", isFree: false },
      { id: 9, title: "Retirement Planning", isFree: false },
      { id: 10, title: "Building Your Investment Strategy", isFree: false },
    ],
  },
  {
    id: 6,
    name: "Learn Journalism",
    category: "Communication",
    description:
      "Explore journalism fundamentals, news writing, reporting, ethics, and media storytelling for digital and traditional platforms.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Journalism", isFree: true },
      { id: 2, title: "News Writing Basics", isFree: false },
      { id: 3, title: "Investigative Journalism", isFree: false },
      { id: 4, title: "Interviewing Techniques", isFree: false },
      { id: 5, title: "Digital Journalism", isFree: false },
      { id: 6, title: "Journalism Ethics", isFree: false },
      { id: 7, title: "Multimedia Storytelling", isFree: false },
      { id: 8, title: "Broadcast Journalism", isFree: false },
      { id: 9, title: "Social Media Journalism", isFree: false },
      { id: 10, title: "Creating Your Portfolio", isFree: false },
    ],
  },
  {
    id: 7,
    name: "Learn Management",
    category: "Professional Skills",
    description:
      "Build essential management skills including team leadership, project planning, decision-making, and organizational effectiveness.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Fundamentals of Management", isFree: true },
      { id: 2, title: "Planning and Strategy", isFree: false },
      { id: 3, title: "Organizing and Delegation", isFree: false },
      { id: 4, title: "Team Building", isFree: false },
      { id: 5, title: "Decision Making", isFree: false },
      { id: 6, title: "Performance Management", isFree: false },
      { id: 7, title: "Conflict Resolution", isFree: false },
      { id: 8, title: "Change Management", isFree: false },
      { id: 9, title: "Time and Resource Management", isFree: false },
      { id: 10, title: "Leadership in Management", isFree: false },
    ],
  },
  {
    id: 8,
    name: "Learn Marketing",
    category: "Business",
    description:
      "Master marketing principles, consumer behavior, branding strategies, and campaign development for business success.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Marketing Fundamentals", isFree: true },
      { id: 2, title: "Consumer Behavior", isFree: false },
      { id: 3, title: "Market Research", isFree: false },
      { id: 4, title: "Branding and Positioning", isFree: false },
      { id: 5, title: "Digital Marketing", isFree: false },
      { id: 6, title: "Content Marketing", isFree: false },
      { id: 7, title: "Social Media Marketing", isFree: false },
      { id: 8, title: "Marketing Analytics", isFree: false },
      { id: 9, title: "Campaign Planning", isFree: false },
      { id: 10, title: "Marketing Strategy Development", isFree: false },
    ],
  },
  {
    id: 9,
    name: "Learn Sales",
    category: "Business",
    description:
      "Develop sales techniques, customer relationship skills, negotiation tactics, and strategies to close deals effectively.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Sales", isFree: true },
      { id: 2, title: "Understanding Customer Needs", isFree: false },
      { id: 3, title: "Product Knowledge", isFree: false },
      { id: 4, title: "Sales Techniques", isFree: false },
      { id: 5, title: "Handling Objections", isFree: false },
      { id: 6, title: "Closing Strategies", isFree: false },
      { id: 7, title: "Relationship Building", isFree: false },
      { id: 8, title: "Sales Negotiation", isFree: false },
      { id: 9, title: "CRM and Sales Tools", isFree: false },
      { id: 10, title: "Building a Sales Career", isFree: false },
    ],
  },
  {
    id: 11,
    name: "Learn Stock Broking",
    category: "Finance",
    description:
      "Understand stock market operations, trading strategies, broker responsibilities, and investment analysis for the securities industry.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Stock Broking", isFree: true },
      { id: 2, title: "Stock Market Structure", isFree: false },
      { id: 3, title: "Trading Platforms and Tools", isFree: false },
      { id: 4, title: "Technical Analysis", isFree: false },
      { id: 5, title: "Fundamental Analysis", isFree: false },
      { id: 6, title: "Risk Management", isFree: false },
      { id: 7, title: "Regulatory Framework", isFree: false },
      { id: 8, title: "Client Advisory", isFree: false },
      { id: 9, title: "Portfolio Management", isFree: false },
      { id: 10, title: "Career in Stock Broking", isFree: false },
    ],
  },
  {
    id: 12,
    name: "Learn To Be a Beautician",
    category: "Professional Skills",
    description:
      "Gain skills in beauty treatments, skincare, makeup artistry, and salon management to build a successful beautician career.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Beauty Industry", isFree: true },
      { id: 2, title: "Skincare Fundamentals", isFree: false },
      { id: 3, title: "Makeup Techniques", isFree: false },
      { id: 4, title: "Hair Styling Basics", isFree: false },
      { id: 5, title: "Nail Care and Art", isFree: false },
      { id: 6, title: "Facial Treatments", isFree: false },
      { id: 7, title: "Bridal Makeup", isFree: false },
      { id: 8, title: "Hygiene and Safety", isFree: false },
      { id: 9, title: "Client Consultation", isFree: false },
      { id: 10, title: "Starting Your Beauty Business", isFree: false },
    ],
  },
  {
    id: 13,
    name: "Learn Photography",
    category: "Creative Arts",
    description:
      "Master photography techniques, camera operation, composition, lighting, and post-processing to capture stunning images.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Photography Basics", isFree: true },
      { id: 2, title: "Camera Operations", isFree: false },
      { id: 3, title: "Composition Techniques", isFree: false },
      { id: 4, title: "Understanding Light", isFree: false },
      { id: 5, title: "Portrait Photography", isFree: false },
      { id: 6, title: "Landscape Photography", isFree: false },
      { id: 7, title: "Photo Editing", isFree: false },
      { id: 8, title: "Product Photography", isFree: false },
      { id: 9, title: "Building Your Portfolio", isFree: false },
      { id: 10, title: "Photography Business", isFree: false },
    ],
  },
  {
    id: 14,
    name: "Learn Aptitude – Free",
    category: "Personal Development",
    description:
      "FREE aptitude testing app that analyzes your strengths across logical reasoning, quantitative ability, and analytical skills to help you discover what you'll do best in life. Get personalized insights for career planning and competitive exam preparation.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Aptitude", isFree: true },
      { id: 2, title: "Numerical Ability", isFree: false },
      { id: 3, title: "Logical Reasoning", isFree: false },
      { id: 4, title: "Verbal Ability", isFree: false },
      { id: 5, title: "Data Interpretation", isFree: false },
      { id: 6, title: "Problem Solving", isFree: false },
      { id: 7, title: "Time Management in Tests", isFree: false },
      { id: 8, title: "Pattern Recognition", isFree: false },
      { id: 9, title: "Practice Tests", isFree: false },
      { id: 10, title: "Exam Strategies", isFree: false },
    ],
  },
  {
    id: 15,
    name: "Learn Winning – From the book",
    category: "Personal Development",
    description:
      "Based on proven success principles, learn winning strategies, mindset development, and achievement techniques. Features audio download.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    hasAudioDownload: true,
    modules: [
      { id: 1, title: "Introduction to Winning", isFree: true },
      { id: 2, title: "Developing a Winner's Mindset", isFree: false },
      { id: 3, title: "Goal Setting and Achievement", isFree: false },
      { id: 4, title: "Overcoming Obstacles", isFree: false },
      { id: 5, title: "Building Resilience", isFree: false },
      { id: 6, title: "Success Habits", isFree: false },
      { id: 7, title: "Strategic Thinking", isFree: false },
      { id: 8, title: "Competitive Excellence", isFree: false },
      { id: 9, title: "Continuous Improvement", isFree: false },
      { id: 10, title: "Sustaining Success", isFree: false },
    ],
  },
  {
    id: 16,
    name: "Learn Becoming the Better You – From the book",
    category: "Personal Development",
    description:
      "Transform yourself with personal growth strategies, self-improvement techniques, and life enhancement principles. Features audio download.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    hasAudioDownload: true,
    modules: [
      { id: 1, title: "Introduction to Self-Improvement", isFree: true },
      { id: 2, title: "Self-Awareness and Discovery", isFree: false },
      { id: 3, title: "Building Confidence", isFree: false },
      { id: 4, title: "Emotional Intelligence", isFree: false },
      { id: 5, title: "Positive Thinking", isFree: false },
      { id: 6, title: "Developing Good Habits", isFree: false },
      { id: 7, title: "Relationship Building", isFree: false },
      { id: 8, title: "Health and Wellness", isFree: false },
      { id: 9, title: "Life Balance", isFree: false },
      { id: 10, title: "Your Better Future", isFree: false },
    ],
  },
  {
    id: 17,
    name: "Learn JEE",
    category: "Education",
    description:
      "Master the essential concepts of Physics, Chemistry, and Mathematics for JEE preparation. This course covers foundational and advanced topics, designed for aspirants aiming for top ranks in engineering entrance exams.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: false,
    isFree: false,
    modules: [
      {
        id: 1,
        title: "Introduction to JEE Physics",
        isFree: true,
        summary:
          "Explore strategies for tackling Physics problems, understand the JEE syllabus structure, and discover the importance of conceptual learning.",
      },
      { id: 2, title: "Mechanics Fundamentals", isFree: false },
      { id: 3, title: "Thermodynamics Essentials", isFree: false },
      { id: 4, title: "Chemistry for JEE", isFree: false },
      { id: 5, title: "Organic Chemistry Basics", isFree: false },
      { id: 6, title: "Mathematics - Algebra", isFree: false },
      { id: 7, title: "Calculus for JEE", isFree: false },
      { id: 8, title: "Problem-Solving Techniques", isFree: false },
      { id: 9, title: "Mock Tests and Practice", isFree: false },
      { id: 10, title: "Exam Strategy and Time Management", isFree: false },
    ],
  },
  {
    id: 18,
    name: "Learn Maths – Free",
    category: "Education",
    description:
      "FREE comprehensive mathematics course covering fundamental to advanced concepts for academic and practical applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Mathematics", isFree: true },
      { id: 2, title: "Algebra Basics", isFree: false },
      { id: 3, title: "Geometry", isFree: false },
      { id: 4, title: "Trigonometry", isFree: false },
      { id: 5, title: "Calculus Introduction", isFree: false },
      { id: 6, title: "Statistics and Probability", isFree: false },
      { id: 7, title: "Mathematical Reasoning", isFree: false },
      { id: 8, title: "Applied Mathematics", isFree: false },
      { id: 9, title: "Problem Solving Techniques", isFree: false },
      { id: 10, title: "Advanced Concepts", isFree: false },
    ],
  },
  {
    id: 19,
    name: "Learn Geography – Free",
    category: "Education",
    description:
      "FREE exploration of world geography, physical features, climate patterns, cultures, and global relationships.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Geography", isFree: true },
      { id: 2, title: "Physical Geography", isFree: false },
      { id: 3, title: "Climate and Weather", isFree: false },
      { id: 4, title: "World Regions", isFree: false },
      { id: 5, title: "Human Geography", isFree: false },
      { id: 6, title: "Map Reading and GIS", isFree: false },
      { id: 7, title: "Environmental Geography", isFree: false },
      { id: 8, title: "Economic Geography", isFree: false },
      { id: 9, title: "Cultural Geography", isFree: false },
      { id: 10, title: "Global Issues", isFree: false },
    ],
  },
  {
    id: 20,
    name: "Learn Physics – Free",
    category: "Education",
    description:
      "FREE physics course covering mechanics, energy, waves, electricity, and modern physics concepts with practical applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Physics", isFree: true },
      { id: 2, title: "Mechanics and Motion", isFree: false },
      { id: 3, title: "Forces and Energy", isFree: false },
      { id: 4, title: "Heat and Thermodynamics", isFree: false },
      { id: 5, title: "Waves and Sound", isFree: false },
      { id: 6, title: "Light and Optics", isFree: false },
      { id: 7, title: "Electricity and Magnetism", isFree: false },
      { id: 8, title: "Modern Physics", isFree: false },
      { id: 9, title: "Quantum Physics Basics", isFree: false },
      { id: 10, title: "Applied Physics", isFree: false },
    ],
  },
  {
    id: 21,
    name: "Learn Chemistry – Free",
    category: "Education",
    description:
      "FREE chemistry course exploring matter, chemical reactions, organic and inorganic chemistry, and real-world applications.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: true,
    modules: [
      { id: 1, title: "Introduction to Chemistry", isFree: true },
      { id: 2, title: "Atomic Structure", isFree: false },
      { id: 3, title: "Chemical Bonding", isFree: false },
      { id: 4, title: "Chemical Reactions", isFree: false },
      { id: 5, title: "Organic Chemistry Basics", isFree: false },
      { id: 6, title: "Inorganic Chemistry", isFree: false },
      { id: 7, title: "Acids, Bases, and Salts", isFree: false },
      { id: 8, title: "Electrochemistry", isFree: false },
      { id: 9, title: "Environmental Chemistry", isFree: false },
      { id: 10, title: "Applied Chemistry", isFree: false },
    ],
  },
  {
    id: 22,
    name: "Learn Public Speaking",
    category: "Communication",
    description:
      "Overcome stage fright and master public speaking skills. Learn to deliver confident, persuasive presentations that captivate audiences.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Public Speaking", isFree: true },
      { id: 2, title: "Overcoming Fear", isFree: false },
      { id: 3, title: "Voice and Diction", isFree: false },
      { id: 4, title: "Body Language", isFree: false },
      { id: 5, title: "Speech Structure", isFree: false },
      { id: 6, title: "Engaging Your Audience", isFree: false },
      { id: 7, title: "Persuasive Speaking", isFree: false },
      { id: 8, title: "Handling Q&A", isFree: false },
      { id: 9, title: "Visual Aids and Props", isFree: false },
      { id: 10, title: "Professional Presentations", isFree: false },
    ],
  },
  // Communication & Soft Skills - Additional Courses
  {
    id: 23,
    name: "Personality Development",
    category: "Communication & Soft Skills",
    description:
      "Transform your personal and professional presence through comprehensive personality development. Enhance confidence, emotional intelligence, and interpersonal skills to make positive impressions and build lasting relationships.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Self-Awareness and Discovery", isFree: true },
      { id: 2, title: "Building Confidence", isFree: false },
      { id: 3, title: "Emotional Intelligence", isFree: false },
      { id: 4, title: "Communication Skills", isFree: false },
      { id: 5, title: "Grooming and Appearance", isFree: false },
      { id: 6, title: "Time Management", isFree: false },
      { id: 7, title: "Positive Thinking", isFree: false },
      { id: 8, title: "Stress Management", isFree: false },
      { id: 9, title: "Relationship Building", isFree: false },
      { id: 10, title: "Professional Etiquette", isFree: false },
    ],
  },
  {
    id: 24,
    name: "Interview Skills",
    category: "Communication & Soft Skills",
    description:
      "Master the art of interviews with proven strategies for success. Learn to present yourself confidently, answer challenging questions effectively, and make compelling impressions that secure job offers.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Interview Preparation", isFree: true },
      { id: 2, title: "Resume Building", isFree: false },
      { id: 3, title: "Common Interview Questions", isFree: false },
      { id: 4, title: "Behavioral Interviews (STAR Method)", isFree: false },
      { id: 5, title: "Mock Interviews", isFree: false },
      { id: 6, title: "Salary Negotiation", isFree: false },
      { id: 7, title: "Body Language in Interviews", isFree: false },
      { id: 8, title: "Follow-up Strategies", isFree: false },
      { id: 9, title: "Virtual Interview Techniques", isFree: false },
      { id: 10, title: "Assessment Center Preparation", isFree: false },
    ],
  },
  // Creative Design (UI/UX)
  {
    id: 25,
    name: "Figma/Adobe XD",
    category: "Creative Design (UI/UX)",
    description:
      "Master modern design tools Figma and Adobe XD for professional UI/UX work. Create stunning interfaces, prototypes, and design systems with industry-standard software used by top companies worldwide.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Figma Fundamentals", isFree: true },
      { id: 2, title: "Adobe XD Basics", isFree: false },
      { id: 3, title: "Interface Design Principles", isFree: false },
      { id: 4, title: "Component Libraries", isFree: false },
      { id: 5, title: "Prototyping and Interactions", isFree: false },
      { id: 6, title: "Design Systems", isFree: false },
      { id: 7, title: "Collaboration Features", isFree: false },
      { id: 8, title: "Responsive Design", isFree: false },
      { id: 9, title: "Design Handoff", isFree: false },
      { id: 10, title: "Best Practices and Workflows", isFree: false },
    ],
  },
  {
    id: 26,
    name: "UI Design",
    category: "Creative Design (UI/UX)",
    description:
      "Create visually stunning and functional user interfaces. Master color theory, typography, layout principles, and modern design trends to craft beautiful digital experiences that users love.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "UI Design Principles", isFree: true },
      { id: 2, title: "Color Theory and Psychology", isFree: false },
      { id: 3, title: "Typography Fundamentals", isFree: false },
      { id: 4, title: "Layout and Grid Systems", isFree: false },
      { id: 5, title: "Visual Hierarchy", isFree: false },
      { id: 6, title: "Icon Design", isFree: false },
      { id: 7, title: "Mobile UI Design", isFree: false },
      { id: 8, title: "Web UI Design", isFree: false },
      { id: 9, title: "Design Trends", isFree: false },
      { id: 10, title: "Design Portfolio Building", isFree: false },
    ],
  },
  {
    id: 27,
    name: "UX Research",
    category: "Creative Design (UI/UX)",
    description:
      "Discover user experience research methodologies to create user-centered designs. Learn to conduct interviews, usability tests, and data analysis to inform design decisions and improve product experiences.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "UX Research Fundamentals", isFree: true },
      { id: 2, title: "User Interviews", isFree: false },
      { id: 3, title: "Surveys and Questionnaires", isFree: false },
      { id: 4, title: "Usability Testing", isFree: false },
      { id: 5, title: "Card Sorting and Tree Testing", isFree: false },
      { id: 6, title: "Persona Development", isFree: false },
      { id: 7, title: "Journey Mapping", isFree: false },
      { id: 8, title: "Analytics and Metrics", isFree: false },
      { id: 9, title: "A/B Testing", isFree: false },
      { id: 10, title: "Research Synthesis and Presentation", isFree: false },
    ],
  },
  {
    id: 28,
    name: "Graphic Design",
    category: "Creative Design (UI/UX)",
    description:
      "Develop professional graphic design skills for print and digital media. Learn essential design principles, Adobe Creative Suite tools, and creative techniques to bring visual ideas to life.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Design Fundamentals", isFree: true },
      { id: 2, title: "Adobe Photoshop", isFree: false },
      { id: 3, title: "Adobe Illustrator", isFree: false },
      { id: 4, title: "Adobe InDesign", isFree: false },
      { id: 5, title: "Logo Design", isFree: false },
      { id: 6, title: "Branding and Identity", isFree: false },
      { id: 7, title: "Print Design", isFree: false },
      { id: 8, title: "Digital Graphics", isFree: false },
      { id: 9, title: "Image Editing", isFree: false },
      { id: 10, title: "Portfolio Development", isFree: false },
    ],
  },
  // Lifestyle & Hobbies
  {
    id: 29,
    name: "Yoga and Wellness",
    category: "Lifestyle & Hobbies",
    description:
      "Discover holistic wellness through yoga practice and lifestyle techniques. Learn asanas, breathing exercises, meditation, and wellness principles for physical health, mental clarity, and spiritual balance.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Yoga Fundamentals", isFree: true },
      { id: 2, title: "Basic Asanas (Postures)", isFree: false },
      { id: 3, title: "Pranayama (Breathing Techniques)", isFree: false },
      { id: 4, title: "Meditation and Mindfulness", isFree: false },
      { id: 5, title: "Yoga Philosophy", isFree: false },
      { id: 6, title: "Flexibility and Strength Building", isFree: false },
      { id: 7, title: "Stress Reduction", isFree: false },
      { id: 8, title: "Nutrition for Wellness", isFree: false },
      { id: 9, title: "Daily Wellness Routines", isFree: false },
      { id: 10, title: "Advanced Yoga Practices", isFree: false },
    ],
  },
  {
    id: 30,
    name: "Indian Cuisine Cooking",
    category: "Lifestyle & Hobbies",
    description:
      "Master authentic Indian cooking techniques and regional specialties. Learn traditional recipes, spice blending, and cooking methods to create delicious Indian dishes for family and professional culinary pursuits.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Indian Cooking Fundamentals", isFree: true },
      { id: 2, title: "Spice Knowledge and Blending", isFree: false },
      { id: 3, title: "North Indian Cuisine", isFree: false },
      { id: 4, title: "South Indian Cuisine", isFree: false },
      { id: 5, title: "Regional Specialties", isFree: false },
      { id: 6, title: "Bread Making (Roti, Naan, Paratha)", isFree: false },
      { id: 7, title: "Rice Dishes and Biryanis", isFree: false },
      { id: 8, title: "Curries and Gravies", isFree: false },
      { id: 9, title: "Snacks and Appetizers", isFree: false },
      { id: 10, title: "Traditional Sweets and Desserts", isFree: false },
    ],
  },
  {
    id: 31,
    name: "Music (Instrument or Vocal Training)",
    category: "Lifestyle & Hobbies",
    description:
      "Develop musical skills through structured instrument or vocal training. Learn music theory, technique, practice methods, and performance skills to express yourself through music and achieve your musical goals.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Music Theory Basics", isFree: true },
      { id: 2, title: "Reading Music Notation", isFree: false },
      { id: 3, title: "Rhythm and Timing", isFree: false },
      { id: 4, title: "Instrument Techniques", isFree: false },
      { id: 5, title: "Vocal Training and Techniques", isFree: false },
      { id: 6, title: "Scales and Exercises", isFree: false },
      { id: 7, title: "Song Learning and Practice", isFree: false },
      { id: 8, title: "Music Composition Basics", isFree: false },
      { id: 9, title: "Performance Skills", isFree: false },
      { id: 10, title: "Recording Basics", isFree: false },
    ],
  },
  // Coding for Kids
  {
    id: 32,
    name: "Coding Basics (Scratch, Python)",
    category: "Coding for Kids",
    description:
      "Introduce children to programming fundamentals through fun, interactive learning. Use visual programming with Scratch and text-based coding with Python to build computational thinking and problem-solving skills.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Programming Concepts", isFree: true },
      { id: 2, title: "Scratch Visual Programming", isFree: false },
      { id: 3, title: "Creating Games and Animations", isFree: false },
      { id: 4, title: "Python Fundamentals", isFree: false },
      { id: 5, title: "Variables and Data Types", isFree: false },
      { id: 6, title: "Loops and Conditionals", isFree: false },
      { id: 7, title: "Functions and Logic", isFree: false },
      { id: 8, title: "Simple Projects and Games", isFree: false },
      { id: 9, title: "Problem-Solving Skills", isFree: false },
      { id: 10, title: "Creative Coding", isFree: false },
    ],
  },
  {
    id: 33,
    name: "Vedic Mathematics",
    category: "Coding for Kids",
    description:
      "Learn ancient Indian mathematical techniques for fast mental calculations. Master Vedic sutras and methods to solve complex arithmetic problems quickly, boosting computational speed and accuracy for academic success.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Vedic Mathematics", isFree: true },
      { id: 2, title: "Basic Sutras and Principles", isFree: false },
      { id: 3, title: "Multiplication Techniques", isFree: false },
      { id: 4, title: "Division Methods", isFree: false },
      { id: 5, title: "Squaring and Square Roots", isFree: false },
      { id: 6, title: "Mental Calculation Strategies", isFree: false },
      { id: 7, title: "Algebra Applications", isFree: false },
      { id: 8, title: "Geometry Applications", isFree: false },
      { id: 9, title: "Problem-Solving Speed", isFree: false },
      { id: 10, title: "Competition Preparation", isFree: false },
    ],
  },
  {
    id: 34,
    name: "Abacus Training",
    category: "Coding for Kids",
    description:
      "Develop exceptional mental math abilities through abacus training. Master the ancient counting tool to perform rapid calculations, enhance concentration, memory, and build strong mathematical foundations for young learners.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Abacus Fundamentals", isFree: true },
      { id: 2, title: "Bead Manipulation Techniques", isFree: false },
      { id: 3, title: "Addition and Subtraction", isFree: false },
      { id: 4, title: "Multiplication on Abacus", isFree: false },
      { id: 5, title: "Division on Abacus", isFree: false },
      { id: 6, title: "Mental Abacus (Anzan)", isFree: false },
      { id: 7, title: "Concentration Development", isFree: false },
      { id: 8, title: "Memory Enhancement", isFree: false },
      { id: 9, title: "Speed Calculation", isFree: false },
      { id: 10, title: "Competition Training", isFree: false },
    ],
  },
  {
    id: 35,
    name: "Phonics",
    category: "Coding for Kids",
    description:
      "Build strong reading and pronunciation foundations through systematic phonics instruction. Learn letter sounds, blending techniques, and decoding strategies to develop confident reading skills for early learners.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Letter Sound Recognition", isFree: true },
      { id: 2, title: "Phonemic Awareness", isFree: false },
      { id: 3, title: "Blending Sounds", isFree: false },
      { id: 4, title: "Digraphs and Blends", isFree: false },
      { id: 5, title: "Vowel Patterns", isFree: false },
      { id: 6, title: "Word Families", isFree: false },
      { id: 7, title: "Sight Words", isFree: false },
      { id: 8, title: "Reading Fluency", isFree: false },
      { id: 9, title: "Spelling Foundations", isFree: false },
      { id: 10, title: "Reading Comprehension Basics", isFree: false },
    ],
  },
  // JEE/NEET Coaching
  {
    id: 36,
    name: "JEE/NEET Physics",
    category: "JEE/NEET Coaching",
    description:
      "Comprehensive Physics coaching for JEE and NEET aspirants. Master mechanics, thermodynamics, electromagnetism, optics, and modern physics with focused problem-solving, concept clarity, and exam strategies.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Mechanics and Motion", isFree: true },
      { id: 2, title: "Thermodynamics", isFree: false },
      { id: 3, title: "Electromagnetism", isFree: false },
      { id: 4, title: "Optics and Waves", isFree: false },
      { id: 5, title: "Modern Physics", isFree: false },
      { id: 6, title: "Problem-Solving Techniques", isFree: false },
      { id: 7, title: "Concept Visualization", isFree: false },
      { id: 8, title: "Formula Mastery", isFree: false },
      { id: 9, title: "Previous Year Questions", isFree: false },
      { id: 10, title: "Time Management in Exams", isFree: false },
    ],
  },
  {
    id: 37,
    name: "JEE/NEET Chemistry",
    category: "JEE/NEET Coaching",
    description:
      "Complete Chemistry preparation for competitive exams. Cover physical, organic, and inorganic chemistry with emphasis on reactions, mechanisms, periodic properties, and numerical problem-solving for JEE/NEET success.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Physical Chemistry", isFree: true },
      { id: 2, title: "Organic Chemistry", isFree: false },
      { id: 3, title: "Inorganic Chemistry", isFree: false },
      { id: 4, title: "Chemical Reactions and Mechanisms", isFree: false },
      { id: 5, title: "Periodic Properties", isFree: false },
      { id: 6, title: "Organic Conversions", isFree: false },
      { id: 7, title: "Numerical Problems", isFree: false },
      { id: 8, title: "Laboratory Techniques", isFree: false },
      { id: 9, title: "Previous Year Analysis", isFree: false },
      { id: 10, title: "Quick Revision Techniques", isFree: false },
    ],
  },
  {
    id: 38,
    name: "JEE Mathematics / NEET Biology",
    category: "JEE/NEET Coaching",
    description:
      "Specialized coaching in Mathematics for JEE or Biology for NEET. Master advanced concepts, problem-solving strategies, and develop speed and accuracy required for competitive exam success.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Advanced Concepts", isFree: true },
      { id: 2, title: "Calculus/Physiology (JEE/NEET)", isFree: false },
      { id: 3, title: "Algebra/Genetics (JEE/NEET)", isFree: false },
      { id: 4, title: "Coordinate Geometry/Ecology (JEE/NEET)", isFree: false },
      { id: 5, title: "Trigonometry/Biotechnology (JEE/NEET)", isFree: false },
      { id: 6, title: "Problem-Solving Strategies", isFree: false },
      { id: 7, title: "Conceptual Clarity", isFree: false },
      { id: 8, title: "Previous Year Questions", isFree: false },
      { id: 9, title: "Mock Test Analysis", isFree: false },
      { id: 10, title: "Exam Strategy and Time Management", isFree: false },
    ],
  },
  {
    id: 39,
    name: "Mock Exams and Doubt-Clearing Sessions",
    category: "JEE/NEET Coaching",
    description:
      "Comprehensive test practice and personalized doubt resolution for JEE/NEET aspirants. Regular mock tests simulate real exam conditions, while dedicated doubt-clearing sessions ensure complete concept mastery.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Full-Length Mock Tests", isFree: true },
      { id: 2, title: "Subject-Wise Tests", isFree: false },
      { id: 3, title: "Performance Analysis", isFree: false },
      { id: 4, title: "Individual Doubt Clearing", isFree: false },
      { id: 5, title: "Concept Reinforcement", isFree: false },
      { id: 6, title: "Weak Area Identification", isFree: false },
      { id: 7, title: "Strategy Development", isFree: false },
      { id: 8, title: "Time Management Practice", isFree: false },
      { id: 9, title: "Error Analysis", isFree: false },
      { id: 10, title: "Revision Planning", isFree: false },
    ],
  },
  // UPSC/Government Exams
  {
    id: 40,
    name: "UPSC Preparation",
    category: "UPSC/Government Exams",
    description:
      "Comprehensive UPSC Civil Services Exam preparation covering Prelims and Mains. Master General Studies, Current Affairs, Optional subjects, Essay writing, and Interview skills for India's most prestigious examination.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "General Studies (Paper I-IV)", isFree: true },
      { id: 2, title: "Current Affairs and News Analysis", isFree: false },
      { id: 3, title: "Optional Subject Preparation", isFree: false },
      { id: 4, title: "Essay Writing Techniques", isFree: false },
      { id: 5, title: "Answer Writing Skills", isFree: false },
      { id: 6, title: "Previous Year Question Analysis", isFree: false },
      { id: 7, title: "Study Planning and Time Management", isFree: false },
      { id: 8, title: "Revision Strategies", isFree: false },
      { id: 9, title: "Interview/Personality Test Preparation", isFree: false },
      { id: 10, title: "Ethics and Integrity", isFree: false },
    ],
  },
  {
    id: 41,
    name: "Banking Exams",
    category: "UPSC/Government Exams",
    description:
      "Targeted preparation for banking sector exams including IBPS PO, Clerk, and SBI positions. Cover quantitative aptitude, reasoning, English, general awareness, and banking knowledge for successful career in banking.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Quantitative Aptitude", isFree: true },
      { id: 2, title: "Reasoning Ability", isFree: false },
      { id: 3, title: "English Language", isFree: false },
      { id: 4, title: "General Awareness", isFree: false },
      { id: 5, title: "Banking and Financial Awareness", isFree: false },
      { id: 6, title: "Computer Knowledge", isFree: false },
      { id: 7, title: "Data Interpretation", isFree: false },
      { id: 8, title: "Mock Tests and Practice", isFree: false },
      { id: 9, title: "Speed and Accuracy Development", isFree: false },
      { id: 10, title: "Interview Preparation", isFree: false },
    ],
  },
  {
    id: 42,
    name: "Railways Exam Preparation",
    category: "UPSC/Government Exams",
    description:
      "Complete preparation for Railway Recruitment Board exams including RRB NTPC, Group D, and technical positions. Master reasoning, mathematics, general awareness, and technical subjects for railway careers.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Mathematics and Arithmetic", isFree: true },
      { id: 2, title: "General Intelligence and Reasoning", isFree: false },
      { id: 3, title: "General Awareness", isFree: false },
      { id: 4, title: "General Science", isFree: false },
      { id: 5, title: "Technical Subjects (for Technical Posts)", isFree: false },
      { id: 6, title: "Previous Year Questions", isFree: false },
      { id: 7, title: "Mock Tests", isFree: false },
      { id: 8, title: "Speed Enhancement", isFree: false },
      { id: 9, title: "Exam Strategy", isFree: false },
      { id: 10, title: "Physical Efficiency Test Preparation", isFree: false },
    ],
  },
  // Data Science & AI/ML
  {
    id: 43,
    name: "Python for Data Science",
    category: "Data Science & AI/ML",
    description:
      "Master Python programming for data science applications. Learn essential libraries, data manipulation, analysis techniques, and visualization tools to process and extract insights from complex datasets.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Python Programming Fundamentals", isFree: true },
      { id: 2, title: "NumPy for Numerical Computing", isFree: false },
      { id: 3, title: "Pandas for Data Manipulation", isFree: false },
      { id: 4, title: "Data Cleaning and Preprocessing", isFree: false },
      { id: 5, title: "Exploratory Data Analysis", isFree: false },
      { id: 6, title: "Statistical Analysis with Python", isFree: false },
      { id: 7, title: "Data Visualization with Matplotlib/Seaborn", isFree: false },
      { id: 8, title: "Working with APIs and Web Scraping", isFree: false },
      { id: 9, title: "SQL Integration", isFree: false },
      { id: 10, title: "Real-World Data Projects", isFree: false },
    ],
  },
  {
    id: 44,
    name: "Machine Learning",
    category: "Data Science & AI/ML",
    description:
      "Discover machine learning algorithms and techniques to build intelligent systems. Learn supervised and unsupervised learning, model evaluation, and practical ML implementation for real-world problem-solving.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Machine Learning Fundamentals", isFree: true },
      { id: 2, title: "Supervised Learning Algorithms", isFree: false },
      { id: 3, title: "Unsupervised Learning Techniques", isFree: false },
      { id: 4, title: "Feature Engineering", isFree: false },
      { id: 5, title: "Model Selection and Evaluation", isFree: false },
      { id: 6, title: "Classification and Regression", isFree: false },
      { id: 7, title: "Clustering and Dimensionality Reduction", isFree: false },
      { id: 8, title: "Cross-Validation Techniques", isFree: false },
      { id: 9, title: "Scikit-learn Library", isFree: false },
      { id: 10, title: "ML Project Development", isFree: false },
    ],
  },
  {
    id: 45,
    name: "Deep Learning",
    category: "Data Science & AI/ML",
    description:
      "Master deep learning and neural networks for advanced AI applications. Learn to build and train deep neural networks, CNNs, RNNs, and work with cutting-edge frameworks like TensorFlow and PyTorch.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Neural Network Fundamentals", isFree: true },
      { id: 2, title: "Deep Learning Architectures", isFree: false },
      { id: 3, title: "Convolutional Neural Networks (CNNs)", isFree: false },
      { id: 4, title: "Recurrent Neural Networks (RNNs)", isFree: false },
      { id: 5, title: "TensorFlow and Keras", isFree: false },
      { id: 6, title: "PyTorch Basics", isFree: false },
      { id: 7, title: "Transfer Learning", isFree: false },
      { id: 8, title: "Image Classification", isFree: false },
      { id: 9, title: "Natural Language Processing", isFree: false },
      { id: 10, title: "Model Optimization and Deployment", isFree: false },
    ],
  },
  {
    id: 46,
    name: "Data Visualization (Tableau, Power BI)",
    category: "Data Science & AI/ML",
    description:
      "Create compelling visual stories from data using industry-leading tools. Master Tableau and Power BI to design interactive dashboards, reports, and visualizations that drive business insights and decisions.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Data Visualization Principles", isFree: true },
      { id: 2, title: "Tableau Desktop Fundamentals", isFree: false },
      { id: 3, title: "Power BI Basics", isFree: false },
      { id: 4, title: "Creating Interactive Dashboards", isFree: false },
      { id: 5, title: "Chart Types and Best Practices", isFree: false },
      { id: 6, title: "Data Connections and Blending", isFree: false },
      { id: 7, title: "Calculated Fields and Parameters", isFree: false },
      { id: 8, title: "Advanced Analytics in Tableau/Power BI", isFree: false },
      { id: 9, title: "Sharing and Publishing Reports", isFree: false },
      { id: 10, title: "Business Intelligence Storytelling", isFree: false },
    ],
  },
  // Full Stack/Software Development
  {
    id: 47,
    name: "MERN Stack Development",
    category: "Full Stack/Software Development",
    description:
      "Build modern full-stack web applications with MongoDB, Express.js, React, and Node.js. Master the complete JavaScript stack to create scalable, responsive web applications from frontend to backend.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "JavaScript ES6+ Fundamentals", isFree: true },
      { id: 2, title: "MongoDB Database Design", isFree: false },
      { id: 3, title: "Express.js Backend Development", isFree: false },
      { id: 4, title: "React Frontend Development", isFree: false },
      { id: 5, title: "RESTful API Design", isFree: false },
      { id: 6, title: "State Management (Redux)", isFree: false },
      { id: 7, title: "Authentication and Authorization", isFree: false },
      { id: 8, title: "Deployment and DevOps", isFree: false },
      { id: 9, title: "Testing and Debugging", isFree: false },
      { id: 10, title: "Full-Stack Project Development", isFree: false },
    ],
  },
  {
    id: 48,
    name: "Java Development",
    category: "Full Stack/Software Development",
    description:
      "Master Java programming for enterprise applications and Android development. Learn object-oriented programming, Java frameworks, design patterns, and build robust, scalable applications.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Java Fundamentals", isFree: true },
      { id: 2, title: "Object-Oriented Programming", isFree: false },
      { id: 3, title: "Collections and Generics", isFree: false },
      { id: 4, title: "Exception Handling", isFree: false },
      { id: 5, title: "Multithreading and Concurrency", isFree: false },
      { id: 6, title: "JDBC and Database Connectivity", isFree: false },
      { id: 7, title: "Spring Framework Basics", isFree: false },
      { id: 8, title: "REST API Development", isFree: false },
      { id: 9, title: "Design Patterns", isFree: false },
      { id: 10, title: "Enterprise Application Development", isFree: false },
    ],
  },
  {
    id: 49,
    name: "Cloud Platforms (AWS, Azure, Google Cloud)",
    category: "Full Stack/Software Development",
    description:
      "Master cloud computing with leading platforms AWS, Azure, and Google Cloud. Learn cloud architecture, deployment, scaling, and management to build and maintain cloud-native applications.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Cloud Computing Fundamentals", isFree: true },
      { id: 2, title: "AWS Services (EC2, S3, Lambda, RDS)", isFree: false },
      { id: 3, title: "Azure Services and Solutions", isFree: false },
      { id: 4, title: "Google Cloud Platform Basics", isFree: false },
      { id: 5, title: "Cloud Architecture Patterns", isFree: false },
      { id: 6, title: "Serverless Computing", isFree: false },
      { id: 7, title: "Container Services (Docker, Kubernetes)", isFree: false },
      { id: 8, title: "CI/CD on Cloud", isFree: false },
      { id: 9, title: "Cloud Security and Compliance", isFree: false },
      { id: 10, title: "Cost Optimization Strategies", isFree: false },
    ],
  },
  // Digital Marketing
  {
    id: 50,
    name: "SEO (Search Engine Optimization)",
    category: "Digital Marketing",
    description:
      "Master search engine optimization to improve website rankings and organic traffic. Learn on-page, off-page, technical SEO, keyword research, and analytics to dominate search results.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "SEO Fundamentals", isFree: true },
      { id: 2, title: "Keyword Research and Analysis", isFree: false },
      { id: 3, title: "On-Page Optimization", isFree: false },
      { id: 4, title: "Off-Page SEO and Link Building", isFree: false },
      { id: 5, title: "Technical SEO", isFree: false },
      { id: 6, title: "Local SEO", isFree: false },
      { id: 7, title: "SEO Tools (Google Analytics, Search Console)", isFree: false },
      { id: 8, title: "Content Optimization", isFree: false },
      { id: 9, title: "Algorithm Updates and Trends", isFree: false },
      { id: 10, title: "SEO Reporting and Analytics", isFree: false },
    ],
  },
  {
    id: 51,
    name: "Social Media Marketing",
    category: "Digital Marketing",
    description:
      "Build powerful social media strategies across platforms. Master content creation, community management, paid social advertising, and analytics to grow brand presence and engagement on social networks.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Social Media Strategy", isFree: true },
      {
        id: 2,
        title: "Platform-Specific Marketing (Facebook, Instagram, LinkedIn, Twitter)",
        isFree: false,
      },
      { id: 3, title: "Content Creation and Curation", isFree: false },
      { id: 4, title: "Community Management", isFree: false },
      { id: 5, title: "Social Media Advertising", isFree: false },
      { id: 6, title: "Influencer Marketing", isFree: false },
      { id: 7, title: "Social Media Analytics", isFree: false },
      { id: 8, title: "Engagement Tactics", isFree: false },
      { id: 9, title: "Crisis Management", isFree: false },
      { id: 10, title: "Social Commerce", isFree: false },
    ],
  },
  {
    id: 52,
    name: "Email Marketing",
    category: "Digital Marketing",
    description:
      "Master email marketing to nurture leads and drive sales. Learn list building, campaign creation, automation, personalization, and analytics to create effective email marketing strategies.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Email Marketing Fundamentals", isFree: true },
      { id: 2, title: "List Building and Segmentation", isFree: false },
      { id: 3, title: "Email Design and Copywriting", isFree: false },
      { id: 4, title: "Marketing Automation", isFree: false },
      { id: 5, title: "Drip Campaigns", isFree: false },
      { id: 6, title: "A/B Testing", isFree: false },
      { id: 7, title: "Email Analytics and Metrics", isFree: false },
      { id: 8, title: "Deliverability Optimization", isFree: false },
      { id: 9, title: "Compliance (GDPR, CAN-SPAM)", isFree: false },
      { id: 10, title: "Email Tools (MailChimp, Constant Contact)", isFree: false },
    ],
  },
  // Cybersecurity
  {
    id: 53,
    name: "Ethical Hacking (CEH)",
    category: "Cybersecurity",
    description:
      "Learn ethical hacking and penetration testing techniques to identify and fix security vulnerabilities. Prepare for Certified Ethical Hacker certification while mastering offensive security skills.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Ethical Hacking Fundamentals", isFree: true },
      { id: 2, title: "Footprinting and Reconnaissance", isFree: false },
      { id: 3, title: "Scanning Networks", isFree: false },
      { id: 4, title: "Enumeration Techniques", isFree: false },
      { id: 5, title: "System Hacking", isFree: false },
      { id: 6, title: "Malware Threats", isFree: false },
      { id: 7, title: "Social Engineering", isFree: false },
      { id: 8, title: "Web Application Hacking", isFree: false },
      { id: 9, title: "Wireless Network Security", isFree: false },
      { id: 10, title: "CEH Exam Preparation", isFree: false },
    ],
  },
  {
    id: 54,
    name: "Network Security",
    category: "Cybersecurity",
    description:
      "Secure network infrastructure from cyber threats. Learn firewall configuration, intrusion detection, VPNs, network protocols, and security best practices to protect organizational networks.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Network Security Fundamentals", isFree: true },
      { id: 2, title: "Firewall Configuration and Management", isFree: false },
      { id: 3, title: "Intrusion Detection and Prevention Systems", isFree: false },
      { id: 4, title: "VPN Technologies", isFree: false },
      { id: 5, title: "Network Protocols Security", isFree: false },
      { id: 6, title: "Wireless Security", isFree: false },
      { id: 7, title: "Network Monitoring", isFree: false },
      { id: 8, title: "Security Architecture Design", isFree: false },
      { id: 9, title: "Incident Response", isFree: false },
      { id: 10, title: "Security Compliance", isFree: false },
    ],
  },
  // FinTech
  {
    id: 55,
    name: "Financial Modelling",
    category: "Financial Technologies (FinTech)",
    description:
      "Build sophisticated financial models for valuation, forecasting, and decision-making. Master Excel, financial analysis techniques, and modeling best practices used in investment banking and corporate finance.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Financial Modeling Fundamentals", isFree: true },
      { id: 2, title: "Excel Advanced Functions", isFree: false },
      { id: 3, title: "Three-Statement Modeling", isFree: false },
      { id: 4, title: "Discounted Cash Flow (DCF) Analysis", isFree: false },
      { id: 5, title: "Valuation Techniques", isFree: false },
      { id: 6, title: "Scenario and Sensitivity Analysis", isFree: false },
      { id: 7, title: "LBO and M&A Modeling", isFree: false },
      { id: 8, title: "Financial Statement Analysis", isFree: false },
      { id: 9, title: "Forecasting Techniques", isFree: false },
      { id: 10, title: "Best Practice and Standards", isFree: false },
    ],
  },
  {
    id: 56,
    name: "Blockchain Technology",
    category: "Financial Technologies (FinTech)",
    description:
      "Understand blockchain technology and its applications in finance and beyond. Learn distributed ledger systems, smart contracts, consensus mechanisms, and blockchain development fundamentals.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Blockchain Fundamentals", isFree: true },
      { id: 2, title: "Distributed Ledger Technology", isFree: false },
      { id: 3, title: "Cryptographic Principles", isFree: false },
      { id: 4, title: "Smart Contracts", isFree: false },
      { id: 5, title: "Ethereum Platform", isFree: false },
      { id: 6, title: "Solidity Programming Basics", isFree: false },
      { id: 7, title: "Consensus Mechanisms", isFree: false },
      { id: 8, title: "Blockchain Use Cases", isFree: false },
      { id: 9, title: "Blockchain Security", isFree: false },
      { id: 10, title: "DeFi Concepts", isFree: false },
    ],
  },
  {
    id: 57,
    name: "Cryptocurrency and Digital Assets",
    category: "Financial Technologies (FinTech)",
    description:
      "Explore cryptocurrency markets, trading, and investment strategies. Learn about Bitcoin, altcoins, wallet security, trading platforms, and the future of digital currencies in the financial ecosystem.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      { id: 1, title: "Cryptocurrency Fundamentals", isFree: true },
      { id: 2, title: "Bitcoin and Major Altcoins", isFree: false },
      { id: 3, title: "Cryptocurrency Trading", isFree: false },
      { id: 4, title: "Wallet Security and Management", isFree: false },
      { id: 5, title: "Exchange Platforms", isFree: false },
      { id: 6, title: "Technical Analysis for Crypto", isFree: false },
      { id: 7, title: "ICOs and Token Economics", isFree: false },
      { id: 8, title: "DeFi and Yield Farming", isFree: false },
      { id: 9, title: "Regulatory Landscape", isFree: false },
      { id: 10, title: "Investment Strategies", isFree: false },
    ],
  },
  {
    id: 58,
    name: "Learn NEET",
    category: "Education",
    description:
      "Build a strong foundation in Biology, Chemistry, and Physics tailored for NEET aspirants. This beginner course provides a high-level overview and the strategies necessary for success in medical entrance exams.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: true,
    isFree: false,
    modules: [
      {
        id: 1,
        title: "Introduction to NEET Biology",
        isFree: true,
        summary:
          "Learn about the importance of concept clarity and effective study planning for Biology, with tips for maximizing NEET scores.",
      },
      { id: 2, title: "Cell Biology and Genetics", isFree: false },
      { id: 3, title: "Human Physiology", isFree: false },
      { id: 4, title: "Plant Biology", isFree: false },
      { id: 5, title: "Chemistry for NEET", isFree: false },
      { id: 6, title: "Organic Chemistry Essentials", isFree: false },
      { id: 7, title: "Physics for Medical Entrance", isFree: false },
      { id: 8, title: "Problem-Solving Strategies", isFree: false },
      { id: 9, title: "Mock Tests and Analysis", isFree: false },
      { id: 10, title: "Exam Preparation and Strategy", isFree: false },
    ],
  },
  {
    id: 59,
    name: "Learn Govt. Jobs",
    category: "UPSC/Government Exams",
    description:
      "Comprehensive preparation for government examinations including IBPS, SBI, Railways, SSC, and other competitive exams with strategic guidance and practice materials.",
    duration: "10 weeks",
    level: "Intermediate",
    comingSoon: false,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Government Exams", isFree: true },
      { id: 2, title: "Quantitative Aptitude for Govt Exams", isFree: false },
      { id: 3, title: "Logical Reasoning", isFree: false },
      { id: 4, title: "English Language Skills", isFree: false },
      { id: 5, title: "General Knowledge & Current Affairs", isFree: false },
      { id: 6, title: "Banking & SSC Preparation", isFree: false },
      { id: 7, title: "Railway Exam Strategies", isFree: false },
      { id: 8, title: "Mock Tests & Practice Papers", isFree: false },
      { id: 9, title: "Time Management Techniques", isFree: false },
      { id: 10, title: "Interview & Personality Development", isFree: false },
    ],
  },
  {
    id: 60,
    name: "Learn IAS",
    category: "UPSC/Government Exams",
    description:
      "Comprehensive UPSC Civil Services preparation with AI-powered content, covering Prelims, Mains, current affairs, optional subjects, and interview skills for India's most prestigious examination.",
    duration: "10 weeks",
    level: "Advanced",
    comingSoon: false,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to UPSC CSE", isFree: true },
      { id: 2, title: "General Studies Paper I - IV", isFree: false },
      { id: 3, title: "Current Affairs & News Analysis", isFree: false },
      { id: 4, title: "Optional Subject Strategy", isFree: false },
      { id: 5, title: "Essay Writing Mastery", isFree: false },
      { id: 6, title: "Answer Writing Skills", isFree: false },
      { id: 7, title: "Ethics & Integrity", isFree: false },
      { id: 8, title: "Prelims Test Series", isFree: false },
      { id: 9, title: "Mains Answer Practice", isFree: false },
      { id: 10, title: "Interview/Personality Test Prep", isFree: false },
    ],
  },
  {
    id: 61,
    name: "Cricket Know All",
    category: "Sports",
    description:
      "Comprehensive cricket knowledge covering rules, techniques, strategies, history, and analysis. Perfect for cricket enthusiasts, players, and aspiring coaches.",
    duration: "10 weeks",
    level: "Beginner",
    comingSoon: false,
    isFree: false,
    modules: [
      { id: 1, title: "Introduction to Cricket", isFree: true },
      { id: 2, title: "Cricket Rules and Regulations", isFree: false },
      { id: 3, title: "Batting Techniques", isFree: false },
      { id: 4, title: "Bowling Techniques", isFree: false },
      { id: 5, title: "Fielding Strategies", isFree: false },
      { id: 6, title: "Cricket History and Legends", isFree: false },
      { id: 7, title: "Match Analysis and Strategy", isFree: false },
      { id: 8, title: "Cricket Formats (Test, ODI, T20)", isFree: false },
      { id: 9, title: "Fitness and Training", isFree: false },
      { id: 10, title: "Cricket Coaching Fundamentals", isFree: false },
    ],
  },
];

export default function Courses() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const pricing = getPricingDisplay();
  const introNotice = getIntroOfferNotice();

  // Check if user is admin
  useEffect(() => {
    async function checkAdmin() {
      try {
        const user = await getCurrentUser();
        if (user) {
          const adminStatus = await isAdmin(user);
          setIsAdminUser(adminStatus);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      } finally {
        setIsCheckingAdmin(false);
      }
    }
    checkAdmin();
  }, []);

  // Detect if we're in development mode (client-side safe)
  const isDevelopment = typeof window !== "undefined" && window.location.hostname === "localhost";

  const categories = [
    "All",
    // New Categories
    "Communication & Soft Skills",
    "Creative Design (UI/UX)",
    "Lifestyle & Hobbies",
    "Coding for Kids",
    "JEE/NEET Coaching",
    "UPSC/Government Exams",
    "Data Science & AI/ML",
    "Full Stack/Software Development",
    "Digital Marketing",
    "Cybersecurity",
    "Financial Technologies (FinTech)",
    // Existing Categories
    "Technology",
    "Communication",
    "Language",
    "Personal Development",
    "Finance",
    "Professional Skills",
    "Business",
    "Career Development",
    "Creative Arts",
    "Education",
    "Sports",
    "Free Course",
  ];

  const filteredCourses = coursesData.filter((course) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (selectedCategory === "Free Course" ? course.isFree : course.category === selectedCategory);

    // Hide courses from non-admin users
    const isVisible = isAdminUser || !isCourseHidden(course.name);

    return matchesCategory && isVisible;
  });

  // Split courses into available, coming soon, and hidden (for admins), removing duplicates
  const seenCourseIds = new Set();
  const availableCourses = [];
  const comingSoonCourses = [];
  const hiddenCourses = [];

  filteredCourses.forEach((course) => {
    // Skip duplicates
    if (seenCourseIds.has(course.id)) {
      return;
    }
    seenCourseIds.add(course.id);

    // Separate hidden courses (only for admin users)
    if (isAdminUser && isCourseHidden(course.name)) {
      hiddenCourses.push(course);
      return;
    }

    // Check if course is available based on subdomain
    if (isCourseAvailable(course.name)) {
      availableCourses.push(course);
    } else {
      comingSoonCourses.push(course);
    }
  });

  return (
    <>
      <Head>
        <title>Courses - iiskills.cloud</title>
        <meta
          name="description"
          content="Courses available now: 10 | Five Free | Five Paid. Introductory price of Rs 99 (plus GST Rs 17.82) valid till Feb 28th. Professional and personal development courses."
        />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4">Our Courses</h1>
          <p className="text-xl text-charcoal mb-2">Professional Skills Development for Everyone</p>
          
          <p className="text-lg font-semibold text-primary mb-2">
            Courses available now: 10 | Five Free | Five Paid
          </p>
          <p className="text-sm text-orange-600 font-semibold mb-4">
            Introductory price of ₹99 (plus GST ₹17.82) valid till Feb 28th. Total ₹116.82
          </p>
          <p className="text-sm text-gray-700 font-semibold mb-4">
            New prices ₹299 + GST of ₹53.82 (Total ₹352.82) will be effective from March 01, 2026
          </p>
          <div className="mt-4 text-lg font-semibold text-accent">
            Paid courses: {pricing.totalPrice} per course
            {pricing.isIntroductory ? " (Introductory Offer)" : ""}
          </div>
        </div>

        {/* Introductory Offer Banner */}
        {introNotice && (
          <div className="bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-lg shadow-lg p-6 mb-8 text-center">
            <p className="text-lg font-bold">{introNotice}</p>
          </div>
        )}

        {/* Available Courses Display */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-lg p-6 mb-8 text-center border-2 border-green-200">
          <h2 className="text-2xl font-bold text-primary mb-3">Available right now: 10 Courses</h2>
          <p className="text-lg text-charcoal">
            50+ Courses being developed and should be uploaded soon. Over the next few months you will have 100+ Courses to choose from.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow p-6 mb-8 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-primary mb-4">Course Availability Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <span className="bg-pastel-blue text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                Currently Available
              </span>
              <span className="text-gray-700">- Ready to enroll and start learning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-pastel-lavender text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                Coming Soon
              </span>
              <span className="text-gray-700">- In development, will be available soon</span>
            </div>
          </div>
        </div>

        {/* Available Courses Section */}
        {availableCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="bg-pastel-blue text-white px-4 py-2 rounded-full text-base font-bold shadow-md">
                Currently Available
              </span>
              <span>
                ({availableCourses.length} {availableCourses.length === 1 ? "course" : "courses"})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableCourses.map((course) => {
                const freeModule = course.modules?.find((m) => m.isFree);
                const courseLink = getCourseSubdomainLink(course.name, isDevelopment);
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative border-2 border-pastel-blue-light"
                  >
                    {/* Available Badge */}
                    <div className="absolute top-4 right-4 bg-pastel-blue text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                      Available Now
                    </div>

                    {/* Free Badge */}
                    {course.isFree && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pastel-blue bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-2xl font-bold z-20 shadow-2xl blink-animation">
                        FREE
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-pastel-blue-light to-pastel-blue p-4">
                      <span className="text-white text-sm font-semibold">{course.category}</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{course.name}</h3>
                      <p className="text-charcoal mb-4 text-sm">{course.description}</p>

                      {/* Pricing Information */}
                      {!course.isFree && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                          <p className="text-sm text-blue-800 font-semibold">
                            💳 Price: {pricing.totalPrice}
                          </p>
                          {pricing.isIntroductory && (
                            <p className="text-xs text-blue-700 mt-1">
                              Introductory offer until {pricing.introEndDate}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Free sample module indicator - only show for paid courses */}
                      {freeModule && !course.isFree && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded p-3 mb-4">
                          <p className="text-sm text-cyan-800 font-semibold mb-1">
                            🎁 Free Sample: {freeModule.title}
                          </p>
                          {freeModule.summary && (
                            <p className="text-xs text-cyan-700 mt-1">{freeModule.summary}</p>
                          )}
                        </div>
                      )}

                      {/* Audio Download Feature */}
                      {course.hasAudioDownload && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                          <p className="text-sm text-blue-800 font-semibold flex items-center">
                            🎧 Includes Audio Download
                          </p>
                        </div>
                      )}

                      {courseLink ? (
                        <Link href={courseLink.url} target="_blank" rel="noopener noreferrer">
                          <button className="w-full bg-pastel-blue text-white py-3 rounded font-bold hover:bg-pastel-blue-light transition">
                            {course.isFree ? "Start Free Course" : "Enroll Now"}
                          </button>
                        </Link>
                      ) : (
                        <button className="w-full bg-pastel-blue text-white py-3 rounded font-bold hover:bg-pastel-blue-light transition opacity-50 cursor-not-allowed">
                          {course.isFree ? "Start Free Course" : "Enroll Now"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Courses Section */}
        {comingSoonCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
              <span className="bg-pastel-lavender text-white px-4 py-2 rounded-full text-base font-bold shadow-md">
                Coming Soon
              </span>
              <span>
                ({comingSoonCourses.length} {comingSoonCourses.length === 1 ? "course" : "courses"})
              </span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comingSoonCourses.map((course) => {
                const freeModule = course.modules?.find((m) => m.isFree);
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative opacity-90 border-2 border-pastel-lavender-light"
                  >
                    {/* Coming Soon Badge */}
                    <div className="absolute top-4 right-4 bg-pastel-lavender text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                      Coming Soon
                    </div>

                    {/* Free Badge */}
                    {course.isFree && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pastel-blue bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-2xl font-bold z-20 shadow-2xl blink-animation">
                        FREE
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-pastel-lavender-light to-pastel-lavender p-4">
                      <span className="text-white text-sm font-semibold">{course.category}</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{course.name}</h3>
                      <p className="text-charcoal mb-4 text-sm">{course.description}</p>

                      {/* Coming Soon - No Pricing Display */}
                      <div className="bg-purple-50 border border-pastel-lavender-light rounded p-3 mb-4">
                        <p className="text-sm text-purple-800 font-semibold">
                          🔔 This course is currently in development
                        </p>
                        <p className="text-xs text-purple-700 mt-1">
                          Get notified when it launches!
                        </p>
                      </div>

                      {/* Free sample module indicator - only show for paid courses */}
                      {freeModule && !course.isFree && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded p-3 mb-4">
                          <p className="text-sm text-cyan-800 font-semibold mb-1">
                            🎁 Free Sample: {freeModule.title}
                          </p>
                          {freeModule.summary && (
                            <p className="text-xs text-cyan-700 mt-1">{freeModule.summary}</p>
                          )}
                        </div>
                      )}

                      {/* Audio Download Feature */}
                      {course.hasAudioDownload && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                          <p className="text-sm text-blue-800 font-semibold flex items-center">
                            🎧 Includes Audio Download
                          </p>
                        </div>
                      )}

                      <button className="w-full bg-pastel-lavender text-white py-3 rounded font-bold hover:bg-pastel-lavender-light transition">
                        🔔 Notify When Available
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hidden Courses Section (Admin Only) */}
        {isAdminUser && hiddenCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-red-600 mb-6 flex items-center gap-3">
              <span className="bg-red-600 text-white px-4 py-2 rounded-full text-base font-bold shadow-md">
                Hidden
              </span>
              <span>
                ({hiddenCourses.length} {hiddenCourses.length === 1 ? "course" : "courses"} - Admin
                Only)
              </span>
            </h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Admin Notice:</strong> These courses are hidden from public view. Only
                admin users can see them on this page.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiddenCourses.map((course) => {
                const freeModule = course.modules?.find((m) => m.isFree);
                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition relative opacity-90 border-2 border-red-400"
                  >
                    {/* Hidden Badge */}
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10 shadow-lg">
                      Hidden
                    </div>

                    {/* Free Badge */}
                    {course.isFree && (
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-pastel-blue bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-2xl font-bold z-20 shadow-2xl blink-animation">
                        FREE
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-red-400 to-red-600 p-4">
                      <span className="text-white text-sm font-semibold">{course.category}</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-2">{course.name}</h3>
                      <p className="text-charcoal mb-4 text-sm">{course.description}</p>

                      {/* Hidden Status Notice */}
                      <div className="bg-red-50 border border-red-300 rounded p-3 mb-4">
                        <p className="text-sm text-red-800 font-semibold">
                          🚫 Hidden from public view
                        </p>
                        <p className="text-xs text-red-700 mt-1">Not visible to regular users</p>
                      </div>

                      {/* Free sample module indicator - only show for paid courses */}
                      {freeModule && !course.isFree && (
                        <div className="bg-cyan-50 border border-cyan-200 rounded p-3 mb-4">
                          <p className="text-sm text-cyan-800 font-semibold mb-1">
                            🎁 Free Sample: {freeModule.title}
                          </p>
                          {freeModule.summary && (
                            <p className="text-xs text-cyan-700 mt-1">{freeModule.summary}</p>
                          )}
                        </div>
                      )}

                      {/* Audio Download Feature */}
                      {course.hasAudioDownload && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                          <p className="text-sm text-blue-800 font-semibold flex items-center">
                            🎧 Includes Audio Download
                          </p>
                        </div>
                      )}

                      <button
                        className="w-full bg-gray-400 text-white py-3 rounded font-bold cursor-not-allowed"
                        disabled
                      >
                        Hidden - Not Available to Public
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {availableCourses.length === 0 &&
          comingSoonCourses.length === 0 &&
          (!isAdminUser || hiddenCourses.length === 0) && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No courses found matching your filters.</p>
            </div>
          )}

        {/* Expansion Note */}
        <div className="bg-blue-50 border-l-4 border-primary p-6 rounded">
          <h2 className="text-xl font-bold text-primary mb-2">🚀 Growing Course Library</h2>
          <p className="text-charcoal mb-4">
            We're continuously expanding our course offerings! New courses are being added regularly
            to help you develop a wide range of professional and personal skills.
          </p>
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-charcoal mb-3">
              <strong>📬 Stay Updated:</strong> Subscribe to our newsletter to be the first to know when new courses are launched!
            </p>
            <Link
              href="/newsletter"
              className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
            >
              Subscribe to Newsletter →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
