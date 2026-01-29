/**
 * API endpoint to fetch statistics from Supabase
 * This endpoint loads real data from the production Supabase database
 */

import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Fetch all data from Supabase
    const [courses, profiles, modules, lessons] = await Promise.all([
      supabase.from('courses').select('*'),
      supabase.from('profiles').select('*'),
      supabase.from('modules').select('*'),
      supabase.from('lessons').select('*'),
    ]);

    // Check for errors
    if (courses.error) throw new Error(`Courses error: ${courses.error.message}`);
    if (profiles.error) throw new Error(`Profiles error: ${profiles.error.message}`);
    if (modules.error) throw new Error(`Modules error: ${modules.error.message}`);
    if (lessons.error) throw new Error(`Lessons error: ${lessons.error.message}`);

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
