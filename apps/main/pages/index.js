import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp } from "../../../packages/shared-components/HeroManager";
import { getPricingDisplay } from "../utils/pricing";
import { UniversalInstallPrompt } from "@iiskills/ui";

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

  const pricing = getPricingDisplay();

  // Course data: 5 free, 4 paid
  const freeCourses = [
    {
      name: "Learn Physics",
      tagline: "Master forces, energy & the universe",
      image: "/images/iiskills-main1.jpg",
      url: "https://learn-physics.iiskills.cloud",
    },
    {
      name: "Learn Math",
      tagline: "Build strong problem-solving foundations",
      image: "/images/iiskills-main2.jpg",
      url: "https://learn-math.iiskills.cloud",
    },
    {
      name: "Learn Chemistry",
      tagline: "Explore reactions, elements & bonds",
      image: "/images/iiskills-main3.jpg",
      url: "https://learn-chemistry.iiskills.cloud",
    },
    {
      name: "Learn Geography",
      tagline: "Discover our world, its lands & people",
      image: "/images/iiskills-main4.jpg",
      url: "https://learn-geography.iiskills.cloud",
    },
    {
      name: "Learn Aptitude",
      tagline: "Sharpen your competitive exam skills",
      image: "/images/iiskills-main5.jpg",
      url: "https://learn-apt.iiskills.cloud",
    },
  ];

  const paidCourses = [
    {
      name: "Learn PR",
      tagline: "Excel in public relations & communications",
      image: "/images/iiskills-main6.jpg",
      url: "https://learn-pr.iiskills.cloud",
    },
    {
      name: "Learn AI",
      tagline: "Build AI-powered apps & solutions",
      image: "/images/iiskills-main7.jpg",
      url: "https://learn-ai.iiskills.cloud",
    },
    {
      name: "Learn Management",
      tagline: "Lead teams and drive business results",
      image: "/images/iiskills-main8.jpg",
      url: "https://learn-management.iiskills.cloud",
    },
    {
      name: "Learn Developer",
      tagline: "Code full-stack web applications",
      image: "/images/iiskills-main9.jpg",
      url: "https://learn-developer.iiskills.cloud",
    },
  ];

  return (
    <>
      <Head>
        <title>iiskills.cloud - Democratizing Education for Viksit Bharat</title>
        <meta
          name="description"
          content="Affordable professional skills education platform for all Indians. Contributing to Viksit Bharat with 9 courses (5 free, 4 paid). No barriers, accessible online, focused on career growth."
        />
      </Head>
      <main>
        {/* HERO SECTION - Corrections 16.2.26: Blue font color, repositioned heading */}
        <Hero appId="main" className="h-[70vh] md:h-[80vh] lg:h-[90vh]" noOverlay>
          <div className="text-center text-blue-600 space-y-6 max-w-5xl mx-auto mt-20">
            <h1 className="text-5xl sm:text-5xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
              Democratizing Education for Every Indian
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4 drop-shadow-md">
              Affordable professional skills • No barriers • Accessible online • Contributing to
              Viksit Bharat
            </p>
            <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 drop-shadow-md">
              9 Courses Available | 5 Free | 4 Paid (Only {pricing.totalPrice})
            </p>
          </div>
        </Hero>

        {/* CTA Buttons Below Hero */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
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
                Login
              </Link>
              <Link
                href="/apps-dashboard"
                className="inline-block bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition-all duration-200 text-center text-base sm:text-lg min-w-[240px] shadow-lg"
              >
                📱 Browse All Apps
              </Link>
            </div>

            {/* Install App Prompt */}
            <div className="mt-6 flex justify-center">
              <UniversalInstallPrompt
                currentAppId="main"
                currentAppName="iiskills.cloud"
                variant="button"
                size="lg"
                showMotherAppPromo={false}
              />
            </div>
          </div>
        </section>

        {/* FREE COURSES SECTION - Redesigned for Visual Appeal */}
        <section className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                  🎉 100% Free • No Credit Card Required
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-6">
                Launch Your Learning Journey Today!
              </h2>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
                Start with{" "}
                <span className="text-green-600 font-bold">5 completely free courses</span> and
                build the foundation for your future success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {freeCourses.map((course) => (
                <div
                  key={course.name}
                  className="bg-white rounded-2xl shadow-xl border-2 border-green-200 relative overflow-hidden flex flex-col"
                >
                  {/* Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={course.image}
                      alt={`${course.tagline} – ${course.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Free Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✨ FREE
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                    <p className="text-gray-500 text-sm flex-1">{course.tagline}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center shadow-2xl">
              <p className="text-white text-xl md:text-2xl font-bold mb-4">
                🚀 Join <span className="text-yellow-300">thousands of learners</span> starting
                their journey with zero investment!
              </p>
              <p className="text-green-100 text-lg">
                No hidden costs • Lifetime access • Learn at your own pace
              </p>
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 1 */}
        {randomImage1 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/${randomImage1}`}
              alt="iiskills.cloud Learning Platform"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* PAID COURSES SECTION - Premium Redesign */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-20 right-10 w-40 h-40 bg-amber-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg animate-pulse">
                  ⭐ Premium Collection
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 mb-6">
                Unlock Professional Mastery
              </h2>
              <p className="text-2xl text-gray-700 max-w-3xl mx-auto font-medium mb-6">
                Advance your career with{" "}
                <span className="text-orange-600 font-bold">4 expert-level courses</span> designed
                for industry success
              </p>
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl">
                <p className="text-xl font-bold">
                  💎 Special Bundle Deal: Buy 1 Course → Get Both AI & Developer Courses!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {paidCourses.map((course) => (
                <div
                  key={course.name}
                  className="bg-white rounded-2xl shadow-xl border-2 border-amber-200 relative overflow-hidden flex flex-col"
                >
                  {/* Image Banner */}
                  <div className="relative h-44 w-full overflow-hidden rounded-t-2xl">
                    <Image
                      src={course.image}
                      alt={`${course.tagline} – ${course.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {/* PRO Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        PRO
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h3>
                    <p className="text-gray-500 text-sm mb-4 flex-1">{course.tagline}</p>

                    {/* Feature Highlights */}
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Expert-level content</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5 text-green-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Lifetime access</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Strong CTA */}
            <div className="text-center bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-10 shadow-2xl">
              <h3 className="text-white text-3xl md:text-4xl font-extrabold mb-4">
                🎯 Ready to Level Up Your Career?
              </h3>
              <p className="text-orange-100 text-xl mb-6 max-w-2xl mx-auto">
                Join thousands of professionals advancing their skills with our premium courses
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a
                  href="/register"
                  className="bg-white text-orange-600 px-10 py-4 rounded-xl font-bold text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Get Started Today
                </a>
                <p className="text-white font-semibold text-lg">
                  Only {pricing.totalPrice} per course
                  {pricing.isIntroductory ? " • Inaugural Offer!" : ""}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 2 */}
        {randomImage2 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/${randomImage2}`}
              alt="iiskills.cloud Professional Development"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* VIKSIT BHARAT VISION SECTION */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                🌟 Our Vision for Viksit Bharat
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">🎯 Our Mission</h3>
                <p className="leading-relaxed mb-4">
                  To empower every Indian with professional skills and technology-led learning
                  platforms that enable career growth and personal development.
                </p>
                <p className="leading-relaxed">
                  We believe in democratizing education by making it affordable (
                  {pricing.totalPrice} per course
                  {pricing.isIntroductory
                    ? `, inaugural offer valid from March 21, 2026 to April 20, 2026`
                    : ""}
                  ), accessible online, and focused on immediately applicable skills.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">🌟 Contributing to Viksit Bharat</h3>
                <p className="leading-relaxed mb-4">
                  To contribute to <span className="font-bold">Viksit Bharat</span> (Developed
                  India) by bridging the skill gap and creating opportunities for millions of
                  Indians to upgrade their abilities and achieve their potential.
                </p>
                <p className="leading-relaxed">
                  We envision an India where quality education is a right, not a privilege, and
                  where every individual has the tools to succeed in the modern economy.
                </p>
              </div>
            </div>

            {/* Large inspiring image for Vision section */}
            <div className="relative h-[350px] md:h-[450px] overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/iiskills-main2.jpg"
                alt="Diverse team of professionals representing Viksit Bharat vision"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          </div>
        </section>

        {/* WHY IISKILLS.CLOUD SECTION */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Why Choose iiskills.cloud?
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/mini-feature-affordable.svg"
                    alt="Affordable education icon"
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Affordable Education</h3>
                <p className="text-gray-700">
                  Quality education at just {pricing.totalPrice} per paid course. 5 courses are
                  completely free. No hidden costs, no barriers.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/mini-feature-accessible.svg"
                    alt="Accessible to all icon"
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Accessible to All Indians</h3>
                <p className="text-gray-700">
                  Online platform accessible from anywhere in India. Learn in your language, at your
                  own pace, on your schedule.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/images/mini-feature-career.svg"
                    alt="Career-focused skills icon"
                    width={80}
                    height={80}
                  />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Career-Focused Skills</h3>
                <p className="text-gray-700">
                  Immediately applicable professional skills designed for real career advancement
                  and job market success.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LARGE IMAGE ACCENT 3 - Learning Environment - Fixed cropping */}
        <section className="relative h-[350px] md:h-[450px] overflow-hidden">
          <Image
            src="/images/focused-young-employees-waiting-meeting-beginning.jpg"
            alt="Young professionals in learning environment"
            fill
            className="object-contain bg-gray-100"
            sizes="100vw"
            priority={false}
          />
        </section>

        {/* CORE VALUES SECTION */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">💎 Our Core Values</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/value-integrity.svg"
                    alt="Integrity icon"
                    width={70}
                    height={70}
                  />
                  <h3 className="font-bold text-xl text-blue-600">Integrity & Excellence</h3>
                </div>
                <p className="text-gray-700">
                  We maintain the highest standards in education delivery and never compromise on
                  quality, even at affordable prices.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/value-innovation.svg"
                    alt="Innovation icon"
                    width={70}
                    height={70}
                  />
                  <h3 className="font-bold text-xl text-blue-600">
                    Innovation & Lifelong Learning
                  </h3>
                </div>
                <p className="text-gray-700">
                  We continuously evolve our content and methods to stay relevant in a rapidly
                  changing world.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/value-diversity.svg"
                    alt="Diversity icon"
                    width={70}
                    height={70}
                  />
                  <h3 className="font-bold text-xl text-blue-600">Diversity & Inclusion</h3>
                </div>
                <p className="text-gray-700">
                  We celebrate India's diversity and ensure our platform is accessible to learners
                  from all backgrounds and regions.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/value-collaboration.svg"
                    alt="Collaboration icon"
                    width={70}
                    height={70}
                  />
                  <h3 className="font-bold text-xl text-blue-600">Collaboration & Community</h3>
                </div>
                <p className="text-gray-700">
                  We build a supportive learning community where students help each other grow and
                  succeed together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LARGE IMAGE ACCENT 4 - Diverse Community */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src="/images/iiskills-main3.jpg"
            alt="Diverse community of learners collaborating"
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </section>
      </main>
    </>
  );
}
