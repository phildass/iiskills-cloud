import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp } from "../../../components/shared/HeroManager";

export default function Home() {
  const [randomImage1, setRandomImage1] = useState("");
  const [randomImage2, setRandomImage2] = useState("");

  useEffect(() => {
    // Set random images for the page
    const images = getHeroImagesForApp("main").slice(1);
    const shuffled = [...images];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setRandomImage1(shuffled[0] || images[0]);
    setRandomImage2(shuffled[1] || images[1] || images[0]);
  }, []);

  // Course data: 5 free, 4 paid
  const freeCourses = [
    { name: "Learn Chemistry", icon: "🧪", url: "https://app7.learn-chemistry.iiskills.cloud" },
    { name: "Learn Geography", icon: "🌍", url: "https://app9.learn-geography.iiskills.cloud" },
    { name: "Learn Math", icon: "📐", url: "https://app8.learn-math.iiskills.cloud" },
    { name: "Learn Physics", icon: "⚛️", url: "https://app6.learn-physics.iiskills.cloud" },
    { name: "Learn Aptitude", icon: "🧠", url: "https://app5.learn-apt.iiskills.cloud" },
  ];

  const paidCourses = [
    { name: "Learn PR", icon: "📢", url: "https://app3.learn-pr.iiskills.cloud" },
    { name: "Learn AI", icon: "🤖", url: "https://app1.learn-ai.iiskills.cloud" },
    { name: "Learn Management", icon: "📊", url: "https://app2.learn-management.iiskills.cloud" },
    { name: "Learn Developer", icon: "💻", url: "https://app4.learn-developer.iiskills.cloud" },
  ];

  return (
    <>
      <Head>
        <title>iiskills.cloud - Master Professional Skills</title>
        <meta
          name="description"
          content="iiskills.cloud - Professional learning platform with 9 courses (5 free, 4 paid). Master AI, Development, Management, PR, Chemistry, Physics, Math, Geography, and Aptitude."
        />
      </Head>
      <main>
        {/* HERO SECTION */}
        <Hero appId="main" className="h-[70vh] md:h-[80vh] lg:h-[90vh]" noOverlay>
          <div className="text-center text-blue-600 space-y-6 max-w-5xl mx-auto mt-20">
            <h1 className="text-5xl sm:text-5xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
              Master Professional Skills with iiskills.cloud
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4 drop-shadow-md">
              India's premier online learning platform. Courses available now: 9 | Five Free | Four Paid
            </p>
          </div>
        </Hero>

        {/* CTA Buttons Below Hero */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg min-w-[240px]"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 text-center text-base sm:text-lg min-w-[240px] shadow-lg"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* FREE COURSES SECTION */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-green-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Free Courses
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Start learning today with our 5 free courses - no payment required!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {freeCourses.map((course) => (
                <a
                  key={course.name}
                  href={course.url}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-green-500"
                >
                  <div className="text-5xl mb-4 text-center">{course.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{course.name}</h3>
                  <div className="text-center">
                    <span className="inline-block bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      FREE
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 1 */}
        {randomImage1 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/iiskills-main-wm1.jpg`}
              alt="iiskills.cloud Learning Platform"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* PAID COURSES SECTION */}
        <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Premium Courses
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                Unlock professional mastery with our 4 premium courses
              </p>
              <p className="text-lg text-blue-600 font-semibold mt-4">
                💡 Special Offer: Buy Learn AI OR Learn Developer → Get BOTH courses!
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {paidCourses.map((course) => (
                <a
                  key={course.name}
                  href={course.url}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border-2 border-orange-500"
                >
                  <div className="text-5xl mb-4 text-center">{course.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">{course.name}</h3>
                  <div className="text-center">
                    <span className="inline-block bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      PAID
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 2 */}
        {randomImage2 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/iiskills-main.1.jpg`}
              alt="iiskills.cloud Professional Development"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* FEATURES SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose iiskills.cloud?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Professional Quality</h3>
                <p className="text-gray-700">
                  Industry-leading courses designed by experts to help you master real-world skills.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Comprehensive Curriculum</h3>
                <p className="text-gray-700">
                  From foundational concepts to advanced topics, our courses cover everything you need.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Learn at Your Pace</h3>
                <p className="text-gray-700">
                  Self-paced learning with lifetime access to course materials and updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
