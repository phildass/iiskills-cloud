/**
 * Navigation Helper Utilities
 * 
 * Helper functions for navigation between sites and admin pages
 */

import { SITES } from './siteConfig';

/**
 * Get the URL for a specific site
 * @param {string} siteSlug - The site slug (e.g., 'learn-ai', 'main')
 * @param {boolean} useLocalhost - Whether to use localhost URLs (for development)
 * @returns {string} The site URL
 */
export const getSiteUrl = (siteSlug, useLocalhost = false) => {
  const site = SITES[siteSlug] || SITES['main'];
  
  // Check if we should use localhost based on environment or parameter
  const isLocalDev = process.env.NEXT_PUBLIC_USE_LOCALHOST === 'true' || 
                     typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  if (useLocalhost || isLocalDev) {
    return `http://localhost:${site.localhostPort}`;
  }
  
  return site.url;
};

/**
 * Get the admin URL for the main site
 * @param {string} siteSlug - Optional site slug to filter admin by
 * @returns {string} The admin URL
 */
export const getAdminUrl = (siteSlug = null) => {
  const baseUrl = 'https://app.iiskills.cloud/admin';
  return siteSlug ? `${baseUrl}?site=${siteSlug}` : baseUrl;
};

/**
 * Get the course preview URL on a specific site
 * @param {string} siteSlug - The site slug
 * @param {string} courseSlug - The course slug (only used for the 'main' site; learning apps
 *   navigate to a fixed preview path defined in siteConfig, since each app covers one subject)
 * @returns {string} The course preview URL
 */
export const getCoursePreviewUrl = (siteSlug, courseSlug) => {
  const siteUrl = getSiteUrl(siteSlug);
  const site = SITES[siteSlug];
  if (!site) {
    console.warn(`getCoursePreviewUrl: unknown siteSlug "${siteSlug}", falling back to main`);
    return `${getSiteUrl('main')}/courses/${courseSlug}`;
  }
  // For main site, append the course slug to the courses listing path
  if (siteSlug === 'main') {
    return `${siteUrl}/courses/${courseSlug}`;
  }
  // Learning apps define a fixed coursePreviewPath in siteConfig
  return `${siteUrl}${site.coursePreviewPath}`;
};

/**
 * Get the module preview URL on a specific site
 * @param {string} siteSlug - The site slug
 * @param {string} courseSlug - The course slug
 * @param {string} moduleSlug - The module slug
 * @returns {string} The module preview URL
 */
export const getModulePreviewUrl = (siteSlug, courseSlug, moduleSlug) => {
  const siteUrl = getSiteUrl(siteSlug);
  return `${siteUrl}/courses/${courseSlug}/modules/${moduleSlug}`;
};

/**
 * Get the lesson preview URL on a specific site
 * @param {string} siteSlug - The site slug
 * @param {string} courseSlug - The course slug
 * @param {string} moduleSlug - The module slug
 * @param {string} lessonSlug - The lesson slug
 * @returns {string} The lesson preview URL
 */
export const getLessonPreviewUrl = (siteSlug, courseSlug, moduleSlug, lessonSlug) => {
  const siteUrl = getSiteUrl(siteSlug);
  return `${siteUrl}/courses/${courseSlug}/modules/${moduleSlug}/lessons/${lessonSlug}`;
};

/**
 * Get site information by slug
 * @param {string} siteSlug - The site slug
 * @returns {object} Site information
 */
export const getSiteInfo = (siteSlug) => {
  return SITES[siteSlug] || SITES['main'];
};
