"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Footer from '../../../../components/Footer';
import QuizComponent from '../../../../components/QuizComponent';
import PremiumAccessPrompt from '@shared/PremiumAccessPrompt';
import { getCurrentUser } from '../../../../lib/supabaseClient';

export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;
  const [lesson, setLesson] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (moduleId && lessonId) {
      fetchLesson();
    }
  }, [moduleId, lessonId]);

  const checkAuth = async () => {
    const currentUser = await getCurrentUser();
    if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
      router.push('/register');
      return;
    }
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
      <h2>Module ${modId}, Lesson ${lessId}: Foundations of Public Relations</h2>

      <h3>Introduction</h3>
      <p>Public Relations (PR) is the strategic art and science of managing the spread of information between an individual or organisation and the public. At its core, PR is about crafting and sustaining a positive image, building trust, and fostering meaningful relationships with diverse audiences — from customers and investors to journalists and the broader community.</p>
      <p>Unlike advertising, which is paid promotion, PR earns its credibility through third-party endorsement. A glowing review in a respected newspaper, a viral social post from an influential voice, or a well-placed feature story in an industry journal — these are the currency of PR. That earned trust is far more powerful than any paid placement, because audiences know it was not purchased.</p>
      <p>In this lesson, we examine the strategic foundations that every PR professional must master: how to define publics, how to craft messages that resonate, and how to plan and execute campaigns that achieve measurable results.</p>

      <h3>Key Concepts</h3>
      <h4>1. Defining Your Publics</h4>
      <p>A "public" in PR is any group of people who share a common interest with respect to your organisation. Every organisation has multiple publics: employees, investors, customers, regulators, media, local communities, and the general public. The first step in any PR strategy is to identify and segment these groups, understand their concerns, and tailor communication accordingly.</p>
      <p>For example, a pharmaceutical company might need to communicate clinical trial data to healthcare professionals using precise, technical language, while simultaneously communicating the human benefits of the same drug to patients and caregivers in warm, accessible language. The message adapts; the commitment to accuracy and integrity does not.</p>

      <h4>2. Media Relations and the Press Release</h4>
      <p>Media relations is the pillar of traditional PR. Building relationships with editors, reporters, and broadcasters takes time and consistency. Journalists value PR professionals who understand their beat, deliver relevant stories, and never waste their time with irrelevant pitches.</p>
      <p>A well-crafted press release follows a strict structure: a compelling headline that answers "why does this matter now?", a strong opening paragraph with the five Ws (Who, What, When, Where, Why), two or three paragraphs of supporting detail, a quote from a senior spokesperson, a brief background section ("boilerplate"), and clear contact information. Mastering this format is non-negotiable.</p>

      <h4>3. Brand Messaging and Reputation Management</h4>
      <p>Reputation is built over years and destroyed in moments. Effective PR professionals develop brand messaging frameworks that define the organisation's core values, tone of voice, key messages, and positioning statements. These frameworks ensure consistency across every channel — press releases, social media, speaking engagements, and employee communications.</p>
      <p>Reputation management also involves monitoring what is being said about your organisation across media and social platforms, responding to inaccuracies swiftly, and continuously reinforcing positive narratives through proactive storytelling.</p>

      <h4>4. Crisis Communication</h4>
      <p>No organisation is immune to crises — product recalls, data breaches, executive misconduct, environmental incidents. The difference between a crisis that destroys a brand and one that actually strengthens it lies almost entirely in the quality of the communication response.</p>
      <p>The golden rules of crisis communication: acknowledge quickly, be transparent about what you know and what you are doing to find out more, take responsibility where appropriate, communicate through the most credible spokespeople available, and never speculate or minimise. Speed matters, but accuracy matters more. Organisations that try to hide information consistently suffer more lasting damage than those that get ahead of the story.</p>

      <h4>5. Stakeholder Engagement</h4>
      <p>Modern PR extends well beyond media relations. Stakeholder engagement encompasses investor relations, community affairs, government relations (lobbying and policy engagement), employee communications, and partnerships with NGOs or advocacy groups. Each stakeholder relationship requires dedicated attention, regular dialogue, and genuine responsiveness to concerns.</p>

      <h3>Practical Applications</h3>
      <p><strong>Campaign Planning:</strong> A PR campaign begins with clear objectives (what behaviour, attitude, or awareness shift do you want?), moves through audience research and message development, into channel selection and tactic execution, and ends with measurement and evaluation. SMART objectives (Specific, Measurable, Achievable, Relevant, Time-bound) ensure campaigns stay focused and accountable.</p>
      <p><strong>Product Launch PR:</strong> When launching a product, PR generates pre-launch buzz through media exclusives and influencer seeding, sustains momentum through launch-day coverage and live events, and extends the story through customer testimonials and case studies in the months that follow. The best launches are news in their own right — they tell a story that matters to the target audience.</p>
      <p><strong>Thought Leadership:</strong> Placing opinion articles and expert commentary in relevant publications positions senior leaders as authoritative voices in their field. This earns trust, attracts talent and partnerships, and differentiates the organisation from competitors who only speak when they have something to sell.</p>
      <p><strong>Social Media PR:</strong> Social platforms have blurred the lines between PR and marketing. Real-time engagement, community management, and authentic storytelling are now central PR competencies. A brand that handles a customer complaint with empathy and speed on Twitter — where thousands can watch — builds more goodwill than any press release.</p>

      <h3>Summary</h3>
      <p>Public Relations is a sophisticated discipline that goes far beyond press releases and media lunches. It is the strategic management of reputation, relationships, and narratives across every stakeholder group that matters to an organisation. Great PR professionals are part strategist, part journalist, part diplomat, and part storyteller.</p>
      <p>In this lesson you have covered: the definition and scope of PR; how to identify and segment publics; the mechanics of media relations and press release writing; brand messaging and reputation management; crisis communication principles; and multi-stakeholder engagement strategies. Each of these skill areas will be developed further throughout this course, giving you a robust and practical toolkit for a career in communications.</p>
      <p>As you progress, remember that all PR — at its best — is about truth told compellingly. The most sustainable reputations are built on genuine performance, genuine care for stakeholders, and genuine transparency. Spin may win a news cycle; integrity wins decades.</p>
    `;
  };

  const generateQuiz = () => {
    return [
      {
        question: "What is the primary goal of public relations?",
        options: [
          "To build mutually beneficial relationships between an organization and its publics",
          "To sell products directly to consumers",
          "To manage internal employee communications only",
          "To design advertising campaigns"
        ],
        correct_answer: 0
      },
      {
        question: "Which of the following is a key component of an effective press release?",
        options: [
          "Technical jargon and complex language",
          "A compelling headline and clear news angle",
          "Lengthy disclaimers and legal text",
          "Personal opinions of the PR professional"
        ],
        correct_answer: 1
      },
      {
        question: "What is crisis communication in PR?",
        options: [
          "Communicating only during natural disasters",
          "Managing communications to protect an organization's reputation during challenging events",
          "Avoiding all media contact during a crisis",
          "Sending press releases every day"
        ],
        correct_answer: 1
      },
      {
        question: "Which metric is most useful for measuring PR campaign success?",
        options: [
          "Number of press releases sent",
          "Media impressions and share of voice",
          "Number of staff in the PR team",
          "Office square footage"
        ],
        correct_answer: 1
      },
      {
        question: "What does 'earned media' mean in PR?",
        options: [
          "Paid advertising placements",
          "Content your organization creates and publishes",
          "Organic coverage and mentions achieved through PR efforts",
          "Social media posts by employees"
        ],
        correct_answer: 2
      }
    ];
  };

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);
    
    // Show Premium Access Prompt after completing sample lesson (Module 1, Lesson 1)
    if (passed && moduleId === '1' && lessonId === '1') {
      setShowPremiumPrompt(true);
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
      <>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{lesson?.title} - Learn PR</title>
        <meta name="description" content={`Learn PR - Module ${moduleId}, Lesson ${lessonId}`} />
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

            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: lesson?.content }} />
          </div>

          {lesson?.quiz && (
            <QuizComponent 
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

      {/* Premium Access Prompt - shown after sample lesson completion */}
      {showPremiumPrompt && (
        <PremiumAccessPrompt
          appName="Learn PR"
          appHighlight="Master the science of public perception and brand influence. Build strategic PR campaigns and manage crisis communications."
          onCancel={() => setShowPremiumPrompt(false)}
        />
      )}

      <Footer />
    </>
  );
}
