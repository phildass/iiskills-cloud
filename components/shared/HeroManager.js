"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

/**
 * HeroManager:
 * - Uses images from each app's own public/images folder
 * - Image with "hero" in the name is used as the hero image (first in array)
 * - Other images from the folder are used randomly for secondary images
 * - Each app uses only its own images
 * - Main app: 1 hero + 13 secondary images for maximum variety (14 total)
 * - Learn-ai app: 1 hero + 8 secondary images (9 total)
 * - Learn-geography app: 1 hero + 2 secondary images (3 total)
 * - Other apps: 1 hero + 2 secondary images each (3 total)
 * - Renders a full-size hero background with first image (hero image)
 * - Positions overlay text at the bottom of the hero area
 *
 * Note: Archived apps (learn-biology, learn-cricket, learn-companion, learn-finesse, learn-govt-jobs, 
 * learn-leadership, learn-winning, mpa) are in apps-backup/ and are not included in this configuration.
 */

/**
 * Image assignments for each app
 * Images are sourced from each app's public/images folder.
 * First image in array is the hero image (has "hero" in filename).
 * Other images are used for secondary display.
 *
 * Main app has 14 images total (1 hero + 13 secondary images for variety)
 * Learn-ai has 9 images total (1 hero + 8 secondary images)
 * Learn-geography has 3 images total (1 hero + 2 secondary images)
 * Other apps have 3 images each (1 hero + 2 random images)
 *
 * Note: Apps in apps-backup/ (learn-biology, learn-cricket, learn-companion, learn-finesse, 
 * learn-govt-jobs, learn-leadership, learn-winning, mpa) are archived and no longer 
 * have image assignments here.
 */
const APP_IMAGE_ASSIGNMENTS = {
  main: [
    "iiskills-main-hero.jpg",
    "iiskills-main1.jpg",
    "iiskils.main.2.jpg",
    "iiskills.main.3..jpg",
    "iiskills.main.4..jpg",
    "iiskills.main.5..jpg",
    "iiskills.main.6..jpg",
    "iiskills.main7..jpg",
    "iiskills.main.8..jpg",
    "iiskills-main-wm2.jpg",
    "iiskills-image1.jpg",
    "iiskills-image2.jpg",
    "cover-main-hero.jpg",
    "main-hero.jpg",
  ],
  "learn-developer": ["iiskills-dev-hero.jpg", "iiskills-dev-cman.jpg", "iiskills-dev-couple.jpg"],
  "learn-management": ["girl-hero.jpg", "iiskills-mgmt-mgrs.jpg", "iiskills-mgmt-mgrs2.jpg"],
  "learn-ai": [
    "iiskills-aii-hero.png",
    "iiskills-ai-cafe.jpg",
    "iiskills-ai-sar.png",
    "iiskills-ai-fl.jpg",
    "iiskills-ai-h.jpg",
    "iiskills-ai-wm.jpg",
    "iiskills-ai-wm2.jpg",
    "iiskills-ai-wm4.jpg",
    "iiskills-ai-wm5.jpg",
  ],
  "learn-math": ["iiskills-math-hero.jpg", "iiskills-math-egirl.jpg", "iiskills-math-mgirl.jpg"],
  "learn-physics": [
    "iiskills-physics-heor.jpg",
    "iiskills-physics-eman.jpg",
    "iiskills-physics-girls.jpg",
  ],
  "learn-chemistry": [
    "iiskills-chem-hero.jpg",
    "iiskills-chem-labman.jpg",
    "iiskills-chem-lwoman.jpg",
  ],
  // MOVED TO apps-backup as per cleanup requirements
  // "learn-biology": [
  //   "iiskills-bio-hero.jpg",
  //   "iiskills-bio-student.jpg",
  //   "iiskills-bio-researcher.jpg",
  //   "iiskills-bio-lab.jpg",
  //   "iiskills-bio-mn.jpg",
  //   "iiskills-bio-mn1.jpg",
  //   "iiskills-bio-mn2.jpg",
  // ],
  "learn-geography": ["iiskills-geo-hero.jpg", "iiskills-geo-road.jpg", "iiskills-geo-tour.jpg"],
  // MOVED TO apps-backup as per previous cleanup
  // "learn-govt-jobs": [
  //   "iiskills-govt-hero.jpg",
  //   "iiskills-govt-staff.jpg",
  //   "iiskills-govt-teacher.jpg",
  // ],
  "learn-pr": ["iiskills-pr-hero.jpg", "iiskills-pr-girl.jpg", "iiskills-pr-media.jpg"],
  "learn-apt": ["iiskills-apt-heo.jpg", "iiskills-apt-boyu.jpg", "iiskills-apt-girl.jpg"],
  // MOVED TO apps-backup as per previous cleanup
  // "learn-finesse": [
  //   "iiskills-finesse-hero.jpg",
  //   "iiskills-finesse-bw.jpg",
  //   "iiskills-finesse-grpm.jpg",
  //   "iiskills-finesse-grpmw.jpg",
  //   "iiskills-finesse-grpmwg.jpg",
  //   "iiskills-finesse-grpw.jpg",
  // ],
};

/**
 * Get hero images for a specific app
 * @param {string} appId - The app identifier (e.g., "learn-developer")
 * @returns {Array<string>} Array of image filenames assigned to this app (15 for main, 9 for learn-ai, 3 for most apps)
 */
export function getHeroImagesForApp(appId) {
  // Return assigned images for the app, or fallback to a default set
  return APP_IMAGE_ASSIGNMENTS[appId] || ["hero1.jpg", "hero2.jpg", "hero3.jpg"];
}

/**
 * Get a random secondary image (non-hero image) for a specific app
 * @param {string} appId - The app identifier (e.g., "learn-developer")
 * @returns {string} A random image filename from the non-hero images
 */
export function getRandomSecondaryImage(appId) {
  const images = getHeroImagesForApp(appId);
  // Skip the first image (hero) and randomly select from the rest
  const secondaryImages = images.slice(1);
  if (secondaryImages.length === 0) return images[0]; // fallback to hero if no secondary images
  const randomIndex = Math.floor(Math.random() * secondaryImages.length);
  return secondaryImages[randomIndex];
}

/**
 * Hero component with full-size background image and bottom-aligned overlay
 * @param {Object} props
 * @param {string} props.appId - App identifier for image selection
 * @param {React.ReactNode} props.children - Content to display in hero overlay (positioned at bottom)
 * @param {string} props.className - Additional CSS classes for the hero section
 * @param {string} props.heroHeight - Height of hero section (default: 70vh for mobile, 80vh for md, 90vh for lg)
 * @param {boolean} props.noOverlay - If true, displays image naturally without any overlay (default: false)
 * @param {string} props.overlayOpacity - Custom overlay opacity class (e.g., "bg-black/20", "bg-black/40"). Only applies when noOverlay is false. Default: "bg-black/40"
 */
export default function Hero({ 
  appId, 
  children, 
  className = "", 
  heroHeight = "70vh", 
  noOverlay = false,
  overlayOpacity = "bg-black/40"
}) {
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
        minHeight: "500px",
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
            style={{ objectPosition: "50% 30%" }}
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* Overlay for better text readability - can be disabled with noOverlay prop or customized */}
      {!noOverlay && (
        <div className={`absolute inset-0 ${overlayOpacity} z-10`} aria-hidden="true"></div>
      )}

      {/* Content container - positioned at bottom */}
      <div className="relative z-20 h-full flex items-end pb-12 md:pb-16 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">{children}</div>
      </div>
    </section>
  );
}

/**
 * Secondary image display component for showing a randomly selected secondary image
 * Can be used in content sections below the hero
 */
export function SecondaryImage({ appId, alt, className = "" }) {
  const [secondImage, setSecondImage] = useState(null);

  useEffect(() => {
    // Randomly select from the secondary images (non-hero images)
    const randomImage = getRandomSecondaryImage(appId);
    setSecondImage(randomImage);
  }, [appId]);

  if (!secondImage) return null;

  return (
    <div className={`relative rounded-xl overflow-hidden shadow-2xl ${className}`}>
      <Image
        src={`/images/${secondImage}`}
        alt={alt || "Learning platform illustration"}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
    </div>
  );
}
