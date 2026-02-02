/**
 * Admin Authentication API
 * Handles first-time password setup and subsequent logins
 * 
 * ⚠️ TEST MODE ONLY - DO NOT KEEP IN PRODUCTION
 * 
 * Features:
 * - Password-first authentication (no Supabase login required)
 * - Bcrypt password hashing
 * - JWT token-based sessions with HttpOnly cookies
 * - Persistent storage in Supabase admin_settings table
 * 
 * Security:
 * - Passwords are hashed with bcrypt (12 rounds)
 * - Session tokens are signed with ADMIN_JWT_SECRET
 * - HttpOnly cookies prevent XSS attacks
 * - Service role key used for database access
 * 
 * Rollback Instructions:
 * 1. Remove this implementation
 * 2. Drop admin_settings table in Supabase
 * 3. Restore original Supabase-based admin authentication
 * 4. Remove ADMIN_JWT_SECRET from environment
 * 5. Rotate SUPABASE_SERVICE_ROLE_KEY if exposed
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
          return res.status(400).json({ 
            error: 'Admin password already set. Use login instead.' 
          });
        }

        // Hash the password
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        
        // Store the hash in database
        await setAdminSetting('admin_password_hash', hash);
        
        // Generate token and set cookie
        const token = generateToken();
        res.setHeader('Set-Cookie', createCookie(token));
        
        return res.status(200).json({ 
          success: true,
          message: 'Admin password set successfully',
          token,
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
          return res.status(401).json({ 
            error: 'Admin password not set. Please set up admin password first.' 
          });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, storedHash);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate token and set cookie
        const token = generateToken();
        res.setHeader('Set-Cookie', createCookie(token));

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
