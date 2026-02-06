"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * HeroManager:
 * - Uses images from each app's own public/images folder
 * - Image with "hero" suffix in the name is used as the hero image (first in array)
 * - Other 2 images from the folder are used randomly for secondary images
 * - Each app uses only its own images
 * - Renders a full-size hero background with first image (hero image)
 * - Positions overlay text at the bottom of the hero area
 * 
 * Note: Archived apps (learn-cricket, learn-companion, learn-leadership, learn-winning)
 * are in apps-backup/ and are not included in this configuration.
 */

/**
 * Image assignments for each app
 * Images are sourced from each app's public/images folder.
 * First image in array is the hero image (has "hero" in filename).
 * Other images are used for secondary display.
 * 
 * Note: Apps in apps-backup/ (learn-cricket, learn-companion, learn-leadership, learn-winning) 
 * are archived and no longer have image assignments here.
 */
const APP_IMAGE_ASSIGNMENTS = {
  'main': ['cover-main-hero.jpg', 'iiskills-image2.jpg', 'iiskills-image3.jpg'],
  'learn-developer': ['iiskills-dev-hero.jpg', 'iiskills-dev-cman.jpg', 'iiskills-dev-couple.jpg'],
  'learn-management': ['girl-hero.jpg', 'iiskills-mgmt-mgrs.jpg', 'iiskills-mgmt-mgrs2.jpg'],
  'learn-ai': ['iiskills-aii-hero.png', 'iiskills-ai-cafe.jpg', 'iiskills-ai-sar.png'],
  'learn-math': ['iiskills-math-hero.jpg', 'iiskills-math-egirl.jpg', 'iiskills-math-mgirl.jpg'],
  'learn-physics': ['iiskills-physics-heor.jpg', 'iiskills-physics-eman.jpg', 'iiskills-physics-girls.jpg'],
  'learn-chemistry': ['iiskills-chem-hero.jpg', 'iiskills-chem-labman.jpg', 'iiskills-chem-lwoman.jpg'],
  'learn-geography': ['cover3.jpg', 'iiskills-image1.jpg', 'iiskills-image4.jpg'],
  'learn-govt-jobs': ['iiskills-govt-hero.jpg', 'iiskills-govt-staff.jpg', 'iiskills-govt-teacher.jpg'],
  'learn-pr': ['iiskills-pr-hero.jpg', 'iiskills-pr-girl.jpg', 'iiskills-pr-media.jpg'],
  'learn-apt': ['iiskills-apt-heo.jpg', 'iiskills-apt-boyu.jpg', 'iiskills-apt-girl.jpg']
};

/**
 * Get hero images for a specific app
 * @param {string} appId - The app identifier (e.g., "learn-developer")
 * @returns {Array<string>} Array of 2-3 image filenames assigned to this app
 */
export function getHeroImagesForApp(appId) {
  // Return assigned images for the app, or fallback to a default set
  return APP_IMAGE_ASSIGNMENTS[appId] || ['hero1.jpg', 'hero2.jpg', 'hero3.jpg'];
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
