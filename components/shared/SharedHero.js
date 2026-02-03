"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * SharedHero Component
 * 
 * A reusable hero component for landing pages across all iiskills apps.
 * This component provides:
 * - Full-width hero background image
 * - Automatic image selection based on appId
 * - Responsive height settings
 * - Dark overlay for text readability
 * - Bottom-aligned content area
 * 
 * Usage:
 *   <SharedHero appId="learn-ai" className="h-[70vh]">
 *     <h1>Your Hero Content</h1>
 *   </SharedHero>
 * 
 * Props:
 * @param {string} appId - The app identifier for image selection (e.g., "learn-ai", "main")
 * @param {React.ReactNode} children - Content to display in the hero overlay
 * @param {string} className - Additional CSS classes for the hero section
 * @param {string} heroHeight - Height of hero section (default: responsive)
 */

/**
 * Default pool of images available for hero selection
 */
const DEFAULT_IMAGE_POOL = [
  'iiskills-image1.jpg',
  'iiskills-image2.jpg',
  'iiskills-image3.jpg',
  'iiskills-image4.jpg'
];

/**
 * Get hero image for a specific app
 * @param {string} appId - The app identifier (e.g., "learn-cricket", "main")
 * @returns {string} Image filename to use as hero background
 */
export function getHeroImageForApp(appId) {
  // Special case: cricket uses specific cricket images
  if (appId?.includes('cricket')) {
    return 'cricket1.jpg';
  }

  // For other apps, select first image from pool (can be made random if desired)
  return DEFAULT_IMAGE_POOL[0];
}

/**
 * SharedHero Component
 */
export default function SharedHero({ 
  appId, 
  children, 
  className = '', 
  heroHeight = '70vh' 
}) {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Select image on mount to avoid hydration issues
    const image = getHeroImageForApp(appId);
    setHeroImage(image);
  }, [appId]);

  return (
    <section 
      className={`relative w-full overflow-hidden ${className}`}
      style={{ 
        height: heroHeight,
        minHeight: '500px'
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

      {/* Content container - positioned at bottom */}
      <div className="relative z-20 h-full flex items-end pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {children}
        </div>
      </div>
    </section>
  );
}
