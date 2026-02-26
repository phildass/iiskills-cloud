/**
 * @deprecated Use packages/ui/src/navigation/SiteHeader.js (via @iiskills/ui/navigation) instead.
 * This legacy Navbar is not used by any deployed app; kept only for backward compatibility.
 */
import React, { useState } from 'react';
import Link from 'next/link';
import GoogleTranslate from './common/GoogleTranslate';

/**
 * Universal Navbar shared across all IISkills apps.
 * - Sticky white header with shadow (matches old site look/feel)
 * - Canonical nav links: Home, Courses, Certification, Newsletter, About, Terms, Login, Register
 * - Google Translate widget via canonical GoogleTranslate component (always visible)
 * - Mobile-responsive hamburger menu
 */
export function Navbar({ appName = 'IISkills' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/courses', label: 'Courses' },
    { href: '/certification', label: 'Certification' },
    { href: '/newsletter', label: 'Newsletter' },
    { href: '/about', label: 'About' },
    { href: '/terms', label: 'Terms' },
  ];

  const linkStyle = {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  };

  const btnStyle = {
    background: '#2563eb',
    color: '#fff',
    padding: '0.4rem 0.85rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: 600,
  };

  return (
    <nav
      style={{
        background: '#fff',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 9999,
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '56px',
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1e3a8a' }}>
            IISkills
          </span>
          {appName && appName !== 'IISkills' && (
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 400 }}>
              — {appName}
            </span>
          )}
        </Link>

        {/* Desktop nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="iiskills-desktop-nav"
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} style={linkStyle}>
              {link.label}
            </Link>
          ))}

          <Link href="/login" style={linkStyle}>
            Login
          </Link>
          <Link href="/register" style={btnStyle}>
            Register
          </Link>
        </div>

        {/* Right side: Google Translate (always visible) + Mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Google Translate widget – rendered once here, visible on both desktop and mobile */}
          <GoogleTranslate />

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
            className="iiskills-mobile-menu-btn"
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" fill="none" stroke="#374151" strokeWidth="2" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div
          style={{
            padding: '0.75rem 0 1rem',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
          className="iiskills-mobile-menu"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ ...linkStyle, display: 'block' }}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" style={{ ...linkStyle, display: 'block' }} onClick={() => setIsMenuOpen(false)}>
            Login
          </Link>
          <Link href="/register" style={{ ...btnStyle, display: 'inline-block', alignSelf: 'flex-start' }} onClick={() => setIsMenuOpen(false)}>
            Register
          </Link>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          .iiskills-desktop-nav { display: none !important; }
          .iiskills-mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
