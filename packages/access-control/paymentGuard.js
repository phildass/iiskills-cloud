/**
 * Payment Guard Middleware
 * 
 * Prevents payment attempts on free apps.
 * Use this at the start of payment confirmation endpoints.
 * 
 * @module paymentGuard
 */

import { isFreeApp } from './accessControl.js';

/**
 * Create payment guard middleware for an app
 * 
 * Returns early response if app is free (should not accept payments).
 * Use at the start of payment confirmation handlers.
 * 
 * @param {string} appId - App identifier
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} True if guard triggered (app is free), false if safe to proceed
 * 
 * @example
 * export default async function handler(req, res) {
 *   // Guard against payments on free apps
 *   if (guardFreeAppPayment('learn-math', req, res)) {
 *     return; // Response already sent
 *   }
 *   
 *   // Proceed with payment processing...
 * }
 */
export function guardFreeAppPayment(appId, req, res) {
  if (isFreeApp(appId)) {
    res.status(400).json({ 
      error: 'This app is free and does not require payment',
      appId,
      isFree: true,
      message: `${appId} is a free app. No payment is needed to access it.`,
    });
    return true; // Guard triggered
  }
  return false; // Safe to proceed
}

/**
 * Higher-order function to create payment guard middleware
 * 
 * Wraps a payment handler and automatically guards free apps.
 * 
 * @param {string} appId - App identifier
 * @param {Function} handler - Payment handler function
 * @returns {Function} Wrapped handler with guard
 * 
 * @example
 * const paymentHandler = withFreeAppGuard('learn-ai', async (req, res) => {
 *   // Your payment logic here
 * });
 * 
 * export default paymentHandler;
 */
export function withFreeAppGuard(appId, handler) {
  return async function guardedHandler(req, res) {
    // Check if app is free
    if (guardFreeAppPayment(appId, req, res)) {
      return; // Response already sent by guard
    }
    
    // App requires payment - proceed with handler
    return handler(req, res);
  };
}

/**
 * Validate payment request method
 * 
 * Ensures only POST requests are accepted for payments.
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} True if method is invalid, false if valid
 */
export function validatePaymentMethod(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed', allowedMethods: ['POST'] });
    return true; // Invalid method
  }
  return false; // Valid method
}

/**
 * Validate payment request body
 * 
 * Ensures required payment fields are present.
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {string[]} requiredFields - Required field names
 * @returns {boolean} True if validation failed, false if passed
 */
export function validatePaymentBody(req, res, requiredFields = ['transactionId', 'email', 'amount']) {
  const missing = requiredFields.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    res.status(400).json({ 
      error: 'Missing required fields',
      missingFields: missing,
      requiredFields,
    });
    return true; // Validation failed
  }
  return false; // Validation passed
}

/**
 * Complete payment guard and validation chain
 * 
 * Combines all common payment endpoint checks.
 * 
 * @param {string} appId - App identifier
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {boolean} True if any check failed, false if all passed
 * 
 * @example
 * export default async function handler(req, res) {
 *   if (guardPaymentEndpoint('learn-management', req, res)) {
 *     return; // Response already sent
 *   }
 *   
 *   // All guards passed - proceed with payment
 * }
 */
export function guardPaymentEndpoint(appId, req, res) {
  // Check method
  if (validatePaymentMethod(req, res)) return true;
  
  // Check if app is free
  if (guardFreeAppPayment(appId, req, res)) return true;
  
  // Validate body
  if (validatePaymentBody(req, res)) return true;
  
  // All guards passed
  return false;
}
