"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import Link from "next/link";
import { Brain, Home, RefreshCw, Award, BookOpen, Target, Lightbulb, Zap } from "lucide-react";

interface ModuleAnswer {
  questionId: string;
  question: string;
  answer: string | null;
}

interface ModuleResult {
  id: string;
  title: string;
  answers: ModuleAnswer[];
}

interface ResultsData {
  testType: "brief" | "elaborate";
  answers: Record<string, string>;
  modules: ModuleResult[];
  completedAt: string;
}

interface Insight {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

function analyzeResults(data: ResultsData): {
  insights: Insight[];
  summary: string;
  strengths: string[];
  recommendations: string[];
} {
  const answers = data.answers;
  const answerValues = Object.values(answers);
  
  // Count answer patterns
  const patterns: Record<string, number> = {};
  answerValues.forEach((value) => {
    patterns[value] = (patterns[value] || 0) + 1;
  });

  // Find dominant patterns
  const sortedPatterns = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const insights: Insight[] = [];
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Learning style insights
  const learningPatterns = ["visual", "auditory", "kinesthetic", "reading"];
  const dominantLearning = sortedPatterns.find((p) => learningPatterns.includes(p[0]));
  
  if (dominantLearning) {
    const learningInsights: Record<string, { title: string; desc: string; strength: string; rec: string }> = {
      visual: {
        title: "Visual Learner",
        desc: "You learn best through images, diagrams, and visual representations. You likely think in pictures and benefit from color-coded notes and mind maps.",
        strength: "Strong spatial reasoning and ability to visualize concepts",
        rec: "Use diagrams, charts, and color-coding when studying new material",
      },
      auditory: {
        title: "Auditory Learner",
        desc: "You absorb information best through listening and verbal communication. Discussions, lectures, and audio materials resonate well with you.",
        strength: "Excellent verbal comprehension and communication skills",
        rec: "Record lectures, participate in discussions, and use podcasts for learning",
      },
      kinesthetic: {
        title: "Kinesthetic Learner",
        desc: "You learn best through hands-on experience and physical engagement. You prefer to learn by doing rather than just watching or listening.",
        strength: "Strong practical skills and ability to learn through experimentation",
        rec: "Seek hands-on projects, labs, and interactive learning experiences",
      },
      reading: {
        title: "Reading/Writing Learner",
        desc: "You prefer learning through written words. You're good at taking notes, reading textbooks, and expressing yourself through writing.",
        strength: "Strong written communication and note-taking abilities",
        rec: "Take detailed notes, rewrite key concepts, and use written summaries",
      },
    };

    const insight = learningInsights[dominantLearning[0]];
    if (insight) {
      insights.push({
        title: insight.title,
        description: insight.desc,
        icon: BookOpen,
        color: "blue",
      });
      strengths.push(insight.strength);
      recommendations.push(insight.rec);
    }
  }

  // Problem-solving insights
  const problemPatterns = ["analytical", "intuitive", "creative", "methodical", "sequential", "global"];
  const dominantProblem = sortedPatterns.find((p) => problemPatterns.includes(p[0]));
  
  if (dominantProblem) {
    const problemInsights: Record<string, { title: string; desc: string; strength: string; rec: string }> = {
      analytical: {
        title: "Analytical Problem Solver",
        desc: "You approach challenges by breaking them into smaller parts and analyzing each component systematically.",
        strength: "Strong logical thinking and attention to detail",
        rec: "Create structured frameworks when tackling complex problems",
      },
      intuitive: {
        title: "Intuitive Problem Solver",
        desc: "You rely on gut feelings and pattern recognition to solve problems, often arriving at solutions quickly.",
        strength: "Quick decision-making and pattern recognition abilities",
        rec: "Trust your instincts but validate with data when possible",
      },
      creative: {
        title: "Creative Problem Solver",
        desc: "You think outside the box and generate innovative solutions that others might not consider.",
        strength: "Original thinking and ability to find novel solutions",
        rec: "Brainstorm freely before evaluating ideas, and seek diverse perspectives",
      },
      methodical: {
        title: "Methodical Problem Solver",
        desc: "You follow systematic approaches and proven processes to ensure reliable outcomes.",
        strength: "Consistent results and thorough approach to challenges",
        rec: "Document your processes and create checklists for complex tasks",
      },
      sequential: {
        title: "Sequential Thinker",
        desc: "You process information step-by-step in a linear fashion, preferring clear progression.",
        strength: "Strong ability to follow and create detailed procedures",
        rec: "Break down learning materials into ordered steps and sequences",
      },
      global: {
        title: "Global Thinker",
        desc: "You see the big picture first and understand how parts connect to the whole.",
        strength: "Strategic thinking and ability to see connections others miss",
        rec: "Start with overviews and summaries before diving into details",
      },
    };

    const insight = problemInsights[dominantProblem[0]];
    if (insight) {
      insights.push({
        title: insight.title,
        description: insight.desc,
        icon: Target,
        color: "purple",
      });
      strengths.push(insight.strength);
      recommendations.push(insight.rec);
    }
  }

  // Motivation insights
  const motivationPatterns = ["achievement", "recognition", "growth", "impact", "autonomy", "mastery", "purpose"];
  const dominantMotivation = sortedPatterns.find((p) => motivationPatterns.includes(p[0]));
  
  if (dominantMotivation) {
    const motivationInsights: Record<string, { title: string; desc: string; strength: string; rec: string }> = {
      achievement: {
        title: "Achievement-Driven",
        desc: "You're motivated by setting and reaching challenging goals. Success and accomplishment fuel your drive.",
        strength: "High self-motivation and goal-oriented mindset",
        rec: "Set stretch goals and celebrate milestones along the way",
      },
      recognition: {
        title: "Recognition-Motivated",
        desc: "Acknowledgment and appreciation from others energizes your efforts and performance.",
        strength: "Strong social awareness and team contribution",
        rec: "Seek roles with visible impact and share your achievements",
      },
      growth: {
        title: "Growth-Oriented",
        desc: "Personal development and continuous learning are your primary motivators.",
        strength: "Adaptability and commitment to self-improvement",
        rec: "Pursue learning opportunities and track your skill development",
      },
      impact: {
        title: "Impact-Driven",
        desc: "Making a meaningful difference motivates you more than personal gain.",
        strength: "Purpose-driven work ethic and social consciousness",
        rec: "Connect your work to larger outcomes and find meaningful projects",
      },
      autonomy: {
        title: "Autonomy-Seeking",
        desc: "Having control over your work and decisions is essential to your motivation.",
        strength: "Self-direction and independent work capabilities",
        rec: "Seek roles with flexibility and take ownership of projects",
      },
      mastery: {
        title: "Mastery-Focused",
        desc: "You're driven by the pursuit of excellence and becoming an expert in your field.",
        strength: "Deep expertise development and quality focus",
        rec: "Set skill-based goals and seek feedback for continuous improvement",
      },
      purpose: {
        title: "Purpose-Driven",
        desc: "Understanding why something matters is crucial for your engagement and motivation.",
        strength: "Strong alignment between values and actions",
        rec: "Always understand the 'why' behind tasks and projects",
      },
    };

    const insight = motivationInsights[dominantMotivation[0]];
    if (insight) {
      insights.push({
        title: insight.title,
        description: insight.desc,
        icon: Lightbulb,
        color: "amber",
      });
      strengths.push(insight.strength);
      recommendations.push(insight.rec);
    }
  }

  // Add default insights if none were found
  if (insights.length === 0) {
    insights.push({
      title: "Balanced Learner",
      description: "Your responses show a balanced approach to learning, problem-solving, and motivation. You can adapt to different situations effectively.",
      icon: Award,
      color: "green",
    });
    strengths.push("Adaptable learning style that adjusts to different contexts");
    recommendations.push("Experiment with different learning methods to find what works best for each situation");
  }

  const summary = data.testType === "brief"
    ? "Based on your Brief Test responses, we've identified key patterns in how you learn, solve problems, and stay motivated. These insights can help you optimize your learning journey."
    : "Your comprehensive Elaborate Test results reveal detailed patterns across multiple dimensions of learning and cognition. Use these insights to create a personalized learning strategy.";

  return {
    insights,
    summary,
    strengths: strengths.length > 0 ? strengths : ["Adaptable and flexible approach to challenges"],
    recommendations: recommendations.length > 0 ? recommendations : ["Continue exploring different learning strategies to find your optimal approach"],
  };
}

export default function ResultsPage() {
  const [state, setState] = useState<{
    resultsData: ResultsData | null;
    isLoading: boolean;
    hasError: boolean;
  }>({
    resultsData: null,
    isLoading: true,
    hasError: false,
  });

  useEffect(() => {
    // Retrieve results from sessionStorage
    const stored = sessionStorage.getItem("learnapt-results");
    
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ResultsData;
        startTransition(() => {
          setState({
            resultsData: parsed,
            isLoading: false,
            hasError: false,
          });
        });
      } catch (error) {
        // Log parsing errors for debugging - this happens when sessionStorage contains invalid JSON
        console.error("Failed to parse results data:", error);
        startTransition(() => {
          setState({
            resultsData: null,
            isLoading: false,
            hasError: true,
          });
        });
      }
    } else {
      startTransition(() => {
        setState({
          resultsData: null,
          isLoading: false,
          hasError: true,
        });
      });
    }
  }, []);

  const { resultsData, isLoading, hasError } = state;

  const analysis = useMemo(() => {
    if (!resultsData) return null;
    return analyzeResults(resultsData);
  }, [resultsData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (hasError || !resultsData || !analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
            <RefreshCw className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              No Results Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              It looks like you haven&apos;t completed a test yet, or your session has expired. 
              Please take a test to see your results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/brief-test"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Zap className="h-5 w-5" />
                Take Brief Test
              </Link>
              <Link
                href="/elaborate-test"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Take Elaborate Test
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const testTypeLabel = resultsData.testType === "brief" ? "Brief Test" : "Elaborate Test";
  const isBriefTest = resultsData.testType === "brief";

  // Helper function to get accent color classes
  const getAccentClasses = (type: "bg" | "text" | "border" | "bg-light" | "border-light") => {
    const classes = {
      brief: {
        bg: "bg-blue-600",
        text: "text-blue-600",
        border: "border-blue-800",
        "bg-light": "bg-blue-50 dark:bg-blue-900/20",
        "border-light": "border-blue-200",
      },
      elaborate: {
        bg: "bg-purple-600",
        text: "text-purple-600",
        border: "border-purple-800",
        "bg-light": "bg-purple-50 dark:bg-purple-900/20",
        "border-light": "border-purple-200",
      },
    };
    return classes[resultsData.testType][type];
  };

  // Helper for insight colors
  const getInsightColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-100 dark:bg-blue-900/50", text: "text-blue-600" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/50", text: "text-purple-600" },
      amber: { bg: "bg-amber-100 dark:bg-amber-900/50", text: "text-amber-600" },
      green: { bg: "bg-green-100 dark:bg-green-900/50", text: "text-green-600" },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className={`h-8 w-8 ${getAccentClasses("text")}`} />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">{testTypeLabel} Results</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Success Banner */}
        <div className={`${getAccentClasses("bg-light")} border ${getAccentClasses("border-light")} dark:${getAccentClasses("border")} rounded-xl p-6 mb-8`}>
          <div className="flex items-center gap-4">
            <div className={`p-3 ${getAccentClasses("bg")} rounded-full`}>
              <Award className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Results Are Ready!
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Completed on {new Date(resultsData.completedAt).toLocaleDateString()} at{" "}
                {new Date(resultsData.completedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Summary</h2>
          <p className="text-slate-600 dark:text-slate-400">{analysis.summary}</p>
        </div>

        {/* Key Insights */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Key Insights</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {analysis.insights.map((insight, index) => {
              const colorClasses = getInsightColorClasses(insight.color);
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg"
                >
                  <div className={`w-12 h-12 ${colorClasses.bg} rounded-full flex items-center justify-center mb-4`}>
                    <insight.icon className={`h-6 w-6 ${colorClasses.text}`} />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {insight.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {insight.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Strengths</h2>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-sm font-bold">✓</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Recommendations</h2>
          <ul className="space-y-3">
            {analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className={`w-6 h-6 ${isBriefTest ? "bg-blue-100 dark:bg-blue-900/50" : "bg-purple-100 dark:bg-purple-900/50"} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                  <span className={`${isBriefTest ? "text-blue-600" : "text-purple-600"} text-sm font-bold`}>{index + 1}</span>
                </div>
                <span className="text-slate-700 dark:text-slate-300">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Module Breakdown */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Module Breakdown</h2>
          <div className="space-y-4">
            {resultsData.modules.map((module) => {
              const answeredQuestions = module.answers.filter((a) => a.answer !== null).length;
              const totalQuestions = module.answers.length;
              
              return (
                <div key={module.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{module.title}</h3>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {answeredQuestions}/{totalQuestions} answered
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${isBriefTest ? "bg-blue-600" : "bg-purple-600"}`}
                      style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>
          {resultsData.testType === "brief" ? (
            <>
              <Link
                href="/brief-test"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Retake Brief Test
              </Link>
              <Link
                href="/elaborate-test"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5" />
                Take Elaborate Test
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/elaborate-test"
                className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Retake Elaborate Test
              </Link>
              <Link
                href="/brief-test"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <Zap className="h-5 w-5" />
                Take Brief Test
              </Link>
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {new Date().getFullYear()} Learnapt. Your results are stored locally and are private.
          </p>
        </div>
      </footer>
    </div>
  );
}
