/**
 * Admin Courses API
 *
 * GET  /api/admin/courses        — list all courses (service role, bypasses RLS)
 * POST /api/admin/courses        — create a new course
 *
 * Requires valid admin_session cookie or x-admin-secret header.
 * All DB operations use SUPABASE_SERVICE_ROLE_KEY — no per-user permissions needed.
 */

import { validateAdminRequest, createServiceRoleClient } from '../../../../lib/adminAuth';

export default async function handler(req, res) {
  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || 'Unauthorized' });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  if (req.method === 'GET') {
    const { subdomain, status } = req.query;

    let query = supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (subdomain && subdomain !== 'all') {
      query = query.eq('subdomain', subdomain);
    }
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ courses: data });
  }

  if (req.method === 'POST') {
    const {
      title,
      slug,
      short_description,
      full_description,
      duration,
      category,
      subdomain,
      price,
      is_free,
      status,
    } = req.body || {};

    if (!title || !slug) {
      return res.status(400).json({ error: 'title and slug are required' });
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({
        title,
        slug,
        short_description: short_description || null,
        full_description: full_description || null,
        duration: duration || null,
        category: category || null,
        subdomain: subdomain || 'main',
        price: price ?? 0,
        is_free: is_free !== false,
        status: status || 'draft',
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(201).json({ course: data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
