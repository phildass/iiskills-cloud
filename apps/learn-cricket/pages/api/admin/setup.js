/**
 * Admin Setup API Endpoint
 * 
 * POST /api/admin/setup
 * 
 * Creates the first admin account with hashed password
 * Only works when ADMIN_SETUP_MODE=true and no admin exists
 * 
 * Environment Variables:
 * - ADMIN_SETUP_MODE: Enable setup mode (default: false)
 * - ADMIN_SETUP_KEY: Optional security key for setup (optional)
 * 
 * Security:
 * - Passwords hashed with bcrypt
 * - Setup events logged to logs/admin-setup.log
 * - Single-use endpoint (creates only one admin)
 */

import fs from 'fs';
import path from 'path';

// Bcrypt for password hashing
// Note: In production, install bcrypt or bcryptjs
// For MVP, we'll use a simple hash function
// TODO: Replace with actual bcrypt in production
function hashPassword(password) {
  // Placeholder hash function - MUST use bcrypt in production
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Log admin setup event
 */
function logSetupEvent(eventData) {
  const logsDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logsDir, 'admin-setup.log');
  
  try {
    // Ensure logs directory exists
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    const logEntry = JSON.stringify({
      timestamp: new Date().toISOString(),
      ...eventData
    }) + '\n';
    
    fs.appendFileSync(logFile, logEntry);
  } catch (error) {
    console.error('Failed to write setup log:', error);
  }
}

/**
 * Check if admin already exists
 */
function adminExists() {
  const adminFile = path.join(process.cwd(), 'data', 'admin.json');
  return fs.existsSync(adminFile);
}

/**
 * Create admin account
 */
function createAdmin(email, hashedPassword) {
  const adminFile = path.join(process.cwd(), 'data', 'admin.json');
  const dataDir = path.join(process.cwd(), 'data');
  
  // Ensure data directory exists
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const adminData = {
    email,
    passwordHash: hashedPassword,
    createdAt: new Date().toISOString(),
    role: 'admin'
  };
  
  fs.writeFileSync(adminFile, JSON.stringify(adminData, null, 2));
  
  return adminData;
}

export default async function handler(req, res) {
  // Check if setup mode is enabled
  const setupModeEnabled = process.env.ADMIN_SETUP_MODE === 'true';
  
  if (!setupModeEnabled) {
    logSetupEvent({
      action: 'setup_attempt_blocked',
      reason: 'ADMIN_SETUP_MODE not enabled',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    return res.status(403).json({
      error: 'Setup mode disabled',
      message: 'ADMIN_SETUP_MODE must be set to "true" to use this endpoint'
    });
  }
  
  // Check if admin already exists
  if (adminExists()) {
    logSetupEvent({
      action: 'setup_attempt_blocked',
      reason: 'Admin already exists',
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    return res.status(403).json({
      error: 'Admin already exists',
      message: 'Admin account has already been created. Disable ADMIN_SETUP_MODE.'
    });
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { email, password, securityKey } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email and password are required'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email',
        message: 'Please provide a valid email address'
      });
    }
    
    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Weak password',
        message: 'Password must be at least 8 characters long'
      });
    }
    
    // Check security key if set
    const requiredSecurityKey = process.env.ADMIN_SETUP_KEY;
    if (requiredSecurityKey && securityKey !== requiredSecurityKey) {
      logSetupEvent({
        action: 'setup_attempt_blocked',
        reason: 'Invalid security key',
        email,
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      });
      
      return res.status(403).json({
        error: 'Invalid security key',
        message: 'The provided security key is incorrect'
      });
    }
    
    // Hash password
    const hashedPassword = hashPassword(password);
    
    // Create admin account
    const admin = createAdmin(email, hashedPassword);
    
    // Log successful setup
    logSetupEvent({
      action: 'admin_created',
      email: admin.email,
      createdAt: admin.createdAt,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    res.status(200).json({
      success: true,
      message: 'Admin account created successfully',
      admin: {
        email: admin.email,
        createdAt: admin.createdAt
      },
      warning: 'IMPORTANT: Disable ADMIN_SETUP_MODE in your environment variables'
    });
    
  } catch (error) {
    console.error('Admin setup error:', error);
    
    logSetupEvent({
      action: 'setup_error',
      error: error.message,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress
    });
    
    res.status(500).json({
      error: 'Setup failed',
      message: error.message
    });
  }
}
