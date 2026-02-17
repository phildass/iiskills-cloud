/**
 * Membership Email Service
 * 
 * This module handles sending membership confirmation emails with OTPs.
 * Uses SendGrid for email delivery.
 * 
 * Required environment variables:
 * - SENDGRID_API_KEY
 * - SENDER_EMAIL
 * - SENDER_NAME (optional)
 */

/**
 * Send membership confirmation email with OTP
 * 
 * @param {Object} params - Email parameters
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - User's name
 * @param {string} params.appId - Application ID
 * @param {string} params.appName - Application display name
 * @param {string} params.otp - One-time password
 * @param {string} params.orderId - Razorpay order ID
 * @param {number} params.amount - Payment amount
 * @returns {Promise<Object>} Send result
 */
export async function sendMembershipEmail({
  email,
  name,
  appId,
  appName,
  otp,
  orderId,
  amount,
}) {
  // Generate email HTML content
  const htmlContent = generateMembershipEmailHTML({
    name,
    appName,
    otp,
    orderId,
    amount,
  });

  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('SendGrid API key not configured. Email will not be sent.');
    console.log("\n========================================");
    console.log("📧 MEMBERSHIP EMAIL (Not Sent - No API Key)");
    console.log("========================================");
    console.log("To:", email);
    console.log("Subject: Membership Activated - Welcome to", appName);
    console.log("Order ID:", orderId);
    console.log("Amount: ₹", amount / 100);
    console.log("========================================\n");
    
    return {
      success: false,
      provider: "none",
      email,
      error: "SendGrid API key not configured",
    };
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);
    
    const result = await sgMail.send({
      to: email,
      from: {
        email: process.env.SENDER_EMAIL || 'info@iiskills.cloud',
        name: process.env.SENDER_NAME || 'iiskills'
      },
      subject: `Membership Activated - Welcome to ${appName}`,
      html: htmlContent,
      text: stripHtml(htmlContent),
      customArgs: {
        app_id: appId,
        order_id: orderId,
        email_type: 'membership_confirmation'
      }
    });
    
    return {
      success: true,
      provider: 'sendgrid',
      email,
      message_id: result[0]?.messageId || 'sent',
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('SendGrid error sending membership email:', error);
    
    return {
      success: false,
      provider: 'sendgrid',
      email,
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
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
 * Generate HTML content for membership email
 * @param {Object} params - Email template parameters
 * @returns {string} HTML email content
 */
function generateMembershipEmailHTML({ name, appName, otp, orderId, amount }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Membership Activated</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
          border-bottom: 2px solid #4F46E5;
        }
        .header h1 {
          color: #4F46E5;
          margin: 0;
          font-size: 28px;
        }
        .content {
          padding: 30px 0;
        }
        .otp-box {
          background-color: #F3F4F6;
          border: 2px dashed #4F46E5;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: bold;
          color: #4F46E5;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
        }
        .info-section {
          background-color: #F9FAFB;
          padding: 15px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #E5E7EB;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #6B7280;
        }
        .info-value {
          color: #111827;
        }
        .footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #E5E7EB;
          color: #6B7280;
          font-size: 14px;
        }
        .btn {
          display: inline-block;
          background-color: #4F46E5;
          color: white;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to ${appName}!</h1>
        </div>
        
        <div class="content">
          <p>Hi ${name || "there"},</p>
          
          <p>Congratulations! Your payment has been successfully processed and your membership is now active.</p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">YOUR VERIFICATION CODE</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #6B7280; font-size: 12px;">Valid for 30 minutes</p>
          </div>
          
          <p><strong>Important:</strong> Use this OTP to verify your account and activate your membership. This code will expire in 30 minutes.</p>
          
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Application:</span>
              <span class="info-value">${appName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order ID:</span>
              <span class="info-value">${orderId}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Amount Paid:</span>
              <span class="info-value">₹${(amount / 100).toFixed(2)}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Membership Duration:</span>
              <span class="info-value">1 Year</span>
            </div>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Return to the application</li>
            <li>Enter your OTP when prompted</li>
            <li>Start enjoying your premium membership!</li>
          </ol>
          
          <p>If you did not make this purchase or have any questions, please contact our support team immediately.</p>
        </div>
        
        <div class="footer">
          <p><strong>iiskills</strong><br>
          Empowering learning across domains</p>
          <p style="font-size: 12px; color: #9CA3AF;">
            This is an automated email. Please do not reply to this address.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Send OTP verification reminder email
 */
export async function sendOTPReminderEmail({ email, name, otp, appName }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.log("\n📧 OTP Reminder email not sent (SendGrid not configured):", email);
    console.log("OTP:", otp);
    console.log("App:", appName);
    
    return {
      success: false,
      provider: "none",
      type: "reminder",
      email,
      error: "SendGrid API key not configured"
    };
  }

  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>OTP Reminder</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #4F46E5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">OTP Reminder</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Hi ${name || "there"},</p>
            
            <p>This is a reminder to verify your OTP for ${appName}.</p>
            
            <div style="background-color: #F3F4F6; border: 2px dashed #4F46E5; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #6B7280; font-size: 14px;">YOUR VERIFICATION CODE</p>
              <div style="font-size: 36px; font-weight: bold; color: #4F46E5; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #6B7280; font-size: 12px;">Valid for 30 minutes</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
              Sent by iiskills.cloud<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </body>
      </html>
    `;
    
    await sgMail.send({
      to: email,
      from: {
        email: process.env.SENDER_EMAIL || 'info@iiskills.cloud',
        name: process.env.SENDER_NAME || 'iiskills'
      },
      subject: `OTP Reminder - ${appName}`,
      html: htmlContent,
      text: `Hi ${name || "there"},\n\nThis is a reminder to verify your OTP for ${appName}.\n\nYour OTP: ${otp}\n\nValid for 30 minutes.\n\niiskills.cloud`,
      customArgs: {
        email_type: 'otp_reminder',
        app_name: appName
      }
    });
    
    return {
      success: true,
      provider: "sendgrid",
      type: "reminder",
      email,
    };
  } catch (error) {
    console.error('SendGrid error sending OTP reminder:', error);
    
    return {
      success: false,
      provider: "sendgrid",
      type: "reminder",
      email,
      error: error.message
    };
  }
}
