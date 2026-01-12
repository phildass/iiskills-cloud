/**
 * UPSC IAS Course Structure
 * 
 * This file defines the complete structure of the UPSC Civil Services preparation course.
 * The course is organized into four main phases:
 * 1. Foundation - Core understanding of IAS exam structure and basic concepts
 * 2. Deep Dive - Subject-wise detailed study with optional subjects
 * 3. Mains & Ethics - Answer writing, ethics, essay preparation
 * 4. Prelims & Revision - Final preparation, current affairs, and mock tests
 * 
 * STATUS: PLACEHOLDER/STUB
 * This structure represents the planned course organization.
 * Actual lesson content, AI features, and assessments will be implemented in future phases.
 */

export const iasCourseSyllabus = {
  phases: [
    {
      id: 'foundation',
      name: 'Foundation Phase',
      description: 'Understanding UPSC CSE structure, exam pattern, and building fundamental knowledge',
      duration: '2 months',
      modules: [
        {
          id: 'understanding-upsc',
          name: 'Understanding UPSC CSE',
          topics: [
            'UPSC Exam Pattern Overview',
            'Prelims vs Mains vs Interview',
            'Eligibility and Registration',
            'Study Plan and Time Management',
            'Resource Selection Strategy'
          ],
          status: 'placeholder'
        },
        {
          id: 'history-basics',
          name: 'History - Foundation',
          topics: [
            'Ancient India - Overview',
            'Medieval India - Key Dynasties',
            'Modern India - Freedom Struggle',
            'World History Essentials',
            'Art and Culture Basics'
          ],
          status: 'placeholder'
        },
        {
          id: 'geography-basics',
          name: 'Geography - Foundation',
          topics: [
            'Physical Geography Fundamentals',
            'Indian Geography Basics',
            'World Geography Overview',
            'Environment and Ecology Introduction',
            'Disaster Management Basics'
          ],
          status: 'placeholder'
        },
        {
          id: 'polity-basics',
          name: 'Polity - Foundation',
          topics: [
            'Indian Constitution Basics',
            'Fundamental Rights and Duties',
            'Directive Principles',
            'Union and State Relations',
            'Local Government Introduction'
          ],
          status: 'placeholder'
        },
        {
          id: 'economics-basics',
          name: 'Economics - Foundation',
          topics: [
            'Basic Economic Concepts',
            'Indian Economy Overview',
            'Budget and Taxation Basics',
            'Economic Planning',
            'Current Economic Issues'
          ],
          status: 'placeholder'
        }
      ]
    },
    {
      id: 'deep-dive',
      name: 'Deep Dive Phase',
      description: 'Comprehensive subject-wise preparation including optional subjects',
      duration: '6-8 months',
      modules: [
        {
          id: 'history-detailed',
          name: 'History - Detailed Study',
          topics: [
            'Ancient India - Detailed Analysis',
            'Medieval India - Comprehensive Coverage',
            'Modern India - In-depth Study',
            'World History - Major Events',
            'Indian Art and Culture - Complete Coverage'
          ],
          status: 'placeholder'
        },
        {
          id: 'geography-detailed',
          name: 'Geography - Detailed Study',
          topics: [
            'Physical Geography - Complete',
            'Indian Geography - Comprehensive',
            'World Geography - Detailed',
            'Economic and Social Geography',
            'Environment and Biodiversity'
          ],
          status: 'placeholder'
        },
        {
          id: 'polity-detailed',
          name: 'Polity - Detailed Study',
          topics: [
            'Constitutional Framework - Complete',
            'Political Institutions',
            'Governance and Administration',
            'Public Policy and Rights Issues',
            'Comparison with Other Constitutions'
          ],
          status: 'placeholder'
        },
        {
          id: 'economics-detailed',
          name: 'Economics - Detailed Study',
          topics: [
            'Indian Economy - Complete Coverage',
            'Macroeconomics and Microeconomics',
            'Economic Development and Planning',
            'International Economics',
            'Current Economic Affairs'
          ],
          status: 'placeholder'
        },
        {
          id: 'science-tech',
          name: 'Science & Technology',
          topics: [
            'Basic Science Concepts',
            'Space Technology',
            'IT and Computers',
            'Biotechnology and Medical Science',
            'Defence Technology'
          ],
          status: 'placeholder'
        },
        {
          id: 'current-affairs',
          name: 'Current Affairs',
          topics: [
            'National Affairs',
            'International Relations',
            'Economic Developments',
            'Science and Technology News',
            'Social Issues and Development'
          ],
          status: 'placeholder'
        }
      ]
    },
    {
      id: 'optionals',
      name: 'Optional Subjects',
      description: 'Choose one optional subject for Mains preparation',
      note: 'NOTE: Indian Literature optionals (except English Literature) are NOT included as per requirements',
      availableOptionals: [
        {
          id: 'geography-optional',
          name: 'Geography (Optional)',
          papers: ['Geography Paper I', 'Geography Paper II'],
          status: 'placeholder'
        },
        {
          id: 'history-optional',
          name: 'History (Optional)',
          papers: ['History Paper I', 'History Paper II'],
          status: 'placeholder'
        },
        {
          id: 'political-science-optional',
          name: 'Political Science & International Relations',
          papers: ['Political Science Paper I', 'Political Science Paper II'],
          status: 'placeholder'
        },
        {
          id: 'public-administration',
          name: 'Public Administration',
          papers: ['Public Administration Paper I', 'Public Administration Paper II'],
          status: 'placeholder'
        },
        {
          id: 'sociology',
          name: 'Sociology',
          papers: ['Sociology Paper I', 'Sociology Paper II'],
          status: 'placeholder'
        },
        {
          id: 'anthropology',
          name: 'Anthropology',
          papers: ['Anthropology Paper I', 'Anthropology Paper II'],
          status: 'placeholder'
        },
        {
          id: 'psychology',
          name: 'Psychology',
          papers: ['Psychology Paper I', 'Psychology Paper II'],
          status: 'placeholder'
        },
        {
          id: 'english-literature',
          name: 'English Literature',
          papers: ['English Literature Paper I', 'English Literature Paper II'],
          status: 'placeholder',
          note: 'ONLY English Literature is included from Indian Literature group'
        },
        {
          id: 'philosophy',
          name: 'Philosophy',
          papers: ['Philosophy Paper I', 'Philosophy Paper II'],
          status: 'placeholder'
        },
        {
          id: 'economics-optional',
          name: 'Economics (Optional)',
          papers: ['Economics Paper I', 'Economics Paper II'],
          status: 'placeholder'
        },
        {
          id: 'law',
          name: 'Law',
          papers: ['Law Paper I', 'Law Paper II'],
          status: 'placeholder'
        },
        {
          id: 'management',
          name: 'Management',
          papers: ['Management Paper I', 'Management Paper II'],
          status: 'placeholder'
        },
        {
          id: 'mathematics',
          name: 'Mathematics',
          papers: ['Mathematics Paper I', 'Mathematics Paper II'],
          status: 'placeholder'
        }
      ]
    },
    {
      id: 'mains-ethics',
      name: 'Mains & Ethics Phase',
      description: 'Answer writing practice, ethics, and essay preparation',
      duration: '3-4 months',
      modules: [
        {
          id: 'essay-writing',
          name: 'Essay Writing',
          topics: [
            'Essay Structure and Framework',
            'Diverse Topics Practice',
            'Contemporary Issues Essays',
            'Philosophical Essays',
            'Essay Evaluation and Feedback'
          ],
          status: 'placeholder'
        },
        {
          id: 'ethics-integrity',
          name: 'Ethics, Integrity and Aptitude',
          topics: [
            'Ethics and Human Interface',
            'Attitude - Content, Structure, Function',
            'Aptitude and Foundational Values',
            'Emotional Intelligence',
            'Case Studies Practice'
          ],
          status: 'placeholder'
        },
        {
          id: 'answer-writing',
          name: 'Answer Writing Practice',
          topics: [
            'Answer Writing Techniques',
            'GS Paper I Practice',
            'GS Paper II Practice',
            'GS Paper III Practice',
            'GS Paper IV Practice'
          ],
          status: 'placeholder'
        },
        {
          id: 'gs-papers',
          name: 'General Studies Papers',
          papers: [
            {
              name: 'GS Paper I',
              topics: ['History', 'Geography', 'Art & Culture', 'Society']
            },
            {
              name: 'GS Paper II',
              topics: ['Polity', 'Governance', 'Social Justice', 'International Relations']
            },
            {
              name: 'GS Paper III',
              topics: ['Economy', 'Environment', 'Science & Tech', 'Security']
            },
            {
              name: 'GS Paper IV',
              topics: ['Ethics', 'Integrity', 'Aptitude', 'Case Studies']
            }
          ],
          status: 'placeholder'
        }
      ]
    },
    {
      id: 'prelims-revision',
      name: 'Prelims & Revision Phase',
      description: 'Intensive revision, test series, and current affairs',
      duration: '2-3 months',
      modules: [
        {
          id: 'prelims-strategy',
          name: 'Prelims Strategy',
          topics: [
            'Paper Pattern Analysis',
            'Question Type Strategies',
            'Time Management',
            'Negative Marking Strategy',
            'Last Minute Revision Tips'
          ],
          status: 'placeholder'
        },
        {
          id: 'test-series',
          name: 'Mock Test Series',
          topics: [
            'Full Length Mock Tests',
            'Subject-wise Tests',
            'Previous Years Papers',
            'Analysis and Improvement',
            'Performance Tracking'
          ],
          status: 'placeholder'
        },
        {
          id: 'current-affairs-intensive',
          name: 'Current Affairs - Intensive',
          topics: [
            'Last 12 Months Review',
            'PIB Analysis',
            'Yojana/Kurukshetra Compilation',
            'Important Government Schemes',
            'International Current Affairs'
          ],
          status: 'placeholder'
        },
        {
          id: 'revision',
          name: 'Final Revision',
          topics: [
            'Quick Revision Notes',
            'Static Portion Revision',
            'Important Facts and Figures',
            'Maps and Geography Revision',
            'Formula and Data Compilation'
          ],
          status: 'placeholder'
        }
      ]
    }
  ],
  
  // AI Features (PLACEHOLDER - to be implemented)
  aiFeatures: {
    dailyContent: {
      name: 'Daily AI-Generated Content',
      description: 'Personalized daily lessons and current affairs updates',
      status: 'planned'
    },
    testGeneration: {
      name: 'AI Test Generation',
      description: 'Adaptive test creation based on your performance and weak areas',
      status: 'planned'
    },
    mockInterviews: {
      name: 'AI Mock Interviews',
      description: 'Simulated personality test interviews with AI feedback',
      status: 'planned'
    },
    answerEvaluation: {
      name: 'Answer Evaluation',
      description: 'AI-powered evaluation of mains answers with detailed feedback',
      status: 'planned'
    },
    personalizedStudyPlan: {
      name: 'Personalized Study Plan',
      description: 'AI creates and adjusts study plans based on your progress',
      status: 'planned'
    }
  },
  
  // User Features (PLACEHOLDER - to be implemented)
  userFeatures: {
    progressTracking: {
      name: 'Progress Tracker',
      description: 'Track your completion across all phases and modules',
      status: 'planned'
    },
    notifications: {
      name: 'Notification System',
      description: 'Reminders for daily practice, current affairs, and deadlines',
      status: 'planned'
    },
    offlineAccess: {
      name: 'Offline Content',
      description: 'Download lessons and notes for offline study',
      status: 'planned'
    },
    mobileWeb: {
      name: 'Mobile & Web Access',
      description: 'Seamless learning across mobile and web platforms',
      status: 'planned'
    }
  },
  
  // Payment Configuration
  payment: {
    fee: '₹116.82',
    feeBreakdown: {
      base: '₹99',
      gst: '₹17.82',
      total: '₹116.82'
    },
    duration: '1 year',
    expiryManagement: {
      enabled: true,
      autoRenewal: false,
      gracePeriod: '7 days',
      status: 'planned'
    }
  }
}

/**
 * Get all phases
 */
export function getAllPhases() {
  return iasCourseSyllabus.phases
}

/**
 * Get phase by ID
 */
export function getPhaseById(phaseId) {
  return iasCourseSyllabus.phases.find(phase => phase.id === phaseId)
}

/**
 * Get all optional subjects
 */
export function getOptionalSubjects() {
  const optionalsPhase = iasCourseSyllabus.phases.find(phase => phase.id === 'optionals')
  return optionalsPhase?.availableOptionals || []
}

/**
 * Get module by phase and module ID
 */
export function getModule(phaseId, moduleId) {
  const phase = getPhaseById(phaseId)
  return phase?.modules?.find(module => module.id === moduleId)
}
