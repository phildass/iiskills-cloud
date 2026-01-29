/**
 * Unified Content API - Geography
 * Fetch hierarchical geography data from Supabase
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
      type,
      parent_id,
      name,
      include_children = 'false',
    } = query;

    // Build query
    let queryBuilder = supabase.from('geography');

    if (include_children === 'true') {
      queryBuilder = queryBuilder.select(`
        *,
        children:geography!parent_id (
          id,
          name,
          type,
          code
        )
      `);
    } else {
      queryBuilder = queryBuilder.select('*');
    }

    // Apply filters
    if (type) {
      queryBuilder = queryBuilder.eq('type', type);
    }
    if (parent_id) {
      queryBuilder = queryBuilder.eq('parent_id', parent_id);
    }
    if (name) {
      queryBuilder = queryBuilder.ilike('name', `%${name}%`);
    }

    // Order by name
    queryBuilder = queryBuilder.order('name', { ascending: true });

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      geography: data || [],
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
