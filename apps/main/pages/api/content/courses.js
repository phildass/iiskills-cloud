/**
 * Unified Content API - Courses
 * Fetch courses from Supabase with filtering and pagination
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const {
      subdomain,
      category,
      status = 'published',
      is_free,
      limit = 50,
      offset = 0,
      include_modules = 'false',
    } = query;

    // Build query
    let queryBuilder = supabase
      .from('courses')
      .select(
        include_modules === 'true'
          ? `
            *,
            modules (
              id,
              title,
              slug,
              description,
              order_index,
              duration
            )
          `
          : '*'
      );

    // Apply filters
    if (subdomain) {
      queryBuilder = queryBuilder.eq('subdomain', subdomain);
    }
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    if (status) {
      queryBuilder = queryBuilder.eq('status', status);
    }
    if (is_free !== undefined) {
      queryBuilder = queryBuilder.eq('is_free', is_free === 'true');
    }

    // Apply pagination and ordering
    queryBuilder = queryBuilder
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      courses: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
