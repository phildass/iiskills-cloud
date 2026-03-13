/**
 * Payment Email Service
 *
 * Handles sending payment confirmation emails.
 * Uses SendGrid for email delivery.
 *
 * Required environment variables:
 * - SENDGRID_API_KEY
 * - SENDGRID_FROM_EMAIL (optional, defaults to info@iiskills.cloud)
 */

import sgMail from "@sendgrid/mail";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Send a thank-you confirmation email after successful payment.
 *
 * @param {Object} params
 * @param {string} params.email                  - Recipient email address
 * @param {string} params.appId                  - Application ID
 * @param {string} params.appName                - Human-readable app name
 * @param {string} params.paymentTransactionId   - Payment ID for reference
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendThankYouEmail({ email, appId, appName, paymentTransactionId }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("[paymentEmail] SendGrid not configured — skipping thank-you email");
    return false;
  }

  try {
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL || "info@iiskills.cloud",
      subject: `Thank you for your payment — Welcome to ${appName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">iiskills.cloud</h1>
          </div>
          <div style="background: #f9fafb; border-radius: 10px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">🙏 Thank you for your payment!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your payment for <strong>${appName}</strong> has been received successfully.
            </p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
              Your access has been activated. Please sign in to start learning.
            </p>
            ${
              paymentTransactionId
                ? `
            <p style="color: #6b7280; font-size: 14px;">
              Payment reference: <code>${paymentTransactionId}</code>
            </p>
            `
                : ""
            }
          </div>
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} iiskills.cloud - All rights reserved
            </p>
          </div>
        </div>
      `,
      text: `Thank you for your payment for ${appName}! Your access has been activated. Please sign in to start learning. Payment reference: ${paymentTransactionId || "N/A"}.`,
    });

    console.log(
      `[paymentEmail] Thank-you email sent to ${email} for app ${appId} (txn: ${paymentTransactionId})`
    );
    return true;
  } catch (error) {
    console.error("[paymentEmail] Failed to send thank-you email:", error);
    return false;
  }
}
