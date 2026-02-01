import { generateAccessCode } from '../../../lib/accessCode';
import { insertData } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId, email, amount } = req.body;

    if (!transactionId || !email || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify payment (in production, verify with payment gateway)
    const paymentVerified = true; // Mock verification

    if (!paymentVerified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Generate access code
    const accessCode = generateAccessCode();

    // Store in database
    await insertData('registrations', {
      email,
      access_code: accessCode,
      transaction_id: transactionId,
      amount,
      status: 'active'
    });

    // Send email with access code (in production, use Resend API)
    if (process.env.RESEND_API_KEY) {
      // TODO: Implement Resend email
      console.log(`Sending access code ${accessCode} to ${email}`);
    }

    return res.status(200).json({
      success: true,
      access_code: accessCode,
      message: 'Registration confirmed! Check your email for access code.'
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
