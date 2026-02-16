import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp } from "../../../components/shared/HeroManager";
import { getPricingDisplay } from "../utils/pricing";

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
    { name: "Learn Chemistry", icon: "🧪", iconImage: "mini-course-chemistry.svg", url: "https://app7.learn-chemistry.iiskills.cloud" },
    { name: "Learn Geography", icon: "🌍", iconImage: "mini-course-geography.svg", url: "https://app9.learn-geography.iiskills.cloud" },
    { name: "Learn Math", icon: "📐", iconImage: "mini-course-math.svg", url: "https://app8.learn-math.iiskills.cloud" },
    { name: "Learn Physics", icon: "⚛️", iconImage: "mini-course-physics.svg", url: "https://app6.learn-physics.iiskills.cloud" },
    { name: "Learn Aptitude", icon: "🧠", iconImage: "mini-course-aptitude.svg", url: "https://app5.learn-apt.iiskills.cloud" },
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
                  <div className="flex justify-center mb-4">
                    <Image
                      src={`/images/${course.iconImage}`}
                      alt={`${course.name} icon`}
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </div>
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
              src={`/images/${randomImage1}`}
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
                src="/images/group-business-executives-smiling-camera.jpg"
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

        {/* LARGE IMAGE ACCENT 3 - Learning Environment */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src="/images/focused-young-employees-waiting-meeting-beginning.jpg"
            alt="Young professionals in learning environment"
            fill
            className="object-cover"
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
            src="/images/multiracial-friends-using-smartphone-against-wall-university-college-backyard-young-people.jpg"
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
