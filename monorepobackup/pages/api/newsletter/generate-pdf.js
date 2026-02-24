import { createClient } from '@supabase/supabase-js';

/**
 * Newsletter PDF Generation API
 * 
 * Generates a PDF version of a newsletter
 * This endpoint is used to create downloadable PDFs
 */

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Newsletter ID is required' });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Fetch the newsletter
    const { data: newsletter, error } = await supabase
      .from('newsletter_editions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Return newsletter data for client-side PDF generation
    // We'll use jsPDF on the client side to generate the PDF
    res.status(200).json({
      success: true,
      newsletter: {
        id: newsletter.id,
        title: newsletter.title,
        edition_number: newsletter.edition_number,
        intro_text: newsletter.intro_text,
        course_summary: newsletter.course_summary,
        highlights: newsletter.highlights,
        fun_fact: newsletter.fun_fact,
        cta_text: newsletter.cta_text,
        emoji_block: newsletter.emoji_block,
        html_content: newsletter.html_content,
        web_content: newsletter.web_content,
        sent_at: newsletter.sent_at,
        created_at: newsletter.created_at
      }
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}
