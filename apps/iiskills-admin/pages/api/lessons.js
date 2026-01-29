/**
 * API endpoint to fetch lessons from unified content sources
 * This endpoint aggregates data from both Supabase AND local content
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📝 /api/lessons - Fetching lessons...');
    
    // Import unified content provider (server-side only)
    // Note: Import from repo root lib directory
    const { createUnifiedContentProvider } = await import('../../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();

    // Fetch lessons from all sources with ordering
    const data = await provider.getLessons({
      order: { field: 'order', ascending: true },
    });
    
    console.log(`✅ /api/lessons - Success: ${data.length} lessons found`);

    return res.status(200).json({ data, error: null });
  } catch (error) {
    // Enhanced error logging
    console.error('='.repeat(80));
    console.error('❌ ERROR IN /api/lessons');
    console.error('='.repeat(80));
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Timestamp:', new Date().toISOString());
    console.error('='.repeat(80));
    
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
