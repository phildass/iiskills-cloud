/**
 * Access Control Type Definitions
 * 
 * Defines types for user access records and access check results
 */

import type { AppId } from './app.types';

/**
 * How access was granted to the user
 */
export type GrantedVia = 'payment' | 'bundle' | 'admin' | 'free';

/**
 * User app access record from database
 */
export interface UserAppAccess {
  id: string;
  user_id: string;
  app_id: AppId;
  granted_via: GrantedVia;
  payment_id?: string | null;
  granted_at: Date | string;
  expires_at?: Date | string | null;
}

/**
 * Result of access check
 */
export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: 'free_app' | 'payment' | 'bundle' | 'admin' | 'no_access';
  accessRecord?: UserAppAccess | null;
  error?: string;
}

/**
 * Parameters for checking user access
 */
export interface UserAccessParams {
  userId: string;
  appId: AppId;
}

/**
 * Parameters for granting access
 */
export interface GrantAccessParams {
  userId: string;
  appId: AppId;
  grantedVia: GrantedVia;
  paymentId?: string;
  expiresAt?: Date;
}

/**
 * Result of granting access
 */
export interface GrantAccessResult {
  success: boolean;
  accessRecord?: UserAppAccess;
  error?: string;
}
