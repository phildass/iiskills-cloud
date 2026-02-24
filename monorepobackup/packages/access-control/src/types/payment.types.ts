/**
 * Payment Type Definitions
 * 
 * Defines types for payment processing and bundle access
 */

import type { AppId } from './app.types';
import type { UserAppAccess } from './access.types';

/**
 * Payment status
 */
export type PaymentStatus = 'created' | 'completed' | 'failed';

/**
 * Payment record from database
 */
export interface PaymentRecord {
  id: string;
  user_id: string;
  app_id: AppId;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  razorpay_signature?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  bundle_apps?: AppId[] | null;
  created_at: Date | string;
  confirmed_at?: Date | string | null;
}

/**
 * Parameters for granting bundle access
 */
export interface GrantBundleAccessParams {
  userId: string;
  purchasedAppId: AppId;
  paymentId: string;
}

/**
 * Result of granting bundle access
 */
export interface GrantBundleAccessResult {
  success: boolean;
  bundledApps: AppId[];
  accessRecords: UserAppAccess[];
  error?: string;
}

/**
 * Parameters for updating payment bundle info
 */
export interface UpdatePaymentBundleParams {
  paymentId: string;
  bundleApps: AppId[];
}

/**
 * Result of updating payment bundle info
 */
export interface UpdatePaymentBundleResult {
  success: boolean;
  payment?: PaymentRecord;
  error?: string;
}

/**
 * Payment guard check result
 */
export interface PaymentGuardResult {
  passed: boolean;
  reason?: 'invalid_method' | 'free_app' | 'missing_fields' | 'success';
  error?: string;
}

/**
 * Razorpay order creation params
 */
export interface RazorpayOrderParams {
  amount: number;
  currency: 'INR';
  receipt?: string;
  notes?: Record<string, string>;
}

/**
 * Razorpay payment verification params
 */
export interface RazorpayVerificationParams {
  order_id: string;
  payment_id: string;
  signature: string;
}
