import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import { getPricingDisplay, getIntroOfferNotice } from "../utils/pricing";
import TranslationFeatureBanner from "../../../components/shared/TranslationFeatureBanner";
import Hero, { getHeroImagesForApp } from "../../../components/shared/HeroManager";
import MagicSearchBar from "../components/portal/MagicSearchBar";
import BentoBoxGrid from "../components/portal/BentoBoxGrid";
import SubjectSwitcher from "../components/portal/SubjectSwitcher";
import GatekeeperTest from "../components/portal/GatekeeperTest";

export default function Home() {
  const pricing = getPricingDisplay();
  const introNotice = getIntroOfferNotice();
  const [randomImage1, setRandomImage1] = useState('');
  const [randomImage2, setRandomImage2] = useState('');
  const [randomImage3, setRandomImage3] = useState('');

  useEffect(() => {
    // Set random images for the page, ensuring no duplicates using Fisher-Yates shuffle
    const images = getHeroImagesForApp('main').slice(1); // Get all secondary images
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomImage1(shuffled[0] || images[0]);
    setRandomImage2(shuffled[1] || images[1] || images[0]);
    setRandomImage3(shuffled[2] || images[1] || images[0]);
  }, []);

  return (
    <>
      <Head>
        <title>iiskills.cloud - Indian Institute of Professional Skills Development</title>
        <meta
          name="description"
          content={`Education for All, Online and Affordable. Professional skills development at just ${pricing.totalPrice} per course. Part of Viksit Bharat initiative.`}
        />
        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.05); }
          }
          .blink-animation {
            animation: blink 2s ease-in-out infinite;
          }
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          /* Marquee uses -50% translation because content is duplicated 4 times.
             This ensures seamless looping as the second copy moves into view. */
          .animate-marquee {
            display: inline-block;
            animation: marquee 20s linear infinite;
          }
        `}</style>
      </Head>
      <main>
        {/* HERO SECTION: Unified Portal */}
        <Hero appId="main" className="h-[70vh] md:h-[80vh] lg:h-[90vh]">
          <div className="text-center text-white space-y-6 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              One Engine. Infinite Mastery.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto px-4">
              We've standardized the laws of the universe. Using our signature Tri-Level Engine, 
              you can master Math, Physics, Chemistry, and Geography through a single, proven logical flow. 
              <span className="font-bold block mt-2">100% Free. 100% Open.</span>
            </p>
            
            {/* CTA Buttons - Universal Links */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="/courses"
                className="inline-block bg-white text-primary px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg min-w-[240px]"
              >
                Explore Courses
              </Link>
              <Link
                href="/apps"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all duration-200 text-center text-base sm:text-lg min-w-[240px]"
              >
                All Apps
              </Link>
            </div>
          </div>
        </Hero>

        {/* Translation Feature Banner */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TranslationFeatureBanner />
          </div>
        </section>

        {/* Icon Row: The iiskills Core Values */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-12">
              The iiskills Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Value 1: Monorepo Powered */}
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">🔗</div>
                <h3 className="text-xl font-bold text-primary mb-3">Monorepo Powered</h3>
                <p className="text-gray-700">
                  One account, four subjects, zero friction.
                </p>
              </div>

              {/* Value 2: The Power Hour */}
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-accent mb-3">The Power Hour</h3>
                <p className="text-gray-700">
                  Master the "Basic 6" modules in under 60 minutes.
                </p>
              </div>

              {/* Value 3: Tri-Level Logic */}
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-green-600 mb-3">Tri-Level Logic</h3>
                <p className="text-gray-700">
                  A consistent path from Intuition to Expertise.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Universal Search Bar (floating, always accessible) */}
        <MagicSearchBar />

        {/* Interactive Subject Switcher Widget */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">
              Unified Portal
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              One engine powering four subjects. Click to explore each mastery path.
            </p>
            <SubjectSwitcher />
          </div>
        </section>

        {/* Mastery in Three Steps Journey Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">
              Mastery in Three Steps
            </h2>
            <p className="text-xl text-center text-gray-600 mb-12">
              Our signature Tri-Level system takes you from curiosity to expertise
            </p>

            <div className="space-y-8">
              {/* Level 1: BASIC */}
              <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-8 shadow-lg border-l-8 border-green-500">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">🟢</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-700 mb-3">
                      Level 1: BASIC (Building Intuition)
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>What:</strong> Foundational literacy and terminology.
                      </p>
                      <p>
                        <strong>Proof:</strong> Can you identify the units and the "why" behind the rules?
                      </p>
                      <p>
                        <strong>Visual:</strong> Progress bar fills to 100% in under 1 hour.
                      </p>
                    </div>
                    {/* Progress bar visual */}
                    <div className="mt-4 bg-white rounded-full h-4 overflow-hidden shadow-inner">
                      <div className="bg-green-500 h-full rounded-full animate-pulse" style={{ width: "100%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 2: INTERMEDIATE */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg border-l-8 border-blue-500">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">🔵</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-blue-700 mb-3">
                      Level 2: INTERMEDIATE (The Systems)
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>What:</strong> Interactive problem solving and formula application.
                      </p>
                      <p>
                        <strong>Proof:</strong> Can you predict how changing one variable affects the whole system?
                      </p>
                      <p>
                        <strong>Visual:</strong> Gears animation with interconnected modules.
                      </p>
                    </div>
                    {/* Gears visual representation */}
                    <div className="mt-4 flex gap-2 items-center justify-center">
                      <div className="text-4xl animate-spin" style={{ animationDuration: "3s" }}>⚙️</div>
                      <div className="text-3xl animate-spin" style={{ animationDuration: "2s", animationDirection: "reverse" }}>⚙️</div>
                      <div className="text-4xl animate-spin" style={{ animationDuration: "4s" }}>⚙️</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level 3: ADVANCED */}
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg border-l-8 border-purple-500">
                <div className="flex items-start gap-6">
                  <div className="text-5xl">🟣</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-purple-700 mb-3">
                      Level 3: ADVANCED (The Architect)
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>
                        <strong>What:</strong> Theoretical proofs and contemporary research.
                      </p>
                      <p>
                        <strong>Proof:</strong> High-stakes testing for the top 1% of learners.
                      </p>
                      <p>
                        <strong>Visual:</strong> Rocket or Crown icon representing achievement.
                      </p>
                    </div>
                    {/* Achievement visual */}
                    <div className="mt-4 text-center">
                      <div className="inline-flex gap-4 text-5xl">
                        <span className="animate-bounce">🚀</span>
                        <span className="animate-pulse">👑</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why iiskills? - The Monorepo Advantage Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-3">
              Why iiskills?
            </h2>
            <p className="text-xl text-center text-gray-600 mb-8">
              A Unified Ecosystem for Curious Minds
            </p>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="text-6xl mb-6 text-center md:text-left">🌐</div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Because our apps are built in a single, synchronized monorepo, your learning isn't siloed.
                  </p>
                  <ul className="space-y-4 text-gray-700">
                    <li className="flex items-start bg-blue-50 p-4 rounded-lg">
                      <span className="text-primary mr-3 text-2xl">👤</span>
                      <div>
                        <strong className="block text-gray-900">One Profile</strong>
                        <span className="text-sm">Your iiskills account powers all apps.</span>
                      </div>
                    </li>
                    <li className="flex items-start bg-purple-50 p-4 rounded-lg">
                      <span className="text-accent mr-3 text-2xl">🔥</span>
                      <div>
                        <strong className="block text-gray-900">Unified Streaks</strong>
                        <span className="text-sm">Progress in Chemistry keeps your Math streak alive.</span>
                      </div>
                    </li>
                    <li className="flex items-start bg-green-50 p-4 rounded-lg">
                      <span className="text-green-600 mr-3 text-2xl">🎯</span>
                      <div>
                        <strong className="block text-gray-900">Shared UI</strong>
                        <span className="text-sm">Learn one navigation. Rule all subjects.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8 border-2 border-dashed border-primary/30 relative overflow-hidden">
                    {/* Animated connecting lines between apps */}
                    <svg className="absolute inset-0 w-full h-full opacity-20" style={{ zIndex: 0 }}>
                      <line x1="25%" y1="25%" x2="75%" y2="25%" stroke="currentColor" strokeWidth="2" className="text-primary" />
                      <line x1="25%" y1="25%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="2" className="text-primary" />
                      <line x1="75%" y1="25%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="2" className="text-primary" />
                      <line x1="25%" y1="75%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="2" className="text-primary" />
                      <line x1="25%" y1="25%" x2="75%" y2="75%" stroke="currentColor" strokeWidth="2" className="text-accent" />
                      <line x1="75%" y1="25%" x2="25%" y2="75%" stroke="currentColor" strokeWidth="2" className="text-accent" />
                    </svg>
                    <div className="grid grid-cols-2 gap-4 text-center relative z-10">
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-red-200">
                        <div className="text-3xl mb-2">∑</div>
                        <div className="text-sm font-semibold" style={{ color: "#DC143C" }}>Math</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-blue-200">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="text-sm font-semibold" style={{ color: "#0080FF" }}>Physics</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-green-200">
                        <div className="text-3xl mb-2">🌍</div>
                        <div className="text-sm font-semibold text-green-600">Geography</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-purple-200">
                        <div className="text-3xl mb-2">⚗️</div>
                        <div className="text-sm font-semibold" style={{ color: "#9B59B6" }}>Chemistry</div>
                      </div>
                    </div>
                    <div className="mt-6 text-center text-sm font-bold text-primary relative z-10">
                      One Account • Unified Progress • Seamless Experience
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Learning Apps Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Interactive Learning Apps */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-primary text-center mb-8">
                Interactive Learning Apps
              </h3>
              <BentoBoxGrid />
            </div>
          </div>
        </section>

        {/* Core Purpose & Vision Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-8">
              Our Vision for Viksit Bharat
            </h2>

            {/* Featured Student Image */}
            <div className="flex justify-center mb-12">
              <div className="relative w-full max-w-md rounded-lg overflow-hidden shadow-xl">
                {randomImage1 && (
                  <Image
                    src={`/images/${randomImage1}`}
                    alt="Empowered student ready to learn and succeed"
                    width={600}
                    height={800}
                    className="w-full h-auto object-cover"
                  />
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">
                  🇮🇳 Building a Developed India
                </h3>
                <p className="text-charcoal leading-relaxed">
                  We are committed to the vision of <strong>Viksit Bharat</strong> (Developed India)
                  by empowering every Indian citizen with the skills needed for personal and
                  professional growth. Our mission is to bridge the skill gap and create
                  opportunities for all.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">
                  🎯 Skill Enhancement Mission
                </h3>
                <p className="text-charcoal leading-relaxed">
                  We believe in democratizing education and making quality skill development
                  accessible to everyone. Every course is designed to provide{" "}
                  <strong>immediately applicable professional and personal skills</strong> that
                  transform careers and lives.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">🌟 Opportunity for All</h3>
                <p className="text-charcoal leading-relaxed">
                  Every Indian deserves the opportunity to upgrade their abilities and unlock their
                  potential. We provide pathways to success regardless of background, location, or
                  economic status.
                </p>
              </div>

              <div className="bg-neutral p-8 rounded-lg shadow">
                <h3 className="text-2xl font-bold text-accent mb-4">
                  💪 Empowerment Through Learning
                </h3>
                <p className="text-charcoal leading-relaxed">
                  Knowledge is power. By equipping individuals with modern skills and competencies,
                  we enable them to compete globally, contribute to India's development, and achieve
                  their dreams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Value Proposition Section */}
        <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            {/* Introductory Offer Banner */}
            {introNotice && (
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6 mb-8 text-center">
                <p className="text-xl font-bold">{introNotice}</p>
              </div>
            )}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-primary mb-4">Why Choose iiskills.cloud?</h2>
                <p className="text-xl text-charcoal mb-6">
                  Quality education that's accessible to everyone
                </p>
                <div className="relative rounded-lg overflow-hidden shadow-xl">
                  {randomImage2 && (
                    <Image
                      src={`/images/${randomImage2}`}
                      alt="Confident learner ready to transform their future"
                      width={600}
                      height={800}
                      className="w-full h-auto object-cover"
                      priority
                    />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="space-y-6">
                  {/* Affordability */}
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="text-5xl mb-4">💰</div>
                    <h3 className="text-2xl font-bold text-primary mb-4">
                      Unbeatable Affordability
                    </h3>
                    <div className="mb-4">
                      <div className="text-4xl font-bold text-accent">{pricing.basePrice}</div>
                      <div className="text-gray-600">
                        + {pricing.gstRate} GST ({pricing.gstAmount})
                      </div>
                      <div className="text-3xl font-bold text-primary mt-2">
                        = {pricing.totalPrice}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">Per Course</div>
                      {pricing.isIntroductory && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded p-3">
                          <p className="text-sm text-green-800 font-semibold">
                            🎉 Introductory Offer!
                          </p>
                          <p className="text-xs text-green-700 mt-1">
                            Valid till Feb 28, 2026. New fees effective from March 01, 2026
                            (₹352.82)
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="text-charcoal">
                      Premium quality courses at a price anyone in India can afford. No hidden fees,
                      no subscriptions.
                    </p>
                  </div>

                  {/* Accessibility */}
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="text-5xl mb-4">🌐</div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Truly Accessible</h3>
                    <ul className="text-left space-y-3 text-charcoal">
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>
                          <strong>100% Online:</strong> Learn from anywhere, anytime
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>
                          <strong>Basic English:</strong> Simple language, easy to understand
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>
                          <strong>Local Languages:</strong> Use browser translation for your
                          language
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-accent mr-2">✓</span>
                        <span>
                          <strong>Mobile Friendly:</strong> Learn on any device
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Practical Skills */}
                  <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                    <div className="text-5xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold text-primary mb-4">Immediately Applicable</h3>
                    <p className="text-charcoal mb-4">
                      Every course focuses on <strong>practical, real-world skills</strong> you can
                      use right away:
                    </p>
                    <ul className="text-left space-y-2 text-charcoal">
                      <li>• Professional communication</li>
                      <li>• Digital marketing & tech skills</li>
                      <li>• Leadership & management</li>
                      <li>• Personal development</li>
                      <li>• Career advancement tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses Preview */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Featured Courses</h2>
            <p className="text-xl text-center text-charcoal mb-12">
              Start your learning journey today - Many FREE courses available!
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-primary">
                <h3 className="font-bold text-xl mb-3 text-primary">Learn AI</h3>
                <p className="text-charcoal mb-4">
                  Discover Artificial Intelligence fundamentals and practical applications.
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                  <p className="text-xs text-green-800 font-semibold">🎁 Free Sample Module</p>
                </div>
                <Link
                  href="/courses"
                  className="block text-center bg-primary text-white py-2 rounded font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 bg-opacity-90 backdrop-blur-sm text-white px-6 py-3 rounded-full text-2xl font-bold z-20 shadow-2xl blink-animation">
                  FREE
                </div>
                <h3 className="font-bold text-xl mb-3 text-primary">Learn Aptitude</h3>
                <p className="text-charcoal mb-4">
                  Develop logical reasoning, quantitative aptitude, and analytical skills for
                  competitive exams.
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span>
                </div>
                <Link
                  href="/courses"
                  className="block text-center bg-green-500 text-white py-2 rounded font-medium hover:bg-green-600 transition"
                >
                  Start Free Course
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-accent">
                <h3 className="font-bold text-xl mb-3 text-primary">Learn PR</h3>
                <p className="text-charcoal mb-4">
                  Master Public Relations strategies, media management, and brand building.
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  <span>⏱️ 10 weeks</span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
                  <p className="text-xs text-green-800 font-semibold">🎁 Free Sample Module</p>
                </div>
                <Link
                  href="/courses"
                  className="block text-center bg-accent text-white py-2 rounded font-medium hover:bg-purple-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/courses"
                className="inline-block bg-accent text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition shadow-lg"
              >
                Browse All 10 Available Courses →
              </Link>
            </div>
          </div>
        </section>

        {/* Gatekeeper Call-to-Action: Prove Your Level */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <GatekeeperTest />
          </div>
        </section>

        {/* Trust Badges & Stats Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-primary">
                <div className="text-5xl mb-3">🌍</div>
                <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-gray-600 font-semibold">Learners Worldwide</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-accent">
                <div className="text-5xl mb-3">✅</div>
                <div className="text-3xl font-bold text-accent mb-2">100% Free</div>
                <p className="text-gray-600 font-semibold">STEM Learning</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-green-600">
                <div className="text-5xl mb-3">🎓</div>
                <div className="text-3xl font-bold text-green-600 mb-2">ISO Certified</div>
                <p className="text-gray-600 font-semibold">Learning Paths</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Future?</h2>
                <p className="text-2xl mb-8">
                  Join thousands of learners building skills for tomorrow
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href="/courses"
                    className="inline-block bg-white text-primary px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
                  >
                    Get Started Now
                  </Link>
                  <Link
                    href="/about"
                    className="inline-block bg-transparent border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition"
                  >
                    Learn More About Us
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  {randomImage3 && (
                    <Image
                      src={`/images/${randomImage3}`}
                      alt="Diverse community of learners achieving success together"
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
