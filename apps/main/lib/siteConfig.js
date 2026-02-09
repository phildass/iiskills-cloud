/**
 * Site Configuration
 * 
 * Centralized configuration for all iiskills.cloud sites
 * Includes both production URLs and localhost port assignments
 */

export const SITES = {
  'main': {
    name: 'Main Site',
    url: 'https://app.iiskills.cloud',
    slug: 'main',
    subdomain: 'main',
    localhostPort: 3000
  },
  'learn-ai': {
    name: 'Learn AI',
    url: 'https://app1.learn-ai.iiskills.cloud',
    slug: 'learn-ai',
    subdomain: 'learn-ai',
    localhostPort: 3024
  },
  'learn-apt': {
    name: 'Learn APT',
    url: 'https://app1.learn-apt.iiskills.cloud',
    slug: 'learn-apt',
    subdomain: 'learn-apt',
    localhostPort: 3002
  },
  'learn-chemistry': {
    name: 'Learn Chemistry',
    url: 'https://app1.learn-chemistry.iiskills.cloud',
    slug: 'learn-chemistry',
    subdomain: 'learn-chemistry',
    localhostPort: 3005
  },
  'learn-developer': {
    name: 'Learn Developer',
    url: 'https://app1.learn-developer.iiskills.cloud',
    slug: 'learn-developer',
    subdomain: 'learn-developer',
    localhostPort: 3007
  },
  'learn-geography': {
    name: 'Learn Geography',
    url: 'https://app1.learn-geography.iiskills.cloud',
    slug: 'learn-geography',
    subdomain: 'learn-geography',
    localhostPort: 3011
  },
  'learn-govt-jobs': {
    name: 'Learn Govt Jobs',
    url: 'https://app1.learn-govt-jobs.iiskills.cloud',
    slug: 'learn-govt-jobs',
    subdomain: 'learn-govt-jobs',
    localhostPort: 3013
  },
  'learn-management': {
    name: 'Learn Management',
    url: 'https://app1.learn-management.iiskills.cloud',
    slug: 'learn-management',
    subdomain: 'learn-management',
    localhostPort: 3016
  },
  'learn-math': {
    name: 'Learn Math',
    url: 'https://app1.learn-math.iiskills.cloud',
    slug: 'learn-math',
    subdomain: 'learn-math',
    localhostPort: 3017
  },
  'learn-physics': {
    name: 'Learn Physics',
    url: 'https://app1.learn-physics.iiskills.cloud',
    slug: 'learn-physics',
    subdomain: 'learn-physics',
    localhostPort: 3020
  },
  'learn-pr': {
    name: 'Learn PR',
    url: 'https://app1.learn-pr.iiskills.cloud',
    slug: 'learn-pr',
    subdomain: 'learn-pr',
    localhostPort: 3021
  }
};

// Array of all sites for easy iteration
export const ALL_SITES = Object.values(SITES);

// Array of learning sites (excluding main)
export const LEARNING_SITES = Object.values(SITES).filter(site => site.slug !== 'main');

// Subdomain options for dropdowns
export const SUBDOMAIN_OPTIONS = [
  { value: 'all', label: 'All Sites' },
  ...Object.values(SITES).map(site => ({
    value: site.subdomain,
    label: site.name
  }))
];
