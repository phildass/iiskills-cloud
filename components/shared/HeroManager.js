"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * HeroManager:
 * - Selects at least 3 images for a workspace (random from /public/images by default)
 * - For learn-cricket: uses cricket1.jpg, cricket2.jpg (minimum 2 for cricket)
 * - Renders a full-size hero background with one image
 * - Positions overlay text at the bottom of the hero area
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
 * Get hero images for a specific app
 * @param {string} appId - The app identifier (e.g., "learn-cricket")
 * @returns {Array<string>} Array of at least 3 image filenames (2 minimum for cricket)
 */
export function getHeroImagesForApp(appId) {
  // Special case: main app uses cover3.jpg
  if (appId === 'main') {
    return ['cover3.jpg', 'main-hero.jpg'];
  }
  
  // Special case: cricket uses specific cricket images
  if (appId?.includes('cricket')) {
    return ['cricket1.jpg', 'cricket2.jpg'];
  }

  // Special case: learn-developer uses indianjpg.jpg
  if (appId === 'learn-developer') {
    return ['indianjpg.jpg', 'medium-shot-man-working-laptop.jpg', 'businessman-using-application.jpg'];
  }

  // For other apps, randomly select at least 3 images from the pool
  const pool = [...DEFAULT_IMAGE_POOL];
  const selected = [];
  const numToSelect = Math.min(3, pool.length);
  
  // Select images randomly without replacement
  for (let i = 0; i < numToSelect; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool[idx]);
    pool.splice(idx, 1);
  }
  
  return selected;
}

/**
 * Hero component with full-size background image and bottom-aligned overlay
 * @param {Object} props
 * @param {string} props.appId - App identifier for image selection
 * @param {React.ReactNode} props.children - Content to display in hero overlay (positioned at bottom)
 * @param {string} props.className - Additional CSS classes for the hero section
 * @param {string} props.heroHeight - Height of hero section (default: 70vh for mobile, 80vh for md, 90vh for lg)
 */
export default function Hero({ appId, children, className = '', heroHeight = '70vh' }) {
  const [heroImage, setHeroImage] = useState(null);

  useEffect(() => {
    // Select images on mount to avoid hydration issues
    const images = getHeroImagesForApp(appId);
    // Use the first selected image as the hero background
    setHeroImage(images[0]);
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

/**
 * Secondary image display component for showing the second selected image
 * Can be used in content sections below the hero
 */
export function SecondaryImage({ appId, alt, className = '' }) {
  const [secondImage, setSecondImage] = useState(null);

  useEffect(() => {
    const images = getHeroImagesForApp(appId);
    // Use the second selected image
    if (images.length > 1) {
      setSecondImage(images[1]);
    }
  }, [appId]);

  if (!secondImage) return null;

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <Image
        src={`/images/${secondImage}`}
        alt={alt || 'Learning platform illustration'}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
