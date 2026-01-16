import { createClient } from "@supabase/supabase-js";
import { generateNewsletterContent, generateEmailHTML, generateWebHTML } from "../../../lib/ai-newsletter-generator";
import { sendNewsletterToSubscribers } from "../../../lib/email-sender";

/**
 * Newsletter Queue Processor API
 * 
 * Processes newsletter generation and sending tasks from the queue
 * Can be triggered manually or via cron job
 */

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get pending tasks from queue
    const { data: tasks, error: queueError } = await supabase
      .from('newsletter_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('attempts', 2) // Only process tasks with 2 or fewer attempts (will become 3 after increment)
      .order('created_at', { ascending: true })
      .limit(5); // Process 5 tasks at a time

    if (queueError) {
      throw queueError;
    }

    if (!tasks || tasks.length === 0) {
      return res.status(200).json({
        message: 'No pending tasks in queue',
        processed: 0
      });
    }

    const results = [];

    for (const task of tasks) {
      try {
        // Mark as processing
        await supabase
          .from('newsletter_queue')
          .update({ 
            status: 'processing',
            attempts: task.attempts + 1
          })
          .eq('id', task.id);

        let result;

        if (task.task_type === 'generate') {
          result = await processGenerateTask(task);
        } else if (task.task_type === 'send' || task.task_type === 'resend') {
          result = await processSendTask(task);
        }

        // Mark as completed
        await supabase
          .from('newsletter_queue')
          .update({
            status: 'completed',
            processed_at: new Date().toISOString(),
            metadata: result
          })
          .eq('id', task.id);

        results.push({
          task_id: task.id,
          task_type: task.task_type,
          status: 'completed',
          result
        });

      } catch (error) {
        console.error(`Task ${task.id} failed:`, error);

        // Mark as failed
        await supabase
          .from('newsletter_queue')
          .update({
            status: task.attempts + 1 >= 3 ? 'failed' : 'pending',
            error_message: error.message
          })
          .eq('id', task.id);

        results.push({
          task_id: task.id,
          task_type: task.task_type,
          status: 'failed',
          error: error.message
        });
      }
    }

    return res.status(200).json({
      message: 'Queue processing completed',
      processed: results.length,
      results
    });

  } catch (error) {
    console.error('Queue processing error:', error);
    return res.status(500).json({
      error: 'Failed to process queue',
      message: error.message
    });
  }
}

/**
 * Process newsletter generation task
 */
async function processGenerateTask(task) {
  // Fetch course data
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', task.course_id)
    .single();

  if (courseError || !course) {
    throw new Error('Course not found');
  }

  // Get next edition number
  const { data: lastEdition } = await supabase
    .from('newsletter_editions')
    .select('edition_number')
    .order('edition_number', { ascending: false })
    .limit(1)
    .single();

  const editionNumber = (lastEdition?.edition_number || 0) + 1;

  // Generate AI content
  const content = await generateNewsletterContent(course, editionNumber);

  // Generate HTML templates
  const emailHTML = generateEmailHTML(content, course);
  const webHTML = generateWebHTML(content, course, editionNumber);

  // Create newsletter edition
  const { data: newsletter, error: createError } = await supabase
    .from('newsletter_editions')
    .insert([{
      course_id: course.id,
      edition_number: editionNumber,
      title: content.title,
      subject_line: content.subject_line,
      intro_text: content.intro_text,
      course_summary: content.course_summary,
      highlights_section: content.highlights_section,
      cta_text: content.cta_text,
      fun_fact: content.fun_fact,
      emoji_block: content.emoji_block,
      html_content: emailHTML,
      web_content: webHTML,
      ai_metadata: content.ai_metadata,
      status: 'draft'
    }])
    .select()
    .single();

  if (createError) {
    throw createError;
  }

  // Queue sending task
  await supabase
    .from('newsletter_queue')
    .insert([{
      course_id: course.id,
      newsletter_id: newsletter.id,
      task_type: 'send',
      status: 'pending'
    }]);

  return {
    newsletter_id: newsletter.id,
    edition_number: editionNumber,
    title: content.title
  };
}

/**
 * Process newsletter sending task
 */
async function processSendTask(task) {
  // Fetch newsletter
  const { data: newsletter, error: newsletterError } = await supabase
    .from('newsletter_editions')
    .select('*')
    .eq('id', task.newsletter_id)
    .single();

  if (newsletterError || !newsletter) {
    throw new Error('Newsletter not found');
  }

  // Send to all subscribers
  const sendResult = await sendNewsletterToSubscribers(
    newsletter,
    newsletter.html_content
  );

  if (!sendResult.success) {
    throw new Error(sendResult.error || 'Failed to send newsletter');
  }

  // Update newsletter status
  await supabase
    .from('newsletter_editions')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString(),
      sent_count: sendResult.sent_count
    })
    .eq('id', newsletter.id);

  return {
    newsletter_id: newsletter.id,
    sent_count: sendResult.sent_count,
    provider: sendResult.provider
  };
}
