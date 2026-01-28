/**
 * API endpoint to fetch users/profiles from local content
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

    // Execute query
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data, error: null });
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({ error: error.message });
  }
}
