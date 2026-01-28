/**
 * API endpoint to fetch stats from local content
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

    // Fetch all data
    const [courses, profiles, modules, lessons] = await Promise.all([
      supabase.from('courses').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('lessons').select('*'),
    ]);

    const stats = {
      totalCourses: courses.data?.length || 0,
      totalUsers: profiles.data?.length || 0,
      totalModules: modules.data?.length || 0,
      totalLessons: lessons.data?.length || 0,
    };

    return res.status(200).json({ data: stats, error: null });
  } catch (error) {
    console.error('Error in stats API:', error);
    return res.status(500).json({ error: error.message });
  }
}
