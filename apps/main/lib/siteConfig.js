/**
 * Site Configuration
 * 
 * Centralized configuration for all iiskills.cloud sites
 */

export const SITES = {
  'main': {
    name: 'Main Site',
    url: 'https://app.iiskills.cloud',
    slug: 'main',
    subdomain: 'main'
  },
  'learn-ai': {
    name: 'Learn AI',
    url: 'https://app1.learn-ai.iiskills.cloud',
    slug: 'learn-ai',
    subdomain: 'learn-ai'
  },
  'learn-apt': {
    name: 'Learn APT',
    url: 'https://app1.learn-apt.iiskills.cloud',
    slug: 'learn-apt',
    subdomain: 'learn-apt'
  },
  'learn-chemistry': {
    name: 'Learn Chemistry',
    url: 'https://app1.learn-chemistry.iiskills.cloud',
    slug: 'learn-chemistry',
    subdomain: 'learn-chemistry'
  },
  'learn-cricket': {
    name: 'Learn Cricket',
    url: 'https://app1.learn-cricket.iiskills.cloud',
    slug: 'learn-cricket',
    subdomain: 'learn-cricket'
  },
  'learn-geography': {
    name: 'Learn Geography',
    url: 'https://app1.learn-geography.iiskills.cloud',
    slug: 'learn-geography',
    subdomain: 'learn-geography'
  },
  'learn-leadership': {
    name: 'Learn Leadership',
    url: 'https://app1.learn-leadership.iiskills.cloud',
    slug: 'learn-leadership',
    subdomain: 'learn-leadership'
  },
  'learn-management': {
    name: 'Learn Management',
    url: 'https://app1.learn-management.iiskills.cloud',
    slug: 'learn-management',
    subdomain: 'learn-management'
  },
  'learn-math': {
    name: 'Learn Math',
    url: 'https://app1.learn-math.iiskills.cloud',
    slug: 'learn-math',
    subdomain: 'learn-math'
  },
  'learn-physics': {
    name: 'Learn Physics',
    url: 'https://app1.learn-physics.iiskills.cloud',
    slug: 'learn-physics',
    subdomain: 'learn-physics'
  },
  'learn-pr': {
    name: 'Learn PR',
    url: 'https://app1.learn-pr.iiskills.cloud',
    slug: 'learn-pr',
    subdomain: 'learn-pr'
  },
  'learn-winning': {
    name: 'Learn Winning',
    url: 'https://app1.learn-winning.iiskills.cloud',
    slug: 'learn-winning',
    subdomain: 'learn-winning'
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
