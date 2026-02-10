import Head from "next/head";
import Image from "next/image";
import Hero from "../../../components/shared/HeroManager";

export default function Solutions() {
  return (
    <>
      <Head>
        <title>Solutions - iiskills.cloud</title>
        <meta
          name="description"
          content="Discover our tailored solutions for every industry. Scalable platforms, mobile apps, and web applications designed for businesses of every sector."
        />
      </Head>

      {/* Hero Section */}
      <Hero appId="main" className="h-[60vh] md:h-[70vh]">
        <div className="text-center text-white space-y-4 max-w-5xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            Solutions for Every Industry
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto px-4">
            Empowering organizations to thrive in the digital era
          </p>
        </div>
      </Hero>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sector Focus Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sector Focus
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                From healthcare to education, our apps are precisely tailored to address the unique 
                challenges of each industry. We empower organizations to thrive in the digital era—delivering 
                seamless, effective solutions for businesses of every sector.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/group-business-executives-smiling-camera.jpg"
                alt="Business executives collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Scalable Solutions Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl order-2 md:order-1">
              <Image
                src="/images/businessman-using-application.jpg"
                alt="Businessman using digital application"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Scalable Solutions
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our subscription-based platforms grow with your business, ensuring seamless digital 
                experiences for both mass and niche audiences.
              </p>
            </div>
          </div>
        </section>

        {/* Mobile Apps Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Mobile Apps
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Smart mobile solutions that bring India's digital future right to your fingertips.
              </p>
            </div>
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/images/portrait-young-man-using-his-laptop-using-his-mobile-phone-while-sitting-coffee-shop.jpg"
                alt="Young professional using mobile phone and laptop"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        {/* Web Apps Section */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 rounded-xl overflow-hidden shadow-2xl order-2 md:order-1">
              <Image
                src="/images/group-business-executives-using-digital-tablet-mobile-pho.jpg"
                alt="Business team using digital devices"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Web Apps
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Robust, scalable web applications designed for broad and niche audiences alike.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Discover how our solutions can help your organization thrive in the digital era.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-200"
            >
              Contact Us
            </a>
            <a
              href="/courses"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-200"
            >
              Explore Courses
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
