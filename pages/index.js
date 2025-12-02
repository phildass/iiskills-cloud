import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center">
          <div className="flex-1 mb-10 md:mb-0 md:mr-10">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Indian Institute of Professional Skills Development
            </h1>
            <p className="mb-6 text-lg">
              Elevate your skills. Explore professional applications and enterprise solutions.
            </p>
            <Link href="/apps" className="inline-block bg-accent text-white px-7 py-3 rounded font-bold shadow hover:bg-primary transition">
              Explore Apps
            </Link>
          </div>
          <div className="flex-1 text-center">
            <Image src="/images/iiskills-logo.png" alt="Logo" width={175} height={175} />
          </div>
        </div>
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-accent mb-6">Featured Apps</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Replace with real apps */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-primary">SkillTracker</h3>
              <p>Track, assess, and certify professional skills for individuals and teams.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-primary">Learning Hub</h3>
              <p>Access courses, webinars, and resources for career advancement.</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-2 text-primary">JobConnect</h3>
              <p>Bridge the gap between skill development and job opportunities.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}