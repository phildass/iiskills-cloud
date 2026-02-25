// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This admin authentication API has been disabled.
// Authentication is no longer required - all admin pages are publicly accessible.
// This file has been commented out to prevent authentication enforcement.
// ============================================================================

/**
 * Admin Authentication API - DISABLED
 *
 * This API previously handled admin authentication with:
 * - First-time password setup
 * - Login verification
 * - JWT token-based sessions
 * - Password hashing with bcrypt
 *
 * All authentication has been removed. Admin pages are now publicly accessible.
 */

export default async function handler(req, res) {
  // Return message that authentication is disabled
  return res.status(200).json({
    message: "Authentication is disabled. All content is publicly accessible.",
    disabled: true
  });
}

/*
// ============================================================================
// ORIGINAL ADMIN AUTHENTICATION API - DISABLED
// ============================================================================
// All code below has been commented out for open access refactor
// ============================================================================

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { createClient } from '@supabase/supabase-js';

const SALT_ROUNDS = 12;
const TOKEN_EXPIRY = '24h';
const COOKIE_NAME = 'admin_token';
const PASSWORD_MIN_LENGTH = 8;

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

async function setAdminSetting(key, value) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) throw error;
}

async function logAuditEvent(eventType, details = {}, req = null) {
  try {
    const timestamp = new Date().toISOString();
    let ip = 'unknown';
    if (req) {
      ip = req.headers['x-real-ip'] || 
           req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
           req.connection?.remoteAddress || 
           req.socket?.remoteAddress ||
           'unknown';
    }
    
    const logEntry = {
      timestamp,
      event_type: eventType,
      ip_address: ip,
      user_agent: req ? req.headers['user-agent'] : 'unknown',
      details: details,
    };

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from('admin_audit_logs')
      .insert(logEntry);

    if (error) {
      console.warn('Failed to write audit log to database:', error);
      console.log('AUDIT LOG:', JSON.stringify(logEntry));
    } else {
      console.log(`✅ Audit log: ${eventType} from ${ip}`);
    }
  } catch (error) {
    console.error('Audit logging error:', error);
    console.log(`AUDIT LOG: ${eventType}`, details);
  }
}

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

function createCookie(token) {
  return serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
}

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
        const hasPassword = !!(await getAdminSetting('admin_password_hash'));
        return res.status(200).json({ hasPassword });
      }

      case 'setup': {
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

        if (password.length < PASSWORD_MIN_LENGTH) {
          return res.status(400).json({ 
            error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` 
          });
        }

        const existingHash = await getAdminSetting('admin_password_hash');
        if (existingHash) {
          await logAuditEvent('SETUP_BLOCKED_EXISTS', { 
            reason: 'Admin already exists' 
          }, req);
          return res.status(400).json({ 
            error: 'Admin password already set. Use login instead.' 
          });
        }

        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        await setAdminSetting('admin_password_hash', hash);
        await setAdminSetting('admin_setup_completed_at', new Date().toISOString());
        
        await logAuditEvent('ADMIN_SETUP_SUCCESS', {
          email: body.email || 'not_provided',
          setup_completed: true,
          password_strength: password.length >= 12 ? 'strong' : 'medium'
        }, req);
        
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
        if (!password) {
          return res.status(400).json({ error: 'Password is required' });
        }

        const storedHash = await getAdminSetting('admin_password_hash');
        if (!storedHash) {
          await logAuditEvent('LOGIN_FAILED', { 
            reason: 'No admin password set' 
          }, req);
          return res.status(401).json({ 
            error: 'Admin password not set. Please set up admin password first.' 
          });
        }

        const isValid = await bcrypt.compare(password, storedHash);
        if (!isValid) {
          await logAuditEvent('LOGIN_FAILED', { 
            reason: 'Invalid password' 
          }, req);
          return res.status(401).json({ error: 'Invalid password' });
        }

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
        let token = req.cookies?.[COOKIE_NAME];
        
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
*/
