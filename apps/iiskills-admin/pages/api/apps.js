/**
 * API endpoint to get all apps with content
 * Returns list of all apps and their content counts
 */

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📱 /api/apps - Fetching all apps...');
    
    // Import unified content provider (server-side only)
    const { createUnifiedContentProvider } = await import('../../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();

    // Fetch all apps
    const apps = await provider.getAllApps();
    
    console.log(`✅ /api/apps - Success: ${apps.length} apps found`);

    return res.status(200).json({ data: apps, error: null });
  } catch (error) {
    // Enhanced error logging
    console.error('='.repeat(80));
    console.error('❌ ERROR IN /api/apps');
    console.error('='.repeat(80));
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
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
