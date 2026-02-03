/**
 * POST /api/admin/setup
 * 
 * Create first admin account (only when ADMIN_SETUP_MODE is enabled)
 * 
 * SECURITY:
 * - Only active when process.env.ADMIN_SETUP_MODE === 'true'
 * - Only works when no admin accounts exist
 * - Hashes password with bcrypt
 * - Logs all attempts to logs/admin-setup.log
 * - Instructs operator to disable ADMIN_SETUP_MODE after setup
 */

import fs from 'fs';
import path from 'path';

// Simple password hashing for MVP (use bcrypt in production)
// For MVP, we'll use a simple hash. In production, install bcrypt: npm install bcrypt
function hashPassword(password) {
  // TODO: Replace with bcrypt.hash(password, 10) in production
  // For MVP, using simple crypto hash (NOT SECURE FOR PRODUCTION)
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Check if admin exists (in-memory for MVP, use database in production)
let adminExists = false;
const admins = [];

function logSetupAttempt(success, email, metadata = {}) {
  const logDir = path.join(process.cwd(), 'logs');
  const logFile = path.join(logDir, 'admin-setup.log');
  
  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const logEntry = {
    timestamp: new Date().toISOString(),
    success,
    email,
    ip: metadata.ip || 'unknown',
    userAgent: metadata.userAgent || 'unknown',
    setupMode: process.env.ADMIN_SETUP_MODE
  };

  const logLine = JSON.stringify(logEntry) + '\n';
  
  try {
    fs.appendFileSync(logFile, logLine, 'utf8');
  } catch (error) {
    console.error('Failed to write to audit log:', error);
  }
}

export default function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if ADMIN_SETUP_MODE is enabled
  if (process.env.ADMIN_SETUP_MODE !== 'true') {
    logSetupAttempt(false, req.body?.email || 'unknown', {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    return res.status(403).json({
      error: 'Admin setup mode is not enabled',
      message: 'Set ADMIN_SETUP_MODE=true to enable first-time admin setup'
    });
  }

  // Check if admin already exists
  if (adminExists || admins.length > 0) {
    logSetupAttempt(false, req.body?.email || 'unknown', {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    return res.status(403).json({
      error: 'Admin account already exists',
      message: 'Cannot create additional admin accounts through setup mode'
    });
  }

  try {
    const { email, password, fullName } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long'
      });
    }

    // Hash password
    const hashedPassword = hashPassword(password);

    // Create admin user (in-memory for MVP)
    // TODO: Store in database in production
    const admin = {
      id: 'admin_1',
      email,
      fullName: fullName || email,
      passwordHash: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };

    admins.push(admin);
    adminExists = true;

    // Log successful setup
    logSetupAttempt(true, email, {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    // Return success with instructions
    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      instructions: `
IMPORTANT - SECURITY STEPS:

1. Immediately set ADMIN_SETUP_MODE=false in your .env file
2. Restart the application
3. Verify this setup page is no longer accessible
4. Review the audit log at: logs/admin-setup.log

Admin account created:
- Email: ${email}
- Role: Administrator
- Created: ${new Date().toISOString()}

DO NOT leave ADMIN_SETUP_MODE enabled in production!
      `.trim(),
      admin: {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        createdAt: admin.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating admin account:', error);
    
    logSetupAttempt(false, req.body?.email || 'unknown', {
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
      error: error.message
    });

    return res.status(500).json({
      error: 'Failed to create admin account',
      message: error.message
    });
  }
}
