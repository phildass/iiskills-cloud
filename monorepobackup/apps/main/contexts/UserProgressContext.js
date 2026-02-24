import { createContext, useContext, useState, useEffect } from "react";

const UserProgressContext = createContext();

export function useUserProgress() {
  return useContext(UserProgressContext);
}

// Mock app data with progress tracking
const INITIAL_APPS = [
  {
    id: "learn-ai",
    name: "Learn AI",
    category: "Technology",
    color: "#3B82F6",
    progress: {
      basics: 0,
      intermediate: 0,
      advanced: 0,
    },
    connections: ["learn-math", "learn-physics"],
    microQuiz: {
      question: "What does AI stand for?",
      options: ["Artificial Intelligence", "Automated Intelligence", "Advanced Integration"],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-apt",
    name: "Learn Aptitude",
    category: "Foundation",
    color: "#10B981",
    progress: {
      basics: 45,
      intermediate: 20,
      advanced: 0,
    },
    connections: ["learn-math"],
    microQuiz: {
      question: "If 15% of 120 is X, what is X?",
      options: ["15", "18", "20"],
      correctAnswer: 1,
    },
  },
  {
    id: "learn-math",
    name: "Learn Math",
    category: "Foundation",
    color: "#8B5CF6",
    progress: {
      basics: 60,
      intermediate: 30,
      advanced: 10,
    },
    connections: ["learn-physics", "learn-ai", "learn-apt"],
    microQuiz: {
      question: "What is 25% of 80?",
      options: ["15", "20", "25"],
      correctAnswer: 1,
    },
  },
  {
    id: "learn-physics",
    name: "Learn Physics",
    category: "Science",
    color: "#EF4444",
    progress: {
      basics: 30,
      intermediate: 0,
      advanced: 0,
    },
    connections: ["learn-math", "learn-ai", "learn-management"],
    microQuiz: {
      question: "What is the formula for force?",
      options: ["F = ma", "F = mv", "F = m/a"],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-chemistry",
    name: "Learn Chemistry",
    category: "Science",
    color: "#F59E0B",
    progress: {
      basics: 25,
      intermediate: 0,
      advanced: 0,
    },
    connections: ["learn-physics"], // learn-biology moved to apps-backup
    microQuiz: {
      question: "What is H2O?",
      options: ["Oxygen", "Water", "Hydrogen"],
      correctAnswer: 1,
    },
  },
  // MOVED TO apps-backup as per cleanup requirements
  // {
  //   id: "learn-biology",
  //   name: "Learn Biology",
  //   category: "Science",
  //   color: "#2E7D32",
  //   progress: {
  //     basics: 0,
  //     intermediate: 0,
  //     advanced: 0,
  //   },
  //   connections: ["learn-chemistry", "learn-physics"],
  //   microQuiz: {
  //     question: "Which organelle is the powerhouse of the cell?",
  //     options: ["Nucleus", "Mitochondria", "Ribosome"],
  //     correctAnswer: 1,
  //   },
  // },
  {
    id: "learn-geography",
    name: "Learn Geography",
    category: "Social Science",
    color: "#14B8A6",
    progress: {
      basics: 40,
      intermediate: 15,
      advanced: 0,
    },
    connections: [], // learn-govt-jobs moved to apps-backup
    microQuiz: {
      question: "Where is the Suez Canal?",
      options: ["Egypt", "Panama", "India"],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-pr",
    name: "Learn PR",
    category: "Professional",
    color: "#EC4899",
    progress: {
      basics: 35,
      intermediate: 10,
      advanced: 0,
    },
    connections: ["learn-management"],
    microQuiz: {
      question: "What does PR stand for?",
      options: ["Public Relations", "Private Relations", "Professional Relations"],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-management",
    name: "Learn Management",
    category: "Professional",
    color: "#6366F1",
    progress: {
      basics: 50,
      intermediate: 25,
      advanced: 5,
    },
    connections: ["learn-pr", "learn-physics"],
    microQuiz: {
      question: "What is SWOT analysis?",
      options: [
        "Strengths, Weaknesses, Opportunities, Threats",
        "Systems, Work, Operations, Tasks",
        "Success, Work, Objectives, Tools",
      ],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-finesse",
    name: "Learn Finesse",
    category: "Professional",
    color: "#8B7355",
    progress: {
      basics: 0,
      intermediate: 0,
      advanced: 0,
    },
    connections: ["learn-management", "learn-pr"],
    microQuiz: {
      question: "What is the key to executive presence?",
      options: ["Confidence and Communication", "Loud Voice", "Formal Attire"],
      correctAnswer: 0,
    },
  },
  {
    id: "learn-developer",
    name: "Learn Developer",
    category: "Technology",
    color: "#059669",
    progress: {
      basics: 20,
      intermediate: 0,
      advanced: 0,
    },
    connections: ["learn-ai"],
    microQuiz: {
      question: "What is HTML?",
      options: ["HyperText Markup Language", "High Tech Modern Language", "Home Tool Markup Language"],
      correctAnswer: 0,
    },
  },
  // MOVED TO apps-backup as per cleanup requirements
  // {
  //   id: "learn-govt-jobs",
  //   name: "Learn Govt Jobs",
  //   category: "Career",
  //   color: "#DC2626",
  //   progress: {
  //     basics: 15,
  //     intermediate: 0,
  //     advanced: 0,
  //   },
  //   connections: ["learn-geography", "learn-apt"],
  //   microQuiz: {
  //     question: "Which exam is for civil services?",
  //     options: ["UPSC", "SSC", "RRB"],
  //     correctAnswer: 0,
  //   },
  // },
];

export function UserProgressProvider({ children }) {
  const [apps, setApps] = useState(INITIAL_APPS);
  const [totalProgress, setTotalProgress] = useState(0);
  const [topApp, setTopApp] = useState(null);

  // Calculate overall progress and top app
  useEffect(() => {
    const avgProgress = apps.reduce((sum, app) => {
      const appAvg = (app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3;
      return sum + appAvg;
    }, 0) / apps.length;

    setTotalProgress(avgProgress);

    // Find top app by total progress
    const top = apps.reduce((max, app) => {
      const appTotal = (app.progress.basics + app.progress.intermediate + app.progress.advanced) / 3;
      const maxTotal = (max.progress.basics + max.progress.intermediate + max.progress.advanced) / 3;
      return appTotal > maxTotal ? app : max;
    }, apps[0]);

    setTopApp(top);
  }, [apps]);

  const updateProgress = (appId, level, value) => {
    setApps((prevApps) =>
      prevApps.map((app) =>
        app.id === appId
          ? {
              ...app,
              progress: {
                ...app.progress,
                [level]: Math.min(100, Math.max(0, value)),
              },
            }
          : app
      )
    );
  };

  const getApp = (appId) => {
    return apps.find((app) => app.id === appId);
  };

  const value = {
    apps,
    totalProgress,
    topApp,
    updateProgress,
    getApp,
  };

  return <UserProgressContext.Provider value={value}>{children}</UserProgressContext.Provider>;
}
