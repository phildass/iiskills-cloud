/**
 * Unified Content API - Modules
 * Fetch modules for a specific course from Supabase
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const {
      course_id,
      course_slug,
      include_lessons = 'false',
      is_published = 'true',
    } = query;

    if (!course_id && !course_slug) {
      return res.status(400).json({ error: 'Missing course_id or course_slug' });
    }

    // First, get the course ID if slug is provided
    let courseId = course_id;
    if (!courseId && course_slug) {
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', course_slug)
        .single();

      if (courseError || !courseData) {
        return res.status(404).json({ error: 'Course not found' });
      }
      courseId = courseData.id;
    }

    // Build query
    let queryBuilder = supabase
      .from('modules')
      .select(
        include_lessons === 'true'
          ? `
            *,
            lessons (
              id,
              title,
              slug,
              content_type,
              duration,
              order_index,
              is_free,
              is_published
            )
          `
          : '*'
      )
      .eq('course_id', courseId);

    // Apply filters
    if (is_published !== 'all') {
      queryBuilder = queryBuilder.eq('is_published', is_published === 'true');
    }

    // Order by index
    queryBuilder = queryBuilder.order('order_index', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      modules: data || [],
      course_id: courseId,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
