import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp } from "../../../components/shared/HeroManager";
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
    { name: "Learn Chemistry", iconImage: "mini-course-chemistry.svg", url: "https://learn-chemistry.iiskills.cloud" },
    { name: "Learn Geography", iconImage: "mini-course-geography.svg", url: "https://learn-geography.iiskills.cloud" },
    { name: "Learn Math", iconImage: "mini-course-math.svg", url: "https://learn-math.iiskills.cloud" },
    { name: "Learn Physics", iconImage: "mini-course-physics.svg", url: "https://learn-physics.iiskills.cloud" },
    { name: "Learn Aptitude", iconImage: "mini-course-aptitude.svg", url: "https://learn-apt.iiskills.cloud" },
  ];

  const paidCourses = [
    { name: "Learn PR", icon: "📢", url: "https://learn-pr.iiskills.cloud" },
    { name: "Learn AI", icon: "🤖", url: "https://learn-ai.iiskills.cloud" },
    { name: "Learn Management", icon: "📊", url: "https://learn-management.iiskills.cloud" },
    { name: "Learn Developer", icon: "💻", url: "https://learn-developer.iiskills.cloud" },
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
              Affordable professional skills • No barriers • Accessible online • Contributing to Viksit Bharat
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
                Start with <span className="text-green-600 font-bold">5 completely free courses</span> and build the foundation for your future success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {freeCourses.map((course, index) => (
                <a
                  key={course.name}
                  href={course.url}
                  className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-green-400 hover:border-green-600 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Hover Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  
                  {/* Free Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse">
                      ✨ FREE
                    </span>
                  </div>

                  <div className="flex justify-center mb-6 relative">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                      <Image
                        src={`/images/${course.iconImage}`}
                        alt={`${course.name} icon`}
                        width={120}
                        height={120}
                        className="rounded-full relative z-10 ring-4 ring-green-300 group-hover:ring-green-500 transition-all"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-600 transition-colors">
                    {course.name}
                  </h3>
                  
                  <div className="text-center mt-4">
                    <div className="inline-flex items-center gap-2 text-green-600 font-bold group-hover:gap-4 transition-all">
                      Start Now
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Call to Action Banner */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-center shadow-2xl">
              <p className="text-white text-xl md:text-2xl font-bold mb-4">
                🚀 Join <span className="text-yellow-300">thousands of learners</span> starting their journey with zero investment!
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
                Advance your career with <span className="text-orange-600 font-bold">4 expert-level courses</span> designed for industry success
              </p>
              <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl shadow-xl">
                <p className="text-xl font-bold">
                  💎 Special Bundle Deal: Buy 1 Course → Get Both AI & Developer Courses!
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {paidCourses.map((course, index) => (
                <a
                  key={course.name}
                  href={course.url}
                  className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-4 border-amber-400 hover:border-amber-600 relative overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-15 transition-opacity duration-300"></div>
                  
                  {/* Premium Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      PRO
                    </div>
                  </div>

                  <div className="text-6xl mb-6 text-center transform group-hover:scale-110 transition-transform duration-300">
                    {course.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-amber-600 transition-colors">
                    {course.name}
                  </h3>

                  {/* Feature Highlights */}
                  <div className="space-y-2 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Expert-level content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Industry certification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>Lifetime access</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold text-lg group-hover:from-amber-600 group-hover:to-orange-600 transition-all shadow-lg">
                      Enroll Now →
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Testimonial / Social Proof Section */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-10 text-white shadow-2xl mb-8">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">What Our Premium Members Say</h3>
                <div className="flex justify-center gap-1 text-yellow-300 text-3xl mb-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <p className="text-lg mb-4 italic">"The AI course transformed my career. Got promoted within 3 months!"</p>
                  <p className="font-bold">- Rajesh K., Software Engineer</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <p className="text-lg mb-4 italic">"Best investment in my professional development. Highly recommend!"</p>
                  <p className="font-bold">- Priya S., Manager</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <p className="text-lg mb-4 italic">"Practical, industry-relevant content. Worth every rupee!"</p>
                  <p className="font-bold">- Amit M., Developer</p>
                </div>
              </div>
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
                  Only {pricing.totalPrice} per course{pricing.isIntroductory ? ` • Limited Time Offer!` : ''}
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
                  To empower every Indian with professional skills and technology-led learning platforms
                  that enable career growth and personal development.
                </p>
                <p className="leading-relaxed">
                  We believe in democratizing education by making it affordable ({pricing.totalPrice} per course{pricing.isIntroductory ? `, introductory offer until ${pricing.introEndDate}` : ''}),
                  accessible online, and focused on immediately applicable skills.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">🌟 Contributing to Viksit Bharat</h3>
                <p className="leading-relaxed mb-4">
                  To contribute to <span className="font-bold">Viksit Bharat</span> (Developed India) by bridging the
                  skill gap and creating opportunities for millions of Indians to upgrade their
                  abilities and achieve their potential.
                </p>
                <p className="leading-relaxed">
                  We envision an India where quality education is a right, not a privilege, and where
                  every individual has the tools to succeed in the modern economy.
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
                  Quality education at just {pricing.totalPrice} per paid course. 5 courses are completely free. No hidden costs, no barriers.
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
                  Online platform accessible from anywhere in India. Learn in your language, at your own pace, on your schedule.
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
                  Immediately applicable professional skills designed for real career advancement and job market success.
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
                    src="/images/mini-value-integrity.svg"
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
                    src="/images/mini-value-innovation.svg"
                    alt="Innovation icon"
                    width={70}
                    height={70}
                  />
                  <h3 className="font-bold text-xl text-blue-600">Innovation & Lifelong Learning</h3>
                </div>
                <p className="text-gray-700">
                  We continuously evolve our content and methods to stay relevant in a rapidly
                  changing world.
                </p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src="/images/mini-value-diversity.svg"
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
                    src="/images/mini-value-collaboration.svg"
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
