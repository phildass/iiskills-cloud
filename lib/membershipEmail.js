/**
 * Membership Email Service
 * 
 * This module handles sending membership confirmation emails with OTPs.
 * Currently uses mock/placeholder logic for demonstration.
 * 
 * INTEGRATION NOTES FOR FUTURE:
 * Replace this mock implementation with real email service:
 * - Resend (recommended - see lib/email-sender.js for examples)
 * - SendGrid
 * - AWS SES
 * 
 * Required environment variables for production:
 * - EMAIL_PROVIDER (resend|sendgrid|ses)
 * - RESEND_API_KEY or SENDGRID_API_KEY or AWS credentials
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

  // ============================================
  // MOCK EMAIL SENDING - PLACEHOLDER ONLY
  // ============================================
  // In production, replace this section with actual email service
  
  console.log("\n========================================");
  console.log("📧 MOCK EMAIL SEND");
  console.log("========================================");
  console.log("To:", email);
  console.log("Subject: Membership Activated - Welcome to", appName);
  console.log("Order ID:", orderId);
  console.log("Amount: ₹", amount / 100);
  console.log("\n--- EMAIL CONTENT ---");
  console.log(htmlContent);
  console.log("\n========================================\n");

  // Simulate successful email send
  return {
    success: true,
    provider: "mock",
    email,
    message_id: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    timestamp: new Date().toISOString(),
    note: "MOCK: Email not actually sent. Replace with real email service for production.",
  };

  // ============================================
  // PRODUCTION IMPLEMENTATION EXAMPLE
  // ============================================
  // Uncomment and configure for production use:
  /*
  const provider = process.env.EMAIL_PROVIDER || 'resend';
  
  if (provider === 'resend') {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: 'iiskills <noreply@iiskills.cloud>',
      to: email,
      subject: `Membership Activated - Welcome to ${appName}`,
      html: htmlContent,
    });
    
    return {
      success: true,
      provider: 'resend',
      email,
      message_id: result.id,
      timestamp: new Date().toISOString(),
    };
  }
  
  // Add other providers (SendGrid, SES) as needed
  */
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
 * (Additional utility for future use)
 */
export async function sendOTPReminderEmail({ email, name, otp, appName }) {
  console.log("\n📧 MOCK: OTP Reminder email would be sent to:", email);
  console.log("OTP:", otp);
  console.log("App:", appName);
  
  return {
    success: true,
    provider: "mock",
    type: "reminder",
    email,
  };
}
