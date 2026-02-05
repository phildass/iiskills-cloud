"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

/**
 * HeroManager:
 * - Assigns specific images to each app (2-3 images per app)
 * - learn-developer: uses indian.png as hero
 * - learn-management: uses girl-hero.jpg as hero
 * - learn-cricket: uses cricket1.jpg, cricket2.jpg, adult-man-using-laptop-bed.jpg
 * - All other apps: unique image sets from available pool
 * - No duplicate images across apps
 * - Renders a full-size hero background with first image
 * - Positions overlay text at the bottom of the hero area
 */

/**
 * Image assignments for each app
 * Each app gets 2-3 images with specific requirements:
 * - learn-developer: hero = indian.png (3 images total)
 * - learn-management: hero = girl-hero.jpg (3 images total)
 * - learn-cricket: cricket1.jpg, cricket2.jpg, adult-man-using-laptop-bed.jpg (3 images total)
 * NO duplicates across any apps - each image used only once
 * Total: 39 unique images distributed across 15 apps
 */
const APP_IMAGE_ASSIGNMENTS = {
  'main': ['cover3.jpg', 'main-hero.jpg', 'cover-main-hero.jpg'],
  'learn-cricket': ['cricket1.jpg', 'cricket2.jpg', 'adult-man-using-laptop-bed.jpg'],
  'learn-developer': ['indian.png', 'businessman-using-application.jpg', 'excited-young-woman-4.jpg'],
  'learn-management': ['girl-hero.jpg', 'focused-young-employees-waiting-meeting-beginning.jpg', 'focused-young-office-employee-chatting-cellphone-coffee-break.jpg'],
  'learn-ai': ['friends-sitting-few-steps-with-smartphones-tablets.jpg', 'general.jpg', 'group-business-executives-discussing-digital-tablet.jpg'],
  'learn-math': ['group-business-executives-smiling-camera.jpg', 'group-business-executives-using-digital-tablet-mobile-pho.jpg', 'group-three-indian-ethnicity-friendship-togetherness-mans-technology-leisure-guys-with-phone.jpg'],
  'learn-physics': ['group-three-south-asian-indian-mans-traditional-casual-wear-looking-mobile-phone (1).jpg', 'hero1.jpg', 'hero2.jpg'],
  'learn-chemistry': ['hero3.jpg', 'iiskills-image1.jpg', 'iiskills-image2.jpg'],
  'learn-geography': ['iiskills-image3.jpg', 'iiskills-image4.jpg', 'indian-people-celebrating-holi-with-sweet-laddu-colours-thali-colour-splash.jpg'],
  'learn-leadership': ['indianjpg.jpg', 'little-girl.jpg'],
  'learn-govt-jobs': ['little-girl7.jpg', 'medium-shot-man-working-laptop.jpg'],
  'learn-pr': ['multiracial-friends-using-smartphone-against-wall-university-college-backyard-young-people.jpg', 'portrait-young-man-using-his-laptop-using-his-mobile-phone-while-sitting-coffee-shop.jpg'],
  'learn-apt': ['schoolgirl-gestur6.jpg', 'smiling-businessman-speaking-phone-browsing-laptop.jpg'],
  'learn-companion': ['smiling-young-2.jpg', 'surprised-young-3.jpg'],
  'learn-winning': ['young-girl-ha5.jpg', 'young-male-with-trendy-watch-holding-cell-phone-call-while-sitting-table.jpg']
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
