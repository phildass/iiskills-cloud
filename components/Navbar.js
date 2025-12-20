import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-primary text-white px-6 py-3 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center hover:opacity-90 transition">
          <Image src="/images/iiskills-logo.png" alt="IISKILLS Logo" width={40} height={40} className="mr-2"/>
          <span className="font-bold text-xl">iiskills.cloud</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          <Link href="/" className="hover:text-gray-200 transition">Home</Link>
          <Link href="/courses" className="hover:text-gray-200 transition">Courses</Link>
          <Link href="/certification" className="hover:text-gray-200 transition">Certification</Link>
          <Link href="/about" className="hover:text-gray-200 transition">About</Link>
          <Link href="/testimonials" className="hover:text-gray-200 transition">Testimonials</Link>
          <Link href="/blogs" className="hover:text-gray-200 transition">Blog</Link>
          <Link href="/contact" className="hover:text-gray-200 transition">Contact</Link>
          <Link href="/admin/login" className="bg-white text-primary px-4 py-2 rounded font-bold hover:bg-gray-100 transition">
            Admin
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white focus:outline-none"
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
          <Link href="/" className="block hover:text-gray-200 transition">Home</Link>
          <Link href="/courses" className="block hover:text-gray-200 transition">Courses</Link>
          <Link href="/certification" className="block hover:text-gray-200 transition">Certification</Link>
          <Link href="/about" className="block hover:text-gray-200 transition">About</Link>
          <Link href="/testimonials" className="block hover:text-gray-200 transition">Testimonials</Link>
          <Link href="/blogs" className="block hover:text-gray-200 transition">Blog</Link>
          <Link href="/contact" className="block hover:text-gray-200 transition">Contact</Link>
          <Link href="/admin/login" className="block bg-white text-primary px-4 py-2 rounded font-bold hover:bg-gray-100 transition text-center">
            Admin
          </Link>
        </div>
      )}
    </nav>
  )
}