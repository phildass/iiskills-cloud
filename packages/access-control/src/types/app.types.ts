/**
 * App Type Definitions
 * 
 * Defines types for app configuration, IDs, and categorization
 */

/**
 * Valid app identifiers in the iiskills-cloud platform
 */
export type AppId = 
  | 'main'
  | 'learn-ai'
  | 'learn-apt'
  | 'learn-chemistry'
  | 'learn-developer'
  | 'learn-geography'
  | 'learn-management'
  | 'learn-math'
  | 'learn-physics'
  | 'learn-pr';

/**
 * App category classification
 */
export type AppCategory = 'FREE' | 'PAID';

/**
 * App configuration interface
 */
export interface AppConfig {
  id: AppId;
  name: string;
  price: number;
  currency: 'INR';
  category: AppCategory;
  isBundle: boolean;
  bundleWith?: AppId[];
  description: string;
  subdomain?: string;
  port?: number;
}

/**
 * Bundle configuration interface
 */
export interface BundleConfig {
  apps: AppId[];
  price: number;
  currency: 'INR';
  description: string;
  autoGrant: boolean;
}

/**
 * App collection by category
 */
export interface AppCollection {
  FREE: readonly AppId[];
  PAID: readonly AppId[];
}
