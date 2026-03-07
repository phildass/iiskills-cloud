/**
 * Email Service
 *
 * Lightweight transactional email helpers used by payment-confirmation flows.
 * Sends thank-you emails via SendGrid when SENDGRID_API_KEY is configured;
 * otherwise logs a warning and returns false (no-op).
 *
 * Note: OTP-based email dispatch has been removed entirely.
 * All authentication now uses standard Supabase sign-in (magic link / password / Google OAuth).
 */

let sgMail = null;

function getSgMail() {
  if (!sgMail && process.env.SENDGRID_API_KEY) {
    // Lazy-load so builds without the package still succeed (package removed from
    // apps that no longer list it as a dependency).
    try {
      sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    } catch {
      // @sendgrid/mail not installed — email disabled
    }
  }
  return sgMail;
}

/**
 * Send a thank-you email to a user after a successful payment.
 *
 * Fire-and-forget — callers should `.catch()` the returned promise.
 *
 * @param {Object} params
 * @param {string} params.email                  - Recipient email
 * @param {string} params.appId                  - App/course identifier
 * @param {string} params.appName                - Human-readable app name
 * @param {string} [params.paymentTransactionId] - Payment ID for reference
 * @returns {Promise<boolean>} True if email sent successfully
 */
export async function sendThankYouEmail({ email, appId, appName, paymentTransactionId }) {
  const mailer = getSgMail();
  if (!mailer) {
    console.warn("[emailService] SendGrid not configured — skipping thank-you email");
    return false;
  }

  try {
    await mailer.send({
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
              Your course access has been activated — you can sign in now.
            </p>
            ${
              paymentTransactionId
                ? `<p style="color: #6b7280; font-size: 14px;">Payment reference: <code>${paymentTransactionId}</code></p>`
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
      text: `Thank you for your payment for ${appName}! Your course access has been activated. Sign in at iiskills.cloud. Payment reference: ${paymentTransactionId || "N/A"}.`,
    });

    console.log(
      `[emailService] Thank-you email sent to ${email} for app ${appId} (txn: ${paymentTransactionId})`
    );
    return true;
  } catch (error) {
    console.error("[emailService] Failed to send thank-you email:", error);
    return false;
  }
}

export default { sendThankYouEmail };
