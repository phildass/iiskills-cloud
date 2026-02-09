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
  const [randomImage1, setRandomImage1] = useState("");
  const [randomImage2, setRandomImage2] = useState("");
  const [randomImage3, setRandomImage3] = useState("");
  const [randomImage4, setRandomImage4] = useState("");
  const [randomImage5, setRandomImage5] = useState("");
  const [randomImage6, setRandomImage6] = useState("");
  const [randomImage7, setRandomImage7] = useState("");
  const [randomImage8, setRandomImage8] = useState("");
  const [randomImage9, setRandomImage9] = useState("");
  const [randomImage10, setRandomImage10] = useState("");
  const [randomImage11, setRandomImage11] = useState("");
  const [randomImage12, setRandomImage12] = useState("");
  const [randomImage13, setRandomImage13] = useState("");
  const [randomImage14, setRandomImage14] = useState("");

  useEffect(() => {
    // Set random images for the page, ensuring no duplicates using Fisher-Yates shuffle
    const images = getHeroImagesForApp("main").slice(1); // Get all secondary images (14 images)
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Assign all 14 secondary images to states
    setRandomImage1(shuffled[0] || images[0]);
    setRandomImage2(shuffled[1] || images[1] || images[0]);
    setRandomImage3(shuffled[2] || images[2] || images[0]);
    setRandomImage4(shuffled[3] || images[3] || images[0]);
    setRandomImage5(shuffled[4] || images[4] || images[0]);
    setRandomImage6(shuffled[5] || images[5] || images[0]);
    setRandomImage7(shuffled[6] || images[6] || images[0]);
    setRandomImage8(shuffled[7] || images[7] || images[0]);
    setRandomImage9(shuffled[8] || images[8] || images[0]);
    setRandomImage10(shuffled[9] || images[9] || images[0]);
    setRandomImage11(shuffled[10] || images[10] || images[0]);
    setRandomImage12(shuffled[11] || images[11] || images[0]);
    setRandomImage13(shuffled[12] || images[12] || images[0]);
    setRandomImage14(shuffled[13] || images[13] || images[0]);
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
          html {
            scroll-behavior: smooth;
          }
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
        {/* HERO SECTION: Two-Tiered Knowledge Ecosystem */}
        <Hero appId="main" className="h-[70vh] md:h-[80vh] lg:h-[90vh]">
          <div className="text-center text-white space-y-6 max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
              From Foundational Logic to Professional Mastery.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4">
              Master the laws of nature for free. Master the laws of the economy for a premium.
              <span className="font-bold block mt-2">One engine, two paths, infinite growth.</span>
            </p>

            {/* CTA Buttons - Dual Path */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                href="#foundation"
                className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg min-w-[280px]"
              >
                Build My Foundation - $0
              </Link>
              <Link
                href="#academy"
                className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:from-yellow-400 hover:to-amber-500 transition-all duration-200 text-center text-base sm:text-lg min-w-[280px] shadow-lg"
              >
                Unlock The Career Suite
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

        {/* DUAL-ENGINE LAYOUT: Foundation vs Academy */}
        <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Two Paths. One Ecosystem.
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Choose your learning journey: Build your cognitive foundation for free, or advance
                your career with professional expertise.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 🟢 THE FOUNDATION */}
              <div
                id="foundation"
                className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-green-500"
              >
                <div className="bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 text-white p-8">
                  <div className="text-5xl mb-4">🟢</div>
                  <h3 className="text-3xl font-bold mb-3">The Foundation</h3>
                  <p className="text-lg opacity-90">
                    "The tools every mind needs. No paywalls, no barriers."
                  </p>
                </div>

                <div className="p-8">
                  <p className="text-gray-700 mb-6 text-lg">
                    Build your cognitive base—essential for any high-level career. Master the laws
                    of nature through our signature Tri-Level Engine.
                  </p>

                  {/* Foundation Apps List */}
                  <div className="space-y-3 mb-6">
                    {[
                      {
                        name: "iiskills-math",
                        displayName: "Math",
                        icon: "∑",
                        color: "#DC143C",
                        url: "https://app8.learn-math.iiskills.cloud",
                      },
                      {
                        name: "iiskills-physics",
                        displayName: "Physics",
                        icon: "⚡",
                        color: "#0080FF",
                        url: "https://app6.learn-physics.iiskills.cloud",
                      },
                      {
                        name: "iiskills-chemistry",
                        displayName: "Chemistry",
                        icon: "⚗️",
                        color: "#9B59B6",
                        url: "https://app7.learn-chemistry.iiskills.cloud",
                      },
                      {
                        name: "iiskills-biology",
                        displayName: "Biology",
                        icon: "🧬",
                        color: "#2E7D32",
                        url: "https://app12.learn-biology.iiskills.cloud",
                      },
                      {
                        name: "iiskills-geography",
                        displayName: "Geography",
                        icon: "🌍",
                        color: "#10B981",
                        url: "https://app9.learn-geography.iiskills.cloud",
                      },
                      {
                        name: "iiskills-aptitude",
                        displayName: "Aptitude",
                        icon: "🎯",
                        color: "#6366F1",
                        url: "https://app5.learn-apt.iiskills.cloud",
                      },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        className="flex items-center justify-between p-4 rounded-lg border-2 hover:shadow-lg transition-all group"
                        style={{ borderColor: app.color }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{app.icon}</div>
                          <div>
                            <span className="font-semibold text-lg text-gray-900 block">
                              {app.name}
                            </span>
                            <span className="text-sm text-gray-600">{app.displayName}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            FREE
                          </span>
                          <span className="text-gray-400 group-hover:text-gray-900 transition-colors">
                            →
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-semibold">
                      ✨ Universal Literacy • Academic Mastery • Cognitive Literacy
                    </p>
                  </div>
                </div>
              </div>

              {/* 💰 THE ACADEMY (CAREER SUITE - PAID) */}
              <div
                id="academy"
                className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border-4 border-yellow-500"
              >
                <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <div className="text-5xl mb-4">💰</div>
                    <h3 className="text-3xl font-bold mb-3">The Academy</h3>
                    <p className="text-xl font-semibold mb-2 text-yellow-400">
                      Career Suite - Premium
                    </p>
                    <p className="text-lg opacity-90">
                      "Specialized expertise for the modern professional."
                    </p>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                  <p className="text-gray-300 mb-6 text-lg">
                    Direct-to-employment skills, advanced certifications, in-depth industry modules.
                    Your premium subscription fuels cutting-edge research and development.
                  </p>

                  {/* Paid Apps List */}
                  <div className="space-y-3 mb-6">
                    {[
                      {
                        name: "iiskills-ai",
                        displayName: "AI",
                        icon: "🤖",
                        tagline: "Stop prompting. Start Architecting.",
                        url: "https://app1.learn-ai.iiskills.cloud",
                      },
                      {
                        name: "iiskills-developer",
                        displayName: "Developer",
                        icon: "💻",
                        tagline: "Industry-standard stacks. System Design.",
                        url: "https://app4.learn-developer.iiskills.cloud",
                      },
                      {
                        name: "iiskills-govt-jobs",
                        displayName: "Govt Jobs",
                        icon: "🏛️",
                        tagline: "Most rigorous simulation engine.",
                        url: "https://app10.learn-govt-jobs.iiskills.cloud",
                      },
                      {
                        name: "iiskills-pr",
                        displayName: "PR",
                        icon: "📢",
                        tagline: "Psychology of power and influence.",
                        url: "https://app3.learn-pr.iiskills.cloud",
                      },
                      {
                        name: "iiskills-management",
                        displayName: "Management",
                        icon: "📊",
                        tagline: "Executive decision-making.",
                        url: "https://app2.learn-management.iiskills.cloud",
                      },
                      {
                        name: "iiskills-finesse",
                        displayName: "Finesse",
                        icon: "👔",
                        tagline: "Master executive presence & social intelligence.",
                        url: "https://app11.learn-finesse.iiskills.cloud",
                      },
                    ].map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        className="block p-4 rounded-lg border-2 border-gray-700 hover:border-yellow-500 hover:shadow-lg transition-all group bg-gray-800/50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{app.icon}</div>
                            <div>
                              <span className="font-semibold text-lg text-white block">
                                {app.name}
                              </span>
                              <span className="text-sm text-gray-400">{app.displayName}</span>
                            </div>
                          </div>
                          <span className="text-gray-400 group-hover:text-yellow-400 transition-colors">
                            →
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 pl-12">{app.tagline}</p>
                      </a>
                    ))}
                  </div>

                  <div className="bg-yellow-500/10 border-2 border-yellow-500/30 rounded-lg p-4">
                    <p className="text-sm text-yellow-300 font-semibold">
                      🏆 Professional Competitiveness • Industry-Ready • Career Readiness
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Comparison Table */}
            <div className="mt-12 bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-accent text-white p-6">
                <h3 className="text-2xl font-bold text-center">Feature Comparison</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Feature
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-green-700">
                        The Foundation
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-yellow-700">
                        The Academy (Premium)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Objective</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Universal Literacy</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Professional Competitiveness
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Subjects</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Math, Physics, Chemistry, Biology, Geography, Aptitude
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        AI, Developer, Govt Jobs, PR, Management, Finesse
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Depth</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Academic Mastery</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Industry-Ready Implementation
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Tier System</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Basic → Intermediate → Advanced
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Specialist → Architect → Lead
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Testing</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Standard Gatekeepers</td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        Simulation & Case Study Exams
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Support</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Community-Driven</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Expert-Vetted Curriculum</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">Outcome</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Cognitive Literacy</td>
                      <td className="px-6 py-4 text-sm text-gray-700">Career Readiness</td>
                    </tr>
                    <tr className="bg-green-50">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">Cost</td>
                      <td className="px-6 py-4 text-lg font-bold text-green-700">$0</td>
                      <td className="px-6 py-4 text-lg font-bold text-yellow-700">
                        Premium Subscription
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
                <p className="text-gray-700">One account, four subjects, zero friction.</p>
              </div>

              {/* Value 2: The Power Hour */}
              <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-accent mb-3">The Power Hour</h3>
                <p className="text-gray-700">Master the "Basic 6" modules in under 60 minutes.</p>
              </div>

              {/* Value 3: Tri-Level Logic */}
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-green-600 mb-3">Tri-Level Logic</h3>
                <p className="text-gray-700">A consistent path from Intuition to Expertise.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Image - Vibrant Visual 1 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {randomImage4 && (
                <Image
                  src={`/images/${randomImage4}`}
                  alt="iiskills learning community"
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30"></div>
            </div>
          </div>
        </section>

        {/* Universal Search Bar (floating, always accessible) */}
        <MagicSearchBar />

        {/* Accent Image - Vibrant Visual 5 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {randomImage9 && (
                <Image
                  src={`/images/${randomImage9}`}
                  alt="iiskills learning excellence"
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 via-transparent to-blue-900/30"></div>
            </div>
          </div>
        </section>

        {/* Interactive Subject Switcher Widget */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-primary text-center mb-4">Unified Portal</h2>
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
                        <strong>Proof:</strong> Can you identify the units and the "why" behind the
                        rules?
                      </p>
                      <p>
                        <strong>Visual:</strong> Progress bar fills to 100% in under 1 hour.
                      </p>
                    </div>
                    {/* Progress bar visual */}
                    <div className="mt-4 bg-white rounded-full h-4 overflow-hidden shadow-inner">
                      <div
                        className="bg-green-500 h-full rounded-full animate-pulse"
                        style={{ width: "100%" }}
                      />
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
                        <strong>Proof:</strong> Can you predict how changing one variable affects
                        the whole system?
                      </p>
                      <p>
                        <strong>Visual:</strong> Gears animation with interconnected modules.
                      </p>
                    </div>
                    {/* Gears visual representation */}
                    <div className="mt-4 flex gap-2 items-center justify-center">
                      <div className="text-4xl animate-spin" style={{ animationDuration: "3s" }}>
                        ⚙️
                      </div>
                      <div
                        className="text-3xl animate-spin"
                        style={{ animationDuration: "2s", animationDirection: "reverse" }}
                      >
                        ⚙️
                      </div>
                      <div className="text-4xl animate-spin" style={{ animationDuration: "4s" }}>
                        ⚙️
                      </div>
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

        {/* Accent Image - Vibrant Visual 2 */}
        <section className="py-0 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              {randomImage5 && (
                <Image
                  src={`/images/${randomImage5}`}
                  alt="iiskills tri-level learning journey"
                  width={1000}
                  height={500}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "500px" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Master Your Learning Journey</h3>
                <p className="text-lg opacity-90">
                  From foundational concepts to advanced expertise
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why iiskills? - The Monorepo Advantage Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-primary text-center mb-3">Why iiskills?</h2>
            <p className="text-xl text-center text-gray-600 mb-8">
              A Unified Ecosystem for Curious Minds
            </p>
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="text-6xl mb-6 text-center md:text-left">🌐</div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Because our apps are built in a single, synchronized monorepo, your learning
                    isn't siloed.
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
                        <span className="text-sm">
                          Progress in Chemistry keeps your Math streak alive.
                        </span>
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
                    <svg
                      className="absolute inset-0 w-full h-full opacity-20"
                      style={{ zIndex: 0 }}
                    >
                      <line
                        x1="25%"
                        y1="25%"
                        x2="75%"
                        y2="25%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                      <line
                        x1="25%"
                        y1="25%"
                        x2="25%"
                        y2="75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                      <line
                        x1="75%"
                        y1="25%"
                        x2="75%"
                        y2="75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                      <line
                        x1="25%"
                        y1="75%"
                        x2="75%"
                        y2="75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                      <line
                        x1="25%"
                        y1="25%"
                        x2="75%"
                        y2="75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-accent"
                      />
                      <line
                        x1="75%"
                        y1="25%"
                        x2="25%"
                        y2="75%"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-accent"
                      />
                    </svg>
                    <div className="grid grid-cols-2 gap-4 text-center relative z-10">
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-red-200">
                        <div className="text-3xl mb-2">∑</div>
                        <div className="text-sm font-semibold" style={{ color: "#DC143C" }}>
                          Math
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-blue-200">
                        <div className="text-3xl mb-2">⚡</div>
                        <div className="text-sm font-semibold" style={{ color: "#0080FF" }}>
                          Physics
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-green-200">
                        <div className="text-3xl mb-2">🌍</div>
                        <div className="text-sm font-semibold text-green-600">Geography</div>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-lg transform hover:scale-105 transition-transform duration-300 border-2 border-purple-200">
                        <div className="text-3xl mb-2">⚗️</div>
                        <div className="text-sm font-semibold" style={{ color: "#9B59B6" }}>
                          Chemistry
                        </div>
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

        {/* Accent Image - Vibrant Visual 6 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage10 && (
                  <Image
                    src={`/images/${randomImage10}`}
                    alt="iiskills engaging learning experience"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage11 && (
                  <Image
                    src={`/images/${randomImage11}`}
                    alt="iiskills innovative learning methods"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
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

        {/* Accent Image - Vibrant Visual 3 */}
        <section className="py-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20">
              {randomImage6 && (
                <Image
                  src={`/images/${randomImage6}`}
                  alt="iiskills interactive learning platform"
                  width={1200}
                  height={600}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "600px" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
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
                  Start Course
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

        {/* Accent Image - Vibrant Visual 4 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage7 && (
                  <Image
                    src={`/images/${randomImage7}`}
                    alt="iiskills collaborative learning"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage8 && (
                  <Image
                    src={`/images/${randomImage8}`}
                    alt="iiskills achievement and growth"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges & Stats Section */}
        <section className="py-12 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-primary">
                <div className="text-5xl mb-3">🌍</div>
                <div className="text-3xl font-bold text-primary mb-2">Growing Fast</div>
                <p className="text-gray-600 font-semibold">Learners Worldwide</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-accent">
                <div className="text-5xl mb-3">✅</div>
                <div className="text-3xl font-bold text-accent mb-2">Universal Access</div>
                <p className="text-gray-600 font-semibold">STEM Learning</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-green-600">
                <div className="text-5xl mb-3">🎓</div>
                <div className="text-3xl font-bold text-green-600 mb-2">Quality</div>
                <p className="text-gray-600 font-semibold">Certified Learning Paths</p>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Image - Vibrant Visual 7 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {randomImage12 && (
                <Image
                  src={`/images/${randomImage12}`}
                  alt="iiskills transformative learning"
                  width={1200}
                  height={500}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: "500px", objectFit: "cover" }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-blue-900/30"></div>
            </div>
          </div>
        </section>

        {/* Cross-App Unlock: Monorepo Marketing */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 shadow-xl">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-primary mb-4">Built on the same DNA.</h2>
                <p className="text-xl text-gray-700">
                  One profile, one continuous journey from student to professional.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Example 1: Math to Developer */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">💻</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Learn Developer</h3>
                      <p className="text-gray-700">
                        <strong>Mastered Learn Math (Free)?</strong> You already have a strong
                        foundation in the logic needed for this course. Jump straight into the code
                        while others struggle with basic algorithms.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://app4.learn-developer.iiskills.cloud"
                    className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                  >
                    Start Developer Path →
                  </a>
                </div>

                {/* Example 2: Physics/Math to AI */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">🤖</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Learn AI</h3>
                      <p className="text-gray-700">
                        <strong>Strong foundation in Physics & Math?</strong> That's the secret to
                        understanding Neural Networks. Our free modules prepare you for the most
                        advanced AI concepts.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://app1.learn-ai.iiskills.cloud"
                    className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all"
                  >
                    Start AI Path →
                  </a>
                </div>

                {/* Example 3: Geography to Govt Jobs */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">🏛️</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Learn Govt Jobs</h3>
                      <p className="text-gray-700">
                        <strong>Completed Geography & Aptitude?</strong> You're already ahead in the
                        UPSC/SSC game. Our premium simulation engine builds on your foundation
                        knowledge.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://app10.learn-govt-jobs.iiskills.cloud"
                    className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all"
                  >
                    Start Govt Jobs Path →
                  </a>
                </div>

                {/* Example 4: Foundation to Management */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-indigo-500">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-4xl">📊</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Learn Management</h3>
                      <p className="text-gray-700">
                        <strong>Did you master Math Level 3?</strong> You've done the hard work.
                        Data-driven decision making becomes natural when you understand the numbers.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://app2.learn-management.iiskills.cloud"
                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
                  >
                    Start Management Path →
                  </a>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-gray-700 text-lg">
                  <strong>
                    One account. Unified progress. Seamless transition from free to premium.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Accent Image - Vibrant Visual 8 */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage13 && (
                  <Image
                    src={`/images/${randomImage13}`}
                    alt="iiskills dedicated learners"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/40 to-transparent"></div>
              </div>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                {randomImage14 && (
                  <Image
                    src={`/images/${randomImage14}`}
                    alt="iiskills success stories"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: "400px" }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/40 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why It's Paid Philosophy Block */}
        <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">💡</div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why some apps are free, and others are premium.
                </h2>
              </div>

              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  <strong className="text-primary">
                    We believe the laws of the universe—Math, Physics, and Science—should be a human
                    right.
                  </strong>
                  That's why our Foundation Suite is{" "}
                  <span className="text-green-600 font-bold">free forever</span>.
                </p>

                <p>
                  Our Academy Suite (AI, Developer, Management, Finesse, etc.) requires{" "}
                  <strong>constant updates to keep pace with the global economy</strong>. These are
                  professional-grade tools designed to increase your earning potential and prepare
                  you for real-world career challenges.
                </p>

                <p>
                  <strong className="text-accent">
                    Your premium subscription fuels the research and development that keeps both
                    tiers cutting-edge.
                  </strong>
                  When you invest in the Academy, you're not just advancing your career—you're
                  supporting universal access to foundational knowledge for everyone.
                </p>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 p-6 rounded-lg mt-8">
                  <p className="font-semibold text-gray-900">
                    🌟 <strong>Our Promise:</strong> The Foundation (Math, Physics, Chemistry,
                    Biology, Geography, Aptitude) will always remain 100% free. Your success in our
                    paid courses helps keep it that way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl font-bold mb-6">Ready to Build Your Future?</h2>
                <p className="text-2xl mb-8">
                  Start with the foundation, or jump straight into career-ready skills
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link
                    href="#foundation"
                    className="inline-block bg-white text-green-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
                  >
                    Start Foundation
                  </Link>
                  <Link
                    href="#academy"
                    className="inline-block bg-gradient-to-r from-yellow-500 to-amber-600 border-2 border-yellow-400 text-gray-900 px-10 py-4 rounded-lg font-bold text-lg hover:from-yellow-400 hover:to-amber-500 transition"
                  >
                    Unlock Career Suite
                  </Link>
                </div>
                <p className="text-sm mt-4 opacity-90">
                  <strong>Career Suite Pro Pass:</strong> Subscribe to get all 6 Professional Apps
                  (AI, Developer, Govt Jobs, PR, Management, Finesse) + Advanced Certifications.{" "}
                  <Link href="/courses" className="underline hover:text-gray-200">
                    View pricing →
                  </Link>
                </p>
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
