"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface CustomLink {
  href: string;
  label: string;
  className?: string;
  mobileClassName?: string;
  target?: string;
  rel?: string;
}

interface SharedNavbarProps {
  user?: User | null;
  onLogout?: () => Promise<void> | void;
  appName?: string;
  homeUrl?: string;
  showAuthButtons?: boolean;
  customLinks?: CustomLink[];
}

/**
 * Shared Navigation Bar Component
 * 
 * This component is designed to be used across multiple iiskills applications
 * (main app, learn-apt, etc.) and displays both the iiskills and AI Cloud Enterprise logos.
 */
export default function SharedNavbar({ 
  user = null, 
  onLogout,
  appName = 'iiskills.cloud',
  homeUrl = '/',
  showAuthButtons = true,
  customLinks = []
}: SharedNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <nav className="bg-white text-gray-800 px-6 py-3 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link href={homeUrl} className="flex items-center hover:opacity-90 transition gap-3">
          {/* AI Cloud Enterprises Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image 
                src="/images/ai-cloud-logo.png" 
                alt="AI Cloud Enterprises Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[8px] text-gray-600 text-center leading-tight mt-0.5">
              AI Cloud<br/>Enterprises
            </span>
          </div>
          
          {/* iiskills Logo */}
          <div className="flex flex-col items-center">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image 
                src="/images/iiskills-logo.png" 
                alt="IISKILLS Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-[7px] text-gray-600 text-center leading-tight mt-0.5 max-w-[60px]">
              Indian Institute of Professional Skills Development
            </span>
          </div>
          
          <span className="font-bold text-xl text-gray-800 ml-2">{appName}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 font-medium items-center">
          {customLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href} 
              className={link.className || "hover:text-primary transition"}
              target={link.target}
              rel={link.rel}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Show Sign In/Register or User Info based on authentication */}
          {showAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <span className="text-sm text-gray-600">
                    {user.email || 'User'}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/admin" className="hover:text-primary transition">Sign In</Link>
                  <Link href="/admin" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold">
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-800 focus:outline-none"
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
          {customLinks.map((link, index) => (
            <Link 
              key={index} 
              href={link.href} 
              className={link.mobileClassName || "block hover:text-primary transition"}
              target={link.target}
              rel={link.rel}
            >
              {link.label}
            </Link>
          ))}
          
          {/* Show Sign In/Register or User Info based on authentication */}
          {showAuthButtons && (
            <>
              {user ? (
                // User is logged in - show email and logout button
                <>
                  <div className="text-sm text-gray-600 px-4 py-2">
                    {user.email || 'User'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // User is not logged in - show sign in and register
                <>
                  <Link href="/admin" className="block hover:text-primary transition">Sign In</Link>
                  <Link href="/admin" className="block bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition font-bold">
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
