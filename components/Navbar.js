<<<<<<< HEAD
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="bg-primary text-white px-6 py-3 flex justify-between items-center shadow">
      <div className="flex items-center">
        <Image src="/images/iiskills-logo.png" alt="IISKILLS Logo" width={40} height={40} className="mr-2"/>
        <span className="font-bold text-xl">IISKILLS CLOUD</span>
      </div>
      <div className="space-x-6 font-medium">
        <Link href="/">Home</Link>
        <Link href="/apps">Apps</Link>
        <Link href="/about">About</Link>
        <Link href="/testimonials">Testimonials</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
=======
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
>>>>>>> be03ef6dd2fd53272582227afc86125b1216bfcb
  )
}