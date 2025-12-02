import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TestimonialCard from '../components/TestimonialCard'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Amit B.",
      text: "IISKILLS helped our team gain critical certifications and connect with new opportunities.",
      org: "Acme Corp"
    },
    {
      name: "Neha S.",
      text: "Professional, supportive, and results-driven. Highly recommend IISKILLS for skill development.",
      org: ""
    }
  ]
  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-8">Testimonials</h1>
        {testimonials.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </main>
      <Footer />
    </>
  )
}