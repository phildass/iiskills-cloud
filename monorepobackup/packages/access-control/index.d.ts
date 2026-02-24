/**
 * TypeScript Type Definitions for @iiskills/access-control
 * 
 * This file provides complete type definitions for the access control package.
 * Can be used for TypeScript projects or JSDoc type checking in JavaScript.
 * 
 * @packageDocumentation
 */

/**
 * App type enumeration
 */
export type AppType = 'free' | 'paid';

/**
 * How access was granted to a user
 */
export type GrantedVia = 'payment' | 'bundle' | 'admin' | 'otp' | 'promo';

/**
 * App identifier - must be one of the known app IDs
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
 * Bundle identifier
 */
export type BundleId = 'ai-developer-bundle';

/**
 * Price in paisa (smallest currency unit)
 */
export interface Price {
  /** Introductory price in paisa (Rs * 100) */
  introductory: number;
  /** Regular price in paisa (Rs * 100) */
  regular: number;
}

/**
 * Bundle configuration
 */
export interface Bundle {
  /** Unique bundle identifier */
  id: BundleId;
  /** Display name */
  name: string;
  /** Description of the bundle */
  description: string;
  /** App IDs included in this bundle */
  apps: AppId[];
  /** Bundle pricing */
  price: Price;
  /** List of features/benefits */
  features: string[];
  /** Special highlight message */
  highlight: string;
}

/**
 * App configuration
 */
export interface AppConfig {
  /** Unique app identifier */
  id: AppId;
  /** Display name */
  name: string;
  /** App type (free or paid) */
  type: AppType;
  /** Bundle this app belongs to (null if not bundled) */
  bundleId: BundleId | null;
  /** App pricing (null if using bundle price) */
  price: Price | null;
}

/**
 * User profile with access information
 */
export interface User {
  /** User UUID */
  id: string;
  /** User email */
  email: string;
  /** User name */
  name?: string;
  /** Whether user is admin */
  is_admin?: boolean;
  /** Apps the user has access to */
  apps?: AppId[];
}

/**
 * User app access record
 */
export interface UserAppAccess {
  /** Access record UUID */
  id: string;
  /** User UUID */
  user_id: string;
  /** App ID */
  app_id: AppId;
  /** How access was granted */
  granted_via: GrantedVia;
  /** Payment ID if granted via payment */
  payment_id?: string;
  /** When access was granted */
  granted_at: string; // ISO timestamp
  /** When access expires (null for lifetime) */
  expires_at?: string | null; // ISO timestamp
  /** Admin ID if granted by admin */
  granted_by_admin_id?: string | null;
  /** Additional notes */
  notes?: string | null;
}

/**
 * Access status result
 */
export interface AccessStatus {
  /** Whether user has access */
  hasAccess: boolean;
  /** Reason why access was granted/denied */
  reason: string;
  /** How access was granted (if hasAccess is true) */
  grantedVia?: GrantedVia;
  /** Message to display to user */
  message: string;
}

/**
 * Bundle access result
 */
export interface BundleAccessResult {
  /** Main app that was purchased */
  purchasedApp: AppId;
  /** All apps unlocked (includes purchased app and bundle apps) */
  unlockedApps: AppId[];
  /** Apps unlocked via bundle (excluding purchased app) */
  bundledApps: AppId[];
  /** User app access records created */
  accessRecords: UserAppAccess[];
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Access statistics
 */
export interface AccessStats {
  /** App ID */
  appId: AppId;
  /** Total active access grants */
  totalActive: number;
  /** Access grants via payment */
  viaPayment: number;
  /** Access grants via bundle */
  viaBundle: number;
  /** Access grants by admin */
  viaAdmin: number;
  /** Access grants via OTP */
  viaOTP: number;
  /** Access grants via promo */
  viaPromo: number;
}

/**
 * Payment guard result
 */
export interface PaymentGuardResult {
  /** Whether request should be blocked */
  shouldBlock: boolean;
  /** HTTP status code to return if blocked */
  statusCode?: number;
  /** Error message if blocked */
  message?: string;
}

/**
 * Grant app access parameters
 */
export interface GrantAppAccessParams {
  /** User UUID */
  userId: string;
  /** App ID to grant access to */
  appId: AppId;
  /** How access is being granted */
  grantedVia: GrantedVia;
  /** Payment ID if granted via payment */
  paymentId?: string;
  /** Admin user ID if granted by admin */
  grantedByAdminId?: string;
  /** When access expires (null for lifetime) */
  expiresAt?: string | null;
  /** Additional notes */
  notes?: string | null;
}

/**
 * Grant bundle access parameters
 */
export interface GrantBundleAccessParams {
  /** User UUID */
  userId: string;
  /** App ID that was purchased (triggers bundle unlock) */
  purchasedAppId: AppId;
  /** Payment ID */
  paymentId: string;
  /** When access expires (null for lifetime) */
  expiresAt?: string | null;
}

// ============================================================================
// Core Access Control Functions
// ============================================================================

/**
 * Check if an app is free (no payment required)
 * 
 * @param appId - App identifier
 * @returns true if app is free, false if paid
 * 
 * @example
 * ```typescript
 * if (isFreeApp('learn-math')) {
 *   console.log('This app is free!');
 * }
 * ```
 */
export function isFreeApp(appId: string): boolean;

/**
 * Check if an app is part of a bundle
 * 
 * @param appId - App identifier
 * @returns true if app is in a bundle
 * 
 * @example
 * ```typescript
 * if (isBundleApp('learn-ai')) {
 *   console.log('Part of AI-Developer bundle');
 * }
 * ```
 */
export function isBundleApp(appId: string): boolean;

/**
 * Check if an app requires payment
 * 
 * @param appId - App identifier
 * @returns true if app requires payment
 * 
 * @example
 * ```typescript
 * if (requiresPayment('learn-ai')) {
 *   // Show payment gate
 * }
 * ```
 */
export function requiresPayment(appId: string): boolean;

/**
 * Check if a user has access to an app
 * 
 * @param user - User object with apps array
 * @param appId - App identifier
 * @returns true if user has access
 * 
 * @example
 * ```typescript
 * const user = { id: '123', apps: ['learn-ai', 'learn-developer'] };
 * if (userHasAccess(user, 'learn-ai')) {
 *   // User can access
 * }
 * ```
 */
export function userHasAccess(user: User | null, appId: string): boolean;

/**
 * Get bundle information for an app
 * 
 * @param appId - App identifier
 * @returns Bundle config or null if not in a bundle
 * 
 * @example
 * ```typescript
 * const bundle = getBundleInfo('learn-ai');
 * if (bundle) {
 *   console.log(`Bundle: ${bundle.name}`);
 *   console.log(`Apps: ${bundle.apps.join(', ')}`);
 * }
 * ```
 */
export function getBundleInfo(appId: string): Bundle | null;

/**
 * Get all apps that will be unlocked when purchasing an app
 * 
 * @param appId - App identifier being purchased
 * @returns Array of app IDs that will be unlocked
 * 
 * @example
 * ```typescript
 * const appsToUnlock = getAppsToUnlock('learn-ai');
 * // Returns: ['learn-ai', 'learn-developer']
 * ```
 */
export function getAppsToUnlock(appId: string): AppId[];

/**
 * Get detailed access status for a user and app
 * 
 * @param user - User object
 * @param appId - App identifier
 * @returns Detailed access status
 */
export function getAccessStatus(user: User | null, appId: string): AccessStatus;

/**
 * Check if user has access to an app via bundle
 * 
 * @param userAppIds - Array of app IDs user has access to
 * @param appId - App ID to check
 * @returns true if user has access via bundle
 */
export function hasAccessViaBundle(userAppIds: string[], appId: string): boolean;

/**
 * Get a user-friendly message about bundle access
 * 
 * @param appId - App identifier
 * @returns Message string
 */
export function getBundleAccessMessage(appId: string): string;

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Grant access to a single app
 * 
 * @param params - Grant access parameters
 * @returns User app access record
 * 
 * @example
 * ```typescript
 * const access = await grantAppAccess({
 *   userId: 'user-uuid',
 *   appId: 'learn-management',
 *   grantedVia: 'payment',
 *   paymentId: 'payment-uuid',
 * });
 * ```
 */
export function grantAppAccess(params: GrantAppAccessParams): Promise<UserAppAccess>;

/**
 * Grant bundle access (unlocks all apps in bundle)
 * 
 * @param params - Grant bundle access parameters
 * @returns Bundle access result
 * 
 * @example
 * ```typescript
 * const result = await grantBundleAccess({
 *   userId: 'user-uuid',
 *   purchasedAppId: 'learn-ai',
 *   paymentId: 'payment-uuid',
 * });
 * // Unlocks both learn-ai and learn-developer
 * ```
 */
export function grantBundleAccess(params: GrantBundleAccessParams): Promise<BundleAccessResult>;

/**
 * Check if user has access to an app (database check)
 * 
 * @param userId - User UUID
 * @param appId - App identifier
 * @returns true if user has access
 * 
 * @example
 * ```typescript
 * const hasAccess = await hasAppAccess('user-uuid', 'learn-ai');
 * if (hasAccess) {
 *   // Allow access
 * }
 * ```
 */
export function hasAppAccess(userId: string, appId: string): Promise<boolean>;

/**
 * Get user with their access information
 * 
 * @param userId - User UUID
 * @returns User object with apps array
 */
export function getUserWithAccess(userId: string): Promise<User | null>;

/**
 * Get all apps a user has access to
 * 
 * @param userId - User UUID
 * @returns Array of user app access records
 */
export function getUserApps(userId: string): Promise<UserAppAccess[]>;

/**
 * Revoke user access to an app
 * 
 * @param userId - User UUID
 * @param appId - App identifier
 * @returns true if successfully revoked
 */
export function revokeAppAccess(userId: string, appId: string): Promise<boolean>;

/**
 * Get access statistics for an app
 * 
 * @param appId - App identifier (optional, omit for all apps)
 * @returns Access statistics
 */
export function getAccessStats(appId?: string): Promise<AccessStats | AccessStats[]>;

/**
 * Update payment record with bundle information
 * 
 * @param paymentId - Payment UUID
 * @param bundledApps - Array of bundled app IDs
 * @returns true if successfully updated
 */
export function updatePaymentBundleInfo(paymentId: string, bundledApps: AppId[]): Promise<boolean>;

// ============================================================================
// Configuration and Constants
// ============================================================================

/**
 * All app configurations
 */
export const APPS: Record<AppId, AppConfig>;

/**
 * App type constants
 */
export const APP_TYPE: {
  FREE: 'free';
  PAID: 'paid';
};

/**
 * All bundle configurations
 */
export const BUNDLES: Record<BundleId, Bundle>;

/**
 * Get all free apps
 * @returns Array of free app configs
 */
export function getFreeApps(): AppConfig[];

/**
 * Get all paid apps
 * @returns Array of paid app configs
 */
export function getPaidApps(): AppConfig[];

/**
 * Get app configuration
 * @param appId - App identifier
 * @returns App config or null
 */
export function getAppConfig(appId: string): AppConfig | null;

/**
 * Get bundle configuration
 * @param bundleId - Bundle identifier
 * @returns Bundle config or null
 */
export function getBundleConfig(bundleId: string): Bundle | null;

// ============================================================================
// Payment Guards and Validation
// ============================================================================

/**
 * Guard free app payment endpoints
 * 
 * @param appId - App identifier
 * @returns Payment guard result
 */
export function guardFreeAppPayment(appId: string): PaymentGuardResult;

/**
 * Higher-order function to wrap payment endpoints with free app guard
 * 
 * @param handler - Payment handler function
 * @returns Wrapped handler
 */
export function withFreeAppGuard(handler: Function): Function;

/**
 * Validate payment method
 * 
 * @param method - HTTP method
 * @returns true if valid
 */
export function validatePaymentMethod(method: string): boolean;

/**
 * Validate payment request body
 * 
 * @param body - Request body
 * @returns Object with valid flag and missing fields
 */
export function validatePaymentBody(body: any): { valid: boolean; missing: string[] };

/**
 * Complete payment endpoint guard (combines all validations)
 * 
 * @param appId - App identifier
 * @param req - Request object
 * @param res - Response object
 * @returns true if guard was triggered (response sent), false to proceed
 */
export function guardPaymentEndpoint(appId: string, req: any, res: any): boolean;
