/**
 * API endpoint to fetch users/profiles from unified content sources
 * This endpoint aggregates data from both Supabase AND local content
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Import unified content provider (server-side only)
    const { createUnifiedContentProvider } = await import('../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();

    // Fetch profiles from all sources with ordering
    const data = await provider.getProfiles({
      order: { field: 'created_at', ascending: false },
    });

    return res.status(200).json({ data, error: null });
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({ error: error.message });
  }
}
