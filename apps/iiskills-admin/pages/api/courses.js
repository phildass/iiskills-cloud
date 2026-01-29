/**
 * API endpoint to fetch courses from unified content sources
 * This endpoint aggregates data from both Supabase AND local content
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📚 /api/courses - Fetching courses...');
    
    // Import unified content provider (server-side only)
    // Note: Import from repo root lib directory
    const { createUnifiedContentProvider } = await import('../../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();

    // Get query parameters
    const { subdomain } = req.query;

    // Build query options
    const options = {
      filters: subdomain ? { subdomain } : {},
      order: { field: 'created_at', ascending: false },
    };

    // Fetch courses from all sources
    const data = await provider.getCourses(options);
    
    console.log(`✅ /api/courses - Success: ${data.length} courses found`);

    return res.status(200).json({ data, error: null });
  } catch (error) {
    // Enhanced error logging
    console.error('='.repeat(80));
    console.error('❌ ERROR IN /api/courses');
    console.error('='.repeat(80));
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Query Parameters:', req.query);
    console.error('Timestamp:', new Date().toISOString());
    console.error('='.repeat(80));
    
    return res.status(500).json({ 
      error: error.message,
      
      timestamp: new Date().toISOString(),
      // Only include stack in development
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
}
