/**
 * Unified Content API - Government Jobs
 * Fetch government jobs from Supabase with filtering
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
      level,
      state,
      district,
      status = 'open',
      position_type,
      limit = 50,
      offset = 0,
    } = query;

    // Build query with count
    let queryBuilder = supabase.from('government_jobs').select('*', { count: 'exact' });

    // Apply filters
    if (level) {
      queryBuilder = queryBuilder.eq('level', level);
    }
    if (state) {
      queryBuilder = queryBuilder.eq('location_state', state);
    }
    if (district) {
      queryBuilder = queryBuilder.eq('location_district', district);
    }
    if (status && status !== 'all') {
      queryBuilder = queryBuilder.eq('status', status);
    }
    if (position_type) {
      queryBuilder = queryBuilder.eq('position_type', position_type);
    }

    // Apply pagination and ordering
    // Note: Jobs with null deadlines will appear at the end
    queryBuilder = queryBuilder
      .order('application_deadline', { ascending: true, nullsLast: true })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data, error, count } = await queryBuilder;

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      jobs: data || [],
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
