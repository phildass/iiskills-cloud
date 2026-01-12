import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { getCurrentUser, getUserProfile } from "../lib/supabaseClient";

/**
 * Course Data Structure - 10 Chapters
 * Only Chapter 1, Lesson 1 is free
 */
const courseData = [
  {
    id: 1,
    title: "Introduction to Winning Mindset",
    description: "Understanding the foundation of success",
    lessons: [
      { id: 1, title: "What is a Winning Mindset?", duration: "15 min", free: true },
      { id: 2, title: "The Power of Positive Thinking", duration: "20 min", free: false },
      { id: 3, title: "Setting Your Success Goals", duration: "25 min", free: false },
    ],
    free: false, // Only first lesson is free
  },
  {
    id: 2,
    title: "Building Self-Confidence",
    description: "Develop unshakeable confidence",
    lessons: [
      { id: 1, title: "Understanding Self-Worth", duration: "18 min", free: false },
      { id: 2, title: "Overcoming Self-Doubt", duration: "22 min", free: false },
      { id: 3, title: "Confidence Building Exercises", duration: "20 min", free: false },
    ],
    free: false,
  },
  {
    id: 3,
    title: "Goal Setting Mastery",
    description: "Learn to set and achieve ambitious goals",
    lessons: [
      { id: 1, title: "SMART Goal Framework", duration: "20 min", free: false },
      { id: 2, title: "Breaking Down Big Goals", duration: "25 min", free: false },
      { id: 3, title: "Tracking Your Progress", duration: "15 min", free: false },
    ],
    free: false,
  },
  {
    id: 4,
    title: "Developing Resilience",
    description: "Bounce back from setbacks stronger",
    lessons: [
      { id: 1, title: "Understanding Resilience", duration: "18 min", free: false },
      { id: 2, title: "Learning from Failure", duration: "22 min", free: false },
      { id: 3, title: "Building Mental Toughness", duration: "20 min", free: false },
    ],
    free: false,
  },
  {
    id: 5,
    title: "Time Management for Success",
    description: "Master your time to maximize productivity",
    lessons: [
      { id: 1, title: "Priority Management", duration: "20 min", free: false },
      { id: 2, title: "Eliminating Time Wasters", duration: "18 min", free: false },
      { id: 3, title: "Creating Effective Routines", duration: "22 min", free: false },
    ],
    free: false,
  },
  {
    id: 6,
    title: "Communication Excellence",
    description: "Communicate with impact and influence",
    lessons: [
      { id: 1, title: "Effective Speaking Skills", duration: "25 min", free: false },
      { id: 2, title: "Active Listening", duration: "20 min", free: false },
      { id: 3, title: "Persuasion Techniques", duration: "23 min", free: false },
    ],
    free: false,
  },
  {
    id: 7,
    title: "Leadership Fundamentals",
    description: "Lead yourself and others to victory",
    lessons: [
      { id: 1, title: "What Makes a Great Leader", duration: "22 min", free: false },
      { id: 2, title: "Inspiring and Motivating Others", duration: "25 min", free: false },
      { id: 3, title: "Decision Making Skills", duration: "20 min", free: false },
    ],
    free: false,
  },
  {
    id: 8,
    title: "Financial Success Strategies",
    description: "Build wealth and financial freedom",
    lessons: [
      { id: 1, title: "Money Mindset Transformation", duration: "20 min", free: false },
      { id: 2, title: "Building Multiple Income Streams", duration: "25 min", free: false },
      { id: 3, title: "Smart Investing Basics", duration: "22 min", free: false },
    ],
    free: false,
  },
  {
    id: 9,
    title: "Health and Energy Optimization",
    description: "Peak performance through wellness",
    lessons: [
      { id: 1, title: "Energy Management Strategies", duration: "18 min", free: false },
      { id: 2, title: "Nutrition for Success", duration: "20 min", free: false },
      { id: 3, title: "Exercise and Mental Clarity", duration: "22 min", free: false },
    ],
    free: false,
  },
  {
    id: 10,
    title: "Sustaining Your Success",
    description: "Maintain and grow your achievements",
    lessons: [
      { id: 1, title: "Creating Lasting Habits", duration: "20 min", free: false },
      { id: 2, title: "Continuous Improvement", duration: "22 min", free: false },
      { id: 3, title: "Your Success Action Plan", duration: "25 min", free: false },
    ],
    free: false,
  },
];

/**
 * Course Learning Page
 *
 * Protected Route: Requires authentication
 * Paywall: Only Chapter 1, Lesson 1 is free
 */
export default function Learn() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        // User is not authenticated, redirect to login
        router.push("/login?redirect=/learn");
        return;
      }

      setUser(currentUser);
      setUserProfile(getUserProfile(currentUser));

      // Check if user has purchased the course
      // For now, we'll check user metadata
      const purchased = currentUser.user_metadata?.purchased_winning_course === true;
      setHasPurchased(purchased);

      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLessonClick = (chapterId, lessonId, isFree) => {
    // Allow access to Chapter 1, Lesson 1
    if (chapterId === 1 && lessonId === 1) {
      // TODO: Navigate to lesson content page or render lesson content
      // For now, using alert as placeholder
      alert("Lesson content would be displayed here. This is the FREE preview lesson!");
      return;
    }

    // Check if user has purchased
    if (!hasPurchased && !isFree) {
      // TODO: Show proper paywall modal instead of alert
      // For now, using alert as placeholder
      alert(
        "This lesson requires purchasing the full course. Price: ₹99 + GST ₹17.82 (Total: ₹116.82)"
      );
      return;
    }

    // User has access
    // TODO: Navigate to lesson content page or render lesson content
    alert(`Lesson ${chapterId}.${lessonId} content would be displayed here.`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl text-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Learn Winning - Course Content</title>
        <meta name="description" content="Access your Learn Winning course" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Welcome to Learn Winning,{" "}
              {userProfile?.firstName || userProfile?.first_name || "Learner"}! 🏆
            </h1>
            <p className="text-xl text-charcoal mb-4">
              Master the art of success with our comprehensive 10-chapter course
            </p>

            {!hasPurchased && (
              <div className="bg-accent text-white p-6 rounded-lg mt-4">
                <h3 className="text-2xl font-bold mb-2">🎁 Free Preview Available</h3>
                <p className="mb-3">
                  You have free access to Chapter 1, Lesson 1. Experience our teaching style before
                  purchasing!
                </p>
                <div className="bg-white text-primary p-4 rounded inline-block">
                  <div className="text-lg font-semibold">Full Course Access</div>
                  <div className="text-3xl font-bold">
                    ₹99 <span className="text-base font-normal">+ GST ₹17.82</span>
                  </div>
                  <div className="text-sm mt-1">Total: ₹116.82 • Lifetime Access</div>
                </div>
                <div className="mt-4">
                  <Link
                    href="https://www.aienter.in/payments"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-accent px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
                  >
                    Purchase Full Course →
                  </Link>
                </div>
              </div>
            )}

            {hasPurchased && (
              <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg mt-4">
                <p className="text-green-800 font-semibold">
                  ✓ You have full access to all course content!
                </p>
              </div>
            )}
          </div>

          {/* Course Chapters */}
          <div className="space-y-6">
            {courseData.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-green-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        Chapter {chapter.id}: {chapter.title}
                      </h2>
                      <p className="text-blue-100">{chapter.description}</p>
                    </div>
                    {!hasPurchased && chapter.id > 1 && <div className="text-4xl">🔒</div>}
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-3">
                    {chapter.lessons.map((lesson) => {
                      const isAccessible = (chapter.id === 1 && lesson.id === 1) || hasPurchased;
                      const isFreeLesson = chapter.id === 1 && lesson.id === 1;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonClick(chapter.id, lesson.id, isFreeLesson)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${
                            isAccessible
                              ? "border-green-300 hover:border-green-500 hover:bg-green-50 cursor-pointer"
                              : "border-gray-300 bg-gray-50 cursor-not-allowed opacity-75"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{isAccessible ? "▶️" : "🔒"}</span>
                                <div>
                                  <h3 className="font-semibold text-lg text-charcoal">
                                    Lesson {lesson.id}: {lesson.title}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Duration: {lesson.duration}
                                  </p>
                                </div>
                              </div>
                            </div>
                            {isFreeLesson && (
                              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                FREE
                              </span>
                            )}
                            {!isAccessible && !isFreeLesson && (
                              <span className="bg-gray-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                                LOCKED
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Purchase CTA at bottom */}
          {!hasPurchased && (
            <div className="mt-8 bg-gradient-to-r from-accent to-purple-700 text-white p-8 rounded-lg shadow-lg text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Unlock All Chapters?</h2>
              <p className="text-xl mb-6">
                Get lifetime access to all 10 chapters with 30 comprehensive lessons
              </p>
              <div className="bg-white text-primary p-6 rounded-lg inline-block mb-6">
                <div className="text-xl font-semibold mb-2">Book + Course Bundle</div>
                <div className="text-5xl font-bold mb-2">₹99</div>
                <div className="text-lg mb-2">+ GST ₹17.82</div>
                <div className="text-2xl font-bold border-t-2 border-gray-300 pt-2">
                  Total: ₹116.82
                </div>
              </div>
              <div>
                <Link
                  href="https://www.aienter.in/payments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-accent px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition shadow-lg"
                >
                  Purchase Now →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
