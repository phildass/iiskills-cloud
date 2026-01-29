/**
 * API endpoint to fetch stats from unified content sources
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

    // Fetch aggregated stats from all sources
    const stats = await provider.getStats();

    return res.status(200).json({ data: stats, error: null });
  } catch (error) {
    console.error('Error in stats API:', error);
    return res.status(500).json({ error: error.message });
  }
}
