import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { otp, path } = req.body;

  if (!otp || !/^\d{6}$/.test(otp)) {
    return res.status(400).json({ error: 'A valid 6-digit OTP is required.' });
  }

  try {
    // Atomically find and mark the OTP as used in a single operation to prevent race conditions
    const { data, error } = await supabase
      .from('otps')
      .update({ used: true })
      .eq('otp', otp)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .select()
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Invalid or expired OTP.' });
    }

    return res.status(200).json({ success: true, path });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ error: 'Unable to verify OTP. Please contact support@iiskills.cloud' });
  }
}
