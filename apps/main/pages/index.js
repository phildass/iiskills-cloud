import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { useState, useEffect } from "react";
import Hero, { getHeroImagesForApp } from "../../../components/shared/HeroManager";

export default function Home() {
  const [randomImage1, setRandomImage1] = useState("");
  const [randomImage2, setRandomImage2] = useState("");
  const [randomImage3, setRandomImage3] = useState("");
  const [randomImage4, setRandomImage4] = useState("");

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
    setRandomImage3(shuffled[2] || images[2] || images[0]);
    setRandomImage4(shuffled[3] || images[3] || images[0]);
  }, []);

  return (
    <>
      <Head>
        <title>AI Cloud Enterprises - Services that touch every Indian</title>
        <meta
          name="description"
          content="AI Cloud Enterprises delivers SaaS-enabled training and digital applications for every sector in India. From healthcare to education, our scalable solutions empower organizations to thrive in the digital era."
        />
      </Head>
      <main>
        {/* HERO SECTION */}
        <Hero appId="main" className="h-[70vh] md:h-[80vh] lg:h-[90vh]" noOverlay>
          <div className="text-center text-white space-y-6 max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight drop-shadow-lg">
              AI Cloud Enterprises: Services that touch every Indian.
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto px-4 drop-shadow-md">
              SaaS-enabled training and digital applications designed for universal reach. From mass
              audiences to niche sectors, we deliver seamless solutions that empower every
              organization to thrive in India's digital future.
            </p>
          </div>
        </Hero>

        {/* CTA Buttons Below Hero */}
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/solutions"
                className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-blue-50 hover:shadow-xl transition-all duration-200 text-center text-base sm:text-lg min-w-[240px]"
              >
                Explore Our Solutions
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all duration-200 text-center text-base sm:text-lg min-w-[240px] shadow-lg"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* SECTOR SOLUTIONS OVERVIEW */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Tailored Solutions for Every Sector
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                From healthcare to education, our apps are precisely tailored to address the unique
                challenges of each industry.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Sector Focus */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Sector Focus</h3>
                <p className="text-gray-700">
                  Industry-specific solutions that address real challenges and deliver measurable
                  results across healthcare, education, finance, and more.
                </p>
              </div>

              {/* Scalable Platforms */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Scalable Solutions</h3>
                <p className="text-gray-700">
                  Subscription-based platforms that grow with your business, ensuring seamless
                  digital experiences for both mass and niche audiences.
                </p>
              </div>

              {/* Mobile & Web Apps */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Mobile & Web Apps</h3>
                <p className="text-gray-700">
                  Smart mobile solutions and robust web applications that bring India's digital
                  future to your fingertips.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 1 */}
        {randomImage1 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/${randomImage1}`}
              alt="AI Cloud Enterprises Solutions"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* SAAS-ENABLED TRAINING */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  SaaS-Enabled Training Solutions
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Our cloud-based training platform delivers professional development at scale.
                  Organizations can upskill their workforce with cutting-edge content, powered by
                  advanced learning management and analytics.
                </p>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  With subscription access to specialized content across AI, technology, management,
                  and more, we enable continuous learning that drives real business outcomes.
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                  <p className="text-blue-900 font-semibold">
                    💡 Powered by iiskills.cloud infrastructure - one of our comprehensive digital
                    solutions
                  </p>
                </div>
              </div>
              <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
                {randomImage2 && (
                  <Image
                    src={`/images/${randomImage2}`}
                    alt="Professional training solutions"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* DIGITAL APPS FOR INDIA */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl order-2 lg:order-1">
                {randomImage3 && (
                  <Image
                    src={`/images/${randomImage3}`}
                    alt="Digital applications for every Indian"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                )}
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Digital Apps for Every Indian
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  We build applications that serve India's diverse population - from urban
                  professionals to rural communities. Our solutions are designed for accessibility,
                  scalability, and impact.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Universal Reach</h4>
                      <p className="text-gray-600">
                        Solutions designed for mass adoption across all demographics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Niche Capabilities</h4>
                      <p className="text-gray-600">
                        Specialized features for specific industry requirements
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Cloud Infrastructure</h4>
                      <p className="text-gray-600">
                        Reliable, secure, and scalable platform architecture
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE ACCENT 2 */}
        {randomImage4 && (
          <section className="relative h-[400px] md:h-[500px] overflow-hidden">
            <Image
              src={`/images/${randomImage4}`}
              alt="AI Cloud Enterprises Innovation"
              fill
              className="object-cover"
              sizes="100vw"
              priority={false}
            />
          </section>
        )}

        {/* OUR APPROACH */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Approach</h2>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                We combine cutting-edge technology with deep understanding of India's unique
                challenges
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-xl font-bold mb-2">Industry Focus</h3>
                <p className="text-sm opacity-90">Tailored solutions for specific sector needs</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">⚡</div>
                <h3 className="text-xl font-bold mb-2">Rapid Deployment</h3>
                <p className="text-sm opacity-90">Quick implementation and time-to-value</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-sm opacity-90">Bank-grade security and data protection</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-xl font-bold mb-2">Analytics & Insights</h3>
                <p className="text-sm opacity-90">Data-driven decision making capabilities</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Transform Your Organization
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Discover how AI Cloud Enterprises can help you deliver seamless digital experiences
              and drive growth in the digital era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/solutions"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-lg font-bold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-xl"
              >
                View Our Solutions
              </Link>
              <Link
                href="/contact"
                className="inline-block bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-200"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
