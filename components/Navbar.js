import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white text-gray-800 px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center hover:opacity-90 transition gap-2">
          {/* AI Cloud Enterprises Logo */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image 
              src="/images/ai-cloud-logo.png" 
              alt="AI Cloud Enterprises Logo" 
              fill
              className="object-contain"
            />
          </div>
          {/* iiskills Logo */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image 
              src="/images/iiskills-logo.png" 
              alt="IISKILLS Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-xl text-gray-800">iiskills. cloud</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/" className="hover:text-primary transition">Home</Link>
          <Link href="/courses" className="hover:text-primary transition">Courses</Link>
          {/* Desktop Navigation */}
<div className="hidden md:flex space-x-6 font-medium items-center">
  <Link href="/" className="hover:text-primary transition">Home</Link>
  <Link href="/courses" className="hover:text-primary transition">Courses</Link>
  <Link href="/certification" className="hover:text-primary transition">Certification</Link>
  <Link href="/about" className="hover:text-primary transition">About</Link>
  <Link href="/testimonials" className="hover:text-primary transition">Testimonials</Link>
  <Link href="/blogs" className="hover:text-primary transition">Blog</Link>
  <Link href="/contact" className="hover:text-primary transition">Contact</Link>
</div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md: hidden text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4 space-y-3">
          <Link href="/" className="block hover:text-primary transition">Home</Link>
          <Link href="/courses" className="block hover:text-primary transition">Courses</Link>
          <Link href="/certification" className="block hover:text-primary transition">Certification</Link>
          <Link href="/about" className="block hover:text-primary transition">About</Link>
          <Link href="/testimonials" className="block hover:text-primary transition">Testimonials</Link>
          <Link href="/blogs" className="block hover:text-primary transition">Blog</Link>
          <Link href="/contact" className="block hover:text-primary transition">Contact</Link>
          <Link href="/admin/login" className="block bg-primary text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition text-center">
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}
