import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function About() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-4">About Us</h1>
        <p className="mb-6">
          IISKILLS Cloud is the digital gateway for the Indian Institute of Professional Skills Development. Our mission: foster career advancement and skill certification for India’s workforce and enterprises. With expert teams, innovative technology, and a commitment to excellence, we empower learners, professionals, and organizations to thrive.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Our Mission</h2>
            <p>Empower professionals with certified skills and technology-led learning platforms.</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-primary mb-2">Our Values</h2>
            <ul className="list-disc ml-5">
              <li>Integrity & Excellence</li>
              <li>Innovation & Lifelong Learning</li>
              <li>Diversity & Inclusion</li>
              <li>Collaboration</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}