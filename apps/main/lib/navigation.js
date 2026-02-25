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

 * @param {string|number} courseSlug - For learn-* apps: the module ID; for the main site: the course slug

 * @returns {string} The course preview URL
 */
export const getCoursePreviewUrl = (siteSlug, courseSlug) => {
  const siteUrl = getSiteUrl(siteSlug);

  const site = SITES[siteSlug];
  if (!site) {
    console.warn(`getCoursePreviewUrl: unknown siteSlug "${siteSlug}", falling back to main`);
    return `${getSiteUrl('main')}/courses`;
  }
  // For main site, go to the courses listing page (no dynamic /courses/[slug] route exists)
  if (siteSlug === 'main') {
    return `${siteUrl}/courses`;
  }
  // Learning apps define a fixed coursePreviewPath in siteConfig
  return `${siteUrl}${site.coursePreviewPath}`;
};

/**
 * Get the module preview URL on a specific site
 * @param {string} siteSlug - The site slug
 * @param {string|number} moduleId - The module ID
 * @param {string|number} lessonId - The starting lesson ID (defaults to 1)
 * @returns {string} The module preview URL
 */
export const getModulePreviewUrl = (siteSlug, moduleId, lessonId = 1) => {
  const siteUrl = getSiteUrl(siteSlug);
  return `${siteUrl}/modules/${moduleId}/lesson/${lessonId}`;
};

/**
 * Get the lesson preview URL on a specific site
 * @param {string} siteSlug - The site slug
 * @param {string|number} moduleId - The module ID
 * @param {string|number} lessonId - The lesson ID
 * @returns {string} The lesson preview URL
 */
export const getLessonPreviewUrl = (siteSlug, moduleId, lessonId) => {
  const siteUrl = getSiteUrl(siteSlug);
  return `${siteUrl}/modules/${moduleId}/lesson/${lessonId}`;
};

/**
 * Get site information by slug
 * @param {string} siteSlug - The site slug
 * @returns {object} Site information
 */
export const getSiteInfo = (siteSlug) => {
  return SITES[siteSlug] || SITES['main'];
};
