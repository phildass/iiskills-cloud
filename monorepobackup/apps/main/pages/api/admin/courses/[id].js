/**
 * Admin Course Detail API
 *
 * PATCH /api/admin/courses/[id]  — update course fields (title, slug, status, etc.)
 * DELETE /api/admin/courses/[id] — delete course
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

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Course id is required' });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  if (req.method === 'PATCH') {
    // Only allow safe fields to be updated
    const ALLOWED_FIELDS = [
      'title',
      'slug',
      'short_description',
      'full_description',
      'duration',
      'category',
      'subdomain',
      'price',
      'is_free',
      'status',
      'thumbnail_url',
    ];

    const updates = {};
    for (const field of ALLOWED_FIELDS) {
      if (field in (req.body || {})) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update' });
    }

    updates.updated_at = new Date().toISOString();

    // Set published_at when publishing for the first time
    if (updates.status === 'published' && !('published_at' in updates)) {
      updates.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (!data) {
      return res.status(404).json({ error: 'Course not found' });
    }
    return res.status(200).json({ course: data });
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['PATCH', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
