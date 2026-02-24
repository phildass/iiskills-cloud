import React, { useEffect } from 'react';
import Link from 'next/link';

/**
 * Universal Navbar shared across all IISkills apps.
 * Includes a Google Translate hook/placeholder for client-side language switching.
 */
export function Navbar({ appName = 'IISkills' }) {
  // Google Translate integration hook
  // When NEXT_PUBLIC_GOOGLE_TRANSLATE_ENABLED=true, this loads the Google Translate widget.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_ENABLED !== 'true') return;
    // Load Google Translate script
    const script = document.createElement('script');
    script.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        { pageLanguage: 'en', layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
        'google_translate_element'
      );
    };
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <nav style={{ background: '#1a1a2e', color: '#fff', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>
          IISkills — {appName}
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#ccc', textDecoration: 'none' }}>Home</Link>
        <Link href="/courses" style={{ color: '#ccc', textDecoration: 'none' }}>Courses</Link>
        <Link href="/admin" style={{ color: '#ccc', textDecoration: 'none' }}>Admin</Link>
        {/* Google Translate widget placeholder */}
        <div id="google_translate_element" style={{ minWidth: '80px' }} />
      </div>
    </nav>
  );
}
