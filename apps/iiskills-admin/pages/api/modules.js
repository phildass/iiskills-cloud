/**
 * API endpoint to fetch modules from unified content sources
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

    // Fetch modules from all sources with ordering
    const data = await provider.getModules({
      order: { field: 'order', ascending: true },
    });

    return res.status(200).json({ data, error: null });
  } catch (error) {
    console.error('Error in modules API:', error);
    return res.status(500).json({ error: error.message });
  }
}
