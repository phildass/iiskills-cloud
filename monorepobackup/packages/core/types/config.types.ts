/**
 * App Configuration Layer
 * 
 * This module defines the configuration structure for each app
 * allowing feature toggles and customization while maintaining
 * a unified core architecture.
 */

import { ContentType } from '../types/module.types';

/**
 * Navigation configuration
 */
export interface NavigationConfig {
  depth: number; // Maximum navigation depth
  showBreadcrumbs: boolean;
  enableSearch: boolean;
  menuItems?: Array<{
    label: string;
    path: string;
    icon?: string;
  }>;
}

/**
 * Feature flags for the app
 */
export interface FeatureFlags {
  isSearchable: boolean;
  hasProgressTracking: boolean;
  hasCertificates: boolean;
  hasAIAssistant: boolean;
  hasNewsletterPopup: boolean;
  enablePaywall: boolean;
  enableSocialSharing: boolean;
  enableComments: boolean;
  enableBookmarks: boolean;
}

/**
 * Content configuration
 */
export interface ContentConfig {
  supportedTypes: ContentType[];
  defaultType: ContentType;
  enableUserGenerated: boolean;
  moderationRequired: boolean;
}

/**
 * Branding configuration
 */
export interface BrandingConfig {
  appName: string;
  appDescription: string;
  appSlogan?: string;
  logo?: {
    light: string;
    dark: string;
  };
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * API configuration
 */
export interface APIConfig {
  baseUrl: string;
  endpoints: {
    modules: string;
    auth: string;
    user: string;
    [key: string]: string;
  };
  timeout: number;
  retryAttempts: number;
}

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  enabled: boolean;
  provider?: 'google' | 'mixpanel' | 'custom';
  trackingId?: string;
  events?: {
    pageView: boolean;
    moduleView: boolean;
    moduleComplete: boolean;
    testSubmit: boolean;
  };
}

/**
 * Main App Configuration interface
 */
export interface AppConfig {
  // App identity
  id: string;
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  
  // Feature configuration
  features: FeatureFlags;
  
  // Navigation
  navigation: NavigationConfig;
  
  // Content
  content: ContentConfig;
  
  // Branding
  branding: BrandingConfig;
  
  // API
  api: APIConfig;
  
  // Analytics
  analytics: AnalyticsConfig;
  
  // Custom configuration per app
  custom?: Record<string, any>;
}

/**
 * Default configuration factory
 */
export function createDefaultConfig(overrides: Partial<AppConfig>): AppConfig {
  const defaults: AppConfig = {
    id: 'default-app',
    name: 'Default App',
    version: '1.0.0',
    environment: 'development',
    features: {
      isSearchable: true,
      hasProgressTracking: true,
      hasCertificates: false,
      hasAIAssistant: true,
      hasNewsletterPopup: true,
      enablePaywall: false,
      enableSocialSharing: true,
      enableComments: false,
      enableBookmarks: true,
    },
    navigation: {
      depth: 3,
      showBreadcrumbs: true,
      enableSearch: true,
    },
    content: {
      supportedTypes: ['lesson', 'test', 'article'],
      defaultType: 'lesson',
      enableUserGenerated: false,
      moderationRequired: true,
    },
    branding: {
      appName: 'Default App',
      appDescription: 'A learning platform powered by iiskills.cloud',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6',
    },
    api: {
      baseUrl: '/api',
      endpoints: {
        modules: '/modules',
        auth: '/auth',
        user: '/user',
      },
      timeout: 30000,
      retryAttempts: 3,
    },
    analytics: {
      enabled: false,
    },
  };

  return {
    ...defaults,
    ...overrides,
    features: { ...defaults.features, ...overrides.features },
    navigation: { ...defaults.navigation, ...overrides.navigation },
    content: { ...defaults.content, ...overrides.content },
    branding: { ...defaults.branding, ...overrides.branding },
    api: { ...defaults.api, ...overrides.api },
    analytics: { ...defaults.analytics, ...overrides.analytics },
  };
}
