"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import QuizComponent from '../../../../components/QuizComponent';
import EnrollmentLandingPage from '@shared/EnrollmentLandingPage';
import { getCurrentUser } from '../../../../lib/supabaseClient';
import { LessonContent } from '@iiskills/ui/content';
import { isFreeAccessEnabled } from '@lib/freeAccess';

const FREE_ACCESS = isFreeAccessEnabled();

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
      // when Next.js reuses the same page component without full unmount)
      setQuizCompleted(false);
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const fetchLesson = async () => {
    try {
      setLesson({
        id: lessonId,
        module_id: moduleId,
        title: `Lesson ${lessonId}`,
        content: generateLessonContent(moduleId, lessonId),
        quiz: generateQuiz()
      });
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateLessonContent = (modId, lessId) => {
    return `
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Business Management</h2>

      <h3>Introduction</h3>
      <p>Management is the discipline of getting things done through people. At its core, management is the process of planning, organising, leading, and controlling resources — human, financial, technological, and informational — to achieve organisational goals efficiently and effectively. Every business, government agency, non-profit, and even family operates through some form of management, whether formal or informal.</p>
      <p>The study of management has evolved from the purely mechanistic "scientific management" of Frederick Taylor in the early 20th century — which treated workers as interchangeable parts of a production system — to today's humanistic, adaptive approaches that recognise people as the primary source of competitive advantage. Modern management theory integrates insights from psychology, sociology, economics, game theory, and systems thinking to address the complexity of 21st-century organisations.</p>
      <p>This lesson covers the four core management functions, leadership theory, organisational behaviour, strategic planning, and performance management — the five pillars that every effective manager must master. Whether you aspire to lead a startup, a corporate division, a non-profit, or a government department, these foundations will serve you throughout your career.</p>

      <h3>Key Concepts</h3>
      <h4>1. The Four Core Functions of Management</h4>
      <p><strong>Planning</strong> is the foundation. It involves defining objectives, assessing the current situation, identifying alternative courses of action, and selecting the most appropriate strategy. Plans operate at multiple levels: strategic plans (3-5 year horizon, set by senior leadership), tactical plans (1-2 years, translate strategy into operational goals), and operational plans (day-to-day and week-to-week). Effective planning requires good information, honest assessment of capabilities and constraints, and disciplined focus on priorities.</p>
      <p><strong>Organising</strong> involves designing the structure through which work will be divided, coordinated, and executed. Organisational structures include hierarchical/functional structures (grouped by expertise — marketing, finance, operations), divisional structures (grouped by product, region, or customer), matrix structures (reporting to two managers simultaneously — functional and project), and flat/networked structures (minimal hierarchy, maximum autonomy). Structure follows strategy: the design of the organisation should serve the goals it is trying to achieve.</p>
      <p><strong>Leading</strong> is the human dimension of management — motivating, communicating with, and directing people towards goals. Leadership is distinct from management: management is about systems and processes; leadership is about inspiring and influencing people. The most effective managers are also strong leaders, combining analytical rigour with emotional intelligence.</p>
      <p><strong>Controlling</strong> involves monitoring performance against plans, identifying deviations, and taking corrective action. The control process follows a cycle: set standards → measure actual performance → compare to standards → take corrective action if needed → adjust standards if necessary. Management Information Systems (MIS), dashboards, KPIs (Key Performance Indicators), and regular reviews are the mechanisms of control.</p>

      <h4>2. Leadership Theory and Practice</h4>
      <p>Leadership research has produced numerous theoretical frameworks. <strong>Trait theory</strong> identifies characteristics of effective leaders (intelligence, integrity, determination, sociability, self-confidence). While no universal trait profile exists, these qualities are positively correlated with leadership effectiveness. <strong>Behavioural theory</strong> (the Ohio State and Michigan studies) identifies two key behavioural dimensions: task orientation (focus on goals, structure, and results) and relationship orientation (focus on people, trust, and collaboration). Effective leaders adapt their balance depending on context.</p>
      <p><strong>Situational Leadership</strong> (Hersey and Blanchard) argues that no single leadership style is optimal in all situations. The appropriate style depends on follower readiness (ability and willingness). With inexperienced, unwilling followers, a directive style is appropriate; with experienced, committed followers, a delegating style works best. Leaders must continuously assess and adapt.</p>
      <p><strong>Transformational Leadership</strong> — which inspires followers to transcend self-interest for the collective good, articulates a compelling vision, and develops followers' capabilities — is consistently associated with the highest levels of organisational performance and employee engagement. Transformational leaders create other leaders; transactional leaders manage exchanges.</p>

      <h4>3. Organisational Behaviour: Understanding People at Work</h4>
      <p>Organisational behaviour (OB) applies psychology, sociology, and anthropology to understand how individuals, groups, and organisational structures interact. Motivation theory is central to OB. Maslow's Hierarchy of Needs proposes that humans are motivated sequentially by physiological, safety, social, esteem, and self-actualisation needs. Herzberg's Two-Factor Theory distinguishes hygiene factors (whose absence causes dissatisfaction: salary, working conditions) from motivators (whose presence drives satisfaction: achievement, recognition, responsibility, growth). Expectancy Theory (Vroom) argues that motivation depends on the belief that effort will lead to performance, performance will lead to reward, and the reward is valued.</p>
      <p>Team dynamics are critically important. Tuckman's model describes team development through four stages: Forming (polite, cautious), Storming (conflict and power struggles), Norming (establishing norms and cohesion), and Performing (high productivity). Groups that rush past the storming phase or never reach performing are leaving significant value on the table. Psychological safety — the belief that one can speak up, disagree, or raise problems without fear of punishment — is consistently the strongest predictor of team performance (Google's Project Aristotle, 2016).</p>

      <h4>4. Strategic Planning and Competitive Strategy</h4>
      <p>Strategy is the set of choices an organisation makes about where to compete and how to win. The strategic planning process begins with environmental analysis: the PESTEL framework (Political, Economic, Social, Technological, Environmental, Legal) analyses the macro-environment; Porter's Five Forces (rivalry, threat of new entrants, threat of substitutes, bargaining power of suppliers, bargaining power of buyers) analyses the competitive environment; SWOT analysis (Strengths, Weaknesses, Opportunities, Threats) integrates internal and external analysis.</p>
      <p>Michael Porter's three generic strategies provide a framework for competitive positioning: Cost Leadership (being the lowest-cost producer in the industry), Differentiation (offering a product or service perceived as uniquely valuable), and Focus (serving a narrow market segment exceptionally well, through either cost focus or differentiation focus). Organisations that fail to commit to one strategy — "stuck in the middle" — typically underperform. The key strategic discipline is choosing what <em>not</em> to do as much as what to do.</p>

      <h4>5. Performance Management and Measurement</h4>
      <p>What gets measured gets managed. Effective performance management creates a clear line of sight between individual contributions and organisational goals. The Balanced Scorecard (Kaplan and Norton) measures performance across four perspectives: Financial (revenue, profit, ROI), Customer (satisfaction, retention, market share), Internal Processes (efficiency, quality, cycle time), and Learning and Growth (employee development, innovation capacity). By balancing all four, organisations avoid the trap of optimising short-term financial results at the expense of long-term capability.</p>
      <p>OKRs (Objectives and Key Results), popularised by Intel and adopted by Google, Amazon, and many other high-performing organisations, provide a flexible goal-setting framework. Objectives are qualitative, aspirational, and motivating. Key Results are quantitative, measurable, and time-bound. The discipline of regularly reviewing OKRs creates a culture of accountability, transparency, and continuous improvement.</p>

      <h3>Practical Applications</h3>
      <p><strong>Change Management:</strong> Organisational change — whether driven by technology, competition, regulatory shifts, or strategic pivots — is one of the most challenging management tasks. Kotter's 8-Step Change Model (create urgency, build a guiding coalition, form a strategic vision, enlist volunteers, enable action, generate short-term wins, sustain acceleration, institute change) provides a proven framework. The key insight: change fails most often not due to technical complexity but due to insufficient attention to the human dimension — communication, culture, and leadership commitment.</p>
      <p><strong>Cross-Functional Team Management:</strong> Modern organisations depend on cross-functional teams that bring together diverse expertise for specific projects. Managing these teams requires clarity of purpose, clear role definitions, effective conflict resolution, and strong project management discipline (scope, timeline, budget, quality). Project management methodologies — Waterfall for sequential projects with clear requirements, Agile/Scrum for iterative projects with evolving requirements — provide frameworks for this complexity.</p>
      <p><strong>Operations Management:</strong> Operations management optimises the processes by which organisations create and deliver value. Lean manufacturing (eliminating waste), Six Sigma (reducing defects through statistical process control), and the Toyota Production System (just-in-time inventory, continuous improvement/Kaizen, respect for people) have dramatically improved manufacturing productivity and are now widely applied in service industries. Supply chain management — coordinating the flow of goods, information, and money from raw materials to end consumers — is a major source of competitive advantage and risk.</p>

      <h3>Summary</h3>
      <p>Management is the practice of achieving organisational goals through people and systems. In this lesson you have covered: the four core management functions (planning, organising, leading, controlling); leadership theory from traits and behaviours to transformational leadership; organisational behaviour and motivation; strategic planning and competitive strategy; and performance management frameworks including the Balanced Scorecard and OKRs.</p>
      <p>The best managers combine analytical rigour with genuine empathy — understanding both the systems that drive organisational performance and the human beings who make those systems work. As you advance through this course, you will develop specific skills in each of these domains, supported by case studies, simulations, and real-world application exercises that connect theory to the complex, ambiguous situations you will face as a leader.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What are the four core functions of management?",
        options: [
          "Planning, Organizing, Leading, and Controlling",
          "Hiring, Firing, Promoting, and Demoting",
          "Marketing, Sales, Finance, and Operations",
          "Analyzing, Designing, Implementing, and Testing"
        ],
        correct_answer: 0
      },
      {
        question: "Which leadership style involves involving team members in decision-making?",
        options: [
          "Autocratic leadership",
          "Laissez-faire leadership",
          "Democratic (participative) leadership",
          "Transactional leadership"
        ],
        correct_answer: 2
      },
      {
        question: "What does SMART stand for in goal-setting?",
        options: [
          "Simple, Manageable, Achievable, Realistic, Timely",
          "Specific, Measurable, Achievable, Relevant, Time-bound",
          "Strategic, Meaningful, Actionable, Responsible, Trackable",
          "Structured, Motivated, Agile, Results-driven, Targeted"
        ],
        correct_answer: 1
      },
      {
        question: "What is organizational behavior?",
        options: [
          "The study of how buildings are organized",
          "The study of how individuals and groups act within organizations",
          "The process of restructuring a company",
          "A type of financial reporting"
        ],
        correct_answer: 1
      },
      {
        question: "What is the primary purpose of change management?",
        options: [
          "To avoid any changes in the organization",
          "To guide and support employees through organizational transitions",
          "To automate business processes",
          "To reduce the workforce"
        ],
        correct_answer: 1
      }
    ];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    // Show Premium Access Prompt after completing sample lesson (Module 1, Lesson 1)
    // Suppressed in free-access mode.
    if (passed && moduleId === '1' && lessonId === '1' && !FREE_ACCESS) {
      setShowEnrollment(true);
    }
    
    if (passed) {
      try {
        await fetch('/api/assessments/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lesson_id: lessonId,
            module_id: moduleId,
            score: score
          })
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 10) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push('/curriculum');
      }
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson?.title} - Learn Management</title>
        <meta name="description" content={`Learn Management - Module ${moduleId}, Lesson ${lessonId}`} />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push('/curriculum')}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Curriculum
            </button>
          </div>

          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson?.title}</h1>
            </div>

            <LessonContent html={lesson?.content} />
          </div>

          {lesson?.quiz && (
            <QuizComponent 
              key={`${moduleId}-${lessonId}`}
              questions={lesson.quiz}
              onComplete={handleQuizComplete}
            />
          )}

          {quizCompleted && (
            <div className="card bg-green-50 border-2 border-green-500">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Quiz Passed!
              </h3>
              <p className="text-gray-700 mb-4">
                Congratulations! You've successfully completed this lesson.
              </p>
              <button
                onClick={goToNextLesson}
                className="btn-primary"
              >
                Continue to Next Lesson
              </button>
            </div>
          )}
        </div>
      </main>

            {/* Enrollment Landing — shown after sample lesson quiz completion */}
      {showEnrollment && (
        <EnrollmentLandingPage
          appId="learn-management"
          appName="Learn Management"
          appHighlight="Standardize your leadership systems and optimize team efficiency. Master strategic business management frameworks."
          showAIDevBundle={false}
          onClose={() => setShowEnrollment(false)}
        />
      )}
    </>
  );
}
