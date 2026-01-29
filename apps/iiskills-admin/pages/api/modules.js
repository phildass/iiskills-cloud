/**
 * API endpoint to fetch modules from Supabase
 * This endpoint loads real data from the production Supabase database
 */

import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Execute query
    const { data, error } = await supabase
      .from('modules')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data, error: null });
  } catch (error) {
    console.error('Error in modules API:', error);
    return res.status(500).json({ error: error.message });
  }
}
