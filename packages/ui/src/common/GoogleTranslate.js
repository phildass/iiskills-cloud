"use client"; // This component uses React hooks and browser APIs

import { useEffect, useState } from "react";

/**
 * Google Translate Widget Component
 * 
 * Provides multi-language translation support across all iiskills learning apps.
 * Supports 12 major Indian languages plus English.
 * 
 * Supported Languages:
 * - Hindi (hi) - 528M speakers
 * - Tamil (ta) - 79M speakers
 * - Telugu (te) - 95M speakers
 * - Bengali (bn) - 97M speakers
 * - Marathi (mr) - 83M speakers
 * - Gujarati (gu) - 56M speakers
 * - Kannada (kn) - 44M speakers
 * - Malayalam (ml) - 38M speakers
 * - Punjabi (pa) - 33M speakers
 * - Odia (or) - 38M speakers
 * - Assamese (as) - 15M speakers
 * - Urdu (ur) - 51M speakers
 * 
 * Usage: <GoogleTranslate />
 * 
 * The widget automatically saves user language preference in cookies.
 */
export default function GoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Prevent loading script multiple times
    if (window.google?.translate?.TranslateElement || document.getElementById('google-translate-script')) {
      // Check if TranslateElement is actually available
      if (window.google?.translate?.TranslateElement) {
        setIsLoaded(true);
      }
      return;
    }

    // Define the initialization function globally
    window.googleTranslateElementInit = function() {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'hi,ta,te,bn,mr,gu,kn,ml,pa,or,as,ur',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          },
          'google_translate_element'
        );
        setIsLoaded(true);
      }
    };

    // Add Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.warn('Google Translate failed to load');
      setIsLoaded(false);
    };
    
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      // Note: We don't remove the script on unmount as it's meant to persist
      // across navigation within the app
    };
  }, []);

  return (
    <div className="google-translate-wrapper">
      {/* Translation Widget Container */}
      <div 
        id="google_translate_element"
        className="inline-flex items-center"
        aria-label="Language Selector"
      />
      
      {/* Bilingual Label for discoverability */}
      <style jsx global>{`
        /* Google Translate Custom Styling */
        .google-translate-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Hide Google branding banner */
        .goog-te-banner-frame {
          display: none !important;
        }

        /* Prevent Google bar from pushing content down */
        body {
          top: 0 !important;
          position: static !important;
        }

        /* Style the translate gadget */
        .goog-te-gadget {
          font-family: inherit !important;
          font-size: 0.875rem !important;
          color: inherit !important;
        }

        /* Style the dropdown select */
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 0.375rem !important;
          padding: 0.5rem 0.75rem !important;
          font-size: 0.875rem !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
        }

        .goog-te-gadget-simple:hover {
          border-color: #0052cc !important;
          background-color: #f8f9fa !important;
        }

        /* Style the dropdown icon */
        .goog-te-gadget-icon {
          margin-right: 0.25rem !important;
        }

        /* Hide "Powered by Google" text but keep functionality */
        /* Note: This hides only the redundant text in the dropdown button itself.
           Google's attribution requirements are met through the visible 
           translate.google.com domain in the iframe that appears during translation. */
        .goog-te-gadget-simple .goog-te-menu-value span:first-child {
          display: none;
        }

        /* Mobile responsiveness */
        @media (max-width: 640px) {
          .goog-te-gadget-simple {
            padding: 0.375rem 0.5rem !important;
            font-size: 0.8125rem !important;
          }
        }

        /* Ensure dropdown menu appears properly */
        .goog-te-menu-frame {
          max-height: 400px !important;
          overflow-y: auto !important;
        }

        /* Style the language options in dropdown */
        .goog-te-menu2 {
          max-width: 100% !important;
        }

        .goog-te-menu2-item div,
        .goog-te-menu2-item:link div,
        .goog-te-menu2-item:visited div,
        .goog-te-menu2-item:active div {
          color: #1f2937 !important;
          font-family: inherit !important;
        }

        .goog-te-menu2-item-selected {
          background-color: #0052cc !important;
        }

        .goog-te-menu2-item-selected div {
          color: white !important;
        }
      `}</style>
    </div>
  );
}
