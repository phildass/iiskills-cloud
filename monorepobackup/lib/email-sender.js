/**
 * Email Delivery Service for Skilling Newsletter
 * 
 * Uses SendGrid for email delivery with support for:
 * - Batch sending with rate limiting
 * - Individual unsubscribe links
 * - Email tracking and analytics
 * - Fallback to console logging for development
 */

/**
 * Send newsletter to all subscribers
 * 
 * @param {Object} newsletter - Newsletter edition data
 * @param {string} htmlContent - HTML email content
 * @returns {Promise<Object>} Send results
 */
export async function sendNewsletterToSubscribers(newsletter, htmlContent) {
  // Get all active subscribers from profiles with newsletter enabled
  const subscribers = await getActiveSubscribers();
  
  if (subscribers.length === 0) {
    return {
      success: true,
      sent_count: 0,
      message: 'No active subscribers found'
    };
  }

  // Use SendGrid for email delivery
  const results = await sendViaSendGrid(newsletter, htmlContent, subscribers);
  
  return results;
}

/**
 * Get all active newsletter subscribers
 * Fetches from profiles table where subscribed_to_newsletter = true
 * Also includes newsletter_subscribers table for backwards compatibility
 */
async function getActiveSubscribers() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  // Get subscribers from profiles table (primary source)
  const { data: profileSubscribers, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('subscribed_to_newsletter', true);
  
  if (profileError) {
    console.error('Error fetching profile subscribers:', profileError);
  }
  
  // Get subscribers from newsletter_subscribers table (backwards compatibility)
  const { data: legacySubscribers, error: legacyError } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'active');
  
  if (legacyError) {
    console.error('Error fetching legacy subscribers:', legacyError);
  }
  
  // Combine and deduplicate
  const allEmails = new Set();
  
  if (profileSubscribers) {
    profileSubscribers.forEach(s => s.email && allEmails.add(s.email.toLowerCase()));
  }
  
  if (legacySubscribers) {
    legacySubscribers.forEach(s => s.email && allEmails.add(s.email.toLowerCase()));
  }
  
  return Array.from(allEmails).map(email => ({ email }));
}

/**
 * Generate unsubscribe token for a user
 */
async function generateUnsubscribeToken(userId, email) {
  try {
    const response = await fetch('/api/newsletter/generate-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email })
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate unsubscribe token');
    }
    
    const data = await response.json();
    return data.unsubscribeUrl;
  } catch (error) {
    console.error('Error generating unsubscribe token:', error);
    // Fallback to simple email-based unsubscribe
    return `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iiskills.cloud'}/unsubscribe?email=${encodeURIComponent(email)}`;
  }
}

/**
 * Send via SendGrid (Primary Email Provider)
 */
async function sendViaSendGrid(newsletter, htmlContent, subscribers) {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('SendGrid API key not configured. Falling back to console logging.');
    return sendViaFallback(newsletter, htmlContent, subscribers);
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);

    // Prepare emails with individual unsubscribe links
    const messages = subscribers.map(subscriber => {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iiskills.cloud'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      
      return {
        to: subscriber.email,
        from: {
          email: process.env.SENDER_EMAIL || 'newsletter@iiskills.cloud',
          name: process.env.SENDER_NAME || 'Skilling by iiskills.cloud'
        },
        subject: newsletter.subject_line,
        html: htmlContent.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl),
        text: stripHtml(htmlContent),
        customArgs: {
          newsletter_id: newsletter.id,
          edition_number: newsletter.edition_number.toString()
        },
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
        },
        // Add unsubscribe group if configured
        ...(process.env.SENDGRID_UNSUBSCRIBE_GROUP_ID && {
          asm: {
            groupId: parseInt(process.env.SENDGRID_UNSUBSCRIBE_GROUP_ID)
          }
        })
      };
    });

    // Send in batches of 1000 to avoid rate limits
    const batchSize = 1000;
    const batches = [];
    for (let i = 0; i < messages.length; i += batchSize) {
      batches.push(messages.slice(i, i + batchSize));
    }

    for (const batch of batches) {
      await sgMail.send(batch);
    }
    
    return {
      success: true,
      sent_count: subscribers.length,
      provider: 'sendgrid',
    };
    
  } catch (error) {
    console.error('SendGrid error:', error);
    
    if (error.response) {
      console.error('SendGrid response:', error.response.body);
    }
    
    return {
      success: false,
      sent_count: 0,
      provider: 'sendgrid',
      error: error.message
    };
  }
}

/**
 * Fallback method (for development/testing)
 */
async function sendViaFallback(newsletter, htmlContent, subscribers) {
  console.log('\n========== NEWSLETTER WOULD BE SENT ==========');
  console.log('Subject:', newsletter.subject_line);
  console.log('Recipients:', subscribers.length);
  console.log('Subscriber emails:', subscribers.map(s => s.email).join(', '));
  console.log('\nHTML Preview (first 500 chars):');
  console.log(htmlContent.substring(0, 500) + '...');
  console.log('==============================================\n');
  
  // In development, we simulate successful sending
  return {
    success: true,
    sent_count: subscribers.length,
    provider: 'fallback-console',
    message: 'Newsletter logged to console (email provider not configured)'
  };
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html) {
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Send a single test email using SendGrid
 */
export async function sendTestEmail(newsletter, htmlContent, testEmail) {
  console.log(`Sending test email to ${testEmail} via SendGrid`);
  
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('SendGrid API key not configured. Using console fallback.');
    console.log('\n========== TEST EMAIL ==========');
    console.log('To:', testEmail);
    console.log('Subject:', newsletter.subject_line);
    console.log('\nHTML Content (first 500 chars):');
    console.log(htmlContent.substring(0, 500) + '...');
    console.log('================================\n');
    
    return {
      success: true,
      provider: 'test',
      message: 'Test email logged to console'
    };
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);

    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iiskills.cloud'}/unsubscribe?email=${encodeURIComponent(testEmail)}`;
    
    const message = {
      to: testEmail,
      from: {
        email: process.env.SENDER_EMAIL || 'newsletter@iiskills.cloud',
        name: process.env.SENDER_NAME || 'Skilling by iiskills.cloud'
      },
      subject: `[TEST] ${newsletter.subject_line}`,
      html: htmlContent.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl),
      text: stripHtml(htmlContent),
      customArgs: {
        newsletter_id: newsletter.id,
        edition_number: newsletter.edition_number.toString(),
        is_test: 'true'
      },
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
      }
    };

    await sgMail.send(message);
    
    return {
      success: true,
      provider: 'sendgrid',
      message: 'Test email sent successfully via SendGrid'
    };
  } catch (error) {
    console.error('SendGrid test email error:', error);
    
    return {
      success: false,
      provider: 'sendgrid',
      error: error.message
    };
  }
}

/**
 * Handle newsletter unsubscribe
 */
export async function handleUnsubscribe(email) {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('email', email.toLowerCase());
  
  if (error) {
    console.error('Unsubscribe error:', error);
    return { success: false, error: error.message };
  }
  
  return { success: true };
}
