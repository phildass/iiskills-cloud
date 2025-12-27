import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-6">Contact Us</h1>
        <form className="bg-white rounded shadow p-6 mb-8">
          <label className="block mb-2 font-semibold">Name</label>
          <input className="border p-2 rounded w-full mb-4" type="text" placeholder="Your Name" required />
          <label className="block mb-2 font-semibold">Email</label>
          <input className="border p-2 rounded w-full mb-4" type="email" placeholder="Your Email" required />
          <label className="block mb-2 font-semibold">Message</label>
          <textarea className="border p-2 rounded w-full mb-4" rows={5} placeholder="Your Message" required></textarea>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded font-bold w-full">Send Message</button>
        </form>
        <div>
          <h2 className="text-lg font-bold mb-2">Company Info</h2>
          <p>Email: info@iiskills.cloud</p>
          <p>Address: Indiranagar, Bengaluru</p>
        </div>
      </main>
      <Footer />
    </>
  )
}