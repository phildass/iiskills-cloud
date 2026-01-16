import { createClient } from "@supabase/supabase-js";

/**
 * Courses API
 * 
 * Handles CRUD operations for courses
 * Publishing a course automatically triggers newsletter generation
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

/**
 * GET - Fetch courses
 */
async function handleGet(req, res) {
  const { id, slug, status } = req.query;

  try {
    let query = supabase.from('courses').select('*');

    if (id) {
      query = query.eq('id', id).single();
    } else if (slug) {
      query = query.eq('slug', slug).single();
    } else {
      // List all courses
      if (status) {
        query = query.eq('status', status);
      }
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return res.status(200).json({ data });

  } catch (error) {
    console.error('GET courses error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * POST - Create new course
 */
async function handlePost(req, res) {
  try {
    const courseData = req.body;

    // Generate slug from title if not provided
    if (!courseData.slug) {
      courseData.slug = generateSlug(courseData.title);
    }

    const { data, error } = await supabase
      .from('courses')
      .insert([courseData])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      message: 'Course created successfully',
      data
    });

  } catch (error) {
    console.error('POST course error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * PUT - Update course
 */
async function handlePut(req, res) {
  try {
    const { id } = req.query;
    const courseData = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Course ID required' });
    }

    // If slug is being updated, regenerate it
    if (courseData.title && !courseData.slug) {
      courseData.slug = generateSlug(courseData.title);
    }

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // If status changed to 'published', newsletter will be auto-queued by trigger
    let message = 'Course updated successfully';
    if (courseData.status === 'published') {
      message = 'Course published! Newsletter will be generated automatically.';
    }

    return res.status(200).json({
      message,
      data
    });

  } catch (error) {
    console.error('PUT course error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE - Delete course
 */
async function handleDelete(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'Course ID required' });
    }

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return res.status(200).json({
      message: 'Course deleted successfully'
    });

  } catch (error) {
    console.error('DELETE course error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/**
 * Generate URL-friendly slug from title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
