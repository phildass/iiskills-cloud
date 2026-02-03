"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * SharedHero Component
 * 
 * A reusable hero component for landing pages across all iiskills apps.
 * This component provides:
 * - Full-width hero background image
 * - Deterministic image selection based on appName
 * - Responsive height settings (520px desktop, smaller on mobile)
 * - Dark overlay for text readability
 * - Positioned content area
 * 
 * Usage:
 *   <SharedHero appName="learn-cricket">
 *     <h1>Your Hero Content</h1>
 *   </SharedHero>
 * 
 * Props:
 * @param {string} appName - The app identifier for image selection (e.g., "learn-cricket", "main")
 * @param {React.ReactNode} children - Content to display in the hero overlay
 * @param {string} className - Additional CSS classes for the hero section
 */

/**
 * Shared pool of images for apps without specific hero images
 */
const SHARED_HERO_POOL = [
  'hero1.jpg',
  'hero2.jpg',
  'hero3.jpg'
];

/**
 * Cricket-specific hero images pool
 */
const CRICKET_HERO_POOL = [
  'cricket1.jpg',
  'cricket2.jpg'
];

/**
 * Get hero image for a specific app using deterministic mapping
 * @param {string} appName - The app identifier (e.g., "learn-cricket", "main")
 * @returns {string|null} Image filename to use as hero background, or null for no hero
 */
export function getHeroImageForApp(appName) {
  if (!appName) {
    return SHARED_HERO_POOL[0];
  }

  // Deterministic mapping rules
  switch (appName) {
    case 'main':
      return 'main-hero.jpg';
    
    case 'learn-apt':
      return 'little-girl.jpg';
    
    case 'learn-management':
      return 'girl-hero.jpg';
    
    case 'learn-cricket':
      // Deterministically pick from cricket pool (using first for consistency)
      // Can use hash of appName for more variety if needed
      return CRICKET_HERO_POOL[0];
    
    case 'learn-companion':
      // No hero for learn-companion
      return null;
    
    default:
      // All other apps: pick deterministically from shared pool
      // Use simple hash to select from pool
      const hash = appName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return SHARED_HERO_POOL[hash % SHARED_HERO_POOL.length];
  }
}

/**
 * SharedHero Component
 */
export default function SharedHero({ 
  appName, 
  children, 
  className = ''
}) {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Select image on mount to avoid hydration issues
    const image = getHeroImageForApp(appName);
    setHeroImage(image);
  }, [appName]);

  // If no hero image (e.g., learn-companion), return null
  if (heroImage === null) {
    return null;
  }

  return (
    <section 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ 
        height: '520px',
        minHeight: '400px'
      }}
    >
      {/* Full-size background image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`/images/${heroImage}`}
            alt="Hero background"
            fill
            className="object-cover"
            style={{ objectPosition: '50% 30%' }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" aria-hidden="true"></div>

      {/* Content container - positioned absolutely so overlay content can be placed */}
      <div className="relative z-20 h-full flex items-end pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
