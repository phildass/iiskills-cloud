import sgMail from '@sendgrid/mail';
import { createClient } from '@supabase/supabase-js';
import twilio from 'twilio';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

  // Send OTP via SMS (Twilio)
  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (smsErr) {
    return res.status(500).json({ error: `Twilio error: ${smsErr.message}` });
  }

  return res.status(200).json({ message: "OTP sent via email and SMS!", otp }); // (remove otp in prod)
}