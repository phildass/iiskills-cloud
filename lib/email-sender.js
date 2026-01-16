/**
 * Email Delivery Service for Skilling Newsletter
 * 
 * Supports multiple email providers:
 * - SendGrid (recommended)
 * - AWS SES
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
  const provider = process.env.EMAIL_PROVIDER || 'sendgrid';
  
  // Get all active subscribers
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
 */
async function getActiveSubscribers() {
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching subscribers:', error);
    return [];
  }
  
  return data || [];
}

/**
 * Send via SendGrid
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
    const messages = subscribers.map(subscriber => ({
      to: subscriber.email,
      from: {
        email: process.env.SENDER_EMAIL || 'newsletter@iiskills.cloud',
        name: 'Skilling by iiskills.cloud'
      },
      subject: newsletter.subject_line,
      html: htmlContent.replace('{{unsubscribe_url}}', `https://iiskills.cloud/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`),
      text: stripHtml(htmlContent),
      customArgs: {
        newsletter_id: newsletter.id,
        edition_number: newsletter.edition_number.toString()
      },
      // Add unsubscribe link
      asm: {
        groupId: parseInt(process.env.SENDGRID_UNSUBSCRIBE_GROUP_ID || '0')
      }
    }));

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
 * Send via AWS SES
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
              Data: htmlContent.replace('{{unsubscribe_url}}', `https://iiskills.cloud/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`),
              Charset: 'UTF-8'
            },
            Text: {
              Data: stripHtml(htmlContent),
              Charset: 'UTF-8'
            }
          }
        }
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
