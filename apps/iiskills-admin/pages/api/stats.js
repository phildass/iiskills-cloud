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
    console.log('📊 /api/stats - Fetching statistics...');
    
    // Import unified content provider (server-side only)
    // Note: Import from repo root lib directory
    const { createUnifiedContentProvider } = await import('../../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();

    // Fetch aggregated stats from all sources
    const stats = await provider.getStats();

    console.log('✅ /api/stats - Success:', {
      totalCourses: stats.totalCourses,
      totalUsers: stats.totalUsers,
      totalModules: stats.totalModules,
      totalLessons: stats.totalLessons,
    });

    return res.status(200).json({ data: stats, error: null });
  } catch (error) {
    // Enhanced error logging
    console.error('='.repeat(80));
    console.error('❌ ERROR IN /api/stats');
    console.error('='.repeat(80));
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Request Method:', req.method);
    console.error('Request URL:', req.url);
    console.error('Timestamp:', new Date().toISOString());
    console.error('Environment Variables:', {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      SUPABASE_SUSPENDED: process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED,
      USE_LOCAL_CONTENT: process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT,
      NODE_ENV: process.env.NODE_ENV,
    });
    console.error('='.repeat(80));
    
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
