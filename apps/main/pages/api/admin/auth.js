/**
 * Admin Authentication API
 * Handles first-time password setup and subsequent logins
 * 
 * ⚠️ FEATURE FLAG CONTROLLED - SAFE FOR PRODUCTION WITH PROPER CONFIGURATION
 * 
 * Features:
 * - Feature-flagged first-time admin setup (ADMIN_SETUP_MODE)
 * - Password-first authentication (no Supabase login required)
 * - Bcrypt password hashing
 * - JWT token-based sessions with HttpOnly cookies
 * - Persistent storage in Supabase admin_settings table
 * - Audit logging for all setup and auth events
 * 
 * Security:
 * - Passwords are hashed with bcrypt (12 rounds)
 * - Session tokens are signed with ADMIN_JWT_SECRET
 * - HttpOnly cookies prevent XSS attacks
 * - Service role key used for database access
 * - Audit logs track all admin setup and login events
 * 
 * Rollback Instructions:
 * 1. Set ADMIN_SETUP_MODE=false
 * 2. Set TEMP_SUSPEND_AUTH=false
 * 3. Drop admin_settings table in Supabase
 * 4. Restore original Supabase-based admin authentication
 * 5. Remove ADMIN_JWT_SECRET from environment
 * 6. Rotate SUPABASE_SERVICE_ROLE_KEY if exposed
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { createClient } from '@supabase/supabase-js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h'; // 24 hours for test period
const COOKIE_NAME = 'admin_token';
const PASSWORD_MIN_LENGTH = 8;

// Initialize Supabase client with service role key for admin operations
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase configuration for admin operations');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Get admin setting from database
async function getAdminSetting(key) {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - setting doesn't exist
        return null;
      }
      throw error;
    }

    return data?.value || null;
  } catch (error) {
    console.error('Error getting admin setting:', error);
    return null;
  }
}

// Set admin setting in database
async function setAdminSetting(key, value) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) throw error;
}

// Write audit log entry
async function logAuditEvent(eventType, details = {}, req = null) {
  try {
    const timestamp = new Date().toISOString();
    const ip = req ? (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown') : 'unknown';
    
    const logEntry = {
      timestamp,
      event_type: eventType,
      ip_address: ip,
      user_agent: req ? req.headers['user-agent'] : 'unknown',
      details: JSON.stringify(details),
    };

    // Try to store in database
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('admin_audit_logs')
      .insert(logEntry);

    if (error) {
      // If database logging fails, log to console as fallback
      console.warn('Failed to write audit log to database:', error);
      console.log('AUDIT LOG:', JSON.stringify(logEntry));
    } else {
      console.log(`✅ Audit log: ${eventType} from ${ip}`);
    }
  } catch (error) {
    // Fallback to console logging
    console.error('Audit logging error:', error);
    console.log(`AUDIT LOG: ${eventType}`, details);
  }
}

// Generate JWT token
function generateToken() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }

  return jwt.sign(
    { admin: true, timestamp: Date.now() },
    secret,
    { expiresIn: TOKEN_EXPIRY }
  );
}

// Verify JWT token
function verifyToken(token) {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) {
    throw new Error('ADMIN_JWT_SECRET is not configured');
  }

  try {
    const decoded = jwt.verify(token, secret);
    return decoded.admin === true;
  } catch (error) {
    return false;
  }
}

// Create HttpOnly cookie
function createCookie(token) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

// Create cookie for logout (expires immediately)
function createLogoutCookie() {
  return serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export default async function handler(req, res) {
  const { method, body } = req;

  if (method !== 'POST' && method !== 'GET') {
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  // Handle GET requests for check action
  if (method === 'GET') {
    const { action } = req.query;
    if (action === 'check') {
      try {
        const hasPassword = !!(await getAdminSetting('admin_password_hash'));
        return res.status(200).json({ hasPassword });
      } catch (error) {
        console.error('Check password error:', error);
        return res.status(500).json({ error: 'Failed to check password status' });
      }
    }
    return res.status(400).json({ error: 'Invalid action for GET request' });
  }

  const { action, password } = body;

  try {
    switch (action) {
      case 'check': {
        // Check if password has been set
        const hasPassword = !!(await getAdminSetting('admin_password_hash'));
        return res.status(200).json({ hasPassword });
      }

      case 'setup': {
        // First-time password setup
        // ⚠️ SECURITY: Only allow if ADMIN_SETUP_MODE is explicitly enabled
        const setupModeEnabled = process.env.ADMIN_SETUP_MODE === 'true' || 
                                 process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
        
        if (!setupModeEnabled) {
          await logAuditEvent('SETUP_BLOCKED_DISABLED', { 
            reason: 'ADMIN_SETUP_MODE not enabled' 
          }, req);
          return res.status(403).json({ 
            error: 'Admin setup is disabled. Enable ADMIN_SETUP_MODE to use this feature.' 
          });
        }

        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }

        // Validate password strength
        if (password.length < PASSWORD_MIN_LENGTH) {
          return res.status(400).json({ 
            error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` 
          });
        }

        // Check if password already exists
        const existingHash = await getAdminSetting('admin_password_hash');
        if (existingHash) {
          await logAuditEvent('SETUP_BLOCKED_EXISTS', { 
            reason: 'Admin already exists' 
          }, req);
          return res.status(400).json({ 
            error: 'Admin password already set. Use login instead.' 
          });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Store the hash in database
        await setAdminSetting('admin_password_hash', hash);
        
        // Store setup completion timestamp
        await setAdminSetting('admin_setup_completed_at', new Date().toISOString());
        
        // Log audit event
        await logAuditEvent('ADMIN_SETUP_SUCCESS', {
          email: body.email || 'not_provided',
          setup_completed: true,
          password_strength: password.length >= 12 ? 'strong' : 'medium'
        }, req);
        
        // Generate token and set cookie
        const token = generateToken();
        res.setHeader('Set-Cookie', createCookie(token));
        
        console.log('⚠️ IMPORTANT: Admin account created. Set ADMIN_SETUP_MODE=false and restart server.');
        
        return res.status(200).json({ 
          success: true,
          message: 'Admin password set successfully',
          token,
          instructions: 'Please set ADMIN_SETUP_MODE=false in your environment and restart the server.'
        });
      }

      case 'login': {
        // Subsequent login verification
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }

        // Get stored password hash
        const storedHash = await getAdminSetting('admin_password_hash');
        if (!storedHash) {
          await logAuditEvent('LOGIN_FAILED', { 
            reason: 'No admin password set' 
          }, req);
          return res.status(401).json({ 
            error: 'Admin password not set. Please set up admin password first.' 
          });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, storedHash);
        if (!isValid) {
          await logAuditEvent('LOGIN_FAILED', { 
            reason: 'Invalid password' 
          }, req);
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate token and set cookie
        const token = generateToken();
        res.setHeader('Set-Cookie', createCookie(token));

        await logAuditEvent('LOGIN_SUCCESS', {}, req);

        return res.status(200).json({ 
          success: true,
          message: 'Login successful',
          token,
        });
      }

      case 'verify': {
        // Verify admin token from cookie or body
        let token = req.cookies?.[COOKIE_NAME];
        
        // Fallback to token in body (for manual verification)
        if (!token && body.token) {
          token = body.token;
        }

        if (!token) {
          return res.status(401).json({ ok: false, error: 'No token provided' });
        }

        const isValid = verifyToken(token);
        
        if (isValid) {
          return res.status(200).json({ ok: true });
        } else {
          return res.status(401).json({ ok: false, error: 'Invalid or expired token' });
        }
      }

      case 'logout': {
        // Clear the admin token cookie
        res.setHeader('Set-Cookie', createLogoutCookie());
        return res.status(200).json({ 
          success: true,
          message: 'Logged out successfully' 
        });
      }

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Auth API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
