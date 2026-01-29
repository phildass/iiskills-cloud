/**
 * Unified Content API - Lessons
 * Fetch lessons for a specific module from Supabase
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
      module_id,
      module_slug,
      content_type,
      is_published = 'true',
      include_questions = 'false',
    } = query;

    if (!module_id && !module_slug) {
      return res.status(400).json({ error: 'Missing module_id or module_slug' });
    }

    // First, get the module ID if slug is provided
    let moduleId = module_id;
    if (!moduleId && module_slug) {
      const { data: moduleData, error: moduleError } = await supabase
        .from('modules')
        .select('id')
        .eq('slug', module_slug)
        .single();

      if (moduleError || !moduleData) {
        return res.status(404).json({ error: 'Module not found' });
      }
      moduleId = moduleData.id;
    }

    // Build query
    let queryBuilder = supabase
      .from('lessons')
      .select(
        include_questions === 'true'
          ? `
            *,
            questions (
              id,
              question_text,
              question_type,
              options,
              difficulty,
              points
            )
          `
          : '*'
      )
      .eq('module_id', moduleId);

    // Apply filters
    if (is_published !== 'all') {
      queryBuilder = queryBuilder.eq('is_published', is_published === 'true');
    }
    if (content_type) {
      queryBuilder = queryBuilder.eq('content_type', content_type);
    }

    // Order by index
    queryBuilder = queryBuilder.order('order_index', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      lessons: data || [],
      module_id: moduleId,
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
