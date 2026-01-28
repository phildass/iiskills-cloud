/**
 * API endpoint to fetch courses from local content
 * This endpoint loads data server-side from seeds/content.json
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Import local content provider (server-side only)
    const { createLocalContentClient } = require('../../lib/localContentProvider.js');
    const supabase = createLocalContentClient();

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
