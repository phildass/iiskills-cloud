/**
 * Access Code Generator
 * 
 * Generates unique access codes for course registration.
 */

/**
 * Generate a random access code
 * Format: XXXX-XXXX-XXXX (12 characters)
 */
export function generateAccessCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      code += '-';
    }
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return code;
}

/**
 * Validate access code format
 */
export function validateAccessCodeFormat(code) {
  const pattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return pattern.test(code);
}

/**
 * Generate multiple unique access codes
 */
export function generateMultipleCodes(count) {
  const codes = new Set();
  
  while (codes.size < count) {
    codes.add(generateAccessCode());
  }
  
  return Array.from(codes);
}
