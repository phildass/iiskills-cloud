/**
 * Mock Database for Payment, OTP, and Membership Management
 * 
 * This is a temporary in-memory data structure for development and testing.
 * In production, this should be replaced with a real database (Supabase, PostgreSQL, etc.)
 * 
 * Data Structure:
 * - payments: Razorpay payment records
 * - otps: OTP records for verification
 * - memberships: Active membership records
 */

// In-memory storage (reset on server restart)
const mockDB = {
  payments: new Map(), // Key: order_id, Value: payment record
  otps: new Map(),     // Key: user_email + app_id, Value: OTP record
  memberships: new Map(), // Key: user_email + app_id, Value: membership record
};

/**
 * Store a payment record
 * @param {Object} paymentData - Payment information
 * @returns {Object} Stored payment record
 */
export function storePayment(paymentData) {
  const record = {
    ...paymentData,
    created_at: new Date().toISOString(),
  };
  
  mockDB.payments.set(paymentData.order_id, record);
  console.log("[MockDB] Payment stored:", paymentData.order_id);
  
  return record;
}

/**
 * Get a payment record by order ID
 * @param {string} orderId - Razorpay order ID
 * @returns {Object|null} Payment record or null
 */
export function getPayment(orderId) {
  return mockDB.payments.get(orderId) || null;
}

/**
 * Store an OTP record
 * @param {string} email - User email
 * @param {string} appId - Application ID
 * @param {string} otp - Generated OTP
 * @param {string} orderId - Associated payment order ID
 * @returns {Object} Stored OTP record
 */
export function storeOTP(email, appId, otp, orderId) {
  const key = `${email.toLowerCase()}:${appId}`;
  const record = {
    email: email.toLowerCase(),
    app_id: appId,
    otp,
    order_id: orderId,
    verified: false,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
  };
  
  mockDB.otps.set(key, record);
  console.log("[MockDB] OTP stored for:", email, appId);
  
  return record;
}

/**
 * Verify OTP for a user and app
 * @param {string} email - User email
 * @param {string} appId - Application ID
 * @param {string} otp - OTP to verify
 * @returns {Object} Verification result
 */
export function verifyOTP(email, appId, otp) {
  const key = `${email.toLowerCase()}:${appId}`;
  const record = mockDB.otps.get(key);
  
  if (!record) {
    return { valid: false, error: "OTP not found" };
  }
  
  if (record.verified) {
    return { valid: false, error: "OTP already used" };
  }
  
  if (new Date(record.expires_at) < new Date()) {
    return { valid: false, error: "OTP expired" };
  }
  
  if (record.otp !== otp) {
    return { valid: false, error: "Invalid OTP" };
  }
  
  // Mark as verified
  record.verified = true;
  record.verified_at = new Date().toISOString();
  mockDB.otps.set(key, record);
  
  console.log("[MockDB] OTP verified for:", email, appId);
  
  return { valid: true, record };
}

/**
 * Store a membership record
 * @param {string} email - User email
 * @param {string} appId - Application ID
 * @param {Date} expiryDate - Membership expiry date
 * @param {string} orderId - Associated payment order ID
 * @returns {Object} Stored membership record
 */
export function storeMembership(email, appId, expiryDate, orderId) {
  const key = `${email.toLowerCase()}:${appId}`;
  const record = {
    email: email.toLowerCase(),
    app_id: appId,
    order_id: orderId,
    status: "active",
    activated_at: new Date().toISOString(),
    expires_at: expiryDate.toISOString(),
  };
  
  mockDB.memberships.set(key, record);
  console.log("[MockDB] Membership activated for:", email, appId);
  
  return record;
}

/**
 * Get membership record for a user and app
 * @param {string} email - User email
 * @param {string} appId - Application ID
 * @returns {Object|null} Membership record or null
 */
export function getMembership(email, appId) {
  const key = `${email.toLowerCase()}:${appId}`;
  const record = mockDB.memberships.get(key);
  
  if (!record) {
    return null;
  }
  
  // Check if expired
  if (new Date(record.expires_at) < new Date()) {
    record.status = "expired";
  }
  
  return record;
}

/**
 * Get all records (for debugging/admin purposes)
 * @returns {Object} All database contents
 */
export function getAllRecords() {
  return {
    payments: Array.from(mockDB.payments.entries()),
    otps: Array.from(mockDB.otps.entries()),
    memberships: Array.from(mockDB.memberships.entries()),
  };
}

/**
 * Clear all records (for testing purposes)
 */
export function clearAllRecords() {
  mockDB.payments.clear();
  mockDB.otps.clear();
  mockDB.memberships.clear();
  console.log("[MockDB] All records cleared");
}
