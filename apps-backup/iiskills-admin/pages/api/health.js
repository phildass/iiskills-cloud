/**
 * Health Check API Endpoint
 * 
 * This endpoint provides comprehensive system diagnostics for the admin panel.
 * Use this to verify that all components are functioning correctly in production.
 * 
 * Usage:
 *   GET /api/health
 * 
 * Returns:
 *   - System status (OK/WARNING/ERROR)
 *   - Data source availability (Supabase, Local Content)
 *   - Environment configuration
 *   - Timestamp
 *   - Sample data counts
 */

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    console.log('🏥 /api/health - Running health check...');
    
    // Collect environment information
    const env = {
      nodeEnv: process.env.NODE_ENV,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      supabaseSuspended: process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true',
      useLocalContent: process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === 'true',
    };

    // Try to initialize the unified provider
    const { createUnifiedContentProvider } = await import('../../../../lib/unifiedContentProvider.js');
    const provider = await createUnifiedContentProvider();
    
    // Get source status
    const sourceStatus = provider.getSourceStatus();
    
    // Try to fetch sample data to verify functionality
    let dataCounts = {
      courses: 0,
      modules: 0,
      lessons: 0,
      users: 0,
    };
    
    let dataErrors = [];
    
    try {
      const courses = await provider.getCourses();
      dataCounts.courses = courses.length;
    } catch (error) {
      dataErrors.push({ endpoint: 'getCourses', error: error.message });
    }
    
    try {
      const modules = await provider.getModules();
      dataCounts.modules = modules.length;
    } catch (error) {
      dataErrors.push({ endpoint: 'getModules', error: error.message });
    }
    
    try {
      const lessons = await provider.getLessons();
      dataCounts.lessons = lessons.length;
    } catch (error) {
      dataErrors.push({ endpoint: 'getLessons', error: error.message });
    }
    
    try {
      const profiles = await provider.getProfiles();
      dataCounts.users = profiles.length;
    } catch (error) {
      dataErrors.push({ endpoint: 'getProfiles', error: error.message });
    }
    
    // Determine overall health status
    let status = 'OK';
    let message = 'All systems operational';
    
    if (dataErrors.length > 0) {
      status = 'ERROR';
      message = `${dataErrors.length} data source(s) failed`;
    } else if (!sourceStatus.supabase && !sourceStatus.local) {
      status = 'ERROR';
      message = 'No data sources available';
    } else if (!sourceStatus.supabase || !sourceStatus.local) {
      status = 'WARNING';
      message = sourceStatus.supabase ? 'Running on Supabase only' : 'Running on local content only';
    }
    
    const responseTime = Date.now() - startTime;
    
    const healthReport = {
      status,
      message,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      environment: env,
      dataSources: {
        supabase: sourceStatus.supabase ? 'AVAILABLE' : 'NOT AVAILABLE',
        localContent: sourceStatus.local ? 'AVAILABLE' : 'NOT AVAILABLE',
        mode: sourceStatus.mode,
      },
      dataCounts,
      errors: dataErrors.length > 0 ? dataErrors : undefined,
    };
    
    console.log('✅ /api/health - Health check complete:', status);
    
    // Return 200 for OK/WARNING, 503 for ERROR
    const statusCode = status === 'ERROR' ? 503 : 200;
    return res.status(statusCode).json(healthReport);
    
  } catch (error) {
    console.error('❌ /api/health - Health check failed:', error);
    
    return res.status(503).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: error.message,
      stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  }
}
