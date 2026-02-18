/**
 * Universal Access Check API Endpoint Template
 * 
 * This endpoint can be used by any app to check if a user has access.
 * Copy this to each app's pages/api/users/check-access.js
 * 
 * Usage:
 * GET /api/users/check-access?appId=learn-ai
 * 
 * Returns:
 * {
 *   hasAccess: boolean,
 *   userId: string|null,
 *   apps: string[] (all accessible apps),
 *   bundledApps: string[] (apps unlocked via bundle)
 * }
 */

import { createClient } from '@supabase/supabase-js';
import { hasAppAccess, getUserApps } from '../../../../../lib/accessManager';

// Initialize Supabase client
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY - access check requires service role privileges');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { appId } = req.query;
    
    if (!appId) {
      return res.status(400).json({ error: 'appId is required' });
    }

    // Get user from session
    const supabase = getSupabaseClient();
    const authHeader = req.headers.authorization;
    
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (!error && user) {
        userId = user.id;
      }
    }
    
    // Check access
    const access = await hasAppAccess(userId, appId);
    
    // If authenticated, also return all accessible apps
    let apps = [];
    if (userId) {
      apps = await getUserApps(userId);
    }
    
    return res.status(200).json({
      hasAccess: access,
      userId: userId || null,
      apps: apps.map(a => a.app_id),
      bundledApps: apps.filter(a => a.granted_via === 'bundle').map(a => a.app_id),
    });
  } catch (error) {
    console.error('Access check error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
