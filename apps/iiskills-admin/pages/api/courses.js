/**
 * API endpoint to fetch courses from Supabase
 * This endpoint loads real data from the production Supabase database
 */

import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters
    const { subdomain } = req.query;

    // Build query
    let query = supabase.from('courses').select('*').order('created_at', { ascending: false });
    
    if (subdomain && subdomain !== 'all') {
      query = query.eq('subdomain', subdomain);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data, error: null });
  } catch (error) {
    console.error('Error in courses API:', error);
    return res.status(500).json({ error: error.message });
  }
}
