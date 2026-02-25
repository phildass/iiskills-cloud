import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import { Vonage } from '@vonage/server-sdk';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const vonageClient = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export default async function handler(req, res) {
  // Get user info from request body
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ error: "Email and phone are required!" });
  }

  // Generate random OTP
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

  // Save OTP to Supabase
  const { error: dbError } = await supabase
    .from('otps')
    .insert([{ email, phone, otp, expires_at: expiresAt }]);
  if (dbError) {
    return res.status(500).json({ error: `Supabase error: ${dbError.message}` });
  }

  // Send OTP via email (SendGrid)
  try {
    await sgMail.send({
      to: email,
      from: 'info@iiskills.cloud', // Verified sender
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}`,
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 10 minutes.</p>`
    });
  } catch (emailErr) {
    return res.status(500).json({ error: `SendGrid error: ${emailErr.message}` });
  }

  // Send OTP via SMS (Vonage)
  try {
    const response = await vonageClient.sms.send({
      to: phone,
      from: process.env.VONAGE_BRAND_NAME,
      text: `Your OTP is: ${otp}`,
    });
    
    // Validate Vonage response
    if (!response || !response.messages || response.messages.length === 0) {
      return res.status(500).json({ error: 'Vonage error: No response from SMS service' });
    }
    
    const message = response.messages[0];
    if (message.status !== '0') {
      return res.status(500).json({ error: `Vonage error: ${message['error-text'] || 'SMS delivery failed'}` });
    }
  } catch (smsErr) {
    return res.status(500).json({ error: `Vonage error: ${smsErr.message}` });
  }

  return res.status(200).json({ message: "OTP sent via email and SMS!", otp }); // (remove otp in prod)
}