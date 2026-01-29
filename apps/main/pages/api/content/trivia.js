/**
 * Unified Content API - Trivia
 * Fetch trivia questions from Supabase
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
      app_subdomain,
      category,
      subcategory,
      difficulty,
      limit = 20,
      offset = 0,
      random = 'false',
    } = query;

    // Build query
    let queryBuilder = supabase
      .from('trivia')
      .select('*')
      .eq('is_published', true);

    // Apply filters
    if (app_subdomain) {
      queryBuilder = queryBuilder.eq('app_subdomain', app_subdomain);
    }
    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }
    if (subcategory) {
      queryBuilder = queryBuilder.eq('subcategory', subcategory);
    }
    if (difficulty) {
      queryBuilder = queryBuilder.eq('difficulty', difficulty);
    }

    // Apply pagination
    queryBuilder = queryBuilder.range(
      parseInt(offset),
      parseInt(offset) + parseInt(limit) - 1
    );

    // Random order or default
    if (random === 'true') {
      // Note: For production, consider using a view with random ordering
      // or implement client-side randomization for better performance
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    } else {
      queryBuilder = queryBuilder.order('created_at', { ascending: false });
    }

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    // Shuffle if random is requested (client-side shuffle for simplicity)
    let results = data || [];
    if (random === 'true' && results.length > 0) {
      results = results.sort(() => Math.random() - 0.5);
    }

    return res.status(200).json({
      trivia: results,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
