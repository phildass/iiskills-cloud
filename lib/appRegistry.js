/**
 * Multi-App Registry
 * 
 * Centralized configuration for all iiskills.cloud applications.
 * This registry enables:
 * - Dynamic app-specific redirects after authentication
 * - Consistent app metadata across the platform
 * - Easy addition of new apps to the ecosystem
 * - Cross-app navigation and session management
 * 
 * When adding a new app:
 * 1. Add entry to APPS object below
 * 2. Ensure app uses same Supabase credentials
 * 3. Configure app's login page to use UniversalLogin
 * 4. Add callback URL to Supabase dashboard
 * 5. Test authentication flow
 */

/**
 * App Registry - Defines all applications in the iiskills.cloud ecosystem
 * 
 * Each app entry includes:
 * - id: Unique identifier for the app
 * - name: Display name
 * - subdomain: Subdomain (or null for main domain)
 * - primaryDomain: Full domain name for production
 * - localPort: Development port
 * - postLoginRedirect: Path to redirect after successful login
 * - postRegisterRedirect: Path to redirect after registration
 * - features: List of enabled features for this app
 * - isFree: Whether app is free to access (no payment required)
 */
export const APPS = {
  main: {
    id: 'main',
    name: 'iiskills.cloud',
    subdomain: null,
    primaryDomain: 'app.iiskills.cloud',
    localPort: 3000,
    postLoginRedirect: '/dashboard',
    postRegisterRedirect: '/dashboard',
    features: ['full-registration', 'dashboard', 'admin'],
    isFree: false,
  },
  'learn-ai': {
    id: 'learn-ai',
    name: 'Learn-AI',
    subdomain: 'learn-ai',
    primaryDomain: 'learn-ai.iiskills.cloud',
    localPort: 3001,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: false,
  },
  'learn-apt': {
    id: 'learn-apt',
    name: 'Learn-Apt',
    subdomain: 'learn-apt',
    primaryDomain: 'learn-apt.iiskills.cloud',
    localPort: 3002,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: true, // Free app - no login required
  },
  'learn-chemistry': {
    id: 'learn-chemistry',
    name: 'Learn-Chemistry',
    subdomain: 'learn-chemistry',
    primaryDomain: 'learn-chemistry.iiskills.cloud',
    localPort: 3005,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: true, // Free app - no login required
  },
  'learn-developer': {
    id: 'learn-developer',
    name: 'Learn-Developer',
    subdomain: 'learn-developer',
    primaryDomain: 'learn-developer.iiskills.cloud',
    localPort: 3010,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: false, // Paid course
  },
  'learn-geography': {
    id: 'learn-geography',
    name: 'Learn-Geography',
    subdomain: 'learn-geography',
    primaryDomain: 'learn-geography.iiskills.cloud',
    localPort: 3011,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: true, // Free app - no login required
  },
  // MOVED TO apps-backup/apps-backup.A as per requirement 7
  // 'learn-govt-jobs': {
  //   id: 'learn-govt-jobs',
  //   name: 'Learn-Govt Jobs',
  //   subdomain: 'learn-govt-jobs',
  //   primaryDomain: 'learn-govt-jobs.iiskills.cloud',
  //   localPort: 3013,
  //   postLoginRedirect: '/learn',
  //   postRegisterRedirect: '/learn',
  //   features: ['simplified-registration', 'courses'],
  //   isFree: false, // Paid course
  // },
  'learn-management': {
    id: 'learn-management',
    name: 'Learn-Management',
    subdomain: 'learn-management',
    primaryDomain: 'learn-management.iiskills.cloud',
    localPort: 3016,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: false,
  },
  'learn-math': {
    id: 'learn-math',
    name: 'Learn-Math',
    subdomain: 'learn-math',
    primaryDomain: 'learn-math.iiskills.cloud',
    localPort: 3017,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: true, // Free app - no login required
  },
  'learn-physics': {
    id: 'learn-physics',
    name: 'Learn-Physics',
    subdomain: 'learn-physics',
    primaryDomain: 'learn-physics.iiskills.cloud',
    localPort: 3020,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: true, // Free app - no login required
  },
  'learn-pr': {
    id: 'learn-pr',
    name: 'Learn-PR',
    subdomain: 'learn-pr',
    primaryDomain: 'learn-pr.iiskills.cloud',
    localPort: 3021,
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: false, // Paid course
  },
  // MOVED TO apps-backup/apps-backup.A as per requirement 7
  // 'learn-finesse': {
  //   id: 'learn-finesse',
  //   name: 'Learn-Finesse',
  //   subdomain: 'learn-finesse',
  //   primaryDomain: 'learn-finesse.iiskills.cloud',
  //   localPort: 3025,
  //   postLoginRedirect: '/learn',
  //   postRegisterRedirect: '/learn',
  //   features: ['simplified-registration', 'courses'],
  //   isFree: false, // Paid course - Academy Suite
  // },
  // MOVED TO apps-backup as per cleanup requirements
  // 'learn-biology': {
  //   id: 'learn-biology',
  //   name: 'Learn-Biology',
  //   subdomain: 'learn-biology',
  //   primaryDomain: 'learn-biology.iiskills.cloud',
  //   localPort: 3026,
  //   postLoginRedirect: '/learn',
  //   postRegisterRedirect: '/learn',
  //   features: ['simplified-registration', 'courses'],
  //   isFree: true, // Free app - Foundation Suite
  // },
  // MOVED TO apps-backup as per previous cleanup
  // 'mpa': {
  //   id: 'mpa',
  //   name: 'MPA - My Personal Assistant',
  //   subdomain: 'mpa',
  //   primaryDomain: 'mpa.iiskills.cloud',
  //   localPort: 3014,
  //   postLoginRedirect: '/',
  //   postRegisterRedirect: '/',
  //   features: ['standalone-app'],
  //   isFree: false, // Paid app
  // },
};

/**
 * Get app configuration by ID
 * @param {string} appId - App identifier (e.g., 'main', 'learn-ai')
 * @returns {Object|null} App configuration object or null if not found
 */
export function getAppById(appId) {
  return APPS[appId] || null;
}

/**
 * Get app configuration by subdomain
 * @param {string} subdomain - Subdomain (e.g., 'learn-ai')
 * @returns {Object|null} App configuration object or null if not found
 */
export function getAppBySubdomain(subdomain) {
  // Handle main domain (no subdomain)
  if (!subdomain || subdomain === 'www') {
    return APPS.main;
  }
  
  return Object.values(APPS).find(app => app.subdomain === subdomain) || null;
}

/**
 * Get app configuration by domain
 * @param {string} domain - Full domain (e.g., 'learn-ai.iiskills.cloud' or 'app.iiskills.cloud')
 * @returns {Object|null} App configuration object or null if not found
 */
export function getAppByDomain(domain) {
  // Remove protocol if present
  const cleanDomain = domain.replace(/^https?:\/\//, '');
  
  // Check for exact match
  const exactMatch = Object.values(APPS).find(app => app.primaryDomain === cleanDomain);
  if (exactMatch) return exactMatch;
  
  // Try to extract subdomain
  const parts = cleanDomain.split('.');
  if (parts.length >= 2) {
    // Check if it's a subdomain of iiskills.cloud
    if (cleanDomain.includes('iiskills.cloud')) {
      const subdomain = parts[0];
      return getAppBySubdomain(subdomain);
    }
  }
  
  return null;
}

/**
 * Get current app configuration based on browser's current domain
 * @returns {Object|null} App configuration object or null if not determinable
 */
export function getCurrentApp() {
  if (typeof window === 'undefined') {
    // Server-side: Try to determine from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      return getAppByDomain(siteUrl);
    }
    return APPS.main; // Default to main app
  }
  
  // Client-side: Use window.location
  const hostname = window.location.hostname;
  
  // Handle localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = window.location.port;
    const appByPort = Object.values(APPS).find(app => app.localPort === parseInt(port));
    return appByPort || APPS.main;
  }
  
  return getAppByDomain(hostname) || APPS.main;
}

/**
 * Get all apps that are free for the user
 * @returns {Array} Array of free app configurations
 */
export function getFreeApps() {
  return Object.values(APPS).filter(app => app.isFree);
}

/**
 * Get all apps that are accessible to the user (based on their access rights)
 * @param {Object} user - User object from Supabase
 * @param {boolean} isAdmin - Whether user has admin access
 * @returns {Array} Array of accessible app configurations
 */
export function getAccessibleApps(user, isAdmin = false) {
  if (!user) {
    // Unauthenticated users can only see free apps
    return getFreeApps();
  }
  
  // Admin can access all apps
  if (isAdmin) {
    return Object.values(APPS);
  }
  
  // TODO: Implement payment/subscription check
  // For now, authenticated users can access free apps only
  // To enable paid apps, check user's subscription status:
  // 
  // Example implementation:
  // const hasActiveSubscription = user.app_metadata?.subscription_status === 'active';
  // if (hasActiveSubscription) {
  //   return Object.values(APPS);  // All apps
  // }
  // 
  // Or check per-app subscriptions in profiles table:
  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('subscribed_apps')
  //   .eq('id', user.id)
  //   .single();
  // 
  // Then filter apps based on profile.subscribed_apps array
  
  return getFreeApps();
}

/**
 * Get redirect URL after authentication for current app
 * @param {string} context - 'login' or 'register'
 * @returns {string} Redirect path
 */
export function getAuthRedirectUrl(context = 'login') {
  const app = getCurrentApp();
  if (!app) {
    return '/';
  }
  
  if (context === 'register') {
    return app.postRegisterRedirect || app.postLoginRedirect || '/';
  }
  
  return app.postLoginRedirect || '/';
}

/**
 * Generate full URL for an app
 * @param {string} appId - App identifier
 * @param {string} path - Path within the app (default: '/')
 * @returns {string} Full URL
 */
export function getAppUrl(appId, path = '/') {
  const app = getAppById(appId);
  if (!app) {
    return null;
  }
  
  // In development, use localhost with port
  if (process.env.NODE_ENV === 'development' || 
      (typeof window !== 'undefined' && window.location.hostname === 'localhost')) {
    return `http://localhost:${app.localPort}${path}`;
  }
  
  // In production, use primary domain
  return `https://${app.primaryDomain}${path}`;
}

/**
 * Get navigation items for app switcher
 * @param {Object} user - User object
 * @param {boolean} isAdmin - Whether user has admin access
 * @returns {Array} Array of navigation items
 */
export function getAppNavigationItems(user, isAdmin = false) {
  const accessibleApps = getAccessibleApps(user, isAdmin);
  
  return accessibleApps.map(app => ({
    id: app.id,
    name: app.name,
    url: getAppUrl(app.id),
    isCurrent: getCurrentApp()?.id === app.id,
  }));
}
