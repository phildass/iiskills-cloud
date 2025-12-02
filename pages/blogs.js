import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function Blog() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-accent mb-6">Latest News & Updates</h1>
        <p className="mb-6">Our blog is coming soon. Stay tuned for updates, news, and professional insights!</p>
      </main>
      <Footer />
    </>
  )
}