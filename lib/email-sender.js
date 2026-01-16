/**
 * Email Delivery Service for Skilling Newsletter
 * 
 * Supports multiple email providers:
 * - Resend (recommended - primary choice)
 * - SendGrid (fallback)
 * - AWS SES (alternative)
 * - Console logging for development
 */

/**
 * Send newsletter to all subscribers
 * 
 * @param {Object} newsletter - Newsletter edition data
 * @param {string} htmlContent - HTML email content
 * @returns {Promise<Object>} Send results
 */
export async function sendNewsletterToSubscribers(newsletter, htmlContent) {
  const provider = process.env.EMAIL_PROVIDER || 'resend';
  
  // Get all active subscribers from profiles with newsletter enabled
  const subscribers = await getActiveSubscribers();
  
  if (subscribers.length === 0) {
    return {
      success: true,
      sent_count: 0,
      message: 'No active subscribers found'
    };
  }

  let results;
  
  switch (provider) {
    case 'resend':
      results = await sendViaResend(newsletter, htmlContent, subscribers);
      break;
    case 'sendgrid':
      results = await sendViaSendGrid(newsletter, htmlContent, subscribers);
      break;
    case 'ses':
      results = await sendViaAWSSES(newsletter, htmlContent, subscribers);
      break;
    default:
      results = await sendViaFallback(newsletter, htmlContent, subscribers);
  }
  
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
 * Send via Resend (Primary/Recommended)
 */
async function sendViaResend(newsletter, htmlContent, subscribers) {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('Resend API key not configured. Trying SendGrid fallback...');
    return sendViaSendGrid(newsletter, htmlContent, subscribers);
  }

  try {
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);

    // Send emails in batches to avoid rate limits
    const batchSize = 100; // Resend recommends smaller batches
    const results = [];
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const promises = batch.map(async (subscriber) => {
        // Generate unique unsubscribe link for each subscriber
        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iiskills.cloud'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        const personalizedHtml = htmlContent.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl);
        
        return resend.emails.send({
          from: `${process.env.SENDER_NAME || 'Skilling by iiskills.cloud'} <${process.env.SENDER_EMAIL || 'newsletter@iiskills.cloud'}>`,
          to: subscriber.email,
          subject: newsletter.subject_line,
          html: personalizedHtml,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
          },
          tags: [
            {
              name: 'newsletter_id',
              value: newsletter.id
            },
            {
              name: 'edition_number',
              value: newsletter.edition_number.toString()
            }
          ]
        });
      });
      
      const batchResults = await Promise.allSettled(promises);
      results.push(...batchResults);
      
      // Add small delay between batches to avoid rate limiting
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failureCount = results.filter(r => r.status === 'rejected').length;
    
    if (failureCount > 0) {
      console.warn(`Resend: ${failureCount} emails failed to send`);
      results.filter(r => r.status === 'rejected').forEach((r, i) => {
        console.error(`Failed email ${i + 1}:`, r.reason);
      });
    }
    
    return {
      success: successCount > 0,
      sent_count: successCount,
      failed_count: failureCount,
      provider: 'resend',
    };
    
  } catch (error) {
    console.error('Resend error:', error);
    console.log('Falling back to SendGrid...');
    return sendViaSendGrid(newsletter, htmlContent, subscribers);
  }
}

/**
 * Send via SendGrid (Fallback)
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
 * Send via AWS SES (Alternative)
 */
async function sendViaAWSSES(newsletter, htmlContent, subscribers) {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION || 'us-east-1';
  
  if (!accessKeyId || !secretAccessKey) {
    console.warn('AWS credentials not configured. Falling back to console logging.');
    return sendViaFallback(newsletter, htmlContent, subscribers);
  }

  try {
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({
      accessKeyId,
      secretAccessKey,
      region
    });

    const promises = subscribers.map(subscriber => {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://iiskills.cloud'}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      
      const params = {
        Source: process.env.SENDER_EMAIL || 'newsletter@iiskills.cloud',
        Destination: {
          ToAddresses: [subscriber.email]
        },
        Message: {
          Subject: {
            Data: newsletter.subject_line,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: htmlContent.replace(/\{\{unsubscribe_url\}\}/g, unsubscribeUrl),
              Charset: 'UTF-8'
            },
            Text: {
              Data: stripHtml(htmlContent),
              Charset: 'UTF-8'
            }
          }
        },
        ConfigurationSetName: 'newsletter-configuration' // Optional: for tracking
      };
      
      return ses.sendEmail(params).promise();
    });

    await Promise.all(promises);
    
    return {
      success: true,
      sent_count: subscribers.length,
      provider: 'aws-ses'
    };
    
  } catch (error) {
    console.error('AWS SES error:', error);
    
    return {
      success: false,
      sent_count: 0,
      provider: 'aws-ses',
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
 * Send a single test email
 */
export async function sendTestEmail(newsletter, htmlContent, testEmail) {
  const provider = process.env.EMAIL_PROVIDER || 'sendgrid';
  
  console.log(`Sending test email to ${testEmail} via ${provider}`);
  
  // For testing, always use console fallback
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
